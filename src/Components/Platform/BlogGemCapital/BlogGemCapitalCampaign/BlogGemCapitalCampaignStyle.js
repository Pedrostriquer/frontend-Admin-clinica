export const styles = {
  container: {
    padding: "100px 30px 40px 30px",
    background: "#f8fafc",
    minHeight: "100vh",
  },
  pageHeader: {
    marginBottom: "30px",
  },
  pageTitle: {
    fontSize: "28px",
    color: "#1e293b",
    margin: "0 0 5px 0",
    fontWeight: "700",
  },
  pageSubtitle: {
    fontSize: "14px",
    color: "#64748b",
    margin: 0,
  },
  mainLayout: {
    display: "flex",
    gap: "40px",
    alignItems: "flex-start",
    width: "100%",
  },
  configColumn: {
    flex: "0 0 50%",
    display: "flex",
    flexDirection: "column",
    gap: "25px",
  },
  previewColumn: {
    flex: "0 0 50%",
    position: "sticky",
    top: "100px",
    maxWidth: "calc(50% - 40px)",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    fontSize: "11px",
    fontWeight: "700",
    color: "#94a3b8",
    letterSpacing: "0.5px",
  },
  input: {
    padding: "12px 16px",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
    fontSize: "14px",
    color: "#1e293b",
    outline: "none",
    background: "#fff",
  },
  helperText: {
    fontSize: "12px",
    color: "#94a3b8",
    marginTop: "4px",
  },
  selectionCard: {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
  },
  selectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "15px",
  },
  selectionTitle: {
    fontSize: "16px",
    margin: "0 0 4px 0",
    color: "#1e293b",
  },
  selectionDesc: {
    fontSize: "13px",
    color: "#64748b",
    margin: 0,
  },
  btnToggle: {
    padding: "8px 16px",
    borderRadius: "6px",
    border: "1px solid #e2e8f0",
    background: "#f8fafc",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  autoBadge: {
    padding: "12px",
    background: "#f1f5f9",
    borderRadius: "8px",
    fontSize: "12px",
    color: "#475569",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  manualSelectionArea: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    marginTop: "10px",
  },
  manualField: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  manualLabel: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#334155",
  },
  optionalText: {
    fontSize: "12px",
    fontWeight: "400",
    color: "#94a3b8",
  },
  select: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #cbd5e1",
    background: "#fff",
    fontSize: "14px",
    color: "#1e293b",
    outline: "none",
    cursor: "pointer",
    flex: 1,
  },
  fieldWithButton: {
    display: "flex",
    gap: "8px",
    alignItems: "center",
  },
  btnBuscar: {
    padding: "10px 12px",
    borderRadius: "8px",
    border: "1px solid #cbd5e1",
    background: "#f8fafc",
    color: "#6366f1",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "14px",
    transition: "all 0.2s ease",
    flexShrink: 0,
  },
  selectedText: {
    display: "block",
    marginTop: "4px",
    fontSize: "12px",
    color: "#10b981",
    fontWeight: "500",
  },
  actions: {
    display: "flex",
    gap: "12px",
    marginTop: "10px",
  },
  btnSave: {
    background: "#1e293b",
    color: "#fff",
    padding: "12px 24px",
    borderRadius: "8px",
    border: "none",
    fontWeight: "600",
    cursor: "pointer",
  },
  btnSecondary: {
    background: "#fff",
    border: "1px solid #e2e8f0",
    padding: "12px 20px",
    borderRadius: "8px",
    fontWeight: "600",
    cursor: "pointer",
  },
  btnCancel: {
    background: "transparent",
    border: "none",
    color: "#64748b",
    padding: "12px 10px",
    fontWeight: "600",
    cursor: "pointer",
  },
  summaryHeader: {
    marginBottom: "20px",
  },
  summaryTitle: {
    fontSize: "18px",
    margin: "0 0 15px 0",
    color: "#1e293b",
  },
  tagAuto: {
    background: "#fef3c7",
    color: "#92400e",
    padding: "4px 10px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: "700",
  },
  tagManual: {
    background: "#dcfce7",
    color: "#166534",
    padding: "4px 10px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: "700",
  },
  summaryItem: {
    fontSize: "13px",
    color: "#64748b",
    margin: "0 0 8px 0",
  },
  emailContainer: {
    background: "#fff",
    borderRadius: "10px",
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
    overflow: "hidden",
    border: "1px solid #e2e8f0",
  },
  browserHeader: {
    background: "#f1f5f9",
    padding: "10px 15px",
    display: "flex",
    gap: "6px",
  },
  dot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
  },
};

export const emailPreviewStyles = `
  .email-body {
    font-family: 'Helvetica', Arial, sans-serif;
    background: #fff;
    max-height: 700px;
    overflow-y: auto;
  }
  .email-header {
    background: #0f172a;
    padding: 20px;
    text-align: center;
  }
  .email-content {
    padding: 30px;
  }
  .category-label {
    display: block;
    font-size: 11px;
    font-weight: 700;
    color: #f59e0b;
    margin-bottom: 5px;
    letter-spacing: 1px;
  }
  .date-label {
    display: block;
    font-size: 11px;
    color: #94a3b8;
    margin-bottom: 15px;
  }
  .hero-title {
    font-size: 24px;
    color: #0f172a;
    line-height: 1.2;
    margin-bottom: 15px;
    font-weight: 800;
  }
  .hero-excerpt {
    font-size: 14px;
    color: #475569;
    line-height: 1.6;
    margin-bottom: 20px;
  }
  .hero-image {
    width: 100%;
    border-radius: 8px;
    margin-bottom: 25px;
  }
  .btn-read-more {
    background: #c4a47c;
    color: white;
    border: none;
    padding: 12px 30px;
    border-radius: 30px;
    font-weight: 700;
    font-size: 12px;
    cursor: pointer;
    margin-bottom: 40px;
  }
  .divider {
    height: 1px;
    background: #e2e8f0;
    margin: 40px 0;
  }
  .section-title {
    font-size: 12px;
    font-weight: 800;
    color: #c4a47c;
    margin-bottom: 25px;
    letter-spacing: 1px;
  }
  .secondary-post {
    display: flex;
    gap: 15px;
    margin-bottom: 25px;
  }
  .post-thumb {
    width: 80px;
    height: 60px;
    border-radius: 4px;
    object-fit: cover;
  }
  .post-info {
    flex: 1;
  }
  .post-category {
    font-size: 10px;
    font-weight: 700;
    color: #f59e0b;
    display: block;
    margin-bottom: 3px;
  }
  .post-title {
    font-size: 13px;
    color: #0f172a;
    margin: 0 0 5px 0;
    line-height: 1.4;
  }
  .post-link {
    font-size: 11px;
    color: #64748b;
    font-weight: 600;
  }
  .email-footer {
    background: #0f172a;
    padding: 40px 30px;
    color: #94a3b8;
    text-align: center;
    font-size: 11px;
  }
  .email-footer img {
    width: 60px;
    height: 60px;
    margin-bottom: 20px;
  }
  .email-footer p {
    margin: 8px 0;
    line-height: 1.6;
  }
  .email-footer a {
    color: #C9A96E;
    text-decoration: none;
    font-weight: 600;
  }
  .email-footer a:hover {
    text-decoration: underline;
  }
`;

export const spinnerStyles = `
  @keyframes spin { to { transform: rotate(360deg); } }
`;
