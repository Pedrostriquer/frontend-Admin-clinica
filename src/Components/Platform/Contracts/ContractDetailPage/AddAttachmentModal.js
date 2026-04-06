import React, { useState } from "react";
import styles from "./ContractDetailPageStyle";

const AddAttachmentModal = ({ isOpen, onClose, onSubmit, isLoading }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);

  if (!isOpen) return null;

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSubmit(name, description, file);
    // Limpar campos após envio
    setName("");
    setDescription("");
    setFile(null);
  };

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h3 style={styles.modalTitle}>Novo Anexo Personalizado</h3>
        <form onSubmit={handleFormSubmit} style={styles.modalForm}>
          <div style={styles.modalSelectGroup}>
            <label style={styles.toggleLabel}>Nome do Anexo</label>
            <input
              type="text"
              placeholder="Ex: Identidade, Contrato assinado..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={styles.actionCardInput}
              required
            />
          </div>

          <div style={styles.modalSelectGroup}>
            <label style={styles.toggleLabel}>Descrição (Opcional)</label>
            <textarea
              placeholder="Notas sobre este arquivo..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{
                ...styles.actionCardInput,
                minHeight: "80px",
                resize: "none",
              }}
            />
          </div>

          <div style={styles.modalSelectGroup}>
            <label style={styles.toggleLabel}>Arquivo</label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              style={styles.actionCardInput}
              required
            />
          </div>

          <div style={styles.modalActions}>
            <button
              type="button"
              onClick={onClose}
              style={styles.buttonSecondary}
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              style={styles.buttonPrimary}
              disabled={isLoading || !file || !name}
            >
              {isLoading ? (
                <div style={styles.buttonSpinner}></div>
              ) : (
                "Salvar Anexo"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAttachmentModal;
