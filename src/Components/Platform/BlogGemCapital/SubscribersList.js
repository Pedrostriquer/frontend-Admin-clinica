import React, { useState, useEffect } from "react";
import blogGemCapitalSubscriberService from "../../../dbServices/blogGemCapitalSubscriberService";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import styles from "./SubscribersListStyle";

const SubscribersList = () => {
  const [stats, setStats] = useState(null);
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [orderBy, setOrderBy] = useState("createdAt");
  const [orderDirection, setOrderDirection] = useState("desc");

  useEffect(() => {
    fetchDashboardStats();
    fetchSubscribers();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const data = await blogGemCapitalSubscriberService.getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error("Erro ao buscar estatísticas:", error);
    }
  };

  const fetchSubscribers = async (page = 1, search = "", orderByValue = orderBy, orderDir = orderDirection) => {
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
      alert("Erro ao buscar assinantes");
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
    const newDirection = orderBy === field && orderDirection === "asc" ? "desc" : "asc";
    setOrderBy(field);
    setOrderDirection(newDirection);
    setCurrentPage(1);
    fetchSubscribers(1, searchTerm, field, newDirection);
  };

  const handleDeleteSubscriber = async (id) => {
    if (!window.confirm("Tem certeza que deseja deletar este assinante?")) return;

    try {
      await blogGemCapitalSubscriberService.deleteSubscriber(id);
      alert("Assinante deletado com sucesso!");
      await fetchSubscribers(currentPage, searchTerm, orderBy, orderDirection);
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
    switch (status) {
      case 1: // Active
        return "#10b981";
      case 2: // Paused
        return "#f59e0b";
      case 3: // Cancelled
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 1:
        return "Ativo";
      case 2:
        return "Pausado";
      case 3:
        return "Cancelado";
      default:
        return "Desconhecido";
    }
  };

  return (
    <div style={styles.container}>
      {/* Dashboard Stats */}
      {stats && (
        <>
          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <div style={styles.statLabel}>Total de Assinantes</div>
              <div style={styles.statValue}>{stats.totalSubscribers}</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statLabel}>Hoje</div>
              <div style={styles.statValue}>{stats.todaySubscribers}</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statLabel}>Esta Semana</div>
              <div style={styles.statValue}>{stats.thisWeekSubscribers}</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statLabel}>Este Mês</div>
              <div style={styles.statValue}>{stats.thisMonthSubscribers}</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statLabel}>Últimos 6 Meses</div>
              <div style={styles.statValue}>{stats.last6MonthsSubscribers}</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statLabel}>Este Ano</div>
              <div style={styles.statValue}>{stats.thisYearSubscribers}</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statLabel}>Idade Média</div>
              <div style={styles.statValue}>
                {stats.averageAge ? stats.averageAge.toFixed(1) : "-"} anos
              </div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statLabel}>Ativos</div>
              <div style={{ ...styles.statValue, color: "#10b981" }}>
                {stats.activeSubscribers}
              </div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statLabel}>Pausados</div>
              <div style={{ ...styles.statValue, color: "#f59e0b" }}>
                {stats.pausedSubscribers}
              </div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statLabel}>Cancelados</div>
              <div style={{ ...styles.statValue, color: "#ef4444" }}>
                {stats.cancelledSubscribers}
              </div>
            </div>
          </div>

          {/* Comparativo Mensal e Gráfico */}
          {stats.monthlyComparison && (
            <div style={styles.comparisonSection}>
              <h3 style={styles.sectionTitle}>Comparativo Mensal</h3>
              <div style={styles.comparisonCards}>
                <div style={styles.comparisonCard}>
                  <div style={styles.monthLabel}>{stats.monthlyComparison.currentMonthName}</div>
                  <div style={styles.monthValue}>{stats.monthlyComparison.currentMonthCount}</div>
                </div>
                <div style={styles.changeIndicator}>
                  <div style={styles.changeValue}>
                    {stats.monthlyComparison.percentageChange > 0 ? "+" : ""}
                    {stats.monthlyComparison.percentageChange.toFixed(1)}%
                  </div>
                  <div style={styles.changeLabel}>
                    {stats.monthlyComparison.percentageChange > 0 ? "Crescimento" : "Queda"}
                  </div>
                </div>
                <div style={styles.comparisonCard}>
                  <div style={styles.monthLabel}>{stats.monthlyComparison.previousMonthName}</div>
                  <div style={styles.monthValue}>{stats.monthlyComparison.previousMonthCount}</div>
                </div>
              </div>

              {/* Gráfico */}
              {stats.monthlyComparison.dailyData && stats.monthlyComparison.dailyData.length > 0 && (
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
            </div>
          )}
        </>
      )}

      {/* Tabela de Assinantes */}
      <div style={styles.tableSection}>
        <div style={styles.tableHeader}>
          <h3 style={styles.sectionTitle}>Assinantes</h3>
          <input
            type="text"
            placeholder="Buscar por nome ou email..."
            value={searchTerm}
            onChange={handleSearch}
            style={styles.searchInput}
          />
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
                      Data de Inscrição{" "}
                      {orderBy === "createdAt" && (
                        <span>{orderDirection === "asc" ? "↑" : "↓"}</span>
                      )}
                    </th>
                    <th
                      style={{ ...styles.tableCell, cursor: "pointer" }}
                      onClick={() => handleOrderChange("dateOfBirth")}
                    >
                      Data de Nascimento{" "}
                      {orderBy === "dateOfBirth" && (
                        <span>{orderDirection === "asc" ? "↑" : "↓"}</span>
                      )}
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
                        <td style={styles.tableCell}>{formatDate(subscriber.createdAt)}</td>
                        <td style={styles.tableCell}>{formatDate(subscriber.dateOfBirth)}</td>
                        <td style={styles.tableCell}>
                          <span
                            style={{
                              ...styles.statusBadge,
                              backgroundColor: getStatusColor(subscriber.status),
                              color: "#fff",
                            }}
                          >
                            {getStatusLabel(subscriber.status)}
                          </span>
                        </td>
                        <td style={styles.tableCell}>
                          <button
                            onClick={() => handleDeleteSubscriber(subscriber.id)}
                            style={styles.deleteButton}
                            title="Deletar assinante"
                          >
                            🗑️
                          </button>
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

            {/* Paginação */}
            {totalPages > 1 && (
              <div style={styles.pagination}>
                <button
                  onClick={() => fetchSubscribers(currentPage - 1, searchTerm, orderBy, orderDirection)}
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
                  onClick={() => fetchSubscribers(currentPage + 1, searchTerm, orderBy, orderDirection)}
                  disabled={currentPage === totalPages}
                  style={{
                    ...styles.paginationButton,
                    opacity: currentPage === totalPages ? 0.5 : 1,
                    cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                  }}
                >
                  Próxima →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SubscribersList;
