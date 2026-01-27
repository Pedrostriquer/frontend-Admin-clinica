import api from "./api/api";

const blogAddsService = {
  getAllAdds: async () => {
    try {
      const response = await api.get("blog-adds");
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar anúncios:", error);
      throw error;
    }
  },

  createAdd: async (addData) => {
    try {
      const response = await api.post("blog-adds", addData);
      return response.data;
    } catch (error) {
      console.error("Erro ao criar anúncio:", error);
      throw error;
    }
  },

  deleteAdd: async (id) => {
    try {
      await api.delete(`blog-adds/${id}`);
    } catch (error) {
      console.error("Erro ao deletar anúncio:", error);
      throw error;
    }
  },

  uploadAddImage: async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await api.post("blog-adds/upload-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data.imageUrl;
    } catch (error) {
      console.error("Erro no upload da imagem do anúncio:", error);
      throw error;
    }
  },
};

export default blogAddsService;
