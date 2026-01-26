import React, { useState, useEffect, useCallback } from "react";
import "./PopUps.css";
import popUpService from "../../dbServices/popUpService";
import PopUpModal from "./PopUpModal";
import CreatePopUpModal from "./CreatePopUpModal";

const PopUps = () => {
  const [popUps, setPopUps] = useState([]);
  const [stats, setStats] = useState({ totalPopUps: 0, totalResponses: 0 });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [selectedPopUp, setSelectedPopUp] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [internalLoading, setInternalLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState({
    show: false,
    id: null,
    name: "",
  });

  const fetchData = useCallback(
    async (isInitial = false) => {
      if (isInitial) setLoading(true);
      else setInternalLoading(true);

      try {
        const [pagedData, statsData] = await Promise.all([
          popUpService.getPopUpsPaged(currentPage, 10, appliedSearch),
          popUpService.getPopUpStats(),
        ]);
        setPopUps(pagedData.items || []);
        setTotalPages(pagedData.totalPages || 1);
        setStats(statsData);
      } catch (error) {
        console.error("Erro ao sincronizar dados");
      } finally {
        setLoading(false);
        setInternalLoading(false);
      }
    },
    [currentPage, appliedSearch]
  );

  useEffect(() => {
    fetchData(true);
  }, [fetchData]);

  const handleSearchTrigger = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    setAppliedSearch(searchTerm);
  };

  const handleOpenModal = (popUp) => {
    setSelectedPopUp(popUp);
    setIsModalOpen(true);
  };

  const handleToggleStatus = async (id) => {
    try {
      await popUpService.togglePopUpActive(id);
      fetchData();
    } catch (error) {
      alert("Erro ao alterar status");
    }
  };

  const openDeleteDialog = (e, p) => {
    e.stopPropagation();
    setDeleteConfirm({ show: true, id: p.id, name: p.name });
  };

  const confirmDelete = async () => {
    try {
      await popUpService.deletePopUp(deleteConfirm.id);
      setDeleteConfirm({ show: false, id: null, name: "" });
      fetchData();
    } catch (error) {
      alert("Erro ao excluir campanha");
    }
  };

  if (loading) {
    return (
      <div className="pu-main-loader">
        <div className="pu-spinner-large"></div>
        <p>Carregando campanhas...</p>
      </div>
    );
  }

  return (
    <div className="pu-dashboard-container animate-fade-in">
      <header className="pu-main-header">
        <div className="pu-title-wrapper">
          <h1>PopUps Dinâmicos</h1>
          <div className="pu-breadcrumb">
            <span>Plataforma</span>
            <i className="fa-solid fa-chevron-right"></i>
            <span className="active">Engajamento</span>
          </div>
        </div>
        <button
          className="pu-btn-primary"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <div className="pu-btn-content">
            <i className="fa-solid fa-plus"></i>
            <span>Criar PopUp</span>
          </div>
        </button>
      </header>

      <section className="pu-stats-grid">
        <div className="pu-stat-card">
          <div className="pu-stat-icon blue">
            <i className="fa-solid fa-rocket"></i>
          </div>
          <div className="pu-stat-data">
            <p>Total de Campanhas</p>
            <h3>{stats.totalPopUps}</h3>
          </div>
        </div>
        <div className="pu-stat-card">
          <div className="pu-stat-icon purple">
            <i className="fa-solid fa-id-card-clip"></i>
          </div>
          <div className="pu-stat-data">
            <p>Leads Coletados</p>
            <h3>{stats.totalResponses}</h3>
          </div>
        </div>
      </section>

      <main className="pu-content-card">
        <div className="pu-table-actions">
          <form className="pu-search-group" onSubmit={handleSearchTrigger}>
            <div className="pu-input-with-icon">
              <i className="fa-solid fa-magnifying-glass"></i>
              <input
                type="text"
                placeholder="Pesquisar por nome ou ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button type="submit" className="pu-search-btn">
              Buscar
            </button>
          </form>
          {internalLoading && (
            <div className="pu-sync-indicator">
              <i className="fa-solid fa-rotate fa-spin"></i> Sincronizando...
            </div>
          )}
        </div>

        <div className="pu-table-wrapper">
          <table className="pu-modern-table">
            <thead>
              <tr>
                <th>CAMPANHA</th>
                <th>LOCALIZAÇÃO</th>
                <th>CRIADO EM</th>
                <th>STATUS</th>
                <th className="text-center">AÇÕES</th>
              </tr>
            </thead>
            <tbody>
              {popUps.length > 0 ? (
                popUps.map((p, idx) => (
                  <tr
                    key={p.id}
                    className="pu-row-animate"
                    style={{ "--delay": `${idx * 0.05}s` }}
                  >
                    <td onClick={() => handleOpenModal(p)}>
                      <div className="pu-campaign-cell">
                        <span className="pu-id-tag">#{p.id}</span>
                        <span className="pu-name-text">{p.name}</span>
                      </div>
                    </td>
                    <td>
                      <div className="pu-config-tag">{p.displayLocation}</div>
                    </td>
                    <td>
                      <span className="pu-date-text">
                        {new Date(p.dateCreated).toLocaleDateString()}
                      </span>
                    </td>
                    <td>
                      <div
                        className={`pu-status-pill ${
                          p.isActive ? "active" : "paused"
                        }`}
                        onClick={() => handleToggleStatus(p.id)}
                        style={{ cursor: "pointer" }}
                      >
                        <span className="pu-status-dot"></span>
                        {p.isActive ? "Ativo" : "Inativo"}
                      </div>
                    </td>
                    <td>
                      <div className="pu-action-group">
                        <button
                          className="pu-action-btn view"
                          onClick={() => handleOpenModal(p)}
                        >
                          <i className="fa-solid fa-eye"></i>
                        </button>
                        <button
                          className="pu-action-btn delete"
                          onClick={(e) => openDeleteDialog(e, p)}
                        >
                          <i className="fa-solid fa-trash-can"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">
                    <div className="pu-empty-state">
                      <p>Nenhum popup encontrado.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <footer className="pu-pagination">
          <div className="pu-page-info">
            Página {currentPage} de {totalPages}
          </div>
          <div className="pu-page-controls">
            <button
              className="pu-page-btn"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              <i className="fa-solid fa-angle-left"></i>
            </button>
            <button
              className="pu-page-btn"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              <i className="fa-solid fa-angle-right"></i>
            </button>
          </div>
        </footer>
      </main>

      {deleteConfirm.show && (
        <div className="pu-delete-overlay">
          <div className="pu-delete-modal">
            <div className="pu-delete-icon">
              <i className="fa-solid fa-circle-exclamation"></i>
            </div>
            <h2>Tem certeza?</h2>
            <p>
              Você está prestes a excluir a campanha{" "}
              <strong>{deleteConfirm.name}</strong>.
            </p>
            <div className="pu-delete-actions">
              <button
                className="pu-btn-cancel"
                onClick={() =>
                  setDeleteConfirm({ show: false, id: null, name: "" })
                }
              >
                Cancelar
              </button>
              <button className="pu-btn-confirm" onClick={confirmDelete}>
                Sim, Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <PopUpModal
          popUp={selectedPopUp}
          onClose={() => setIsModalOpen(false)}
        />
      )}
      {isCreateModalOpen && (
        <CreatePopUpModal
          onClose={() => setIsCreateModalOpen(false)}
          onSave={() => fetchData()}
        />
      )}
    </div>
  );
};

export default PopUps;
