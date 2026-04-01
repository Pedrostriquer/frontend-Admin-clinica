import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import gemCapitalBlogLeadsPlanejadorService from "../../../../dbServices/gemCapitalBlogLeadsPlanejadorService";
import styles from "./PlanejadorLeadsViewStyle";
import { Eye, CheckCircle, Circle, Trash2, MessageCircle } from "lucide-react";
import ActionButton from "./ActionButton";
import ConfirmContactModal from "./ConfirmContactModal";
import QualitySelector from "./QualitySelector";

const PlanejadorLeadsView = ({ onRefresh }) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTermInput, setSearchTermInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [contactedFilter, setContactedFilter] = useState(null);
  const [qualityFilter, setQualityFilter] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [simulationType, setSimulationType] = useState(() => {
    const type = searchParams.get("simulationType");
    return type !== null ? parseInt(type) : 0;
  });

  const [filteredLeads, setFilteredLeads] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedLeadForContact, setSelectedLeadForContact] = useState(null);
  const [isMarking, setIsMarking] = useState(false);

  const searchTimeoutRef = useRef(null);

  useEffect(() => {
    if (!searchParams.has("simulationType")) {
      setSearchParams((prev) => {
        prev.set("simulationType", "0");
        return prev;
      });
    }
  }, []);

  useEffect(() => {
    if (!document.getElementById("planejador-leads-animations")) {
      const styleTag = document.createElement("style");
      styleTag.id = "planejador-leads-animations";
      styleTag.innerHTML = `
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `;
      document.head.appendChild(styleTag);
    }
  }, []);

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      setSearchTerm(searchTermInput);
      setPageNumber(1);
    }, 500);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchTermInput]);

  useEffect(() => {
    fetchFilteredLeads();
  }, [
    searchTerm,
    contactedFilter,
    qualityFilter,
    startDate,
    endDate,
    pageNumber,
    pageSize,
    simulationType,
  ]);

  const fetchFilteredLeads = async () => {
    try {
      setLoading(true);
      const data = await gemCapitalBlogLeadsPlanejadorService.getLeadsFiltered({
        searchTerm,
        contacted: contactedFilter,
        leadQuality: qualityFilter,
        startDate,
        endDate,
        simulationType,
        pageNumber,
        pageSize,
      });

      setFilteredLeads(data.data || []);
      setTotalCount(data.totalCount || 0);
      setTotalPages(data.totalPages || 0);
    } catch (error) {
      setFilteredLeads([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilters = () => {
    setSearchTermInput("");
    setSearchTerm("");
    setContactedFilter(null);
    setQualityFilter(null);
    setStartDate("");
    setEndDate("");
    setPageNumber(1);
  };

  const handleChangeSimulationType = (type) => {
    setSimulationType(type);
    setPageNumber(1);
    setSearchParams((prev) => {
      prev.set("simulationType", type.toString());
      return prev;
    });
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleDeleteLead = async (leadId) => {
    if (!window.confirm("Tem certeza que deseja excluir este lead?")) return;
    try {
      await gemCapitalBlogLeadsPlanejadorService.deleteLead(leadId);
      fetchFilteredLeads();
    } catch (error) {
      alert("Erro ao excluir lead");
    }
  };

  const handleOpenContactModal = (lead) => {
    setSelectedLeadForContact(lead);
    setIsMarking(!lead.contacted);
    setModalOpen(true);
  };

  const handleConfirmContact = async () => {
    if (!selectedLeadForContact) return;
    try {
      await gemCapitalBlogLeadsPlanejadorService.markAsContacted(
        selectedLeadForContact.id
      );
      setModalOpen(false);
      setSelectedLeadForContact(null);
      fetchFilteredLeads();
    } catch (error) {
      alert("Erro ao atualizar status");
    }
  };

  const handleSaveQuality = async (leadId, quality) => {
    try {
      await gemCapitalBlogLeadsPlanejadorService.updateQuality(leadId, quality);
      fetchFilteredLeads();
    } catch (error) {
      alert("Erro ao salvar qualidade do lead");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.filterSection}>
        <div style={styles.filterTitle}>Filtros</div>
        <div style={styles.filterRow}>
          <div style={styles.filterGroup}>
            <label style={styles.label}>Pesquisar por Nome/Email</label>
            <input
              type="text"
              placeholder="Nome ou email..."
              value={searchTermInput}
              onChange={(e) => setSearchTermInput(e.target.value)}
              style={styles.input}
            />
          </div>

          <div style={styles.filterGroup}>
            <label style={styles.label}>Status de Contato</label>
            <select
              value={contactedFilter === null ? "" : contactedFilter}
              onChange={(e) => {
                if (e.target.value === "") {
                  setContactedFilter(null);
                } else {
                  setContactedFilter(e.target.value === "true");
                }
              }}
              style={styles.select}
            >
              <option value="">Todos</option>
              <option value="false">Não Contactado</option>
              <option value="true">Contactado</option>
            </select>
          </div>

          <div style={styles.filterGroup}>
            <label style={styles.label}>Qualidade do Lead</label>
            <select
              value={qualityFilter === null ? "" : qualityFilter}
              onChange={(e) => {
                if (e.target.value === "") {
                  setQualityFilter(null);
                } else {
                  setQualityFilter(parseInt(e.target.value));
                }
              }}
              style={styles.select}
            >
              <option value="">Todos</option>
              <option value="0">Não Avaliado</option>
              <option value="1">Muito Ruim</option>
              <option value="2">Ruim</option>
              <option value="3">Médio</option>
              <option value="4">Bom</option>
              <option value="5">Muito Bom</option>
            </select>
          </div>
        </div>

        <div style={styles.filterRow}>
          <div style={styles.filterGroup}>
            <label style={styles.label}>Data Inicial</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              style={styles.input}
            />
          </div>

          <div style={styles.filterGroup}>
            <label style={styles.label}>Data Final</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              style={styles.input}
            />
          </div>

          <div style={styles.filterGroup}>
            <button onClick={handleClearFilters} style={styles.clearButton}>
              Limpar Filtros
            </button>
          </div>
        </div>
      </div>

      <div style={{ ...styles.filterSection, marginTop: "20px" }}>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <label style={{ fontWeight: "600", color: "#374151" }}>
            Tipo de Simulação:
          </label>
          {[0, 1, 2].map((type) => (
            <button
              key={type}
              onClick={() => handleChangeSimulationType(type)}
              style={{
                ...styles.select,
                backgroundColor:
                  simulationType === type ? "#4F46E5" : "#F3F4F6",
                color: simulationType === type ? "white" : "#374151",
                border:
                  simulationType === type
                    ? "1px solid #4F46E5"
                    : "1px solid #D1D5DB",
                padding: "8px 16px",
                cursor: "pointer",
                borderRadius: "6px",
                fontWeight: "500",
                transition: "all 0.2s",
              }}
            >
              {type === 0
                ? "Definir Meta"
                : type === 1
                ? "Definir Prazo"
                : "Calcular Rendimento"}
            </button>
          ))}
        </div>
      </div>

      <div style={styles.resultInfo}>
        <span>
          Exibindo {filteredLeads.length} de {totalCount} leads | Página{" "}
          {pageNumber} de {totalPages}
        </span>
      </div>

      {loading ? (
        <div style={styles.loadingContainer}>
          <div style={styles.loadingSpinner}></div>
          <p>Carregando leads...</p>
        </div>
      ) : filteredLeads.length === 0 ? (
        <div style={styles.emptyState}>
          <p>Nenhum lead encontrado com os filtros selecionados.</p>
        </div>
      ) : (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeaderRow}>
                <th style={{ ...styles.tableHeader, width: "60px" }}>ID</th>
                <th style={{ ...styles.tableHeader, width: "200px" }}>Nome</th>
                <th style={{ ...styles.tableHeader, width: "200px" }}>Email</th>
                <th style={{ ...styles.tableHeader, width: "150px" }}>
                  Telefone
                </th>
                {simulationType !== 2 && (
                  <th style={{ ...styles.tableHeader, width: "120px" }}>
                    Meta (R$)
                  </th>
                )}
                {simulationType === 0 && (
                  <th style={{ ...styles.tableHeader, width: "100px" }}>
                    Prazo (m)
                  </th>
                )}
                {simulationType === 1 && (
                  <th style={{ ...styles.tableHeader, width: "130px" }}>
                    Aporte (R$)
                  </th>
                )}
                {simulationType === 2 && (
                  <>
                    <th style={{ ...styles.tableHeader, width: "130px" }}>
                      Aporte (R$)
                    </th>
                    <th style={{ ...styles.tableHeader, width: "100px" }}>
                      Período (m)
                    </th>
                  </>
                )}
                <th style={{ ...styles.tableHeader, width: "130px" }}>
                  Cap. Inicial
                </th>
                <th style={{ ...styles.tableHeader, width: "100px" }}>
                  Status
                </th>
                <th style={{ ...styles.tableHeader, width: "160px" }}>
                  Qualidade
                </th>
                <th style={{ ...styles.tableHeader, width: "150px" }}>Data</th>
                <th style={{ ...styles.tableHeader, width: "250px" }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((lead) => (
                <tr key={lead.id} style={styles.tableRow}>
                  <td style={styles.tableCell}>#{lead.id}</td>
                  <td style={styles.tableCell}>{lead.name}</td>
                  <td style={styles.tableCell}>{lead.email}</td>
                  <td style={styles.tableCell}>{lead.phone}</td>
                  {simulationType !== 2 && (
                    <td style={styles.tableCell}>
                      {lead.targetValue
                        ? `R$ ${parseFloat(lead.targetValue).toLocaleString(
                            "pt-BR",
                            { minimumFractionDigits: 2 }
                          )}`
                        : "-"}
                    </td>
                  )}
                  {simulationType === 0 && (
                    <td style={styles.tableCell}>{lead.periodMonths || "-"}</td>
                  )}
                  {simulationType === 1 && (
                    <td style={styles.tableCell}>
                      {lead.monthlyAport
                        ? `R$ ${parseFloat(lead.monthlyAport).toLocaleString(
                            "pt-BR",
                            { minimumFractionDigits: 2 }
                          )}`
                        : "-"}
                    </td>
                  )}
                  {simulationType === 2 && (
                    <>
                      <td style={styles.tableCell}>
                        {lead.monthlyAport
                          ? `R$ ${parseFloat(lead.monthlyAport).toLocaleString(
                              "pt-BR",
                              { minimumFractionDigits: 2 }
                            )}`
                          : "-"}
                      </td>
                      <td style={styles.tableCell}>
                        {lead.periodMonths || "-"}
                      </td>
                    </>
                  )}
                  <td style={styles.tableCell}>
                    {lead.initialCapital
                      ? `R$ ${parseFloat(lead.initialCapital).toLocaleString(
                          "pt-BR",
                          { minimumFractionDigits: 2 }
                        )}`
                      : "-"}
                  </td>
                  <td style={styles.tableCell}>
                    <span
                      style={{
                        ...styles.statusBadge,
                        backgroundColor: lead.contacted ? "#10b981" : "#ef4444",
                      }}
                    >
                      {lead.contacted ? "Sim" : "Não"}
                    </span>
                  </td>
                  <td style={styles.tableCell}>
                    <QualitySelector
                      value={lead.leadQuality || 0}
                      onChange={(quality) =>
                        handleSaveQuality(lead.id, quality)
                      }
                      inline={true}
                    />
                  </td>
                  <td style={styles.tableCell}>{formatDate(lead.createdAt)}</td>
                  <td
                    style={{ ...styles.tableCell, display: "flex", gap: "4px" }}
                  >
                    <ActionButton
                      icon={Eye}
                      onClick={() =>
                        navigate(
                          `/platform/blog-gemcapital/planejador/${lead.id}`
                        )
                      }
                      title="Ver detalhes"
                      color="#6366f1"
                    />
                    <ActionButton
                      icon={lead.contacted ? CheckCircle : Circle}
                      onClick={() => handleOpenContactModal(lead)}
                      color={lead.contacted ? "#10b981" : "#94a3b8"}
                    />
                    <ActionButton
                      icon={MessageCircle}
                      onClick={() =>
                        window.open(
                          `https://wa.me/${lead.phone.replace(
                            "+",
                            ""
                          )}?text=${encodeURIComponent(
                            `Olá ${lead.name}, gostaria de conversar sobre o seu planejamento.`
                          )}`,
                          "_blank"
                        )
                      }
                      color="#25D366"
                    />
                    <ActionButton
                      icon={Trash2}
                      onClick={() => handleDeleteLead(lead.id)}
                      color="#ef4444"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={styles.paginationContainer}>
            <button
              onClick={() => setPageNumber(Math.max(1, pageNumber - 1))}
              disabled={pageNumber === 1}
              style={{
                ...styles.paginationButton,
                opacity: pageNumber === 1 ? 0.5 : 1,
              }}
            >
              ← Anterior
            </button>
            <div style={styles.pageInfo}>
              {pageNumber} / {totalPages || 1}
            </div>
            <button
              onClick={() =>
                setPageNumber(Math.min(totalPages || 1, pageNumber + 1))
              }
              disabled={pageNumber >= totalPages}
              style={{
                ...styles.paginationButton,
                opacity: pageNumber >= totalPages ? 0.5 : 1,
              }}
            >
              Próxima →
            </button>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(parseInt(e.target.value));
                setPageNumber(1);
              }}
              style={styles.pageSizeSelect}
            >
              <option value="5">5 por página</option>
              <option value="10">10 por página</option>
              <option value="25">25 por página</option>
              <option value="50">50 por página</option>
            </select>
          </div>
        </div>
      )}

      <ConfirmContactModal
        isOpen={modalOpen}
        onConfirm={handleConfirmContact}
        onCancel={() => {
          setModalOpen(false);
          setSelectedLeadForContact(null);
        }}
        leadName={selectedLeadForContact?.name || ""}
        isMarking={isMarking}
      />
    </div>
  );
};

export default PlanejadorLeadsView;
