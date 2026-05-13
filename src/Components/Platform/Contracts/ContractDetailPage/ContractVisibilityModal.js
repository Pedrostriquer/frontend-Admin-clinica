import React from "react";

const ContractVisibilityModal = ({
  isOpen,
  onClose,
  onConfirm,
  willBeVisible,
  isSaving,
}) => {
  if (!isOpen) return null;

  const isHiding = !willBeVisible;

  const icon = isHiding ? "fa-eye-slash" : "fa-eye";
  const iconBg = isHiding ? "#fee2e2" : "#dcfce7";
  const iconColor = isHiding ? "#ef4444" : "#22c55e";
  const confirmBg = isHiding ? "#ef4444" : "#22c55e";
  const title = isHiding
    ? "Ocultar contrato do cliente?"
    : "Tornar contrato visível ao cliente?";
  const description = isHiding
    ? "O cliente deixará de ver este contrato no sistema, no relatório de IR e na listagem dele. O contrato continuará valorizando normalmente."
    : "O cliente voltará a enxergar este contrato na listagem, no relatório de IR e nos detalhes.";
  const confirmText = isHiding
    ? "Sim, ocultar do cliente"
    : "Sim, tornar visível";

  return (
    <div style={modalStyles.overlay} onClick={() => !isSaving && onClose()}>
      <div style={modalStyles.content} onClick={(e) => e.stopPropagation()}>
        <div
          style={{
            ...modalStyles.iconContainer,
            backgroundColor: iconBg,
            color: iconColor,
          }}
        >
          <i className={`fa-solid ${icon}`}></i>
        </div>

        <h3 style={modalStyles.title}>{title}</h3>

        <p style={modalStyles.description}>{description}</p>

        <div style={modalStyles.actions}>
          <button
            onClick={onClose}
            style={modalStyles.cancelBtn}
            disabled={isSaving}
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            style={{ ...modalStyles.confirmBtn, backgroundColor: confirmBg }}
            disabled={isSaving}
          >
            {isSaving ? <div style={modalStyles.spinner}></div> : confirmText}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes modalZoomIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

const modalStyles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(15, 23, 42, 0.7)",
    backdropFilter: "blur(4px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
  },
  content: {
    backgroundColor: "#fff",
    padding: "40px",
    borderRadius: "24px",
    maxWidth: "440px",
    width: "90%",
    textAlign: "center",
    boxShadow:
      "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    animation: "modalZoomIn 0.3s ease-out forwards",
  },
  iconContainer: {
    width: "70px",
    height: "70px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "30px",
    margin: "0 auto 20px auto",
  },
  title: {
    fontSize: "22px",
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: "12px",
    margin: 0,
  },
  description: {
    fontSize: "15px",
    color: "#64748b",
    lineHeight: "1.6",
    marginTop: "12px",
    marginBottom: "30px",
  },
  actions: {
    display: "flex",
    gap: "12px",
  },
  cancelBtn: {
    flex: 1,
    padding: "14px",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    backgroundColor: "#fff",
    color: "#64748b",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  confirmBtn: {
    flex: 1,
    padding: "14px",
    borderRadius: "12px",
    border: "none",
    color: "#fff",
    fontWeight: "600",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s",
  },
  spinner: {
    width: "20px",
    height: "20px",
    border: "3px solid rgba(255,255,255,0.3)",
    borderTopColor: "#fff",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
};

export default ContractVisibilityModal;
