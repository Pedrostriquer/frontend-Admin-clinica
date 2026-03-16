import api from "./api/api.js";

const exportService = {
  // Exportar Melhores Clientes
  exportBestClients: async (format = "excel") => {
    try {
      const response = await api.get(
        `export/best-clients/${format}`,
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `melhores-clientes_${new Date().toISOString().split("T")[0]}.${
          format === "csv" ? "csv" : "xlsx"
        }`
      );
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erro ao exportar melhores clientes:", error);
      throw error;
    }
  },

  // Exportar Vendas Recentes
  exportRecentSales: async (format = "excel") => {
    try {
      const response = await api.get(
        `export/recent-sales/${format}`,
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `vendas-recentes_${new Date().toISOString().split("T")[0]}.${
          format === "csv" ? "csv" : "xlsx"
        }`
      );
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erro ao exportar vendas recentes:", error);
      throw error;
    }
  },

  // Exportar Saques Recentes
  exportRecentWithdrawals: async (format = "excel") => {
    try {
      const response = await api.get(
        `export/recent-withdrawals/${format}`,
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `saques-recentes_${new Date().toISOString().split("T")[0]}.${
          format === "csv" ? "csv" : "xlsx"
        }`
      );
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erro ao exportar saques recentes:", error);
      throw error;
    }
  },
};

export default exportService;
