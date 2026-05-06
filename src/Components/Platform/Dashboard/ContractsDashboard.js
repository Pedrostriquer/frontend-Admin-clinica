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

const RecentEventsTable = ({
  title,
  icon,
  gradient,
  shadowColor,
  accentColor,
  accentBg,
  items,
  emptyText,
  renderRightCell,
  formatDate,
  navigate,
}) => (
  <div
    style={{
      background: "#ffffff",
      borderRadius: "10px",
      border: "1px solid #e2e8f0",
      boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.08)",
      padding: "22px 24px",
      display: "flex",
      flexDirection: "column",
    }}
  >
    {/* HEADER */}
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        marginBottom: "14px",
        paddingBottom: "14px",
        borderBottom: "1px solid #f1f5f9",
      }}
    >
      <div
        style={{
          width: "36px",
          height: "36px",
          borderRadius: "10px",
          background: gradient,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontSize: "14px",
          boxShadow: `0 4px 10px ${shadowColor}`,
        }}
      >
        <i className={`fa-solid ${icon}`}></i>
      </div>
      <h3
        style={{
          margin: 0,
          fontSize: "1rem",
          fontWeight: 800,
          color: "#0f172a",
          letterSpacing: "-0.3px",
        }}
      >
        {title}
      </h3>
      {items.length > 0 && (
        <span
          style={{
            fontSize: "11px",
            fontWeight: 600,
            color: "#64748b",
            background: "#f1f5f9",
            padding: "3px 8px",
            borderRadius: "6px",
          }}
        >
          {items.length}
        </span>
      )}
    </div>

    {/* TABELA */}
    {items.length > 0 ? (
      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "12px",
          }}
        >
          <thead>
            <tr style={{ background: "#f8fafc" }}>
              <th
                style={{
                  textAlign: "left",
                  padding: "8px 10px",
                  color: "#64748b",
                  fontWeight: 700,
                  fontSize: "10px",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  borderBottom: "1px solid #e2e8f0",
                }}
              >
                Cliente
              </th>
              <th
                style={{
                  textAlign: "left",
                  padding: "8px 10px",
                  color: "#64748b",
                  fontWeight: 700,
                  fontSize: "10px",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  borderBottom: "1px solid #e2e8f0",
                }}
              >
                Contrato
              </th>
              <th
                style={{
                  textAlign: "left",
                  padding: "8px 10px",
                  color: "#64748b",
                  fontWeight: 700,
                  fontSize: "10px",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  borderBottom: "1px solid #e2e8f0",
                }}
              >
                Data
              </th>
              <th
                style={{
                  textAlign: "right",
                  padding: "8px 10px",
                  color: "#64748b",
                  fontWeight: 700,
                  fontSize: "10px",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  borderBottom: "1px solid #e2e8f0",
                }}
              >
                Valor
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr
                key={item.id}
                onClick={() =>
                  item.contractId &&
                  navigate(`/platform/contracts/${item.contractId}`)
                }
                style={{
                  borderBottom: "1px solid #f1f5f9",
                  cursor: item.contractId ? "pointer" : "default",
                  transition: "background 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  if (item.contractId)
                    e.currentTarget.style.background = "#fafbfc";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                <td style={{ padding: "10px" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <ImageWithLoader
                      src={
                        item.clientProfilePicture ||
                        process.env.REACT_APP_DEFAULT_PROFILE_PICTURE
                      }
                      alt={item.clientName}
                      style={{
                        width: "28px",
                        height: "28px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        border: "2px solid #fff",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        fontSize: "12px",
                        fontWeight: 600,
                        color: "#1e293b",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: "140px",
                      }}
                    >
                      {item.clientName}
                    </span>
                  </div>
                </td>
                <td style={{ padding: "10px" }}>
                  {item.contractId && (
                    <span
                      style={{
                        fontSize: "10px",
                        fontWeight: 700,
                        color: accentColor,
                        background: accentBg,
                        padding: "3px 7px",
                        borderRadius: "5px",
                        letterSpacing: "0.3px",
                      }}
                    >
                      #{item.contractId}
                    </span>
                  )}
                </td>
                <td style={{ padding: "10px", color: "#64748b" }}>
                  {formatDate(item.dateCreated)}
                </td>
                <td style={{ padding: "10px", textAlign: "right" }}>
                  {renderRightCell(item)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ) : (
      <div
        style={{
          textAlign: "center",
          padding: "32px 16px",
          color: "#94a3b8",
          background: "#fafbfc",
          border: "1px dashed #e2e8f0",
          borderRadius: "10px",
        }}
      >
        <div
          style={{ fontSize: "28px", marginBottom: "8px", opacity: 0.5 }}
        >
          <i className="fa-solid fa-inbox"></i>
        </div>
        <div style={{ fontSize: "13px", fontWeight: 600 }}>{emptyText}</div>
      </div>
    )}
  </div>
);

function ContractsDashboard() {
  const [data, setData] = useState(null);
  const [revenuePeriod, setRevenuePeriod] = useState("6m");
  const [revenueHistory, setRevenueHistory] = useState(null);
  const [revenueLoading, setRevenueLoading] = useState(false);
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [customApplied, setCustomApplied] = useState(false);
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
        const dashboardData = await platformServices.getDashboardData();
        setData(dashboardData);
      } catch (error) {
        console.error("Erro dashboard:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [token]);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!token) return;
      if (revenuePeriod === "custom" && (!customStart || !customEnd)) return;
      try {
        setRevenueLoading(true);
        const params =
          revenuePeriod === "custom"
            ? { period: "custom", startDate: customStart, endDate: customEnd }
            : { period: revenuePeriod };
        const history = await platformServices.getRevenueHistory(params);
        setRevenueHistory(history);
      } catch (error) {
        console.error("Erro ao buscar histórico:", error);
      } finally {
        setRevenueLoading(false);
      }
    };
    fetchHistory();
  }, [token, revenuePeriod, customApplied, customStart, customEnd]);

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

  const monthlyIncome = data.actualMonthlyIncome || {};
  const salesCount = monthlyIncome.salesCount || 0;
  const extrasCount = monthlyIncome.extrasCount || 0;
  const contractsRevenue = monthlyIncome.contractsRevenue || 0;
  const extrasRevenue = monthlyIncome.extrasRevenue || 0;

  const activeContractsReal = data.activeContracts || 0;
  const activeContractsTotal = data.activeContractsTotal || 0;
  const activeContractsAmount = data.activeContractsAmount || 0;
  const activeContractsAmountTotal = data.activeContractsAmountTotal || 0;

  const monthlyWithdrawPending = data.monthlyWithdrawPending || 0;
  const monthlyWithdrawPaid = data.monthlyWithdrawPaid || 0;
  const monthlyWithdrawCancelled = data.monthlyWithdrawCancelled || 0;
  const monthlyWithdrawTotal =
    monthlyWithdrawPending + monthlyWithdrawPaid + monthlyWithdrawCancelled;

  const historySource = revenueHistory || data.lastMonthsIncomes || [];
  const barChartData = revenueHistory
    ? historySource.map((item) => ({
        month: `${monthNumberToName(item.month)}${
          item.year ? "/" + String(item.year).slice(-2) : ""
        }`,
        Vendas: (item.contractsRevenue || 0) / 1000,
        "Aportes Extras": (item.extrasRevenue || 0) / 1000,
        Faturamento: item.value / 1000,
        contractsRevenue: item.contractsRevenue || 0,
        extrasRevenue: item.extrasRevenue || 0,
        salesCount: item.salesCount || 0,
        extrasCount: item.extrasCount || 0,
      }))
    : historySource
        .map((item) => ({
          month: monthNumberToName(item.month),
          Vendas: (item.contractsRevenue || 0) / 1000,
          "Aportes Extras": (item.extrasRevenue || 0) / 1000,
          Faturamento: item.value / 1000,
          contractsRevenue: item.contractsRevenue || 0,
          extrasRevenue: item.extrasRevenue || 0,
          salesCount: item.salesCount || 0,
          extrasCount: item.extrasCount || 0,
        }))
        .reverse();

  const totalSemestreFaturamento =
    barChartData?.reduce((acc, m) => acc + (m.Faturamento || 0) * 1000, 0) || 0;
  const mediaSemestreFaturamento =
    barChartData?.length > 0
      ? totalSemestreFaturamento / barChartData.length
      : 0;
  const ultimoMes = barChartData?.[barChartData.length - 1];
  const penultimoMes = barChartData?.[barChartData.length - 2];
  const variacaoMes =
    ultimoMes && penultimoMes && penultimoMes.Faturamento > 0
      ? ((ultimoMes.Faturamento - penultimoMes.Faturamento) /
          penultimoMes.Faturamento) *
        100
      : null;

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;
    const d = payload[0].payload;
    return (
      <div
        style={{
          backgroundColor: "#ffffff",
          border: "1px solid #e2e8f0",
          borderRadius: "8px",
          padding: "12px 14px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          minWidth: "200px",
        }}
      >
        <div
          style={{
            fontSize: "12px",
            fontWeight: 700,
            color: "#1e293b",
            marginBottom: "8px",
            paddingBottom: "6px",
            borderBottom: "1px solid #f1f5f9",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontSize: "16px",
            fontWeight: 700,
            color: "#3b82f6",
            marginBottom: "10px",
          }}
        >
          {formatCurrency(d.Faturamento * 1000)}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "12px",
            color: "#475569",
            marginBottom: "4px",
          }}
        >
          <span>
            <i
              className="fa-solid fa-handshake"
              style={{ marginRight: "5px", color: "#22c55e" }}
            ></i>
            Vendas ({d.salesCount})
          </span>
          <strong>{formatCurrency(d.contractsRevenue)}</strong>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "12px",
            color: "#475569",
          }}
        >
          <span>
            <i
              className="fa-solid fa-money-bill-trend-up"
              style={{ marginRight: "5px", color: "#8b5cf6" }}
            ></i>
            Aportes Extras ({d.extrasCount})
          </span>
          <strong>{formatCurrency(d.extrasRevenue)}</strong>
        </div>
      </div>
    );
  };

  const topValue = processedBestClients[0]?.displayAmount || 1;
  const recentWithdraws = data.recentWithdraws || [];

  return (
    <div style={responsiveStyles.dashboardContainer}>
      {/* HEADER */}
      <header
        style={{
          ...styles.dashboardHeader,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div style={{ flex: "1 1 320px", minWidth: 0 }}>
          <h1 style={responsiveStyles.headerH1}>Dashboard</h1>
          <p style={styles.headerP}>Visão geral do desempenho</p>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              marginTop: "8px",
              padding: "5px 10px",
              borderRadius: "6px",
              background: "#fef3c7",
              border: "1px solid #fde68a",
              color: "#92400e",
              fontSize: "11px",
              fontWeight: 600,
            }}
          >
            <i className="fa-solid fa-circle-info"></i>
            Os dados podem demorar até 30 segundos para refletir alterações
            recentes devido ao cache.
          </div>
        </div>

        {/* CARD CLIENTES — compacto no header */}
        <div
          style={{
            background: "#fff",
            borderRadius: "12px",
            padding: "12px 16px",
            border: "1px solid #e2e8f0",
            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.04)",
            display: "flex",
            alignItems: "center",
            gap: "16px",
            flexWrap: "wrap",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -30,
              right: -30,
              width: "100px",
              height: "100px",
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)",
            }}
          ></div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              position: "relative",
              zIndex: 1,
              paddingRight: "12px",
              borderRight: "1px solid #f1f5f9",
            }}
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background:
                  "linear-gradient(135deg, #6366f1 0%, #4338ca 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: "14px",
                boxShadow: "0 4px 10px rgba(99,102,241,0.25)",
              }}
            >
              <i className="fa-solid fa-users"></i>
            </div>
            <div>
              <div
                style={{
                  fontSize: "9px",
                  fontWeight: 700,
                  color: "#64748b",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  marginBottom: "2px",
                }}
              >
                Clientes
              </div>
              <div
                style={{
                  fontSize: "1.3rem",
                  fontWeight: 800,
                  color: "#0f172a",
                  letterSpacing: "-0.4px",
                  lineHeight: 1,
                }}
              >
                {(data.totalClients || 0).toLocaleString("pt-BR")}
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              position: "relative",
              zIndex: 1,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <i
                className="fa-solid fa-user-plus"
                style={{ color: "#15803d", fontSize: "11px" }}
              ></i>
              <div>
                <div
                  style={{
                    fontSize: "9px",
                    fontWeight: 700,
                    color: "#64748b",
                    textTransform: "uppercase",
                    letterSpacing: "0.4px",
                  }}
                >
                  7 dias
                </div>
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: 800,
                    color: "#15803d",
                    lineHeight: 1.1,
                  }}
                >
                  +{(data.newClients7Days || 0).toLocaleString("pt-BR")}
                </div>
              </div>
            </div>
            <div
              style={{
                width: "1px",
                height: "28px",
                background: "#f1f5f9",
              }}
            ></div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <i
                className="fa-solid fa-calendar-plus"
                style={{ color: "#1e40af", fontSize: "11px" }}
              ></i>
              <div>
                <div
                  style={{
                    fontSize: "9px",
                    fontWeight: 700,
                    color: "#64748b",
                    textTransform: "uppercase",
                    letterSpacing: "0.4px",
                  }}
                >
                  Mês
                </div>
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: 800,
                    color: "#1e40af",
                    lineHeight: 1.1,
                  }}
                >
                  +{(data.newClientsMonth || 0).toLocaleString("pt-BR")}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* KPI CARDS */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: responsive.isMobile
            ? "1fr"
            : "1.3fr 1.2fr 1.2fr",
          gap: "16px",
        }}
      >
        {/* CARD PRINCIPAL: FATURAMENTO MENSAL */}
        <div
          style={{
            background:
              "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)",
            borderRadius: "12px",
            padding: "22px 24px",
            color: "#fff",
            boxShadow: "0 6px 20px rgba(59, 130, 246, 0.25)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -30,
              right: -30,
              width: "140px",
              height: "140px",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.08)",
            }}
          ></div>
          <div style={{ position: "relative", zIndex: 1 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "12px",
                fontWeight: 600,
                opacity: 0.85,
                textTransform: "uppercase",
                letterSpacing: "0.8px",
                marginBottom: "8px",
              }}
            >
              <i className="fa-solid fa-sack-dollar"></i>
              Faturamento Mensal
            </div>
            <div
              style={{
                fontSize: "2rem",
                fontWeight: 800,
                letterSpacing: "-0.5px",
                marginBottom: "4px",
              }}
            >
              {formatCurrencyShort(monthlyIncome.value)}
            </div>
            <div style={{ fontSize: "12px", opacity: 0.75 }}>
              {new Date()
                .toLocaleDateString("pt-BR", { month: "long", year: "numeric" })
                .replace(/^./, (c) => c.toUpperCase())}
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px",
              marginTop: "18px",
              position: "relative",
              zIndex: 1,
            }}
          >
            <div
              style={{
                background: "rgba(255,255,255,0.12)",
                borderRadius: "8px",
                padding: "10px 12px",
                backdropFilter: "blur(4px)",
              }}
            >
              <div
                style={{
                  fontSize: "10px",
                  fontWeight: 600,
                  opacity: 0.85,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  marginBottom: "4px",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                }}
              >
                <i className="fa-solid fa-handshake"></i> Vendas
              </div>
              <div
                style={{
                  fontSize: "15px",
                  fontWeight: 700,
                  marginBottom: "2px",
                }}
              >
                {formatCurrency(contractsRevenue)}
              </div>
              <div style={{ fontSize: "11px", opacity: 0.8 }}>
                {salesCount} {salesCount === 1 ? "contrato" : "contratos"}
              </div>
            </div>
            <div
              style={{
                background: "rgba(255,255,255,0.12)",
                borderRadius: "8px",
                padding: "10px 12px",
                backdropFilter: "blur(4px)",
              }}
            >
              <div
                style={{
                  fontSize: "10px",
                  fontWeight: 600,
                  opacity: 0.85,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  marginBottom: "4px",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                }}
              >
                <i className="fa-solid fa-money-bill-trend-up"></i> Aportes
                Extras
              </div>
              <div
                style={{
                  fontSize: "15px",
                  fontWeight: 700,
                  marginBottom: "2px",
                }}
              >
                {formatCurrency(extrasRevenue)}
              </div>
              <div style={{ fontSize: "11px", opacity: 0.8 }}>
                {extrasCount} {extrasCount === 1 ? "aporte" : "aportes"}
              </div>
            </div>
          </div>
        </div>

        {/* CARD CONTRATOS ATIVOS + TICKET MÉDIO */}
        <div
          style={{
            background: "#fff",
            borderRadius: "12px",
            padding: "22px 24px",
            border: "1px solid #e2e8f0",
            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.04)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            gap: "18px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -40,
              right: -40,
              width: "150px",
              height: "150px",
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)",
            }}
          ></div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              position: "relative",
              zIndex: 1,
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                background:
                  "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: "16px",
                boxShadow: "0 4px 10px rgba(59,130,246,0.3)",
              }}
            >
              <i className="fa-solid fa-file-contract"></i>
            </div>
            <div
              style={{
                fontSize: "12px",
                fontWeight: 700,
                color: "#0f172a",
                textTransform: "uppercase",
                letterSpacing: "0.7px",
              }}
            >
              Contratos Ativos
            </div>
          </div>

          <div style={{ position: "relative", zIndex: 1 }}>
            <div
              style={{
                fontSize: "2.6rem",
                fontWeight: 800,
                color: "#0f172a",
                lineHeight: 1,
                letterSpacing: "-1px",
                marginBottom: "6px",
              }}
            >
              {activeContractsReal}
              <span
                style={{
                  fontSize: "0.85rem",
                  fontWeight: 500,
                  color: "#64748b",
                  marginLeft: "8px",
                }}
              >
                {activeContractsReal === 1 ? "contrato" : "contratos"}
              </span>
            </div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                background: "#f0fdf4",
                border: "1px solid #bbf7d0",
                borderRadius: "8px",
                padding: "5px 10px",
                fontSize: "0.85rem",
                fontWeight: 700,
                color: "#15803d",
              }}
            >
              <i className="fa-solid fa-coins"></i>
              {formatCurrencyShort(activeContractsAmount)}
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: 500,
                  opacity: 0.75,
                }}
              >
                em capital
              </span>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingTop: "14px",
              borderTop: "1px dashed #e2e8f0",
              position: "relative",
              zIndex: 1,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "8px",
                  background: "#0ea5e915",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#0ea5e9",
                  fontSize: "13px",
                }}
              >
                <i className="fa-solid fa-chart-pie"></i>
              </div>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "#64748b",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Ticket Médio
              </span>
            </div>
            <span
              style={{
                fontSize: "1.1rem",
                fontWeight: 800,
                color: "#0f172a",
                letterSpacing: "-0.3px",
              }}
            >
              {formatCurrencyShort(data.mediumTicket)}
            </span>
          </div>
        </div>

        {/* CARD SAQUES NO MÊS — total + breakdown por status */}
        <div
          style={{
            background: "#fff",
            borderRadius: "12px",
            padding: "22px 24px",
            border: "1px solid #e2e8f0",
            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.04)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            gap: "16px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -40,
              right: -40,
              width: "150px",
              height: "150px",
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)",
            }}
          ></div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "10px",
              position: "relative",
              zIndex: 1,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  background:
                    "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontSize: "16px",
                  boxShadow: "0 4px 10px rgba(245,158,11,0.3)",
                }}
              >
                <i className="fa-solid fa-arrow-trend-down"></i>
              </div>
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  color: "#0f172a",
                  textTransform: "uppercase",
                  letterSpacing: "0.7px",
                }}
              >
                Saques no Mês
              </div>
            </div>
            <span
              style={{
                fontSize: "1.3rem",
                fontWeight: 800,
                color: "#0f172a",
                letterSpacing: "-0.5px",
              }}
            >
              {formatCurrencyShort(monthlyWithdrawTotal)}
            </span>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              position: "relative",
              zIndex: 1,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "#f0fdf4",
                border: "1px solid #bbf7d0",
                borderRadius: "8px",
                padding: "8px 12px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#15803d",
                }}
              >
                <i className="fa-solid fa-circle-check"></i>
                Pagos
              </div>
              <span
                style={{
                  fontSize: "13px",
                  fontWeight: 800,
                  color: "#15803d",
                }}
              >
                {formatCurrencyShort(monthlyWithdrawPaid)}
              </span>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "#fef3c7",
                border: "1px solid #fde68a",
                borderRadius: "8px",
                padding: "8px 12px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#92400e",
                }}
              >
                <i className="fa-solid fa-clock"></i>
                Pendentes
              </div>
              <span
                style={{
                  fontSize: "13px",
                  fontWeight: 800,
                  color: "#92400e",
                }}
              >
                {formatCurrencyShort(monthlyWithdrawPending)}
              </span>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "#fee2e2",
                border: "1px solid #fecaca",
                borderRadius: "8px",
                padding: "8px 12px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#991b1b",
                }}
              >
                <i className="fa-solid fa-circle-xmark"></i>
                Cancelados
              </div>
              <span
                style={{
                  fontSize: "13px",
                  fontWeight: 800,
                  color: "#991b1b",
                }}
              >
                {formatCurrencyShort(monthlyWithdrawCancelled)}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT GRID */}
      <section style={responsiveStyles.mainGrid}>
        {/* GRÁFICO DE FATURAMENTO — redesenhado */}
        <div
          style={{
            ...styles.cardBase,
            ...styles.chartCard,
            padding: "22px 24px",
            background: "#ffffff",
          }}
        >
          {/* HEADER DO CARD */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: "20px",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "4px",
                }}
              >
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "10px",
                    background:
                      "linear-gradient(135deg, #3b82f6 0%, #1e3a8a 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontSize: "14px",
                    boxShadow: "0 4px 10px rgba(59,130,246,0.25)",
                  }}
                >
                  <i className="fa-solid fa-chart-column"></i>
                </div>
                <h3
                  style={{
                    margin: 0,
                    fontSize: "1rem",
                    fontWeight: 800,
                    color: "#0f172a",
                    letterSpacing: "-0.3px",
                  }}
                >
                  Faturamento
                </h3>
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 600,
                    color: "#64748b",
                    background: "#f1f5f9",
                    padding: "3px 8px",
                    borderRadius: "6px",
                  }}
                >
                  {revenuePeriod === "6m"
                    ? "6 meses"
                    : revenuePeriod === "1y"
                    ? "1 ano"
                    : revenuePeriod === "all"
                    ? "Todo período"
                    : "Personalizado"}
                </span>
              </div>
              <p
                style={{
                  margin: "4px 0 0 46px",
                  fontSize: "12px",
                  color: "#64748b",
                }}
              >
                Vendas + Aportes Extras por mês
              </p>
            </div>

            <div
              style={{
                display: "flex",
                gap: "16px",
                alignItems: "flex-start",
              }}
            >
              <div style={{ textAlign: "right" }}>
                <div
                  style={{
                    fontSize: "10px",
                    fontWeight: 600,
                    color: "#64748b",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    marginBottom: "2px",
                  }}
                >
                  Total no período
                </div>
                <div
                  style={{
                    fontSize: "1.05rem",
                    fontWeight: 800,
                    color: "#0f172a",
                  }}
                >
                  {formatCurrencyShort(totalSemestreFaturamento)}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div
                  style={{
                    fontSize: "10px",
                    fontWeight: 600,
                    color: "#64748b",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    marginBottom: "2px",
                  }}
                >
                  Média mensal
                </div>
                <div
                  style={{
                    fontSize: "1.05rem",
                    fontWeight: 800,
                    color: "#0f172a",
                  }}
                >
                  {formatCurrencyShort(mediaSemestreFaturamento)}
                </div>
              </div>
              {variacaoMes !== null && (
                <div style={{ textAlign: "right" }}>
                  <div
                    style={{
                      fontSize: "10px",
                      fontWeight: 600,
                      color: "#64748b",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      marginBottom: "2px",
                    }}
                  >
                    vs mês anterior
                  </div>
                  <div
                    style={{
                      fontSize: "1.05rem",
                      fontWeight: 800,
                      color: variacaoMes >= 0 ? "#15803d" : "#b91c1c",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      justifyContent: "flex-end",
                    }}
                  >
                    <i
                      className={`fa-solid ${
                        variacaoMes >= 0
                          ? "fa-arrow-trend-up"
                          : "fa-arrow-trend-down"
                      }`}
                    ></i>
                    {variacaoMes >= 0 ? "+" : ""}
                    {variacaoMes.toFixed(1)}%
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* SELETOR DE PERÍODO */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "8px",
              marginBottom: "12px",
            }}
          >
            {[
              { value: "6m", label: "6 meses" },
              { value: "1y", label: "1 ano" },
              { value: "all", label: "Todo período" },
              { value: "custom", label: "Personalizado" },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => setRevenuePeriod(opt.value)}
                style={{
                  padding: "6px 12px",
                  borderRadius: "8px",
                  fontSize: "12px",
                  fontWeight: 600,
                  cursor: "pointer",
                  border:
                    revenuePeriod === opt.value
                      ? "1px solid #3b82f6"
                      : "1px solid #e2e8f0",
                  background:
                    revenuePeriod === opt.value ? "#3b82f6" : "#ffffff",
                  color: revenuePeriod === opt.value ? "#ffffff" : "#475569",
                  transition: "all 0.15s ease",
                }}
              >
                {opt.label}
              </button>
            ))}

            {revenuePeriod === "custom" && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  marginLeft: "8px",
                }}
              >
                <input
                  type="date"
                  value={customStart}
                  onChange={(e) => setCustomStart(e.target.value)}
                  style={{
                    padding: "5px 8px",
                    borderRadius: "6px",
                    border: "1px solid #e2e8f0",
                    fontSize: "12px",
                    color: "#475569",
                  }}
                />
                <span style={{ fontSize: "12px", color: "#94a3b8" }}>até</span>
                <input
                  type="date"
                  value={customEnd}
                  onChange={(e) => setCustomEnd(e.target.value)}
                  style={{
                    padding: "5px 8px",
                    borderRadius: "6px",
                    border: "1px solid #e2e8f0",
                    fontSize: "12px",
                    color: "#475569",
                  }}
                />
                <button
                  onClick={() => setCustomApplied((v) => !v)}
                  disabled={!customStart || !customEnd}
                  style={{
                    padding: "5px 12px",
                    borderRadius: "6px",
                    border: "1px solid #3b82f6",
                    background:
                      !customStart || !customEnd ? "#cbd5e1" : "#3b82f6",
                    color: "#ffffff",
                    fontSize: "12px",
                    fontWeight: 600,
                    cursor:
                      !customStart || !customEnd ? "default" : "pointer",
                  }}
                >
                  Aplicar
                </button>
              </div>
            )}

            {revenueLoading && (
              <span
                style={{
                  fontSize: "11px",
                  color: "#94a3b8",
                  marginLeft: "8px",
                }}
              >
                <i className="fa-solid fa-spinner fa-spin"></i> Carregando...
              </span>
            )}
          </div>

          {/* LEGENDA */}
          <div
            style={{
              display: "flex",
              gap: "16px",
              marginBottom: "12px",
              fontSize: "12px",
            }}
          >
            <div
              style={{ display: "flex", alignItems: "center", gap: "6px" }}
            >
              <span
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "3px",
                  background:
                    "linear-gradient(180deg, #3b82f6 0%, #1d4ed8 100%)",
                }}
              ></span>
              <span style={{ color: "#475569", fontWeight: 600 }}>Vendas</span>
            </div>
            <div
              style={{ display: "flex", alignItems: "center", gap: "6px" }}
            >
              <span
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "3px",
                  background:
                    "linear-gradient(180deg, #a78bfa 0%, #7c3aed 100%)",
                }}
              ></span>
              <span style={{ color: "#475569", fontWeight: 600 }}>
                Aportes Extras
              </span>
            </div>
          </div>

          {/* GRÁFICO */}
          <div style={responsiveStyles.chartWrapper}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={barChartData}
                margin={{ top: 15, right: 15, left: -10, bottom: 0 }}
                barCategoryGap="25%"
              >
                <defs>
                  <linearGradient
                    id="gradVendas"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#60a5fa" />
                    <stop offset="100%" stopColor="#1d4ed8" />
                  </linearGradient>
                  <linearGradient
                    id="gradExtras"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#a78bfa" />
                    <stop offset="100%" stopColor="#7c3aed" />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="2 4"
                  vertical={false}
                  stroke="#e2e8f0"
                />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11, fill: "#64748b", fontWeight: 600 }}
                  tickLine={false}
                  axisLine={{ stroke: "#e2e8f0" }}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `${v}k`}
                />
                <Tooltip
                  cursor={{ fill: "rgba(59, 130, 246, 0.06)" }}
                  content={<CustomTooltip />}
                />
                <Bar
                  dataKey="Vendas"
                  stackId="a"
                  fill="url(#gradVendas)"
                  barSize={32}
                  radius={[0, 0, 0, 0]}
                />
                <Bar
                  dataKey="Aportes Extras"
                  stackId="a"
                  fill="url(#gradExtras)"
                  barSize={32}
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ÚLTIMOS SAQUES — redesenhado */}
        <div
          style={{
            ...styles.cardBase,
            ...styles.withdrawalsCard,
            padding: "22px 24px",
            background: "#ffffff",
          }}
        >
          {/* HEADER */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "18px",
              paddingBottom: "14px",
              borderBottom: "1px solid #f1f5f9",
              flexWrap: "wrap",
              gap: "10px",
            }}
          >
            <div
              style={{ display: "flex", alignItems: "center", gap: "10px" }}
            >
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  background:
                    "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontSize: "14px",
                  boxShadow: "0 4px 10px rgba(245,158,11,0.25)",
                }}
              >
                <i className="fa-solid fa-receipt"></i>
              </div>
              <h3
                style={{
                  margin: 0,
                  fontSize: "1rem",
                  fontWeight: 800,
                  color: "#0f172a",
                  letterSpacing: "-0.3px",
                }}
              >
                Últimos Saques
              </h3>
              {recentWithdraws.length > 0 && (
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 600,
                    color: "#64748b",
                    background: "#f1f5f9",
                    padding: "3px 8px",
                    borderRadius: "6px",
                  }}
                >
                  {recentWithdraws.length}
                </span>
              )}
            </div>
            <div style={styles.exportMenuContainer}>
              <button
                style={styles.exportButton}
                onClick={() =>
                  setOpenExportMenu(
                    openExportMenu === "withdrawals" ? null : "withdrawals"
                  )
                }
                disabled={exportingType === "withdrawals"}
              >
                {exportingType === "withdrawals" ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin"></i> Baixando...
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-download"></i> Exportar
                  </>
                )}
              </button>
              <ExportMenu
                isOpen={openExportMenu === "withdrawals"}
                onExport={(format) => handleExport("withdrawals", format)}
              />
            </div>
          </div>

          {/* LISTA */}
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            {recentWithdraws.length > 0 ? (
              recentWithdraws.map((withdraw) => {
                const statusInfo = getStatusColor(withdraw.status);
                return (
                  <li
                    key={withdraw.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "12px 14px",
                      borderRadius: "10px",
                      background: "#fafbfc",
                      border: "1px solid #f1f5f9",
                      transition: "all 0.2s ease",
                      cursor: "default",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#ffffff";
                      e.currentTarget.style.borderColor = "#e2e8f0";
                      e.currentTarget.style.boxShadow =
                        "0 2px 8px rgba(0,0,0,0.04)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "#fafbfc";
                      e.currentTarget.style.borderColor = "#f1f5f9";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <ImageWithLoader
                      src={
                        withdraw.clientProfilePicture ||
                        process.env.REACT_APP_DEFAULT_PROFILE_PICTURE
                      }
                      alt={withdraw.clientName}
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        border: "2px solid #fff",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                        flexShrink: 0,
                      }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h4
                        style={{
                          margin: 0,
                          fontSize: "13px",
                          fontWeight: 700,
                          color: "#0f172a",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {withdraw.clientName}
                      </h4>
                      <p
                        style={{
                          margin: "2px 0 0 0",
                          fontSize: "11px",
                          color: "#94a3b8",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <i
                          className="fa-regular fa-clock"
                          style={{ fontSize: "10px" }}
                        ></i>
                        {formatDate(withdraw.dateCreated)}
                      </p>
                    </div>
                    <div
                      style={{
                        textAlign: "right",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-end",
                        gap: "4px",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "14px",
                          fontWeight: 800,
                          color: "#0f172a",
                          letterSpacing: "-0.2px",
                        }}
                      >
                        {formatCurrency(withdraw.amount)}
                      </div>
                      <div
                        style={{
                          fontSize: "10px",
                          fontWeight: 700,
                          padding: "2px 8px",
                          borderRadius: "6px",
                          backgroundColor: statusInfo.bg,
                          color: statusInfo.color,
                          textTransform: "uppercase",
                          letterSpacing: "0.4px",
                        }}
                      >
                        {statusInfo.label}
                      </div>
                    </div>
                  </li>
                );
              })
            ) : (
              <div
                style={{
                  textAlign: "center",
                  padding: "32px 16px",
                  color: "#94a3b8",
                  background: "#fafbfc",
                  border: "1px dashed #e2e8f0",
                  borderRadius: "10px",
                }}
              >
                <div
                  style={{
                    fontSize: "28px",
                    marginBottom: "8px",
                    opacity: 0.5,
                  }}
                >
                  <i className="fa-solid fa-inbox"></i>
                </div>
                <div style={{ fontSize: "13px", fontWeight: 600 }}>
                  Nenhum saque recente
                </div>
              </div>
            )}
          </ul>
        </div>
      </section>

      {/* ÚLTIMOS APORTES EXTRAS + ÚLTIMOS REINVESTIMENTOS — lado a lado */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: responsive.isMobile ? "1fr" : "1fr 1fr",
          gap: "16px",
        }}
      >
        {/* APORTES EXTRAS */}
        <RecentEventsTable
          title="Últimos Aportes Extras"
          icon="fa-money-bill-trend-up"
          gradient="linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)"
          shadowColor="rgba(139,92,246,0.25)"
          accentColor="#7c3aed"
          accentBg="#f3e8ff"
          items={(data.recentExtras || []).slice(0, 5)}
          emptyText="Nenhum aporte extra recente"
          formatCurrency={formatCurrency}
          formatDate={formatDate}
          navigate={navigate}
          renderRightCell={(item) => (
            <span
              style={{
                fontSize: "13px",
                fontWeight: 800,
                color: "#7c3aed",
                letterSpacing: "-0.2px",
              }}
            >
              {formatCurrency(item.amount)}
            </span>
          )}
        />

        {/* REINVESTIMENTOS */}
        <RecentEventsTable
          title="Últimos Reinvestimentos"
          icon="fa-recycle"
          gradient="linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
          shadowColor="rgba(245,158,11,0.25)"
          accentColor="#d97706"
          accentBg="#fef3c7"
          items={(data.recentReinvestments || []).slice(0, 5)}
          emptyText="Nenhum reinvestimento recente"
          formatCurrency={formatCurrency}
          formatDate={formatDate}
          navigate={navigate}
          renderRightCell={(item) => {
            const isAuto = item.type === 1 || item.type === "Automatic";
            return (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  gap: "3px",
                }}
              >
                <span
                  style={{
                    fontSize: "13px",
                    fontWeight: 800,
                    color: "#d97706",
                    letterSpacing: "-0.2px",
                  }}
                >
                  {formatCurrency(item.amount)}
                </span>
                <span
                  style={{
                    fontSize: "9px",
                    fontWeight: 700,
                    padding: "2px 6px",
                    borderRadius: "4px",
                    backgroundColor: isAuto ? "#fef3c7" : "#dbeafe",
                    color: isAuto ? "#b45309" : "#1e40af",
                    textTransform: "uppercase",
                    letterSpacing: "0.3px",
                  }}
                >
                  {isAuto ? "Auto" : "Manual"}
                </span>
              </div>
            );
          }}
        />
      </section>

      {/* BOTTOM GRID */}
      <section style={responsiveStyles.bottomGrid}>
        {/* MELHORES CLIENTES */}
        <div
          style={{
            ...styles.cardBase,
            padding: "22px 24px",
            background: "#ffffff",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "18px",
              paddingBottom: "14px",
              borderBottom: "1px solid #f1f5f9",
              flexWrap: "wrap",
              gap: "10px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  background:
                    "linear-gradient(135deg, #10b981 0%, #047857 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontSize: "14px",
                  boxShadow: "0 4px 10px rgba(16,185,129,0.25)",
                }}
              >
                <i className="fa-solid fa-trophy"></i>
              </div>
              <h3
                style={{
                  margin: 0,
                  fontSize: "1rem",
                  fontWeight: 800,
                  color: "#0f172a",
                  letterSpacing: "-0.3px",
                }}
              >
                Melhores Clientes
              </h3>
              {processedBestClients.length > 0 && (
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 600,
                    color: "#64748b",
                    background: "#f1f5f9",
                    padding: "3px 8px",
                    borderRadius: "6px",
                  }}
                >
                  {processedBestClients.length}
                </span>
              )}
            </div>
            <div style={styles.exportMenuContainer}>
              <button
                style={styles.exportButton}
                onClick={() =>
                  setOpenExportMenu(
                    openExportMenu === "clients" ? null : "clients"
                  )
                }
                disabled={exportingType === "clients"}
              >
                {exportingType === "clients" ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin"></i> Baixando...
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-download"></i> Exportar
                  </>
                )}
              </button>
              <ExportMenu
                isOpen={openExportMenu === "clients"}
                onExport={(format) => handleExport("clients", format)}
              />
            </div>
          </div>

          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            {processedBestClients.map((client, index) => {
              const rankColors = ["#f59e0b", "#94a3b8", "#a16207"];
              const rankColor = index < 3 ? rankColors[index] : null;
              return (
                <li
                  key={client.id}
                  onClick={() => navigate(`/platform/clients/${client.id}`)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "12px 14px",
                    borderRadius: "10px",
                    background: "#fafbfc",
                    border: "1px solid #f1f5f9",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#ffffff";
                    e.currentTarget.style.borderColor = "#e2e8f0";
                    e.currentTarget.style.boxShadow =
                      "0 2px 8px rgba(0,0,0,0.04)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#fafbfc";
                    e.currentTarget.style.borderColor = "#f1f5f9";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div
                    style={{
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                      background: rankColor || "#e2e8f0",
                      color: rankColor ? "#fff" : "#64748b",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "11px",
                      fontWeight: 800,
                      flexShrink: 0,
                    }}
                  >
                    {index + 1}
                  </div>
                  <ImageWithLoader
                    src={
                      client.profilePictureUrl ||
                      process.env.REACT_APP_DEFAULT_PROFILE_PICTURE
                    }
                    alt={client.name}
                    style={{
                      width: "38px",
                      height: "38px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: "2px solid #fff",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4
                      style={{
                        margin: 0,
                        fontSize: "13px",
                        fontWeight: 700,
                        color: "#0f172a",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {client.name}
                    </h4>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        fontSize: "11px",
                        color: "#64748b",
                        marginTop: "2px",
                      }}
                    >
                      <span>
                        {client.totalContracts} contrato
                        {client.totalContracts !== 1 ? "s" : ""}
                      </span>
                      <span style={{ color: "#cbd5e1" }}>•</span>
                      <span style={{ color: "#10b981", fontWeight: 600 }}>
                        {client.activeContracts} ativo
                        {client.activeContracts !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <div
                      style={{
                        marginTop: "6px",
                        height: "4px",
                        background: "#f1f5f9",
                        borderRadius: "2px",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          background:
                            "linear-gradient(90deg, #10b981 0%, #047857 100%)",
                          width: `${(client.displayAmount / topValue) * 100}%`,
                          borderRadius: "2px",
                          transition: "width 0.3s ease",
                        }}
                      ></div>
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: 800,
                      color: "#047857",
                      letterSpacing: "-0.2px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {formatCurrency(client.displayAmount)}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* VENDAS RECENTES */}
        <div
          style={{
            ...styles.cardBase,
            padding: "22px 24px",
            background: "#ffffff",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "18px",
              paddingBottom: "14px",
              borderBottom: "1px solid #f1f5f9",
              flexWrap: "wrap",
              gap: "10px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  background:
                    "linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontSize: "14px",
                  boxShadow: "0 4px 10px rgba(59,130,246,0.25)",
                }}
              >
                <i className="fa-solid fa-handshake"></i>
              </div>
              <h3
                style={{
                  margin: 0,
                  fontSize: "1rem",
                  fontWeight: 800,
                  color: "#0f172a",
                  letterSpacing: "-0.3px",
                }}
              >
                Vendas Recentes
              </h3>
              {filteredRecentSales.length > 0 && (
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 600,
                    color: "#64748b",
                    background: "#f1f5f9",
                    padding: "3px 8px",
                    borderRadius: "6px",
                  }}
                >
                  {filteredRecentSales.length}
                </span>
              )}
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                flexWrap: "wrap",
              }}
            >
              <div
                style={{
                  display: "flex",
                  background: "#f1f5f9",
                  borderRadius: "8px",
                  padding: "3px",
                  gap: "2px",
                }}
              >
                <button
                  onClick={() => setSalesFilter("all")}
                  style={{
                    padding: "5px 12px",
                    borderRadius: "6px",
                    fontSize: "12px",
                    fontWeight: 600,
                    border: "none",
                    cursor: "pointer",
                    background:
                      salesFilter === "all" ? "#ffffff" : "transparent",
                    color: salesFilter === "all" ? "#0f172a" : "#64748b",
                    boxShadow:
                      salesFilter === "all"
                        ? "0 1px 3px rgba(0,0,0,0.06)"
                        : "none",
                    transition: "all 0.15s ease",
                  }}
                >
                  Todos
                </button>
                <button
                  onClick={() => setSalesFilter("pending")}
                  style={{
                    padding: "5px 12px",
                    borderRadius: "6px",
                    fontSize: "12px",
                    fontWeight: 600,
                    border: "none",
                    cursor: "pointer",
                    background:
                      salesFilter === "pending" ? "#ffffff" : "transparent",
                    color:
                      salesFilter === "pending" ? "#0f172a" : "#64748b",
                    boxShadow:
                      salesFilter === "pending"
                        ? "0 1px 3px rgba(0,0,0,0.06)"
                        : "none",
                    transition: "all 0.15s ease",
                  }}
                >
                  Pendentes
                </button>
              </div>
              <div style={styles.exportMenuContainer}>
                <button
                  style={styles.exportButton}
                  onClick={() =>
                    setOpenExportMenu(
                      openExportMenu === "sales" ? null : "sales"
                    )
                  }
                  disabled={exportingType === "sales"}
                >
                  {exportingType === "sales" ? (
                    <>
                      <i className="fa-solid fa-spinner fa-spin"></i>{" "}
                      Baixando...
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-download"></i> Exportar
                    </>
                  )}
                </button>
                <ExportMenu
                  isOpen={openExportMenu === "sales"}
                  onExport={(format) => handleExport("sales", format)}
                />
              </div>
            </div>
          </div>

          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            {filteredRecentSales.length > 0 ? (
              filteredRecentSales.map((sale) => {
                const isActive = sale.status === 2;
                return (
                  <li
                    key={sale.id}
                    onClick={() => navigate(`/platform/clients/${sale.id}`)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "12px 14px",
                      borderRadius: "10px",
                      background: "#fafbfc",
                      border: "1px solid #f1f5f9",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#ffffff";
                      e.currentTarget.style.borderColor = "#e2e8f0";
                      e.currentTarget.style.boxShadow =
                        "0 2px 8px rgba(0,0,0,0.04)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "#fafbfc";
                      e.currentTarget.style.borderColor = "#f1f5f9";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <ImageWithLoader
                      src={
                        sale.clientProfilePicture ||
                        process.env.REACT_APP_DEFAULT_PROFILE_PICTURE
                      }
                      alt={sale.clientName}
                      style={{
                        width: "38px",
                        height: "38px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        border: "2px solid #fff",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                        flexShrink: 0,
                      }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h4
                        style={{
                          margin: 0,
                          fontSize: "13px",
                          fontWeight: 700,
                          color: "#0f172a",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {sale.clientName}
                      </h4>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          marginTop: "4px",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "10px",
                            fontWeight: 700,
                            padding: "2px 7px",
                            borderRadius: "5px",
                            backgroundColor: isActive ? "#d1fae5" : "#fef3c7",
                            color: isActive ? "#065f46" : "#92400e",
                            textTransform: "uppercase",
                            letterSpacing: "0.4px",
                          }}
                        >
                          {isActive ? "Ativo" : "Pendente"}
                        </span>
                        <span style={{ fontSize: "11px", color: "#94a3b8" }}>
                          <i
                            className="fa-regular fa-clock"
                            style={{ fontSize: "10px", marginRight: "3px" }}
                          ></i>
                          {formatDate(sale.dateCreated)}
                        </span>
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-end",
                        gap: "3px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "14px",
                          fontWeight: 800,
                          color: "#0f172a",
                          letterSpacing: "-0.2px",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {formatCurrency(sale.amount)}
                      </span>
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: 700,
                          color: "#10b981",
                          background: "#f0fdf4",
                          padding: "2px 7px",
                          borderRadius: "5px",
                        }}
                      >
                        +{sale.gainPercentage.toFixed(1)}%
                      </span>
                    </div>
                  </li>
                );
              })
            ) : (
              <div
                style={{
                  textAlign: "center",
                  padding: "32px 16px",
                  color: "#94a3b8",
                  background: "#fafbfc",
                  border: "1px dashed #e2e8f0",
                  borderRadius: "10px",
                }}
              >
                <div
                  style={{
                    fontSize: "28px",
                    marginBottom: "8px",
                    opacity: 0.5,
                  }}
                >
                  <i className="fa-solid fa-inbox"></i>
                </div>
                <div style={{ fontSize: "13px", fontWeight: 600 }}>
                  Nenhuma venda recente
                </div>
              </div>
            )}
          </ul>
        </div>
      </section>
    </div>
  );
}

export default ContractsDashboard;
