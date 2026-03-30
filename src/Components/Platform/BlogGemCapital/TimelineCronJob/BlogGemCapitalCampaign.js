import React, { useState, useEffect } from "react";
import {
  styles,
  emailPreviewStyles,
  spinnerStyles,
} from "./BlogGemCapitalCampaignStyle";

export default function BlogGemCapitalCampaign() {
  const [modoSelecao, setModoSelecao] = useState("automatico");
  const [formData, setFormData] = useState({
    tituloInterno: "O que você precisa saber hoje",
    assuntoEmail: "O que você precisa saber hoje — {{date}}",
    textoPreview:
      "Os destaques editoriais da semana na Perspectivas GemCapital.",
    artigoDestaque: "1",
    artigoSecundario1: "2",
    artigoSecundario2: "",
    artigoSecundario3: "",
  });

  const dataFormatada = "30 DE MARÇO DE 2026";

  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.textContent = spinnerStyles + emailPreviewStyles;
    document.head.appendChild(styleSheet);
    return () => document.head.removeChild(styleSheet);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const mockArtigos = [
    {
      id: "1",
      titulo:
        "Por que o ouro bateu US$ 5.000, e o que isso diz sobre o sistema financeiro global",
    },
    { id: "2", titulo: "O que são gemas de grau de investimento?" },
    { id: "3", titulo: "Mercado de joias de luxo projeta dobrar até 2033" },
    { id: "4", titulo: "Brasil exportou US$ 290 mi em gemas em 2024" },
  ];

  return (
    <div style={styles.container}>
      <div style={styles.pageHeader}>
        <h1 style={styles.pageTitle}>Editar edição</h1>
        <p style={styles.pageSubtitle}>
          Configure os detalhes da newsletter e visualize o resultado final
          antes do disparo.
        </p>
      </div>

      <div style={styles.mainLayout}>
        <div style={styles.configColumn}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>TÍTULO INTERNO</label>
            <input
              style={styles.input}
              name="tituloInterno"
              value={formData.tituloInterno}
              onChange={handleInputChange}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>ASSUNTO DO E-MAIL</label>
            <input
              style={styles.input}
              name="assuntoEmail"
              value={formData.assuntoEmail}
              onChange={handleInputChange}
            />
            <small style={styles.helperText}>
              Use {"{{date}}"} para inserir a data automaticamente.
            </small>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>TEXTO DE PREVIEW</label>
            <textarea
              style={{ ...styles.input, height: "80px", resize: "none" }}
              name="textoPreview"
              value={formData.textoPreview}
              onChange={handleInputChange}
            />
          </div>

          <div style={styles.selectionCard}>
            <div style={styles.selectionHeader}>
              <div>
                <h3 style={styles.selectionTitle}>Modo de seleção</h3>
                <p style={styles.selectionDesc}>
                  {modoSelecao === "automatico"
                    ? "Escolhe os melhores artigos dos últimos 7 dias automaticamente."
                    : "Permite definir manualmente o hero e os 3 secundários."}
                </p>
              </div>
              <button
                style={styles.btnToggle}
                onClick={() =>
                  setModoSelecao(
                    modoSelecao === "automatico" ? "manual" : "automatico"
                  )
                }
              >
                <i
                  className={`fa-solid ${
                    modoSelecao === "automatico"
                      ? "fa-hand-pointer"
                      : "fa-robot"
                  }`}
                ></i>
                {modoSelecao === "automatico"
                  ? "Trocar para manual"
                  : "Trocar para automático"}
              </button>
            </div>

            {modoSelecao === "automatico" ? (
              <div style={styles.autoBadge}>
                <i className="fa-solid fa-circle-info"></i>
                Hero sugerido: Bitcoin em Queda Livre: O Que Está Por Trás do
                Recuo...
              </div>
            ) : (
              <div style={styles.manualSelectionArea}>
                <div style={styles.manualField}>
                  <label style={styles.manualLabel}>Artigo destaque</label>
                  <select
                    style={styles.select}
                    name="artigoDestaque"
                    value={formData.artigoDestaque}
                    onChange={handleInputChange}
                  >
                    {mockArtigos.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.titulo}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={styles.manualField}>
                  <label style={styles.manualLabel}>Artigo secundário 1</label>
                  <select
                    style={styles.select}
                    name="artigoSecundario1"
                    value={formData.artigoSecundario1}
                    onChange={handleInputChange}
                  >
                    {mockArtigos.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.titulo}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={styles.manualField}>
                  <label style={styles.manualLabel}>
                    Artigo secundário 2{" "}
                    <span style={styles.optionalText}>(opcional)</span>
                  </label>
                  <select
                    style={styles.select}
                    name="artigoSecundario2"
                    value={formData.artigoSecundario2}
                    onChange={handleInputChange}
                  >
                    <option value="">Nenhum selecionado</option>
                    {mockArtigos.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.titulo}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={styles.manualField}>
                  <label style={styles.manualLabel}>
                    Artigo secundário 3{" "}
                    <span style={styles.optionalText}>(opcional)</span>
                  </label>
                  <select
                    style={styles.select}
                    name="artigoSecundario3"
                    value={formData.artigoSecundario3}
                    onChange={handleInputChange}
                  >
                    <option value="">Nenhum selecionado</option>
                    {mockArtigos.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.titulo}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          <div style={styles.actions}>
            <button style={styles.btnSave}>Salvar campanha</button>
            <button style={styles.btnSecondary}>Ocultar preview</button>
            <button style={styles.btnCancel}>Cancelar</button>
          </div>
        </div>

        <div style={styles.previewColumn}>
          <div style={styles.summaryHeader}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h3 style={styles.summaryTitle}>Resumo da edição</h3>
              <span
                style={
                  modoSelecao === "automatico"
                    ? styles.tagAuto
                    : styles.tagManual
                }
              >
                {modoSelecao === "automatico" ? "Automático" : "Manual"}
              </span>
            </div>
            <p style={styles.summaryItem}>
              <strong>Assunto:</strong>{" "}
              {formData.assuntoEmail.replace("{{date}}", "18 de março de 2026")}
            </p>
            <p style={styles.summaryItem}>
              <strong>Hero:</strong>{" "}
              {
                mockArtigos.find((a) => a.id === formData.artigoDestaque)
                  ?.titulo
              }
            </p>
            <p style={styles.summaryItem}>
              <strong>Secundários:</strong>{" "}
              {
                [
                  formData.artigoSecundario1,
                  formData.artigoSecundario2,
                  formData.artigoSecundario3,
                ].filter(Boolean).length
              }
              /3
            </p>
          </div>

          <div style={styles.emailContainer}>
            <div style={styles.browserHeader}>
              <span style={{ ...styles.dot, background: "#FF5F56" }}></span>
              <span style={{ ...styles.dot, background: "#FFBD2E" }}></span>
              <span style={{ ...styles.dot, background: "#27C93F" }}></span>
            </div>

            <div className="email-body">
              <div className="email-header">
                <img
                  src="https://gemcapital.com.br/wp-content/uploads/2024/05/logo-gem-capital-white.png"
                  alt="Logo"
                  style={{ width: "40px" }}
                />
              </div>
              <div className="email-content">
                <span className="category-label">ARTIGO DESTAQUE</span>
                <span className="date-label">{dataFormatada}</span>
                <h1 className="hero-title">
                  {
                    mockArtigos.find((a) => a.id === formData.artigoDestaque)
                      ?.titulo
                  }
                </h1>
                <p className="hero-excerpt">
                  Conteúdo dinâmico baseado no artigo selecionado acima...
                </p>
                <img
                  src="https://images.unsplash.com/photo-1518546305927-5a555bb7020d?q=80&w=1000"
                  alt="Hero"
                  className="hero-image"
                />
                <button className="btn-read-more">CONTINUE LENDO</button>
                <div className="divider"></div>
                <h3 className="section-title">MAIS LEITURAS</h3>
                {[
                  formData.artigoSecundario1,
                  formData.artigoSecundario2,
                  formData.artigoSecundario3,
                ]
                  .filter(Boolean)
                  .map((id, i) => (
                    <div key={i} className="secondary-post">
                      <img
                        src={`https://images.unsplash.com/photo-1633156189757-4f49c18310c1?q=80&w=200`}
                        alt="thumb"
                        className="post-thumb"
                      />
                      <div className="post-info">
                        <span className="post-category">EDUCAÇÃO</span>
                        <h4 className="post-title">
                          {mockArtigos.find((a) => a.id === id)?.titulo}
                        </h4>
                        <span className="post-link">Leia mais →</span>
                      </div>
                    </div>
                  ))}
              </div>
              <div className="email-footer">
                <p>
                  Perspectivas GemCapital - Inteligência editorial sobre
                  patrimônio e mercado.
                </p>
                <p>Uma iniciativa Gemas Brilhantes.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
