const styles = {
  container: {
    padding: "130px 20px 20px 20px",
    backgroundColor: "#f5f5f5",
    minHeight: "100vh",
  },

  // Header
  header: {
    marginBottom: "30px",
  },
  pageTitle: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#1a1a1a",
    margin: "0 0 8px 0",
  },
  pageSubtitle: {
    fontSize: "14px",
    color: "#666",
    margin: "0",
  },

  // Loading
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    backgroundColor: "#f5f5f5",
  },
  spinner: {
    width: "50px",
    height: "50px",
    border: "4px solid #e0e0e0",
    borderTop: "4px solid #2196F3",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    marginBottom: "20px",
  },
  loadingText: {
    fontSize: "16px",
    color: "#666",
    fontWeight: "500",
  },

  // Error
  errorContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    backgroundColor: "#f5f5f5",
  },
  errorText: {
    fontSize: "18px",
    color: "#d32f2f",
    fontWeight: "500",
  },

  // Top Section - Inputs
  topSection: {
    backgroundColor: "#fff",
    borderRadius: "8px",
    padding: "25px",
    marginBottom: "25px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
    border: "1px solid #e8e8e8",
  },
  sectionHeader: {
    marginBottom: "20px",
    paddingBottom: "15px",
    borderBottom: "1px solid #f0f0f0",
  },
  sectionTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#1a1a1a",
    margin: "0 0 5px 0",
  },
  sectionDescription: {
    fontSize: "13px",
    color: "#999",
    margin: "0",
  },
  inputGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    fontSize: "12px",
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: "8px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  inputWrapper: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
  },
  input: {
    padding: "10px 12px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    fontSize: "13px",
    fontFamily: "inherit",
    backgroundColor: "#f9f9f9",
    transition: "all 0.2s",
    outline: "none",
    marginBottom: "4px",
  },
  placeholder: {
    fontSize: "11px",
    color: "#999",
    fontFamily: "monospace",
    letterSpacing: "0.3px",
  },

  // Content Section - 2 Colunas (Desktop/Tablet)
  contentSection: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "25px",
    marginBottom: "20px",
  },

  // Content Section - Mobile
  mobileContentSection: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "25px",
    marginBottom: "20px",
    position: "relative",
  },

  column: {
    display: "flex",
    flexDirection: "column",
    height: "calc(100vh - 400px)",
    minHeight: "600px",
  },
  columnHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
    paddingBottom: "12px",
    borderBottom: "1px solid #f0f0f0",
  },
  columnTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#1a1a1a",
    margin: "0",
  },

  // Edit Button
  editButton: {
    padding: "8px 16px",
    backgroundColor: "#2196F3",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s",
  },

  // HTML Box
  htmlBox: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    border: "1px solid #e8e8e8",
    marginBottom: "12px",
  },
  textarea: {
    flex: 1,
    padding: "15px",
    border: "none",
    borderRadius: "8px",
    fontFamily: "Monaco, 'Courier New', monospace",
    fontSize: "12px",
    backgroundColor: "#1e1e1e",
    color: "#d4d4d4",
    outline: "none",
    resize: "none",
  },
  textareaDisabled: {
    backgroundColor: "#f5f5f5",
    color: "#666",
    cursor: "not-allowed",
  },

  // Button Group
  buttonGroup: {
    display: "flex",
    gap: "10px",
    justifyContent: "flex-end",
  },
  cancelButton: {
    padding: "10px 20px",
    backgroundColor: "#f5f5f5",
    color: "#666",
    border: "1px solid #ddd",
    borderRadius: "6px",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  saveButton: {
    padding: "10px 20px",
    backgroundColor: "#4CAF50",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s",
  },

  // Preview Box
  previewBox: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
    overflow: "auto",
    border: "1px solid #e8e8e8",
  },
  previewContent: {
    padding: "25px",
    fontFamily: "Georgia, serif",
    lineHeight: "1.7",
    fontSize: "12px",
    color: "#333",
  },

  // Floating Button (Mobile)
  floatingButton: {
    position: "fixed",
    bottom: "30px",
    right: "30px",
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    backgroundColor: "#2196F3",
    color: "#fff",
    border: "none",
    fontSize: "28px",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(33, 150, 243, 0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.3s",
    zIndex: "100",
  },

  // Modal
  modalBackdrop: {
    position: "fixed",
    top: "0",
    left: "0",
    right: "0",
    bottom: "0",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    display: "flex",
    alignItems: "flex-end",
    zIndex: "1000",
  },
  modalContent: {
    backgroundColor: "#fff",
    width: "100%",
    height: "90vh",
    borderRadius: "16px 16px 0 0",
    display: "flex",
    flexDirection: "column",
    animation: "slideUp 0.3s ease-out",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px",
    borderBottom: "1px solid #e8e8e8",
    backgroundColor: "#f9f9f9",
    borderRadius: "16px 16px 0 0",
  },
  modalTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#1a1a1a",
    margin: "0",
  },
  modalCloseButton: {
    background: "none",
    border: "none",
    fontSize: "24px",
    cursor: "pointer",
    color: "#666",
    padding: "0",
  },
  modalBody: {
    flex: 1,
    overflow: "auto",
    padding: "20px",
  },
};

export default styles;
