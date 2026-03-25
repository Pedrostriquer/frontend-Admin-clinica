import React, { useState, useEffect } from "react";
import styles from "../CreatePostModalStyle";
import HtmlPreview from "../HtmlPreview";

const PostForm = ({ post, categories, onSave, isLoading = false, posts = [] }) => {
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    featuredImage: "",
    author: "Equipe GemCapital",
    readTime: 5,
    active: true,
    categoryIds: [],
    carouselPosition: null,
  });

  const [showPreview, setShowPreview] = useState(false);
  const [errors, setErrors] = useState({});

  // Calcular posições de carousel já ocupadas
  const carouselPositions = posts
    .filter(p => p.carouselPosition && (!post || p.id !== post.id))
    .map(p => p.carouselPosition)
    .sort((a, b) => a - b);

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title || "",
        excerpt: post.excerpt || "",
        content: post.content || "",
        featuredImage: post.featuredImage || "",
        author: post.author || "Equipe GemCapital",
        readTime: post.readTime || 5,
        active: post.active !== false,
        categoryIds: post.categories?.map((c) => c.id) || [],
        carouselPosition: post.carouselPosition || null,
      });
    }
  }, [post]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Título é obrigatório";
    if (!formData.excerpt.trim()) newErrors.excerpt = "Resumo é obrigatório";
    if (!formData.content.trim()) newErrors.content = "Conteúdo é obrigatório";
    if (!formData.featuredImage.trim()) newErrors.featuredImage = "Imagem destaque é obrigatória";
    if (formData.categoryIds.length === 0) newErrors.categoryIds = "Selecione uma categoria";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Limpar erro ao editar campo
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleCategoryToggle = (categoryId) => {
    setFormData((prev) => ({
      ...prev,
      categoryIds: prev.categoryIds.includes(categoryId)
        ? prev.categoryIds.filter((id) => id !== categoryId)
        : [...prev.categoryIds, categoryId],
    }));
    if (errors.categoryIds) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.categoryIds;
        return newErrors;
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSave({
        ...formData,
        categoryIds: formData.categoryIds,
      });
    }
  };

  return (
    <div style={styles.formWrapper}>
      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Título */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Título *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            style={{
              ...styles.input,
              borderColor: errors.title ? "#ff4444" : undefined,
            }}
            placeholder="Título do post"
            disabled={isLoading}
          />
          {errors.title && <span style={styles.errorText}>{errors.title}</span>}
        </div>

        {/* Resumo (Excerpt) */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Resumo *</label>
          <textarea
            name="excerpt"
            value={formData.excerpt}
            onChange={handleInputChange}
            style={{
              ...styles.input,
              minHeight: "70px",
              borderColor: errors.excerpt ? "#ff4444" : undefined,
            }}
            placeholder="Um breve resumo do post (aparecerá na listagem)"
            disabled={isLoading}
          />
          {errors.excerpt && <span style={styles.errorText}>{errors.excerpt}</span>}
        </div>

        {/* Conteúdo HTML */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Conteúdo HTML *</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            style={{
              ...styles.input,
              minHeight: "200px",
              fontFamily: "monospace",
              borderColor: errors.content ? "#ff4444" : undefined,
            }}
            placeholder="Conteúdo em HTML. Use: <h2>, <p>, <strong>, etc..."
            disabled={isLoading}
          />
          {errors.content && <span style={styles.errorText}>{errors.content}</span>}
          <small style={styles.helperText}>
            Dica: Digite o HTML diretamente. Você pode visualizar no preview.
          </small>
        </div>

        {/* Imagem Destaque */}
        <div style={styles.formGroup}>
          <label style={styles.label}>URL da Imagem Destaque *</label>
          <input
            type="text"
            name="featuredImage"
            value={formData.featuredImage}
            onChange={handleInputChange}
            style={{
              ...styles.input,
              borderColor: errors.featuredImage ? "#ff4444" : undefined,
            }}
            placeholder="https://..."
            disabled={isLoading}
          />
          {formData.featuredImage && (
            <img
              src={formData.featuredImage}
              alt="Preview"
              style={styles.imagePreview}
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          )}
          {errors.featuredImage && (
            <span style={styles.errorText}>{errors.featuredImage}</span>
          )}
        </div>

        {/* Categorias */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Categorias *</label>
          <div style={styles.categoriesCheckbox}>
            {categories.map((cat) => (
              <label key={cat.id} style={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={formData.categoryIds.includes(cat.id)}
                  onChange={() => handleCategoryToggle(cat.id)}
                  style={styles.checkbox}
                  disabled={isLoading}
                />
                {cat.name}
              </label>
            ))}
          </div>
          {errors.categoryIds && (
            <span style={styles.errorText}>{errors.categoryIds}</span>
          )}
        </div>

        {/* Autor, Tempo de Leitura, Status */}
        <div style={styles.formRow}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Autor</label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleInputChange}
              style={styles.input}
              disabled={isLoading}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Tempo de Leitura (min)</label>
            <input
              type="number"
              name="readTime"
              value={formData.readTime}
              onChange={handleInputChange}
              style={styles.input}
              min="1"
              disabled={isLoading}
            />
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

        {/* Posição Carousel */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Posição no Carousel (1-3) (opcional)</label>
          <input
            type="number"
            name="carouselPosition"
            value={formData.carouselPosition || ""}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                carouselPosition: e.target.value ? parseInt(e.target.value) : null,
              }))
            }
            style={styles.input}
            min="1"
            placeholder="Deixe em branco para não incluir no carousel"
            disabled={isLoading}
          />
          <small style={styles.helperText}>
            Posições ocupadas: {carouselPositions.length === 0 ? "Nenhuma" : carouselPositions.join(", ")}
          </small>
          {formData.carouselPosition && carouselPositions.includes(formData.carouselPosition) && (
            <small style={{ ...styles.helperText, color: "#0066cc", marginTop: "4px" }}>
              ℹ️ As posições serão reordenadas automaticamente
            </small>
          )}
          {formData.carouselPosition && formData.carouselPosition < 1 && (
            <small style={{ ...styles.errorText, marginTop: "4px" }}>
              ❌ A posição deve ser 1 ou maior
            </small>
          )}
        </div>

        {/* Botões */}
        <div style={styles.formActions}>
          <button
            type="button"
            style={{
              ...styles.previewButton,
              opacity: isLoading ? 0.6 : 1,
              cursor: isLoading ? "not-allowed" : "pointer",
            }}
            onClick={() => setShowPreview(!showPreview)}
            disabled={isLoading}
          >
            {showPreview ? "Editar" : "Preview HTML"}
          </button>
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
            {isLoading ? "Salvando..." : post ? "Atualizar Post" : "Criar Post"}
          </button>
        </div>
      </form>

      {/* Preview */}
      {showPreview && <HtmlPreview html={formData.content} />}
    </div>
  );
};

export default PostForm;
