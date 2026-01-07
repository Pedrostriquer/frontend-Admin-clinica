import api from './api/api';

const gemValueService = {
    // Busca todos os textos editáveis
    getAllTexts: async () => {
        try {
            const response = await api.get('EditableText');
            return response.data;
        } catch (error) {
            console.error("Erro ao buscar textos do GemValue:", error);
            throw error;
        }
    },

    // Atualiza um texto por ID
    updateText: async (id, sessionName, textContent) => {
        try {
            const response = await api.put(`EditableText/${id}`, {
                sessionName,
                textContent
            });
            return response.data;
        } catch (error) {
            console.error(`Erro ao atualizar a sessão ${sessionName}:`, error);
            throw error;
        }
    }
};

export default gemValueService;