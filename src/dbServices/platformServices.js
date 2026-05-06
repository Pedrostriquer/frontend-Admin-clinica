import api from "./api/api";

const platformServices = {
  getDashboardData: async () => {
    try {
      const response = await api.get("platformadminconfig");
      console.log(response.data)
      return response.data;
    } catch (error) {
      console.error("Error fetching sidebar config:", error);
      throw error;
    }
  },

  getRevenueHistory: async ({ period = "6m", startDate, endDate } = {}) => {
    try {
      const params = { period };
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      const response = await api.get("platformadminconfig/revenue-history", {
        params,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching revenue history:", error);
      throw error;
    }
  },
  updateSidebarItemState: async (itemName, avaliable) => {
    try {
      const response = await api.patch(
        `platformconfig/sidebar/${encodeURIComponent(itemName)}`,
        { avaliable }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating sidebar item:", error);
      throw error;
    }
  },
};

export default platformServices;