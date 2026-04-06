import React, { useState, useEffect } from "react";
import styles from "./ContractDetailPageStyle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";

const ViewAttachmentModal = ({
  isOpen,
  onClose,
  attachment,
  onUpdate,
  onDelete,
  isLoading,
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (attachment) {
      setName(attachment.name || "");
      setDescription(attachment.description || "");
    }
  }, [attachment, isOpen]);

  if (!isOpen || !attachment) return null;

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h3 style={styles.modalTitle}>Detalhes do Anexo</h3>

        <div style={styles.modalForm}>
          <div style={styles.modalSelectGroup}>
            <label style={styles.toggleLabel}>Nome do Anexo</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={styles.actionCardInput}
            />
          </div>

          <div style={styles.modalSelectGroup}>
            <label style={styles.toggleLabel}>Descrição</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{
                ...styles.actionCardInput,
                minHeight: "80px",
                resize: "none",
              }}
            />
          </div>

          <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
            <button
              type="button"
              onClick={() => window.open(attachment.fileUrl, "_blank")}
              style={{ ...styles.buttonSecondary, flex: 1 }}
            >
              <FontAwesomeIcon icon={faExternalLinkAlt} /> Abrir Arquivo
            </button>

            <button
              type="button"
              onClick={() => onDelete(attachment.id)}
              style={{ ...styles.buttonDanger, width: "50px" }}
              title="Excluir Anexo"
            >
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </div>

          <div style={styles.modalActions}>
            <button
              type="button"
              onClick={onClose}
              style={styles.buttonSecondary}
            >
              Fechar
            </button>
            <button
              type="button"
              onClick={() => onUpdate(attachment.id, name, description)}
              style={styles.buttonPrimary}
              disabled={isLoading}
            >
              {isLoading ? (
                <div style={styles.buttonSpinner}></div>
              ) : (
                "Salvar Alterações"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewAttachmentModal;
