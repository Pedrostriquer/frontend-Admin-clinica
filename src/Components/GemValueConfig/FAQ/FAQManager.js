import React, { useState, useEffect } from 'react';
import { 
    HelpCircle, Plus, Trash2, Save, Eye, 
    MessageCircle, Smartphone, Info, ChevronDown 
} from 'lucide-react';
import gemValueService from '../../../dbServices/gemValueService';
import { useNotification } from '../../../Context/NotificationContext';
import './FAQManager.css';

const FAQManager = () => {
    const { addNotification } = useNotification();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({});
    const [faqItems, setFaqItems] = useState([]);

    const sessionKeys = [
        'faq_header_tag', 'faq_title', 'faq_subtitle', 
        'faq_items', 'faq_footer_label', 'faq_whatsapp_number'
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

            // Parse dos itens do FAQ (Pergunta :: Resposta || Pergunta :: Resposta)
            const rawItems = dataMap['faq_items']?.textContent || "";
            const parsedItems = rawItems.split('||').map(item => {
                const [q, a] = item.split('::');
                return { 
                    question: q?.trim() || "", 
                    answer: a?.trim() || "" 
                };
            }).filter(item => item.question || item.answer);
            
            setFaqItems(parsedItems);
        } catch (error) {
            addNotification('Erro ao carregar FAQ', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleTextChange = (key, value) => {
        setData(prev => ({ ...prev, [key]: { ...prev[key], textContent: value } }));
    };

    const handleFaqChange = (index, field, value) => {
        const newItems = [...faqItems];
        newItems[index][field] = value;
        setFaqItems(newItems);
    };

    const addFaqItem = () => {
        setFaqItems([...faqItems, { question: "", answer: "" }]);
    };

    const removeFaqItem = (index) => {
        setFaqItems(faqItems.filter((_, i) => i !== index));
    };

    const saveAll = async () => {
        try {
            const promises = sessionKeys.map(key => {
                let content = data[key].textContent;
                if (key === 'faq_items') {
                    // Remonta a string: Pergunta :: Resposta || ...
                    content = faqItems
                        .map(item => `${item.question} :: ${item.answer}`)
                        .join(' || ');
                }
                return gemValueService.updateText(data[key].id, key, content);
            });
            await Promise.all(promises);
            addNotification('FAQ atualizado com sucesso!', 'success');
        } catch (error) {
            addNotification('Erro ao salvar FAQ', 'error');
        }
    };

    if (loading) return <div className="admin-loading">Organizando Dúvidas Frequentes...</div>;

    const titleParts = (data['faq_title']?.textContent || "Perguntas | Frequentes").split('|');

    return (
        <div className="faq-editor-container">
            <header className="editor-top-bar">
                <div className="editor-info">
                    <HelpCircle size={20} className="text-blue-500" />
                    <div>
                        <h2>Editor Visual: FAQ (Dúvidas)</h2>
                        <p>Gerencie as perguntas frequentes e as instruções de formatação.</p>
                    </div>
                </div>
                <button className="btn-primary-save" onClick={saveAll}>
                    <Save size={18} /> Publicar no Site
                </button>
            </header>

            <div className="faq-editor-layout">
                {/* COLUNA ESQUERDA: LISTA DE PERGUNTAS */}
                <aside className="faq-items-editor">
                    <div className="admin-section-label">Lista de Perguntas e Respostas</div>
                    <div className="faq-items-stack">
                        {faqItems.map((item, index) => (
                            <div key={index} className="admin-faq-card">
                                <div className="admin-faq-card-header">
                                    <HelpCircle size={18} className="text-blue-400" />
                                    <button className="btn-remove-faq" onClick={() => removeFaqItem(index)}>
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                                <input 
                                    className="admin-faq-input-q"
                                    value={item.question}
                                    onChange={(e) => handleFaqChange(index, 'question', e.target.value)}
                                    placeholder="Escreva a pergunta aqui..."
                                />
                                <textarea 
                                    className="admin-faq-input-a"
                                    value={item.answer}
                                    onChange={(e) => handleFaqChange(index, 'answer', e.target.value)}
                                    placeholder="Escreva a resposta usando [P] para parágrafo e [LI] para lista..."
                                    rows={5}
                                />
                            </div>
                        ))}
                        <button className="btn-add-faq" onClick={addFaqItem}>
                            <Plus size={18} /> Adicionar Nova Pergunta
                        </button>
                    </div>
                </aside>

                {/* COLUNA DIREITA: CONFIGURAÇÕES E DICAS */}
                <main className="faq-content-main">
                    <div className="admin-section-label">Configuração de Cabeçalho</div>
                    <div className="admin-field-box">
                        <label>Tag de Seção</label>
                        <input 
                            className="faq-input-tag"
                            value={data['faq_header_tag']?.textContent}
                            onChange={(e) => handleTextChange('faq_header_tag', e.target.value)}
                        />
                    </div>
                    <div className="admin-field-box">
                        <label>Título (Use | para separar o azul)</label>
                        <input 
                            className="faq-input-h2"
                            value={data['faq_title']?.textContent}
                            onChange={(e) => handleTextChange('faq_title', e.target.value)}
                        />
                    </div>
                    <div className="admin-field-box">
                        <label>Subtítulo</label>
                        <textarea 
                            className="faq-input-subtitle"
                            value={data['faq_subtitle']?.textContent}
                            onChange={(e) => handleTextChange('faq_subtitle', e.target.value)}
                            rows={3}
                        />
                    </div>

                    <div className="admin-section-label" style={{marginTop: '30px'}}>Dicas de Formatação</div>
                    <div className="faq-formatting-guide">
                        <div className="guide-item">
                            <code>[P]</code> <span>Cria um novo parágrafo.</span>
                        </div>
                        <div className="guide-item">
                            <code>[LI]</code> <span>Cria um item de lista (com bolinha).</span>
                        </div>
                        <p className="guide-note">
                            <Info size={14} /> 
                            Ex: [P] Este é o texto. [LI] Item 1 [LI] Item 2
                        </p>
                    </div>

                    <div className="admin-section-label" style={{marginTop: '30px'}}>Rodapé e Contato</div>
                    <div className="admin-field-box">
                        <label>Texto do Rodapé (Chamada)</label>
                        <input 
                            className="faq-input-footer-label"
                            value={data['faq_footer_label']?.textContent}
                            onChange={(e) => handleTextChange('faq_footer_label', e.target.value)}
                        />
                    </div>
                    <div className="admin-field-box">
                        <label>WhatsApp de Suporte</label>
                        <div className="faq-wp-row">
                            <Smartphone size={16} />
                            <input 
                                value={data['faq_whatsapp_number']?.textContent}
                                onChange={(e) => handleTextChange('faq_whatsapp_number', e.target.value)}
                            />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default FAQManager;