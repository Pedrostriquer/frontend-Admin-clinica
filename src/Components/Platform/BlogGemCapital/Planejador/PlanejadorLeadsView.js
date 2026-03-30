import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "./PlanejadorLeadsViewStyle";
import {
  Eye,
  CheckCircle,
  Circle,
  Trash2,
  MessageCircle,
} from "lucide-react";
import ActionButton from "./ActionButton";
import ConfirmContactModal from "./ConfirmContactModal";
import QualitySelector from "./QualitySelector";

const PlanejadorLeadsView = ({ onRefresh }) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTermInput, setSearchTermInput] = useState(""); // Input do usuário
  const [searchTerm, setSearchTerm] = useState(""); // Termo usado para busca (com debounce)
  const [contactedFilter, setContactedFilter] = useState(null);
  const [qualityFilter, setQualityFilter] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Inicializar simulationType da URL na primeira carga
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

  // Adicionar simulationType à URL na primeira carga se não estiver presente
  useEffect(() => {
    if (!searchParams.has("simulationType")) {
      setSearchParams(prev => {
        prev.set('simulationType', '0');
        return prev;
      });
    }
  }, []);

  // Injetar CSS para animações
  useEffect(() => {
    if (!document.getElementById("planejador-leads-animations")) {
      const styleTag = document.createElement("style");
      styleTag.id = "planejador-leads-animations";
      styleTag.innerHTML = `
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `;
      document.head.appendChild(styleTag);
    }
  }, []);

  // Debounce para a pesquisa (500ms)
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      setSearchTerm(searchTermInput);
      setPageNumber(1); // Resetar para página 1 ao pesquisar
    }, 500);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchTermInput]);

  // Buscar dados filtrados do backend
  useEffect(() => {
    fetchFilteredLeads();
  }, [searchTerm, contactedFilter, qualityFilter, startDate, endDate, pageNumber, pageSize, simulationType]);

  const fetchFilteredLeads = async () => {
    try {
      setLoading(true);

      // Construir query string
      const queryParams = new URLSearchParams();

      if (searchTerm) queryParams.append("searchTerm", searchTerm);
      if (contactedFilter !== null) queryParams.append("contacted", contactedFilter);
      if (qualityFilter !== null) queryParams.append("leadQuality", qualityFilter);
      if (startDate) queryParams.append("startDate", startDate);
      if (endDate) queryParams.append("endDate", endDate);
      queryParams.append("planejadorType", simulationType);
      queryParams.append("pageNumber", pageNumber);
      queryParams.append("pageSize", pageSize);

      const response = await fetch(
        `http://localhost:5097/api/PlanejadorLeads/search?${queryParams.toString()}`
      );

      if (!response.ok) {
        throw new Error("Erro ao buscar leads");
      }

      const data = await response.json();
      setFilteredLeads(data.data || []);
      setTotalCount(data.totalCount || 0);
      setTotalPages(data.totalPages || 0);
    } catch (error) {
      console.error("Erro ao buscar leads filtrados:", error);
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
    setSearchParams(prev => {
      prev.set('simulationType', type.toString());
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
      const response = await fetch(
        `http://localhost:5097/api/PlanejadorLeads/${leadId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error("Erro ao excluir lead");
      alert("Lead excluído com sucesso!");
      fetchFilteredLeads();
    } catch (error) {
      console.error("Erro:", error);
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
      const response = await fetch(
        `http://localhost:5097/api/PlanejadorLeads/${selectedLeadForContact.id}/marcar-contactado`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Erro ao atualizar status");
      setModalOpen(false);
      setSelectedLeadForContact(null);
      fetchFilteredLeads();
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao atualizar status");
    }
  };

  const handleSaveQuality = async (leadId, quality) => {
    try {
      const response = await fetch(
        `http://localhost:5097/api/PlanejadorLeads/${leadId}/qualidade`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            leadQuality: quality,
          }),
        }
      );

      if (!response.ok) throw new Error("Erro ao salvar qualidade");
      fetchFilteredLeads();
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao salvar qualidade do lead");
    }
  };

  console.log(filteredLeads);
  
  return (
    <div style={styles.container}>
      {/* Seção de Filtros */}
      <div style={styles.filterSection}>
        <div style={styles.filterTitle}>Filtros</div>

        {/* Linha 1: Pesquisa e Status */}
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

        {/* Linha 2: Datas */}
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
            <button
              onClick={handleClearFilters}
              style={styles.clearButton}
            >
              Limpar Filtros
            </button>
          </div>
        </div>
      </div>

      {/* Seletores de Tipo de Simulação */}
      <div style={{ ...styles.filterSection, marginTop: "20px" }}>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <label style={{ fontWeight: "600", color: "#374151" }}>Tipo de Simulação:</label>
          <button
            onClick={() => handleChangeSimulationType(0)}
            style={{
              ...styles.select,
              backgroundColor: simulationType === 0 ? "#4F46E5" : "#F3F4F6",
              color: simulationType === 0 ? "white" : "#374151",
              border: simulationType === 0 ? "1px solid #4F46E5" : "1px solid #D1D5DB",
              padding: "8px 16px",
              cursor: "pointer",
              borderRadius: "6px",
              fontWeight: "500",
              transition: "all 0.2s",
            }}
          >
            Definir Meta
          </button>
          <button
            onClick={() => handleChangeSimulationType(1)}
            style={{
              ...styles.select,
              backgroundColor: simulationType === 1 ? "#4F46E5" : "#F3F4F6",
              color: simulationType === 1 ? "white" : "#374151",
              border: simulationType === 1 ? "1px solid #4F46E5" : "1px solid #D1D5DB",
              padding: "8px 16px",
              cursor: "pointer",
              borderRadius: "6px",
              fontWeight: "500",
              transition: "all 0.2s",
            }}
          >
            Definir Prazo
          </button>
          <button
            onClick={() => handleChangeSimulationType(2)}
            style={{
              ...styles.select,
              backgroundColor: simulationType === 2 ? "#4F46E5" : "#F3F4F6",
              color: simulationType === 2 ? "white" : "#374151",
              border: simulationType === 2 ? "1px solid #4F46E5" : "1px solid #D1D5DB",
              padding: "8px 16px",
              cursor: "pointer",
              borderRadius: "6px",
              fontWeight: "500",
              transition: "all 0.2s",
            }}
          >
            Calcular Rendimento
          </button>
        </div>
      </div>

      {/* Resultado da Pesquisa */}
      <div style={styles.resultInfo}>
        <span>
          Exibindo {filteredLeads.length} de {totalCount} leads | Página {pageNumber} de {totalPages}
        </span>
      </div>

      {/* Tabela de Leads */}
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
                <th style={{ ...styles.tableHeader, width: "150px" }}>Telefone</th>
                {simulationType !== 2 && (
                  <th style={{ ...styles.tableHeader, width: "120px" }}>Meta (R$)</th>
                )}
                {simulationType === 0 && (
                  <th style={{ ...styles.tableHeader, width: "100px" }}>Prazo (meses)</th>
                )}
                {simulationType === 1 && (
                  <th style={{ ...styles.tableHeader, width: "130px" }}>Aporte Mensal (R$)</th>
                )}
                {simulationType === 2 && (
                  <>
                    <th style={{ ...styles.tableHeader, width: "130px" }}>Aporte Mensal (R$)</th>
                    <th style={{ ...styles.tableHeader, width: "100px" }}>Período (meses)</th>
                  </>
                )}
                <th style={{ ...styles.tableHeader, width: "130px" }}>Capital Inicial</th>
                <th style={{ ...styles.tableHeader, width: "100px" }}>Contactado</th>
                <th style={{ ...styles.tableHeader, width: "160px" }}>Qualidade</th>
                <th style={{ ...styles.tableHeader, width: "150px" }}>Data Criação</th>
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
                        ? `R$ ${parseFloat(lead.targetValue).toLocaleString("pt-BR", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}`
                        : "-"}
                    </td>
                  )}
                  {simulationType === 0 && (
                    <td style={styles.tableCell}>{lead.periodMonths || "-"}</td>
                  )}
                  {simulationType === 1 && (
                    <td style={styles.tableCell}>
                      {lead.monthlyAport
                        ? `R$ ${parseFloat(lead.monthlyAport).toLocaleString("pt-BR", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}`
                        : "-"}
                    </td>
                  )}
                  {simulationType === 2 && (
                    <>
                      <td style={styles.tableCell}>
                        {lead.monthlyAport
                          ? `R$ ${parseFloat(lead.monthlyAport).toLocaleString("pt-BR", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}`
                          : "-"}
                      </td>
                      <td style={styles.tableCell}>{lead.periodMonths || "-"}</td>
                    </>
                  )}
                  <td style={styles.tableCell}>
                    {lead.initialCapital
                      ? `R$ ${parseFloat(lead.initialCapital).toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}`
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
                  <td style={styles.tableCell}>
                    {formatDate(lead.createdAt)}
                  </td>
                  <td style={{ ...styles.tableCell, display: "flex", gap: "4px" }}>
                    <ActionButton
                      icon={Eye}
                      onClick={() =>
                        navigate(
                          `/platform/blog-gemcapital/planejador/${lead.id}`
                        )
                      }
                      title="Ver detalhes"
                      color="#6366f1"
                      hoverColor="#6366f1"
                    />
                    <ActionButton
                      icon={lead.contacted ? CheckCircle : Circle}
                      onClick={() => handleOpenContactModal(lead)}
                      title={
                        lead.contacted
                          ? "Desmarcar como contactado"
                          : "Marcar como contactado"
                      }
                      color={lead.contacted ? "#10b981" : "#94a3b8"}
                      hoverColor={lead.contacted ? "#10b981" : "#94a3b8"}
                    />
                    <ActionButton
                      icon={MessageCircle}
                      onClick={() => {
                        const phoneNumber = lead.phone
                          .replace("+", "");
                        const message = `Olá ${lead.name}, gostaria de conversar sobre o seu planejamento financeiro.`;
                        const encodedMessage = encodeURIComponent(message);
                        window.open(
                          `https://wa.me/${phoneNumber}?text=${encodedMessage}`,
                          "_blank"
                        );
                      }}
                      title="Enviar WhatsApp"
                      color="#25D366"
                      hoverColor="#25D366"
                    />
                    <ActionButton
                      icon={Trash2}
                      onClick={() => handleDeleteLead(lead.id)}
                      title="Excluir"
                      color="#ef4444"
                      hoverColor="#ef4444"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Paginação */}
          <div style={styles.paginationContainer}>
            <button
              onClick={() => setPageNumber(Math.max(1, pageNumber - 1))}
              disabled={pageNumber === 1}
              style={{
                ...styles.paginationButton,
                opacity: pageNumber === 1 ? 0.5 : 1,
                cursor: pageNumber === 1 ? "not-allowed" : "pointer",
              }}
            >
              ← Anterior
            </button>

            <div style={styles.pageInfo}>
              {pageNumber} / {totalPages || 1}
            </div>

            <button
              onClick={() => setPageNumber(Math.min(totalPages || 1, pageNumber + 1))}
              disabled={pageNumber >= totalPages}
              style={{
                ...styles.paginationButton,
                opacity: pageNumber >= totalPages ? 0.5 : 1,
                cursor: pageNumber >= totalPages ? "not-allowed" : "pointer",
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

      {/* Modal de Confirmação */}
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
