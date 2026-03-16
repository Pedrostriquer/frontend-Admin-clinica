import React, { useState, useEffect } from "react";
import styles from "./DeleteCategoryModalStyle";
import gemCapitalBlogServices from "../../../dbServices/gemCapitalBlogServices";

const DeleteCategoryModal = ({ category, categories, onClose, onConfirm, isLoading = false }) => {
  const [postsCount, setPostsCount] = useState(0);
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [selectedAction, setSelectedAction] = useState(null); // "move" | "delete" | null
  const [selectedTargetCategory, setSelectedTargetCategory] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const count = await gemCapitalBlogServices.getPostsCountByCategory(category.id);
        setPostsCount(count);

        if (count > 0) {
          const postsData = await gemCapitalBlogServices.getPostsByCategory(category.id);
          setPosts(postsData || []);
        }
      } catch (error) {
        console.error("Erro ao buscar posts:", error);
        setPostsCount(0);
      } finally {
        setLoadingPosts(false);
      }
    };

    fetchPosts();
  }, [category.id]);

  const handleConfirm = async () => {
    if (postsCount === 0) {
      // Sem posts, deletar direto
      await onConfirm(null, false);
    } else if (selectedAction === "move") {
      if (!selectedTargetCategory) {
        alert("Selecione uma categoria de destino");
        return;
      }
      await onConfirm(selectedTargetCategory, false);
    } else if (selectedAction === "delete") {
      await onConfirm(null, true);
    } else {
      alert("Selecione uma ação");
    }
  };

  const availableCategories = categories.filter((c) => c.id !== category.id);

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}>Excluir Categoria</h2>
          <button style={styles.closeButton} onClick={onClose}>
            ✕
          </button>
        </div>

        <div style={styles.modalBody}>
          {loadingPosts ? (
            <div style={styles.loadingContainer}>
              <div style={styles.spinner} />
              <p style={styles.loadingText}>Verificando posts atrelados...</p>
            </div>
          ) : postsCount === 0 ? (
            <div style={styles.content}>
              <p style={styles.warningText}>
                A categoria <strong>{category.name}</strong> não possui posts atrelados.
              </p>
              <p style={styles.confirmText}>Deseja realmente deletar esta categoria?</p>
            </div>
          ) : (
            <div style={styles.content}>
              <div style={styles.warningBox}>
                <span style={styles.warningIcon}>⚠️</span>
                <p>
                  Esta categoria possui <strong>{postsCount} post{postsCount !== 1 ? "s" : ""}</strong> atrelado{postsCount !== 1 ? "s" : ""}.
                </p>
              </div>

              <div style={styles.postsPreview}>
                <h3 style={styles.previewTitle}>Posts que serão afetados:</h3>
                <ul style={styles.postsList}>
                  {posts.slice(0, 5).map((post) => (
                    <li key={post.id} style={styles.postItem}>
                      {post.title}
                    </li>
                  ))}
                  {posts.length > 5 && (
                    <li style={{ ...styles.postItem, fontStyle: "italic", color: "#999" }}>
                      + {posts.length - 5} mais...
                    </li>
                  )}
                </ul>
              </div>

              <div style={styles.actionSelector}>
                <h3 style={styles.selectorTitle}>O que fazer com esses posts?</h3>

                {/* Opção 1: Mover para outra categoria */}
                <div
                  style={{
                    ...styles.actionOption,
                    ...(selectedAction === "move" ? styles.actionOptionSelected : {}),
                  }}
                  onClick={() => setSelectedAction("move")}
                >
                  <input
                    type="radio"
                    name="action"
                    value="move"
                    checked={selectedAction === "move"}
                    onChange={() => setSelectedAction("move")}
                    style={styles.radio}
                  />
                  <div style={styles.optionContent}>
                    <p style={styles.optionTitle}>Mover para outra categoria</p>
                    <p style={styles.optionDescription}>
                      Os posts serão movidos para uma categoria existente
                    </p>
                    {selectedAction === "move" && (
                      <select
                        style={styles.categorySelect}
                        value={selectedTargetCategory || ""}
                        onChange={(e) => setSelectedTargetCategory(parseInt(e.target.value))}
                      >
                        <option value="">Selecione uma categoria...</option>
                        {availableCategories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>

                {/* Opção 2: Deletar posts também */}
                <div
                  style={{
                    ...styles.actionOption,
                    ...(selectedAction === "delete" ? styles.actionOptionSelected : {}),
                  }}
                  onClick={() => setSelectedAction("delete")}
                >
                  <input
                    type="radio"
                    name="action"
                    value="delete"
                    checked={selectedAction === "delete"}
                    onChange={() => setSelectedAction("delete")}
                    style={styles.radio}
                  />
                  <div style={styles.optionContent}>
                    <p style={styles.optionTitle}>Deletar posts também</p>
                    <p style={styles.optionDescription}>
                      Os {postsCount} post{postsCount !== 1 ? "s" : ""} serão permanentemente deletados
                    </p>
                    {selectedAction === "delete" && (
                      <p style={styles.dangerWarning}>
                        ⚠️ Essa ação não pode ser desfeita!
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div style={styles.modalFooter}>
          <button
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
          <button
            style={{
              ...styles.deleteButton,
              opacity: isLoading ? 0.8 : 1,
              cursor: isLoading ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              minWidth: "140px",
            }}
            onClick={handleConfirm}
            disabled={isLoading || (postsCount > 0 && !selectedAction)}
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
            {isLoading ? "Deletando..." : "Deletar"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteCategoryModal;
