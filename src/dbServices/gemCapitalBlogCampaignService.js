import api from "./api/api";

const gemCapitalBlogCampaignService = {
  // Get cron configuration
  getCronConfig: async () => {
    try {
      const response = await api.get("/GemCapitalBlogCampaign/cron-config");
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar configuração do cron:", error);
      throw error;
    }
  },

  // Update cron configuration
  updateCronConfig: async (config) => {
    try {
      const response = await api.put(
        "/GemCapitalBlogCampaign/cron-config",
        config
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar configuração do cron:", error);
      throw error;
    }
  },

  getExecutionTimeline: async (filters) => {
    try {
      const response = await api.get("/GemCapitalBlogCampaign/timeline", {
        params: {
          page: filters.page || 1,
          pageSize: filters.pageSize || 10,
          search: filters.search,
          status: filters.status,
          startDate: filters.startDate,
          endDate: filters.endDate,
          orderBy: filters.orderBy || "desc",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar timeline de execuções:", error);
      throw error;
    }
  },

  getExecutionDetail: async (executionId) => {
    try {
      const response = await api.get(
        `/GemCapitalBlogCampaign/execution/${executionId}`
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar detalhes da execução:", error);
      throw error;
    }
  },

  // Get campaign configuration
  getCampaignConfig: async () => {
    try {
      const response = await api.get("/GemCapitalBlogCampaign/campaign-config");
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar configuração da campanha:", error);
      throw error;
    }
  },

  // Update campaign configuration
  updateCampaignConfig: async (config) => {
    try {
      const response = await api.put(
        "/GemCapitalBlogCampaign/campaign-config",
        config
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar configuração da campanha:", error);
      throw error;
    }
  },

  // Clear last executed date (remove lock)
  clearLastExecutedDate: async () => {
    try {
      const response = await api.post(
        "/GemCapitalBlogCampaign/cron-config/clear-execution-date"
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao limpar data de execução:", error);
      throw error;
    }
  },

  // Send campaign manually (admin force)
  sendCampaignAdminForce: async (updateExecutionLock = true) => {
    try {
      const response = await api.post(
        "/GemCapitalBlogCampaign/send-campaign-admin-force",
        {
          update_execution_lock: updateExecutionLock,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao disparar campanha manualmente:", error);
      throw error;
    }
  },
};

export default gemCapitalBlogCampaignService;
