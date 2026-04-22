import React, { useState } from "react";
import styles from "./ContractDetailPageStyle";

const ModalAdicionarAporte = ({ isOpen, onClose, onConfirm, isLoading }) => {
  const [amount, setAmount] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const value = parseFloat(amount.replace(",", "."));
    if (isNaN(value) || value <= 0) {
      alert("Por favor, insira um valor de aporte válido.");
      return;
    }
    onConfirm(value);
  };

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h3 style={styles.modalTitle}>Adicionar Aporte Extra</h3>
        <p style={{ fontSize: "14px", color: "#64748b", marginBottom: "20px" }}>
          Este valor será somado ao capital investido e o Valor Teto será
          ajustado com base no rendimento pro-rata restante.
        </p>
        <form onSubmit={handleSubmit} style={styles.modalForm}>
          <div style={styles.modalSelectGroup}>
            <label>Valor do Aporte (R$)</label>
            <input
              type="text"
              placeholder="0,00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              style={styles.actionCardInput}
              disabled={isLoading}
              required
            />
          </div>
          <div style={styles.modalActions}>
            <button
              type="button"
              onClick={onClose}
              style={{ ...styles.actionCardButton, ...styles.buttonSecondary }}
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              style={{ ...styles.actionCardButton, ...styles.buttonPrimary }}
              disabled={isLoading}
            >
              {isLoading ? "Processando..." : "Confirmar Aporte"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalAdicionarAporte;
