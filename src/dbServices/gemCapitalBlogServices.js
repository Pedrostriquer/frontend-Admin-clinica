// src/dbServices/gemCapitalBlogServices.js

import api from "./api/api";

const gemCapitalBlogServices = {
  // ===== POSTS =====

  /**
   * Buscar todos os posts com paginação
   */
  getAllPosts: async (page = 1, pageSize = 100) => {
    try {
      const response = await api.get(
        `blog-gemcapital/posts/paginated?page=${page}&pageSize=${pageSize}`
      );
      return response.data?.items || [];
    } catch (error) {
      console.error("Erro ao buscar posts:", error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Buscar um post por ID
   */
  getPostById: async (id) => {
    try {
      const response = await api.get(`blog-gemcapital/posts/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar post ${id}:`, error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Criar um novo post
   */
  createPost: async (postData) => {
    try {
      const response = await api.post("blog-gemcapital/posts", postData);
      return response.data;
    } catch (error) {
      console.error("Erro ao criar post:", error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Atualizar um post
   */
  updatePost: async (id, postData) => {
    try {
      const response = await api.put(`blog-gemcapital/posts/${id}`, postData);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar post ${id}:`, error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Deletar um post
   */
  deletePost: async (id) => {
    try {
      await api.delete(`blog-gemcapital/posts/${id}`);
    } catch (error) {
      console.error(`Erro ao deletar post ${id}:`, error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Buscar posts paginados com filtros
   */
  getPostsPaginated: async (
    page = 1,
    pageSize = 20,
    categoryId = null,
    searchTerm = null,
    active = null,
    createdFromDate = null,
    createdToDate = null,
    sortBy = null
  ) => {
    try {
      let url = `blog-gemcapital/posts/paginated?page=${page}&pageSize=${pageSize}`;
      if (categoryId) url += `&categoryId=${categoryId}`;
      if (searchTerm) url += `&searchTerm=${encodeURIComponent(searchTerm)}`;
      if (active !== null) url += `&active=${active}`;
      if (createdFromDate) url += `&createdFromDate=${createdFromDate.toISOString().split('T')[0]}`;
      if (createdToDate) url += `&createdToDate=${createdToDate.toISOString().split('T')[0]}`;
      if (sortBy) url += `&sortBy=${encodeURIComponent(sortBy)}`;

      const response = await api.get(url);
      return response.data || { items: [], totalItems: 0, totalPages: 0 };
    } catch (error) {
      console.error("Erro ao buscar posts paginados:", error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Buscar posts do carousel
   */
  getCarouselPosts: async () => {
    try {
      const response = await api.get("blog-gemcapital/posts/carousel");
      return response.data || [];
    } catch (error) {
      console.error("Erro ao buscar posts do carousel:", error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Incrementar views de um post (com prevenção de duplicata por IP)
   */
  incrementViews: async (postId) => {
    try {
      const response = await api.post(`blog-gemcapital/posts/${postId}/increment-views`);
      console.log(`Views incrementadas para post ${postId}:`, response.data?.message);
      return true;
    } catch (error) {
      console.error(`Erro ao incrementar views para post ${postId}:`, error.response?.data || error.message);
      // Não lançar erro - o rastreamento de views não deve quebrar a experiência do usuário
      return false;
    }
  },

  /**
   * Incrementar likes de um post
   */
  incrementLikes: async (postId) => {
    try {
      const response = await api.post(`blog-gemcapital/posts/${postId}/increment-likes`);
      console.log(`Likes incrementados para post ${postId}:`, response.data?.message);
      return true;
    } catch (error) {
      console.error(`Erro ao incrementar likes para post ${postId}:`, error.response?.data || error.message);
      return false;
    }
  },

  // ===== CATEGORIAS =====

  /**
   * Buscar todas as categorias
   */
  getAllCategories: async () => {
    try {
      const response = await api.get("blog-gemcapital/categories");
      return response.data || [];
    } catch (error) {
      console.error("Erro ao buscar categorias:", error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Buscar uma categoria por ID
   */
  getCategoryById: async (id) => {
    try {
      const response = await api.get(`blog-gemcapital/categories/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar categoria ${id}:`, error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Criar uma nova categoria
   */
  createCategory: async (categoryData) => {
    try {
      const response = await api.post("blog-gemcapital/categories", categoryData);
      return response.data;
    } catch (error) {
      console.error("Erro ao criar categoria:", error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Atualizar uma categoria
   */
  updateCategory: async (id, categoryData) => {
    try {
      const response = await api.put(`blog-gemcapital/categories/${id}`, categoryData);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar categoria ${id}:`, error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Deletar uma categoria
   */
  deleteCategory: async (id) => {
    try {
      await api.delete(`blog-gemcapital/categories/${id}`);
    } catch (error) {
      console.error(`Erro ao deletar categoria ${id}:`, error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Contar quantos posts estão associados a uma categoria
   */
  getPostsCountByCategory: async (categoryId) => {
    try {
      const response = await api.get(`blog-gemcapital/categories/${categoryId}/posts-count`);
      return response.data || 0;
    } catch (error) {
      console.error(`Erro ao contar posts da categoria ${categoryId}:`, error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Buscar posts associados a uma categoria
   */
  getPostsByCategory: async (categoryId) => {
    try {
      const response = await api.get(`blog-gemcapital/categories/${categoryId}/posts`);
      return response.data || [];
    } catch (error) {
      console.error(`Erro ao buscar posts da categoria ${categoryId}:`, error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Deletar categoria com ação (mover posts ou deletar)
   */
  deleteCategoryWithAction: async (id, movePostsToCategoryId = null, deleteAllPosts = false) => {
    try {
      let url = `blog-gemcapital/categories/${id}/delete-with-action?`;
      if (movePostsToCategoryId) url += `movePostsToCategoryId=${movePostsToCategoryId}`;
      if (deleteAllPosts) url += `${movePostsToCategoryId ? "&" : ""}deleteAllPosts=true`;
      await api.delete(url);
    } catch (error) {
      console.error(`Erro ao deletar categoria ${id}:`, error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Buscar categorias ativas
   */
  getActiveCategories: async () => {
    try {
      const response = await api.get("blog-gemcapital/categories?activeOnly=true");
      return response.data || [];
    } catch (error) {
      console.error("Erro ao buscar categorias ativas:", error.response?.data || error.message);
      throw error;
    }
  },

  // ===== PIXELS =====

  /**
   * Buscar todos os pixels
   */
  getAllPixels: async () => {
    try {
      const response = await api.get("blog-gemcapital/pixels");
      return response.data || [];
    } catch (error) {
      console.error("Erro ao buscar pixels:", error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Buscar um pixel por ID
   */
  getPixelById: async (id) => {
    try {
      const response = await api.get(`blog-gemcapital/pixels/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar pixel ${id}:`, error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Buscar pixels ativos
   */
  getActivePixels: async () => {
    try {
      const response = await api.get("blog-gemcapital/pixels/active");
      return response.data || [];
    } catch (error) {
      console.error("Erro ao buscar pixels ativos:", error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Buscar pixels por placement (head ou body)
   */
  getPixelsByPlacement: async (placement) => {
    try {
      const response = await api.get(`blog-gemcapital/pixels/placement/${placement}`);
      return response.data || [];
    } catch (error) {
      console.error(`Erro ao buscar pixels por placement ${placement}:`, error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Criar um novo pixel
   */
  createPixel: async (pixelData) => {
    try {
      const response = await api.post("blog-gemcapital/pixels", pixelData);
      return response.data;
    } catch (error) {
      console.error("Erro ao criar pixel:", error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Atualizar um pixel
   */
  updatePixel: async (id, pixelData) => {
    try {
      const response = await api.put(`blog-gemcapital/pixels/${id}`, pixelData);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar pixel ${id}:`, error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Deletar um pixel
   */
  deletePixel: async (id) => {
    try {
      await api.delete(`blog-gemcapital/pixels/${id}`);
    } catch (error) {
      console.error(`Erro ao deletar pixel ${id}:`, error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Alternar status ativo/inativo de um pixel
   */
  togglePixel: async (id) => {
    try {
      const response = await api.patch(`blog-gemcapital/pixels/${id}/toggle`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao alternar pixel ${id}:`, error.response?.data || error.message);
      throw error;
    }
  },
};

export default gemCapitalBlogServices;
