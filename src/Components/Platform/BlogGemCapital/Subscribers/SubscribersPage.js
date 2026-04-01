import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  Trash2,
  Search,
  ArrowUp,
  ArrowDown,
  AlertCircle,
} from "lucide-react";
import blogGemCapitalSubscriberService from "../../../../dbServices/blogGemCapitalSubscriberService";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import styles from "./SubscribersPageStyle";

const SubscribersPage = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [orderBy, setOrderBy] = useState("createdAt");
  const [orderDirection, setOrderDirection] = useState("desc");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSubscriberId, setSelectedSubscriberId] = useState(null);

  useEffect(() => {
    fetchDashboardStats();
    fetchSubscribers();
  }, []);

  const fetchDashboardStats = async () => {
    setLoadingStats(true);
    try {
      const data = await blogGemCapitalSubscriberService.getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error("Erro ao buscar estatísticas:", error);
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchSubscribers = async (
    page = 1,
    search = "",
    orderByValue = orderBy,
    orderDir = orderDirection
  ) => {
    setLoading(true);
    try {
      const data = await blogGemCapitalSubscriberService.searchSubscribers(
        search || null,
        page,
        pageSize,
        orderByValue,
        orderDir
      );
      setSubscribers(data.data || []);
      setTotalPages(data.totalPages || 1);
      setCurrentPage(data.currentPage || 1);
    } catch (error) {
      console.error("Erro ao buscar assinantes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setCurrentPage(1);
    fetchSubscribers(1, value, orderBy, orderDirection);
  };

  const handleOrderChange = (field) => {
    const newDirection =
      orderBy === field && orderDirection === "asc" ? "desc" : "asc";
    setOrderBy(field);
    setOrderDirection(newDirection);
    setCurrentPage(1);
    fetchSubscribers(1, searchTerm, field, newDirection);
  };

  const openDeleteModal = (id) => {
    setSelectedSubscriberId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await blogGemCapitalSubscriberService.deleteSubscriber(
        selectedSubscriberId
      );
      setShowDeleteModal(false);
      fetchSubscribers(currentPage, searchTerm, orderBy, orderDirection);
    } catch (error) {
      console.error("Erro ao deletar:", error);
      alert("Erro ao deletar assinante");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const getStatusColor = (status) => {
    const s = String(status).toLowerCase();
    if (s === "active" || status === 1) return "#10b981";
    if (s === "paused" || status === 2) return "#f59e0b";
    if (s === "cancelled" || status === 3) return "#ef4444";
    return "#6b7280";
  };

  const getStatusLabel = (status) => {
    const s = String(status).toLowerCase();
    if (s === "active" || status === 1) return "Ativo";
    if (s === "paused" || status === 2) return "Pausado";
    if (s === "cancelled" || status === 3) return "Cancelado";
    return "Desconhecido";
  };

  const renderStatCard = (label, value, color = null) => (
    <div style={styles.statCard}>
      <div style={styles.statLabel}>{label}</div>
      <div
        style={{
          ...styles.statValue,
          color: color || "#1e293b",
          ...(loadingStats ? styles.loadingPulse : {}),
        }}
      >
        {loadingStats ? "..." : value ?? 0}
      </div>
    </div>
  );

  return (
    <div style={styles.pageContainer}>
      <div style={styles.pageHeader}>
        <h1 style={styles.pageTitle}>Assinantes do Blog GemCapital</h1>
        <p style={styles.pageSubtitle}>
          Gerencie assinantes, visualize estatísticas e analise tendências
        </p>
      </div>

      <div style={styles.statsGrid}>
        {renderStatCard("Total de Assinantes", stats?.totalSubscribers)}
        {renderStatCard("Hoje", stats?.todaySubscribers)}
        {renderStatCard("Esta Semana", stats?.thisWeekSubscribers)}
        {renderStatCard("Este Mês", stats?.thisMonthSubscribers)}
        {renderStatCard("Últimos 6 Meses", stats?.last6MonthsSubscribers)}
        {renderStatCard("Este Ano", stats?.thisYearSubscribers)}
        {renderStatCard(
          "Idade Média",
          stats?.averageAge ? stats.averageAge.toFixed(1) + " anos" : "0 anos"
        )}
        {renderStatCard("Ativos", stats?.activeSubscribers, "#10b981")}
        {renderStatCard("Pausados", stats?.pausedSubscribers, "#f59e0b")}
        {renderStatCard("Cancelados", stats?.cancelledSubscribers, "#ef4444")}
      </div>

      <div style={styles.comparisonSection}>
        <h3 style={styles.sectionTitle}>Comparativo Mensal</h3>
        {loadingStats ? (
          <div style={styles.loadingContainer}>Carregando tendências...</div>
        ) : (
          <>
            {stats?.monthlyComparison && (
              <>
                <div style={styles.comparisonCards}>
                  <div style={styles.comparisonCard}>
                    <div style={styles.monthLabel}>
                      {stats.monthlyComparison.currentMonthName}
                    </div>
                    <div style={styles.monthValue}>
                      {stats.monthlyComparison.currentMonthCount}
                    </div>
                  </div>
                  <div style={styles.changeIndicator}>
                    <div style={styles.changeValue}>
                      {stats.monthlyComparison.percentageChange > 0 ? "+" : ""}
                      {stats.monthlyComparison.percentageChange.toFixed(1)}%
                    </div>
                    <div style={styles.changeLabel}>
                      {stats.monthlyComparison.percentageChange > 0
                        ? "Crescimento"
                        : "Queda"}
                    </div>
                  </div>
                  <div style={styles.comparisonCard}>
                    <div style={styles.monthLabel}>
                      {stats.monthlyComparison.previousMonthName}
                    </div>
                    <div style={styles.monthValue}>
                      {stats.monthlyComparison.previousMonthCount}
                    </div>
                  </div>
                </div>

                {stats.monthlyComparison.dailyData && (
                  <div style={styles.chartContainer}>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={stats.monthlyComparison.dailyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis
                          dataKey="day"
                          stroke="#6b7280"
                          style={{ fontSize: "12px" }}
                        />
                        <YAxis stroke="#6b7280" style={{ fontSize: "12px" }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#fff",
                            border: "1px solid #e5e7eb",
                            borderRadius: "8px",
                          }}
                          formatter={(value) => [value, "Assinantes"]}
                        />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="count"
                          stroke="#6366f1"
                          dot={false}
                          strokeWidth={2}
                          name="Assinantes/Dia"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>

      <div style={styles.tableSection}>
        <div style={styles.tableHeader}>
          <h3 style={styles.sectionTitle}>Assinantes</h3>
          <div style={{ position: "relative" }}>
            <Search
              size={18}
              style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#94a3b8",
              }}
            />
            <input
              type="text"
              placeholder="Buscar por nome ou email..."
              value={searchTerm}
              onChange={handleSearch}
              style={{ ...styles.searchInput, paddingLeft: "40px" }}
            />
          </div>
        </div>

        {loading ? (
          <div style={styles.loading}>Carregando assinantes...</div>
        ) : (
          <>
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.tableHeaderRow}>
                    <th style={styles.tableCell}>Nome</th>
                    <th style={styles.tableCell}>Email</th>
                    <th
                      style={{ ...styles.tableCell, cursor: "pointer" }}
                      onClick={() => handleOrderChange("createdAt")}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        Inscrição
                        {orderBy === "createdAt" &&
                          (orderDirection === "asc" ? (
                            <ArrowUp size={14} />
                          ) : (
                            <ArrowDown size={14} />
                          ))}
                      </div>
                    </th>
                    <th
                      style={{ ...styles.tableCell, cursor: "pointer" }}
                      onClick={() => handleOrderChange("dateOfBirth")}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        Nascimento
                        {orderBy === "dateOfBirth" &&
                          (orderDirection === "asc" ? (
                            <ArrowUp size={14} />
                          ) : (
                            <ArrowDown size={14} />
                          ))}
                      </div>
                    </th>
                    <th style={styles.tableCell}>Status</th>
                    <th style={styles.tableCell}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {subscribers.length > 0 ? (
                    subscribers.map((subscriber) => (
                      <tr key={subscriber.id} style={styles.tableRow}>
                        <td style={styles.tableCell}>{subscriber.name}</td>
                        <td style={styles.tableCell}>{subscriber.email}</td>
                        <td style={styles.tableCell}>
                          {formatDate(subscriber.createdAt)}
                        </td>
                        <td style={styles.tableCell}>
                          {formatDate(subscriber.dateOfBirth)}
                        </td>
                        <td style={styles.tableCell}>
                          <span
                            style={{
                              ...styles.statusBadge,
                              backgroundColor: getStatusColor(
                                subscriber.status
                              ),
                              color: "#fff",
                            }}
                          >
                            {getStatusLabel(subscriber.status)}
                          </span>
                        </td>
                        <td style={styles.tableCell}>
                          <div style={{ display: "flex", gap: "10px" }}>
                            <button
                              onClick={() =>
                                navigate(
                                  `/platform/blog-gemcapital/subscribers/${subscriber.id}`
                                )
                              }
                              style={styles.actionButton}
                              title="Ver Detalhes"
                            >
                              <Eye size={18} color="#6366f1" />
                            </button>
                            <button
                              onClick={() => openDeleteModal(subscriber.id)}
                              style={styles.actionButton}
                              title="Deletar"
                            >
                              <Trash2 size={18} color="#ef4444" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" style={styles.emptyCell}>
                        Nenhum assinante encontrado
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div style={styles.pagination}>
                <button
                  onClick={() =>
                    fetchSubscribers(
                      currentPage - 1,
                      searchTerm,
                      orderBy,
                      orderDirection
                    )
                  }
                  disabled={currentPage === 1}
                  style={{
                    ...styles.paginationButton,
                    opacity: currentPage === 1 ? 0.5 : 1,
                    cursor: currentPage === 1 ? "not-allowed" : "pointer",
                  }}
                >
                  ← Anterior
                </button>
                <div style={styles.pageInfo}>
                  Página {currentPage} de {totalPages}
                </div>
                <button
                  onClick={() =>
                    fetchSubscribers(
                      currentPage + 1,
                      searchTerm,
                      orderBy,
                      orderDirection
                    )
                  }
                  disabled={currentPage === totalPages}
                  style={{
                    ...styles.paginationButton,
                    opacity: currentPage === totalPages ? 0.5 : 1,
                    cursor:
                      currentPage === totalPages ? "not-allowed" : "pointer",
                  }}
                >
                  Próxima →
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* MODAL DE CONFIRMAÇÃO DE EXCLUSÃO */}
      {showDeleteModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <AlertCircle color="#ef4444" size={32} />
              <h3 style={styles.modalTitle}>Confirmar Exclusão</h3>
            </div>
            <p style={styles.modalBody}>
              Tem certeza que deseja remover este assinante? Esta ação não pode
              ser desfeita.
            </p>
            <div style={styles.modalFooter}>
              <button
                onClick={() => setShowDeleteModal(false)}
                style={styles.cancelButton}
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                style={styles.confirmDeleteButton}
              >
                Excluir Agora
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscribersPage;
