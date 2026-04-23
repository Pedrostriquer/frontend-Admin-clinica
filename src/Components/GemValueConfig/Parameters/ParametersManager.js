import React, { useState, useEffect } from 'react';
import {
  FileSignature, BarChart3, Eye, MessageCircle,
  Check, Save, Eye as EyeIcon, Smartphone
} from 'lucide-react';
import gemValueService from '../../../dbServices/gemValueService';
import './ParametersManager.css';

const ParametersManager = () => {
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [data, setData] = useState({});
    const [originalData, setOriginalData] = useState({});
    const [isDirty, setIsDirty] = useState(false);

    const sessionKeys = [
        'transparency_paragraph_1', 'transparency_paragraph_2', 'transparency_paragraph_3',
        'transparency_card_1_desc', 'transparency_card_2_desc', 'transparency_card_3_desc',
        'transparency_cta_title', 'transparency_cta_description', 'transparency_button_text',
        'transparency_whatsapp_number', 'transparency_whatsapp_message'
    ];

    const staticCardTitles = [
        'BASE CONTRATUAL',
        'PROJEÇÃO BASEADA NO MERCADO REAL',
        'TRANSPARÊNCIA TOTAL'
    ];

    const staticIcons = [
        <FileSignature size={24} />,
        <BarChart3 size={24} />,
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
            setOriginalData(JSON.parse(JSON.stringify(dataMap)));
            setIsDirty(false);
        } catch (error) {
            alert('❌ Erro ao carregar Transparência');
        } finally {
            setLoading(false);
        }
    };

    const handleTextChange = (key, value) => {
        setData(prev => ({ ...prev, [key]: { ...prev[key], textContent: value } }));
        setIsDirty(true);
    };

    const saveAll = async () => {
        try {
            setIsSaving(true);
            const promises = sessionKeys.map(async (key) => {
                let content = data[key]?.textContent || '';

                if (!content || content.trim() === '') {
                    return Promise.resolve();
                }

                if (data[key]?.id) {
                    return gemValueService.updateText(data[key].id, key, content);
                }

                try {
                    const newRecord = await gemValueService.createText(key, content);
                    setData(prev => ({ ...prev, [key]: newRecord }));
                    return newRecord;
                } catch (createError) {
                    await loadData();
                    const updatedData = await gemValueService.getAllTexts();
                    const existingRecord = updatedData.find(item => item.sessionName === key);
                    if (existingRecord) {
                        return gemValueService.updateText(existingRecord.id, key, content);
                    }
                    throw createError;
                }
            });

            await Promise.all(promises);
            alert('✅ Transparência atualizada com sucesso!');
            setIsDirty(false);
            setTimeout(() => loadData(), 500);
        } catch (error) {
            alert('❌ Erro ao salvar alterações');
            console.error('Erro detalhado:', error);
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) return <div className="admin-loading">Carregando Transparência...</div>;

    return (
        <div className="params-editor-container">
            <header className="editor-top-bar">
                <div className="editor-info">
                    <EyeIcon size={20} className="text-blue-500" />
                    <div>
                        <h2>Editor Visual: Transparência</h2>
                        <p>Gerencie o conteúdo da seção de transparência.</p>
                    </div>
                </div>
                {isDirty && (
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

            <div className="params-editor-layout">
                {/* SEÇÃO: PARÁGRAFOS INICIAIS */}
                <div className="params-card">
                    <div className="card-header">
                        <div className="card-header-icon">📝</div>
                        <div>
                            <h3>Parágrafos Iniciais</h3>
                            <p>Textos que explicam o conceito</p>
                        </div>
                    </div>

                    <div className="admin-section-label">Primeiro Parágrafo</div>
                    <div className="admin-field-box">
                        <label>Parágrafo 1 - Contrato</label>
                        <textarea
                            className="params-textarea"
                            value={data['transparency_paragraph_1']?.textContent || ''}
                            onChange={(e) => handleTextChange('transparency_paragraph_1', e.target.value)}
                            rows={4}
                            placeholder="Cada aquisição no GemCapital é baseada em parâmetros..."
                        />
                    </div>

                    <div className="admin-section-label">Segundo Parágrafo</div>
                    <div className="admin-field-box">
                        <label>Parágrafo 2 - Valorização</label>
                        <textarea
                            className="params-textarea"
                            value={data['transparency_paragraph_2']?.textContent || ''}
                            onChange={(e) => handleTextChange('transparency_paragraph_2', e.target.value)}
                            rows={4}
                            placeholder="Em determinados cenários de mercado..."
                        />
                    </div>

                    <div className="admin-section-label">Terceiro Parágrafo</div>
                    <div className="admin-field-box">
                        <label>Parágrafo 3 - Estrutura</label>
                        <textarea
                            className="params-textarea"
                            value={data['transparency_paragraph_3']?.textContent || ''}
                            onChange={(e) => handleTextChange('transparency_paragraph_3', e.target.value)}
                            rows={4}
                            placeholder="Cada estrutura é apresentada de forma transparente..."
                        />
                    </div>
                </div>

                {/* SEÇÃO: CARDS DE VANTAGENS */}
                <div className="params-card">
                    <div className="card-header">
                        <div className="card-header-icon">⭐</div>
                        <div>
                            <h3>Cards de Vantagens</h3>
                            <p>3 benefícios principais</p>
                        </div>
                    </div>

                    {[0, 1, 2].map((index) => (
                        <div key={index} className="params-card-item">
                            <div className="params-card-header-mini">
                                <div className="params-card-icon">
                                    {staticIcons[index]}
                                </div>
                                <div className="params-card-title">{staticCardTitles[index]}</div>
                            </div>

                            <textarea
                                className="params-textarea-small"
                                value={data[`transparency_card_${index + 1}_desc`]?.textContent || ''}
                                onChange={(e) => handleTextChange(`transparency_card_${index + 1}_desc`, e.target.value)}
                                placeholder="Descrição do card..."
                                rows={3}
                            />
                        </div>
                    ))}
                </div>

                {/* SEÇÃO: CHAMADA PARA AÇÃO */}
                <div className="params-card">
                    <div className="card-header">
                        <div className="card-header-icon">🔘</div>
                        <div>
                            <h3>Chamada para Ação</h3>
                            <p>Pergunta e contato</p>
                        </div>
                    </div>

                    <div className="admin-section-label">Pergunta Principal</div>
                    <div className="admin-field-box">
                        <label>Título da CTA</label>
                        <input
                            className="params-input"
                            value={data['transparency_cta_title']?.textContent || ''}
                            onChange={(e) => handleTextChange('transparency_cta_title', e.target.value)}
                            placeholder="Quer entender como funciona na prática?"
                        />
                    </div>

                    <div className="admin-section-label">Descrição</div>
                    <div className="admin-field-box">
                        <label>Texto da CTA</label>
                        <textarea
                            className="params-textarea"
                            value={data['transparency_cta_description']?.textContent || ''}
                            onChange={(e) => handleTextChange('transparency_cta_description', e.target.value)}
                            rows={3}
                            placeholder="Fale com um consultor..."
                        />
                    </div>

                    <div className="admin-section-label">Botão</div>
                    <div className="admin-field-box">
                        <label>Texto do Botão</label>
                        <div className="params-btn-preview">
                            <MessageCircle size={18} />
                            <input
                                className="params-input"
                                value={data['transparency_button_text']?.textContent || ''}
                                onChange={(e) => handleTextChange('transparency_button_text', e.target.value)}
                                placeholder="Quero saber mais sobre o GemCapital"
                            />
                        </div>
                    </div>

                    <div className="admin-section-label" style={{ marginTop: '24px' }}>Integração WhatsApp</div>
                    <div className="admin-field-box">
                        <label>Número WhatsApp</label>
                        <div className="params-wp-row">
                            <Smartphone size={16} />
                            <input
                                className="params-input"
                                value={data['transparency_whatsapp_number']?.textContent || ''}
                                onChange={(e) => handleTextChange('transparency_whatsapp_number', e.target.value)}
                                placeholder="558000004938"
                            />
                        </div>
                    </div>

                    <div className="admin-field-box">
                        <label>Mensagem WhatsApp</label>
                        <textarea
                            className="params-textarea"
                            value={data['transparency_whatsapp_message']?.textContent || ''}
                            onChange={(e) => handleTextChange('transparency_whatsapp_message', e.target.value)}
                            rows={3}
                            placeholder="Mensagem padrão ao abrir WhatsApp..."
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ParametersManager;
