import React, { useState, useEffect } from "react";
import { useLoad } from "../../../../Context/LoadContext";
import { useToast } from "../../../../Components/Toast/ToastContainer";
import {
  styles,
  emailPreviewStyles,
  spinnerStyles,
} from "./BlogGemCapitalCampaignStyle";
import PostSelectionModal from "../Settings/PostSelectionModal";
import gemCapitalBlogCampaignService from "../../../../dbServices/gemCapitalBlogCampaignService";
import gemCapitalBlogServices from "../../../../dbServices/gemCapitalBlogServices";

export default function BlogGemCapitalCampaign() {
  const { startLoading, stopLoading } = useLoad();
  const toast = useToast();

  const [modoSelecao, setModoSelecao] = useState("manual");
  const [formData, setFormData] = useState({
    internalTitle: "",
    emailSubject: "",
    previewText: "",
    isAutomatic: false,
    featuredPostId: null,
    secondaryPost1Id: null,
    secondaryPost2Id: null,
    secondaryPost3Id: null,
  });

  const [postsReais, setPostsReais] = useState({
    artigoDestaque: null,
    artigoSecundario1: null,
    artigoSecundario2: null,
    artigoSecundario3: null,
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedField, setSelectedField] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const dataFormatada = new Date().toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).toUpperCase();

  const truncateHtml = (html, maxLength = 500) => {
    if (!html) return "";
    const div = document.createElement("div");
    div.innerHTML = html;
    let text = div.textContent || div.innerText || "";
    return text.substring(0, maxLength);
  };

  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.textContent = spinnerStyles + emailPreviewStyles;
    document.head.appendChild(styleSheet);
    return () => document.head.removeChild(styleSheet);
  }, []);

  useEffect(() => {
    fetchCampaignConfig();
  }, []);

  const fetchCampaignConfig = async () => {
    try {
      startLoading();
      setLoading(true);
      const config = await gemCapitalBlogCampaignService.getCampaignConfig();
      setFormData({
        internalTitle: config.internalTitle || "",
        emailSubject: config.emailSubject || "",
        previewText: config.previewText || "",
        isAutomatic: config.isAutomatic || false,
        featuredPostId: config.featuredPostId || null,
        secondaryPost1Id: config.secondaryPost1Id || null,
        secondaryPost2Id: config.secondaryPost2Id || null,
        secondaryPost3Id: config.secondaryPost3Id || null,
      });

      // Carrega os dados reais dos posts se houver IDs salvos
      const postsToLoad = {
        artigoDestaque: config.featuredPostId,
        artigoSecundario1: config.secondaryPost1Id,
        artigoSecundario2: config.secondaryPost2Id,
        artigoSecundario3: config.secondaryPost3Id,
      };

      const newPostsReais = { ...postsReais };
      for (const [key, postId] of Object.entries(postsToLoad)) {
        if (postId) {
          try {
            const postData = await gemCapitalBlogServices.getPostById(postId);
            newPostsReais[key] = postData;
          } catch (error) {
            console.error(`Erro ao carregar post ${key}:`, error);
            newPostsReais[key] = null;
          }
        }
      }
      setPostsReais(newPostsReais);

      // Atualiza o modo de seleção baseado na configuração
      setModoSelecao(config.isAutomatic ? "automatico" : "manual");
    } catch (error) {
      console.error("Erro ao carregar configuração:", error);
      toast.error("Erro ao carregar configuração da campanha");
    } finally {
      stopLoading();
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const openPostModal = (field) => {
    setSelectedField(field);
    setModalOpen(true);
  };

  const fieldMap = {
    artigoDestaque: "featuredPostId",
    artigoSecundario1: "secondaryPost1Id",
    artigoSecundario2: "secondaryPost2Id",
    artigoSecundario3: "secondaryPost3Id",
  };

  const handlePostSelect = (post) => {
    const formField = fieldMap[selectedField];
    setFormData((prev) => ({
      ...prev,
      [formField]: post.id,
    }));
    setPostsReais((prev) => ({
      ...prev,
      [selectedField]: post,
    }));
    setModalOpen(false);
    setSelectedField(null);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      startLoading();
      // Sincroniza o isAutomatic com o modo de seleção antes de salvar
      const configToSave = {
        ...formData,
        isAutomatic: modoSelecao === "automatico",
      };
      await gemCapitalBlogCampaignService.updateCampaignConfig(configToSave);
      toast.success("Campanha salva com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar:", error);
      toast.error("Erro ao salvar campanha");
    } finally {
      setSaving(false);
      stopLoading();
    }
  };

  if (loading) {
    return (
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        background: "#f8fafc",
      }}>
        <div style={{
          width: "40px",
          height: "40px",
          border: "3px solid #e2e8f0",
          borderTop: "3px solid #6366f1",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
          marginBottom: "16px",
        }}></div>
        <p style={{ color: "#64748b", fontSize: "14px" }}>Carregando campanha...</p>
      </div>
    );
  }

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
              name="internalTitle"
              value={formData.internalTitle}
              onChange={handleInputChange}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>ASSUNTO DO E-MAIL</label>
            <input
              style={styles.input}
              name="emailSubject"
              value={formData.emailSubject}
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
              name="previewText"
              value={formData.previewText}
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
                  <div style={styles.fieldWithButton}>
                    <input
                      type="text"
                      style={styles.select}
                      value={postsReais.artigoDestaque?.title || "Nenhum post selecionado"}
                      readOnly
                      placeholder="Nenhum post selecionado"
                    />
                    <button
                      style={styles.btnBuscar}
                      onClick={() => openPostModal("artigoDestaque")}
                      title="Buscar post real"
                    >
                      <i className="fa-solid fa-search"></i>
                    </button>
                  </div>
                  {postsReais.artigoDestaque && (
                    <small style={styles.selectedText}>
                      ✓ {postsReais.artigoDestaque.title}
                    </small>
                  )}
                </div>

                <div style={styles.manualField}>
                  <label style={styles.manualLabel}>Artigo secundário 1</label>
                  <div style={styles.fieldWithButton}>
                    <input
                      type="text"
                      style={styles.select}
                      value={postsReais.artigoSecundario1?.title || "Nenhum post selecionado"}
                      readOnly
                      placeholder="Nenhum post selecionado"
                    />
                    <button
                      style={styles.btnBuscar}
                      onClick={() => openPostModal("artigoSecundario1")}
                      title="Buscar post real"
                    >
                      <i className="fa-solid fa-search"></i>
                    </button>
                  </div>
                  {postsReais.artigoSecundario1 && (
                    <small style={styles.selectedText}>
                      ✓ {postsReais.artigoSecundario1.title}
                    </small>
                  )}
                </div>

                <div style={styles.manualField}>
                  <label style={styles.manualLabel}>
                    Artigo secundário 2{" "}
                    <span style={styles.optionalText}>(opcional)</span>
                  </label>
                  <div style={styles.fieldWithButton}>
                    <input
                      type="text"
                      style={styles.select}
                      value={postsReais.artigoSecundario2?.title || "Nenhum post selecionado"}
                      readOnly
                      placeholder="Nenhum post selecionado"
                    />
                    <button
                      style={styles.btnBuscar}
                      onClick={() => openPostModal("artigoSecundario2")}
                      title="Buscar post real"
                    >
                      <i className="fa-solid fa-search"></i>
                    </button>
                  </div>
                  {postsReais.artigoSecundario2 && (
                    <small style={styles.selectedText}>
                      ✓ {postsReais.artigoSecundario2.title}
                    </small>
                  )}
                </div>

                <div style={styles.manualField}>
                  <label style={styles.manualLabel}>
                    Artigo secundário 3{" "}
                    <span style={styles.optionalText}>(opcional)</span>
                  </label>
                  <div style={styles.fieldWithButton}>
                    <input
                      type="text"
                      style={styles.select}
                      value={postsReais.artigoSecundario3?.title || "Nenhum post selecionado"}
                      readOnly
                      placeholder="Nenhum post selecionado"
                    />
                    <button
                      style={styles.btnBuscar}
                      onClick={() => openPostModal("artigoSecundario3")}
                      title="Buscar post real"
                    >
                      <i className="fa-solid fa-search"></i>
                    </button>
                  </div>
                  {postsReais.artigoSecundario3 && (
                    <small style={styles.selectedText}>
                      ✓ {postsReais.artigoSecundario3.title}
                    </small>
                  )}
                </div>
              </div>
            )}
          </div>

          <div style={styles.actions}>
            <button
              style={styles.btnSave}
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Salvando..." : "Salvar campanha"}
            </button>
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
              {formData.emailSubject.replace("{{date}}", dataFormatada)}
            </p>
            <p style={styles.summaryItem}>
              <strong>Hero:</strong>{" "}
              {postsReais.artigoDestaque?.title || "Nenhum post selecionado"}
            </p>
            <p style={styles.summaryItem}>
              <strong>Secundários:</strong>{" "}
              {
                [
                  postsReais.artigoSecundario1,
                  postsReais.artigoSecundario2,
                  postsReais.artigoSecundario3,
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
              <div className="email-header" style={{ background: "#122C4F", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <img
                  src="/img/logo-gemcapital.png"
                  alt="Logo"
                  style={{ width: "150px", height: "auto" }}
                />
                <span style={{ color: "#C9A96E", fontSize: "16px", fontWeight: "600", marginRight: "20px" }}>
                  O QUE VOCÊ PRECISA SABER HOJE
                </span>
              </div>
              <div className="email-content">
                <span className="category-label">
                  {postsReais.artigoDestaque?.categories?.[0]?.name?.toUpperCase() || "ARTIGO DESTAQUE"}
                </span>
                <span className="date-label">
                  {postsReais.artigoDestaque?.publishedAt
                    ? new Date(
                        postsReais.artigoDestaque.publishedAt
                      ).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })
                    : dataFormatada}
                </span>
                <h1 className="hero-title">
                  {postsReais.artigoDestaque?.title || "Selecione um artigo destaque"}
                </h1>
                {postsReais.artigoDestaque?.featuredImage ? (
                  <>
                    <img
                      src={postsReais.artigoDestaque.featuredImage}
                      alt="Hero"
                      className="hero-image"
                    />
                  </>
                ) : (
                  <img
                    src="https://images.unsplash.com/photo-1518546305927-5a555bb7020d?q=80&w=1000"
                    alt="Hero"
                    className="hero-image"
                  />
                )}
                {postsReais.artigoDestaque?.content ? (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: postsReais.artigoDestaque.content
                        .split("</p>")
                        .slice(0, 2)
                        .join("</p>"),
                    }}
                    className="hero-excerpt"
                  />
                ) : (
                  <p className="hero-excerpt">
                    {postsReais.artigoDestaque?.excerpt ||
                      "Conteúdo dinâmico baseado no artigo selecionado acima..."}
                  </p>
                )}
                <button className="btn-read-more">CONTINUE LENDO</button>
                <div className="divider"></div>
                <h3 className="section-title">MAIS LEITURAS</h3>
                {[
                  { id: formData.secondaryPost1Id, key: "artigoSecundario1" },
                  { id: formData.secondaryPost2Id, key: "artigoSecundario2" },
                  { id: formData.secondaryPost3Id, key: "artigoSecundario3" },
                ]
                  .filter((item) => item.id)
                  .map((item, i) => {
                    const postReal = postsReais[item.key];
                    return (
                      <div key={i} className="secondary-post">
                        {postReal?.featuredImage ? (
                          <img
                            src={postReal.featuredImage}
                            alt="thumb"
                            className="post-thumb"
                          />
                        ) : (
                          <img
                            src={`https://images.unsplash.com/photo-1633156189757-4f49c18310c1?q=80&w=200`}
                            alt="thumb"
                            className="post-thumb"
                          />
                        )}
                        <div className="post-info">
                          <span className="post-category">
                            {postReal?.categories?.[0]?.name?.toUpperCase() || "ARTIGO"}
                          </span>
                          <h4 className="post-title">
                            {postReal?.title || "Post não carregado"}
                          </h4>
                          <span className="post-link">Leia mais →</span>
                        </div>
                      </div>
                    );
                  })}
              </div>
              <div className="email-footer">
                <img
                  src="/img/logo-gemcapital.png"
                  alt="GemCapital"
                  style={{ display: "block", margin: "0 auto 20px", width: 150, height: 150 }}
                />
                <p>
                  Perspectivas GemCapital · Inteligência editorial sobre patrimônio, mercado e ativos reais.
                </p>
                <p>
                  Uma iniciativa Gemas Brilhantes, especialistas em ativos reais desde 2023.
                </p>
                <p>
                  <a href="#" style={{ color: "#C9A96E" }}>Visitar o site</a> • <a href="#" style={{ color: "#C9A96E" }}>Cancelar inscrição</a>
                </p>
                <p>
                  Aviso legal: conteúdo exclusivamente informativo, sem promessa de rentabilidade ou recomendação individual de investimento.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <PostSelectionModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedField(null);
        }}
        onSelectPost={handlePostSelect}
        modalTitle={`Selecionar Post - ${
          {
            artigoDestaque: "Destaque",
            artigoSecundario1: "Secundário 1",
            artigoSecundario2: "Secundário 2",
            artigoSecundario3: "Secundário 3",
          }[selectedField] || "Post"
        }`}
      />
    </div>
  );
}
