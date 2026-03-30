const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "40px",
    marginBottom: "48px",
    animation: "fadeIn 0.6s ease-out",
  },

  header: {
    marginBottom: "8px",
  },

  title: {
    fontSize: "36px",
    fontWeight: "900",
    color: "#0f172a",
    margin: "0 0 8px 0",
    letterSpacing: "-1px",
  },

  subtitle: {
    fontSize: "16px",
    color: "#64748b",
    margin: 0,
    fontWeight: "500",
  },

  // Stats Grid - 4 colunas
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "24px",
    width: "100%",
  },

  statCard: {
    backgroundColor: "#ffffff",
    border: "none",
    borderRadius: "16px",
    padding: "32px 24px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
    transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
    cursor: "default",
    position: "relative",
    overflow: "hidden",
    background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
  },

  statCardContent: {
    display: "flex",
    gap: "12px",
    alignItems: "flex-start",
    flexDirection: "column",
  },

  statCardIcon: {
    width: "64px",
    height: "64px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  statCardText: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    width: "100%",
  },

  statValue: {
    fontSize: "36px",
    fontWeight: "900",
    color: "#0f172a",
  },

  statTitle: {
    fontSize: "14px",
    fontWeight: "700",
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },

  statSubtitle: {
    fontSize: "12px",
    color: "#94a3b8",
    fontWeight: "500",
  },

  // Chart and Timeline Wrapper - Novo layout
  chartAndTimelineWrapper: {
    display: "grid",
    gridTemplateColumns: "1fr 1.2fr",
    gap: "32px",
    alignItems: "stretch",
  },

  // Chart Section
  chartSection: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "16px",
  },

  chartCard: {
    backgroundColor: "#ffffff",
    border: "none",
    borderRadius: "20px",
    padding: "40px 32px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
    transition: "all 0.4s ease",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
  },

  chartTitle: {
    fontSize: "20px",
    fontWeight: "900",
    color: "#0f172a",
    margin: "0 0 32px 0",
    letterSpacing: "-0.5px",
    textAlign: "center",
  },

  circleChartContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    width: "320px",
    height: "320px",
    margin: "0 auto 40px",
  },

  circleSvg: {
    width: "100%",
    height: "100%",
    filter: "drop-shadow(0 12px 40px rgba(99, 102, 241, 0.2))",
  },

  chartCenterText: {
    position: "absolute",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
  },

  chartCenterValue: {
    fontSize: "52px",
    fontWeight: "900",
    color: "#10b981",
    lineHeight: "1",
  },

  chartCenterLabel: {
    fontSize: "12px",
    color: "#64748b",
    fontWeight: "700",
    letterSpacing: "0.5px",
    textTransform: "uppercase",
  },

  chartLegend: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    flexWrap: "wrap",
    paddingTop: "24px",
    borderTop: "1px solid #e2e8f0",
    marginTop: "24px",
    width: "100%",
  },

  legendItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    fontSize: "14px",
    color: "#475569",
    fontWeight: "600",
    padding: "8px 12px",
    backgroundColor: "#f8fafc",
    borderRadius: "10px",
    transition: "all 0.3s ease",
  },

  legendColor: {
    width: "20px",
    height: "20px",
    borderRadius: "6px",
    flexShrink: 0,
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
  },

  // Timeline Grid - Novo design vertical com cards maiores
  timelineGrid: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "16px",
  },

  timelineCard: {
    background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
    borderRadius: "16px",
    padding: "32px",
    display: "flex",
    gap: "20px",
    alignItems: "center",
    color: "#ffffff",
    boxShadow: "0 8px 24px rgba(99, 102, 241, 0.25)",
    transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
    cursor: "default",
    position: "relative",
    overflow: "hidden",
    border: "1px solid rgba(255, 255, 255, 0.1)",
  },

  timelineCard2: {
    background: "linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)",
    borderRadius: "16px",
    padding: "32px",
    display: "flex",
    gap: "20px",
    alignItems: "center",
    color: "#ffffff",
    boxShadow: "0 8px 24px rgba(139, 92, 246, 0.25)",
    transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
    cursor: "default",
    position: "relative",
    overflow: "hidden",
    border: "1px solid rgba(255, 255, 255, 0.1)",
  },

  timelineCard3: {
    background: "linear-gradient(135deg, #d946ef 0%, #ec4899 100%)",
    borderRadius: "16px",
    padding: "32px",
    display: "flex",
    gap: "20px",
    alignItems: "center",
    color: "#ffffff",
    boxShadow: "0 8px 24px rgba(217, 70, 239, 0.25)",
    transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
    cursor: "default",
    position: "relative",
    overflow: "hidden",
    border: "1px solid rgba(255, 255, 255, 0.1)",
  },

  timelineIcon: {
    fontSize: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "56px",
    width: "56px",
    height: "56px",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: "12px",
  },

  timelineContent: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    flex: 1,
  },

  timelineValue: {
    fontSize: "32px",
    fontWeight: "900",
  },

  timelineLabel: {
    fontSize: "14px",
    opacity: 0.9,
    fontWeight: "700",
    letterSpacing: "0.3px",
    textTransform: "uppercase",
  },

  loadingSpinner: {
    width: "64px",
    height: "64px",
    border: "4px solid #f1f5f9",
    borderTop: "4px solid #6366f1",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
    margin: "40px auto",
  },

  "@keyframes": {
    spin: {
      to: {
        transform: "rotate(360deg)",
      },
    },
    fadeIn: {
      from: {
        opacity: 0,
        transform: "translateY(10px)",
      },
      to: {
        opacity: 1,
        transform: "translateY(0)",
      },
    },
  },
};

// Injetar keyframes globais
if (typeof document !== "undefined" && !document.getElementById("planejador-header-animations")) {
  const styleTag = document.createElement("style");
  styleTag.id = "planejador-header-animations";
  styleTag.innerHTML = `
    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    @keyframes dash {
      from {
        stroke-dashoffset: 565.49;
      }
      to {
        stroke-dashoffset: 0;
      }
    }
  `;
  document.head.appendChild(styleTag);
}

export default styles;
