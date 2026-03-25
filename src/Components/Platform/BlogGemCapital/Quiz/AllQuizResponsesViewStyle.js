const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },

  // Stats Container
  statsContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "16px",
    marginBottom: "24px",
  },

  statCard: {
    backgroundColor: "#f8f9fa",
    border: "1px solid #e9ecef",
    borderRadius: "12px",
    padding: "20px",
    textAlign: "center",
    transition: "all 0.3s ease",
    cursor: "pointer",
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    },
  },

  statCardContacted: {
    borderColor: "#28a745",
    backgroundColor: "#f0f8f5",
  },

  statCardPending: {
    borderColor: "#ffc107",
    backgroundColor: "#fffbf0",
  },

  statNumber: {
    fontSize: "32px",
    fontWeight: "700",
    color: "#333",
    marginBottom: "8px",
  },

  statLabel: {
    fontSize: "13px",
    color: "#666",
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },

  // Table
  tableContainer: {
    overflowX: "auto",
    borderRadius: "12px",
    border: "1px solid #e9ecef",
    backgroundColor: "#fff",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "13px",
  },

  th: {
    backgroundColor: "#f8f9fa",
    padding: "16px 12px",
    textAlign: "left",
    fontWeight: "600",
    color: "#333",
    borderBottom: "2px solid #e9ecef",
    whiteSpace: "nowrap",
  },

  tr: {
    borderBottom: "1px solid #e9ecef",
    transition: "background-color 0.2s ease",
    "&:hover": {
      backgroundColor: "#f8f9fa",
    },
  },

  td: {
    padding: "14px 12px",
    color: "#555",
  },

  // Badges
  badge: {
    display: "inline-block",
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: "600",
    textAlign: "center",
    minWidth: "60px",
  },

  badgeContacted: {
    backgroundColor: "#d4edda",
    color: "#155724",
  },

  badgePending: {
    backgroundColor: "#fff3cd",
    color: "#856404",
  },

  // Action Buttons
  actionButton: {
    border: "none",
    backgroundColor: "#e9ecef",
    color: "#495057",
    padding: "8px 10px",
    borderRadius: "6px",
    cursor: "pointer",
    marginRight: "6px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease",
    fontSize: "12px",

    "&:hover": {
      backgroundColor: "#dee2e6",
      color: "#212529",
    },
  },

  contactButton: {
    backgroundColor: "#28a745",
    color: "#fff",

    "&:hover": {
      backgroundColor: "#218838",
    },
  },

  deleteButton: {
    backgroundColor: "#dc3545",
    color: "#fff",

    "&:hover": {
      backgroundColor: "#c82333",
    },
  },

  // Empty State
  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "60px 20px",
    textAlign: "center",
    color: "#999",
  },

  emptyIcon: {
    fontSize: "48px",
    marginBottom: "16px",
    opacity: "0.3",
  },

  emptyTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#333",
    marginBottom: "8px",
  },

  emptyText: {
    fontSize: "14px",
    color: "#999",
  },
};

export default styles;
