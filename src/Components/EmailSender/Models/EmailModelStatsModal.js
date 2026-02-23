import React, { useState, useEffect } from "react";
import emailSenderService from "../../../dbServices/emailSenderService";
import { useLoad } from "../../../Context/LoadContext";
import "./EmailModelStatsModal.css";

export default function EmailModelStatsModal({ model, onClose }) {
  const [stats, setStats] = useState([]);
  const [loadingInternal, setLoadingInternal] = useState(true);
  const { startLoading, stopLoading } = useLoad();

  useEffect(() => {
    const fetchStats = async () => {
      startLoading();
      setLoadingInternal(true);
      try {
        const data = await emailSenderService.getModelStats(model.id);
        setStats(data);
      } catch (error) {
        console.error("Erro ao buscar estatísticas", error);
      } finally {
        stopLoading();
        setLoadingInternal(false);
      }
    };
    fetchStats();
  }, [model.id]);

  const calculateTotal = (key) =>
    stats.reduce((acc, curr) => acc + curr[key], 0);

  return (
    <div className="emailsender-modal-backdrop" onClick={onClose}>
      <div
        className="emailsender-modal-content stats-layout"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="header-info">
            <h3>Estatísticas do Modelo</h3>
            <span className="model-name-label">{model.name}</span>
          </div>
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>

        {loadingInternal ? (
          <div className="stats-loading-container">
            <div className="stats-spinner"></div>
            <p>Obtendo métricas...</p>
          </div>
        ) : (
          <>
            <div className="stats-kpi-container">
              <div className="mini-kpi-card">
                <span className="kpi-label">Total de Campanhas</span>
                <span className="kpi-number">{stats.length}</span>
              </div>
              <div className="mini-kpi-card open">
                <span className="kpi-label">Total de Aberturas</span>
                <span className="kpi-number">
                  {calculateTotal("totalOpens")}
                </span>
              </div>
              <div className="mini-kpi-card click">
                <span className="kpi-label">Total de Cliques</span>
                <span className="kpi-number">
                  {calculateTotal("totalClicks")}
                </span>
              </div>
            </div>

            <div className="stats-table-container">
              <table className="stats-table">
                <thead>
                  <tr>
                    <th>Campanha / Disparo</th>
                    <th>Data de Envio</th>
                    <th className="text-center">Aberturas</th>
                    <th className="text-center">Cliques</th>
                    <th className="text-center">CTR</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.length > 0 ? (
                    stats.map((camp) => {
                      const ctr =
                        camp.totalOpens > 0
                          ? (
                              (camp.totalClicks / camp.totalOpens) *
                              100
                            ).toFixed(1)
                          : 0;
                      return (
                        <tr key={camp.campaignId}>
                          <td className="camp-name-cell">
                            {camp.campaignName}
                          </td>
                          <td>{new Date(camp.sentAt).toLocaleString()}</td>
                          <td className="text-center font-bold">
                            {camp.totalOpens}
                          </td>
                          <td className="text-center font-bold">
                            {camp.totalClicks}
                          </td>
                          <td className="text-center">
                            <span className="ctr-badge">{ctr}%</span>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="5" className="empty-stats">
                        Este modelo ainda não possui disparos realizados.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        <div className="modal-footer">
          <button className="btn-exit" onClick={onClose}>
            Fechar Relatório
          </button>
        </div>
      </div>
    </div>
  );
}
