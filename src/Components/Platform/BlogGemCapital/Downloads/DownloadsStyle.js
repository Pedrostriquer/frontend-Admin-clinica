const styles = {
  container: {
    padding: "80px 30px 30px 30px",
    backgroundColor: "#f5f5f5",
    minHeight: "100vh",
  },

  header: {
    marginBottom: "40px",
  },

  title: {
    fontSize: "32px",
    fontWeight: "700",
    color: "#333",
    margin: "0 0 10px 0",
    fontFamily: "'Poppins', sans-serif",
  },

  subtitle: {
    fontSize: "14px",
    color: "#666",
    margin: "0",
    fontFamily: "'Poppins', sans-serif",
  },

  // Stats Cards
  statsContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
    marginBottom: "40px",
  },

  statCard: {
    backgroundColor: "#fff",
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
    display: "flex",
    alignItems: "center",
    gap: "20px",
    transition: "all 0.3s ease",
    cursor: "pointer",
    "&:hover": {
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.12)",
      transform: "translateY(-2px)",
    },
  },

  statIcon: {
    width: "60px",
    height: "60px",
    backgroundColor: "#f0f0f0",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "28px",
    color: "#666",
  },

  statContent: {
    flex: 1,
  },

  statLabel: {
    fontSize: "12px",
    color: "#999",
    margin: "0 0 8px 0",
    textTransform: "uppercase",
    fontWeight: "600",
    letterSpacing: "0.5px",
    fontFamily: "'Poppins', sans-serif",
  },

  statValue: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#333",
    margin: "0",
    fontFamily: "'Poppins', sans-serif",
  },

  // Filters Container
  filtersContainer: {
    backgroundColor: "#fff",
    padding: "20px 30px",
    borderRadius: "12px",
    marginBottom: "20px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
    display: "flex",
    gap: "15px",
    alignItems: "flex-end",
    flexWrap: "wrap",
  },

  filterGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    flex: "1 1 auto",
    minWidth: "200px",
  },

  filterLabel: {
    fontSize: "12px",
    fontWeight: "600",
    color: "#666",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },

  searchInput: {
    padding: "10px 15px",
    fontSize: "14px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    fontFamily: "'Poppins', sans-serif",
    transition: "border-color 0.2s ease",
    width: "100%",
    boxSizing: "border-box",
  },

  filterSelect: {
    padding: "10px 15px",
    fontSize: "14px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    fontFamily: "'Poppins', sans-serif",
    cursor: "pointer",
    backgroundColor: "#fff",
    transition: "border-color 0.2s ease",
  },

  clearButton: {
    padding: "10px 15px",
    backgroundColor: "#f0f0f0",
    color: "#666",
    border: "1px solid #e0e0e0",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "600",
    cursor: "pointer",
    fontFamily: "'Poppins', sans-serif",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },

  // Table Container
  tableContainer: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
    overflow: "hidden",
  },

  tableHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "25px 30px",
    borderBottom: "1px solid #e8e8e8",
  },

  tableTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#333",
    margin: "0",
    fontFamily: "'Poppins', sans-serif",
  },

  addButton: {
    padding: "10px 20px",
    backgroundColor: "#2196F3",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    transition: "all 0.3s ease",
    fontFamily: "'Poppins', sans-serif",
    "&:hover": {
      backgroundColor: "#1976D2",
    },
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontFamily: "'Poppins', sans-serif",
  },

  tableHeaderRow: {
    backgroundColor: "#f9f9f9",
    borderBottom: "2px solid #e8e8e8",
  },

  tableHeaderCell: {
    padding: "15px 20px",
    textAlign: "left",
    fontSize: "12px",
    fontWeight: "700",
    color: "#666",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },

  tableRow: {
    borderBottom: "1px solid #e8e8e8",
    transition: "background-color 0.2s ease",
    "&:hover": {
      backgroundColor: "#f9f9f9",
    },
  },

  tableCell: {
    padding: "15px 20px",
    fontSize: "14px",
    color: "#333",
    verticalAlign: "middle",
  },

  nameCell: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontWeight: "500",
  },

  descriptionText: {
    color: "#666",
    fontSize: "13px",
  },

  downloadCount: {
    backgroundColor: "#e3f2fd",
    color: "#2196F3",
    padding: "4px 10px",
    borderRadius: "4px",
    fontWeight: "600",
    fontSize: "13px",
  },

  statusBadge: {
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
    textAlign: "center",
    display: "inline-block",
  },

  statusBadgeActive: {
    backgroundColor: "#c8e6c9",
    color: "#2e7d32",
  },

  statusBadgeInactive: {
    backgroundColor: "#ffe0b2",
    color: "#e65100",
  },

  actionsCell: {
    display: "flex",
    gap: "8px",
  },

  actionButton: {
    padding: "8px 10px",
    backgroundColor: "#f0f0f0",
    color: "#666",
    border: "1px solid #e0e0e0",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    transition: "all 0.3s ease",
    "&:hover": {
      backgroundColor: "#e0e0e0",
      color: "#333",
    },
  },

  // Modal Styles
  modalBackdrop: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },

  modalContent: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    boxShadow: "0 10px 40px rgba(0, 0, 0, 0.2)",
    maxWidth: "500px",
    width: "90%",
    maxHeight: "90vh",
    overflow: "auto",
    fontFamily: "'Poppins', sans-serif",
  },

  modalHeader: {
    padding: "25px 30px",
    borderBottom: "1px solid #e8e8e8",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  modalTitle: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#333",
    margin: "0",
  },

  modalCloseBtn: {
    background: "none",
    border: "none",
    fontSize: "28px",
    color: "#999",
    cursor: "pointer",
    padding: "0",
    width: "30px",
    height: "30px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "color 0.2s ease",
  },

  form: {
    padding: "30px",
  },

  formGroup: {
    marginBottom: "20px",
  },

  formLabel: {
    display: "block",
    fontSize: "14px",
    fontWeight: "600",
    color: "#333",
    marginBottom: "8px",
  },

  formInput: {
    width: "100%",
    padding: "10px 12px",
    fontSize: "14px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    fontFamily: "'Poppins', sans-serif",
    boxSizing: "border-box",
    transition: "border-color 0.2s ease",
  },

  formTextarea: {
    width: "100%",
    padding: "10px 12px",
    fontSize: "14px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    fontFamily: "'Poppins', sans-serif",
    boxSizing: "border-box",
    resize: "vertical",
    transition: "border-color 0.2s ease",
  },

  fileInputWrapper: {
    position: "relative",
  },

  fileInput: {
    display: "none",
  },

  fileInputLabel: {
    padding: "30px",
    border: "2px dashed #2196F3",
    borderRadius: "8px",
    textAlign: "center",
    cursor: "pointer",
    backgroundColor: "#f0f8ff",
    transition: "all 0.2s ease",
    fontSize: "14px",
    color: "#2196F3",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px",
  },

  formActions: {
    display: "flex",
    gap: "10px",
    marginTop: "30px",
    paddingTop: "20px",
    borderTop: "1px solid #e8e8e8",
  },

  cancelButton: {
    flex: 1,
    padding: "12px 20px",
    backgroundColor: "#f0f0f0",
    color: "#666",
    border: "1px solid #e0e0e0",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    fontFamily: "'Poppins', sans-serif",
  },

  submitButton: {
    flex: 1,
    padding: "12px 20px",
    backgroundColor: "#2196F3",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.3s ease",
    fontFamily: "'Poppins', sans-serif",
  },

  // Edit Page Styles
  editFormContainer: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
    padding: "40px",
    maxWidth: "600px",
    margin: "0 auto",
  },

  backButton: {
    padding: "10px 15px",
    backgroundColor: "#f0f0f0",
    color: "#666",
    border: "1px solid #e0e0e0",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    fontFamily: "'Poppins', sans-serif",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "20px",
    transition: "all 0.2s ease",
  },

  errorAlert: {
    backgroundColor: "#ffebee",
    color: "#c62828",
    padding: "15px",
    borderRadius: "8px",
    marginBottom: "20px",
    border: "1px solid #ef5350",
    fontSize: "14px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  currentFileInfo: {
    padding: "20px",
    backgroundColor: "#f9f9f9",
    border: "1px solid #e0e0e0",
    borderRadius: "8px",
    display: "flex",
    alignItems: "flex-start",
    gap: "15px",
    fontSize: "14px",
  },

  currentFileName: {
    margin: "0 0 8px 0",
    fontWeight: "600",
    color: "#333",
    wordBreak: "break-all",
  },

  fileLink: {
    color: "#2196F3",
    textDecoration: "none",
    fontSize: "12px",
    fontWeight: "600",
    cursor: "pointer",
  },

  fileHint: {
    fontSize: "12px",
    color: "#FF9800",
    margin: "8px 0 0 0",
  },
};

export default styles;
