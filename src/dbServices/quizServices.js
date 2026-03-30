// src/dbServices/quizServices.js

import api from "./api/api";

const quizServices = {
  // ===== QUIZZES =====

  /**
   * Buscar todos os quizzes
   */
  getAllQuizzes: async () => {
    try {
      const response = await api.get("BlogGemCapital/BlogGemCapitalQuizzes");
      return response.data || [];
    } catch (error) {
      console.error("Erro ao buscar quizzes:", error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Buscar um quiz por ID
   */
  getQuizById: async (id) => {
    try {
      const response = await api.get(`BlogGemCapital/BlogGemCapitalQuizzes/${id}`);
      return response.data;
    } catch (error) {
      console.error(
        `Erro ao buscar quiz ${id}:`,
        error.response?.data || error.message
      );
      throw error;
    }
  },

  /**
   * Criar um novo quiz
   */
  createQuiz: async (quizData) => {
    try {
      // LOG: Mostrar dados antes de enviar
      console.log("\n" + "=".repeat(60));
      console.log("🔍 quizServices.createQuiz - Dados a enviar:");
      console.log("=".repeat(60));
      console.log("Objeto quizData:", quizData);
      console.log("JSON stringified:", JSON.stringify(quizData, null, 2));

      // Verificar tipos dos IDs ANTES do envio
      console.log("\n📊 TIPOS DOS IDs NO SERVICO:");
      if (quizData.questions) {
        quizData.questions.forEach((q, qIdx) => {
          console.log(`\n  Pergunta ${qIdx + 1}:`);
          if (q.alternatives) {
            q.alternatives.forEach((alt, aIdx) => {
              console.log(
                `    Alt[${aIdx}]: id="${alt.id}" (typeof: ${typeof alt.id}, constructor: ${alt.id?.constructor?.name})`
              );
            });
          }
        });
      }

      console.log("\n" + "=".repeat(60) + "\n");

      const response = await api.post(
        "BlogGemCapital/BlogGemCapitalQuizzes",
        quizData
      );
      return response.data;
    } catch (error) {
      console.error("❌ Erro ao criar quiz:", error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Atualizar um quiz
   */
  updateQuiz: async (id, quizData) => {
    try {
      const response = await api.put(
        `BlogGemCapital/BlogGemCapitalQuizzes/${id}`,
        quizData
      );
      return response.data;
    } catch (error) {
      console.error(
        `Erro ao atualizar quiz ${id}:`,
        error.response?.data || error.message
      );
      throw error;
    }
  },

  /**
   * Deletar um quiz
   */
  deleteQuiz: async (id) => {
    try {
      await api.delete(`BlogGemCapital/BlogGemCapitalQuizzes/${id}`);
    } catch (error) {
      console.error(
        `Erro ao deletar quiz ${id}:`,
        error.response?.data || error.message
      );
      throw error;
    }
  },

  /**
   * Ativar um quiz
   */
  activateQuiz: async (id) => {
    try {
      const response = await api.put(
        `BlogGemCapital/BlogGemCapitalQuizzes/${id}/activate`
      );
      return response.data;
    } catch (error) {
      console.error(
        `Erro ao ativar quiz ${id}:`,
        error.response?.data || error.message
      );
      throw error;
    }
  },

  /**
   * Desativar um quiz
   */
  deactivateQuiz: async (id) => {
    try {
      const response = await api.put(
        `BlogGemCapital/BlogGemCapitalQuizzes/${id}/deactivate`
      );
      return response.data;
    } catch (error) {
      console.error(
        `Erro ao desativar quiz ${id}:`,
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // ===== RESPOSTAS =====

  /**
   * Buscar TODAS as respostas de todos os quizzes
   */
  getAllResponses: async () => {
    try {
      const response = await api.get(
        `BlogGemCapital/BlogGemCapitalQuizResponses`
      );
      return response.data || [];
    } catch (error) {
      console.error(
        "Erro ao buscar todas as respostas:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  /**
   * Buscar respostas com filtros e paginação (recomendado)
   */
  getAllResponsesFiltered: async (filters = {}) => {
    try {
      const {
        searchName = null,
        status = null,
        sortOrder = "newest",
        dateFrom = null,
        dateTo = null,
        page = 1,
        pageSize = 20,
      } = filters;

      const params = new URLSearchParams();
      if (searchName) params.append("searchName", searchName);
      if (status) params.append("status", status);
      if (sortOrder) params.append("sortOrder", sortOrder);
      if (dateFrom) params.append("dateFrom", dateFrom);
      if (dateTo) params.append("dateTo", dateTo);
      params.append("page", page);
      params.append("pageSize", pageSize);

      const response = await api.get(
        `BlogGemCapital/BlogGemCapitalQuizResponses/filtered?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      console.error(
        "Erro ao buscar respostas com filtros:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  /**
   * Buscar respostas de um quiz específico
   */
  getQuizResponses: async (quizId) => {
    try {
      const response = await api.get(
        `BlogGemCapital/BlogGemCapitalQuizResponses/quiz/${quizId}`
      );
      return response.data || [];
    } catch (error) {
      console.error(
        `Erro ao buscar respostas do quiz ${quizId}:`,
        error.response?.data || error.message
      );
      throw error;
    }
  },

  /**
   * Buscar respostas de um quiz com filtros e paginação
   */
  getQuizResponsesFiltered: async (quizId, filters = {}) => {
    try {
      const {
        searchName = null,
        status = null,
        sortOrder = "newest",
        dateFrom = null,
        dateTo = null,
        page = 1,
        pageSize = 5,
      } = filters;

      const params = new URLSearchParams();
      params.append("quizId", quizId);
      if (searchName) params.append("searchName", searchName);
      if (status !== null && status !== undefined) params.append("status", status);
      if (sortOrder) params.append("sortOrder", sortOrder);
      if (dateFrom) params.append("dateFrom", dateFrom);
      if (dateTo) params.append("dateTo", dateTo);
      params.append("page", page);
      params.append("pageSize", pageSize);

      const response = await api.get(
        `BlogGemCapital/BlogGemCapitalQuizResponses/filtered?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      console.error(
        `Erro ao buscar respostas filtradas do quiz ${quizId}:`,
        error.response?.data || error.message
      );
      throw error;
    }
  },

  /**
   * Buscar detalhes de uma resposta
   */
  getResponseDetails: async (responseId) => {
    try {
      const response = await api.get(
        `BlogGemCapital/BlogGemCapitalQuizResponses/${responseId}/details`
      );
      return response.data;
    } catch (error) {
      console.error(
        `Erro ao buscar detalhes da resposta ${responseId}:`,
        error.response?.data || error.message
      );
      throw error;
    }
  },

  /**
   * Marcar resposta como contactada
   */
  markAsContacted: async (responseId) => {
    try {
      const response = await api.put(
        `BlogGemCapital/BlogGemCapitalQuizResponses/${responseId}/contact`
      );
      return response.data;
    } catch (error) {
      console.error(
        `Erro ao marcar resposta ${responseId} como contactada:`,
        error.response?.data || error.message
      );
      throw error;
    }
  },

  /**
   * Atualizar observações de uma resposta
   */
  updateObservations: async (responseId, observations) => {
    try {
      const response = await api.put(
        `BlogGemCapital/BlogGemCapitalQuizResponses/${responseId}/observations`,
        JSON.stringify(observations),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        `Erro ao atualizar observações da resposta ${responseId}:`,
        error.response?.data || error.message
      );
      throw error;
    }
  },

  /**
   * Atualizar qualidade do lead
   */
  updateLeadQuality: async (responseId, leadQuality) => {
    try {
      const response = await api.put(
        `BlogGemCapital/BlogGemCapitalQuizResponses/${responseId}/quality`,
        JSON.stringify(leadQuality),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        `Erro ao atualizar qualidade do lead ${responseId}:`,
        error.response?.data || error.message
      );
      throw error;
    }
  },

  /**
   * Atualizar perfil investidor
   */
  updateInvestorProfile: async (responseId, investorProfile) => {
    try {
      const response = await api.put(
        `BlogGemCapital/BlogGemCapitalQuizResponses/${responseId}/investor-profile`,
        JSON.stringify(investorProfile),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        `Erro ao atualizar perfil investidor ${responseId}:`,
        error.response?.data || error.message
      );
      throw error;
    }
  },

  /**
   * Deletar uma resposta
   */
  deleteResponse: async (responseId) => {
    try {
      await api.delete(
        `BlogGemCapital/BlogGemCapitalQuizResponses/${responseId}`
      );
    } catch (error) {
      console.error(
        `Erro ao deletar resposta ${responseId}:`,
        error.response?.data || error.message
      );
      throw error;
    }
  },
};

export default quizServices;
