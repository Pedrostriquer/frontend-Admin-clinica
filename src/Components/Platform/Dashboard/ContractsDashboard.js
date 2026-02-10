import React, { useState, useEffect, useMemo } from "react";
import {
  AreaChart,
  Area,
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
import { useAuth } from "../../../Context/AuthContext.js";
import ImageWithLoader from "../ImageWithLoader/ImageWithLoader.js";
import { useNavigate } from "react-router-dom";
import { useLoad } from "../../../Context/LoadContext.js";

const RoundedBar = (props) => {
  const { x, y, width, height, fill } = props;
  const radius = 8;
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
  if (value >= 1000) return `R$ ${(value / 1000).toFixed(1)}k`;
  return `R$ ${value.toFixed(0)}`;
};

const monthNumberToName = (monthNumber) => {
  const date = new Date();
  date.setMonth(monthNumber - 1);
  return date.toLocaleString("pt-BR", { month: "short" });
};

function ContractsDashboard() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { token } = useAuth();
  const { startLoading, stopLoading } = useLoad();
  const navigate = useNavigate();

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
        displayAmount: c.amount ?? c.balance ?? 0,
      }))
      .sort((a, b) => b.displayAmount - a.displayAmount)
      .slice(0, 5);
  }, [data]);

  if (isLoading) return <div style={styles.loadingState}>Carregando...</div>;
  if (!data)
    return <div style={styles.loadingState}>Sem dados disponíveis.</div>;

  const kpiData = [
    {
      title: "Faturamento Mensal",
      value: formatCurrencyShort(data.actualMonthlyIncome?.value),
      data: data.lastMonthsIncomes?.map((item) => ({ v: item.value })) || [],
    },
    {
      title: "Contratos Ativos",
      value: data.activeContracts || 0,
      data: [{ v: 10 }, { v: 20 }, { v: 15 }, { v: 30 }],
    },
    {
      title: "Saques no Mês",
      value: formatCurrencyShort(data.monthlyWithdraw),
      data: [{ v: 30 }, { v: 20 }, { v: 40 }, { v: 35 }],
    },
    {
      title: "Ticket Médio",
      value: formatCurrencyShort(data.mediumTicket),
      data: [{ v: 20 }, { v: 18 }, { v: 25 }, { v: 22 }],
    },
  ];

  const barChartData = data.lastMonthsIncomes
    ?.map((item) => ({
      month: monthNumberToName(item.month),
      Faturamento: item.value / 1000,
    }))
    .reverse();

  const topValue = processedBestClients[0]?.displayAmount || 1;

  return (
    <div style={styles.dashboardContainer}>
      <header style={styles.dashboardHeader}>
        <h1 style={styles.headerH1}>Dashboard</h1>
        <p style={styles.headerP}>Visão geral do desempenho</p>
      </header>

      <section style={styles.kpiGrid}>
        {kpiData.map((kpi, index) => (
          <div key={index} style={{ ...styles.cardBase, ...styles.kpiCard }}>
            <div style={styles.kpiBorder}></div>
            <div style={styles.kpiContent}>
              <span style={styles.kpiTitle}>{kpi.title}</span>
              <span style={styles.kpiValue}>{kpi.value}</span>
            </div>
            <div style={styles.kpiChart}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={kpi.data}>
                  <Area
                    type="monotone"
                    dataKey="v"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fillOpacity={0.1}
                    fill="#3b82f6"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        ))}
      </section>

      <section style={styles.mainGrid}>
        <div style={{ ...styles.cardBase, ...styles.mainChartCard }}>
          <h3 style={styles.cardTitle}>Faturamento</h3>
          <div style={styles.chartWrapper}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={barChartData}
                margin={{ top: 20, right: 10, left: -20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  tickFormatter={(val) => `R$${val}k`}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip
                  cursor={{ fill: "transparent" }}
                  formatter={(value) => formatCurrency(value * 1000)}
                />
                <Bar
                  dataKey="Faturamento"
                  shape={<RoundedBar />}
                  fill="#3b82f6"
                  barSize={24}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={{ ...styles.cardBase, ...styles.sellersCard }}>
          <h3 style={styles.cardTitle}>Melhores Clientes</h3>
          <ul style={styles.sellersList}>
            {processedBestClients.map((client) => (
              <li
                onClick={() => navigate(`/platform/clients/${client.id}`)}
                key={client.id}
                style={styles.sellerItem}
                // Adicionando um efeito de hover simples via inline ou classe se preferir
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#f8fafc")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                <ImageWithLoader
                  src={
                    client.profilePictureUrl ||
                    process.env.REACT_APP_DEFAULT_PROFILE_PICTURE
                  }
                  alt={client.name}
                  style={styles.sellerAvatar}
                />
                <div style={styles.sellerInfo}>
                  <span style={styles.sellerName}>{client.name}</span>
                  <div style={styles.progressBar}>
                    <div
                      style={{
                        ...styles.progress,
                        width: `${(client.displayAmount / topValue) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
                {/* ALTERADO AQUI: De formatCurrencyShort para formatCurrency */}
                <span style={styles.sellerSales}>
                  {formatCurrency(client.displayAmount)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

export default ContractsDashboard;
