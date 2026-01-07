import React, { useState, useEffect } from 'react';
import { Gem, Award, Lock, Users, Check, Save, Eye, ShieldCheck } from 'lucide-react';
import gemValueService from '../../../dbServices/gemValueService';
import { useNotification } from '../../../Context/NotificationContext';
import './AuthorityManager.css';

const AuthorityManager = () => {
    const { addNotification } = useNotification();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({});
    const [pillars, setPillars] = useState([]);

    const sessionKeys = ['auth_title', 'auth_description', 'auth_pillars_list'];

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

            const rawPillars = dataMap['auth_pillars_list']?.textContent || "";
            const parsedPillars = rawPillars.split('|').map(item => {
                const [title, text] = item.split('::');
                return { title: title?.trim() || "", text: text?.trim() || "" };
            });
            setPillars(parsedPillars);
        } catch (error) {
            addNotification('Erro ao carregar Autoridade', 'error');
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

    const saveAll = async () => {
        try {
            const promises = sessionKeys.map(key => {
                let content = data[key].textContent;
                if (key === 'auth_pillars_list') {
                    content = pillars.map(p => `${p.title} :: ${p.text}`).join(' | ');
                }
                return gemValueService.updateText(data[key].id, key, content);
            });
            await Promise.all(promises);
            addNotification('Dados de autoridade atualizados!', 'success');
        } catch (error) {
            addNotification('Erro ao salvar', 'error');
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
                <button className="btn-primary-save" onClick={saveAll}>
                    <Save size={18} /> Publicar no Site
                </button>
            </header>

            <div className="auth-editor-layout">
                {/* COLUNA ESQUERDA: PILARES (CARDS SQUARE) */}
                <aside className="auth-cards-sidebar">
                    <div className="admin-section-label">Pilares Institucionais</div>
                    <div className="auth-cards-stack">
                        {pillars.map((pillar, index) => (
                            <div key={index} className="admin-auth-card">
                                <div className="admin-auth-icon">
                                    {staticIcons[index] || <Check size={24} />}
                                </div>
                                <input 
                                    className="admin-auth-input-title"
                                    value={pillar.title}
                                    onChange={(e) => handlePillarChange(index, 'title', e.target.value)}
                                    placeholder="Título do Pilar"
                                />
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
                        <label>Título (H2 - Titanium Gradient)</label>
                        <textarea 
                            className="auth-input-h2"
                            value={data['auth_title']?.textContent}
                            onChange={(e) => handleTextChange('auth_title', e.target.value)}
                            rows={3}
                        />
                    </div>

                    <div className="admin-field-box">
                        <label>Descrição Institucional</label>
                        <textarea 
                            className="auth-input-body"
                            value={data['auth_description']?.textContent}
                            onChange={(e) => handleTextChange('auth_description', e.target.value)}
                            rows={8}
                        />
                    </div>

                    <div className="auth-admin-divider"></div>
                    
                    <div className="admin-info-note">
                        <Eye size={16} />
                        <span>O efeito de brilho e a logo de fundo são aplicados automaticamente pelo site.</span>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AuthorityManager;