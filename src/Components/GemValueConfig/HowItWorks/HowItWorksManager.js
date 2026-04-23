import React, { useState, useEffect } from 'react';
import {
  Gem, FileSignature, ShieldCheck, Vault, TrendingUp,
  Gavel, Check, Save, Eye
} from 'lucide-react';
import gemValueService from '../../../dbServices/gemValueService';
import './HowItWorksManager.css';

const HowItWorksManager = () => {
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [steps, setSteps] = useState([]);
    const [originalSteps, setOriginalSteps] = useState([]);
    const [isDirty, setIsDirty] = useState(false);

    const sessionKeys = ['how_it_works_steps_list'];

    const staticTitles = [
        "SELEÇÃO DA GEMA",
        "CONTRATO DE COMPRA E VENDA",
        "A GEMA PASSA A SER SUA",
        "VOCÊ ESCOLHE ONDE GUARDAR",
        "ACOMPANHE A VALORIZAÇÃO",
        "VOCÊ DECIDE O QUE FAZER"
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
            const filtered = allTexts.find(item => item.sessionName === 'how_it_works_steps_list');

            const rawSteps = filtered?.textContent || "";
            const parsedSteps = rawSteps
                ? rawSteps.split('|').map((item, index) => {
                    const [, desc] = item.split('::');
                    return {
                        id: String(index + 1).padStart(2, '0'),
                        title: staticTitles[index] || "",
                        desc: desc?.trim() || ""
                    };
                })
                : staticTitles.map((title, index) => ({
                    id: String(index + 1).padStart(2, '0'),
                    title: title,
                    desc: ""
                }));

            setSteps(parsedSteps);
            setOriginalSteps([...parsedSteps]);
        } catch (error) {
            alert('❌ Erro ao carregar Como Funciona');
        } finally {
            setLoading(false);
        }
    };

    const handleStepChange = (index, value) => {
        const newSteps = [...steps];
        newSteps[index].desc = value;
        setSteps(newSteps);
        setIsDirty(true);
    };

    const hasChanges = () => isDirty;

    const saveAll = async () => {
        try {
            setIsSaving(true);
            const content = steps.map(s => `${s.title} :: ${s.desc}`).join(' | ');

            const record = await gemValueService.getAllTexts();
            const existing = record.find(item => item.sessionName === 'how_it_works_steps_list');

            if (existing?.id) {
                await gemValueService.updateText(existing.id, 'how_it_works_steps_list', content);
            } else {
                await gemValueService.createText('how_it_works_steps_list', content);
            }

            alert('✅ Como Funciona atualizado com sucesso!');
            setIsDirty(false);
            setTimeout(() => loadData(), 500);
        } catch (error) {
            alert('❌ Erro ao salvar alterações');
            console.error('Erro detalhado:', error);
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) return <div className="admin-loading">Carregando Como Funciona...</div>;

    return (
        <div className="how-editor-container">
            <header className="editor-top-bar">
                <div className="editor-info">
                    <Eye size={20} className="text-blue-500" />
                    <div>
                        <h2>Editor Visual: Como Funciona</h2>
                        <p>Edite apenas as descrições dos passos.</p>
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

            <div className="how-editor-layout">
                {/* EDITOR DE PASSOS */}
                <main className="how-steps-editor">
                    <div className="admin-section-label">Descrições dos Passos</div>
                    <div className="how-steps-stack">
                        {steps.map((step, index) => (
                            <div key={index} className="admin-process-card">
                                <div className="admin-process-header">
                                    <div className="admin-process-icon">
                                        {staticIcons[index] || <Check size={20} />}
                                    </div>
                                    <span className="admin-process-id">{step.id}</span>
                                </div>
                                <div className="admin-process-label">{step.title}</div>
                                <textarea
                                    className="admin-process-input-desc"
                                    value={step.desc}
                                    onChange={(e) => handleStepChange(index, e.target.value)}
                                    placeholder="Descrição do passo..."
                                    rows={3}
                                />
                            </div>
                        ))}
                    </div>
                    <div className="admin-info-note" style={{ marginTop: '24px' }}>
                        <Eye size={16} />
                        <span>Apenas o texto de cada passo é editável. Títulos, ícones e ordem são fixos.</span>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default HowItWorksManager;