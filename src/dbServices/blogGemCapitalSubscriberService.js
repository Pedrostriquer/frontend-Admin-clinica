import api from "./api/api";

const blogGemCapitalSubscriberService = {
  // Get dashboard statistics
  getDashboardStats: async () => {
    try {
      const response = await api.get(
        "BlogGemCapitalSubscribers/dashboard/stats"
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar dashboard stats:", error);
      throw error;
    }
  },

  // Search subscribers with pagination
  searchSubscribers: async (
    searchTerm = null,
    page = 1,
    pageSize = 10,
    orderBy = "createdAt",
    orderDirection = "desc"
  ) => {
    try {
      const params = {
        page,
        pageSize,
        orderBy,
        orderDirection,
      };

      if (searchTerm) {
        params.searchTerm = searchTerm;
      }

      const response = await api.get("BlogGemCapitalSubscribers/search", {
        params,
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar assinantes:", error);
      throw error;
    }
  },

  // Create subscriber
  createSubscriber: async (subscriberData) => {
    try {
      const response = await api.post(
        "BlogGemCapitalSubscribers",
        subscriberData
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao criar assinante:", error);
      throw error.response?.data || error;
    }
  },

  // Get subscriber by ID
  getSubscriberById: async (id) => {
    try {
      const response = await api.get(`BlogGemCapitalSubscribers/${id}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar assinante:", error);
      throw error;
    }
  },

  // Update subscriber (status and notes - admin only)
  updateSubscriber: async (id, updateData) => {
    try {
      const response = await api.put(
        `BlogGemCapitalSubscribers/${id}`,
        updateData
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar assinante:", error);
      throw error.response?.data || error;
    }
  },

  // Delete subscriber (admin only)
  deleteSubscriber: async (id) => {
    try {
      await api.delete(`BlogGemCapitalSubscribers/${id}`);
      return true;
    } catch (error) {
      console.error("Erro ao deletar assinante:", error);
      throw error.response?.data || error;
    }
  },
};

export default blogGemCapitalSubscriberService;
