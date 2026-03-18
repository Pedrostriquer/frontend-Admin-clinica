const getResponsiveTablePadding = (width) => {
  if (width < 640) return "8px";
  if (width < 1024) return "12px";
  return "16px";
};

const getResponsiveTableFontSize = (width) => {
  if (width < 640) return "12px";
  return "14px";
};

const getResponsiveHeadingSize = (width) => {
  if (width < 640) return "18px";
  return "22px";
};

const styles = {
  container: {
    width: "100%",
  },
  listHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
    gap: "20px",
    flexWrap: "wrap",
  },
  heading: {
    fontSize: "22px",
    fontWeight: "700",
    color: "#122C4F",
    margin: 0,
    letterSpacing: "-0.3px",
  },
  createButton: {
    padding: "12px 24px",
    backgroundColor: "#122C4F",
    backgroundImage: "linear-gradient(135deg, #122C4F 0%, #1a3a66 100%)",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    whiteSpace: "nowrap",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 12px rgba(18, 44, 79, 0.2)",
    minWidth: "150px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  tableContainer: {
    overflowX: "auto",
    backgroundColor: "white",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
    border: "1px solid #e0e6ed",
    animation: "fadeIn 0.6s ease",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "14px",
  },
  tableHeader: {
    backgroundColor: "#f8f9fb",
    borderBottom: "2px solid #e0e6ed",
  },
  tableHeaderCell: {
    padding: "16px",
    textAlign: "left",
    fontWeight: "600",
    color: "#122C4F",
    fontSize: "13px",
    textTransform: "uppercase",
    letterSpacing: "0.3px",
  },
  tableRow: {
    borderBottom: "1px solid #e0e6ed",
    transition: "background-color 0.2s ease",
  },
  tableRowHover: {
    backgroundColor: "#f8f9fb",
  },
  tableCell: {
    padding: "16px",
    color: "#555",
    verticalAlign: "middle",
  },
  pixelName: {
    fontWeight: "600",
    color: "#122C4F",
  },
  badge: {
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.3px",
    whiteSpace: "nowrap",
  },
  badgeType: {
    backgroundColor: "rgba(59, 130, 246, 0.1)",
    color: "#3b82f6",
  },
  badgePlacementHead: {
    backgroundColor: "rgba(34, 197, 94, 0.1)",
    color: "#15803d",
  },
  badgePlacementBody: {
    backgroundColor: "rgba(245, 158, 11, 0.1)",
    color: "#b45309",
  },
  badgeActive: {
    backgroundColor: "rgba(34, 197, 94, 0.1)",
    color: "#15803d",
  },
  badgeInactive: {
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    color: "#b91c1c",
  },
  priorityBadge: {
    padding: "4px 10px",
    borderRadius: "4px",
    backgroundColor: "#f0f3f8",
    color: "#122C4F",
    fontWeight: "600",
    fontSize: "12px",
  },
  actionsContainer: {
    display: "flex",
    gap: "8px",
  },
  actionButton: {
    padding: "8px 16px",
    backgroundColor: "#f0f3f8",
    color: "#122C4F",
    border: "1px solid #e0e6ed",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "600",
    transition: "all 0.2s ease",
  },
  actionButtonHover: {
    backgroundColor: "#e0e6ed",
  },
  deleteButton: {
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    color: "#dc3545",
    border: "1px solid rgba(239, 68, 68, 0.3)",
  },
  deleteButtonHover: {
    backgroundColor: "rgba(239, 68, 68, 0.15)",
  },
  toggleButton: {
    padding: "8px 16px",
    backgroundColor: "transparent",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "600",
    transition: "all 0.2s ease",
  },
  emptyState: {
    textAlign: "center",
    padding: "60px 20px",
    color: "#8892a0",
  },
  emptyIcon: {
    fontSize: "36px",
    marginBottom: "16px",
    opacity: "0.5",
    fontWeight: "300",
  },
  loadingContainer: {
    textAlign: "center",
    padding: "60px 40px",
  },
  loadingSpinner: {
    display: "inline-block",
    width: "40px",
    height: "40px",
    border: "4px solid #e0e6ed",
    borderTop: "4px solid #122C4F",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    marginBottom: "16px",
  },
  loadingText: {
    fontSize: "15px",
    color: "#8892a0",
    fontWeight: "500",
  },
  actionButtonDisabled: {
    opacity: 0.6,
    cursor: "not-allowed",
  },
};

export { getResponsiveTablePadding, getResponsiveTableFontSize, getResponsiveHeadingSize };
export default styles;
