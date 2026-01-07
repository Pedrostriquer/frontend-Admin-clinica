import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, Info, Save, Eye, Plus, Trash2, 
  ShieldCheck, FileText, Building2, Check 
} from 'lucide-react';
import gemValueService from '../../../dbServices/gemValueService';
import { useNotification } from '../../../Context/NotificationContext';
import './HeroManager.css';

const HeroManager = () => {
    const { addNotification } = useNotification();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({});
    const [proofs, setProofs] = useState([]);

    const sessionKeys = [
        'hero_title', 'hero_description', 'hero_info_text', 'hero_micro_proofs'
    ];

    const proofIcons = [<ShieldCheck size={18} />, <FileText size={18} />, <Building2 size={18} />];

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const allTexts = await gemValueService.getAllTexts();
            const filtered = allTexts.filter(item => sessionKeys.includes(item.sessionName));
            
            const dataMap = {};
            filtered.forEach(item => { dataMap[item.sessionName] = item; });
            setData(dataMap);

            // Parse das Micro Proofs (separa por |)
            const rawProofs = dataMap['hero_micro_proofs']?.textContent || "";
            const parsedProofs = rawProofs !== "HIDDEN" ? rawProofs.split('|').map(p => p.trim()) : [];
            setProofs(parsedProofs);
        } catch (error) {
            addNotification('Erro ao carregar dados do Hero', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleTextChange = (key, value) => {
        setData(prev => ({ ...prev, [key]: { ...prev[key], textContent: value } }));
    };

    // Lógica para gerenciar Micro Proofs individualmente
    const handleProofChange = (index, value) => {
        const newProofs = [...proofs];
        newProofs[index] = value;
        setProofs(newProofs);
    };

    const addProof = () => {
        if (proofs.length < 3) setProofs([...proofs, ""]);
    };

    const removeProof = (index) => {
        setProofs(proofs.filter((_, i) => i !== index));
    };

    const saveAll = async () => {
        try {
            const promises = sessionKeys.map(key => {
                let content = data[key].textContent;
                
                if (key === 'hero_micro_proofs') {
                    content = proofs.length > 0 ? proofs.join(' | ') : "HIDDEN";
                }
                
                return gemValueService.updateText(data[key].id, key, content);
            });

            await Promise.all(promises);
            addNotification('Conteúdo do Hero atualizado!', 'success');
        } catch (error) {
            addNotification('Erro ao salvar', 'error');
        }
    };

    if (loading) return <div className="admin-loading">Preparando Estúdio de Edição...</div>;

    return (
        <div className="hero-editor-container">
            <header className="editor-top-bar">
                <div className="editor-info">
                    <Eye size={20} className="text-blue-500" />
                    <div>
                        <h2>Editor Visual: Hero Section</h2>
                        <p>Configure a porta de entrada do seu site.</p>
                    </div>
                </div>
                <button className="btn-primary-save" onClick={saveAll}>
                    <Save size={18} /> Publicar Alterações
                </button>
            </header>

            <div className="hero-editor-layout">
                {/* COLUNA ESQUERDA: CAMPOS DE TEXTO */}
                <div className="hero-editor-form">
                    <div className="admin-section-label">Mensagem Principal</div>
                    
                    <div className="admin-field-box">
                        <label>Título de Impacto (H1)</label>
                        <textarea 
                            className="hero-input-h1"
                            value={data['hero_title']?.textContent}
                            onChange={(e) => handleTextChange('hero_title', e.target.value)}
                            rows={3}
                        />
                    </div>

                    <div className="admin-field-box">
                        <label>Descrição Auxiliar</label>
                        <textarea 
                            className="hero-input-desc"
                            value={data['hero_description']?.textContent}
                            onChange={(e) => handleTextChange('hero_description', e.target.value)}
                            rows={4}
                        />
                    </div>

                    <div className="admin-field-box">
                        <label>Texto Informativo (Info Bar)</label>
                        <div className="hero-input-info-wrapper">
                            <Info size={18} className="text-emerald-400" />
                            <input 
                                className="hero-input-info"
                                value={data['hero_info_text']?.textContent}
                                onChange={(e) => handleTextChange('hero_info_text', e.target.value)}
                            />
                        </div>
                    </div>

                    {/* GERENCIADOR DE MICRO PROOFS */}
                    <div className="admin-section-label" style={{ marginTop: '30px' }}>
                        Micro Provas (Vantagens Rápidas)
                    </div>
                    <div className="hero-proofs-manager">
                        {proofs.map((text, index) => (
                            <div key={index} className="proof-input-item">
                                <div className="proof-icon-preview">
                                    {proofIcons[index] || <Check size={16} />}
                                </div>
                                <input 
                                    value={text}
                                    onChange={(e) => handleProofChange(index, e.target.value)}
                                    placeholder={`Prova #${index + 1}`}
                                />
                                <button className="btn-remove-proof" onClick={() => removeProof(index)}>
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                        {proofs.length < 3 && (
                            <button className="btn-add-proof" onClick={addProof}>
                                <Plus size={16} /> Adicionar Prova
                            </button>
                        )}
                    </div>
                </div>

                {/* COLUNA DIREITA: PREVIEW VISUAL (DARK MODE SITE) */}
                <div className="hero-editor-preview">
                    <div className="admin-section-label">Live Preview (Estilo do Site)</div>
                    <div className="hero-preview-box">
                        <div className="preview-navbar">
                             <div className="preview-logo">GemValue</div>
                        </div>
                        
                        <div className="preview-content">
                            <h1 className="preview-h1">{data['hero_title']?.textContent}</h1>
                            <p className="preview-p">{data['hero_description']?.textContent}</p>
                            
                            <div className="preview-info">
                                <Info size={14} /> {data['hero_info_text']?.textContent}
                            </div>

                            <button className="preview-btn">
                                Simular estratégia <ArrowRight size={16} />
                            </button>

                            <div className="preview-proofs">
                                {proofs.map((p, i) => (
                                    <div key={i} className="preview-proof-item">
                                        <div className="p-icon">{proofIcons[i] || <Check size={12} />}</div>
                                        <span>{p}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroManager;