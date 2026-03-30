import api from "./api/api";

const emailSenderService = {
  searchModels: async (searchTerm = "", pageNumber = 1, pageSize = 10) => {
    const response = await api.get("EmailSender/search", {
      params: { searchTerm, pageNumber, pageSize },
    });
    return response.data;
  },

  createModel: async (modelData) => {
    const response = await api.post("EmailSender/model", modelData);
    return response.data;
  },

  updateModel: async (id, modelData) => {
    const response = await api.put(`EmailSender/model/${id}`, modelData);
    return response.data;
  },

  getModelStats: async (id) => {
    const response = await api.get(`EmailSender/model/${id}/stats`);
    return response.data;
  },

  getCampaignsDashboard: async (page = 1, pageSize = 10, modelId = null) => {
    const response = await api.get("EmailSender/campaigns/dashboard", {
      params: { page, pageSize, modelId },
    });
    return response.data;
  },

  sendCampaign: async (
    modelId,
    campaignName,
    recipients,
    allClientsIncluded = false
  ) => {
    const response = await api.post(`EmailSender/send-by-model/${modelId}`, {
      campaignName,
      recipients,
      allClientsIncluded, // Agora o backend vai receber o booleano!
    });
    return response.data;
  },

  getCampaignDetails: async (campaignId) => {
    const response = await api.get(`EmailSender/campaign/${campaignId}/stats`);
    return response.data;
  },

  getCampaignRecipients: async (id, searchTerm, page, pageSize) => {
    const response = await api.get(`EmailSender/campaign/${id}/recipients`, {
      params: { searchTerm, page, pageSize },
    });
    return response.data;
  },

  getCampaignInteractions: async (id, type, searchTerm, page, pageSize) => {
    const response = await api.get(`EmailSender/campaign/${id}/interactions`, {
      params: { type, searchTerm, page, pageSize },
    });
    return response.data;
  },
};

export default emailSenderService;
