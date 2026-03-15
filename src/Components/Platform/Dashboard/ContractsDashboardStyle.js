const styles = {
  dashboardContainer: {
    fontFamily: "'Poppins', sans-serif",
    padding: "20px 20px",
    maxWidth: "1920px",
    margin: "0 auto",
    boxSizing: "border-box",
    width: "100%",
    backgroundColor: "#fafbfc",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },

  // ============ HEADER ============
  dashboardHeader: {
    marginBottom: "12px",
    paddingBottom: "12px",
    borderBottom: "1px solid #e2e8f0",
  },
  headerH1: {
    fontSize: "1.75rem",
    fontWeight: 800,
    color: "#0f172a",
    margin: "0 0 4px 0",
    letterSpacing: "-0.5px",
  },
  headerP: {
    fontSize: "0.85rem",
    color: "#64748b",
    margin: "0",
    fontWeight: 400,
  },

  // ============ KPI GRID ============
  kpiGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "16px",
  },

  cardBase: {
    background: "#ffffff",
    borderRadius: "10px",
    border: "1px solid #e2e8f0",
    boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.08)",
    transition: "all 0.3s ease",
    overflow: "hidden",
  },

  kpiCard: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "18px",
    position: "relative",
  },

  kpiBorder: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: "3px",
    backgroundColor: "#3b82f6",
  },

  kpiContent: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    flex: 1,
    paddingLeft: "10px",
  },

  kpiTitle: {
    fontSize: "0.75rem",
    fontWeight: 600,
    color: "#64748b",
    marginBottom: "4px",
    textTransform: "uppercase",
    letterSpacing: "0.3px",
  },

  kpiValue: {
    fontSize: "1.4rem",
    fontWeight: 800,
    color: "#0f172a",
    lineHeight: "1.2",
  },

  kpiChart: {
    width: "80px",
    height: "50px",
    marginLeft: "12px",
    opacity: 0.5,
  },

  // ============ MAIN GRID (2 COLUNAS) ============
  mainGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
    flex: 1,
    minHeight: "0",
  },

  chartCard: {
    padding: "20px",
    display: "flex",
    flexDirection: "column",
  },

  chartWrapper: {
    width: "100%",
    flex: 1,
    minHeight: "200px",
    marginTop: "12px",
  },

  // ============ CLIENTS & WITHDRAWS GRID ============
  bottomGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
  },

  cardTitle: {
    fontSize: "1.05rem",
    fontWeight: 700,
    color: "#0f172a",
    margin: "0 0 16px 0",
    paddingBottom: "10px",
    borderBottom: "2px solid #f1f5f9",
  },

  // ============ CLIENTS ============
  clientsCard: {
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    minHeight: "0",
  },

  clientsList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    overflowY: "auto",
    flex: 1,
  },

  clientItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
    cursor: "pointer",
    padding: "12px",
    borderRadius: "8px",
    transition: "all 0.2s ease",
    border: "1px solid #f1f5f9",
    backgroundColor: "#ffffff",
  },

  clientAvatar: {
    width: "48px",
    height: "48px",
    minWidth: "48px",
    borderRadius: "8px",
    objectFit: "cover",
    backgroundColor: "#f1f5f9",
    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.08)",
    border: "1px solid #e2e8f0",
  },

  clientInfo: {
    flex: 1,
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },

  clientName: {
    fontSize: "0.9rem",
    fontWeight: 700,
    color: "#0f172a",
    margin: 0,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },

  clientMeta: {
    fontSize: "0.75rem",
    color: "#64748b",
    fontWeight: 500,
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
  },

  progressBar: {
    width: "100%",
    height: "4px",
    backgroundColor: "#e2e8f0",
    borderRadius: "2px",
    marginTop: "4px",
    overflow: "hidden",
  },

  progress: {
    height: "100%",
    backgroundColor: "#3b82f6",
    backgroundImage: "linear-gradient(90deg, #3b82f6, #60a5fa)",
    borderRadius: "2px",
    transition: "width 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
  },

  clientAmount: {
    fontSize: "0.95rem",
    fontWeight: 800,
    color: "#059669",
    minWidth: "100px",
    textAlign: "right",
    fontFamily: "'Inter', 'Courier', monospace",
  },

  // ============ WITHDRAWALS ============
  withdrawalsCard: {
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    minHeight: "0",
  },

  withdrawalsList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    overflowY: "auto",
    flex: 1,
  },

  withdrawalItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #f1f5f9",
    backgroundColor: "#ffffff",
    transition: "all 0.2s ease",
  },

  withdrawalAvatar: {
    width: "40px",
    height: "40px",
    minWidth: "40px",
    borderRadius: "8px",
    objectFit: "cover",
    backgroundColor: "#f1f5f9",
    border: "1px solid #e2e8f0",
  },

  withdrawalInfo: {
    flex: 1,
    minWidth: 0,
  },

  withdrawalName: {
    fontSize: "0.9rem",
    fontWeight: 600,
    color: "#0f172a",
    margin: "0 0 2px 0",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },

  withdrawalDate: {
    fontSize: "0.75rem",
    color: "#64748b",
    margin: 0,
  },

  withdrawalAmount: {
    fontSize: "0.95rem",
    fontWeight: 700,
    minWidth: "90px",
    textAlign: "right",
    fontFamily: "'Inter', 'Courier', monospace",
  },

  statusBadge: {
    display: "inline-block",
    padding: "4px 8px",
    borderRadius: "4px",
    fontSize: "0.7rem",
    fontWeight: 600,
    textAlign: "center",
    minWidth: "60px",
  },

  // ============ SALES SECTION ============
  salesCard: {
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    minHeight: "0",
  },

  salesHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
    paddingBottom: "10px",
    borderBottom: "2px solid #f1f5f9",
  },

  salesTitle: {
    fontSize: "1.05rem",
    fontWeight: 700,
    color: "#0f172a",
    margin: 0,
  },

  filterTabs: {
    display: "flex",
    gap: "8px",
  },

  filterTab: {
    padding: "6px 12px",
    borderRadius: "6px",
    fontSize: "0.8rem",
    fontWeight: 600,
    cursor: "pointer",
    border: "1px solid #e2e8f0",
    backgroundColor: "#f1f5f9",
    color: "#64748b",
    transition: "all 0.2s ease",
    "&:hover": {
      borderColor: "#cbd5e1",
    },
  },

  filterTabActive: {
    backgroundColor: "#3b82f6",
    color: "#ffffff",
    borderColor: "#3b82f6",
  },

  salesList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    overflowY: "auto",
    flex: 1,
  },

  saleItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #f1f5f9",
    backgroundColor: "#ffffff",
    transition: "all 0.2s ease",
  },

  saleAvatar: {
    width: "44px",
    height: "44px",
    minWidth: "44px",
    borderRadius: "8px",
    objectFit: "cover",
    backgroundColor: "#f1f5f9",
    border: "1px solid #e2e8f0",
  },

  saleInfo: {
    flex: 1,
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },

  saleName: {
    fontSize: "0.9rem",
    fontWeight: 600,
    color: "#0f172a",
    margin: "0",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },

  saleDetails: {
    fontSize: "0.75rem",
    color: "#64748b",
    fontWeight: 500,
    display: "flex",
    gap: "8px",
  },

  saleAmount: {
    fontSize: "0.95rem",
    fontWeight: 700,
    color: "#059669",
    minWidth: "90px",
    textAlign: "right",
    fontFamily: "'Inter', 'Courier', monospace",
  },

  saleGain: {
    fontSize: "0.85rem",
    fontWeight: 700,
    color: "#3b82f6",
    minWidth: "50px",
    textAlign: "right",
  },

  // ============ EXPORT BUTTONS ============
  exportButtonGroup: {
    display: "flex",
    gap: "6px",
    alignItems: "center",
  },

  exportButton: {
    padding: "6px 10px",
    borderRadius: "6px",
    fontSize: "0.75rem",
    fontWeight: 600,
    cursor: "pointer",
    border: "1px solid #e2e8f0",
    backgroundColor: "#f1f5f9",
    color: "#64748b",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    gap: "4px",
  },

  exportMenuContainer: {
    position: "relative",
    display: "inline-block",
  },

  exportMenu: {
    position: "absolute",
    top: "100%",
    right: 0,
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
    zIndex: 1000,
    minWidth: "140px",
    marginTop: "4px",
  },

  exportMenuItem: {
    padding: "10px 16px",
    cursor: "pointer",
    fontSize: "0.85rem",
    borderBottom: "1px solid #f1f5f9",
    transition: "all 0.2s ease",
    color: "#0f172a",
    fontWeight: 500,
  },

  // ============ LOADING STATE ============
  loadingState: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    color: "#64748b",
    fontSize: "1rem",
  },

  // ============ RESPONSIVE ============
  "@media (max-width: 1200px)": {
    mainGrid: {
      gridTemplateColumns: "1fr",
    },
    bottomGrid: {
      gridTemplateColumns: "1fr",
    },
  },
  "@media (max-width: 768px)": {
    kpiGrid: {
      gridTemplateColumns: "repeat(2, 1fr)",
    },
  },
};

export default styles;
