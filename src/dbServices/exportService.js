import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api";

const exportService = {
  // Exportar Melhores Clientes
  exportBestClients: async (format = "excel") => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/export/best-clients/${format}`,
        {
          responseType: "blob",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
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
      const response = await axios.get(
        `${API_BASE_URL}/export/recent-sales/${format}`,
        {
          responseType: "blob",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
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
      const response = await axios.get(
        `${API_BASE_URL}/export/recent-withdrawals/${format}`,
        {
          responseType: "blob",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
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
