import React, { useState } from "react";
import { useNotification } from "../../../Context/NotificationContext";
import emailSenderService from "../../../dbServices/emailSenderService";
import "./EmailModelViewAndEdit.css";

export default function EmailModelViewAndEdit({ model, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: model.name,
    subject: model.subject,
    html_content: model.html_content,
  });
  const [isSaving, setIsSaving] = useState(false);

  const hasChanges =
    formData.name !== model.name ||
    formData.subject !== model.subject ||
    formData.html_content !== model.html_content;

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!hasChanges) return;

    setIsSaving(true);
    try {
      await emailSenderService.updateModel(model.id, formData);
      alert("Modelo atualizado com sucesso!", "success");
      onSuccess();
    } catch (error) {
      alert("Erro ao atualizar modelo", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="emailsender-modal-backdrop" onClick={onClose}>
      <div
        className="emailsender-modal-content view-edit-layout"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header header-with-actions">
          <div className="header-info">
            <h3>Editor de Modelo</h3>
            <span className="model-id">Modificando: {model.name}</span>
          </div>

          <div className="header-actions">
            <button type="button" className="btn-exit" onClick={onClose}>
              Sair sem salvar
            </button>
            {hasChanges && (
              <button
                type="button"
                className="btn-save-top"
                onClick={handleUpdate}
                disabled={isSaving}
              >
                {isSaving ? "Salvando..." : "Salvar Alterações"}
              </button>
            )}
          </div>
        </div>

        <div className="split-container">
          <div className="editor-side">
            <div className="editor-form-internal">
              <div className="form-row">
                <div className="form-group half">
                  <label>Nome do Modelo</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
                <div className="form-group half">
                  <label>Assunto</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="form-group flex-grow">
                <label>HTML do Template</label>
                <textarea
                  className="code-editor"
                  value={formData.html_content}
                  onChange={(e) =>
                    setFormData({ ...formData, html_content: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          <div className="preview-side">
            <div className="preview-header">
              <i className="fa-solid fa-desktop"></i> Desktop Preview
            </div>
            <div className="preview-browser-frame">
              <div className="preview-content">
                <iframe
                  title="Update Preview"
                  srcDoc={formData.html_content.replace(
                    "{{nome}}",
                    "Cliente VIP"
                  )}
                  className="preview-iframe"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
