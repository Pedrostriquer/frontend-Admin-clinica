import React, { useState, useEffect } from "react";
import styles from "./CreateCategoryModalStyle";

const CreateCategoryModal = ({ category, onClose, onSave, isLoading = false, totalCategories = 0 }) => {
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    order: 0,
    active: true,
  });

  const [errors, setErrors] = useState({});
  const suggestedOrder = totalCategories;

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || "",
        slug: category.slug || "",
        description: category.description || "",
        order: category.order || 0,
        active: category.active !== false,
      });
    } else {
      // Para nova categoria, sugerir ordem como a próxima disponível
      setFormData((prev) => ({
        ...prev,
        order: suggestedOrder,
      }));
    }
  }, [category, suggestedOrder]);

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Nome é obrigatório";
    if (!formData.slug.trim()) newErrors.slug = "Slug é obrigatório";
    if (formData.order < 0) newErrors.order = "Ordem não pode ser negativa";
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

  const handleNameChange = (e) => {
    const name = e.target.value;
    setFormData((prev) => ({
      ...prev,
      name,
      slug: !category ? generateSlug(name) : prev.slug,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}>
            {category ? "Editar Categoria" : "Nova Categoria"}
          </h2>
          <button style={styles.closeButton} onClick={onClose}>
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
                onChange={handleNameChange}
                style={styles.input}
                placeholder="Ex: Planejador, Mercado, Educação..."
                disabled={isLoading}
              />
              {errors.name && <span style={styles.errorText}>{errors.name}</span>}
            </div>

            {/* Slug */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Slug (URL) *</label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                style={styles.input}
                placeholder="Ex: planejador"
                disabled={isLoading}
              />
              <small style={styles.helperText}>
                Gerado automaticamente a partir do nome (pode editar manualmente)
              </small>
              {errors.slug && <span style={styles.errorText}>{errors.slug}</span>}
            </div>

            {/* Descrição */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Descrição</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                style={{ ...styles.input, minHeight: "80px" }}
                placeholder="Uma breve descrição desta categoria..."
                disabled={isLoading}
              />
            </div>

            {/* Ordem e Status */}
            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Ordem</label>
                <input
                  type="number"
                  name="order"
                  value={formData.order}
                  onChange={handleInputChange}
                  style={styles.input}
                  min="0"
                  disabled={isLoading}
                />
                <small style={styles.helperText}>
                  Posição de exibição (números menores aparecem primeiro). {!category && `Sugestão: ${suggestedOrder}`}
                </small>
                {formData.order < suggestedOrder && !category && (
                  <small style={{ ...styles.helperText, color: "#0066cc", marginTop: "4px" }}>
                    ℹ️ As categorias serão reordenadas automaticamente
                  </small>
                )}
                {errors.order && <span style={styles.errorText}>{errors.order}</span>}
              </div>
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
                  Ativo
                </label>
              </div>
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
                  minWidth: "150px",
                  animation: isLoading ? "pulse 1.5s ease-in-out infinite" : "none",
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
                {isLoading ? "Salvando..." : category ? "Atualizar Categoria" : "Criar Categoria"}
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

export default CreateCategoryModal;
