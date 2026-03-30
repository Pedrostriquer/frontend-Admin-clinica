import React, { useState, useEffect } from "react";
import styles from "./PlanejadorLeadsHeaderStyle";
import { TrendingUp, Clock, CheckCircle, Users, Calendar, BarChart3 } from "lucide-react";

const PlanejadorLeadsHeader = ({ startDate = "", endDate = "" }) => {
  const [statistics, setStatistics] = useState({
    totalLeads: 0,
    pendingContacts: 0,
    contactedLeads: 0,
    leadsToday: 0,
    leadsThisWeek: 0,
    leadsThisMonth: 0,
    contactedPercentage: 0,
    pendingPercentage: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatistics();
  }, [startDate, endDate]);

  const fetchStatistics = async () => {
    try {
      setLoading(true);

      // Construir URL com parâmetros de data
      let url = "http://localhost:5097/api/PlanejadorLeads/statistics";
      const params = new URLSearchParams();

      if (startDate) {
        params.append("startDate", startDate);
      }
      if (endDate) {
        params.append("endDate", endDate);
      }

      if (params.toString()) {
        url += "?" + params.toString();
      }

      const response = await fetch(url);
      if (!response.ok) throw new Error("Erro ao buscar estatísticas");
      const data = await response.json();
      setStatistics(data);
    } catch (error) {
      console.error("Erro ao buscar estatísticas:", error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, subtitle, color, icon: Icon }) => (
    <div style={{ ...styles.statCard, borderLeftColor: color }}>
      <div style={styles.statCardContent}>
        <div style={{ ...styles.statCardIcon, backgroundColor: `${color}15` }}>
          <Icon size={24} color={color} />
        </div>
        <div style={styles.statCardText}>
          <div style={styles.statValue}>{value.toLocaleString("pt-BR")}</div>
          <div style={styles.statTitle}>{title}</div>
          {subtitle && <div style={styles.statSubtitle}>{subtitle}</div>}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingSpinner}></div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Título */}
      <div style={styles.header}>
        <h2 style={styles.title}>Dashboard de Leads - Planejador</h2>
        <p style={styles.subtitle}>Visão geral de todos os leads recebidos</p>
      </div>

      {/* Primeira linha: Estatísticas principais */}
      <div style={styles.statsGrid}>
        <StatCard
          title="Total de Leads"
          value={statistics.totalLeads}
          subtitle={`Recebidos no total`}
          color="#6366f1"
          icon={Users}
        />
        <StatCard
          title="Pendentes de Contato"
          value={statistics.pendingContacts}
          subtitle={`${statistics.pendingPercentage.toFixed(1)}% do total`}
          color="#ef4444"
          icon={Clock}
        />
        <StatCard
          title="Já Contactados"
          value={statistics.contactedLeads}
          subtitle={`${statistics.contactedPercentage.toFixed(1)}% do total`}
          color="#10b981"
          icon={CheckCircle}
        />
      </div>

      {/* Segunda e terceira linha: Gráfico e Timeline lado a lado */}
      <div style={styles.chartAndTimelineWrapper}>
        {/* Esquerda: Gráfico circular com status de contato */}
        <div style={styles.chartSection}>
          <div style={styles.chartCard}>
            <h3 style={styles.chartTitle}>Status de Contato</h3>
            <div style={styles.circleChartContainer}>
              <svg style={styles.circleSvg} viewBox="0 0 240 240">
                <defs>
                  <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Círculo de fundo com gradiente */}
                <circle cx="120" cy="120" r="90" fill="none" stroke="#f1f5f9" strokeWidth="28" />

                {/* Círculo cinza claro (background) */}
                <circle cx="120" cy="120" r="90" fill="none" stroke="#e2e8f0" strokeWidth="26" opacity="0.4" />

                {/* Seção de contactados (verde com brilho) - começa do topo */}
                {statistics.totalLeads > 0 && (
                  <>
                    <circle
                      cx="120"
                      cy="120"
                      r="90"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="28"
                      strokeDasharray={`${(statistics.contactedPercentage / 100) * 565.49} 565.49`}
                      strokeDashoffset="0"
                      strokeLinecap="round"
                      transform="rotate(-90 120 120)"
                      filter="url(#glow)"
                      opacity="0.95"
                      style={{ animation: "dash 1.5s ease-out forwards" }}
                    />
                    <circle
                      cx="120"
                      cy="120"
                      r="90"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="26"
                      strokeDasharray={`${(statistics.contactedPercentage / 100) * 565.49} 565.49`}
                      strokeDashoffset="0"
                      strokeLinecap="round"
                      transform="rotate(-90 120 120)"
                      opacity="0.3"
                      style={{ animation: "dash 1.5s ease-out forwards" }}
                    />
                  </>
                )}

                {/* Seção de pendentes (vermelho) */}
                {statistics.totalLeads > 0 && (
                  <>
                    <circle
                      cx="120"
                      cy="120"
                      r="90"
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="28"
                      strokeDasharray={`${(statistics.pendingPercentage / 100) * 565.49} 565.49`}
                      strokeDashoffset={`-${(statistics.contactedPercentage / 100) * 565.49}`}
                      strokeLinecap="round"
                      transform="rotate(-90 120 120)"
                      filter="url(#glow)"
                      opacity="0.95"
                      style={{ animation: "dash 1.8s ease-out forwards 0.2s both" }}
                    />
                    <circle
                      cx="120"
                      cy="120"
                      r="90"
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="26"
                      strokeDasharray={`${(statistics.pendingPercentage / 100) * 565.49} 565.49`}
                      strokeDashoffset={`-${(statistics.contactedPercentage / 100) * 565.49}`}
                      strokeLinecap="round"
                      transform="rotate(-90 120 120)"
                      opacity="0.2"
                      style={{ animation: "dash 1.8s ease-out forwards 0.2s both" }}
                    />
                  </>
                )}

                {/* Ponto central decorativo */}
                <circle cx="120" cy="120" r="6" fill="#10b981" opacity="0.3" />
              </svg>
              <div style={styles.chartCenterText}>
                <div style={styles.chartCenterValue}>
                  {statistics.contactedPercentage.toFixed(0)}%
                </div>
                <div style={styles.chartCenterLabel}>Contactados</div>
              </div>
            </div>
            <div style={styles.chartLegend}>
              <div style={styles.legendItem}>
                <div style={{ ...styles.legendColor, backgroundColor: "#10b981" }}></div>
                <span>Contactados: {statistics.contactedLeads}</span>
              </div>
              <div style={styles.legendItem}>
                <div style={{ ...styles.legendColor, backgroundColor: "#ef4444" }}></div>
                <span>Pendentes: {statistics.pendingContacts}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Direita: Leads por período empilhados */}
        <div style={styles.timelineGrid}>
          <div style={styles.timelineCard}>
            <div style={styles.timelineIcon}>
              <Calendar size={32} color="#ffffff" />
            </div>
            <div style={styles.timelineContent}>
              <div style={styles.timelineValue}>{statistics.leadsToday}</div>
              <div style={styles.timelineLabel}>Leads Hoje</div>
            </div>
          </div>
          <div style={styles.timelineCard2}>
            <div style={styles.timelineIcon}>
              <BarChart3 size={32} color="#ffffff" />
            </div>
            <div style={styles.timelineContent}>
              <div style={styles.timelineValue}>{statistics.leadsThisWeek}</div>
              <div style={styles.timelineLabel}>Esta Semana</div>
            </div>
          </div>
          <div style={styles.timelineCard3}>
            <div style={styles.timelineIcon}>
              <TrendingUp size={32} color="#ffffff" />
            </div>
            <div style={styles.timelineContent}>
              <div style={styles.timelineValue}>{statistics.leadsThisMonth}</div>
              <div style={styles.timelineLabel}>Este Mês</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanejadorLeadsHeader;
