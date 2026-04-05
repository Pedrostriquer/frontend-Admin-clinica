import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./DownloadsStyle";
import blogGemCapitalAffiliateDownloads from "../../../../dbServices/blogGemCapitalAffiliateDownloads";

const Downloads = () => {
  const navigate = useNavigate();
  const [downloads, setDownloads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [orderBy, setOrderBy] = useState("createdAt");
  const [orderDirection, setOrderDirection] = useState("desc");
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    file: null,
  });
  const [uploading, setUploading] = useState(false);
  const fileInputRef = React.useRef(null);

  // Carregar downloads ao montar o componente ou quando filtros mudarem
  useEffect(() => {
    fetchDownloads();
  }, [page, pageSize, searchTerm, orderBy, orderDirection]);

  const fetchDownloads = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await blogGemCapitalAffiliateDownloads.search(
        searchTerm || null,
        page,
        pageSize,
        orderBy,
        orderDirection
      );
      setDownloads(response.data || []);
    } catch (err) {
      console.error("Erro ao carregar downloads:", err);
      setError("Erro ao carregar downloads. Tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja deletar este download?")) {
      return;
    }

    try {
      await blogGemCapitalAffiliateDownloads.delete(id);
      setDownloads(downloads.filter((d) => d.id !== id));
      alert("Download deletado com sucesso!");
    } catch (err) {
      console.error("Erro ao deletar download:", err);
      alert("Erro ao deletar download. Tente novamente.");
    }
  };

  const handleEdit = (id) => {
    navigate(`/platform/blog-gemcapital/downloads/${id}`);
  };

  const handleIncrementDownloads = async (id) => {
    try {
      const updated = await blogGemCapitalAffiliateDownloads.incrementDownloads(id);
      setDownloads(
        downloads.map((d) => (d.id === id ? updated : d))
      );
    } catch (err) {
      console.error("Erro ao incrementar downloads:", err);
      alert("Erro ao incrementar downloads.");
    }
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("Por favor, insira um nome para o download.");
      return;
    }

    if (!formData.file) {
      alert("Por favor, selecione um arquivo.");
      return;
    }

    try {
      setUploading(true);

      // 1. Fazer upload do arquivo
      const uploadResponse = await blogGemCapitalAffiliateDownloads.uploadFile(
        formData.file
      );
      const fileUrl = uploadResponse.fileUrl;

      // 2. Criar o download com a URL
      const downloadData = {
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        fileUrl,
      };

      const newDownload = await blogGemCapitalAffiliateDownloads.create(
        downloadData
      );

      // 3. Adicionar à lista
      setDownloads([newDownload, ...downloads]);

      // 4. Fechar modal e limpar formulário
      setShowModal(false);
      setFormData({
        name: "",
        description: "",
        file: null,
      });

      alert("Download criado com sucesso!");
    } catch (err) {
      console.error("Erro ao criar download:", err);
      alert("Erro ao criar download. Tente novamente.");
    } finally {
      setUploading(false);
    }
  };

  const handleCloseModal = () => {
    if (!uploading) {
      setShowModal(false);
      setFormData({
        name: "",
        description: "",
        file: null,
      });
    }
  };

  // Calcular estatísticas
  const totalItems = downloads.length;
  const totalActive = downloads.filter((d) => d.active).length;
  const totalInactive = downloads.filter((d) => !d.active).length;
  const totalDownloadsAllTime = downloads.reduce(
    (sum, d) => sum + d.totalDownloadsCount,
    0
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  return (
    <div style={styles.container}>
      {/* Header com Estatísticas */}
      <div style={styles.header}>
        <h1 style={styles.title}>Downloads - Drives de Afiliados</h1>
        <p style={styles.subtitle}>
          Gerencie os arquivos disponíveis para download dos afiliados
        </p>
      </div>

      {/* Cards de Estatísticas */}
      <div style={styles.statsContainer}>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>
            <i className="fa-solid fa-folder-open"></i>
          </div>
          <div style={styles.statContent}>
            <p style={styles.statLabel}>Total de Itens</p>
            <p style={styles.statValue}>{totalItems}</p>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={{ ...styles.statIcon, color: "#4CAF50" }}>
            <i className="fa-solid fa-check-circle"></i>
          </div>
          <div style={styles.statContent}>
            <p style={styles.statLabel}>Ativos</p>
            <p style={styles.statValue}>{totalActive}</p>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={{ ...styles.statIcon, color: "#FF9800" }}>
            <i className="fa-solid fa-times-circle"></i>
          </div>
          <div style={styles.statContent}>
            <p style={styles.statLabel}>Inativos</p>
            <p style={styles.statValue}>{totalInactive}</p>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={{ ...styles.statIcon, color: "#2196F3" }}>
            <i className="fa-solid fa-download"></i>
          </div>
          <div style={styles.statContent}>
            <p style={styles.statLabel}>Total de Downloads</p>
            <p style={styles.statValue}>{totalDownloadsAllTime}</p>
          </div>
        </div>
      </div>

      {/* Erro Alert */}
      {error && (
        <div
          style={{
            backgroundColor: "#ffebee",
            color: "#c62828",
            padding: "15px",
            borderRadius: "8px",
            marginBottom: "20px",
            border: "1px solid #ef5350",
          }}
        >
          <i className="fa-solid fa-exclamation-circle"></i> {error}
        </div>
      )}

      {/* Filtros e Busca */}
      <div style={styles.filtersContainer}>
        <div style={styles.filterGroup}>
          <input
            type="text"
            placeholder="Buscar por nome ou descrição..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            style={styles.searchInput}
          />
        </div>

        <div style={styles.filterGroup}>
          <label style={styles.filterLabel}>Ordenar por:</label>
          <select
            value={orderBy}
            onChange={(e) => {
              setOrderBy(e.target.value);
              setPage(1);
            }}
            style={styles.filterSelect}
          >
            <option value="createdAt">Data de Criação</option>
            <option value="totalDownloadsCount">Total de Downloads</option>
          </select>
        </div>

        <div style={styles.filterGroup}>
          <label style={styles.filterLabel}>Ordem:</label>
          <select
            value={orderDirection}
            onChange={(e) => {
              setOrderDirection(e.target.value);
              setPage(1);
            }}
            style={styles.filterSelect}
          >
            <option value="desc">Descendente</option>
            <option value="asc">Ascendente</option>
          </select>
        </div>

        {searchTerm && (
          <button
            onClick={() => {
              setSearchTerm("");
              setPage(1);
            }}
            style={styles.clearButton}
          >
            <i className="fa-solid fa-times"></i> Limpar busca
          </button>
        )}
      </div>

      {/* Tabela de Downloads */}
      <div style={styles.tableContainer}>
        <div style={styles.tableHeader}>
          <h2 style={styles.tableTitle}>Arquivos Disponíveis</h2>
          <button
            style={styles.addButton}
            onClick={() => setShowModal(true)}
          >
            <i className="fa-solid fa-plus"></i> Novo Download
          </button>
        </div>

        {loading ? (
          <div
            style={{
              padding: "40px",
              textAlign: "center",
              color: "#999",
            }}
          >
            <i
              className="fa-solid fa-spinner"
              style={{ animation: "spin 1s linear infinite", marginRight: "10px" }}
            ></i>
            Carregando downloads...
          </div>
        ) : downloads.length === 0 ? (
          <div
            style={{
              padding: "40px",
              textAlign: "center",
              color: "#999",
            }}
          >
            <i className="fa-solid fa-folder-open" style={{ fontSize: "24px", marginBottom: "10px", display: "block" }}></i>
            Nenhum download encontrado
          </div>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeaderRow}>
                <th style={styles.tableHeaderCell}>Nome</th>
                <th style={styles.tableHeaderCell}>Descrição</th>
                <th style={styles.tableHeaderCell}>Downloads</th>
                <th style={styles.tableHeaderCell}>Status</th>
                <th style={styles.tableHeaderCell}>Criado em</th>
                <th style={styles.tableHeaderCell}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {downloads.map((download) => (
                <tr key={download.id} style={styles.tableRow}>
                  <td style={styles.tableCell}>
                    <div style={styles.nameCell}>
                      <i className="fa-solid fa-file"></i>
                      <span>{download.name}</span>
                    </div>
                  </td>
                  <td style={styles.tableCell}>
                    <span style={styles.descriptionText}>
                      {download.description}
                    </span>
                  </td>
                  <td style={styles.tableCell}>
                    <button
                      onClick={() => handleIncrementDownloads(download.id)}
                      style={{
                        ...styles.downloadCount,
                        border: "none",
                        cursor: "pointer",
                      }}
                      title="Clique para registrar um download"
                    >
                      {download.totalDownloadsCount}
                    </button>
                  </td>
                  <td style={styles.tableCell}>
                    <span
                      style={{
                        ...styles.statusBadge,
                        ...(download.active
                          ? styles.statusBadgeActive
                          : styles.statusBadgeInactive),
                      }}
                    >
                      {download.active ? "Ativo" : "Inativo"}
                    </span>
                  </td>
                  <td style={styles.tableCell}>
                    {formatDate(download.createdAt)}
                  </td>
                  <td style={styles.tableCell}>
                    <div style={styles.actionsCell}>
                      <button
                        style={styles.actionButton}
                        title="Ver Leads"
                        onClick={() => navigate(`/platform/blog-gemcapital/downloads/${download.id}/leads`)}
                      >
                        <i className="fa-solid fa-users"></i>
                      </button>
                      <button
                        style={styles.actionButton}
                        title="Editar"
                        onClick={() => handleEdit(download.id)}
                      >
                        <i className="fa-solid fa-edit"></i>
                      </button>
                      <button
                        style={styles.actionButton}
                        title="Deletar"
                        onClick={() => handleDelete(download.id)}
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal de Criar Novo Download */}
      {showModal && (
        <div style={styles.modalBackdrop} onClick={handleCloseModal}>
          <div
            style={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Criar Novo Download</h2>
              <button
                style={styles.modalCloseBtn}
                onClick={handleCloseModal}
                disabled={uploading}
              >
                ×
              </button>
            </div>

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
                  disabled={uploading}
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
                  disabled={uploading}
                  rows="3"
                />
              </div>

              {/* Seletor de Arquivo */}
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Arquivo *</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                  disabled={uploading}
                  required
                />
                <div
                  style={styles.fileInputLabel}
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.currentTarget.style.backgroundColor = "#e3f2fd";
                    e.currentTarget.style.borderColor = "#1976D2";
                  }}
                  onDragLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#f0f8ff";
                    e.currentTarget.style.borderColor = "#2196F3";
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    const file = e.dataTransfer.files[0];
                    if (file) {
                      setFormData((prev) => ({
                        ...prev,
                        file,
                      }));
                    }
                    e.currentTarget.style.backgroundColor = "#f0f8ff";
                    e.currentTarget.style.borderColor = "#2196F3";
                  }}
                >
                  <i className="fa-solid fa-cloud-arrow-up"></i>
                  <span>
                    {formData.file
                      ? formData.file.name
                      : "Clique ou arraste um arquivo"}
                  </span>
                </div>
              </div>

              {/* Botões */}
              <div style={styles.formActions}>
                <button
                  type="button"
                  style={styles.cancelButton}
                  onClick={handleCloseModal}
                  disabled={uploading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={styles.submitButton}
                  disabled={uploading}
                >
                  {uploading ? (
                    <>
                      <i
                        className="fa-solid fa-spinner"
                        style={{ animation: "spin 1s linear infinite", marginRight: "8px" }}
                      ></i>
                      Enviando...
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-upload" style={{ marginRight: "8px" }}></i>
                      Criar Download
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Downloads;
