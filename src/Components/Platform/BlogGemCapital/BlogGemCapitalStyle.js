const styles = {
  container: {
    padding: "80px 40px 40px 40px",
    backgroundColor: "#f8f9fc",
    minHeight: "100vh",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  header: {
    marginBottom: "40px",
    animation: "slideDown 0.6s ease",
  },
  title: {
    fontSize: "32px",
    fontWeight: "700",
    color: "#122C4F",
    margin: "0 0 8px 0",
    letterSpacing: "-0.5px",
  },
  subtitle: {
    fontSize: "15px",
    color: "#8892a0",
    margin: 0,
    fontWeight: "400",
  },
  tabsContainer: {
    display: "flex",
    gap: "20px",
    marginBottom: "30px",
    borderBottom: "1px solid #e0e6ed",
    paddingBottom: "0",
    animation: "slideUp 0.6s ease 0.1s both",
  },
  tabButton: {
    padding: "14px 20px",
    fontSize: "14px",
    fontWeight: "600",
    backgroundColor: "transparent",
    color: "#8892a0",
    border: "none",
    borderBottom: "3px solid transparent",
    cursor: "pointer",
    transition: "all 0.3s ease",
    position: "relative",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  tabButtonActive: {
    color: "#122C4F",
    borderBottomColor: "#C9A96E",
  },
  contentArea: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "30px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
    animation: "fadeIn 0.6s ease 0.2s both",
  },
};

export default styles;
