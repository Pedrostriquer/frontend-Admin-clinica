import React, { useState, useEffect, useCallback } from "react";
import gemCapitalBlogServices from "../../../../dbServices/gemCapitalBlogServices";
import { modalStyles } from "./PostSelectionModalStyle";

export default function PostSelectionModal({
  isOpen,
  onClose,
  onSelectPost,
  modalTitle = "Selecionar Post",
}) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPostPreview, setSelectedPostPreview] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 1,
  });


  const fetchPosts = useCallback(
    async (page = 1, search = "") => {
      try {
        setLoading(true);
        const response = await gemCapitalBlogServices.getPostsPaginated(
          page,
          10,
          null,
          search || null,
          true
        );

        const items = response.items || [];
        const totalItems = response.totalItems || 0;
        const pageSize = response.pageSize || 10;
        const totalPages = Math.ceil(totalItems / pageSize) || 1;

        setPosts(items);
        setPagination({
          currentPage: page,
          pageSize: pageSize,
          totalItems: totalItems,
          totalPages: totalPages,
        });
      } catch (error) {
        console.error("Erro ao buscar posts:", error);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    if (isOpen) {
      setCurrentPage(1);
      setSelectedPostPreview(null);
      fetchPosts(1, searchTerm);
    }
  }, [isOpen, fetchPosts]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setCurrentPage(1);
    setSelectedPostPreview(null);
    fetchPosts(1, value);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setCurrentPage(newPage);
      setSelectedPostPreview(null);
      fetchPosts(newPage, searchTerm);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Data desconhecida";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Data desconhecida";
      return date.toLocaleDateString("pt-BR");
    } catch {
      return "Data desconhecida";
    }
  };

  const handleSelectPost = (post) => {
    onSelectPost(post);
    handleClose();
  };

  const handleClose = () => {
    setSearchTerm("");
    setCurrentPage(1);
    setSelectedPostPreview(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div style={modalStyles.overlay} onClick={handleClose}>
      <div style={modalStyles.modal} onClick={(e) => e.stopPropagation()}>
        {/* HEADER */}
        <div style={modalStyles.header}>
          <h2 style={modalStyles.title}>{modalTitle}</h2>
          <button
            onClick={handleClose}
            style={modalStyles.closeButton}
            aria-label="Fechar modal"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* SEARCH */}
        <div style={modalStyles.searchContainer}>
          <input
            type="text"
            placeholder="Buscar posts por título ou descrição..."
            value={searchTerm}
            onChange={handleSearch}
            style={modalStyles.searchInput}
          />
        </div>

        {/* CONTENT - 50/50 SPLIT */}
        <div style={modalStyles.contentWrapper}>
          {/* LEFT SIDE - POSTS LIST */}
          <div style={modalStyles.leftPanel}>
            {loading ? (
              <div style={modalStyles.loadingContainer}>
                <div style={modalStyles.spinner}></div>
                <p>Carregando posts...</p>
              </div>
            ) : posts.length > 0 ? (
              <div style={modalStyles.postsList}>
                {posts.map((post) => (
                  <div
                    key={post.id}
                    style={
                      selectedPostPreview?.id === post.id
                        ? { ...modalStyles.postItem, ...modalStyles.postItemActive }
                        : modalStyles.postItem
                    }
                    onClick={() => setSelectedPostPreview(post)}
                  >
                    {post.featuredImage && (
                      <img
                        src={post.featuredImage}
                        alt={post.title}
                        style={modalStyles.postImage}
                      />
                    )}
                    <div style={modalStyles.postItemContent}>
                      <h4 style={modalStyles.postItemTitle}>{post.title}</h4>
                      <p style={modalStyles.postItemDate}>
                        {formatDate(post.created_at || post.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={modalStyles.emptyContainer}>
                <i
                  className="fa-solid fa-inbox"
                  style={modalStyles.emptyIcon}
                ></i>
                <p style={modalStyles.emptyText}>Nenhum post encontrado</p>
              </div>
            )}
          </div>

          {/* RIGHT SIDE - PREVIEW & PAGINATION */}
          <div style={modalStyles.rightPanel}>
            {selectedPostPreview ? (
              <div style={modalStyles.previewContainer}>
                <h3 style={modalStyles.previewTitle}>Pré-visualização</h3>
                {selectedPostPreview.featuredImage && (
                  <img
                    src={selectedPostPreview.featuredImage}
                    alt={selectedPostPreview.title}
                    style={modalStyles.previewImage}
                  />
                )}
                <h4 style={modalStyles.previewPostTitle}>
                  {selectedPostPreview.title}
                </h4>
                <p style={modalStyles.previewPostDate}>
                  {formatDate(
                    selectedPostPreview.created_at ||
                      selectedPostPreview.createdAt
                  )}
                </p>
                <p style={modalStyles.previewPostDescription}>
                  {selectedPostPreview.description ||
                    "Sem descrição disponível"}
                </p>
                <button
                  onClick={() => handleSelectPost(selectedPostPreview)}
                  style={modalStyles.selectButton}
                >
                  <i className="fa-solid fa-check"></i> Selecionar este Post
                </button>
              </div>
            ) : (
              <div style={modalStyles.paginationPlaceholder}>
                <i
                  className="fa-solid fa-hand-pointer"
                  style={{ fontSize: "48px", opacity: 0.3, marginBottom: "16px" }}
                ></i>
                <p>Clique em um post para visualizar</p>
              </div>
            )}

            {/* PAGINATION */}
            <div style={modalStyles.paginationContainerBottom}>
              <div style={modalStyles.paginationInfo}>
                <span>
                  Página {pagination.currentPage} de {pagination.totalPages}
                </span>
                <span style={{ marginLeft: "8px", color: "#94a3b8" }}>
                  ({pagination.totalItems} posts)
                </span>
              </div>
              <div style={modalStyles.paginationButtons}>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  style={
                    currentPage === 1
                      ? { ...modalStyles.paginationButton, ...modalStyles.paginationButtonDisabled }
                      : modalStyles.paginationButton
                  }
                >
                  <i className="fa-solid fa-chevron-left"></i>
                </button>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === pagination.totalPages}
                  style={
                    currentPage === pagination.totalPages
                      ? { ...modalStyles.paginationButton, ...modalStyles.paginationButtonDisabled }
                      : modalStyles.paginationButton
                  }
                >
                  <i className="fa-solid fa-chevron-right"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
