import React, { useState } from "react";
import styles from "./ContractDetailPageStyle";

const ModalAlterarTaxa = ({
  isOpen,
  onClose,
  onConfirm,
  currentRate,
  isLoading,
}) => {
  const [newRate, setNewRate] = useState(currentRate);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const rate = parseFloat(newRate);
    if (isNaN(rate) || rate <= 0) {
      alert("Por favor, insira uma taxa válida maior que zero.");
      return;
    }
    onConfirm(rate);
  };

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h3 style={styles.modalTitle}>Alterar Taxa de Valorização</h3>
        <p style={{ fontSize: "14px", color: "#64748b", marginBottom: "20px" }}>
          A alteração da taxa recalculará o Valor Teto proporcionalmente ao
          tempo restante do contrato.
        </p>
        <form onSubmit={handleSubmit} style={styles.modalForm}>
          <div style={styles.modalSelectGroup}>
            <label>Nova Taxa Mensal (% a.m.)</label>
            <input
              type="number"
              step="0.01"
              value={newRate}
              onChange={(e) => setNewRate(e.target.value)}
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
              {isLoading ? "Processando..." : "Confirmar Alteração"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalAlterarTaxa;
