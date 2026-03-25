const styles = {
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },

  modal: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    boxShadow: "0 10px 40px rgba(0, 0, 0, 0.2)",
    maxWidth: "450px",
    width: "90%",
    overflow: "hidden",
    animation: "slideIn 0.3s ease-out",
  },

  modalHeader: {
    padding: "24px",
    borderBottom: "1px solid #e5e7eb",
    backgroundColor: "#f9fafb",
  },

  modalTitle: {
    margin: 0,
    fontSize: "20px",
    fontWeight: "600",
    color: "#1a3a52",
  },

  modalContent: {
    padding: "24px",
  },

  modalMessage: {
    margin: 0,
    fontSize: "14px",
    color: "#666",
    lineHeight: "1.6",
  },

  modalFooter: {
    padding: "16px 24px",
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
    borderTop: "1px solid #e5e7eb",
    backgroundColor: "#f9fafb",
  },

  confirmBtn: {
    padding: "10px 20px",
    backgroundColor: "#1a3a52",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s ease",
    ":hover": {
      backgroundColor: "#122C4F",
    },
  },

  dangerBtn: {
    backgroundColor: "#dc2626",
    ":hover": {
      backgroundColor: "#b91c1c",
    },
  },

  cancelBtn: {
    padding: "10px 20px",
    backgroundColor: "#fff",
    color: "#666",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
};

export default styles;
