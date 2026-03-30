import React, { useState, useEffect } from "react";
import { useLoad } from "../../../Context/LoadContext";
import emailSenderService from "../../../dbServices/emailSenderService";
import CampaignModal from "./CampaignModal";
import CreateCampaignModal from "./CreateCampaignModal";
import "./EmailCampaignsPage.css";

export default function EmailCampaignsPage() {
  const [data, setData] = useState({ stats: {}, campaigns: [], totalCount: 0 });
  const [models, setModels] = useState([]);
  const [filters, setFilters] = useState({ modelId: "", page: 1 });
  const [selectedCampaignId, setSelectedCampaignId] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const { startLoading, stopLoading } = useLoad();

  const fetchInitial = async () => {
    try {
      const res = await emailSenderService.searchModels("", 1, 100);
      setModels(res.items || []);
    } catch (err) {
      console.error("Erro ao buscar modelos", err);
    }
  };

  const fetchDashboard = async () => {
    startLoading();
    try {
      const res = await emailSenderService.getCampaignsDashboard(
        filters.page,
        9,
        filters.modelId || null
      );
      setData(res);
    } catch (err) {
      alert("Erro ao carregar dashboard de campanhas.");
    } finally {
      stopLoading();
    }
  };

  useEffect(() => {
    fetchInitial();
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [filters]);

  const handleFinishCreate = async (campaignData) => {
    startLoading();
    try {
      await emailSenderService.sendCampaign(
        campaignData.modelId,
        campaignData.campaignName,
        campaignData.recipients,
        campaignData.allClientsIncluded // <--- Faltava passar isso aqui!
      );
  
      alert("Requisição recebida! O disparo foi iniciado em segundo plano.");
      setShowCreateModal(false);
  
      setTimeout(() => {
        fetchDashboard();
      }, 1000);
    } catch (err) {
      alert("Erro ao iniciar campanha. Verifique os dados.");
    } finally {
      stopLoading();
    }
  };

  return (
    <div className="campaigns-page-container">
      <header className="campaigns-dashboard-header">
        <div className="title-section">
          <h1>Relatórios de Campanhas</h1>
          <p>Métricas de desempenho e engajamento</p>
        </div>

        <div className="header-right-actions">
          <div className="global-stats-row">
            <div className="stat-bubble blue">
              <span className="bubble-label">Aberturas Hoje</span>
              <span className="bubble-value">
                {data.stats?.todayOpens || 0}
              </span>
            </div>
            <div className="stat-bubble green">
              <span className="bubble-label">Cliques Hoje</span>
              <span className="bubble-value">
                {data.stats?.todayClicks || 0}
              </span>
            </div>
            <div className="stat-bubble purple">
              <span className="bubble-label">Total Geral</span>
              <span className="bubble-value">
                {data.stats?.totalOpens || 0}
              </span>
            </div>
          </div>

          <button
            className="btn-open-create"
            onClick={() => setShowCreateModal(true)}
          >
            <i className="fa-solid fa-paper-plane"></i> Novo Disparo
          </button>
        </div>
      </header>

      <div className="campaigns-filters-bar">
        <div className="filter-item">
          <label>Filtrar por Modelo:</label>
          <select
            value={filters.modelId}
            onChange={(e) =>
              setFilters({ ...filters, modelId: e.target.value, page: 1 })
            }
          >
            <option value="">Todos os modelos cadastrados</option>
            {models.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>
        {filters.modelId && (
          <span className="filter-helper-text">
            Modelo selecionado para novo disparo.
          </span>
        )}
      </div>

      {data.campaigns.length > 0 ? (
        <div className="campaigns-report-grid">
          {data.campaigns.map((camp) => {
            const openRate =
              camp.recipientCount > 0
                ? ((camp.totalOpens / camp.recipientCount) * 100).toFixed(1)
                : 0;
            return (
              <div key={camp.id} className="campaign-report-card">
                <div className="card-top">
                  <span className="model-tag">
                    {camp.templateName || "Sem Modelo"}
                  </span>
                  <h3>{camp.name}</h3>
                  <span className="date-text">
                    {new Date(camp.sentAt).toLocaleString()}
                  </span>
                </div>

                <div className="card-metrics">
                  <div className="metric">
                    <span className="m-label">Enviados</span>
                    <span className="m-value">{camp.recipientCount}</span>
                  </div>
                  <div className="metric">
                    <span className="m-label">Abertos</span>
                    <span className="m-value">{camp.totalOpens}</span>
                  </div>
                  <div className="metric">
                    <span className="m-label">Cliques</span>
                    <span className="m-value">{camp.totalClicks}</span>
                  </div>
                </div>

                <div className="engagement-section">
                  <div className="engagement-info">
                    <span>Taxa de Engajamento</span>
                    <span className="perc-text">{openRate}%</span>
                  </div>
                  <div className="custom-progress-bg">
                    <div
                      className="custom-progress-fill"
                      style={{ width: `${Math.min(openRate, 100)}%` }}
                    ></div>
                  </div>
                </div>

                <button
                  className="btn-details-campaign"
                  onClick={() => setSelectedCampaignId(camp.id)}
                >
                  Ver Detalhes <i className="fa-solid fa-arrow-right"></i>
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="campaigns-empty">
          <i className="fa-solid fa-folder-open"></i>
          <p>Nenhuma campanha encontrada para este filtro.</p>
        </div>
      )}

      <footer className="campaigns-pagination">
        <button
          className="pag-btn"
          disabled={filters.page === 1}
          onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
        >
          Anterior
        </button>
        <div className="pag-info">
          Página <strong>{filters.page}</strong>
        </div>
        <button
          className="pag-btn"
          disabled={data.campaigns.length < 9}
          onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
        >
          Próxima
        </button>
      </footer>

      {selectedCampaignId && (
        <CampaignModal
          campaignId={selectedCampaignId}
          onClose={() => setSelectedCampaignId(null)}
        />
      )}

      {showCreateModal && (
        <CreateCampaignModal
          onClose={() => setShowCreateModal(false)}
          onSave={handleFinishCreate}
        />
      )}
    </div>
  );
}
