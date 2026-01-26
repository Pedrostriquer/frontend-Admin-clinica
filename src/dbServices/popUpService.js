import api from "./api/api";

const popUpService = {
  getPopUpsPaged: async (page = 1, pageSize = 10, searchTerm = "") => {
    const response = await api.get(
      `PopUp/paged?page=${page}&pageSize=${pageSize}&search=${searchTerm}`
    );
    return response.data;
  },

  getPopUpById: async (id) => {
    const response = await api.get(`PopUp/${id}`);
    return response.data;
  },

  getPopUpResponses: async (popUpId, page = 1, pageSize = 10) => {
    const response = await api.get(
      `PopUp/${popUpId}/responses?page=${page}&pageSize=${pageSize}`
    );
    return response.data;
  },

  toggleResponseCommunication: async (responseId) => {
    const response = await api.patch(
      `PopUp/responses/${responseId}/toggle-communication`
    );
    return response.data;
  },

  getPopUpStats: async () => {
    const response = await api.get("PopUp/stats");
    return response.data;
  },

  createPopUp: async (payload) => {
    const response = await api.post("PopUp", payload);
    return response.data;
  },

  deletePopUp: async (id) => {
    const response = await api.delete(`PopUp/${id}`);
    return response.data;
  },

  togglePopUpActive: async (id) => {
    const response = await api.patch(`PopUp/${id}/toggle-active`);
    return response.data;
  },
};

export default popUpService;
