import React, { useState, useEffect } from 'react';
import { Award, Diamond, Globe2, Scale, ShieldCheck, Check, Save, Eye } from 'lucide-react';
import gemValueService from '../../../dbServices/gemValueService';
import { useNotification } from '../../../Context/NotificationContext';
import './WhyDiamondsManager.css';

const WhyDiamondsManager = () => {
    const { addNotification } = useNotification();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({});
    const [features, setFeatures] = useState([]);

    const sessionKeys = [
        'why_diamonds_tag', 
        'why_diamonds_title', 
        'why_diamonds_highlight', 
        'why_diamonds_body', 
        'why_diamonds_custody_info', 
        'why_diamonds_features_list'
    ];

    const staticIcons = [
        <Award size={26} />, 
        <Diamond size={26} />, 
        <Globe2 size={26} />, 
        <Scale size={26} />
    ];

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const allTexts = await gemValueService.getAllTexts();
            const filtered = allTexts.filter(item => sessionKeys.includes(item.sessionName));
            
            const dataMap = {};
            filtered.forEach(item => {
                dataMap[item.sessionName] = item;
            });
            setData(dataMap);

            // Parse da lista de cards (features) usando os delimitadores :: e |
            const rawFeatures = dataMap['why_diamonds_features_list']?.textContent || "";
            const parsedFeatures = rawFeatures.split('|').map(item => {
                const [title, desc] = item.split('::');
                return { title: title?.trim() || "", desc: desc?.trim() || "" };
            });
            setFeatures(parsedFeatures);
        } catch (error) {
            addNotification('Erro ao carregar dados do servidor', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleTextChange = (key, value) => {
        setData(prev => ({
            ...prev,
            [key]: { ...prev[key], textContent: value }
        }));
    };

    const handleFeatureChange = (index, field, value) => {
        const newFeatures = [...features];
        newFeatures[index][field] = value;
        setFeatures(newFeatures);
    };

    const saveAll = async () => {
        try {
            const promises = sessionKeys.map(key => {
                let content = data[key].textContent;
                
                // Se for a lista de cards, reconstrói a string com os delimitadores
                if (key === 'why_diamonds_features_list') {
                    content = features.map(f => `${f.title} :: ${f.desc}`).join(' | ');
                }
                
                return gemValueService.updateText(data[key].id, key, content);
            });

            await Promise.all(promises);
            addNotification('Todas as alterações foram publicadas com sucesso!', 'success');
        } catch (error) {
            addNotification('Erro ao salvar algumas secções. Verifique a ligação.', 'error');
        }
    };

    if (loading) return <div className="admin-loading">A sincronizar com o site...</div>;

    return (
        <div className="visual-editor-container">
            <header className="editor-top-bar">
                <div className="editor-info">
                    <Eye size={20} className="text-blue-500" />
                    <div>
                        <h2>Modo de Edição Visual</h2>
                        <p>Secção: <strong>Por que Diamantes</strong></p>
                    </div>
                </div>
                <button className="btn-primary-save" onClick={saveAll}>
                    <Save size={18} /> Publicar no Site
                </button>
            </header>

            <div className="editor-main-layout">
                {/* COLUNA ESQUERDA: CARDS EMPILHADOS (SQUARE) */}
                <aside className="editor-cards-sidebar">
                    <div className="admin-section-label">Cards de Benefícios (Site)</div>
                    <div className="admin-cards-vertical-stack">
                        {features.map((item, index) => (
                            <div key={index} className="admin-wd-card-square">
                                <div className="admin-wd-card-icon">
                                    {staticIcons[index] || <Check size={24} />}
                                </div>
                                <input 
                                    className="admin-wd-input-title"
                                    value={item.title}
                                    onChange={(e) => handleFeatureChange(index, 'title', e.target.value)}
                                    placeholder="Título do Card"
                                />
                                <textarea 
                                    className="admin-wd-input-desc"
                                    value={item.desc}
                                    onChange={(e) => handleFeatureChange(index, 'desc', e.target.value)}
                                    placeholder="Descrição curta..."
                                    rows={3}
                                />
                            </div>
                        ))}
                    </div>
                </aside>

                {/* COLUNA DIREITA: CONTEÚDO AMPLO */}
                <main className="editor-content-main">
                    <div className="admin-section-label">Conteúdo de Texto</div>
                    
                    <div className="admin-field-box">
                        <label>Tag Superior (Label Blue)</label>
                        <input 
                            className="admin-wd-tag"
                            value={data['why_diamonds_tag']?.textContent}
                            onChange={(e) => handleTextChange('why_diamonds_tag', e.target.value)}
                        />
                    </div>

                    <div className="admin-field-box">
                        <label>Título Principal (H2)</label>
                        <textarea 
                            className="admin-wd-h2"
                            value={data['why_diamonds_title']?.textContent}
                            onChange={(e) => handleTextChange('why_diamonds_title', e.target.value)}
                            rows={3}
                        />
                    </div>

                    <div className="admin-field-box">
                        <label>Destaque / Citação (Highlight)</label>
                        <textarea 
                            className="admin-wd-highlight-large"
                            value={data['why_diamonds_highlight']?.textContent}
                            onChange={(e) => handleTextChange('why_diamonds_highlight', e.target.value)}
                            rows={8}
                            placeholder="Este texto aparece com a barra lateral azul no site..."
                        />
                    </div>

                    <div className="admin-field-box">
                        <label>Texto de Apoio (Body)</label>
                        <textarea 
                            className="admin-wd-body"
                            value={data['why_diamonds_body']?.textContent}
                            onChange={(e) => handleTextChange('why_diamonds_body', e.target.value)}
                            rows={10}
                        />
                    </div>

                    <div className="admin-field-box">
                        <label>Informação de Custódia (Rodapé da secção)</label>
                        <div className="admin-wd-custodia-wrapper">
                            <ShieldCheck size={20} className="text-blue-600" />
                            <input 
                                className="admin-wd-input-custodia"
                                value={data['why_diamonds_custody_info']?.textContent}
                                onChange={(e) => handleTextChange('why_diamonds_custody_info', e.target.value)}
                            />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default WhyDiamondsManager;