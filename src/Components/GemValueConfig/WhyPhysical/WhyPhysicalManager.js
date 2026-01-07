import React, { useState, useEffect } from 'react';
import { 
    Gem, TrendingDown, Landmark, FileKey, Sprout, 
    ArrowRight, ShieldCheck, Check, Save, Eye, Smartphone 
} from 'lucide-react';
import gemValueService from '../../../dbServices/gemValueService';
import { useNotification } from '../../../Context/NotificationContext';
import './WhyPhysicalManager.css';

const WhyPhysicalManager = () => {
    const { addNotification } = useNotification();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({});
    const [features, setFeatures] = useState([]);

    const sessionKeys = [
        'why_physical_tag', 'why_physical_title', 'why_physical_highlight',
        'why_physical_body', 'why_physical_cta_text', 'why_physical_whatsapp_number',
        'why_physical_whatsapp_message', 'why_physical_features_list'
    ];

    const staticIcons = [
        <Gem size={24} />, <TrendingDown size={24} />, 
        <Landmark size={24} />, <FileKey size={24} />, <Sprout size={24} />
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

            const rawFeatures = dataMap['why_physical_features_list']?.textContent || "";
            const parsedFeatures = rawFeatures.split('|').map(item => {
                const [title, desc] = item.split('::');
                return { title: title?.trim() || "", desc: desc?.trim() || "" };
            });
            setFeatures(parsedFeatures);
        } catch (error) {
            addNotification('Erro ao carregar Ativos Físicos', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleTextChange = (key, value) => {
        setData(prev => ({ ...prev, [key]: { ...prev[key], textContent: value } }));
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
                if (key === 'why_physical_features_list') {
                    content = features.map(f => `${f.title} :: ${f.desc}`).join(' | ');
                }
                return gemValueService.updateText(data[key].id, key, content);
            });
            await Promise.all(promises);
            addNotification('Seção de Ativos Físicos atualizada!', 'success');
        } catch (error) {
            addNotification('Erro ao salvar', 'error');
        }
    };

    if (loading) return <div className="admin-loading">Carregando Ativos Físicos...</div>;

    return (
        <div className="phys-editor-container">
            <header className="editor-top-bar">
                <div className="editor-info">
                    <Eye size={20} className="text-blue-500" />
                    <div>
                        <h2>Editor Visual: Ativos Físicos</h2>
                        <p>Edite os cards e os textos da seção de modelo operacional.</p>
                    </div>
                </div>
                <button className="btn-primary-save" onClick={saveAll}>
                    <Save size={18} /> Publicar no Site
                </button>
            </header>

            <div className="phys-editor-layout">
                {/* COLUNA ESQUERDA: TEXTOS (Fiel ao Sticky do site) */}
                <div className="phys-text-editor">
                    <div className="admin-section-label">Conteúdo Principal</div>
                    
                    <div className="admin-field-box">
                        <label>Tag</label>
                        <input 
                            className="phys-input-tag"
                            value={data['why_physical_tag']?.textContent}
                            onChange={(e) => handleTextChange('why_physical_tag', e.target.value)}
                        />
                    </div>

                    <div className="admin-field-box">
                        <label>Título da Seção</label>
                        <textarea 
                            className="phys-input-h2"
                            value={data['why_physical_title']?.textContent}
                            onChange={(e) => handleTextChange('why_physical_title', e.target.value)}
                            rows={3}
                        />
                    </div>

                    <div className="admin-field-box">
                        <label>Destaque (Highlight)</label>
                        <textarea 
                            className="phys-input-highlight"
                            value={data['why_physical_highlight']?.textContent}
                            onChange={(e) => handleTextChange('why_physical_highlight', e.target.value)}
                            rows={4}
                        />
                    </div>

                    <div className="admin-field-box">
                        <label>Corpo do Texto</label>
                        <textarea 
                            className="phys-input-body"
                            value={data['why_physical_body']?.textContent}
                            onChange={(e) => handleTextChange('why_physical_body', e.target.value)}
                            rows={6}
                        />
                    </div>

                    <div className="admin-section-label" style={{marginTop: '30px'}}>Chamada para Ação (CTA)</div>
                    
                    <div className="admin-field-box">
                        <label>Texto do Link</label>
                        <div className="phys-cta-preview-row">
                            <input 
                                className="phys-input-cta"
                                value={data['why_physical_cta_text']?.textContent}
                                onChange={(e) => handleTextChange('why_physical_cta_text', e.target.value)}
                            />
                            <ArrowRight size={20} className="text-blue-600" />
                        </div>
                    </div>

                    <div className="admin-field-box">
                        <label>WhatsApp (Número e Mensagem)</label>
                        <div className="phys-whatsapp-config">
                            <div className="phys-wp-field">
                                <Smartphone size={16} />
                                <input 
                                    value={data['why_physical_whatsapp_number']?.textContent}
                                    onChange={(e) => handleTextChange('why_physical_whatsapp_number', e.target.value)}
                                    placeholder="55..."
                                />
                            </div>
                            <textarea 
                                value={data['why_physical_whatsapp_message']?.textContent}
                                onChange={(e) => handleTextChange('why_physical_whatsapp_message', e.target.value)}
                                placeholder="Mensagem automática..."
                                rows={3}
                            />
                        </div>
                    </div>
                </div>

                {/* COLUNA DIREITA: CARDS (Empilhados) */}
                <div className="phys-cards-editor">
                    <div className="admin-section-label">Cards Operacionais</div>
                    <div className="phys-cards-stack">
                        {features.map((item, index) => (
                            <div key={index} className="admin-phys-card">
                                <div className="admin-phys-icon">
                                    {staticIcons[index] || <Check size={24} />}
                                </div>
                                <div className="admin-phys-inputs">
                                    <input 
                                        className="admin-phys-title"
                                        value={item.title}
                                        onChange={(e) => handleFeatureChange(index, 'title', e.target.value)}
                                        placeholder="Título do card"
                                    />
                                    <textarea 
                                        className="admin-phys-desc"
                                        value={item.desc}
                                        onChange={(e) => handleFeatureChange(index, 'desc', e.target.value)}
                                        placeholder="Descrição"
                                        rows={3}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WhyPhysicalManager;