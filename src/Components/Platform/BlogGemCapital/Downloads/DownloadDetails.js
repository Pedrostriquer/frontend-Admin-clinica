import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./DownloadsStyle";
import blogGemCapitalAffiliateDownloads from "../../../../dbServices/blogGemCapitalAffiliateDownloads";

const DownloadDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [download, setDownload] = useState(null);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [leadsLoading, setLeadsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Pagination and filter states
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [orderBy, setOrderBy] = useState("createdAt");
  const [orderDirection, setOrderDirection] = useState("desc");
  const [isAffiliate, setIsAffiliate] = useState(null);
  const [totalItems, setTotalItems] = useState(0);

  // Load download info
  useEffect(() => {
    const fetchDownload = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await blogGemCapitalAffiliateDownloads.getById(id);
        setDownload(response);
      } catch (err) {
        console.error("Erro ao carregar download:", err);
        setError("Erro ao carregar informações do download.");
      } finally {
        setLoading(false);
      }
    };

    fetchDownload();
  }, [id]);

  // Load leads when filters change
  useEffect(() => {
    if (download) {
      fetchLeads();
    }
  }, [page, pageSize, searchTerm, orderBy, orderDirection, isAffiliate, download?.id]);

  const fetchLeads = async () => {
    try {
      setLeadsLoading(true);
      const response = await blogGemCapitalAffiliateDownloads.getLeadsByDownloadItem(
        id,
        searchTerm || null,
        page,
        pageSize,
        orderBy,
        orderDirection,
        isAffiliate
      );
      setLeads(response.data || []);
      setTotalItems(response.totalItems || 0);
    } catch (err) {
      console.error("Erro ao carregar leads:", err);
      setError("Erro ao carregar leads do download.");
    } finally {
      setLeadsLoading(false);
    }
  };

  const handleToggleContacted = async (leadId, currentStatus) => {
    try {
      const updatedLead = await blogGemCapitalAffiliateDownloads.markLeadAsContacted(leadId);
      setLeads(leads.map((l) => (l.id === leadId ? updatedLead : l)));
      const message = updatedLead.isContacted
        ? "Lead marcado como contatado!"
        : "Marcação de contato removida!";
      alert(message);
    } catch (err) {
      console.error("Erro ao atualizar status de contato:", err);
      alert("Erro ao atualizar status de contato.");
    }
  };

  const handleOpenWhatsApp = (phoneNumber, leadName) => {
    if (!phoneNumber) {
      alert("Este lead não possui número de telefone registrado.");
      return;
    }

    // Remove qualquer caractere não numérico
    const cleanPhone = phoneNumber.replace(/\D/g, "");

    // Se não começar com 55 (código do Brasil), adiciona
    const fullPhone = cleanPhone.startsWith("55") ? cleanPhone : "55" + cleanPhone;

    // Abre o WhatsApp
    const message = `Olá ${leadName}, tudo bem?`;
    const whatsappUrl = `https://wa.me/${fullPhone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleDeleteLead = async (leadId) => {
    if (!window.confirm("Tem certeza que deseja deletar este lead?")) {
      return;
    }

    try {
      await blogGemCapitalAffiliateDownloads.deleteLead(leadId);
      setLeads(leads.filter((l) => l.id !== leadId));
      setTotalItems(totalItems - 1);
      alert("Lead deletado com sucesso!");
    } catch (err) {
      console.error("Erro ao deletar lead:", err);
      alert("Erro ao deletar lead.");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const totalPages = Math.ceil(totalItems / pageSize);

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={{ padding: "40px", textAlign: "center", color: "#999" }}>
          <i
            className="fa-solid fa-spinner"
            style={{ animation: "spin 1s linear infinite", marginRight: "10px" }}
          ></i>
          Carregando detalhes do download...
        </div>
      </div>
    );
  }

  if (!download) {
    return (
      <div style={styles.container}>
        <button
          style={styles.backButton}
          onClick={() => navigate("/platform/blog-gemcapital/downloads")}
        >
          <i className="fa-solid fa-arrow-left"></i> Voltar
        </button>
        <div style={{ padding: "40px", textAlign: "center", color: "#999" }}>
          Download não encontrado
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Back Button */}
      <button
        style={styles.backButton}
        onClick={() => navigate("/platform/blog-gemcapital/downloads")}
      >
        <i className="fa-solid fa-arrow-left"></i> Voltar para Downloads
      </button>

      {/* Error Alert */}
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

      {/* Download Header Section */}
      <div style={styles.tableContainer}>
        <div style={styles.tableHeader}>
          <div>
            <h1 style={styles.title}>{download.name}</h1>
            <p style={{ color: "#666", fontSize: "14px", margin: "5px 0 0 0" }}>
              Total de Downloads: <strong>{download.totalDownloadsCount}</strong>
            </p>
          </div>
        </div>

        <div style={{ padding: "30px", borderTop: "1px solid #e8e8e8" }}>
          {download.description && (
            <div style={{ marginBottom: "20px" }}>
              <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#333", margin: "0 0 10px 0" }}>
                Descrição
              </h3>
              <p style={{ color: "#666", margin: "0", lineHeight: "1.5" }}>
                {download.description}
              </p>
            </div>
          )}

          <div style={{ marginBottom: "20px" }}>
            <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#333", margin: "0 0 10px 0" }}>
              Arquivo
            </h3>
            <a
              href={download.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                color: "#2196F3",
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              <i className="fa-solid fa-download"></i>
              Download Arquivo
            </a>
          </div>

          <div>
            <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#333", margin: "0 0 10px 0" }}>
              Criado em
            </h3>
            <p style={{ color: "#666", margin: "0", fontSize: "14px" }}>
              {formatDate(download.createdAt)}
            </p>
          </div>
        </div>
      </div>

      {/* Leads Section */}
      <div style={{ marginTop: "40px" }}>
        <div style={styles.header}>
          <h2 style={{ ...styles.title, fontSize: "24px" }}>Leads que Baixaram</h2>
          <p style={styles.subtitle}>
            Total: {totalItems} leads
          </p>
        </div>

        {/* Filters */}
        <div style={styles.filtersContainer}>
          <div style={styles.filterGroup}>
            <input
              type="text"
              placeholder="Buscar por nome..."
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
              <option value="contactedAt">Data de Contato</option>
              <option value="iscontacted">Status Contato</option>
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

          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Afiliado:</label>
            <select
              value={isAffiliate === null ? "" : isAffiliate}
              onChange={(e) => {
                const val = e.target.value;
                setIsAffiliate(val === "" ? null : val === "true");
                setPage(1);
              }}
              style={styles.filterSelect}
            >
              <option value="">Todos</option>
              <option value="true">Apenas Afiliados</option>
              <option value="false">Apenas Não-Afiliados</option>
            </select>
          </div>

          {(searchTerm || isAffiliate !== null) && (
            <button
              onClick={() => {
                setSearchTerm("");
                setIsAffiliate(null);
                setPage(1);
              }}
              style={styles.clearButton}
            >
              <i className="fa-solid fa-times"></i> Limpar filtros
            </button>
          )}
        </div>

        {/* Leads Table */}
        <div style={styles.tableContainer}>
          {leadsLoading ? (
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
              Carregando leads...
            </div>
          ) : leads.length === 0 ? (
            <div
              style={{
                padding: "40px",
                textAlign: "center",
                color: "#999",
              }}
            >
              <i className="fa-solid fa-inbox" style={{ fontSize: "24px", marginBottom: "10px", display: "block" }}></i>
              Nenhum lead encontrado
            </div>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeaderRow}>
                  <th style={styles.tableHeaderCell}>Nome</th>
                  <th style={styles.tableHeaderCell}>Email</th>
                  <th style={styles.tableHeaderCell}>Telefone</th>
                  <th style={styles.tableHeaderCell}>Afiliado</th>
                  <th style={styles.tableHeaderCell}>Contatado</th>
                  <th style={styles.tableHeaderCell}>Criado em</th>
                  <th style={styles.tableHeaderCell}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id} style={styles.tableRow}>
                    <td style={styles.tableCell}>
                      <div style={styles.nameCell}>
                        <i className="fa-solid fa-user"></i>
                        <span>{lead.name}</span>
                      </div>
                    </td>
                    <td style={styles.tableCell}>
                      <span style={{ fontSize: "13px", color: "#666" }}>
                        {lead.email}
                      </span>
                    </td>
                    <td style={styles.tableCell}>
                      <span style={{ fontSize: "13px", color: "#666" }}>
                        {lead.phoneNumber || "-"}
                      </span>
                    </td>
                    <td style={styles.tableCell}>
                      {lead.affiliateId ? (
                        <button
                          onClick={() => navigate(`/platform/blog-gemcapital/affiliates/${lead.affiliateId}`)}
                          style={{
                            ...styles.statusBadge,
                            backgroundColor: "#c8e6c9",
                            color: "#2e7d32",
                            border: "1px solid #4CAF50",
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                            padding: "6px 12px",
                            fontWeight: "600",
                            fontSize: "12px",
                            outline: "none",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "#a5d6a7";
                            e.currentTarget.style.transform = "scale(1.05)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "#c8e6c9";
                            e.currentTarget.style.transform = "scale(1)";
                          }}
                          title="Ver detalhes do afiliado"
                        >
                          <i className="fa-solid fa-link" style={{ marginRight: "6px" }}></i>
                          Sim
                        </button>
                      ) : (
                        <span
                          style={{
                            ...styles.statusBadge,
                            backgroundColor: "#ffe0b2",
                            color: "#e65100",
                          }}
                        >
                          Não
                        </span>
                      )}
                    </td>
                    <td style={styles.tableCell}>
                      <span
                        style={{
                          ...styles.statusBadge,
                          ...(lead.isContacted
                            ? { backgroundColor: "#c8e6c9", color: "#2e7d32" }
                            : { backgroundColor: "#ffebee", color: "#c62828" }),
                        }}
                      >
                        {lead.isContacted ? "Sim" : "Não"}
                      </span>
                    </td>
                    <td style={styles.tableCell}>
                      <span style={{ fontSize: "13px", color: "#666" }}>
                        {formatDate(lead.createdAt)}
                      </span>
                    </td>
                    <td style={styles.tableCell}>
                      <div style={styles.actionsCell}>
                        <button
                          style={{
                            ...styles.actionButton,
                            ...(lead.phoneNumber
                              ? { color: "#25D366", opacity: 1 }
                              : { opacity: 0.5, cursor: "not-allowed" }),
                          }}
                          title={lead.phoneNumber ? "Abrir WhatsApp" : "Sem telefone registrado"}
                          onClick={() => handleOpenWhatsApp(lead.phoneNumber, lead.name)}
                          disabled={!lead.phoneNumber}
                        >
                          <i className="fa-brands fa-whatsapp"></i>
                        </button>
                        <button
                          style={{
                            padding: "8px 10px",
                            backgroundColor: lead.isContacted ? "#c8e6c9" : "#f0f0f0",
                            color: lead.isContacted ? "#2e7d32" : "#999",
                            border: lead.isContacted ? "1px solid #4CAF50" : "1px solid #e0e0e0",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontSize: "14px",
                            transition: "all 0.3s ease",
                            fontWeight: "600",
                          }}
                          title={lead.isContacted ? "Desmarcar como contatado" : "Marcar como contatado"}
                          onClick={() => handleToggleContacted(lead.id, lead.isContacted)}
                        >
                          <i className="fa-solid fa-check"></i>
                        </button>
                        <button
                          style={styles.actionButton}
                          title="Deletar"
                          onClick={() => handleDeleteLead(lead.id)}
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

        {/* Pagination */}
        {!leadsLoading && leads.length > 0 && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "20px",
              padding: "20px",
              backgroundColor: "#fff",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
            }}
          >
            <div style={{ fontSize: "14px", color: "#666" }}>
              Mostrando {(page - 1) * pageSize + 1} até{" "}
              {Math.min(page * pageSize, totalItems)} de {totalItems} leads
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                style={{
                  ...styles.actionButton,
                  opacity: page === 1 ? 0.5 : 1,
                  cursor: page === 1 ? "not-allowed" : "pointer",
                }}
              >
                <i className="fa-solid fa-chevron-left"></i> Anterior
              </button>

              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "14px", color: "#666" }}>
                  Página {page} de {totalPages}
                </span>
              </div>

              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                style={{
                  ...styles.actionButton,
                  opacity: page === totalPages ? 0.5 : 1,
                  cursor: page === totalPages ? "not-allowed" : "pointer",
                }}
              >
                Próxima <i className="fa-solid fa-chevron-right"></i>
              </button>
            </div>

            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <label style={{ fontSize: "14px", color: "#666" }}>Items por página:</label>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(parseInt(e.target.value));
                  setPage(1);
                }}
                style={{
                  ...styles.filterSelect,
                  minWidth: "80px",
                }}
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>
          </div>
        )}
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

export default DownloadDetails;
