import api from "./api/api";

const blogGemCapitalAffiliateDownloads = {
  // Search affiliate downloads with pagination and sorting
  search: async (
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

      const response = await api.get("GemCapitalAffiliatesDrive/search", {
        params,
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar affiliate downloads:", error);
      throw error;
    }
  },

  // Get a single affiliate download by ID
  getById: async (id) => {
    try {
      const response = await api.get(`GemCapitalAffiliatesDrive/${id}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar affiliate download:", error);
      throw error;
    }
  },

  // Create a new affiliate download
  create: async (downloadData) => {
    try {
      const response = await api.post(
        "GemCapitalAffiliatesDrive",
        downloadData
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao criar affiliate download:", error);
      throw error.response?.data || error;
    }
  },

  // Update an affiliate download
  update: async (id, updateData) => {
    try {
      const response = await api.put(
        `GemCapitalAffiliatesDrive/${id}`,
        updateData
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar affiliate download:", error);
      throw error.response?.data || error;
    }
  },

  // Delete an affiliate download
  delete: async (id) => {
    try {
      await api.delete(`GemCapitalAffiliatesDrive/${id}`);
      return true;
    } catch (error) {
      console.error("Erro ao deletar affiliate download:", error);
      throw error.response?.data || error;
    }
  },

  // Upload a file to Firebase
  // Returns the public file URL
  uploadFile: async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await api.post(
        "GemCapitalAffiliatesDrive/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao fazer upload do arquivo:", error);
      throw error.response?.data || error;
    }
  },

  // Increment the downloads count for an affiliate download
  incrementDownloads: async (id) => {
    try {
      const response = await api.post(
        `GemCapitalAffiliatesDrive/${id}/increment-downloads`
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao incrementar downloads:", error);
      throw error.response?.data || error;
    }
  },

  // Delete a file from Firebase (called when replacing file during edit)
  deleteFile: async (fileUrl) => {
    try {
      await api.delete("GemCapitalAffiliatesDrive/delete-file", {
        data: { fileUrl },
      });
      return true;
    } catch (error) {
      console.error("Erro ao deletar arquivo:", error);
      throw error.response?.data || error;
    }
  },

  // Get all leads for a specific download item with filtering and pagination
  getLeadsByDownloadItem: async (
    downloadItemId,
    searchTerm = null,
    page = 1,
    pageSize = 10,
    orderBy = "createdAt",
    orderDirection = "desc",
    isAffiliate = null
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

      if (isAffiliate !== null && isAffiliate !== undefined) {
        params.isAffiliate = isAffiliate;
      }

      const response = await api.get(
        `BlogGemCapitalDownloadLead/download-items/${downloadItemId}/leads`,
        { params }
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar leads do download:", error);
      throw error;
    }
  },

  // Mark a lead as contacted
  markLeadAsContacted: async (leadId) => {
    try {
      const response = await api.post(
        `BlogGemCapitalDownloadLead/${leadId}/mark-as-contacted`
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao marcar lead como contatado:", error);
      throw error.response?.data || error;
    }
  },

  // Delete a lead
  deleteLead: async (leadId) => {
    try {
      await api.delete(`BlogGemCapitalDownloadLead/${leadId}`);
      return true;
    } catch (error) {
      console.error("Erro ao deletar lead:", error);
      throw error.response?.data || error;
    }
  },
};

export default blogGemCapitalAffiliateDownloads;
