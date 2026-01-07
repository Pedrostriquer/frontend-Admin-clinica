import React, { useState, useEffect } from 'react';
import { FileCheck, TrendingUp, Eye, Check, Save, ShieldCheck } from 'lucide-react';
import gemValueService from '../../../dbServices/gemValueService';
import { useNotification } from '../../../Context/NotificationContext';
import './ParametersManager.css';

const ParametersManager = () => {
    const { addNotification } = useNotification();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({});
    const [highlights, setHighlights] = useState([]);

    const sessionKeys = [
        'params_tag', 'params_title_part1', 'params_title_highlight',
        'params_body', 'params_complement', 'params_highlights_list'
    ];

    const staticIcons = [
        <FileCheck size={24} />, 
        <TrendingUp size={24} />, 
        <Eye size={24} />
    ];

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const allTexts = await gemValueService.getAllTexts();
            const filtered = allTexts.filter(item => sessionKeys.includes(item.sessionName));
            
            const dataMap = {};
            filtered.forEach(item => { dataMap[item.sessionName] = item; });
            setData(dataMap);

            const rawHighlights = dataMap['params_highlights_list']?.textContent || "";
            const parsedHighlights = rawHighlights.split('|').map(item => {
                const [label, text] = item.split('::');
                return { label: label?.trim() || "", text: text?.trim() || "" };
            });
            setHighlights(parsedHighlights);
        } catch (error) {
            addNotification('Erro ao carregar Parâmetros', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleTextChange = (key, value) => {
        setData(prev => ({ ...prev, [key]: { ...prev[key], textContent: value } }));
    };

    const handleHighlightChange = (index, field, value) => {
        const newHighlights = [...highlights];
        newHighlights[index][field] = value;
        setHighlights(newHighlights);
    };

    const saveAll = async () => {
        try {
            const promises = sessionKeys.map(key => {
                let content = data[key].textContent;
                if (key === 'params_highlights_list') {
                    content = highlights.map(h => `${h.label} :: ${h.text}`).join(' | ');
                }
                return gemValueService.updateText(data[key].id, key, content);
            });
            await Promise.all(promises);
            addNotification('Parâmetros técnicos atualizados!', 'success');
        } catch (error) {
            addNotification('Erro ao salvar', 'error');
        }
    };

    if (loading) return <div className="admin-loading">Carregando Parâmetros...</div>;

    return (
        <div className="params-editor-container">
            <header className="editor-top-bar">
                <div className="editor-info">
                    <ShieldCheck size={20} className="text-blue-500" />
                    <div>
                        <h2>Editor Visual: Parâmetros Técnicos</h2>
                        <p>Ajuste os pilares de previsibilidade e clareza do site.</p>
                    </div>
                </div>
                <button className="btn-primary-save" onClick={saveAll}>
                    <Save size={18} /> Publicar no Site
                </button>
            </header>

            <div className="params-editor-layout">
                {/* COLUNA ESQUERDA: CARDS (SQUARE) */}
                <aside className="params-cards-sidebar">
                    <div className="admin-section-label">Cards de Destaque (Highlights)</div>
                    <div className="params-cards-stack">
                        {highlights.map((item, index) => (
                            <div key={index} className="admin-param-card">
                                <div className="admin-param-icon">
                                    {staticIcons[index] || <Check size={24} />}
                                </div>
                                <input 
                                    className="admin-param-input-label"
                                    value={item.label}
                                    onChange={(e) => handleHighlightChange(index, 'label', e.target.value)}
                                    placeholder="Label do Card"
                                />
                                <textarea 
                                    className="admin-param-input-text"
                                    value={item.text}
                                    onChange={(e) => handleHighlightChange(index, 'text', e.target.value)}
                                    placeholder="Texto descritivo..."
                                    rows={3}
                                />
                            </div>
                        ))}
                    </div>
                </aside>

                {/* COLUNA DIREITA: CONTEÚDO AMPLO */}
                <main className="params-content-main">
                    <div className="admin-section-label">Textos da Seção</div>
                    
                    <div className="admin-field-box">
                        <label>Tag superior</label>
                        <input 
                            className="params-input-tag"
                            value={data['params_tag']?.textContent}
                            onChange={(e) => handleTextChange('params_tag', e.target.value)}
                        />
                    </div>

                    <div className="admin-field-box">
                        <label>Título (Parte 1)</label>
                        <input 
                            className="params-input-h2"
                            value={data['params_title_part1']?.textContent}
                            onChange={(e) => handleTextChange('params_title_part1', e.target.value)}
                        />
                    </div>

                    <div className="admin-field-box">
                        <label>Título Destaque (Com sublinhado no site)</label>
                        <input 
                            className="params-input-h2-highlight"
                            value={data['params_title_highlight']?.textContent}
                            onChange={(e) => handleTextChange('params_title_highlight', e.target.value)}
                        />
                    </div>

                    <div className="admin-field-box">
                        <label>Corpo do Texto</label>
                        <textarea 
                            className="params-input-body"
                            value={data['params_body']?.textContent}
                            onChange={(e) => handleTextChange('params_body', e.target.value)}
                            rows={8}
                        />
                    </div>

                    <div className="params-admin-divider"></div>

                    <div className="admin-field-box">
                        <label>Texto Complementar (Itálico)</label>
                        <textarea 
                            className="params-input-complement"
                            value={data['params_complement']?.textContent}
                            onChange={(e) => handleTextChange('params_complement', e.target.value)}
                            rows={4}
                        />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ParametersManager;