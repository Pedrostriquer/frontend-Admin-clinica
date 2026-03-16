import React, { useState, useEffect } from "react";
import styles from "./BlogGemCapitalStyle";
import PostsList from "./PostsList";
import CategoriesList from "./CategoriesList";
import PixelsList from "./PixelsList";
import CreatePostModal from "./CreatePostModal";
import ViewPostModal from "./ViewPostModal";
import CreateCategoryModal from "./CreateCategoryModal";
import CreatePixelModal from "./CreatePixelModal";
import gemCapitalBlogServices from "../../../dbServices/gemCapitalBlogServices";

const BlogGemCapitalPage = () => {
  const [activeTab, setActiveTab] = useState("posts"); // "posts", "categories" ou "pixels"
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pixels, setPixels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);
  const [showViewPostModal, setShowViewPostModal] = useState(false);
  const [showCreateCategoryModal, setShowCreateCategoryModal] = useState(false);
  const [showCreatePixelModal, setShowCreatePixelModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingPixel, setEditingPixel] = useState(null);
  const [isLoadingPost, setIsLoadingPost] = useState(false);
  const [isLoadingCategory, setIsLoadingCategory] = useState(false);
  const [isLoadingPixel, setIsLoadingPixel] = useState(false);
  const [loadingPostId, setLoadingPostId] = useState(null);
  const [loadingCategoryId, setLoadingCategoryId] = useState(null);
  const [loadingPixelId, setLoadingPixelId] = useState(null);
  const [filters, setFilters] = useState({
    active: null,
    createdFromDate: null,
    createdToDate: null,
    sortBy: null,
  });

  // Injetar animações globais e estilos responsivos
  useEffect(() => {
    if (!document.getElementById("blog-gemcapital-animations")) {
      const styleTag = document.createElement("style");
      styleTag.id = "blog-gemcapital-animations";
      styleTag.innerHTML = `
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

      `;
      document.head.appendChild(styleTag);
    }
  }, []);

  // Buscar posts, categorias e pixels ao carregar
  useEffect(() => {
    fetchPosts();
    fetchCategories();
    fetchPixels();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const data = await gemCapitalBlogServices.getAllPosts();
      setPosts(data || []);
    } catch (error) {
      console.error("Erro ao buscar posts:", error);
      alert("Erro ao buscar posts");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await gemCapitalBlogServices.getAllCategories();
      setCategories(data || []);
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
    }
  };

  const fetchPixels = async () => {
    try {
      const data = await gemCapitalBlogServices.getAllPixels();
      setPixels(data || []);
    } catch (error) {
      console.error("Erro ao buscar pixels:", error);
    }
  };

  const handleCreatePost = () => {
    setEditingPost(null);
    setShowCreatePostModal(true);
  };

  const handleEditPost = (post) => {
    setEditingPost(post);
    setShowCreatePostModal(true);
  };

  const handleViewPost = (post) => {
    setSelectedPost(post);
    setShowViewPostModal(true);
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Tem certeza que deseja deletar este post?")) return;

    setLoadingPostId(postId);
    try {
      await gemCapitalBlogServices.deletePost(postId);
      await fetchPosts();
      alert("Post deletado com sucesso!");
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao deletar post");
    } finally {
      setLoadingPostId(null);
    }
  };

  const handleSavePost = async (postData) => {
    setIsLoadingPost(true);
    try {
      if (editingPost) {
        await gemCapitalBlogServices.updatePost(editingPost.id, postData);
      } else {
        await gemCapitalBlogServices.createPost(postData);
      }
      setShowCreatePostModal(false);
      await fetchPosts();
      alert(editingPost ? "Post atualizado!" : "Post criado com sucesso!");
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao salvar post");
    } finally {
      setIsLoadingPost(false);
    }
  };

  const handleCreateCategory = () => {
    setEditingCategory(null);
    setShowCreateCategoryModal(true);
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setShowCreateCategoryModal(true);
  };

  const handleDeleteCategory = async (categoryId, movePostsToCategoryId = null, deleteAllPosts = false) => {
    setLoadingCategoryId(categoryId);
    try {
      await gemCapitalBlogServices.deleteCategoryWithAction(
        categoryId,
        movePostsToCategoryId,
        deleteAllPosts
      );
      await fetchCategories();
      alert("Categoria deletada com sucesso!");
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao deletar categoria");
    } finally {
      setLoadingCategoryId(null);
    }
  };

  const handleSaveCategory = async (categoryData) => {
    setIsLoadingCategory(true);
    try {
      if (editingCategory) {
        await gemCapitalBlogServices.updateCategory(editingCategory.id, categoryData);
      } else {
        await gemCapitalBlogServices.createCategory(categoryData);
      }
      setShowCreateCategoryModal(false);
      await fetchCategories();
      alert(editingCategory ? "Categoria atualizada!" : "Categoria criada com sucesso!");
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao salvar categoria");
    } finally {
      setIsLoadingCategory(false);
    }
  };

  const handleCreatePixel = () => {
    setEditingPixel(null);
    setShowCreatePixelModal(true);
  };

  const handleEditPixel = (pixel) => {
    setEditingPixel(pixel);
    setShowCreatePixelModal(true);
  };

  const handleDeletePixel = async (pixelId) => {
    if (!window.confirm("Tem certeza que deseja deletar este pixel?")) return;

    setLoadingPixelId(pixelId);
    try {
      await gemCapitalBlogServices.deletePixel(pixelId);
      await fetchPixels();
      alert("Pixel deletado com sucesso!");
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao deletar pixel");
    } finally {
      setLoadingPixelId(null);
    }
  };

  const handleTogglePixel = async (pixelId) => {
    setLoadingPixelId(pixelId);
    try {
      await gemCapitalBlogServices.togglePixel(pixelId);
      await fetchPixels();
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao alternar status do pixel");
    } finally {
      setLoadingPixelId(null);
    }
  };

  const handleSavePixel = async (pixelData) => {
    setIsLoadingPixel(true);
    try {
      if (editingPixel) {
        await gemCapitalBlogServices.updatePixel(editingPixel.id, pixelData);
      } else {
        await gemCapitalBlogServices.createPixel(pixelData);
      }
      setShowCreatePixelModal(false);
      await fetchPixels();
      alert(editingPixel ? "Pixel atualizado!" : "Pixel criado com sucesso!");
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao salvar pixel");
    } finally {
      setIsLoadingPixel(false);
    }
  };

  const handleFilterChange = async (newFilters) => {
    setFilters(newFilters);
    setLoading(true);
    try {
      const data = await gemCapitalBlogServices.getPostsPaginated(
        1, // Reset to page 1 when filters change
        20,
        null, // categoryId
        null, // searchTerm
        newFilters.active,
        newFilters.createdFromDate,
        newFilters.createdToDate,
        newFilters.sortBy
      );
      setPosts(data.items || []);
    } catch (error) {
      console.error("Erro ao aplicar filtros:", error);
      alert("Erro ao aplicar filtros");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Gerenciador de Blog GemCapital</h1>
        <p style={styles.subtitle}>Gerencie posts, categorias e conteúdo visual</p>
      </div>

      {/* Tabs */}
      <div style={styles.tabsContainer}>
        <button
          style={{
            ...styles.tabButton,
            ...(activeTab === "posts" ? styles.tabButtonActive : {}),
          }}
          onClick={() => setActiveTab("posts")}
        >
          📝 Posts ({posts.length})
        </button>
        <button
          style={{
            ...styles.tabButton,
            ...(activeTab === "categories" ? styles.tabButtonActive : {}),
          }}
          onClick={() => setActiveTab("categories")}
        >
          📂 Categorias ({categories.length})
        </button>
        <button
          style={{
            ...styles.tabButton,
            ...(activeTab === "pixels" ? styles.tabButtonActive : {}),
          }}
          onClick={() => setActiveTab("pixels")}
        >
          🎯 Pixels ({pixels.length})
        </button>
      </div>

      {/* Content */}
      <div style={styles.contentArea}>
        {activeTab === "posts" && (
          <PostsList
            posts={posts}
            loading={loading}
            onCreatePost={handleCreatePost}
            onEditPost={handleEditPost}
            onViewPost={handleViewPost}
            onDeletePost={handleDeletePost}
            categories={categories}
            loadingPostId={loadingPostId}
            onFilterChange={handleFilterChange}
          />
        )}

        {activeTab === "categories" && (
          <CategoriesList
            categories={categories}
            loading={loading}
            onCreateCategory={handleCreateCategory}
            onEditCategory={handleEditCategory}
            onDeleteCategory={handleDeleteCategory}
            loadingCategoryId={loadingCategoryId}
          />
        )}

        {activeTab === "pixels" && (
          <PixelsList
            pixels={pixels}
            loading={loading}
            onCreatePixel={handleCreatePixel}
            onEditPixel={handleEditPixel}
            onDeletePixel={handleDeletePixel}
            onTogglePixel={handleTogglePixel}
            loadingPixelId={loadingPixelId}
          />
        )}
      </div>

      {/* Modals */}
      {showCreatePostModal && (
        <CreatePostModal
          post={editingPost}
          categories={categories}
          onClose={() => setShowCreatePostModal(false)}
          onSave={handleSavePost}
          isLoading={isLoadingPost}
          posts={posts}
        />
      )}

      {showViewPostModal && selectedPost && (
        <ViewPostModal post={selectedPost} onClose={() => setShowViewPostModal(false)} />
      )}

      {showCreateCategoryModal && (
        <CreateCategoryModal
          category={editingCategory}
          onClose={() => setShowCreateCategoryModal(false)}
          onSave={handleSaveCategory}
          isLoading={isLoadingCategory}
          totalCategories={categories.length}
        />
      )}

      {showCreatePixelModal && (
        <CreatePixelModal
          pixel={editingPixel}
          onClose={() => setShowCreatePixelModal(false)}
          onSave={handleSavePixel}
          isLoading={isLoadingPixel}
        />
      )}
    </div>
  );
};

export default BlogGemCapitalPage;
