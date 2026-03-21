import api from "./api/api";

const extractDataServices = {
  // ============ CLIENTES ============
  downloadClientsFile: async (data, format = "csv") => {
    try {
      const response = await api.post(`export/clients/${format}`, data, {
        responseType: "blob",
      });
      return response;
    } catch (error) {
      console.error("Erro ao baixar arquivo de clientes:", error);
      throw error;
    }
  },

  // ============ CONSULTORES ============
  downloadConsultantsFile: async (data, format = "csv") => {
    try {
      const response = await api.post(`export/consultants/${format}`, data, {
        responseType: "blob",
      });
      return response;
    } catch (error) {
      console.error("Erro ao baixar arquivo de consultores:", error);
      throw error;
    }
  },

  // ============ CONTRATOS ============
  downloadContractsFile: async (data, format = "csv") => {
    try {
      const response = await api.post(`export/contracts/${format}`, data, {
        responseType: "blob",
      });
      return response;
    } catch (error) {
      console.error("Erro ao baixar arquivo de contratos:", error);
      throw error;
    }
  },

  // ============ SAQUES ============
  downloadWithdrawsFile: async (data, format = "csv") => {
    try {
      const response = await api.post(`export/withdraws/${format}`, data, {
        responseType: "blob",
      });
      return response;
    } catch (error) {
      console.error("Erro ao baixar arquivo de saques:", error);
      throw error;
    }
  },

  // ============ PRODUTOS ============
  downloadProductsFile: async (data, format = "csv") => {
    try {
      const response = await api.post(`export/products/${format}`, data, {
        responseType: "blob",
      });
      return response;
    } catch (error) {
      console.error("Erro ao baixar arquivo de produtos:", error);
      throw error;
    }
  },

  // ============ CATEGORIAS ============
  downloadCategoriesFile: async (data, format = "csv") => {
    try {
      const response = await api.post(`export/categories/${format}`, data, {
        responseType: "blob",
      });
      return response;
    } catch (error) {
      console.error("Erro ao baixar arquivo de categorias:", error);
      throw error;
    }
  },

  // ============ FORMULÁRIOS ============
  downloadFormsFile: async (data, format = "csv") => {
    try {
      const response = await api.post(`export/forms/${format}`, data, {
        responseType: "blob",
      });
      return response;
    } catch (error) {
      console.error("Erro ao baixar arquivo de formulários:", error);
      throw error;
    }
  },

  // ============ PROMOÇÕES ============
  downloadPromotionsFile: async (data, format = "csv") => {
    try {
      const response = await api.post(`export/promotions/${format}`, data, {
        responseType: "blob",
      });
      return response;
    } catch (error) {
      console.error("Erro ao baixar arquivo de promoções:", error);
      throw error;
    }
  },

  // ============ PEDIDOS ============
  downloadOrdersFile: async (data, format = "csv") => {
    try {
      const response = await api.post(`export/orders/${format}`, data, {
        responseType: "blob",
      });
      return response;
    } catch (error) {
      console.error("Erro ao baixar arquivo de pedidos:", error);
      throw error;
    }
  },

  // ============ LEADS SIMULAÇÃO ============
  downloadLeadsSimulationCsv: async (data, format = "csv") => {
    try {
      const response = await api.post(`export/leads-simulation/${format}`, data || [], {
        responseType: "blob",
      });
      return response;
    } catch (error) {
      console.error("Erro ao baixar arquivo de leads simulação:", error);
      throw error;
    }
  },

  // ============ MAPEAMENTO DE TIPOS DE DADOS ============
  getExportFunction: (dataType) => {
    const exportMap = {
      Clientes: extractDataServices.downloadClientsFile,
      Consultores: extractDataServices.downloadConsultantsFile,
      Contratos: extractDataServices.downloadContractsFile,
      Saques: extractDataServices.downloadWithdrawsFile,
      Produtos: extractDataServices.downloadProductsFile,
      Categorias: extractDataServices.downloadCategoriesFile,
      Formulários: extractDataServices.downloadFormsFile,
      Promoções: extractDataServices.downloadPromotionsFile,
      Pedidos: extractDataServices.downloadOrdersFile,
      "Leads Simulação": extractDataServices.downloadLeadsSimulationCsv,
    };
    return exportMap[dataType];
  },
};

export default extractDataServices;
