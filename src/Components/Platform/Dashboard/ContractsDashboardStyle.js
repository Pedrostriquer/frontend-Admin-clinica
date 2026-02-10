const styles = {
  dashboardContainer: {
    fontFamily: "'Poppins', sans-serif",
    padding: "20px",
    maxWidth: "1600px",
    margin: "0 auto",
    boxSizing: "border-box",
    width: "100%",
  },
  dashboardHeader: {
    marginBottom: "32px",
  },
  headerH1: {
    fontSize: "clamp(1.5rem, 5vw, 2.25rem)",
    fontWeight: 700,
    color: "#1a202c",
    margin: 0,
  },
  headerP: {
    fontSize: "clamp(0.875rem, 2vw, 1rem)",
    color: "#718096",
    marginTop: "4px",
  },
  kpiGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "20px",
    marginBottom: "32px",
  },
  mainGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "24px",
  },
  cardBase: {
    background: "#ffffff",
    borderRadius: "20px",
    border: "1px solid #edf2f7",
    boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.03)",
    transition: "all 0.3s ease",
    overflow: "hidden",
  },
  kpiCard: {
    display: "flex",
    justifyContent: "space-between",
    position: "relative",
    padding: "20px",
  },
  kpiBorder: {
    position: "absolute",
    left: 0,
    top: "25%",
    bottom: "25%",
    width: "4px",
    backgroundColor: "#3b82f6",
    borderRadius: "0 4px 4px 0",
  },
  kpiContent: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    paddingLeft: "10px",
  },
  kpiTitle: {
    fontSize: "0.85rem",
    fontWeight: 500,
    color: "#718096",
    marginBottom: "4px",
  },
  kpiValue: {
    fontSize: "1.5rem",
    fontWeight: 700,
    color: "#1a202c",
  },
  kpiChart: {
    width: "80px",
    height: "50px",
  },
  mainChartCard: {
    padding: "24px",
    minHeight: "450px",
  },
  chartWrapper: {
    width: "100%",
    height: "350px",
    marginTop: "20px",
  },
  sellersCard: {
    padding: "24px",
  },
  cardTitle: {
    fontSize: "1.1rem",
    fontWeight: 600,
    color: "#2d3748",
    margin: "0 0 24px 0",
  },
  sellersList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  sellerItem: {
    display: "flex",
    alignItems: "center",
    gap: "16px", // Aumentei o espaço
    cursor: "pointer",
    padding: "12px", // Aumentei o preenchimento
    borderRadius: "16px",
    transition: "all 0.2s ease",
    border: "1px solid transparent", // Para evitar pulos no hover
  },
  sellerAvatar: {
    width: "48px", // Ligeiramente maior
    height: "48px",
    borderRadius: "12px",
    objectFit: "cover",
    backgroundColor: "#f7fafc",
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)", // Sombra leve na foto
  },
  sellerInfo: {
    flexGrow: 1,
    minWidth: 0,
  },
  sellerName: {
    fontSize: "0.95rem", // Nome um pouco mais visível
    fontWeight: 600, // Negrito mais forte
    color: "#1a202c",
    marginBottom: "8px",
    display: "block",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  sellerSales: {
    fontSize: "0.9rem",
    fontWeight: 700,
    color: "#2f855a", // Um tom de verde escuro para dinheiro (opcional)
    minWidth: "110px", // Aumentei para caber "R$ 10.000,00" sem quebrar
    textAlign: "right",
    fontFamily: "'Inter', monospace", // Fonte mono ajuda a alinhar números
  },
  progressBar: {
    width: "100%",
    height: "6px",
    backgroundColor: "#edf2f7",
    borderRadius: "3px",
  },
  progress: {
    height: "100%",
    backgroundColor: "#3b82f6",
    backgroundImage: "linear-gradient(90deg, #3b82f6, #60a5fa)", // Degradê suave
    borderRadius: "3px",
    transition: "width 1.2s cubic-bezier(0.4, 0, 0.2, 1)",
  },
  loadingState: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    color: "#718096",
  },
};

export default styles;
