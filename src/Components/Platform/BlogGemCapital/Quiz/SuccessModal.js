import React, { useEffect } from "react";
import styles from "./ModalStyles";

const SuccessModal = ({
  isOpen,
  title,
  message,
  onClose,
  autoClose = 2000
}) => {
  useEffect(() => {
    if (isOpen && autoClose) {
      const timer = setTimeout(onClose, autoClose);
      return () => clearTimeout(timer);
    }
  }, [isOpen, autoClose, onClose]);

  if (!isOpen) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        {/* Header */}
        <div style={{ ...styles.modalHeader, borderLeftWidth: "4px", borderLeftColor: "#10b981", backgroundColor: "#f0fdf4" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "24px" }}>✅</span>
            <h2 style={styles.modalTitle}>{title}</h2>
          </div>
        </div>

        {/* Content */}
        <div style={styles.modalContent}>
          <p style={styles.modalMessage}>{message}</p>
        </div>

        {/* Footer */}
        <div style={styles.modalFooter}>
          <button
            style={styles.confirmBtn}
            onClick={onClose}
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
