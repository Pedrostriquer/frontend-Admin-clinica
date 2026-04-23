import React, { useState, useEffect } from 'react';
import {
  Info, Save, Eye, Plus, Trash2,
  ShieldCheck, FileText, Building2, Check
} from 'lucide-react';
import gemValueService from '../../../dbServices/gemValueService';
import './HeroManager.css';

const HeroManager = () => {
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [data, setData] = useState({});
    const [originalData, setOriginalData] = useState({});
    const [proofs, setProofs] = useState([]);
    const [originalProofs, setOriginalProofs] = useState([]);

    const sessionKeys = [
        'hero_title', 'hero_description', 'hero_info_text', 'hero_micro_proofs',
        'hero_button_text', 'hero_button_whatsapp_number', 'hero_button_message'
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
            setOriginalData(JSON.parse(JSON.stringify(dataMap)));

            // Parse das Micro Proofs (separa por |)
            const rawProofs = dataMap['hero_micro_proofs']?.textContent || "";
            const parsedProofs = rawProofs !== "HIDDEN" ? rawProofs.split('|').map(p => p.trim()) : [];
            setProofs(parsedProofs);
            setOriginalProofs([...parsedProofs]);
        } catch (error) {
            alert('❌ Erro ao carregar dados do Hero');
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

    const hasChanges = () => {
        // Verifica se proofs mudou
        if (proofs.length !== originalProofs.length) return true;
        if (proofs.some((p, i) => p !== originalProofs[i])) return true;

        // Verifica se data mudou
        for (let key of sessionKeys) {
            if ((data[key]?.textContent || '') !== (originalData[key]?.textContent || '')) {
                return true;
            }
        }

        return false;
    };

    const saveAll = async () => {
        try {
            setIsSaving(true);
            const promises = sessionKeys.map(async (key) => {
                let content = data[key]?.textContent || '';

                if (key === 'hero_micro_proofs') {
                    content = proofs.length > 0 ? proofs.join(' | ') : "HIDDEN";
                }

                // Se o conteúdo está vazio, não tentar salvar
                if (!content || content.trim() === '') {
                    return Promise.resolve();
                }

                // Se existe ID, atualizar
                if (data[key]?.id) {
                    return gemValueService.updateText(data[key].id, key, content);
                }

                // Se não existe, tentar criar
                try {
                    const newRecord = await gemValueService.createText(key, content);
                    setData(prev => ({ ...prev, [key]: newRecord }));
                    return newRecord;
                } catch (createError) {
                    // Se já existe, recarregar dados e tentar update
                    await loadData();
                    // Tentar update novamente com os dados atualizados
                    const updatedData = await gemValueService.getAllTexts();
                    const existingRecord = updatedData.find(item => item.sessionName === key);
                    if (existingRecord) {
                        return gemValueService.updateText(existingRecord.id, key, content);
                    }
                    throw createError;
                }
            });

            await Promise.all(promises);
            alert('✅ Conteúdo do Hero atualizado com sucesso!');
            setTimeout(() => loadData(), 500);
        } catch (error) {
            alert('❌ Erro ao salvar alterações');
            console.error('Erro detalhado:', error);
        } finally {
            setIsSaving(false);
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
                {hasChanges() && (
                    <button
                        className="btn-primary-save"
                        onClick={saveAll}
                        disabled={isSaving}
                    >
                        {isSaving ? (
                            <>
                                <span className="spinner"></span> Salvando...
                            </>
                        ) : (
                            <>
                                <Save size={18} /> Publicar Alterações
                            </>
                        )}
                    </button>
                )}
            </header>

            <div className="hero-editor-layout">
                {/* COLUNA 1: CONTEÚDO PRINCIPAL */}
                <div className="hero-editor-card">
                    <div className="card-header">
                        <div className="card-header-icon">📝</div>
                        <div>
                            <h3>Conteúdo Principal</h3>
                            <p>Título, descrição e informações</p>
                        </div>
                    </div>

                    <div className="admin-section-label">Textos da Seção</div>

                    <div className="admin-field-box">
                        <label>Título de Impacto (H1)</label>
                        <textarea
                            className="hero-input-h1"
                            value={data['hero_title']?.textContent}
                            onChange={(e) => handleTextChange('hero_title', e.target.value)}
                            rows={3}
                            placeholder="Seu título principal aqui..."
                        />
                    </div>

                    <div className="admin-field-box">
                        <label>Descrição Auxiliar</label>
                        <textarea
                            className="hero-input-desc"
                            value={data['hero_description']?.textContent}
                            onChange={(e) => handleTextChange('hero_description', e.target.value)}
                            rows={4}
                            placeholder="Descrição atrativa para seus visitantes..."
                        />
                    </div>

                    <div className="admin-field-box">
                        <label>Texto Informativo (Info Bar)</label>
                        <div className="hero-input-info-wrapper">
                            <Info size={18} />
                            <input
                                className="hero-input-info"
                                value={data['hero_info_text']?.textContent}
                                onChange={(e) => handleTextChange('hero_info_text', e.target.value)}
                                placeholder="Ex: Seguro e confiável"
                            />
                        </div>
                    </div>
                </div>

                {/* COLUNA 2: CONFIGURAÇÃO DO BOTÃO */}
                <div className="hero-editor-card">
                    <div className="card-header">
                        <div className="card-header-icon">🔘</div>
                        <div>
                            <h3>Botão Principal</h3>
                            <p>Texto e redirecionamento</p>
                        </div>
                    </div>

                    <div className="admin-section-label">Personalização do Botão</div>

                    <div className="admin-field-box">
                        <label>Texto do Botão</label>
                        <input
                            className="hero-input-text"
                            value={data['hero_button_text']?.textContent || ''}
                            onChange={(e) => handleTextChange('hero_button_text', e.target.value)}
                            placeholder="Ex: Fale com um especialista"
                        />
                    </div>

                    <div className="admin-section-label" style={{ marginTop: '30px' }}>Integração WhatsApp</div>

                    <div className="admin-field-box">
                        <label>Número WhatsApp</label>
                        <input
                            className="hero-input-text"
                            value={data['hero_button_whatsapp_number']?.textContent || ''}
                            onChange={(e) => handleTextChange('hero_button_whatsapp_number', e.target.value)}
                            placeholder="Ex: 558000004938"
                        />
                        <small style={{ color: '#64748b', marginTop: '6px', display: 'block' }}>
                            Apenas números, sem caracteres especiais
                        </small>
                    </div>

                    <div className="admin-field-box">
                        <label>Mensagem WhatsApp</label>
                        <textarea
                            className="hero-input-desc"
                            value={data['hero_button_message']?.textContent || ''}
                            onChange={(e) => handleTextChange('hero_button_message', e.target.value)}
                            rows={3}
                            placeholder="Mensagem padrão ao abrir WhatsApp..."
                        />
                    </div>
                </div>

                {/* COLUNA 3: MICRO PROVAS */}
                <div className="hero-editor-card">
                    <div className="card-header">
                        <div className="card-header-icon">⭐</div>
                        <div>
                            <h3>Micro Provas</h3>
                            <p>Vantagens rápidas (até 3)</p>
                        </div>
                    </div>

                    <div className="admin-section-label">Gerenciar Provas</div>

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

                    <div style={{ marginTop: '20px', padding: '14px', background: '#f0f4f8', borderRadius: '10px', fontSize: '0.85rem', color: '#64748b' }}>
                        <strong>Dica:</strong> As provas são exibidas abaixo do botão principal com ícones e texto.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroManager;