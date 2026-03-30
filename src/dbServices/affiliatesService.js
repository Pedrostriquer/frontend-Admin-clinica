// src/dbServices/affiliateService.js

import api from "./api/api";

const affiliateService = {
  /**
   * Cria um novo afiliado (Rota pública)
   */
  createAffiliate: async (affiliateData) => {
    try {
      const response = await api.post("Affiliates", affiliateData);
      return response.data;
    } catch (error) {
      console.error(
        "Erro ao criar afiliado:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  /**
   * Busca afiliados com filtros avançados (Apenas Admin)
   * Suporta searchTerm (nome/email), status de contato, ordenação e paginação
   */
  searchAffiliates: async ({
    searchTerm,
    hasCNPJ,
    isContacted,
    order = "desc",
    pageNumber = 1,
    pageSize = 10,
  }) => {
    try {
      const response = await api.get("Affiliates/search", {
        params: {
          searchTerm,
          hasCNPJ,
          isContacted,
          order,
          pageNumber,
          pageSize,
        },
      });
      return response.data;
    } catch (error) {
      console.error(
        "Erro ao buscar afiliados:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  /**
   * Atualiza o status de contato e observações (Apenas Admin)
   */
  updateContactStatus: async (id, contactData) => {
    try {
      // contactData deve ser { isContacted: bool, observations: string }
      const response = await api.patch(
        `Affiliates/${id}/contact-status`,
        contactData
      );
      return response.data;
    } catch (error) {
      console.error(
        `Erro ao atualizar contato do afiliado ${id}:`,
        error.response?.data || error.message
      );
      throw error;
    }
  },

  /**
   * Obtém detalhes de um afiliado específico (Apenas Admin)
   */
  getAffiliateById: async (id) => {
    try {
      const response = await api.get(`Affiliates/${id}`);
      return response.data;
    } catch (error) {
      console.error(
        `Erro ao buscar afiliado ${id}:`,
        error.response?.data || error.message
      );
      throw error;
    }
  },

  /**
   * Obtém estatísticas gerais do programa de afiliados (Apenas Admin)
   */
  getStatistics: async (startDate, endDate) => {
    try {
      const response = await api.get("Affiliates/statistics", {
        params: { startDate, endDate },
      });
      return response.data;
    } catch (error) {
      console.error(
        "Erro ao buscar estatísticas de afiliados:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  /**
   * Atualização completa dos dados de um afiliado (Apenas Admin)
   */
  updateAffiliate: async (id, affiliateData) => {
    try {
      const response = await api.put(`Affiliates/${id}`, affiliateData);
      return response.data;
    } catch (error) {
      console.error(
        `Erro ao atualizar afiliado ${id}:`,
        error.response?.data || error.message
      );
      throw error;
    }
  },

  /**
   * Deleta um afiliado (Apenas Admin)
   */
  deleteAffiliate: async (id) => {
    try {
      await api.delete(`Affiliates/${id}`);
    } catch (error) {
      console.error(
        `Erro ao deletar afiliado ${id}:`,
        error.response?.data || error.message
      );
      throw error;
    }
  },
};

export default affiliateService;
