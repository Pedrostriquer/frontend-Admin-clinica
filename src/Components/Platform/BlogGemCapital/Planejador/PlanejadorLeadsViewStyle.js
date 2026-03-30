const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
    width: "100%",
  },

  // Seção de Filtros
  filterSection: {
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    padding: "20px",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
  },

  filterTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: "16px",
  },

  filterRow: {
    display: "flex",
    gap: "16px",
    marginBottom: "16px",
    flexWrap: "wrap",
  },

  filterGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    flex: "1 1 200px",
    minWidth: "150px",
  },

  label: {
    fontSize: "13px",
    fontWeight: "500",
    color: "#4b5563",
  },

  input: {
    padding: "8px 12px",
    borderRadius: "6px",
    border: "1px solid #d1d5db",
    fontSize: "14px",
    fontFamily: "inherit",
    backgroundColor: "#ffffff",
    color: "#1f2937",
    transition: "all 0.2s ease",
    boxSizing: "border-box",
    outline: "none",
  },

  select: {
    padding: "8px 12px",
    borderRadius: "6px",
    border: "1px solid #d1d5db",
    fontSize: "14px",
    fontFamily: "inherit",
    backgroundColor: "#ffffff",
    color: "#1f2937",
    cursor: "pointer",
    transition: "all 0.2s ease",
    boxSizing: "border-box",
    outline: "none",
  },

  clearButton: {
    padding: "8px 16px",
    backgroundColor: "#6366f1",
    color: "#ffffff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    transition: "all 0.2s ease",
    marginTop: "auto",
  },

  // Resultado
  resultInfo: {
    fontSize: "14px",
    color: "#6b7280",
    padding: "0 4px",
  },

  // Tabela
  tableContainer: {
    overflowX: "auto",
    overflowY: "visible",
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "14px",
  },

  tableHeaderRow: {
    backgroundColor: "#f9fafb",
    borderBottom: "2px solid #e5e7eb",
  },

  tableHeader: {
    padding: "12px 16px",
    textAlign: "left",
    fontWeight: "600",
    color: "#374151",
    whiteSpace: "nowrap",
  },

  tableRow: {
    borderBottom: "1px solid #e5e7eb",
    transition: "background-color 0.2s ease",
  },

  tableCell: {
    padding: "12px 16px",
    color: "#1f2937",
  },

  typeBadge: {
    display: "inline-block",
    padding: "4px 12px",
    backgroundColor: "#dbeafe",
    color: "#1e40af",
    borderRadius: "4px",
    fontSize: "12px",
    fontWeight: "500",
  },

  statusBadge: {
    display: "inline-block",
    padding: "4px 12px",
    color: "#ffffff",
    borderRadius: "4px",
    fontSize: "12px",
    fontWeight: "500",
  },

  // Estados
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "60px 20px",
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
    gap: "20px",
    animation: "fadeIn 0.3s ease-in-out",
  },

  loadingSpinner: {
    width: "48px",
    height: "48px",
    border: "4px solid #f0f0f0",
    borderTop: "4px solid #6366f1",
    borderRight: "4px solid #6366f1",
    borderRadius: "50%",
    animation: "spin 0.8s cubic-bezier(0.65, 0.05, 0.36, 1) infinite",
    boxShadow: "0 0 0 1px rgba(99, 102, 241, 0.1)",
  },

  emptyState: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "60px 20px",
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
    color: "#6b7280",
    fontSize: "16px",
  },

  // Paginação
  paginationContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "16px",
    padding: "16px",
    borderTop: "1px solid #e5e7eb",
    backgroundColor: "#f9fafb",
  },

  paginationButton: {
    padding: "8px 16px",
    backgroundColor: "#6366f1",
    color: "#ffffff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    transition: "all 0.2s ease",
  },

  pageInfo: {
    fontSize: "14px",
    color: "#6b7280",
    fontWeight: "500",
    minWidth: "60px",
    textAlign: "center",
  },

  pageSizeSelect: {
    padding: "8px 12px",
    borderRadius: "6px",
    border: "1px solid #d1d5db",
    fontSize: "14px",
    cursor: "pointer",
    backgroundColor: "#ffffff",
    color: "#1f2937",
  },
};

export default styles;
