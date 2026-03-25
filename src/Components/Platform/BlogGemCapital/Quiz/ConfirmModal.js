import React from "react";
import styles from "./ModalStyles";

const ConfirmModal = ({
  isOpen,
  title,
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  onConfirm,
  onCancel,
  danger = false
}) => {
  if (!isOpen) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        {/* Header */}
        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}>{title}</h2>
        </div>

        {/* Content */}
        <div style={styles.modalContent}>
          <p style={styles.modalMessage}>{message}</p>
        </div>

        {/* Footer */}
        <div style={styles.modalFooter}>
          <button
            style={styles.cancelBtn}
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button
            style={{
              ...styles.confirmBtn,
              ...(danger && styles.dangerBtn)
            }}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
