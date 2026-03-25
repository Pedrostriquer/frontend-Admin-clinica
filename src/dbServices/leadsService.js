import api from "./api/api"; 

const leadsService = {
  getAllLeads: async (filters) => {
    const {
      pageNumber = 1,
      pageSize = 10,
      searchTerm = '',
      status = '',
      startDate = null,
      endDate = null,
      sortBy = 'date_desc'
    } = filters;

    try {
      const params = new URLSearchParams({ pageNumber, pageSize });
      if (searchTerm) params.append('name', searchTerm);
      if (status === 'uncontacted') params.append('uncontactedOnly', true);
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      if (sortBy) params.append('sortBy', sortBy);

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

  // Novo método para obter métricas
  getMetrics: async (filters) => {
    const {
      searchTerm = '',
      status = '',
      startDate = null,
      endDate = null
    } = filters;

    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('name', searchTerm);
      if (status === 'uncontacted') params.append('uncontactedOnly', true);
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      console.log("📡 [leadsService.getMetrics] Chamando API com params:", params.toString());

      const response = await api.get('SimulationRequesters/metrics', { params });

      console.log("📊 [leadsService.getMetrics] Resposta da API:", response.data);

      return response.data;

    } catch (error) {
      console.error("❌ [leadsService.getMetrics] Erro ao buscar métricas:", error.response?.data || error);
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
  },

  // ============ PARA EXTRAÇÃO DE DADOS ============
  getLeads: async (searchTerm = '', pageNumber = 1, pageSize = 10) => {
    try {
      const params = new URLSearchParams({ pageNumber, pageSize });
      if (searchTerm) params.append('name', searchTerm);

      const response = await api.get('SimulationRequesters', { params });

      const paginationHeader = response.headers['x-pagination'] || response.headers['X-Pagination'];

      let pagination = { totalCount: 0, pageSize: pageSize, pageNumber: pageNumber };

      if (paginationHeader) {
        const meta = JSON.parse(paginationHeader);
        pagination = {
          totalCount: meta.TotalCount || 0,
          pageSize: meta.PageSize || pageSize,
          pageNumber: meta.PageNumber || pageNumber
        };
      } else {
        // Se não tiver header, assume que pode ter mais dados
        // Use o pageSize solicitado, não a quantidade de itens retornados
        pagination = {
          totalCount: response.data.length >= pageSize ? response.data.length * 2 : response.data.length,
          pageSize: pageSize,
          pageNumber: pageNumber
        };
      }

      return {
        items: response.data || [],
        totalCount: pagination.totalCount,
        pageSize: pagination.pageSize,
        pageNumber: pagination.pageNumber
      };

    } catch (error) {
      console.error("Erro ao buscar leads:", error);
      throw error;
    }
  }
};

export default leadsService;