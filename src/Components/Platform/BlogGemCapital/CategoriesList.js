import React, { useState, useEffect } from "react";
import styles, { getResponsiveGridColumns, getResponsiveGap } from "./CategoriesListStyle";
import DeleteCategoryModal from "./DeleteCategoryModal";

// Hook para detectar tamanho da tela
const useResponsive = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize.width;
};

const CategoriesList = ({
  categories,
  loading,
  onCreateCategory,
  onEditCategory,
  onDeleteCategory,
  loadingCategoryId,
}) => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const windowWidth = useResponsive();

  const handleDeleteClick = (category) => {
    setCategoryToDelete(category);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async (movePostsToCategoryId, deleteAllPosts) => {
    if (!categoryToDelete) return;
    setIsDeleting(true);
    try {
      await onDeleteCategory(categoryToDelete.id, movePostsToCategoryId, deleteAllPosts);
      setShowDeleteModal(false);
      setCategoryToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingSpinner}></div>
        <div style={styles.loadingText}>Carregando categorias...</div>
      </div>
    );
  }

  const colors = [
    { bg: "rgba(59, 130, 246, 0.1)", border: "#3b82f6" },
    { bg: "rgba(34, 197, 94, 0.1)", border: "#22c55e" },
    { bg: "rgba(168, 85, 247, 0.1)", border: "#a855f7" },
    { bg: "rgba(245, 158, 11, 0.1)", border: "#f59e0b" },
    { bg: "rgba(239, 68, 68, 0.1)", border: "#ef4444" },
    { bg: "rgba(14, 165, 233, 0.1)", border: "#0ea5e9" },
  ];

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.listHeader}>
        <h2 style={styles.heading}>Categorias ({categories.length})</h2>
        <button style={styles.createButton} onClick={onCreateCategory}>
          + Nova Categoria
        </button>
      </div>

      {/* Categories Grid */}
      {categories.length > 0 ? (
        <div
          style={{
            ...styles.categoriesGrid,
            gridTemplateColumns: getResponsiveGridColumns(windowWidth),
            gap: getResponsiveGap(windowWidth),
          }}
        >
          {categories.map((category, idx) => (
            <div
              key={category.id}
              style={{
                ...styles.categoryCard,
                ...(hoveredCard === category.id ? styles.categoryCardHover : {}),
              }}
              onMouseEnter={() => setHoveredCard(category.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Color Accent */}
              <div
                style={{
                  ...styles.colorAccent,
                  backgroundColor: colors[idx % colors.length].border,
                }}
              ></div>

              <div style={styles.categoryBody}>
                {/* Header */}
                <div style={styles.categoryHeader}>
                  <div>
                    <h3 style={styles.categoryName}>{category.name}</h3>
                    <p
                      style={{
                        ...styles.categorySlug,
                        color: colors[idx % colors.length].border,
                      }}
                    >
                      /{category.slug}
                    </p>
                  </div>
                  <span
                    style={{
                      ...styles.badge,
                      ...(category.active ? styles.badgeActive : styles.badgeInactive),
                    }}
                  >
                    {category.active ? "Ativo" : "Inativo"}
                  </span>
                </div>

                {/* Description */}
                {category.description && (
                  <p style={styles.description}>{category.description}</p>
                )}

                {/* Info */}
                <div style={styles.categoryInfo}>
                  <div style={styles.infoItem}>
                    <span style={styles.infoLabel}>Ordem</span>
                    <span style={styles.infoValue}>{category.order}</span>
                  </div>
                </div>

                {/* Actions */}
                <div style={styles.actionsContainer}>
                  <button
                    style={{
                      ...styles.editButton,
                      opacity: loadingCategoryId === category.id ? 0.6 : 1,
                      cursor: loadingCategoryId === category.id ? "not-allowed" : "pointer",
                    }}
                    onClick={() => onEditCategory(category)}
                    disabled={loadingCategoryId === category.id}
                  >
                    Editar
                  </button>
                  <button
                    style={{
                      ...styles.deleteButton,
                      opacity: loadingCategoryId === category.id ? 0.8 : 1,
                      cursor: loadingCategoryId === category.id ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                    }}
                    onClick={() => handleDeleteClick(category)}
                    disabled={loadingCategoryId === category.id}
                  >
                    {loadingCategoryId === category.id && (
                      <span
                        style={{
                          display: "inline-block",
                          width: "12px",
                          height: "12px",
                          border: "2px solid rgba(220, 53, 69, 0.3)",
                          borderTop: "2px solid #dc3545",
                          borderRadius: "50%",
                          animation: "spin 0.8s linear infinite",
                        }}
                      />
                    )}
                    {loadingCategoryId === category.id ? "Deletando..." : "Deletar"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>∅</div>
          <h3 style={{ margin: "0 0 8px 0", color: "#122C4F" }}>
            Nenhuma categoria criada
          </h3>
          <p style={{ margin: "0 0 20px 0", color: "#8892a0" }}>
            Crie sua primeira categoria para começar
          </p>
          <button style={styles.createButton} onClick={onCreateCategory}>
            + Criar Primeira Categoria
          </button>
        </div>
      )}

      {/* Delete Category Modal */}
      {showDeleteModal && categoryToDelete && (
        <DeleteCategoryModal
          category={categoryToDelete}
          categories={categories}
          onClose={() => {
            setShowDeleteModal(false);
            setCategoryToDelete(null);
          }}
          onConfirm={handleConfirmDelete}
          isLoading={isDeleting}
        />
      )}
    </div>
  );
};

export default CategoriesList;
