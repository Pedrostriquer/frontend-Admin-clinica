import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "../../../../Components/Toast/ToastContainer";
import gemCapitalBlogCampaignService from "../../../../dbServices/gemCapitalBlogCampaignService";
import {
  styles,
  spinnerStyles,
  mergeStyles,
} from "./BlogGemCapitalExecutionDetailPageStyle";

export default function BlogGemCapitalExecutionDetailPage() {
  const navigate = useNavigate();
  const { executionId } = useParams();
  const toast = useToast();

  const [execution, setExecution] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recipients, setRecipients] = useState([]);
  const [filteredRecipients, setFilteredRecipients] = useState([]);

  const [filters, setFilters] = useState({
    page: 1,
    pageSize: 15,
    status: "all", // all, success, failed
    interaction: "all", // all, viewed, clicked, notInteracted
    search: "",
  });

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });

  const [tabActiveEmail, setTabActiveEmail] = useState(true);

  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.textContent = spinnerStyles;
    document.head.appendChild(styleSheet);
    return () => document.head.removeChild(styleSheet);
  }, []);

  useEffect(() => {
    fetchExecutionDetail();
  }, [executionId]);

  useEffect(() => {
    applyFilters();
  }, [recipients, filters]);

  const fetchExecutionDetail = async () => {
    try {
      setLoading(true);
      const data = await gemCapitalBlogCampaignService.getExecutionDetail(
        executionId
      );
      setExecution(data.execution);
      setRecipients(data.recipients);
    } catch (error) {
      console.error("Erro ao carregar detalhes da execução:", error);
      toast.error("Erro ao carregar detalhes");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...recipients];

    // Filtrar por status
    if (filters.status !== "all") {
      filtered = filtered.filter((r) => r.status === filters.status);
    }

    // Filtrar por interação
    if (filters.interaction !== "all") {
      if (filters.interaction === "viewed") {
        filtered = filtered.filter((r) => r.email_opened);
      } else if (filters.interaction === "clicked") {
        filtered = filtered.filter((r) => r.link_clicked);
      } else if (filters.interaction === "notInteracted") {
        filtered = filtered.filter(
          (r) => !r.email_opened && !r.link_clicked
        );
      }
    }

    // Filtrar por busca
    if (filters.search.trim()) {
      filtered = filtered.filter((r) =>
        r.recipient_email.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Aplicar paginação
    const totalItems = filtered.length;
    const totalPages = Math.ceil(totalItems / filters.pageSize);
    const startIndex = (filters.page - 1) * filters.pageSize;
    const paginatedRecipients = filtered.slice(
      startIndex,
      startIndex + filters.pageSize
    );

    setFilteredRecipients(paginatedRecipients);
    setPagination({
      currentPage: filters.page,
      totalPages: totalPages,
      totalItems: totalItems,
    });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return "--";
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "--" : date.toLocaleString("pt-BR");
  };

  if (loading) {
    return (
      <div style={styles.detailLoading}>
        <div style={styles.spinner}></div>
        <p>Carregando detalhes da execução...</p>
      </div>
    );
  }

  if (!execution) {
    return (
      <div style={styles.errorContainer}>
        <h2>Execução não encontrada</h2>
        <button
          onClick={() => navigate("/platform/blog-gemcapital/configuracoes-campanha")}
          style={styles.backButton}
        >
          <i className="fa-solid fa-arrow-left"></i> Voltar
        </button>
      </div>
    );
  }

  const viewsCount = execution.email_opens || 0;
  const clicksCount = execution.link_clicks || 0;
  const successCount = recipients.filter((r) => r.status === "success").length;
  const failedCount = recipients.filter((r) => r.status === "failed").length;

  return (
    <div style={styles.detailContainer}>
      {/* Header */}
      <div style={styles.detailHeader}>
        <button
          onClick={() => navigate("/platform/blog-gemcapital/configuracoes-campanha")}
          style={styles.backButton}
        >
          <i className="fa-solid fa-arrow-left"></i> Voltar
        </button>
        <div>
          <h1 style={styles.detailTitle}>Detalhes da Execução</h1>
          <p style={styles.detailSubtitle}>
            {formatDate(execution.executed_at)}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statIconContainer}>
            <i
              className="fa-solid fa-envelope"
              style={{ color: "#3b82f6" }}
            ></i>
          </div>
          <div style={styles.statContent}>
            <span style={styles.statLabel}>Enviados</span>
            <strong style={styles.statValue}>{recipients.length}</strong>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIconContainer}>
            <i
              className="fa-solid fa-circle-check"
              style={{ color: "#10b981" }}
            ></i>
          </div>
          <div style={styles.statContent}>
            <span style={styles.statLabel}>Sucesso</span>
            <strong style={{ ...styles.statValue, color: "#10b981" }}>
              {successCount}
            </strong>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIconContainer}>
            <i
              className="fa-solid fa-circle-xmark"
              style={{ color: "#ef4444" }}
            ></i>
          </div>
          <div style={styles.statContent}>
            <span style={styles.statLabel}>Falhas</span>
            <strong style={{ ...styles.statValue, color: "#ef4444" }}>
              {failedCount}
            </strong>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIconContainer}>
            <i
              className="fa-solid fa-eye"
              style={{ color: "#8b5cf6" }}
            ></i>
          </div>
          <div style={styles.statContent}>
            <span style={styles.statLabel}>Visualizações</span>
            <strong style={{ ...styles.statValue, color: "#8b5cf6" }}>
              {viewsCount}
            </strong>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIconContainer}>
            <i
              className="fa-solid fa-computer-mouse"
              style={{ color: "#ec4899" }}
            ></i>
          </div>
          <div style={styles.statContent}>
            <span style={styles.statLabel}>Cliques</span>
            <strong style={{ ...styles.statValue, color: "#ec4899" }}>
              {clicksCount}
            </strong>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={styles.tabsContainer}>
        <button
          onClick={() => setTabActiveEmail(true)}
          style={mergeStyles(
            styles.tabButton,
            tabActiveEmail && styles.tabButtonActive
          )}
        >
          <i className="fa-solid fa-envelope"></i> Email Enviado
        </button>
        <button
          onClick={() => setTabActiveEmail(false)}
          style={mergeStyles(
            styles.tabButton,
            !tabActiveEmail && styles.tabButtonActive
          )}
        >
          <i className="fa-solid fa-list"></i> Detalhes dos Envios
        </button>
      </div>

      {/* Tab Content */}
      {tabActiveEmail ? (
        <div style={styles.emailContentCard}>
          <div style={styles.emailPreview}>
            {execution.sent_content ? (
              <iframe
                style={styles.emailIframe}
                srcDoc={execution.sent_content}
                title="Email Preview"
              />
            ) : (
              <p style={styles.noContent}>Conteúdo do email não disponível</p>
            )}
          </div>
        </div>
      ) : (
        <div style={styles.recipientsCard}>
          {/* Filtros */}
          <div style={styles.filterSection}>
            <div style={styles.filterGrid}>
              <div style={styles.filterGroup}>
                <label style={styles.label}>Email</label>
                <input
                  type="text"
                  name="search"
                  value={filters.search}
                  onChange={handleFilterChange}
                  placeholder="Buscar..."
                  style={styles.input}
                />
              </div>
              <div style={styles.filterGroup}>
                <label style={styles.label}>Status</label>
                <select
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  style={styles.select}
                >
                  <option value="all">Todos</option>
                  <option value="success">Sucesso</option>
                  <option value="failed">Falha</option>
                </select>
              </div>
              <div style={styles.filterGroup}>
                <label style={styles.label}>Interação</label>
                <select
                  name="interaction"
                  value={filters.interaction}
                  onChange={handleFilterChange}
                  style={styles.select}
                >
                  <option value="all">Todas</option>
                  <option value="viewed">Visualizado</option>
                  <option value="clicked">Clicado</option>
                  <option value="notInteracted">Sem Interação</option>
                </select>
              </div>
            </div>
          </div>

          {/* Tabela */}
          <div style={{ padding: "0 20px" }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Visualizado</th>
                  <th style={styles.th}>Clicado</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecipients.length > 0 ? (
                  filteredRecipients.map((recipient, idx) => (
                    <tr key={idx} style={styles.tr}>
                      <td style={styles.td}>{recipient.recipient_email}</td>
                      <td style={styles.td}>
                        <span
                          style={
                            recipient.status === "success"
                              ? styles.statusSuccess
                              : styles.statusError
                          }
                        >
                          {recipient.status.toUpperCase()}
                        </span>
                      </td>
                      <td style={styles.td}>
                        <div style={styles.interactionCell}>
                          {recipient.email_opened ? (
                            <>
                              <i
                                className="fa-solid fa-check"
                                style={{ color: "#10b981", marginRight: "6px" }}
                              ></i>
                              <span style={{ color: "#10b981" }}>Sim</span>
                            </>
                          ) : (
                            <>
                              <i
                                className="fa-solid fa-xmark"
                                style={{ color: "#ef4444", marginRight: "6px" }}
                              ></i>
                              <span style={{ color: "#ef4444" }}>Não</span>
                            </>
                          )}
                        </div>
                      </td>
                      <td style={styles.td}>
                        <div style={styles.interactionCell}>
                          {recipient.link_clicked ? (
                            <>
                              <i
                                className="fa-solid fa-check"
                                style={{ color: "#10b981", marginRight: "6px" }}
                              ></i>
                              <span style={{ color: "#10b981" }}>Sim</span>
                            </>
                          ) : (
                            <>
                              <i
                                className="fa-solid fa-xmark"
                                style={{ color: "#ef4444", marginRight: "6px" }}
                              ></i>
                              <span style={{ color: "#ef4444" }}>Não</span>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" style={styles.tdEmpty}>
                      Nenhum registro com esses filtros.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Paginação */}
          <div style={styles.paginationContainer}>
            <div style={styles.paginationInfo}>
              Mostrando {filteredRecipients.length} de {pagination.totalItems}
            </div>
            <div style={styles.paginationControls}>
              <button
                disabled={pagination.currentPage === 1}
                onClick={() => handlePageChange(filters.page - 1)}
                style={styles.pageButton}
              >
                Anterior
              </button>
              <span style={styles.pageInfo}>
                {pagination.currentPage} / {pagination.totalPages}
              </span>
              <button
                disabled={
                  pagination.currentPage === pagination.totalPages ||
                  pagination.totalPages === 0
                }
                onClick={() => handlePageChange(filters.page + 1)}
                style={styles.pageButton}
              >
                Próxima
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
