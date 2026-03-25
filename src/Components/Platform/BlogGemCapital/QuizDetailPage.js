import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { FiEye, FiCheck, FiX, FiEdit2 } from "react-icons/fi";
import BlogGemCapitalContainer from "./BlogGemCapitalContainer";
import { QuizResponseDetailsModal, ConfirmModal, SuccessModal } from "./Quiz";
import quizServices from "../../../dbServices/quizServices";

const QuizDetailPage = () => {
  const navigate = useNavigate();
  const { quizId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedResponse, setSelectedResponse] = useState(null);
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "questions");

  // States for responses table
  const [paginatedData, setPaginatedData] = useState({
    data: [],
    totalCount: 0,
    page: 1,
    pageSize: 5,
    totalPages: 0,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingResponses, setIsLoadingResponses] = useState(false);

  // Filter states
  const [filters, setFilters] = useState({
    searchName: "",
    status: "",
    sortOrder: "newest",
    dateFrom: "",
    dateTo: "",
  });

  // Debounce state for search name
  const [searchNameInput, setSearchNameInput] = useState("");

  // Debounce effect for search name
  useEffect(() => {
    const timer = setTimeout(() => {
      handleFilterChange({ ...filters, searchName: searchNameInput });
    }, 500); // Wait 500ms after user stops typing

    return () => clearTimeout(timer);
  }, [searchNameInput]);

  // Modal states
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, responseId: null });
  const [contactModal, setContactModal] = useState({ isOpen: false, responseId: null });
  const [observationModal, setObservationModal] = useState({
    isOpen: false,
    responseId: null,
    observations: "",
  });
  const [leadQualityModal, setLeadQualityModal] = useState({
    isOpen: false,
    responseId: null,
  });
  const [successModal, setSuccessModal] = useState({
    isOpen: false,
    title: "",
    message: "",
  });

  useEffect(() => {
    fetchQuizDetail();
  }, [quizId]);

  useEffect(() => {
    fetchQuizResponses();
  }, [quizId, currentPage, filters]);

  const fetchQuizDetail = async () => {
    try {
      setLoading(true);
      const data = await quizServices.getQuizById(quizId);
      setQuiz(data);
    } catch (error) {
      console.error("Erro ao buscar quiz:", error);
      alert("Erro ao carregar quiz");
    } finally {
      setLoading(false);
    }
  };

  const fetchQuizResponses = async () => {
    try {
      setIsLoadingResponses(true);

      // Convert status filter to match backend expectations
      let statusFilter = undefined;
      if (filters.status === "contacted") {
        statusFilter = "contacted";
      } else if (filters.status === "not_contacted") {
        statusFilter = "notContacted";
      }

      const result = await quizServices.getQuizResponsesFiltered(quizId, {
        searchName: filters.searchName || undefined,
        status: statusFilter,
        sortOrder: filters.sortOrder,
        dateFrom: filters.dateFrom || undefined,
        dateTo: filters.dateTo || undefined,
        page: currentPage,
        pageSize: 5,
      });
      setPaginatedData(result);
    } catch (error) {
      console.error("Erro ao buscar respostas:", error);
    } finally {
      setIsLoadingResponses(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleClearFilters = () => {
    setFilters({
      searchName: "",
      status: "",
      sortOrder: "newest",
      dateFrom: "",
      dateTo: "",
    });
    setCurrentPage(1);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const handleViewResponse = async (response) => {
    try {
      const fullResponse = await quizServices.getResponseDetails(response.id);
      setSelectedResponse(fullResponse);
      setShowDetailsModal(true);
    } catch (error) {
      console.error("Erro ao buscar detalhes:", error);
      alert("Erro ao carregar detalhes da resposta");
    }
  };

  const handleMarkAsContacted = async (responseId) => {
    try {
      await quizServices.markAsContacted(responseId);
      setSuccessModal({
        isOpen: true,
        title: "Sucesso!",
        message: "Resposta marcada como contactada",
      });
      setContactModal({ isOpen: false, responseId: null });
      fetchQuizResponses();
    } catch (error) {
      alert("Erro: " + error.message);
    }
  };

  const handleUpdateObservations = async (responseId, observations) => {
    try {
      await quizServices.updateObservations(responseId, observations);
      setSuccessModal({
        isOpen: true,
        title: "Sucesso!",
        message: "Observações atualizadas",
      });
      setObservationModal({ isOpen: false, responseId: null, observations: "" });
      fetchQuizResponses();
    } catch (error) {
      alert("Erro: " + error.message);
    }
  };

  const handleUpdateLeadQuality = async (responseId, quality) => {
    try {
      await quizServices.updateLeadQuality(responseId, quality);
      setSuccessModal({
        isOpen: true,
        title: "Sucesso!",
        message: "Qualidade do lead atualizada",
      });
      setLeadQualityModal({ isOpen: false, responseId: null });
      fetchQuizResponses();
    } catch (error) {
      alert("Erro: " + error.message);
    }
  };

  const handleUpdateInvestorProfile = async (responseId, investorProfile) => {
    try {
      await quizServices.updateInvestorProfile(responseId, investorProfile);
      setSuccessModal({
        isOpen: true,
        title: "Sucesso!",
        message: "Perfil investidor atualizado",
      });
      fetchQuizResponses();
    } catch (error) {
      alert("Erro: " + error.message);
    }
  };

  const handleActivateQuiz = async () => {
    if (!window.confirm("Tem certeza que deseja ativar este quiz? Outros quizzes ativos serão desativados.")) return;

    try {
      setLoading(true);
      await quizServices.activateQuiz(quizId);
      setSuccessModal({
        isOpen: true,
        title: "Sucesso!",
        message: "Quiz ativado com sucesso!",
      });
      fetchQuizDetail();
    } catch (error) {
      alert("Erro ao ativar quiz: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivateQuiz = async () => {
    if (!window.confirm("Tem certeza que deseja desativar este quiz? Nenhum quiz estará ativo.")) return;

    try {
      setLoading(true);
      await quizServices.deactivateQuiz(quizId);
      setSuccessModal({
        isOpen: true,
        title: "Sucesso!",
        message: "Quiz desativado com sucesso!",
      });
      fetchQuizDetail();
    } catch (error) {
      alert("Erro ao desativar quiz: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <BlogGemCapitalContainer counts={{ quizzes: 0 }}>
        <div style={{ textAlign: "center", padding: "40px" }}>
          <div style={{ fontSize: "18px", color: "#6b7280" }}>
            Carregando quiz...
          </div>
        </div>
      </BlogGemCapitalContainer>
    );
  }

  if (!quiz) {
    return (
      <BlogGemCapitalContainer counts={{ quizzes: 0 }}>
        <div style={{ textAlign: "center", padding: "40px" }}>
          <div style={{ fontSize: "18px", color: "#ef4444" }}>
            Quiz não encontrado
          </div>
          <button
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              backgroundColor: "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
            onClick={() => navigate("/platform/blog-gemcapital/quizzes/gerenciar")}
          >
            ← Voltar
          </button>
        </div>
      </BlogGemCapitalContainer>
    );
  }

  const leadQualityOptions = [
    { value: 0, label: "Não Avaliado" },
    { value: 1, label: "Ruim" },
    { value: 2, label: "Regular" },
    { value: 3, label: "Bom" },
    { value: 4, label: "Muito Bom" },
  ];

  const styles = {
    headerContainer: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: "30px",
      gap: "20px",
      flexWrap: "wrap",
    },
    quizHeader: {
      flex: 1,
      minWidth: "300px",
    },
    title: {
      fontSize: "28px",
      fontWeight: "bold",
      color: "#1f2937",
      marginBottom: "10px",
    },
    description: {
      fontSize: "14px",
      color: "#6b7280",
      marginBottom: "10px",
    },
    meta: {
      fontSize: "13px",
      color: "#9ca3af",
      marginBottom: "5px",
    },
    statusBadge: {
      display: "inline-block",
      padding: "6px 12px",
      borderRadius: "6px",
      fontSize: "12px",
      fontWeight: "600",
      marginTop: "10px",
    },
    statusActive: {
      backgroundColor: "#d1fae5",
      color: "#065f46",
    },
    statusInactive: {
      backgroundColor: "#f3f4f6",
      color: "#374151",
    },
    button: {
      padding: "10px 20px",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      fontWeight: "500",
      fontSize: "14px",
      transition: "all 0.2s ease",
    },
    primaryButton: {
      backgroundColor: "#007bff",
      color: "white",
    },
    secondaryButton: {
      backgroundColor: "#6c757d",
      color: "white",
    },
    section: {
      marginTop: "40px",
    },
    sectionTitle: {
      fontSize: "20px",
      fontWeight: "bold",
      color: "#1f2937",
      marginBottom: "20px",
    },
    questionCard: {
      padding: "20px",
      border: "1px solid #e5e7eb",
      borderRadius: "8px",
      marginBottom: "15px",
      backgroundColor: "#f9fafb",
    },
    questionText: {
      fontSize: "16px",
      fontWeight: "600",
      color: "#1f2937",
      marginBottom: "12px",
    },
    alternativesContainer: {
      marginLeft: "15px",
    },
    alternative: {
      padding: "10px 12px",
      borderRadius: "6px",
      marginBottom: "8px",
      backgroundColor: "white",
      border: "1px solid #e5e7eb",
      fontSize: "14px",
      color: "#374151",
    },
    tableContainer: {
      overflowX: "auto",
      marginBottom: "20px",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      fontSize: "14px",
    },
    th: {
      padding: "12px",
      textAlign: "left",
      backgroundColor: "#f3f4f6",
      fontWeight: "600",
      color: "#1f2937",
      borderBottom: "2px solid #e5e7eb",
    },
    td: {
      padding: "12px",
      borderBottom: "1px solid #e5e7eb",
      color: "#374151",
    },
    actionButton: {
      padding: "6px 12px",
      border: "1px solid #ddd",
      borderRadius: "4px",
      backgroundColor: "#f9fafb",
      cursor: "pointer",
      marginRight: "8px",
      fontSize: "12px",
      transition: "all 0.2s ease",
    },
    badgeContacted: {
      display: "inline-block",
      padding: "4px 8px",
      borderRadius: "4px",
      backgroundColor: "#d1fae5",
      color: "#065f46",
      fontSize: "12px",
      fontWeight: "600",
    },
    badgePending: {
      display: "inline-block",
      padding: "4px 8px",
      borderRadius: "4px",
      backgroundColor: "#fee2e2",
      color: "#991b1b",
      fontSize: "12px",
      fontWeight: "600",
    },
    paginationContainer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: "10px",
      marginTop: "20px",
      padding: "20px",
    },
    paginationButton: {
      padding: "8px 12px",
      border: "1px solid #ddd",
      borderRadius: "4px",
      backgroundColor: "#fff",
      cursor: "pointer",
      fontSize: "12px",
    },
    noResponses: {
      padding: "40px 20px",
      textAlign: "center",
      color: "#6b7280",
      fontSize: "14px",
    },
  };

  return (
    <BlogGemCapitalContainer counts={{ quizzes: 1 }}>
      {/* Header */}
      <div style={styles.headerContainer}>
        <div style={styles.quizHeader}>
          <h1 style={styles.title}>{quiz.name}</h1>
          <p style={styles.description}>{quiz.description}</p>
          <p style={styles.meta}>
            Criado em:{" "}
            {new Date(quiz.createdAt).toLocaleDateString("pt-BR", {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
          <span
            style={{
              ...styles.statusBadge,
              ...(quiz.isActive ? styles.statusActive : styles.statusInactive),
            }}
          >
            {quiz.isActive ? "✓ Ativo" : "○ Inativo"}
          </span>

          {/* Investor Profile Types */}
          {quiz.investorProfileTypes && quiz.investorProfileTypes.length > 0 && (
            <div style={{ marginTop: "15px" }}>
              <div style={{ fontSize: "12px", fontWeight: "600", color: "#666", marginBottom: "8px", textTransform: "uppercase" }}>
                👥 Tipos de Perfil Investidor
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {quiz.investorProfileTypes.map((type, index) => (
                  <span
                    key={index}
                    style={{
                      display: "inline-block",
                      padding: "6px 12px",
                      backgroundColor: "#f0f7ff",
                      color: "#0066cc",
                      borderRadius: "6px",
                      border: "1px solid #b3d9ff",
                      fontSize: "12px",
                      fontWeight: "600",
                    }}
                  >
                    {type}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Tabs Selector */}
          <div style={{ marginTop: "15px", display: "flex", gap: "10px" }}>
            <button
              onClick={() => handleTabChange("questions")}
              style={{
                padding: "8px 16px",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: activeTab === "questions" ? "600" : "500",
                fontSize: "14px",
                backgroundColor:
                  activeTab === "questions" ? "#007bff" : "#e9ecef",
                color: activeTab === "questions" ? "white" : "#495057",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                if (activeTab !== "questions") {
                  e.target.style.backgroundColor = "#dee2e6";
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== "questions") {
                  e.target.style.backgroundColor = "#e9ecef";
                }
              }}
            >
              📝 Questões
            </button>
            <button
              onClick={() => handleTabChange("responses")}
              style={{
                padding: "8px 16px",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: activeTab === "responses" ? "600" : "500",
                fontSize: "14px",
                backgroundColor:
                  activeTab === "responses" ? "#007bff" : "#e9ecef",
                color: activeTab === "responses" ? "white" : "#495057",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                if (activeTab !== "responses") {
                  e.target.style.backgroundColor = "#dee2e6";
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== "responses") {
                  e.target.style.backgroundColor = "#e9ecef";
                }
              }}
            >
              📊 Respostas
            </button>
          </div>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          {!quiz.isActive && (
            <button
              style={{
                ...styles.button,
                backgroundColor: "#10b981",
                color: "white",
              }}
              onClick={handleActivateQuiz}
              disabled={loading}
              onMouseEnter={(e) => {
                if (!loading) e.target.style.backgroundColor = "#059669";
              }}
              onMouseLeave={(e) => {
                if (!loading) e.target.style.backgroundColor = "#10b981";
              }}
            >
              ⚡ Ativar Quiz
            </button>
          )}
          {quiz.isActive && (
            <button
              style={{
                ...styles.button,
                backgroundColor: "#ef4444",
                color: "white",
              }}
              onClick={handleDeactivateQuiz}
              disabled={loading}
              onMouseEnter={(e) => {
                if (!loading) e.target.style.backgroundColor = "#dc2626";
              }}
              onMouseLeave={(e) => {
                if (!loading) e.target.style.backgroundColor = "#ef4444";
              }}
            >
              ○ Desativar Quiz
            </button>
          )}
          <button
            style={{ ...styles.button, ...styles.secondaryButton }}
            onClick={() => navigate("/platform/blog-gemcapital/quizzes/gerenciar")}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#5a6268";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#6c757d";
            }}
            disabled={loading}
          >
            ← Voltar
          </button>
        </div>
      </div>

      {/* Questions Tab */}
      {activeTab === "questions" && (
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>📝 Questões</h2>
        {quiz.questions && quiz.questions.length > 0 ? (
          <div>
            {quiz.questions.map((question, index) => (
              <div key={question.id} style={styles.questionCard}>
                <div style={styles.questionText}>
                  {index + 1}. {question.questionText}
                </div>
                <div style={styles.alternativesContainer}>
                  {question.alternativesSnapshot && question.alternativesSnapshot.length > 0 ? (
                    question.alternativesSnapshot.map((alt, altIndex) => (
                      <div key={altIndex} style={styles.alternative}>
                        <strong>{alt.Id}.</strong> {alt.Text}
                      </div>
                    ))
                  ) : (
                    <div style={styles.alternative}>
                      Nenhuma alternativa cadastrada
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={styles.noResponses}>
            Nenhuma questão cadastrada para este quiz
          </div>
        )}
      </div>
      )}

      {/* Responses Tab */}
      {activeTab === "responses" && (
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>
          📊 Respostas ({paginatedData.totalCount})
        </h2>

        {/* Filters */}
        <div style={{
          backgroundColor: "#f9fafb",
          padding: "20px",
          borderRadius: "8px",
          border: "1px solid #e5e7eb",
          marginBottom: "20px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "15px",
          alignItems: "flex-end",
        }}>
          {/* Search by name */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label style={{ fontSize: "12px", fontWeight: "600", color: "#666", marginBottom: "6px", textTransform: "uppercase" }}>
              🔍 Buscar por Nome
            </label>
            <input
              type="text"
              placeholder="Nome do lead..."
              value={searchNameInput}
              onChange={(e) => setSearchNameInput(e.target.value)}
              style={{
                padding: "10px 12px",
                border: "1px solid #ddd",
                borderRadius: "6px",
                fontSize: "13px",
                fontFamily: "inherit",
              }}
            />
            {searchNameInput && searchNameInput !== filters.searchName && (
              <div style={{
                fontSize: "11px",
                color: "#7c3aed",
                marginTop: "4px",
                fontStyle: "italic",
              }}>
                ⏳ Pesquisando...
              </div>
            )}
          </div>

          {/* Status filter */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label style={{ fontSize: "12px", fontWeight: "600", color: "#666", marginBottom: "6px", textTransform: "uppercase" }}>
              📋 Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange({ ...filters, status: e.target.value })}
              style={{
                padding: "10px 12px",
                border: "1px solid #ddd",
                borderRadius: "6px",
                fontSize: "13px",
                fontFamily: "inherit",
                backgroundColor: "white",
              }}
            >
              <option value="">Todos</option>
              <option value="contacted">✓ Contactados</option>
              <option value="not_contacted">✗ Não Contactados</option>
            </select>
          </div>

          {/* Sort order */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label style={{ fontSize: "12px", fontWeight: "600", color: "#666", marginBottom: "6px", textTransform: "uppercase" }}>
              ↓ Ordenação
            </label>
            <select
              value={filters.sortOrder}
              onChange={(e) => handleFilterChange({ ...filters, sortOrder: e.target.value })}
              style={{
                padding: "10px 12px",
                border: "1px solid #ddd",
                borderRadius: "6px",
                fontSize: "13px",
                fontFamily: "inherit",
                backgroundColor: "white",
              }}
            >
              <option value="newest">Mais Recentes</option>
              <option value="oldest">Mais Antigas</option>
            </select>
          </div>

          {/* Date from */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label style={{ fontSize: "12px", fontWeight: "600", color: "#666", marginBottom: "6px", textTransform: "uppercase" }}>
              📅 De
            </label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => handleFilterChange({ ...filters, dateFrom: e.target.value })}
              style={{
                padding: "10px 12px",
                border: "1px solid #ddd",
                borderRadius: "6px",
                fontSize: "13px",
                fontFamily: "inherit",
              }}
            />
          </div>

          {/* Date to */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label style={{ fontSize: "12px", fontWeight: "600", color: "#666", marginBottom: "6px", textTransform: "uppercase" }}>
              📅 Até
            </label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => handleFilterChange({ ...filters, dateTo: e.target.value })}
              style={{
                padding: "10px 12px",
                border: "1px solid #ddd",
                borderRadius: "6px",
                fontSize: "13px",
                fontFamily: "inherit",
              }}
            />
          </div>

          {/* Clear filters button */}
          <button
            onClick={handleClearFilters}
            style={{
              padding: "10px 16px",
              backgroundColor: "#e9ecef",
              color: "#495057",
              border: "1px solid #ddd",
              borderRadius: "6px",
              fontSize: "13px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#dee2e6";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#e9ecef";
            }}
          >
            🔄 Limpar Filtros
          </button>
        </div>

        {/* Loading Indicator */}
        {isLoadingResponses && (
          <div style={{
            position: "relative",
            height: "200px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(255, 255, 255, 0.7)",
            backdropFilter: "blur(2px)",
            borderRadius: "8px",
            border: "1px solid #e5e7eb",
            marginBottom: "20px",
          }}>
            <div style={{
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "12px",
            }}>
              <div style={{
                fontSize: "32px",
                animation: "spin 1s linear infinite",
              }}>
                🔍
              </div>
              <div style={{
                fontSize: "16px",
                fontWeight: "600",
                color: "#1f2937",
              }}>
                Pesquisando...
              </div>
              <div style={{
                fontSize: "12px",
                color: "#6b7280",
              }}>
                Filtrando respostas...
              </div>
            </div>
            <style>{`
              @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        )}

        {!isLoadingResponses && paginatedData.data.length > 0 ? (
          <>
            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Nome</th>
                    <th style={styles.th}>Email</th>
                    <th style={styles.th}>Telefone</th>
                    <th style={styles.th}>Data Resposta</th>
                    <th style={styles.th}>Contactado</th>
                    <th style={styles.th}>Qualidade</th>
                    <th style={styles.th}>👥 Perfil Investidor</th>
                    <th style={styles.th}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.data.map((response) => (
                    <tr key={response.id}>
                      <td style={styles.td}>{response.fullName}</td>
                      <td style={styles.td}>{response.email}</td>
                      <td style={styles.td}>{response.phone}</td>
                      <td style={styles.td}>
                        {new Date(response.respondedAt).toLocaleDateString(
                          "pt-BR"
                        )}
                      </td>
                      <td style={styles.td}>
                        <span
                          style={
                            response.contacted
                              ? styles.badgeContacted
                              : styles.badgePending
                          }
                        >
                          {response.contacted ? "✓ Sim" : "✗ Não"}
                        </span>
                      </td>
                      <td style={styles.td}>
                        {response.leadQuality === 0
                          ? "Não Avaliado"
                          : response.leadQuality === 1
                          ? "Ruim"
                          : response.leadQuality === 2
                          ? "Regular"
                          : response.leadQuality === 3
                          ? "Bom"
                          : "Muito Bom"}
                      </td>
                      <td style={styles.td}>
                        <span style={{
                          padding: "4px 8px",
                          borderRadius: "4px",
                          backgroundColor: response.investorProfile ? "#f0f7ff" : "#f3f4f6",
                          color: response.investorProfile ? "#0066cc" : "#6b7280",
                          fontSize: "12px",
                          fontWeight: "600",
                        }}>
                          {response.investorProfile || "Não obtido"}
                        </span>
                      </td>
                      <td style={styles.td}>
                        <button
                          style={styles.actionButton}
                          onClick={() => handleViewResponse(response)}
                          title="Ver detalhes"
                        >
                          <FiEye size={16} />
                        </button>
                        {!response.contacted && (
                          <button
                            style={{
                              ...styles.actionButton,
                              backgroundColor: "#d1fae5",
                              borderColor: "#10b981",
                            }}
                            onClick={() =>
                              setContactModal({
                                isOpen: true,
                                responseId: response.id,
                              })
                            }
                            title="Marcar como contactado"
                          >
                            <FiCheck size={16} />
                          </button>
                        )}
                        <button
                          style={{
                            ...styles.actionButton,
                            backgroundColor: "#fef3c7",
                            borderColor: "#f59e0b",
                          }}
                          onClick={() =>
                            setObservationModal({
                              isOpen: true,
                              responseId: response.id,
                              observations: response.adminObservations || "",
                            })
                          }
                          title="Editar observações"
                        >
                          <FiEdit2 size={16} />
                        </button>
                        <button
                          style={{
                            ...styles.actionButton,
                            backgroundColor: "#fce7f3",
                            borderColor: "#ec4899",
                          }}
                          onClick={() =>
                            setLeadQualityModal({
                              isOpen: true,
                              responseId: response.id,
                            })
                          }
                          title="Avaliar qualidade"
                        >
                          ⭐
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div style={styles.paginationContainer}>
              <button
                style={styles.paginationButton}
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                ← Anterior
              </button>
              <span>
                Página {paginatedData.page} de {paginatedData.totalPages}
              </span>
              <button
                style={styles.paginationButton}
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === paginatedData.totalPages}
              >
                Próxima →
              </button>
            </div>
          </>
        ) : (
          <div style={styles.noResponses}>
            Nenhuma resposta cadastrada para este quiz
          </div>
        )}
      </div>
      )}

      {/* Modals */}
      {showDetailsModal && selectedResponse && (
        <QuizResponseDetailsModal
          isOpen={showDetailsModal}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedResponse(null);
          }}
          response={selectedResponse}
          quiz={quiz}
          onUpdateObservations={handleUpdateObservations}
          onUpdateLeadQuality={handleUpdateLeadQuality}
          onUpdateInvestorProfile={handleUpdateInvestorProfile}
        />
      )}

      {contactModal.isOpen && (
        <ConfirmModal
          title="Marcar como Contactado"
          message="Tem certeza que deseja marcar esta resposta como contactada?"
          onConfirm={() => handleMarkAsContacted(contactModal.responseId)}
          onCancel={() => setContactModal({ isOpen: false, responseId: null })}
          isDanger={false}
        />
      )}

      {observationModal.isOpen && (
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
        }}>
          <div style={{
            backgroundColor: "white",
            borderRadius: "8px",
            padding: "30px",
            maxWidth: "500px",
            width: "90%",
            boxShadow: "0 10px 40px rgba(0, 0, 0, 0.2)",
          }}>
            <h3 style={{ marginBottom: "20px", fontSize: "18px", fontWeight: "bold" }}>
              Observações
            </h3>
            <textarea
              style={{
                width: "100%",
                height: "120px",
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "6px",
                fontSize: "14px",
                fontFamily: "inherit",
                marginBottom: "20px",
              }}
              value={observationModal.observations}
              onChange={(e) =>
                setObservationModal({
                  ...observationModal,
                  observations: e.target.value,
                })
              }
            />
            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
              <button
                style={{
                  ...styles.button,
                  backgroundColor: "#6c757d",
                  color: "white",
                }}
                onClick={() =>
                  setObservationModal({
                    isOpen: false,
                    responseId: null,
                    observations: "",
                  })
                }
              >
                Cancelar
              </button>
              <button
                style={{
                  ...styles.button,
                  ...styles.primaryButton,
                }}
                onClick={() =>
                  handleUpdateObservations(
                    observationModal.responseId,
                    observationModal.observations
                  )
                }
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      {leadQualityModal.isOpen && (
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
        }}>
          <div style={{
            backgroundColor: "white",
            borderRadius: "8px",
            padding: "30px",
            maxWidth: "400px",
            width: "90%",
            boxShadow: "0 10px 40px rgba(0, 0, 0, 0.2)",
          }}>
            <h3 style={{ marginBottom: "20px", fontSize: "18px", fontWeight: "bold" }}>
              Qualidade do Lead
            </h3>
            <div style={{ marginBottom: "20px" }}>
              {leadQualityOptions.map((option) => (
                <label
                  key={option.value}
                  style={{
                    display: "block",
                    padding: "10px",
                    marginBottom: "8px",
                    border: "1px solid #ddd",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="radio"
                    name="leadQuality"
                    value={option.value}
                    onChange={(e) =>
                      handleUpdateLeadQuality(
                        leadQualityModal.responseId,
                        parseInt(e.target.value)
                      )
                    }
                    style={{ marginRight: "10px" }}
                  />
                  {option.label}
                </label>
              ))}
            </div>
            <button
              style={{
                ...styles.button,
                backgroundColor: "#6c757d",
                color: "white",
                width: "100%",
              }}
              onClick={() =>
                setLeadQualityModal({
                  isOpen: false,
                  responseId: null,
                })
              }
            >
              Fechar
            </button>
          </div>
        </div>
      )}

      {successModal.isOpen && (
        <SuccessModal
          title={successModal.title}
          message={successModal.message}
          onClose={() =>
            setSuccessModal({
              isOpen: false,
              title: "",
              message: "",
            })
          }
        />
      )}
    </BlogGemCapitalContainer>
  );
};

export default QuizDetailPage;
