import React from "react";
import styles from "./ViewPostModalStyle";

const ViewPostModal = ({ post, onClose }) => {
  if (!post) return null;

  const publishDate = new Date(post.publishedAt || post.createdAt).toLocaleDateString(
    "pt-BR",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}>Visualizar Post</h2>
          <button style={styles.closeButton} onClick={onClose}>
            ✕
          </button>
        </div>

        <div style={styles.modalBody}>
          {/* Imagem Destaque */}
          {post.featuredImage && (
            <img
              src={post.featuredImage}
              alt={post.title}
              style={styles.heroImage}
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          )}

          {/* Metadados */}
          <div style={styles.metadata}>
            <div style={styles.metaItem}>
              <strong>Categoria:</strong> {post.categories?.[0]?.name || "Sem categoria"}
            </div>
            <div style={styles.metaItem}>
              <strong>Data:</strong> {publishDate}
            </div>
            <div style={styles.metaItem}>
              <strong>Autor:</strong> {post.author || "Equipe GemCapital"}
            </div>
            <div style={styles.metaItem}>
              <strong>Tempo de Leitura:</strong> {post.readTime} min
            </div>
            <div style={styles.metaItem}>
              <strong>Visualizações:</strong> {post.views || 0}
            </div>
            <div style={styles.metaItem}>
              <strong>Curtidas:</strong> {post.likes || 0}
            </div>
            <div style={styles.metaItem}>
              <strong>Status:</strong>{" "}
              <span
                style={{
                  ...styles.badge,
                  ...(post.active ? styles.badgeActive : styles.badgeInactive),
                }}
              >
                {post.active ? "Ativo" : "Inativo"}
              </span>
            </div>
          </div>

          {/* Título */}
          <h1 style={styles.title}>{post.title}</h1>

          {/* Resumo */}
          <div style={styles.excerpt}>{post.excerpt}</div>

          {/* Conteúdo HTML */}
          <div
            style={styles.content}
            dangerouslySetInnerHTML={{
              __html: post.content || "<p>Sem conteúdo</p>",
            }}
          />

          {/* Botão Fechar */}
          <div style={styles.actions}>
            <button style={styles.closeButtonFull} onClick={onClose}>
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewPostModal;
