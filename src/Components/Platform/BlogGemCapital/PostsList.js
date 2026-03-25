import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles, { getResponsivePostsGridColumns, getResponsivePostsGap } from "./PostsListStyle";

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

const PostsList = ({
  posts,
  loading,
  onDeletePost,
  categories,
  loadingPostId,
  onFilterChange,
}) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [hoveredCard, setHoveredCard] = useState(null);
  const [filterStatus, setFilterStatus] = useState(null); // null = todos, true = ativos, false = inativos
  const [filterFromDate, setFilterFromDate] = useState("");
  const [filterToDate, setFilterToDate] = useState("");
  const [sortBy, setSortBy] = useState(null);
  const windowWidth = useResponsive();
  const postsPerPage = 12;

  const handleFilterChange = () => {
    if (onFilterChange) {
      onFilterChange({
        active: filterStatus,
        createdFromDate: filterFromDate ? new Date(filterFromDate) : null,
        createdToDate: filterToDate ? new Date(filterToDate) : null,
        sortBy: sortBy,
      });
    }
  };

  // Filtrar posts
  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Paginar
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingSpinner}></div>
        <div style={styles.loadingText}>Carregando posts...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.listHeader}>
        <div style={styles.headerLeft}>
          <h2 style={styles.heading}>Seus Posts ({posts.length})</h2>
          <input
            type="text"
            placeholder="Buscar por título ou conteúdo..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            style={styles.searchInput}
            onFocus={(e) => (e.target.style.borderColor = "#C9A96E")}
            onBlur={(e) => (e.target.style.borderColor = "#e0e6ed")}
          />
        </div>
        <button
          style={styles.createButton}
          onClick={() => navigate("/platform/blog-gemcapital/posts/edit/novo-post")}
        >
          + Novo Post
        </button>
      </div>

      {/* Filters */}
      <div style={styles.filtersContainer}>
        <div style={styles.filterGroup}>
          <label style={styles.filterLabel}>Status:</label>
          <select
            value={filterStatus === null ? "todos" : filterStatus}
            onChange={(e) => {
              const value = e.target.value;
              setFilterStatus(value === "todos" ? null : value === "true");
              setCurrentPage(1);
            }}
            style={styles.filterSelect}
          >
            <option value="todos">Todos</option>
            <option value="true">Ativos</option>
            <option value="false">Inativos</option>
          </select>
        </div>

        <div style={styles.filterGroup}>
          <label style={styles.filterLabel}>Data Inicial:</label>
          <input
            type="date"
            value={filterFromDate}
            onChange={(e) => {
              setFilterFromDate(e.target.value);
              setCurrentPage(1);
            }}
            style={styles.filterInput}
          />
        </div>

        <div style={styles.filterGroup}>
          <label style={styles.filterLabel}>Data Final:</label>
          <input
            type="date"
            value={filterToDate}
            onChange={(e) => {
              setFilterToDate(e.target.value);
              setCurrentPage(1);
            }}
            style={styles.filterInput}
          />
        </div>

        <div style={styles.filterGroup}>
          <label style={styles.filterLabel}>Ordenar por:</label>
          <select
            value={sortBy || "default"}
            onChange={(e) => {
              const value = e.target.value;
              setSortBy(value === "default" ? null : value);
              setCurrentPage(1);
            }}
            style={styles.filterSelect}
          >
            <option value="default">Data (Mais Recentes)</option>
            <option value="mostliked">👍 Mais Curtidos</option>
            <option value="leastliked">👍 Menos Curtidos</option>
            <option value="mostviewed">👁️ Mais Visualizados</option>
            <option value="leastviewed">👁️ Menos Visualizados</option>
            <option value="titleasc">Título (A-Z)</option>
            <option value="titledesc">Título (Z-A)</option>
          </select>
        </div>

        <button style={styles.filterButton} onClick={handleFilterChange}>
          Aplicar Filtros
        </button>
      </div>

      {/* Posts Grid */}
      {paginatedPosts.length > 0 ? (
        <div>
          <div
            style={{
              ...styles.postsGrid,
              gridTemplateColumns: getResponsivePostsGridColumns(windowWidth),
              gap: getResponsivePostsGap(windowWidth),
            }}
          >
            {paginatedPosts.map((post) => (
              <div
                key={post.id}
                style={{
                  ...styles.postCard,
                  ...(hoveredCard === post.id ? styles.postCardHover : {}),
                }}
                onMouseEnter={() => setHoveredCard(post.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Imagem */}
                {post.featuredImage ? (
                  <img
                    src={post.featuredImage}
                    alt={post.title}
                    style={styles.postImage}
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                ) : (
                  <div style={styles.postImagePlaceholder}>Sem imagem</div>
                )}

                {/* Conteúdo */}
                <div style={styles.postContent}>
                  <h3 style={styles.postTitle}>{post.title}</h3>

                  <div style={styles.postMeta}>
                    <div style={styles.metaItem}>
                      <span style={{ fontWeight: "600", marginRight: "6px" }}>
                        {post.categories?.[0]?.name || "Sem categoria"}
                      </span>
                    </div>
                    <div style={styles.metaItem}>
                      <span style={{ fontSize: "12px" }}>
                        {new Date(post.publishedAt || post.createdAt).toLocaleDateString(
                          "pt-BR"
                        )}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "12px", marginTop: "8px", fontSize: "12px", color: "#666" }}>
                    <span>👁️ {post.views || 0}</span>
                    <span>👍 {post.likes || 0}</span>
                  </div>

                  <p style={styles.postExcerpt}>{post.excerpt}</p>

                  <div style={styles.postFooter}>
                    <span
                      style={{
                        ...styles.badge,
                        ...(post.active ? styles.badgeActive : styles.badgeInactive),
                      }}
                    >
                      {post.active ? "Ativo" : "Inativo"}
                    </span>
                    <div style={styles.actionsContainer}>
                      <button
                        style={{
                          ...styles.actionButton,
                          opacity: loadingPostId === post.id ? 0.6 : 1,
                          cursor: loadingPostId === post.id ? "not-allowed" : "pointer",
                        }}
                        onClick={() => navigate(`/platform/blog-gemcapital/posts/${post.id}`)}
                        title="Visualizar"
                        disabled={loadingPostId === post.id}
                      >
                        Ver
                      </button>
                      <button
                        style={{
                          ...styles.actionButton,
                          opacity: loadingPostId === post.id ? 0.6 : 1,
                          cursor: loadingPostId === post.id ? "not-allowed" : "pointer",
                        }}
                        onClick={() => navigate(`/platform/blog-gemcapital/posts/edit/${post.id}`)}
                        title="Editar"
                        disabled={loadingPostId === post.id}
                      >
                        Editar
                      </button>
                      <button
                        style={{
                          ...styles.actionButton,
                          ...styles.deleteButton,
                          opacity: loadingPostId === post.id ? 0.8 : 1,
                          cursor: loadingPostId === post.id ? "not-allowed" : "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "6px",
                        }}
                        onClick={() => onDeletePost(post.id)}
                        title="Deletar"
                        disabled={loadingPostId === post.id}
                      >
                        {loadingPostId === post.id && (
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
                        {loadingPostId === post.id ? "Deletando..." : "Deletar"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={styles.pagination}>
              <button
                style={styles.paginationButton}
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                onMouseEnter={(e) =>
                  currentPage > 1 && (e.target.style.transform = "scale(1.05)")
                }
                onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
              >
                ← Anterior
              </button>
              <span style={styles.pageInfo}>
                Página {currentPage} de {totalPages}
              </span>
              <button
                style={styles.paginationButton}
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                onMouseEnter={(e) =>
                  currentPage < totalPages && (e.target.style.transform = "scale(1.05)")
                }
                onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
              >
                Próxima →
              </button>
            </div>
          )}
        </div>
      ) : (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>∅</div>
          <h3 style={{ margin: "0 0 8px 0", color: "#122C4F" }}>
            Nenhum post encontrado
          </h3>
          <p style={{ margin: "0 0 20px 0" }}>
            {searchTerm
              ? `Nenhum post corresponde a "${searchTerm}"`
              : "Comece criando seu primeiro post!"}
          </p>
          <button
            style={styles.createButton}
            onClick={() => navigate("/platform/blog-gemcapital/posts/edit/novo-post")}
          >
            + Criar Primeiro Post
          </button>
        </div>
      )}
    </div>
  );
};

export default PostsList;
