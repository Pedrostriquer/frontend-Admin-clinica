// src/dbServices/adminService.js

import api from "./api/api";

const adminServices = {
  getAllAdmins: async () => {
    try {
      const response = await api.get("admin");
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar usuários administradores:", error);
      throw error;
    }
  },

  getCurrentAdmin: async () => {
    try {
      const response = await api.get("admin/me");
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar dados do admin logado:", error);
      throw error;
    }
  },

  // --- NOVO MÉTODO ADICIONADO ---
  createAdmin: async (userData) => {
    try {
      // O endpoint conforme sua documentação
      const response = await api.post("admin", userData);
      return response.data;
    } catch (error) {
      console.error("Erro ao criar novo admin:", error);
      throw error;
    }
  }
};

export default adminServices;