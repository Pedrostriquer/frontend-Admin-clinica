import React, { useState, useRef } from "react";
import "./CreatePopUpModal.css";
import FormModel from "./Forms/FormModel";
import popUpService from "../../dbServices/popUpService";
import { useLoad } from "../../Context/LoadContext";

const CreatePopUpModal = ({ onClose, onSave }) => {
  const [name, setName] = useState("");
  const [htmlContent, setHtmlContent] = useState(
    "<h2>Olá!</h2>\n<p>Assine nossa newsletter:</p>\n{{FORM}}"
  );
  const [displayDelaySeconds, setDisplayDelaySeconds] = useState(5);
  const [displayLocation, setDisplayLocation] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [showFormBuilder, setShowFormBuilder] = useState(false);
  const [activeTab, setActiveTab] = useState("config");
  const [formSchema, setFormSchema] = useState([
    {
      id: "1",
      label: "Nome",
      fieldType: "input",
      type: "text",
      required: true,
    },
    {
      id: "2",
      label: "E-mail",
      fieldType: "input",
      type: "email",
      required: true,
    },
  ]);

  const { startLoading, stopLoading } = useLoad();
  const textareaRef = useRef(null);

  const insertFormShortcode = () => {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const before = htmlContent.substring(0, start);
    const after = htmlContent.substring(end, htmlContent.length);
    setHtmlContent(before + "{{FORM}}" + after);
  };

  const addFormField = (type) => {
    const newField = {
      id: Date.now().toString(),
      label: type === "input" ? "Novo Campo" : "Nova Mensagem",
      fieldType: type,
      type: "text",
      required: false,
      placeholder: "",
    };
    setFormSchema([...formSchema, newField]);
  };

  const updateField = (id, key, value) => {
    setFormSchema(
      formSchema.map((f) => (f.id === id ? { ...f, [key]: value } : f))
    );
  };

  const removeField = (id) => {
    setFormSchema(formSchema.filter((f) => f.id !== id));
  };

  const handleSave = async () => {
    if (!name) {
      alert("Dê um nome à campanha");
      return;
    }
    startLoading();
    try {
      const payload = {
        name,
        contentHtml: htmlContent,
        displayDelaySeconds: parseInt(displayDelaySeconds),
        displayLocation: parseInt(displayLocation),
        isActive,
        formSchema: showFormBuilder ? formSchema : null,
      };
      await popUpService.createPopUp(payload);
      alert("PopUp criado com sucesso!");
      onSave();
      onClose();
    } catch (error) {
      alert("Erro ao salvar PopUp");
    } finally {
      stopLoading();
    }
  };

  const renderPreview = () => {
    const parts = htmlContent.split("{{FORM}}");
    return (
      <div className="pu-preview-frame">
        <div dangerouslySetInnerHTML={{ __html: parts[0] }} />
        {showFormBuilder && parts.length > 1 && (
          <div className="pu-preview-form-wrapper">
            <FormModel
              initialSchema={formSchema}
              isAdmin={true}
              onSchemaChange={(newSchema) => setFormSchema(newSchema)}
            />
          </div>
        )}
        {parts.length > 1 && (
          <div dangerouslySetInnerHTML={{ __html: parts[1] }} />
        )}
      </div>
    );
  };

  return (
    <div className="pu-create-overlay">
      <div className="pu-create-window">
        <div className="pu-mobile-tabs">
          <button
            className={activeTab === "config" ? "active" : ""}
            onClick={() => setActiveTab("config")}
          >
            Configuração
          </button>
          <button
            className={activeTab === "preview" ? "active" : ""}
            onClick={() => setActiveTab("preview")}
          >
            Visualização
          </button>
        </div>

        <div
          className={`pu-create-sidebar ${
            activeTab === "config" ? "show-mobile" : "hide-mobile"
          }`}
        >
          <div className="pu-sidebar-header">
            <i className="fa-solid fa-wand-magic-sparkles"></i>
            <h2>Novo PopUp</h2>
          </div>

          <div className="pu-config-scroll">
            <div className="pu-input-group">
              <label>Nome da Campanha</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Promoção de Verão"
              />
            </div>

            <div className="pu-input-group">
              <label>Onde mostrar?</label>
              <select
                value={displayLocation}
                onChange={(e) => setDisplayLocation(e.target.value)}
                className="pu-select-custom"
              >
                <option value={0}>Apenas no Site</option>
                <option value={1}>Apenas na Plataforma</option>
                <option value={2}>Em Ambos (Site e Plataforma)</option>
              </select>
            </div>

            <div className="pu-input-group">
              <label>Delay (segundos)</label>
              <input
                type="number"
                value={displayDelaySeconds}
                onChange={(e) => setDisplayDelaySeconds(e.target.value)}
                min="0"
              />
            </div>

            <div className="pu-input-group">
              <label>Editor HTML</label>
              <div className="pu-editor-toolbar">
                <button onClick={insertFormShortcode}>
                  <i className="fa-solid fa-wpforms"></i> + Inserir Formulário
                </button>
              </div>
              <textarea
                ref={textareaRef}
                value={htmlContent}
                onChange={(e) => setHtmlContent(e.target.value)}
              />
            </div>

            <div className="pu-switch-group">
              <label className="pu-checkbox-label">
                <input
                  type="checkbox"
                  checked={showFormBuilder}
                  onChange={(e) => setShowFormBuilder(e.target.checked)}
                />
                HABILITAR FORMULÁRIO DINÂMICO?
              </label>
            </div>

            {showFormBuilder && (
              <div className="pu-form-builder-area">
                <div className="pu-builder-header">
                  <span>Campos</span>
                  <div className="pu-builder-actions">
                    <button onClick={() => addFormField("input")}>
                      + Input
                    </button>
                    <button onClick={() => addFormField("textArea")}>
                      + Texto
                    </button>
                  </div>
                </div>
                <div className="pu-fields-list">
                  {formSchema.map((field) => (
                    <div key={field.id} className="pu-field-card">
                      <input
                        value={field.label}
                        onChange={(e) =>
                          updateField(field.id, "label", e.target.value)
                        }
                      />
                      <div className="pu-field-opts">
                        <label>
                          <input
                            type="checkbox"
                            checked={field.required}
                            onChange={(e) =>
                              updateField(
                                field.id,
                                "required",
                                e.target.checked
                              )
                            }
                          />{" "}
                          Req.
                        </label>
                        <button onClick={() => removeField(field.id)}>
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pu-switch-group">
              <label className="pu-checkbox-label">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                />
                CAMPANHA ATIVA
              </label>
            </div>
          </div>

          <div className="pu-sidebar-footer">
            <button className="pu-btn-cancel" onClick={onClose}>
              Descartar
            </button>
            <button className="pu-btn-save" onClick={handleSave}>
              Publicar
            </button>
          </div>
        </div>

        <div
          className={`pu-preview-container ${
            activeTab === "preview" ? "show-mobile" : "hide-mobile"
          }`}
        >
          <div className="pu-preview-header">
            <i className="fa-solid fa-eye"></i> Visualização
          </div>
          <div className="pu-preview-canvas">
            <div className="pu-mock-browser">
              <div className="pu-browser-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <div className="pu-browser-content">{renderPreview()}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePopUpModal;
