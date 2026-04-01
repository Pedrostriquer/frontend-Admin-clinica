import api from "./api/api";

const gemCapitalBlogLeadsPlanejadorService = {
  async getLeadsFiltered(params) {
    try {
      const queryParams = new URLSearchParams();

      if (params.searchTerm)
        queryParams.append("searchTerm", params.searchTerm);
      if (params.contacted !== null)
        queryParams.append("contacted", params.contacted);
      if (params.leadQuality !== null)
        queryParams.append("leadQuality", params.leadQuality);
      if (params.startDate) queryParams.append("startDate", params.startDate);
      if (params.endDate) queryParams.append("endDate", params.endDate);

      queryParams.append("planejadorType", params.simulationType);
      queryParams.append("pageNumber", params.pageNumber);
      queryParams.append("pageSize", params.pageSize);

      const response = await api.get(
        `PlanejadorLeads/search?${queryParams.toString()}`
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar leads filtrados:", error);
      throw error;
    }
  },

  async deleteLead(leadId) {
    try {
      const response = await api.delete(`PlanejadorLeads/${leadId}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao excluir lead:", error);
      throw error;
    }
  },

  async markAsContacted(leadId) {
    try {
      const response = await api.post(
        `PlanejadorLeads/${leadId}/marcar-contactado`
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar status de contato:", error);
      throw error;
    }
  },

  async updateQuality(leadId, quality) {
    try {
      const response = await api.post(`PlanejadorLeads/${leadId}/qualidade`, {
        leadQuality: quality,
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao salvar qualidade do lead:", error);
      throw error;
    }
  },
};

export default gemCapitalBlogLeadsPlanejadorService;
