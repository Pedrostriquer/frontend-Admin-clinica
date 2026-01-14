import api from "./api/api"; 

const leadsService = {
  getAllLeads: async (filters) => {
    const { pageNumber = 1, pageSize = 10, searchTerm = '', status = '' } = filters;
    
    try {
      const params = new URLSearchParams({ pageNumber, pageSize });
      if (searchTerm) params.append('name', searchTerm);
      if (status === 'uncontacted') params.append('uncontactedOnly', true);
      
      const response = await api.get('SimulationRequesters', { params });
      
      // Tenta pegar o header
      const paginationHeader = response.headers['x-pagination'] || response.headers['X-Pagination'];

      let meta;
      
      if (paginationHeader) {
        meta = JSON.parse(paginationHeader);
      } else {
        // --- SOLUÇÃO DE CONTORNO (QUANDO NÃO TEM ACESSO AO BACKEND) ---
        // Criamos um meta artificial baseado na resposta
        meta = { 
          PageNumber: Number(pageNumber), 
          PageSize: Number(pageSize), 
          // Se vieram menos itens que o tamanho da página, sabemos que acabou.
          // Se vieram itens iguais ao tamanho, assumimos que pode ter mais.
          HasNext: response.data.length >= Number(pageSize),
          TotalPages: 9999 // Número fictício para não travar a lógica visual antiga
        };
      }
        
      return { data: response.data, meta };
      
    } catch (error) {
      console.error("Erro ao buscar os leads:", error.response?.data || error);
      throw error;
    }
  },
  
  // ... (mantenha updateLeadStatus e deleteLead iguais) ...
  updateLeadStatus: async (id, contacted) => {
    const response = await api.patch(`SimulationRequesters/${id}/contacted`, { contacted });
    return response.data;
  },
  deleteLead: async (id) => {
    const response = await api.delete(`SimulationRequesters/${id}`);
    return response.data;
  }
};

export default leadsService;