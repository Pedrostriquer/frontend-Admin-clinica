import React, { useState, useEffect } from "react";

const CreatePixelModal = ({ pixel, onClose, onSave, isLoading = false }) => {
  const [formData, setFormData] = useState({
    name: "",
    type: "google",
    code: "",
    scriptHtml: "",
    description: "",
    placement: "head",
    priority: 0,
    active: true,
  });

  const [errors, setErrors] = useState({});

  const pixelTypes = [
    { value: "google", label: "Google Analytics / GA4", icon: "🔍" },
    { value: "meta", label: "Meta Pixel (Facebook)", icon: "📘" },
    { value: "gtm", label: "Google Tag Manager", icon: "🏷️" },
    { value: "custom", label: "Custom Script", icon: "⚙️" },
  ];

  useEffect(() => {
    if (pixel) {
      setFormData({
        name: pixel.name || "",
        type: pixel.type || "google",
        code: pixel.code || "",
        scriptHtml: pixel.scriptHtml || "",
        description: pixel.description || "",
        placement: pixel.placement || "head",
        priority: pixel.priority || 0,
        active: pixel.active !== false,
      });
    }
  }, [pixel]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Nome é obrigatório";
    if (!formData.type.trim()) newErrors.type = "Tipo é obrigatório";
    if (!formData.code.trim()) newErrors.code = "Código é obrigatório";
    if (formData.type === "custom" && !formData.scriptHtml.trim()) {
      newErrors.scriptHtml = "Script HTML é obrigatório para pixels customizados";
    }
    if (formData.priority < 0) newErrors.priority = "Prioridade não pode ser negativa";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  const styles = {
    modalOverlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
      animation: "fadeIn 0.3s ease",
      padding: "20px 10px",
      overflowY: "auto",
    },
    modalContent: {
      backgroundColor: "white",
      borderRadius: "12px",
      boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
      maxWidth: "600px",
      width: "100%",
      maxHeight: "95vh",
      overflow: "auto",
      animation: "slideUp 0.3s ease",
      margin: "auto",
    },
    modalHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "24px",
      borderBottom: "1px solid #e0e6ed",
      backgroundColor: "#f8f9fb",
      gap: "16px",
    },
    modalTitle: {
      fontSize: "18px",
      fontWeight: "700",
      color: "#122C4F",
      margin: 0,
    },
    closeButton: {
      background: "none",
      border: "none",
      fontSize: "24px",
      cursor: "pointer",
      color: "#8892a0",
      padding: "0",
      width: "32px",
      height: "32px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "6px",
      transition: "all 0.2s ease",
    },
    modalBody: {
      padding: "24px",
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "20px",
    },
    formGroup: {
      display: "flex",
      flexDirection: "column",
      gap: "8px",
    },
    label: {
      fontSize: "13px",
      fontWeight: "600",
      color: "#122C4F",
      textTransform: "uppercase",
      letterSpacing: "0.3px",
    },
    input: {
      padding: "12px",
      border: "1px solid #e0e6ed",
      borderRadius: "6px",
      fontSize: "14px",
      fontFamily: "inherit",
      transition: "all 0.2s ease",
      boxSizing: "border-box",
      width: "100%",
    },
    inputFocus: {
      borderColor: "#122C4F",
      boxShadow: "0 0 0 3px rgba(18, 44, 79, 0.1)",
    },
    select: {
      padding: "12px",
      border: "1px solid #e0e6ed",
      borderRadius: "6px",
      fontSize: "14px",
      fontFamily: "inherit",
      backgroundColor: "white",
      cursor: "pointer",
      transition: "all 0.2s ease",
      boxSizing: "border-box",
      width: "100%",
    },
    textarea: {
      padding: "12px",
      border: "1px solid #e0e6ed",
      borderRadius: "6px",
      fontSize: "14px",
      fontFamily: "monospace",
      minHeight: "100px",
      resize: "vertical",
      transition: "all 0.2s ease",
      boxSizing: "border-box",
      width: "100%",
    },
    helperText: {
      fontSize: "12px",
      color: "#8892a0",
      fontStyle: "italic",
    },
    errorText: {
      fontSize: "12px",
      color: "#dc3545",
      fontWeight: "500",
    },
    formRow: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "16px",
    },
    checkboxLabel: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: "500",
      color: "#122C4F",
    },
    checkbox: {
      width: "18px",
      height: "18px",
      cursor: "pointer",
      accentColor: "#122C4F",
    },
    formActions: {
      display: "flex",
      gap: "12px",
      marginTop: "20px",
      paddingTop: "20px",
      borderTop: "1px solid #e0e6ed",
    },
    submitButton: {
      flex: 1,
      padding: "12px 24px",
      backgroundColor: "linear-gradient(135deg, #122C4F 0%, #1a3a66 100%)",
      color: "white",
      border: "none",
      borderRadius: "8px",
      fontSize: "14px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.3s ease",
      boxShadow: "0 4px 12px rgba(18, 44, 79, 0.2)",
    },
    cancelButton: {
      flex: 1,
      padding: "12px 24px",
      backgroundColor: "#f0f3f8",
      color: "#122C4F",
      border: "1px solid #e0e6ed",
      borderRadius: "8px",
      fontSize: "14px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.2s ease",
    },
    typeSelect: {
      display: "flex",
      flexDirection: "column",
      gap: "8px",
    },
    typeOption: {
      padding: "12px",
      border: "1px solid #e0e6ed",
      borderRadius: "6px",
      cursor: "pointer",
      backgroundColor: "white",
      transition: "all 0.2s ease",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      fontSize: "14px",
    },
    typeOptionSelected: {
      backgroundColor: "rgba(18, 44, 79, 0.1)",
      borderColor: "#122C4F",
      fontWeight: "600",
    },
  };

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}>
            {pixel ? "📝 Editar Pixel" : "➕ Novo Pixel"}
          </h2>
          <button
            style={styles.closeButton}
            onClick={onClose}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "rgba(0, 0, 0, 0.05)";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "transparent";
            }}
          >
            ✕
          </button>
        </div>

        <div style={styles.modalBody}>
          <form onSubmit={handleSubmit} style={styles.form}>
            {/* Nome */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Nome *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                style={{
                  ...styles.input,
                  borderColor: errors.name ? "#dc3545" : "#e0e6ed",
                }}
                placeholder="Ex: Google Analytics, Meta Pixel, etc..."
                disabled={isLoading}
              />
              {errors.name && <span style={styles.errorText}>{errors.name}</span>}
            </div>

            {/* Tipo */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Tipo *</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                style={{
                  ...styles.select,
                  borderColor: errors.type ? "#dc3545" : "#e0e6ed",
                }}
                disabled={isLoading}
              >
                {pixelTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.icon} {type.label}
                  </option>
                ))}
              </select>
              {errors.type && <span style={styles.errorText}>{errors.type}</span>}
              <small style={styles.helperText}>
                Selecione o tipo de pixel que você está adicionando
              </small>
            </div>

            {/* Código */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Código *</label>
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleInputChange}
                style={{
                  ...styles.input,
                  borderColor: errors.code ? "#dc3545" : "#e0e6ed",
                  fontFamily: "monospace",
                }}
                placeholder="Ex: UA-123456789-1 ou 270941412345"
                disabled={isLoading}
              />
              {errors.code && <span style={styles.errorText}>{errors.code}</span>}
              <small style={styles.helperText}>
                ID do pixel ou código de rastreamento específico do tipo selecionado
              </small>
            </div>

            {/* Script HTML (para custom) */}
            {formData.type === "custom" && (
              <div style={styles.formGroup}>
                <label style={styles.label}>Script HTML *</label>
                <textarea
                  name="scriptHtml"
                  value={formData.scriptHtml}
                  onChange={handleInputChange}
                  style={{
                    ...styles.textarea,
                    borderColor: errors.scriptHtml ? "#dc3545" : "#e0e6ed",
                  }}
                  placeholder="Insira o código HTML/JavaScript completo aqui..."
                  disabled={isLoading}
                />
                {errors.scriptHtml && (
                  <span style={styles.errorText}>{errors.scriptHtml}</span>
                )}
              </div>
            )}

            {/* Descrição */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Descrição</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                style={{
                  ...styles.textarea,
                  minHeight: "60px",
                  fontFamily: "inherit",
                }}
                placeholder="Notas sobre este pixel (ex: para conversões, eventos, etc)..."
                disabled={isLoading}
              />
            </div>

            {/* Placement e Priority */}
            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Placement *</label>
                <select
                  name="placement"
                  value={formData.placement}
                  onChange={handleInputChange}
                  style={styles.select}
                  disabled={isLoading}
                >
                  <option value="head">📍 Head (no &lt;head&gt;)</option>
                  <option value="body">📍 Body (no final do &lt;body&gt;)</option>
                </select>
                <small style={styles.helperText}>
                  Onde o pixel será inserido na página
                </small>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Prioridade</label>
                <input
                  type="number"
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  style={styles.input}
                  min="0"
                  disabled={isLoading}
                />
                <small style={styles.helperText}>
                  Ordem de carregamento (menor = primeiro)
                </small>
              </div>
            </div>

            {/* Ativo */}
            <div style={styles.formGroup}>
              <label style={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="active"
                  checked={formData.active}
                  onChange={handleInputChange}
                  style={styles.checkbox}
                  disabled={isLoading}
                />
                Pixel Ativo
              </label>
              <small style={styles.helperText}>
                Desmarque para desativar sem deletar
              </small>
            </div>

            {/* Botões */}
            <div style={styles.formActions}>
              <button
                type="submit"
                style={{
                  ...styles.submitButton,
                  opacity: isLoading ? 0.8 : 1,
                  cursor: isLoading ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                }}
                disabled={isLoading}
              >
                {isLoading && (
                  <span
                    style={{
                      display: "inline-block",
                      width: "14px",
                      height: "14px",
                      border: "2px solid rgba(255,255,255,0.3)",
                      borderTop: "2px solid white",
                      borderRadius: "50%",
                      animation: "spin 0.8s linear infinite",
                    }}
                  />
                )}
                {isLoading ? "Salvando..." : pixel ? "Atualizar Pixel" : "Criar Pixel"}
              </button>
              <button
                type="button"
                style={{
                  ...styles.cancelButton,
                  opacity: isLoading ? 0.6 : 1,
                  cursor: isLoading ? "not-allowed" : "pointer",
                }}
                onClick={onClose}
                disabled={isLoading}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePixelModal;
