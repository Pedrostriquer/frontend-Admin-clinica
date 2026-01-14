import React, { useState, useEffect, useCallback } from 'react';
import leadsService from '../../../dbServices/leadsService';
import './LeadsPage.css';

// ===================================================
// COMPONENTE HELPER PARA O BOTÃO DE STATUS (TOGGLE)
// ===================================================
const StatusToggleButton = ({ lead, onUpdate }) => {
  const isContacted = lead.contacted;
  const actionText = isContacted ? "Marcar como não contactado" : "Marcar como contactado";
  const iconClass = isContacted ? "fa-solid fa-xmark" : "fa-solid fa-check";
  const buttonClass = isContacted ? "contacted" : "uncontacted";

  return (
    <button 
      onClick={(e) => { e.stopPropagation(); onUpdate(lead.id, !isContacted); }} 
      className={`LeadsPage-action-button LeadsPage-status-button ${buttonClass}`}
      title={actionText}
    >
      <i className={iconClass}></i>
    </button>
  );
};

// ===================
// COMPONENTE DO MODAL
// ===================
const LeadDetailModal = ({ lead, onClose, onUpdate, onDelete }) => {
  if (!lead) return null;

  const handleWhatsappClick = () => {
    const phoneNumber = `55${lead.phone.replace(/\D/g, '')}`;
    window.open(`https://wa.me/${phoneNumber}`, '_blank');
  };

  return (
    <div className="LeadsPage-modal-backdrop" onClick={onClose}>
      <div className="LeadsPage-modal-content" onClick={e => e.stopPropagation()}>
        <div className="LeadsPage-modal-header">
          <h2>Detalhes do Lead</h2>
          <button onClick={onClose} className="LeadsPage-modal-close-button">&times;</button>
        </div>
        <div className="LeadsPage-modal-body">
          <div className="LeadsPage-info-grid">
            <div className="LeadsPage-info-item"><label>Nome</label><p>{lead.name}</p></div>
            <div className="LeadsPage-info-item"><label>Email</label><p>{lead.email}</p></div>
            <div className="LeadsPage-info-item"><label>Telefone</label><p>{lead.phone}</p></div>
            <div className="LeadsPage-info-item"><label>Cidade de Origem</label><p>{lead.fromCity || 'N/A'}</p></div>
            <div className="LeadsPage-info-item"><label>Data da Simulação</label><p>{new Date(lead.dateCreated).toLocaleString()}</p></div>
            <div className="LeadsPage-info-item"><label>Status</label><p><span className={`LeadsPage-status-badge LeadsPage-status-${lead.contacted}`}>{lead.contacted ? 'Contactado' : 'Não Contactado'}</span></p></div>
          </div>
        </div>
        <div className="LeadsPage-modal-footer">
          <div className="actions-left">
            <button onClick={() => onDelete(lead.id)} className="LeadsPage-modal-action-button LeadsPage-modal-delete"><i className="fa-solid fa-trash-can"></i>Excluir</button>
          </div>
          <div className="actions-right">
            <button onClick={() => onUpdate(lead.id, !lead.contacted)} className="LeadsPage-modal-action-button LeadsPage-modal-status">
              Marcar como {lead.contacted ? '"Não Contactado"' : '"Contactado"'}
            </button>
            <button onClick={handleWhatsappClick} className="LeadsPage-modal-action-button LeadsPage-modal-whatsapp">
              <i className="fa-brands fa-whatsapp"></i> WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ===================
// COMPONENTE PRINCIPAL
// ===================
function LeadsPage() {
  const [leads, setLeads] = useState([]);
  // Inicializamos com valores seguros. PageSize padrão é 10.
  const [meta, setMeta] = useState({ PageNumber: 1, PageSize: 10 });
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedLead, setSelectedLead] = useState(null);

  // Debounce da busca
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Função de busca
  const fetchLeads = useCallback(async (pageNumber = 1) => {
    setIsLoading(true);
    try {
      const response = await leadsService.getAllLeads({ pageNumber, searchTerm: debouncedSearch, status: statusFilter });
      setLeads(response.data);
      // Atualiza o meta com o que vier do service (seja real ou o "fake" do contorno)
      setMeta(prev => ({ ...prev, ...response.meta }));
    } catch (error) {
      console.error("Falha ao buscar leads.");
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, statusFilter]);

  useEffect(() => { fetchLeads(1); }, [debouncedSearch, statusFilter, fetchLeads]);

  // Atualizar status
  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await leadsService.updateLeadStatus(id, newStatus);
      if (selectedLead && selectedLead.id === id) {
          setSelectedLead(prev => ({ ...prev, contacted: newStatus }));
      }
      fetchLeads(meta.PageNumber);
    } catch (error) {
      alert('Falha ao atualizar o status.');
    }
  };

  // Deletar Lead
  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este lead? Esta ação não pode ser desfeita.')) {
      try {
        await leadsService.deleteLead(id);
        fetchLeads(meta.PageNumber);
        setSelectedLead(null);
      } catch (error) {
        alert('Falha ao excluir o lead.');
      }
    }
  };

  // Mudança de página
  const handlePageChange = (newPage) => {
    if (newPage >= 1) {
      fetchLeads(newPage);
    }
  };

  return (
    <div className="LeadsPage-container">
      {selectedLead && <LeadDetailModal lead={selectedLead} onClose={() => setSelectedLead(null)} onUpdate={handleUpdateStatus} onDelete={handleDelete} />}
      
      <div className="LeadsPage-header"><h1>Leads da Simulação</h1></div>
      
      <div className="LeadsPage-filters-container">
        <input type="text" className="LeadsPage-search-input" placeholder="Buscar por nome..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        <select className="LeadsPage-status-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="">Todos os Status</option>
          <option value="uncontacted">Não Contactado</option>
        </select>
      </div>

      <div className="LeadsPage-table-wrapper">
        <table className="LeadsPage-table">
          <thead>
            <tr><th>Nome</th><th>Data</th><th>Origem</th><th>Status</th><th>Ações</th></tr>
          </thead>
          <tbody>
            {isLoading ? (
                <tr><td colSpan="5" style={{textAlign: 'center', padding: '2rem'}}>Carregando...</td></tr>
            ) : leads.length === 0 ? (
                <tr><td colSpan="5" style={{textAlign: 'center', padding: '2rem'}}>Nenhum lead encontrado.</td></tr>
            ) : (
                leads.map(lead => (
                <tr key={lead.id} onClick={() => setSelectedLead(lead)}>
                    <td>{lead.name}</td>
                    <td>{new Date(lead.dateCreated).toLocaleDateString()}</td>
                    <td>{lead.fromCity || 'N/A'}</td>
                    <td><span className={`LeadsPage-status-badge LeadsPage-status-${lead.contacted}`}>{lead.contacted ? 'Contactado' : 'Não Contactado'}</span></td>
                    <td onClick={e => e.stopPropagation()}>
                    <div className="LeadsPage-actions-cell">
                        <button onClick={() => window.open(`https://wa.me/55${lead.phone.replace(/\D/g, '')}`, '_blank')} className="LeadsPage-action-button LeadsPage-whatsapp-button" title="Chamar no WhatsApp"><i className="fa-brands fa-whatsapp"></i></button>
                        <StatusToggleButton lead={lead} onUpdate={handleUpdateStatus} />
                    </div>
                    </td>
                </tr>
                ))
            )}
          </tbody>
        </table>
      </div>

      {/* --- PAGINAÇÃO ADAPTADA PARA FUNCIONAR SEM BACKEND CORS --- */}
      {/* Só mostra a barra se não for a página 1 vazia */}
      {(leads.length > 0 || meta.PageNumber > 1) && (
        <div className="LeadsPage-pagination-container">
          <button 
            className="LeadsPage-pagination-button" 
            onClick={() => handlePageChange(meta.PageNumber - 1)} 
            disabled={meta.PageNumber <= 1}
            title="Página Anterior"
          >
            <i className="fa-solid fa-angle-left"></i> Anterior
          </button>
          
          <span style={{margin: '0 1rem', color: '#6c757d', fontSize: '0.9rem', fontWeight: '600'}}>
            Página {meta.PageNumber}
          </span>

          <button 
            className="LeadsPage-pagination-button" 
            onClick={() => handlePageChange(meta.PageNumber + 1)} 
            // LÓGICA DE CONTORNO: Se vieram menos itens que o tamanho da página (10), 
            // significa que a lista acabou, então desabilita o botão.
            disabled={leads.length < meta.PageSize}
            title="Próxima Página"
          >
             Próxima <i className="fa-solid fa-angle-right"></i>
          </button>
        </div>
      )}
    </div>
  );
}

export default LeadsPage;