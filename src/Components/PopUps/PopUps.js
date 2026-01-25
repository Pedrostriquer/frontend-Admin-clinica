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
  const [selectedPopUp, setSelectedPopUp] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [internalLoading, setInternalLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setInternalLoading(true);
    try {
      const [pagedData, statsData] = await Promise.all([
        popUpService.getPopUpsPaged(currentPage, 10, searchTerm),
        popUpService.getPopUpStats(),
      ]);
      setPopUps(pagedData.items || []);
      setTotalPages(pagedData.totalPages || 1);
      setStats(statsData);
    } catch (error) {
      alert("Erro ao sincronizar dados dos PopUps");
    } finally {
      setTimeout(() => setInternalLoading(false), 500);
    }
  }, [currentPage, searchTerm]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleOpenModal = (popUp) => {
    setSelectedPopUp(popUp);
    setIsModalOpen(true);
  };

  const handleCreateSuccess = () => {
    fetchData();
  };

  return (
    <div className="pu-dashboard-container">
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
          <div className="pu-btn-glow"></div>
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
          <div className="pu-card-decoration"></div>
        </div>
        <div className="pu-stat-card">
          <div className="pu-stat-icon purple">
            <i className="fa-solid fa-id-card-clip"></i>
          </div>
          <div className="pu-stat-data">
            <p>Leads Coletados</p>
            <h3>{stats.totalResponses}</h3>
          </div>
          <div className="pu-card-decoration"></div>
        </div>
      </section>

      <main className="pu-content-card">
        <div className="pu-table-actions">
          <div className="pu-search-container">
            <i className="fa-solid fa-magnifying-glass"></i>
            <input
              type="text"
              placeholder="Pesquisar por nome ou ID..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
            {searchTerm && (
              <button
                className="pu-clear-search"
                onClick={() => setSearchTerm("")}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            )}
          </div>
        </div>

        <div
          className={`pu-table-relative ${
            internalLoading ? "pu-loading-blur" : ""
          }`}
        >
          {internalLoading && (
            <div className="pu-table-loader">
              <div className="pu-spinner"></div>
              <span>Atualizando dados...</span>
            </div>
          )}

          <div className="pu-table-wrapper">
            <table className="pu-modern-table">
              <thead>
                <tr>
                  <th>CAMPANHA</th>
                  <th>CONFIGURAÇÃO</th>
                  <th>EXPOSIÇÃO</th>
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
                        <div className="pu-config-tag">
                          <i className="fa-regular fa-clock"></i>
                          {p.frequencyMinutes} min
                        </div>
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
                        >
                          <span className="pu-status-dot"></span>
                          {p.isActive ? "Ativo" : "Pausado"}
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
                          <button className="pu-action-btn edit">
                            <i className="fa-solid fa-pen-to-square"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5">
                      <div className="pu-empty-state">
                        <i className="fa-solid fa-box-open"></i>
                        <p>Nenhum popup encontrado.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <footer className="pu-pagination">
          <div className="pu-page-info">
            Página <strong>{currentPage}</strong> de{" "}
            <strong>{totalPages}</strong>
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

      {isModalOpen && (
        <PopUpModal
          popUp={selectedPopUp}
          onClose={() => setIsModalOpen(false)}
        />
      )}
      {isCreateModalOpen && (
        <CreatePopUpModal
          onClose={() => setIsCreateModalOpen(false)}
          onSave={handleCreateSuccess}
        />
      )}
    </div>
  );
};

export default PopUps;
