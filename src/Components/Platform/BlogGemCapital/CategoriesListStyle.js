const getResponsiveGridColumns = (width) => {
  if (width < 640) return "1fr";
  if (width < 1024) return "repeat(2, 1fr)";
  return "repeat(auto-fill, minmax(300px, 1fr))";
};

const getResponsiveGap = (width) => {
  if (width < 640) return "12px";
  if (width < 1024) return "16px";
  return "20px";
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
  categoriesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "20px",
    marginBottom: "20px",
    animation: "fadeIn 0.6s ease",
  },
  categoryCard: {
    backgroundColor: "white",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
    transition: "all 0.3s ease",
    border: "1px solid #e0e6ed",
    cursor: "pointer",
    animation: "slideUp 0.5s ease",
  },
  categoryCardHover: {
    transform: "translateY(-4px)",
    boxShadow: "0 12px 24px rgba(0,0,0,0.12)",
  },
  colorAccent: {
    height: "4px",
    width: "100%",
  },
  categoryBody: {
    padding: "20px",
  },
  categoryHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "12px",
    gap: "12px",
  },
  categoryName: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#122C4F",
    margin: "0 0 4px 0",
    letterSpacing: "-0.3px",
  },
  categorySlug: {
    fontSize: "12px",
    fontWeight: "500",
    margin: "0",
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
  badgeActive: {
    backgroundColor: "rgba(34, 197, 94, 0.1)",
    color: "#15803d",
  },
  badgeInactive: {
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    color: "#b91c1c",
  },
  description: {
    fontSize: "13px",
    color: "#666",
    margin: "0 0 12px 0",
    lineHeight: "1.4",
  },
  categoryInfo: {
    display: "flex",
    gap: "16px",
    padding: "12px 0",
    borderTop: "1px solid #e0e6ed",
    borderBottom: "1px solid #e0e6ed",
    marginBottom: "12px",
  },
  infoItem: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  infoLabel: {
    fontSize: "11px",
    color: "#8892a0",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.3px",
  },
  infoValue: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#122C4F",
  },
  actionsContainer: {
    display: "flex",
    gap: "8px",
  },
  editButton: {
    flex: 1,
    padding: "10px 12px",
    backgroundColor: "#f0f3f8",
    color: "#122C4F",
    border: "1px solid #e0e6ed",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "600",
    transition: "all 0.2s ease",
  },
  editButtonDisabled: {
    opacity: 0.6,
    cursor: "not-allowed",
  },
  deleteButton: {
    flex: 1,
    padding: "10px 12px",
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    color: "#dc3545",
    border: "1px solid rgba(239, 68, 68, 0.3)",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "600",
    transition: "all 0.2s ease",
  },
  deleteButtonDisabled: {
    opacity: 0.8,
    cursor: "not-allowed",
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
};

export { getResponsiveGridColumns, getResponsiveGap };
export default styles;
