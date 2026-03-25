const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    width: "100vw",
    height: "100vh",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
    padding: "20px",
  },

  modal: {
    backgroundColor: "#fff",
    borderRadius: "16px",
    boxShadow: "0 10px 40px rgba(0, 0, 0, 0.2)",
    maxWidth: "90vw",
    width: "100%",
    maxHeight: "90vh",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },

  // Header
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: "24px",
    borderBottom: "1px solid #e9ecef",
    backgroundColor: "#f8f9fa",
  },

  headerContent: {
    flex: 1,
  },

  title: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#333",
    margin: "0 0 8px 0",
  },

  subtitle: {
    fontSize: "13px",
    color: "#666",
    margin: 0,
  },

  closeButton: {
    border: "none",
    backgroundColor: "transparent",
    cursor: "pointer",
    color: "#666",
    padding: "4px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "color 0.2s ease",

    "&:hover": {
      color: "#333",
    },
  },

  // Lead Info
  leadInfo: {
    padding: "20px 24px",
    backgroundColor: "#f8f9fa",
    borderBottom: "1px solid #e9ecef",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "12px",
  },

  infoRow: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },

  infoLabel: {
    fontSize: "12px",
    color: "#666",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },

  infoValue: {
    fontSize: "14px",
    color: "#333",
    fontWeight: "500",
  },

  // Content
  content: {
    flex: 1,
    padding: "24px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },

  // Progress
  progressContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  progressLabel: {
    fontSize: "12px",
    color: "#666",
    fontWeight: "600",
  },

  progressBar: {
    width: "100%",
    height: "6px",
    backgroundColor: "#e9ecef",
    borderRadius: "3px",
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#007bff",
    transition: "width 0.3s ease",
  },

  // Question
  questionContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },

  questionText: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#333",
    margin: 0,
  },

  alternativesContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  alternative: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "14px 16px",
    border: "2px solid #e9ecef",
    borderRadius: "8px",
    backgroundColor: "#fff",
    cursor: "pointer",
    transition: "all 0.2s ease",

    "&:hover": {
      borderColor: "#007bff",
      backgroundColor: "#f0f7ff",
    },
  },

  alternativeSelected: {
    borderColor: "#28a745",
    backgroundColor: "#f0f8f5",
  },

  alternativeContent: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    flex: 1,
  },

  alternativeId: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "32px",
    height: "32px",
    backgroundColor: "#007bff",
    color: "#fff",
    borderRadius: "50%",
    fontSize: "14px",
    fontWeight: "600",
    flexShrink: 0,
  },

  alternativeText: {
    fontSize: "14px",
    color: "#333",
    fontWeight: "500",
  },

  selectedCheck: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  // Navigation
  navigation: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",
  },

  navButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    padding: "10px 16px",
    border: "1px solid #dee2e6",
    backgroundColor: "#fff",
    borderRadius: "8px",
    cursor: "pointer",
    color: "#333",
    fontWeight: "600",
    fontSize: "13px",
    transition: "all 0.2s ease",

    "&:hover": {
      backgroundColor: "#f8f9fa",
      borderColor: "#adb5bd",
    },
  },

  navButtonDisabled: {
    opacity: "0.5",
    cursor: "not-allowed",

    "&:hover": {
      backgroundColor: "#fff",
      borderColor: "#dee2e6",
    },
  },

  navInfo: {
    fontSize: "13px",
    color: "#666",
    fontWeight: "600",
    minWidth: "60px",
    textAlign: "center",
  },

  // No Content
  noContent: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#999",
    fontSize: "14px",
    padding: "40px 24px",
  },

  // Footer
  footer: {
    display: "flex",
    gap: "12px",
    padding: "16px 24px",
    borderTop: "1px solid #e9ecef",
    backgroundColor: "#f8f9fa",
    justifyContent: "flex-end",
  },

  contactButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    padding: "10px 16px",
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "13px",
    transition: "all 0.2s ease",

    "&:hover": {
      backgroundColor: "#218838",
    },
  },

  closeFooterButton: {
    padding: "10px 20px",
    backgroundColor: "#e9ecef",
    color: "#333",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "13px",
    transition: "all 0.2s ease",

    "&:hover": {
      backgroundColor: "#dee2e6",
    },
  },
};

export default styles;
