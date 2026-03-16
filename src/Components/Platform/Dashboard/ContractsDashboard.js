import React, { useState, useEffect, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import styles from "./ContractsDashboardStyle.js";
import platformServices from "../../../dbServices/platformServices.js";
import exportService from "../../../dbServices/exportService.js";
import { useAuth } from "../../../Context/AuthContext.js";
import ImageWithLoader from "../ImageWithLoader/ImageWithLoader.js";
import { useNavigate } from "react-router-dom";
import { useLoad } from "../../../Context/LoadContext.js";

// Hook para detectar tamanho da tela
const useResponsive = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return {
    isMobile: windowSize.width < 640,
    isTablet: windowSize.width >= 640 && windowSize.width < 1024,
    isDesktop: windowSize.width >= 1024,
    width: windowSize.width,
  };
};

const RoundedBar = (props) => {
  const { x, y, width, height, fill } = props;
  const radius = 4;
  if (!x || !y) return null;
  return (
    <path
      d={`M${x},${y + radius} A${radius},${radius} 0 0 1 ${x + radius},${y} L${
        x + width - radius
      },${y} A${radius},${radius} 0 0 1 ${x + width},${y + radius} L${
        x + width
      },${y + height} L${x},${y + height} Z`}
      fill={fill}
    />
  );
};

const formatCurrency = (value) => {
  return `R$${(value || 0).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const formatCurrencyShort = (value) => {
  if (!value) return "R$ 0";
  if (value >= 1000000) return `R$ ${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `R$ ${(value / 1000).toFixed(1)}k`;
  return `R$ ${value.toFixed(0)}`;
};

const monthNumberToName = (monthNumber) => {
  const date = new Date();
  date.setMonth(monthNumber - 1);
  return date.toLocaleString("pt-BR", { month: "short" });
};

const getStatusColor = (status) => {
  switch (status) {
    case 1:
      return { bg: "#fef3c7", color: "#92400e", label: "Pendente" };
    case 2:
      return { bg: "#d1fae5", color: "#065f46", label: "Pago" };
    case 3:
      return { bg: "#fee2e2", color: "#7f1d1d", label: "Cancelado" };
    default:
      return { bg: "#f3f4f6", color: "#374151", label: "Desconhecido" };
  }
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
};

function ContractsDashboard() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [salesFilter, setSalesFilter] = useState("all");
  const [openExportMenu, setOpenExportMenu] = useState(null); // "clients", "sales", "withdrawals"
  const [exportingType, setExportingType] = useState(null); // null, "clients", "sales", "withdrawals"
  const { token } = useAuth();
  const { startLoading, stopLoading } = useLoad();
  const navigate = useNavigate();
  const responsive = useResponsive();

  // Gera estilos responsivos
  const getResponsiveStyles = () => {
    return {
      dashboardContainer: {
        ...styles.dashboardContainer,
        padding: responsive.isMobile ? "70px 12px 12px 12px" : "80px 20px 20px 20px",
      },
      kpiGrid: {
        ...styles.kpiGrid,
        gridTemplateColumns: responsive.isMobile
          ? "1fr"
          : responsive.isTablet
          ? "repeat(2, 1fr)"
          : "repeat(auto-fit, minmax(220px, 1fr))",
        gap: responsive.isMobile ? "12px" : "16px",
      },
      mainGrid: {
        ...styles.mainGrid,
        gridTemplateColumns: responsive.isMobile ? "1fr" : "1fr 1fr",
        gap: responsive.isMobile ? "12px" : "16px",
      },
      bottomGrid: {
        ...styles.bottomGrid,
        gridTemplateColumns: responsive.isMobile ? "1fr" : "1fr 1fr",
        gap: responsive.isMobile ? "12px" : "16px",
      },
      headerH1: {
        ...styles.headerH1,
        fontSize: responsive.isMobile ? "1.4rem" : "1.75rem",
      },
      kpiCard: {
        ...styles.kpiCard,
        padding: responsive.isMobile ? "12px" : "18px",
      },
      kpiValue: {
        ...styles.kpiValue,
        fontSize: responsive.isMobile ? "1rem" : "1.4rem",
      },
      cardTitle: {
        ...styles.cardTitle,
        fontSize: responsive.isMobile ? "0.95rem" : "1.05rem",
        marginBottom: responsive.isMobile ? "12px" : "16px",
      },
      chartWrapper: {
        ...styles.chartWrapper,
        minHeight: responsive.isMobile ? "150px" : "200px",
        marginTop: responsive.isMobile ? "8px" : "12px",
      },
      salesTitle: {
        ...styles.salesTitle,
        fontSize: responsive.isMobile ? "0.95rem" : "1.05rem",
      },
      filterAndExportContainer: {
        display: "flex",
        gap: responsive.isMobile ? "6px" : "8px",
        alignItems: "center",
        flexWrap: responsive.isMobile ? "wrap" : "nowrap",
      },
    };
  };

  const responsiveStyles = getResponsiveStyles();

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;
      try {
        setIsLoading(true);
        startLoading();
        const dashboardData = await platformServices.getDashboardData();
        setData(dashboardData);
      } catch (error) {
        console.error("Erro dashboard:", error);
      } finally {
        setIsLoading(false);
        stopLoading();
      }
    };
    fetchData();
  }, [token]);

  const processedBestClients = useMemo(() => {
    if (!data || !Array.isArray(data.bestClients)) return [];
    return [...data.bestClients]
      .map((c) => ({
        ...c,
        displayAmount: c.amount ?? 0,
      }))
      .sort((a, b) => b.displayAmount - a.displayAmount)
      .slice(0, 4);
  }, [data]);

  const allRecentSales = data?.recentSales || [];
  const filteredRecentSales = useMemo(() => {
    if (salesFilter === "pending") {
      return allRecentSales.filter(sale => sale.status !== 2);
    }
    return allRecentSales;
  }, [allRecentSales, salesFilter]);

  const handleExport = async (type, format) => {
    setExportingType(type);
    try {
      if (type === "clients") {
        await exportService.exportBestClients(format);
      } else if (type === "sales") {
        await exportService.exportRecentSales(format);
      } else if (type === "withdrawals") {
        await exportService.exportRecentWithdrawals(format);
      }
      setOpenExportMenu(null);
    } catch (error) {
      console.error("Erro ao exportar:", error);
      alert("Erro ao exportar dados");
    } finally {
      setExportingType(null);
    }
  };

  const ExportMenu = ({ onExport, isOpen }) => {
    if (!isOpen) return null;
    return (
      <div style={styles.exportMenu}>
        <div
          style={styles.exportMenuItem}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#f8fafc")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#ffffff")}
          onClick={() => onExport("excel")}
        >
          📊 Excel (.xlsx)
        </div>
        <div
          style={{ ...styles.exportMenuItem, borderBottom: "none" }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#f8fafc")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#ffffff")}
          onClick={() => onExport("csv")}
        >
          📄 CSV (.csv)
        </div>
      </div>
    );
  };

  if (isLoading) return <div style={styles.loadingState}>Carregando...</div>;
  if (!data) return <div style={styles.loadingState}>Sem dados.</div>;

  const kpiData = [
    {
      title: "Faturamento Mensal",
      value: formatCurrencyShort(data.actualMonthlyIncome?.value),
    },
    {
      title: "Contratos Ativos",
      value: data.activeContracts || 0,
    },
    {
      title: "Ticket Médio",
      value: formatCurrencyShort(data.mediumTicket),
    },
    {
      title: "Saques no Mês",
      value: formatCurrencyShort(data.monthlyWithdraw),
    },
  ];

  const barChartData = data.lastMonthsIncomes
    ?.map((item) => ({
      month: monthNumberToName(item.month),
      Faturamento: item.value / 1000,
    }))
    .reverse();

  const topValue = processedBestClients[0]?.displayAmount || 1;
  const recentWithdraws = data.recentWithdraws || [];

  return (
    <div style={responsiveStyles.dashboardContainer}>
      {/* HEADER */}
      <header style={styles.dashboardHeader}>
        <h1 style={responsiveStyles.headerH1}>Dashboard</h1>
        <p style={styles.headerP}>Visão geral do desempenho</p>
      </header>

      {/* KPI CARDS */}
      <section style={responsiveStyles.kpiGrid}>
        {kpiData.map((kpi, index) => (
          <div key={index} style={{ ...styles.cardBase, ...responsiveStyles.kpiCard }}>
            <div style={styles.kpiBorder}></div>
            <div style={styles.kpiContent}>
              <span style={styles.kpiTitle}>{kpi.title}</span>
              <span style={responsiveStyles.kpiValue}>{kpi.value}</span>
            </div>
          </div>
        ))}
      </section>

      {/* MAIN CONTENT GRID */}
      <section style={responsiveStyles.mainGrid}>
        {/* GRÁFICO DE FATURAMENTO */}
        <div style={{ ...styles.cardBase, ...styles.chartCard }}>
          <h3 style={responsiveStyles.cardTitle}>Faturamento (6 meses)</h3>
          <div style={responsiveStyles.chartWrapper}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData} margin={{ top: 15, right: 15, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748b" }} />
                <YAxis tick={{ fontSize: 11, fill: "#64748b" }} />
                <Tooltip
                  cursor={{ fill: "rgba(59, 130, 246, 0.1)" }}
                  formatter={(value) => formatCurrency(value * 1000)}
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "6px",
                  }}
                />
                <Bar dataKey="Faturamento" shape={<RoundedBar />} fill="#3b82f6" barSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ÚLTIMOS SAQUES */}
        <div style={{ ...styles.cardBase, ...styles.withdrawalsCard }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: responsive.isMobile ? "12px" : "16px", paddingBottom: responsive.isMobile ? "8px" : "10px", borderBottom: "2px solid #f1f5f9" }}>
            <h3 style={responsiveStyles.cardTitle}>Últimos Saques</h3>
            <div style={styles.exportMenuContainer}>
              <button
                style={styles.exportButton}
                onClick={() => setOpenExportMenu(openExportMenu === "withdrawals" ? null : "withdrawals")}
                disabled={exportingType === "withdrawals"}
              >
                {exportingType === "withdrawals" ? "⏳ Baixando..." : "⬇️ Exportar"}
              </button>
              <ExportMenu
                isOpen={openExportMenu === "withdrawals"}
                onExport={(format) => handleExport("withdrawals", format)}
              />
            </div>
          </div>
          <ul style={styles.withdrawalsList}>
            {recentWithdraws.length > 0 ? (
              recentWithdraws.map((withdraw) => {
                const statusInfo = getStatusColor(withdraw.status);
                return (
                  <li key={withdraw.id} style={styles.withdrawalItem}>
                    <ImageWithLoader
                      src={
                        withdraw.clientProfilePicture ||
                        process.env.REACT_APP_DEFAULT_PROFILE_PICTURE
                      }
                      alt={withdraw.clientName}
                      style={styles.withdrawalAvatar}
                    />
                    <div style={styles.withdrawalInfo}>
                      <h4 style={styles.withdrawalName}>{withdraw.clientName}</h4>
                      <p style={styles.withdrawalDate}>{formatDate(withdraw.dateCreated)}</p>
                    </div>
                    <div style={styles.withdrawalAmount}>
                      {formatCurrency(withdraw.amount)}
                    </div>
                    <div
                      style={{
                        ...styles.statusBadge,
                        backgroundColor: statusInfo.bg,
                        color: statusInfo.color,
                      }}
                    >
                      {statusInfo.label}
                    </div>
                  </li>
                );
              })
            ) : (
              <div style={{ color: "#64748b", textAlign: "center", padding: "20px" }}>
                Nenhum saque recente
              </div>
            )}
          </ul>
        </div>
      </section>

      {/* BOTTOM GRID */}
      <section style={responsiveStyles.bottomGrid}>
        {/* MELHORES CLIENTES */}
        <div style={{ ...styles.cardBase, ...styles.clientsCard }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: responsive.isMobile ? "12px" : "16px", paddingBottom: responsive.isMobile ? "8px" : "10px", borderBottom: "2px solid #f1f5f9" }}>
            <h3 style={responsiveStyles.cardTitle}>Melhores Clientes</h3>
            <div style={styles.exportMenuContainer}>
              <button
                style={styles.exportButton}
                onClick={() => setOpenExportMenu(openExportMenu === "clients" ? null : "clients")}
                disabled={exportingType === "clients"}
              >
                {exportingType === "clients" ? "⏳ Baixando..." : "⬇️ Exportar"}
              </button>
              <ExportMenu
                isOpen={openExportMenu === "clients"}
                onExport={(format) => handleExport("clients", format)}
              />
            </div>
          </div>
          <ul style={styles.clientsList}>
            {processedBestClients.map((client, index) => (
              <li
                key={client.id}
                style={styles.clientItem}
                onClick={() => navigate(`/platform/clients/${client.id}`)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#f8fafc";
                  e.currentTarget.style.borderColor = "#cbd5e1";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#ffffff";
                  e.currentTarget.style.borderColor = "#f1f5f9";
                }}
              >
                <ImageWithLoader
                  src={
                    client.profilePictureUrl ||
                    process.env.REACT_APP_DEFAULT_PROFILE_PICTURE
                  }
                  alt={client.name}
                  style={styles.clientAvatar}
                />
                <div style={styles.clientInfo}>
                  <h4 style={styles.clientName}>{client.name}</h4>
                  <div style={styles.clientMeta}>
                    <span>{client.totalContracts} contrato{client.totalContracts !== 1 ? 's' : ''}</span>
                    <span style={{ fontSize: "0.7rem", color: "#cbd5e1" }}>•</span>
                    <span style={{ color: "#10b981", fontWeight: 600 }}>
                      {client.activeContracts} ativo{client.activeContracts !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div style={styles.progressBar}>
                    <div
                      style={{
                        ...styles.progress,
                        width: `${(client.displayAmount / topValue) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
                <span style={styles.clientAmount}>{formatCurrency(client.displayAmount)}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* VENDAS RECENTES */}
        <div style={{ ...styles.cardBase, ...styles.salesCard }}>
          <div style={{ ...styles.salesHeader, marginBottom: responsive.isMobile ? "12px" : "16px" }}>
            <h3 style={responsiveStyles.salesTitle}>Vendas Recentes</h3>
            <div style={responsiveStyles.filterAndExportContainer}>
              <div style={styles.filterTabs}>
              <button
                style={{
                  ...styles.filterTab,
                  ...(salesFilter === "all" && styles.filterTabActive),
                }}
                onClick={() => setSalesFilter("all")}
              >
                Todos
              </button>
              <button
                style={{
                  ...styles.filterTab,
                  ...(salesFilter === "pending" && styles.filterTabActive),
                }}
                onClick={() => setSalesFilter("pending")}
              >
                Pendentes
              </button>
              </div>
              <div style={styles.exportMenuContainer}>
                <button
                  style={styles.exportButton}
                  onClick={() => setOpenExportMenu(openExportMenu === "sales" ? null : "sales")}
                  disabled={exportingType === "sales"}
                >
                  {exportingType === "sales" ? "⏳ Baixando..." : "⬇️ Exportar"}
                </button>
                <ExportMenu
                  isOpen={openExportMenu === "sales"}
                  onExport={(format) => handleExport("sales", format)}
                />
              </div>
            </div>
          </div>
          <ul style={styles.salesList}>
            {filteredRecentSales.length > 0 ? (
              filteredRecentSales.map((sale) => (
                <li
                  key={sale.id}
                  style={styles.saleItem}
                  onClick={() => navigate(`/platform/clients/${sale.id}`)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#f8fafc";
                    e.currentTarget.style.borderColor = "#cbd5e1";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#ffffff";
                    e.currentTarget.style.borderColor = "#f1f5f9";
                  }}
                >
                  <ImageWithLoader
                    src={
                      sale.clientProfilePicture ||
                      process.env.REACT_APP_DEFAULT_PROFILE_PICTURE
                    }
                    alt={sale.clientName}
                    style={styles.saleAvatar}
                  />
                  <div style={styles.saleInfo}>
                    <h4 style={styles.saleName}>{sale.clientName}</h4>
                    <div style={styles.saleDetails}>
                      <span>
                        {sale.status === 2 ? "✓ Ativo" : "⏳ Pendente"}
                      </span>
                      <span style={{ fontSize: "0.7rem", color: "#cbd5e1" }}>
                        •
                      </span>
                      <span>{formatDate(sale.dateCreated)}</span>
                    </div>
                  </div>
                  <span style={styles.saleAmount}>{formatCurrency(sale.amount)}</span>
                  <span style={styles.saleGain}>+{sale.gainPercentage.toFixed(1)}%</span>
                </li>
              ))
            ) : (
              <div
                style={{
                  color: "#64748b",
                  textAlign: "center",
                  padding: "20px",
                  fontSize: "0.9rem",
                }}
              >
                Nenhuma venda recente
              </div>
            )}
          </ul>
        </div>
      </section>
    </div>
  );
}

export default ContractsDashboard;
