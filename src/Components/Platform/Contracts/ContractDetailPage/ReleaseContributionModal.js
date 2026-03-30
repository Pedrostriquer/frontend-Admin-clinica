import React from "react";

const formatCurrency = (v) =>
  (v || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const ReleaseContributionModal = ({
  isOpen,
  onClose,
  onConfirm,
  amount,
  isReleasing,
}) => {
  if (!isOpen) return null;

  return (
    <div style={modalStyles.overlay} onClick={() => !isReleasing && onClose()}>
      <div style={modalStyles.content} onClick={(e) => e.stopPropagation()}>
        <div style={modalStyles.iconContainer}>
          <i className="fa-solid fa-hand-holding-dollar"></i>
        </div>

        <h3 style={modalStyles.title}>Liberar Aporte</h3>

        <p style={modalStyles.description}>
          Deseja liberar o valor de <strong>{formatCurrency(amount)}</strong>{" "}
          para o saldo disponível do cliente?
          <br />
          <span style={modalStyles.subtext}>
            Esta ação creditará o valor no balance do usuário imediatamente.
          </span>
        </p>

        <div style={modalStyles.actions}>
          <button
            onClick={onClose}
            style={modalStyles.cancelBtn}
            disabled={isReleasing}
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            style={modalStyles.confirmBtn}
            disabled={isReleasing}
          >
            {isReleasing ? (
              <div style={modalStyles.spinner}></div>
            ) : (
              "Confirmar Liberação"
            )}
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
    maxWidth: "420px",
    width: "90%",
    textAlign: "center",
    boxShadow:
      "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    animation: "modalZoomIn 0.3s ease-out forwards",
  },
  iconContainer: {
    width: "70px",
    height: "70px",
    backgroundColor: "#dcfce7",
    color: "#22c55e",
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
    marginBottom: "30px",
  },
  subtext: {
    fontSize: "12px",
    opacity: 0.7,
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
    backgroundColor: "#22c55e",
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

export default ReleaseContributionModal;
