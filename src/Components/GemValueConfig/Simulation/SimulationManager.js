import React, { useState, useEffect } from 'react';
import { 
    DollarSign, Calendar, Check, BarChart3, 
    Save, Eye, Calculator, Smartphone, MessageCircle 
} from 'lucide-react';
import gemValueService from '../../../dbServices/gemValueService';
import { useNotification } from '../../../Context/NotificationContext';
import './SimulationManager.css';

const SimulationManager = () => {
    const { addNotification } = useNotification();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({});
    const [cardLabels, setCardLabels] = useState({});

    const sessionKeys = ['sim_section_title', 'sim_section_desc', 'sim_card_content'];

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const allTexts = await gemValueService.getAllTexts();
            const filtered = allTexts.filter(item => sessionKeys.includes(item.sessionName));
            
            const dataMap = {};
            filtered.forEach(item => { dataMap[item.sessionName] = item; });
            setData(dataMap);

            // Parse do conteúdo agrupado do card (key :: value | ...)
            const rawContent = dataMap['sim_card_content']?.textContent || "";
            const labels = rawContent.split('|').reduce((acc, item) => {
                const [key, value] = item.split('::');
                if (key && value) acc[key.trim()] = value.trim();
                return acc;
            }, {});
            setCardLabels(labels);
        } catch (error) {
            addNotification('Erro ao carregar Simulação', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleTextChange = (key, value) => {
        setData(prev => ({ ...prev, [key]: { ...prev[key], textContent: value } }));
    };

    const handleLabelChange = (key, value) => {
        setCardLabels(prev => ({ ...prev, [key]: value }));
    };

    const saveAll = async () => {
        try {
            const promises = sessionKeys.map(key => {
                let content = data[key].textContent;
                if (key === 'sim_card_content') {
                    // Remonta a string do dicionário
                    content = Object.entries(cardLabels)
                        .map(([k, v]) => `${k} :: ${v}`)
                        .join(' | ');
                }
                return gemValueService.updateText(data[key].id, key, content);
            });
            await Promise.all(promises);
            addNotification('Simulador atualizado com sucesso!', 'success');
        } catch (error) {
            addNotification('Erro ao salvar', 'error');
        }
    };

    if (loading) return <div className="admin-loading">Carregando Simulador...</div>;

    // Helper para o Preview
    const titleParts = (data['sim_section_title']?.textContent || "").split('|');

    return (
        <div className="sim-editor-container">
            <header className="editor-top-bar">
                <div className="editor-info">
                    <Calculator size={20} className="text-blue-500" />
                    <div>
                        <h2>Editor Visual: Simulador de Estratégia</h2>
                        <p>Edite os textos da seção e os rótulos internos do card de cálculo.</p>
                    </div>
                </div>
                <button className="btn-primary-save" onClick={saveAll}>
                    <Save size={18} /> Publicar no Site
                </button>
            </header>

            <div className="sim-editor-layout">
                {/* COLUNA ESQUERDA: CAMPOS DE EDIÇÃO */}
                <aside className="sim-form-editor">
                    <div className="admin-section-label">Cabeçalho da Seção</div>
                    <div className="admin-field-box">
                        <label>Título (Use | para quebrar linha/gradiente)</label>
                        <input 
                            className="sim-input-title"
                            value={data['sim_section_title']?.textContent}
                            onChange={(e) => handleTextChange('sim_section_title', e.target.value)}
                        />
                    </div>
                    <div className="admin-field-box">
                        <label>Descrição da Seção</label>
                        <textarea 
                            className="sim-input-desc-field"
                            value={data['sim_section_desc']?.textContent}
                            onChange={(e) => handleTextChange('sim_section_desc', e.target.value)}
                            rows={3}
                        />
                    </div>

                    <div className="admin-section-label" style={{marginTop: '30px'}}>Rótulos do Card (Labels)</div>
                    <div className="sim-labels-grid">
                        <div className="admin-field-box">
                            <label>Aporte</label>
                            <input value={cardLabels.label_aporte || ""} onChange={(e) => handleLabelChange('label_aporte', e.target.value)} />
                        </div>
                        <div className="admin-field-box">
                            <label>Prazo</label>
                            <input value={cardLabels.label_prazo || ""} onChange={(e) => handleLabelChange('label_prazo', e.target.value)} />
                        </div>
                        <div className="admin-field-box">
                            <label>Gema Física</label>
                            <input value={cardLabels.checkbox_gem || ""} onChange={(e) => handleLabelChange('checkbox_gem', e.target.value)} />
                        </div>
                    </div>

                    <div className="admin-section-label" style={{marginTop: '20px'}}>Botões e Status</div>
                    <div className="sim-labels-grid">
                        <div className="admin-field-box">
                            <label>Botão Simular</label>
                            <input value={cardLabels.btn_simulate || ""} onChange={(e) => handleLabelChange('btn_simulate', e.target.value)} />
                        </div>
                        <div className="admin-field-box">
                            <label>Botão Contato</label>
                            <input value={cardLabels.btn_contact || ""} onChange={(e) => handleLabelChange('btn_contact', e.target.value)} />
                        </div>
                        <div className="admin-field-box">
                            <label>Texto Pendente</label>
                            <input value={cardLabels.placeholder || ""} onChange={(e) => handleLabelChange('placeholder', e.target.value)} />
                        </div>
                    </div>

                    <div className="admin-section-label" style={{marginTop: '30px'}}>Configuração WhatsApp</div>
                    <div className="sim-whatsapp-box">
                        <div className="admin-field-box">
                            <label>Número (55...)</label>
                            <div className="wp-row">
                                <Smartphone size={16} />
                                <input value={cardLabels.whatsapp_number || ""} onChange={(e) => handleLabelChange('whatsapp_number', e.target.value)} />
                            </div>
                        </div>
                        <div className="admin-field-box">
                            <label>Mensagem Padrão</label>
                            <textarea 
                                value={cardLabels.whatsapp_message || ""} 
                                onChange={(e) => handleLabelChange('whatsapp_message', e.target.value)}
                                rows={4}
                            />
                        </div>
                    </div>
                </aside>

                {/* COLUNA DIREITA: LIVE PREVIEW (FIEL AO SITE) */}
                <main className="sim-visual-preview">
                    <div className="admin-section-label">Live Preview (Design Real)</div>
                    <div className="site-bg-preview">
                        <div className="preview-text">
                            <h2 className="p-title">
                                {titleParts[0]} <br />
                                <span className="p-gradient">{titleParts[1]}</span>
                            </h2>
                            <p className="p-desc">{data['sim_section_desc']?.textContent}</p>
                        </div>

                        {/* O CARD DO SITE */}
                        <div className="p-card">
                            <div className="p-input-group">
                                <div className="p-label-row">
                                    <span><DollarSign size={14}/> {cardLabels.label_aporte}</span>
                                    <span className="p-val">R$ 5.000,00</span>
                                </div>
                                <div className="p-range-sim"></div>
                            </div>

                            <div className="p-input-group">
                                <div className="p-label-row">
                                    <span><Calendar size={14}/> {cardLabels.label_prazo}</span>
                                    <span className="p-val">12 meses</span>
                                </div>
                                <div className="p-range-sim"></div>
                            </div>

                            <div className="p-check-row">
                                <div className="p-box"></div>
                                <span>{cardLabels.checkbox_gem}</span>
                            </div>

                            <div className="p-divider"></div>

                            <div className="p-result-area">
                                <span className="p-status">{cardLabels.status_pending}</span>
                                <div className="p-placeholder">
                                    <BarChart3 size={30} opacity={0.2} />
                                    <p>{cardLabels.placeholder}</p>
                                </div>
                            </div>

                            <button className="p-btn-main">{cardLabels.btn_simulate}</button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default SimulationManager;