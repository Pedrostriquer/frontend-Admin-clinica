import React, { useState, useEffect } from 'react';
import { Check, Save, Eye, ShieldCheck, Gem, Award, Lock, Users } from 'lucide-react';
import gemValueService from '../../../dbServices/gemValueService';
import './AuthorityManager.css';

const AuthorityManager = () => {
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [data, setData] = useState({});
    const [originalData, setOriginalData] = useState({});
    const [pillars, setPillars] = useState([]);
    const [originalPillars, setOriginalPillars] = useState([]);

    const sessionKeys = ['auth_description', 'auth_pillars_list'];

    const staticIcons = [
        <Gem size={24} />,
        <Award size={24} />,
        <Lock size={24} />,
        <Users size={24} />
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

            const rawPillars = dataMap['auth_pillars_list']?.textContent || "";
            const parsedPillars = rawPillars.split('|').map(item => {
                const [title, text] = item.split('::');
                return { title: title?.trim() || "", text: text?.trim() || "" };
            }).filter(p => p.title || p.text);
            setPillars(parsedPillars);
            setOriginalPillars([...parsedPillars]);
        } catch (error) {
            alert('❌ Erro ao carregar Autoridade');
        } finally {
            setLoading(false);
        }
    };

    const handleTextChange = (key, value) => {
        setData(prev => ({ ...prev, [key]: { ...prev[key], textContent: value } }));
    };

    const handlePillarChange = (index, field, value) => {
        const newPillars = [...pillars];
        newPillars[index][field] = value;
        setPillars(newPillars);
    };

    const hasChanges = () => {
        if (pillars.length !== originalPillars.length) return true;
        if (pillars.some((p, i) => p.text !== originalPillars[i]?.text)) return true;

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

                if (key === 'auth_pillars_list') {
                    content = pillars.map(p => `${p.title} :: ${p.text}`).join(' | ');
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
            alert('✅ Autoridade atualizada com sucesso!');
            setTimeout(() => loadData(), 500);
        } catch (error) {
            alert('❌ Erro ao salvar alterações');
            console.error('Erro detalhado:', error);
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) return <div className="admin-loading">Carregando Autoridade...</div>;

    return (
        <div className="auth-editor-container">
            <header className="editor-top-bar">
                <div className="editor-info">
                    <ShieldCheck size={20} className="text-blue-500" />
                    <div>
                        <h2>Editor Visual: Autoridade e Pilares</h2>
                        <p>Gerencie a mensagem institucional e os diferenciais da marca.</p>
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

            <div className="auth-editor-layout">
                {/* COLUNA ESQUERDA: PILARES (CARDS SQUARE) */}
                <aside className="auth-cards-sidebar">
                    <div className="admin-section-label">Descrições dos Pilares</div>
                    <div className="auth-cards-stack">
                        {pillars.map((pillar, index) => (
                            <div key={index} className="admin-auth-card">
                                <div className="admin-auth-icon">
                                    {staticIcons[index] || <Check size={24} />}
                                </div>
                                <div className="admin-auth-pillar-label">{pillar.title}</div>
                                <textarea
                                    className="admin-auth-input-text"
                                    value={pillar.text}
                                    onChange={(e) => handlePillarChange(index, 'text', e.target.value)}
                                    placeholder="Descrição curta..."
                                    rows={2}
                                />
                            </div>
                        ))}
                    </div>
                </aside>

                {/* COLUNA DIREITA: CONTEÚDO AMPLO */}
                <main className="auth-content-main">
                    <div className="admin-section-label">Mensagem Central</div>

                    <div className="admin-field-box">
                        <label>Descrição Institucional</label>
                        <textarea
                            className="auth-input-body"
                            value={data['auth_description']?.textContent || ''}
                            onChange={(e) => handleTextChange('auth_description', e.target.value)}
                            rows={8}
                            placeholder="Ex: O GemCapital é desenvolvido e operado pela Gemas Brilhantes..."
                        />
                    </div>

                    <div className="auth-admin-divider"></div>

                    <div className="admin-info-note">
                        <Eye size={16} />
                        <span>O título (Gemas Brilhantes), ícones e efeitos visuais são fixos e não podem ser alterados.</span>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AuthorityManager;