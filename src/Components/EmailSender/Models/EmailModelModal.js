import React, { useState } from "react";
import { useNotification } from "../../../Context/NotificationContext";
import emailSenderService from "../../../dbServices/emailSenderService";
import "./EmailModelModal.css";

export default function EmailModelModal({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    html_content: "",
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await emailSenderService.createModel(formData);
      alert("Modelo criado com sucesso!", "success");
      onSuccess();
    } catch (error) {
      alert("Erro ao salvar modelo", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="emailsender-modal-backdrop" onClick={onClose}>
      <div
        className="emailsender-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3>Editor de Modelo de E-mail</h3>
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="split-container">
          <div className="editor-side">
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label>Nome Interno</label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Assunto</label>
                <input
                  required
                  type="text"
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                />
              </div>

              <div className="form-group flex-grow">
                <label>Conteúdo HTML</label>
                <textarea
                  required
                  className="code-editor"
                  value={formData.html_content}
                  onChange={(e) =>
                    setFormData({ ...formData, html_content: e.target.value })
                  }
                />
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={onClose}>
                  Cancelar
                </button>
                <button type="submit" className="btn-save" disabled={isSaving}>
                  {isSaving ? "Salvando..." : "Criar Modelo"}
                </button>
              </div>
            </form>
          </div>

          <div className="preview-side">
            <div className="preview-header">
              <i className="fa-solid fa-eye"></i> Visualização em tempo real
            </div>
            <div className="preview-browser-frame">
              <div className="preview-content">
                {formData.html_content ? (
                  <iframe
                    title="Preview"
                    srcDoc={formData.html_content.replace(
                      "{{nome}}",
                      "Investidor Brilhante"
                    )}
                    className="preview-iframe"
                  />
                ) : (
                  <div className="preview-empty">
                    Aguardando código HTML para renderizar...
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
