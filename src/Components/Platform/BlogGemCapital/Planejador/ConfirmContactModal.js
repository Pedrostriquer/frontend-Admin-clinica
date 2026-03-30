import React from "react";
import { AlertCircle, CheckCircle, Circle } from "lucide-react";

const ConfirmContactModal = ({ isOpen, onConfirm, onCancel, leadName, isMarking }) => {
  if (!isOpen) return null;

  const styles = {
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 9999,
    },
    modal: {
      backgroundColor: "#ffffff",
      borderRadius: "16px",
      padding: "32px",
      maxWidth: "450px",
      width: "90%",
      boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15)",
      animation: "slideIn 0.3s ease-out",
    },
    header: {
      display: "flex",
      alignItems: "center",
      gap: "16px",
      marginBottom: "20px",
    },
    iconContainer: {
      width: "56px",
      height: "56px",
      borderRadius: "12px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: isMarking ? "#10b98115" : "#ef444415",
    },
    title: {
      fontSize: "20px",
      fontWeight: "700",
      color: "#0f172a",
      margin: "0",
    },
    subtitle: {
      fontSize: "13px",
      color: "#64748b",
      margin: "4px 0 0 0",
      fontWeight: "500",
    },
    content: {
      fontSize: "15px",
      color: "#475569",
      lineHeight: "1.6",
      marginBottom: "28px",
    },
    buttonGroup: {
      display: "flex",
      gap: "12px",
      justifyContent: "flex-end",
    },
    button: {
      padding: "10px 20px",
      border: "none",
      borderRadius: "8px",
      fontSize: "14px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.3s ease",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    buttonCancel: {
      backgroundColor: "#f1f5f9",
      color: "#64748b",
    },
    buttonConfirm: {
      backgroundColor: isMarking ? "#10b981" : "#6366f1",
      color: "#ffffff",
    },
  };

  return (
    <>
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
      <div style={styles.overlay} onClick={onCancel}>
        <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
          <div style={styles.header}>
            <div style={styles.iconContainer}>
              {isMarking ? (
                <CheckCircle size={32} color="#10b981" />
              ) : (
                <Circle size={32} color="#6366f1" />
              )}
            </div>
            <div>
              <h2 style={styles.title}>
                {isMarking
                  ? "Marcar como Contactado?"
                  : "Desmarcar como Contactado?"}
              </h2>
              <p style={styles.subtitle}>{leadName}</p>
            </div>
          </div>

          <p style={styles.content}>
            {isMarking
              ? `Você tem certeza que deseja marcar "${leadName}" como contactado? Você poderá desmarcar depois se necessário.`
              : `Você tem certeza que deseja desmarcar "${leadName}" como não contactado? Isso reverterá o status anterior.`}
          </p>

          <div style={styles.buttonGroup}>
            <button
              style={styles.buttonCancel}
              onClick={onCancel}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#e2e8f0";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "#f1f5f9";
              }}
            >
              Cancelar
            </button>
            <button
              style={styles.buttonConfirm}
              onClick={onConfirm}
              onMouseEnter={(e) => {
                e.target.style.opacity = "0.9";
              }}
              onMouseLeave={(e) => {
                e.target.style.opacity = "1";
              }}
            >
              {isMarking ? (
                <>
                  <CheckCircle size={16} />
                  Marcar
                </>
              ) : (
                <>
                  <Circle size={16} />
                  Desmarcar
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmContactModal;
