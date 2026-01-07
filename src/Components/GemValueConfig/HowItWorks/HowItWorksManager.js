import React, { useState, useEffect } from 'react';
import { 
  Gem, FileSignature, ShieldCheck, Vault, TrendingUp, 
  Gavel, MessageCircle, Check, Save, Eye, Smartphone 
} from 'lucide-react';
import gemValueService from '../../../dbServices/gemValueService';
import { useNotification } from '../../../Context/NotificationContext';
import './HowItWorksManager.css';

const HowItWorksManager = () => {
    const { addNotification } = useNotification();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({});
    const [steps, setSteps] = useState([]);

    const sessionKeys = [
        'how_it_works_tag', 'how_it_works_title', 'how_it_works_title_highlight',
        'how_it_works_steps_list', 'how_it_works_cta_text', 
        'how_it_works_whatsapp_number', 'how_it_works_whatsapp_message'
    ];

    const staticIcons = [
        <Gem size={24} />, <FileSignature size={24} />, <ShieldCheck size={24} />, 
        <Vault size={24} />, <TrendingUp size={24} />, <Gavel size={24} />
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

            const rawSteps = dataMap['how_it_works_steps_list']?.textContent || "";
            const parsedSteps = rawSteps.split('|').map((item, index) => {
                const [title, desc] = item.split('::');
                return { 
                    id: String(index + 1).padStart(2, '0'),
                    title: title?.trim() || "", 
                    desc: desc?.trim() || "" 
                };
            });
            setSteps(parsedSteps);
        } catch (error) {
            addNotification('Erro ao carregar Como Funciona', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleTextChange = (key, value) => {
        setData(prev => ({ ...prev, [key]: { ...prev[key], textContent: value } }));
    };

    const handleStepChange = (index, field, value) => {
        const newSteps = [...steps];
        newSteps[index][field] = value;
        setSteps(newSteps);
    };

    const saveAll = async () => {
        try {
            const promises = sessionKeys.map(key => {
                let content = data[key].textContent;
                if (key === 'how_it_works_steps_list') {
                    content = steps.map(s => `${s.title} :: ${s.desc}`).join(' | ');
                }
                return gemValueService.updateText(data[key].id, key, content);
            });
            await Promise.all(promises);
            addNotification('Fluxo operacional atualizado!', 'success');
        } catch (error) {
            addNotification('Erro ao salvar alterações', 'error');
        }
    };

    if (loading) return <div className="admin-loading">Configurando Fluxo de Processos...</div>;

    return (
        <div className="how-editor-container">
            <header className="editor-top-bar">
                <div className="editor-info">
                    <Eye size={20} className="text-blue-500" />
                    <div>
                        <h2>Editor Visual: Como Funciona</h2>
                        <p>Gerencie as etapas do processo GemCash e a chamada para ação.</p>
                    </div>
                </div>
                <button className="btn-primary-save" onClick={saveAll}>
                    <Save size={18} /> Publicar no Site
                </button>
            </header>

            <div className="how-editor-layout">
                {/* COLUNA ESQUERDA: EDITOR DE PASSOS */}
                <aside className="how-steps-editor">
                    <div className="admin-section-label">Etapas do Processo (Cards)</div>
                    <div className="how-steps-stack">
                        {steps.map((step, index) => (
                            <div key={index} className="admin-process-card">
                                <div className="admin-process-header">
                                    <div className="admin-process-icon">
                                        {staticIcons[index] || <Check size={20} />}
                                    </div>
                                    <span className="admin-process-id">{step.id}</span>
                                </div>
                                <input 
                                    className="admin-process-input-title"
                                    value={step.title}
                                    onChange={(e) => handleStepChange(index, 'title', e.target.value)}
                                    placeholder="Título da Etapa"
                                />
                                <textarea 
                                    className="admin-process-input-desc"
                                    value={step.desc}
                                    onChange={(e) => handleStepChange(index, 'desc', e.target.value)}
                                    placeholder="Descrição detalhada do processo..."
                                    rows={3}
                                />
                            </div>
                        ))}
                    </div>
                </aside>

                {/* COLUNA DIREITA: CONTEÚDO E PREVIEW */}
                <main className="how-content-main">
                    <div className="admin-section-label">Cabeçalho da Seção</div>
                    <div className="admin-field-box">
                        <label>Tag</label>
                        <input 
                            className="how-input-tag"
                            value={data['how_it_works_tag']?.textContent}
                            onChange={(e) => handleTextChange('how_it_works_tag', e.target.value)}
                        />
                    </div>
                    <div className="admin-field-box">
                        <label>Título</label>
                        <input 
                            className="how-input-h2"
                            value={data['how_it_works_title']?.textContent}
                            onChange={(e) => handleTextChange('how_it_works_title', e.target.value)}
                        />
                    </div>
                    <div className="admin-field-box">
                        <label>Destaque do Título (Gradiente)</label>
                        <input 
                            className="how-input-highlight"
                            value={data['how_it_works_title_highlight']?.textContent}
                            onChange={(e) => handleTextChange('how_it_works_title_highlight', e.target.value)}
                        />
                    </div>

                    <div className="admin-section-label" style={{marginTop: '40px'}}>Botão de Ação (CTA)</div>
                    <div className="how-cta-editor-box">
                        <div className="admin-field-box">
                            <label>Texto do Botão</label>
                            <div className="how-btn-preview-sim">
                                <MessageCircle size={18} />
                                <input 
                                    value={data['how_it_works_cta_text']?.textContent}
                                    onChange={(e) => handleTextChange('how_it_works_cta_text', e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="how-whatsapp-settings">
                            <div className="admin-field-box">
                                <label>Número WhatsApp</label>
                                <div className="wp-input-row">
                                    <Smartphone size={16} />
                                    <input 
                                        value={data['how_it_works_whatsapp_number']?.textContent}
                                        onChange={(e) => handleTextChange('how_it_works_whatsapp_number', e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="admin-field-box">
                                <label>Mensagem Automática</label>
                                <textarea 
                                    value={data['how_it_works_whatsapp_message']?.textContent}
                                    onChange={(e) => handleTextChange('how_it_works_whatsapp_message', e.target.value)}
                                    rows={3}
                                />
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default HowItWorksManager;