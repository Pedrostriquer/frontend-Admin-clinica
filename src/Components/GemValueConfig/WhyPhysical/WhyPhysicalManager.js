import React, { useState, useEffect } from 'react';
import {
    Gem, TrendingDown, Landmark, FileKey, Sprout,
    ArrowRight, Save, Eye, Plus, Trash2, Check, Play
} from 'lucide-react';
import gemValueService from '../../../dbServices/gemValueService';
import './WhyPhysicalManager.css';

const WhyPhysicalManager = () => {
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [data, setData] = useState({});
    const [originalData, setOriginalData] = useState({});
    const [features, setFeatures] = useState([]);
    const [originalFeatures, setOriginalFeatures] = useState([]);

    const sessionKeys = [
        'why_physical_video_tag', 'why_physical_video_title', 'why_physical_video_description', 'why_physical_video_button',
        'why_physical_title', 'why_physical_highlight', 'why_physical_body_1', 'why_physical_body_2',
        'why_physical_cta_text', 'why_physical_whatsapp_number', 'why_physical_whatsapp_message',
        'why_physical_features_list'
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
            setOriginalData(JSON.parse(JSON.stringify(dataMap)));

            const rawFeatures = dataMap['why_physical_features_list']?.textContent || "";
            const parsedFeatures = rawFeatures.split('|').map(item => {
                const [title, desc] = item.split('::');
                return { title: title?.trim() || "", desc: desc?.trim() || "" };
            }).filter(f => f.title || f.desc);
            setFeatures(parsedFeatures);
            setOriginalFeatures([...parsedFeatures]);
        } catch (error) {
            alert('❌ Erro ao carregar seção Ativos Físicos');
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

    const addFeature = () => {
        setFeatures([...features, { title: "", desc: "" }]);
    };

    const removeFeature = (index) => {
        setFeatures(features.filter((_, i) => i !== index));
    };

    const hasChanges = () => {
        // Verifica features
        if (features.length !== originalFeatures.length) return true;
        if (features.some((f, i) => f.title !== originalFeatures[i]?.title || f.desc !== originalFeatures[i]?.desc)) return true;

        // Verifica dados
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

                if (key === 'why_physical_features_list') {
                    content = features.map(f => `${f.title} :: ${f.desc}`).join(' | ');
                }

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
            alert('✅ Seção Ativos Físicos atualizada com sucesso!');
            setTimeout(() => loadData(), 500);
        } catch (error) {
            alert('❌ Erro ao salvar alterações');
            console.error('Erro detalhado:', error);
        } finally {
            setIsSaving(false);
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
                        <p>Configure todos os textos da seção.</p>
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

            <div className="phys-editor-layout">
                {/* CARD 1: VÍDEO SECTION */}
                <div className="phys-editor-card">
                    <div className="card-header">
                        <div className="card-header-icon">🎥</div>
                        <div>
                            <h3>Seção Vídeo</h3>
                            <p>Player e informações</p>
                        </div>
                    </div>

                    <div className="admin-section-label">Conteúdo do Vídeo</div>

                    <div className="admin-field-box">
                        <label>Tag/Label</label>
                        <input
                            className="phys-input-tag"
                            value={data['why_physical_video_tag']?.textContent || ''}
                            onChange={(e) => handleTextChange('why_physical_video_tag', e.target.value)}
                            placeholder="Ex: Vídeo institucional"
                        />
                    </div>

                    <div className="admin-field-box">
                        <label>Título do Vídeo</label>
                        <input
                            className="phys-input-h3"
                            value={data['why_physical_video_title']?.textContent || ''}
                            onChange={(e) => handleTextChange('why_physical_video_title', e.target.value)}
                            placeholder="Ex: Valorização Patrimonial — GemCapital"
                        />
                    </div>

                    <div className="admin-field-box">
                        <label>Descrição do Vídeo</label>
                        <textarea
                            className="phys-input-desc"
                            value={data['why_physical_video_description']?.textContent || ''}
                            onChange={(e) => handleTextChange('why_physical_video_description', e.target.value)}
                            rows={3}
                            placeholder="Descrição que aparece abaixo do vídeo..."
                        />
                    </div>

                    <div className="admin-field-box">
                        <label>Texto do Botão</label>
                        <input
                            className="phys-input-tag"
                            value={data['why_physical_video_button']?.textContent || ''}
                            onChange={(e) => handleTextChange('why_physical_video_button', e.target.value)}
                            placeholder="Ex: Continuar"
                        />
                    </div>
                </div>

                {/* CARD 2: CONTEÚDO PRINCIPAL */}
                <div className="phys-editor-card">
                    <div className="card-header">
                        <div className="card-header-icon">📝</div>
                        <div>
                            <h3>Conteúdo Principal</h3>
                            <p>Textos da coluna esquerda</p>
                        </div>
                    </div>

                    <div className="admin-section-label">Textos</div>

                    <div className="admin-field-box">
                        <label>Título Principal</label>
                        <textarea
                            className="phys-input-h2"
                            value={data['why_physical_title']?.textContent || ''}
                            onChange={(e) => handleTextChange('why_physical_title', e.target.value)}
                            rows={3}
                            placeholder="Ex: Quando o mercado oscila, o ativo físico permanece"
                        />
                    </div>

                    <div className="admin-field-box">
                        <label>Texto Destaque (Highlight)</label>
                        <textarea
                            className="phys-input-highlight"
                            value={data['why_physical_highlight']?.textContent || ''}
                            onChange={(e) => handleTextChange('why_physical_highlight', e.target.value)}
                            rows={4}
                            placeholder="Quem tem um bem real..."
                        />
                    </div>

                    <div className="admin-field-box">
                        <label>Corpo - Parágrafo 1</label>
                        <textarea
                            className="phys-input-body"
                            value={data['why_physical_body_1']?.textContent || ''}
                            onChange={(e) => handleTextChange('why_physical_body_1', e.target.value)}
                            rows={4}
                            placeholder="Ao longo da história..."
                        />
                    </div>

                    <div className="admin-field-box">
                        <label>Corpo - Parágrafo 2</label>
                        <textarea
                            className="phys-input-body"
                            value={data['why_physical_body_2']?.textContent || ''}
                            onChange={(e) => handleTextChange('why_physical_body_2', e.target.value)}
                            rows={4}
                            placeholder="Com o GemCapital..."
                        />
                    </div>
                </div>

                {/* CARD 3: CHAMADA AÇÃO + WHATSAPP */}
                <div className="phys-editor-card">
                    <div className="card-header">
                        <div className="card-header-icon">🔘</div>
                        <div>
                            <h3>Ações e Contato</h3>
                            <p>CTA e WhatsApp</p>
                        </div>
                    </div>

                    <div className="admin-section-label">Botão CTA</div>

                    <div className="admin-field-box">
                        <label>Texto do Link</label>
                        <div className="phys-cta-preview">
                            <input
                                className="phys-input-cta"
                                value={data['why_physical_cta_text']?.textContent || ''}
                                onChange={(e) => handleTextChange('why_physical_cta_text', e.target.value)}
                                placeholder="Ex: Entenda como funciona a aquisição"
                            />
                            <ArrowRight size={18} className="text-sky-500" />
                        </div>
                    </div>

                    <div className="admin-section-label" style={{ marginTop: '30px' }}>Integração WhatsApp</div>

                    <div className="admin-field-box">
                        <label>Número WhatsApp</label>
                        <input
                            className="phys-input-tag"
                            value={data['why_physical_whatsapp_number']?.textContent || ''}
                            onChange={(e) => handleTextChange('why_physical_whatsapp_number', e.target.value)}
                            placeholder="Ex: 558000004938"
                        />
                    </div>

                    <div className="admin-field-box">
                        <label>Mensagem WhatsApp</label>
                        <textarea
                            className="phys-input-desc"
                            value={data['why_physical_whatsapp_message']?.textContent || ''}
                            onChange={(e) => handleTextChange('why_physical_whatsapp_message', e.target.value)}
                            rows={3}
                            placeholder="Mensagem padrão..."
                        />
                    </div>
                </div>

                {/* CARD 4: FEATURES */}
                <div className="phys-editor-card">
                    <div className="card-header">
                        <div className="card-header-icon">⭐</div>
                        <div>
                            <h3>Cards de Benefícios</h3>
                            <p>5 vantagens principais</p>
                        </div>
                    </div>

                    <div className="admin-section-label">Gerenciar Features</div>

                    <div className="phys-features-stack">
                        {features.map((item, index) => (
                            <div key={index} className="admin-phys-card">
                                <div className="admin-phys-icon">
                                    {staticIcons[index] || <Check size={18} />}
                                </div>
                                <div className="admin-phys-inputs">
                                    <input
                                        className="admin-phys-title"
                                        value={item.title}
                                        onChange={(e) => handleFeatureChange(index, 'title', e.target.value)}
                                        placeholder="Título do benefício"
                                    />
                                    <textarea
                                        className="admin-phys-desc"
                                        value={item.desc}
                                        onChange={(e) => handleFeatureChange(index, 'desc', e.target.value)}
                                        placeholder="Descrição..."
                                        rows={3}
                                    />
                                </div>
                                <button
                                    className="btn-remove-feature"
                                    onClick={() => removeFeature(index)}
                                    disabled={features.length === 1}
                                    title={features.length === 1 ? "Mínimo 1 feature" : "Remover"}
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>

                    {features.length < 5 && (
                        <button className="btn-add-feature" onClick={addFeature}>
                            <Plus size={16} /> Adicionar Feature
                        </button>
                    )}

                    <div style={{ marginTop: '20px', padding: '14px', background: '#f0f4f8', borderRadius: '10px', fontSize: '0.85rem', color: '#64748b' }}>
                        <strong>Limite:</strong> Máximo 5 benefícios (cada um com um ícone diferente)
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WhyPhysicalManager;
