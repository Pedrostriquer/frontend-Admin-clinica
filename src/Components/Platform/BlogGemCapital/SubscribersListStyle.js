const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "30px",
  },

  // Dashboard Stats
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "16px",
    marginBottom: "20px",
  },

  statCard: {
    backgroundColor: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    padding: "20px",
    textAlign: "center",
    transition: "all 0.3s ease",
    cursor: "default",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
  },

  statLabel: {
    fontSize: "12px",
    color: "#64748b",
    textTransform: "uppercase",
    fontWeight: "600",
    letterSpacing: "0.5px",
    marginBottom: "10px",
  },

  statValue: {
    fontSize: "32px",
    fontWeight: "700",
    color: "#1e293b",
  },

  // Comparativo Mensal
  comparisonSection: {
    backgroundColor: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    padding: "24px",
  },

  sectionTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: "20px",
  },

  comparisonCards: {
    display: "grid",
    gridTemplateColumns: "1fr auto 1fr",
    gap: "20px",
    marginBottom: "30px",
    alignItems: "center",
  },

  comparisonCard: {
    backgroundColor: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    padding: "20px",
    textAlign: "center",
  },

  monthLabel: {
    fontSize: "12px",
    color: "#64748b",
    textTransform: "uppercase",
    fontWeight: "600",
    marginBottom: "8px",
  },

  monthValue: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#1e293b",
  },

  changeIndicator: {
    backgroundColor: "#f8fafc",
    border: "2px solid #6366f1",
    borderRadius: "8px",
    padding: "20px",
    textAlign: "center",
  },

  changeValue: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#6366f1",
    marginBottom: "5px",
  },

  changeLabel: {
    fontSize: "12px",
    color: "#64748b",
    fontWeight: "600",
  },

  chartContainer: {
    backgroundColor: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    padding: "20px",
    marginTop: "20px",
  },

  // Tabela
  tableSection: {
    backgroundColor: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    padding: "24px",
  },

  tableHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    gap: "16px",
    flexWrap: "wrap",
  },

  searchInput: {
    padding: "10px 16px",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "14px",
    fontFamily: "inherit",
    minWidth: "250px",
    transition: "all 0.3s ease",
  },

  tableWrapper: {
    overflowX: "auto",
    marginBottom: "20px",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "14px",
  },

  tableHeaderRow: {
    backgroundColor: "#f8fafc",
    borderBottom: "2px solid #e2e8f0",
  },

  tableCell: {
    padding: "12px 16px",
    textAlign: "left",
    color: "#475569",
  },

  tableRow: {
    borderBottom: "1px solid #e2e8f0",
    transition: "background-color 0.2s ease",
  },

  statusBadge: {
    display: "inline-block",
    padding: "6px 12px",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "600",
    textAlign: "center",
    minWidth: "80px",
  },

  deleteButton: {
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
    padding: "4px 8px",
    borderRadius: "4px",
    transition: "all 0.2s ease",
    opacity: 0.7,
  },

  emptyCell: {
    textAlign: "center",
    padding: "20px",
    color: "#94a3b8",
    fontStyle: "italic",
  },

  loading: {
    textAlign: "center",
    padding: "40px 20px",
    color: "#64748b",
    fontSize: "14px",
  },

  // Paginação
  pagination: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "16px",
    marginTop: "20px",
    paddingTop: "20px",
    borderTop: "1px solid #e2e8f0",
  },

  paginationButton: {
    padding: "10px 16px",
    backgroundColor: "#6366f1",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
    transition: "all 0.2s ease",
  },

  pageInfo: {
    fontSize: "14px",
    color: "#475569",
    fontWeight: "500",
    minWidth: "150px",
    textAlign: "center",
  },
};

export default styles;
