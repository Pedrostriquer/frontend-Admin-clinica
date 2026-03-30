import React, { useState, useEffect } from "react";
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
import "./EcommerceDashboard.css";
import { useLoad } from "../../../Context/LoadContext";
import { useAuth } from "../../../Context/AuthContext";
import ecommerceDashboardService from "../../../dbServices/ecommerceDashboardService";
import formatServices from "../../../formatServices/formatServices";

const RoundedBar = (props) => {
  const { x, y, width, height, fill } = props;
  const radius = 6;
  if (height < 0) return null;
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

const mockAreaData = [
  { v: 10 },
  { v: 15 },
  { v: 12 },
  { v: 20 },
  { v: 25 },
  { v: 22 },
  { v: 30 },
];

function EcommerceDashboard() {
  const { startLoading, stopLoading } = useLoad();
  const { token } = useAuth();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;
      setIsLoading(true);
      startLoading();
      try {
        const dashboardData =
          await ecommerceDashboardService.getDashboardData();
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

  if (isLoading || !data) {
    return <div className="dashboard-loading">Carregando indicadores...</div>;
  }

  const kpiData = [
    {
      title: "Produtos Ativos",
      value: data.activeProductsCount.toLocaleString("pt-BR"),
      change: "Total na plataforma",
      data: mockAreaData,
    },
    {
      title: "Vendas (Total)",
      value: data.totalSalesCount.toLocaleString("pt-BR"),
      change: "Vendas concluídas",
      data: mockAreaData,
    },
    {
      title: "Carrinhos Abandonados",
      value: data.abandonedCarts.length.toLocaleString("pt-BR"),
      change: "Criados há >10 dias",
      data: mockAreaData,
    },
    {
      title: "Ticket Médio",
      value: formatServices.formatCurrencyBR(data.averageTicket),
      change: "Valor médio por venda",
      data: mockAreaData,
    },
  ];

  const barChartData = data.revenue.monthlyRevenue.map((item) => ({
    month: item.monthName.substring(0, 3),
    Faturamento: parseFloat((item.revenue / 1000).toFixed(1)),
  }));

  const topProductsData = data.bestSellingProducts.map((product) => ({
    name: product.productName,
    sales: product.totalSold,
    image: `https://placehold.co/40x40/a78bfa/ffffff?text=${encodeURIComponent(
      product.productName.substring(0, 2)
    )}`,
  }));

  return (
    <div className="dashboard-neumorph-container">
      <header className="dashboard-header-neumorph">
        <h1>Dashboard E-commerce</h1>
        <p>Visão geral de desempenho da loja</p>
      </header>

      <section className="kpi-grid-neumorph">
        {kpiData.map((kpi, index) => (
          <div key={index} className="kpi-card-final-compact">
            <div className="kpi-border-neumorph"></div>
            <div className="kpi-content-neumorph">
              <span className="kpi-title-neumorph">{kpi.title}</span>
              <span className="kpi-value-neumorph">{kpi.value}</span>
              <span className="kpi-change-neumorph">{kpi.change}</span>
            </div>
            <div className="kpi-chart-neumorph">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={kpi.data}>
                  <defs>
                    <linearGradient
                      id="gradient-blue"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="v"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fill="url(#gradient-blue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        ))}
      </section>

      <section className="main-grid-neumorph">
        <div className="main-chart-card-neumorph">
          <h3 className="card-title-neumorph">Faturamento Mensal (k)</h3>
          <div className="chart-wrapper-neumorph">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={barChartData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e2e8f0"
                />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12, fill: "#718096" }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12, fill: "#718096" }}
                />
                <Tooltip
                  cursor={{ fill: "transparent" }}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                  }}
                  formatter={(value) => [`R$ ${value}k`, "Faturamento"]}
                />
                <Bar
                  dataKey="Faturamento"
                  shape={<RoundedBar />}
                  fill="#3b82f6"
                  barSize={window.innerWidth < 768 ? 15 : 30}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="sellers-card-neumorph">
          <h3 className="card-title-neumorph">Produtos Mais Vendidos</h3>
          <ul className="sellers-list-neumorph">
            {topProductsData.length > 0 ? (
              topProductsData.map((product, index) => (
                <li key={index} className="seller-item-neumorph">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="product-image-neumorph"
                  />
                  <div className="seller-info-neumorph">
                    <span className="product-name-txt">{product.name}</span>
                    <span className="sales-count-txt">
                      {product.sales} vendas
                    </span>
                  </div>
                </li>
              ))
            ) : (
              <p className="empty-txt">Nenhum produto vendido.</p>
            )}
          </ul>
        </div>
      </section>
    </div>
  );
}

export default EcommerceDashboard;
