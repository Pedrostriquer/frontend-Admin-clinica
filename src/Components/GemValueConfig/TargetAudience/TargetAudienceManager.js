import React, { useState, useEffect } from 'react';
import { 
    PieChart, ShieldCheck, Gem, FileText, Landmark, 
    Check, Save, Eye, Users 
} from 'lucide-react';
import gemValueService from '../../../dbServices/gemValueService';
import { useNotification } from '../../../Context/NotificationContext';
import './TargetAudienceManager.css';

const TargetAudienceManager = () => {
    const { addNotification } = useNotification();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({});
    const [audienceList, setAudienceList] = useState([]);

    const sessionKeys = [
        'target_audience_tag', 
        'target_audience_title', 
        'target_audience_list'
    ];

    const staticIcons = [
        <PieChart size={24} />, 
        <ShieldCheck size={24} />, 
        <Gem size={24} />, 
        <FileText size={24} />, 
        <Landmark size={24} />
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

            const rawList = dataMap['target_audience_list']?.textContent || "";
            const parsedList = rawList.split('|').map((item, index) => {
                const [title, desc] = item.split('::');
                return {
                    id: index + 1,
                    title: title?.trim() || "",
                    desc: desc?.trim() || ""
                };
            });
            setAudienceList(parsedList);
        } catch (error) {
            addNotification('Erro ao carregar Público-Alvo', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleTextChange = (key, value) => {
        setData(prev => ({ ...prev, [key]: { ...prev[key], textContent: value } }));
    };

    const handleItemChange = (index, field, value) => {
        const newList = [...audienceList];
        newList[index][field] = value;
        setAudienceList(newList);
    };

    const saveAll = async () => {
        try {
            const promises = sessionKeys.map(key => {
                let content = data[key].textContent;
                if (key === 'target_audience_list') {
                    content = audienceList.map(item => `${item.title} :: ${item.desc}`).join(' | ');
                }
                return gemValueService.updateText(data[key].id, key, content);
            });
            await Promise.all(promises);
            addNotification('Público-alvo atualizado com sucesso!', 'success');
        } catch (error) {
            addNotification('Erro ao salvar alterações', 'error');
        }
    };

    if (loading) return <div className="admin-loading">Carregando Público-Alvo...</div>;

    return (
        <div className="target-editor-container">
            <header className="editor-top-bar">
                <div className="editor-info">
                    <Users size={20} className="text-blue-500" />
                    <div>
                        <h2>Editor Visual: Público-Alvo</h2>
                        <p>Gerencie os perfis de clientes e as vantagens estratégicas.</p>
                    </div>
                </div>
                <button className="btn-primary-save" onClick={saveAll}>
                    <Save size={18} /> Publicar no Site
                </button>
            </header>

            <div className="target-editor-layout">
                {/* COLUNA ESQUERDA: LISTA DE ITENS (LINHAS) */}
                <aside className="target-items-sidebar">
                    <div className="admin-section-label">Perfis e Estratégias (Linhas)</div>
                    <div className="target-rows-stack">
                        {audienceList.map((item, index) => (
                            <div key={item.id} className="admin-target-row">
                                <div className="admin-row-header">
                                    <div className="admin-row-icon">
                                        {staticIcons[index] || <Check size={20} />}
                                    </div>
                                    <span className="admin-row-id">0{item.id}</span>
                                </div>
                                <div className="admin-row-inputs">
                                    <input 
                                        className="admin-target-input-title"
                                        value={item.title}
                                        onChange={(e) => handleItemChange(index, 'title', e.target.value)}
                                        placeholder="Título do Perfil"
                                    />
                                    <textarea 
                                        className="admin-target-input-desc"
                                        value={item.desc}
                                        onChange={(e) => handleItemChange(index, 'desc', e.target.value)}
                                        placeholder="Descrição do motivo/vantagem..."
                                        rows={4}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </aside>

                {/* COLUNA DIREITA: TEXTOS DE CABEÇALHO */}
                <main className="target-content-main">
                    <div className="admin-section-label">Cabeçalho da Seção</div>
                    
                    <div className="admin-field-box">
                        <label>Tag Minimalista</label>
                        <input 
                            className="target-input-tag"
                            value={data['target_audience_tag']?.textContent}
                            onChange={(e) => handleTextChange('target_audience_tag', e.target.value)}
                        />
                    </div>

                    <div className="admin-field-box">
                        <label>Título Principal</label>
                        <textarea 
                            className="target-input-h2"
                            value={data['target_audience_title']?.textContent}
                            onChange={(e) => handleTextChange('target_audience_title', e.target.value)}
                            rows={3}
                        />
                    </div>

                    <div className="admin-info-box">
                        <Eye size={18} />
                        <span>A animação de hover e a numeração sequencial são geradas automaticamente no site.</span>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default TargetAudienceManager;