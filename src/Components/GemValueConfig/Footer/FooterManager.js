import React, { useState, useEffect } from 'react';
import { 
    Globe, Link, ShieldAlert, FileText, 
    ShieldCheck, Save, Eye, Info, Smartphone 
} from 'lucide-react';
import gemValueService from '../../../dbServices/gemValueService';
import { useNotification } from '../../../Context/NotificationContext';
import './FooterManager.css';

const FooterManager = () => {
    const { addNotification } = useNotification();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({});
    const [socialLinks, setSocialLinks] = useState([]);
    const [contactLinks, setContactLinks] = useState([]);

    // Chaves da API que compõem o Footer
    const sessionKeys = [
        'footer_brand_desc_1', 
        'footer_brand_desc_2', 
        'footer_cnpj_info', 
        'footer_copyright_text',
        'footer_social_links', 
        'footer_contact_links',
        'footer_legal_notice', 
        'footer_terms_of_use', 
        'footer_privacy_policy'
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

            // Parse dos Links Sociais (Formato: Título :: URL | ...)
            const rawSocial = dataMap['footer_social_links']?.textContent || "";
            if (rawSocial) {
                setSocialLinks(rawSocial.split('|').map(link => {
                    const [title, url] = link.split('::');
                    return { title: title?.trim() || "", url: url?.trim() || "" };
                }));
            }

            // Parse dos Links de Contacto (Formato: Texto :: URL | ...)
            const rawContact = dataMap['footer_contact_links']?.textContent || "";
            if (rawContact) {
                setContactLinks(rawContact.split('|').map(link => {
                    const [title, url] = link.split('::');
                    return { title: title?.trim() || "", url: url?.trim() || "" };
                }));
            }

        } catch (error) {
            addNotification('Erro ao carregar os dados do Rodapé', 'error');
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

    const handleLinkChange = (index, field, value, type) => {
        if (type === 'social') {
            const newLinks = [...socialLinks];
            newLinks[index][field] = value;
            setSocialLinks(newLinks);
        } else {
            const newLinks = [...contactLinks];
            newLinks[index][field] = value;
            setContactLinks(newLinks);
        }
    };

    const saveAll = async () => {
        try {
            const promises = sessionKeys.map(key => {
                let content = data[key].textContent;
                
                // Reconstroi as strings de links com os delimitadores :: e |
                if (key === 'footer_social_links') {
                    content = socialLinks.map(l => `${l.title} :: ${l.url}`).join(' | ');
                } else if (key === 'footer_contact_links') {
                    content = contactLinks.map(l => `${l.title} :: ${l.url}`).join(' | ');
                }
                
                return gemValueService.updateText(data[key].id, key, content);
            });

            await Promise.all(promises);
            addNotification('Rodapé e Documentos Legais publicados!', 'success');
        } catch (error) {
            addNotification('Erro ao salvar algumas secções.', 'error');
        }
    };

    if (loading) return <div className="admin-loading">A carregar estrutura do rodapé...</div>;

    return (
        <div className="footer-editor-container">
            <header className="editor-top-bar">
                <div className="editor-info">
                    <Globe size={20} className="text-blue-500" />
                    <div>
                        <h2>Editor Visual: Rodapé e Jurídico</h2>
                        <p>Configure links, descrições da marca e textos legais do site.</p>
                    </div>
                </div>
                <button className="btn-primary-save" onClick={saveAll}>
                    <Save size={18} /> Publicar Alterações
                </button>
            </header>

            <div className="footer-editor-layout">
                
                {/* COLUNA ESQUERDA: INSTITUCIONAL E LINKS (DESIGN DARK) */}
                <aside className="footer-brand-editor">
                    <div className="admin-section-label">Informações da Marca</div>
                    
                    <div className="admin-field-box">
                        <label>Descrição Principal</label>
                        <textarea 
                            value={data['footer_brand_desc_1']?.textContent} 
                            onChange={(e) => handleTextChange('footer_brand_desc_1', e.target.value)} 
                            rows={4} 
                        />
                    </div>

                    <div className="admin-field-box">
                        <label>Descrição Secundária (Aviso)</label>
                        <textarea 
                            value={data['footer_brand_desc_2']?.textContent} 
                            onChange={(e) => handleTextChange('footer_brand_desc_2', e.target.value)} 
                            rows={4} 
                        />
                    </div>

                    <div className="admin-field-box">
                        <label>CNPJ e Dados Fiscais</label>
                        <input 
                            value={data['footer_cnpj_info']?.textContent} 
                            onChange={(e) => handleTextChange('footer_cnpj_info', e.target.value)} 
                        />
                    </div>

                    <div className="admin-field-box">
                        <label>Texto de Direitos Autorais</label>
                        <input 
                            value={data['footer_copyright_text']?.textContent} 
                            onChange={(e) => handleTextChange('footer_copyright_text', e.target.value)} 
                        />
                    </div>

                    <div className="admin-section-label" style={{marginTop: '30px'}}>Redes Sociais</div>
                    <div className="links-stack">
                        {socialLinks.map((link, i) => (
                            <div key={i} className="link-edit-row">
                                <span className="link-label">{link.title}</span>
                                <input 
                                    value={link.url} 
                                    onChange={(e) => handleLinkChange(i, 'url', e.target.value, 'social')} 
                                    placeholder="https://instagram.com/..." 
                                />
                            </div>
                        ))}
                    </div>

                    <div className="admin-section-label" style={{marginTop: '30px'}}>Canais de Contacto</div>
                    <div className="links-stack">
                        {contactLinks.map((link, i) => (
                            <div key={i} className="link-edit-row">
                                <input 
                                    className="link-title-input" 
                                    value={link.title} 
                                    onChange={(e) => handleLinkChange(i, 'title', e.target.value, 'contact')} 
                                    placeholder="Ex: E-mail ou Telefone"
                                />
                                <input 
                                    value={link.url} 
                                    onChange={(e) => handleLinkChange(i, 'url', e.target.value, 'contact')} 
                                    placeholder="URL ou link mailto:" 
                                />
                            </div>
                        ))}
                    </div>
                </aside>

                {/* COLUNA DIREITA: DOCUMENTOS LEGAIS (DESIGN CLEAN) */}
                <main className="footer-legal-editor">
                    <div className="admin-section-label">Documentos Legais (Modais)</div>
                    
                    <div className="legal-doc-box">
                        <div className="legal-header"><ShieldAlert size={18} /> Aviso Legal</div>
                        <textarea 
                            className="legal-textarea"
                            value={data['footer_legal_notice']?.textContent}
                            onChange={(e) => handleTextChange('footer_legal_notice', e.target.value)}
                        />
                    </div>

                    <div className="legal-doc-box">
                        <div className="legal-header"><FileText size={18} /> Termos de Uso</div>
                        <textarea 
                            className="legal-textarea"
                            value={data['footer_terms_of_use']?.textContent}
                            onChange={(e) => handleTextChange('footer_terms_of_use', e.target.value)}
                        />
                    </div>

                    <div className="legal-doc-box">
                        <div className="legal-header"><ShieldCheck size={18} /> Política de Privacidade</div>
                        <textarea 
                            className="legal-textarea"
                            value={data['footer_privacy_policy']?.textContent}
                            onChange={(e) => handleTextChange('footer_privacy_policy', e.target.value)}
                        />
                    </div>

                    <div className="legal-formatting-cheat">
                        <div className="cheat-title"><Info size={16}/> Guia de Formatação Jurídica:</div>
                        <div className="cheat-grid">
                            <div><code>[H]</code> <span>Título Secção</span></div>
                            <div><code>[P]</code> <span>Parágrafo</span></div>
                            <div><code>[LI]</code> <span>Item Lista</span></div>
                            <div><code>[UPD]</code> <span>Atualização</span></div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default FooterManager;