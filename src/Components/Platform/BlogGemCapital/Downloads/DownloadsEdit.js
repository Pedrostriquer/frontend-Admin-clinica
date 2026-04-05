import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./DownloadsStyle";
import blogGemCapitalAffiliateDownloads from "../../../../dbServices/blogGemCapitalAffiliateDownloads";

const DownloadsEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    file: null,
    fileUrl: "",
  });

  const [originalFileUrl, setOriginalFileUrl] = useState("");
  const fileInputRef = React.useRef(null);

  // Carregar dados do download
  useEffect(() => {
    const fetchDownload = async () => {
      try {
        setLoading(true);
        const data = await blogGemCapitalAffiliateDownloads.getById(id);
        setFormData({
          name: data.name,
          description: data.description || "",
          file: null,
          fileUrl: data.fileUrl,
        });
        setOriginalFileUrl(data.fileUrl);
      } catch (err) {
        console.error("Erro ao carregar download:", err);
        setError("Erro ao carregar dados do download.");
      } finally {
        setLoading(false);
      }
    };

    fetchDownload();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        file,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("Por favor, insira um nome para o download.");
      return;
    }

    try {
      setSaving(true);
      setError(null);

      let fileUrl = formData.fileUrl;

      // Se selecionou novo arquivo, fazer upload
      if (formData.file) {
        const uploadResponse = await blogGemCapitalAffiliateDownloads.uploadFile(
          formData.file
        );
        fileUrl = uploadResponse.fileUrl;
      }

      // Preparar dados para atualização
      const updateData = {
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        fileUrl,
      };

      // Atualizar no backend
      await blogGemCapitalAffiliateDownloads.update(id, updateData);

      // Se a mídia foi alterada, deletar a antiga
      if (formData.file && originalFileUrl && originalFileUrl !== fileUrl) {
        try {
          await blogGemCapitalAffiliateDownloads.deleteFile(originalFileUrl);
        } catch (err) {
          console.warn("Aviso: Não foi possível deletar o arquivo antigo:", err);
          // Não bloqueamos a operação se o delete falhar
        }
      }

      alert("Download atualizado com sucesso!");
      navigate("/platform/blog-gemcapital/downloads");
    } catch (err) {
      console.error("Erro ao atualizar download:", err);
      setError("Erro ao atualizar download. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={{ padding: "40px", textAlign: "center", color: "#999" }}>
          <i
            className="fa-solid fa-spinner"
            style={{ animation: "spin 1s linear infinite", marginRight: "10px" }}
          ></i>
          Carregando...
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button
          onClick={() => navigate("/platform/blog-gemcapital/downloads")}
          style={styles.backButton}
        >
          <i className="fa-solid fa-arrow-left"></i> Voltar
        </button>
        <h1 style={styles.title}>Editar Download</h1>
      </div>

      {/* Formulário */}
      <div style={styles.editFormContainer}>
        {error && (
          <div style={styles.errorAlert}>
            <i className="fa-solid fa-exclamation-circle"></i> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Nome */}
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Nome *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Ex: Planilha de Investimento"
              style={styles.formInput}
              disabled={saving}
              required
            />
          </div>

          {/* Descrição */}
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Descrição</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Ex: Descrição do arquivo..."
              style={styles.formTextarea}
              disabled={saving}
              rows="3"
            />
          </div>

          {/* URL da Mídia Atual */}
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Mídia Atual</label>
            <div style={styles.currentFileInfo}>
              <i className="fa-solid fa-file"></i>
              <div>
                <p style={styles.currentFileName}>
                  {formData.fileUrl.split("/").pop() || "Sem arquivo"}
                </p>
                <a
                  href={formData.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={styles.fileLink}
                >
                  Abrir arquivo
                </a>
              </div>
            </div>
          </div>

          {/* Novo Arquivo */}
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Alterar Mídia</label>
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              style={{ display: "none" }}
              disabled={saving}
            />
            <div
              style={{
                ...styles.fileInputLabel,
                backgroundColor: formData.file ? "#c8e6c9" : "#f0f8ff",
                borderColor: formData.file ? "#4CAF50" : "#2196F3",
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              <i className="fa-solid fa-cloud-arrow-up"></i>
              <span>
                {formData.file
                  ? formData.file.name
                  : "Clique para selecionar novo arquivo"}
              </span>
            </div>
            <p style={styles.fileHint}>
              ⚠️ Deixe em branco para manter o arquivo atual
            </p>
          </div>

          {/* Botões */}
          <div style={styles.formActions}>
            <button
              type="button"
              style={styles.cancelButton}
              onClick={() =>
                navigate("/platform/blog-gemcapital/downloads")
              }
              disabled={saving}
            >
              Cancelar
            </button>
            <button
              type="submit"
              style={styles.submitButton}
              disabled={saving}
            >
              {saving ? (
                <>
                  <i
                    className="fa-solid fa-spinner"
                    style={{
                      animation: "spin 1s linear infinite",
                      marginRight: "8px",
                    }}
                  ></i>
                  Salvando...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-save" style={{ marginRight: "8px" }}></i>
                  Salvar Alterações
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default DownloadsEdit;
