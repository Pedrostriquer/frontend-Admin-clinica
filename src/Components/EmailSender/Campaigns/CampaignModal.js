import React, { useState, useEffect, useCallback } from "react";
import emailSenderService from "../../../dbServices/emailSenderService";
import { useLoad } from "../../../Context/LoadContext";
import "./CampaignModal.css";

export default function CampaignModal({ campaignId, onClose }) {
  const [details, setDetails] = useState(null);
  const [tableData, setTableData] = useState({ items: [], totalCount: 0 });
  const [activeTab, setActiveTab] = useState("sent");
  const [searchTerm, setSearchTerm] = useState("");
  const [interactionType, setInteractionType] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [tableLoading, setTableLoading] = useState(false);

  const itemsPerPage = 5;
  const { startLoading, stopLoading } = useLoad();

  useEffect(() => {
    const fetchBaseDetails = async () => {
      startLoading();
      try {
        const data = await emailSenderService.getCampaignDetails(campaignId);
        setDetails(data);
      } catch (err) {
        alert("Erro ao carregar metadados da campanha.");
        onClose();
      } finally {
        stopLoading();
      }
    };
    fetchBaseDetails();
  }, [campaignId]);

  const fetchTableData = useCallback(async () => {
    if (!campaignId) return;
    setTableLoading(true);
    try {
      let response;
      if (activeTab === "sent") {
        response = await emailSenderService.getCampaignRecipients(
          campaignId,
          searchTerm,
          currentPage,
          itemsPerPage
        );
      } else {
        response = await emailSenderService.getCampaignInteractions(
          campaignId,
          interactionType,
          searchTerm,
          currentPage,
          itemsPerPage
        );
      }
      setTableData({
        items: response.items || [],
        totalCount: response.totalCount || 0,
      });
    } catch (err) {
      console.error("Erro ao carregar dados da tabela", err);
      setTableData({ items: [], totalCount: 0 });
    } finally {
      setTableLoading(false);
    }
  }, [campaignId, activeTab, searchTerm, interactionType, currentPage]);

  useEffect(() => {
    fetchTableData();
  }, [fetchTableData]);

  if (!details) return null;

  const totalPages = Math.ceil(tableData.totalCount / itemsPerPage);

  return (
    <div className="campaign-modal-backdrop" onClick={onClose}>
      <div
        className="campaign-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="campaign-modal-header">
          <div className="header-left">
            <div className="header-icon">
              <i className="fa-solid fa-chart-pie"></i>
            </div>
            <div>
              <h3>Relatório de Disparo</h3>
              <p className="campaign-name-tag">{details.campaignName}</p>
            </div>
          </div>
          <button className="modal-close-x" onClick={onClose}>
            &times;
          </button>
        </header>

        <section className="campaign-stats-summary">
          <div className="summary-card">
            <label>Enviados</label>
            <strong>{details.totalSent}</strong>
          </div>
          <div className="summary-card open">
            <label>Aberturas</label>
            <strong>{details.totalOpens}</strong>
          </div>
          <div className="summary-card click">
            <label>Cliques</label>
            <strong>{details.totalClicks}</strong>
          </div>
          <div className="summary-card ctr">
            <label>Taxa CTR</label>
            <strong>
              {details.totalOpens > 0
                ? ((details.totalClicks / details.totalOpens) * 100).toFixed(1)
                : 0}
              %
            </strong>
          </div>
        </section>

        <div className="campaign-modal-body">
          <div className="table-actions-toolbar">
            <div className="toolbar-left">
              <div className="custom-tab-group">
                <button
                  className={activeTab === "sent" ? "active" : ""}
                  onClick={() => {
                    setActiveTab("sent");
                    setCurrentPage(1);
                    setSearchTerm("");
                  }}
                >
                  <i className="fa-solid fa-users"></i> Destinatários
                </button>
                <button
                  className={activeTab === "interactions" ? "active" : ""}
                  onClick={() => {
                    setActiveTab("interactions");
                    setCurrentPage(1);
                    setSearchTerm("");
                  }}
                >
                  <i className="fa-solid fa-fingerprint"></i> Interações
                </button>
              </div>

              {activeTab === "interactions" && (
                <select
                  className="filter-select-modern"
                  value={interactionType}
                  onChange={(e) => {
                    setInteractionType(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="ALL">Todos os Eventos</option>
                  <option value="OPEN">Aberturas</option>
                  <option value="CLICK">Cliques</option>
                </select>
              )}
            </div>

            <div className="modal-search-wrapper">
              <i className="fa-solid fa-magnifying-glass"></i>
              <input
                type="text"
                placeholder="Buscar e-mail..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>

          <div className="modal-table-content">
            {tableLoading && (
              <div className="table-shimmer-overlay">
                <div className="loader-circle"></div>
              </div>
            )}
            <table className="modern-modal-table">
              <thead>
                {activeTab === "sent" ? (
                  <tr>
                    <th>E-mail</th>
                    <th>Nome do Cliente</th>
                    <th className="text-center">ID</th>
                  </tr>
                ) : (
                  <tr>
                    <th>E-mail</th>
                    <th>Evento</th>
                    <th>Destino do Clique</th>
                    <th className="text-center">Data</th>
                  </tr>
                )}
              </thead>
              <tbody>
                {tableData.items.length > 0 ? (
                  tableData.items.map((item, idx) => (
                    <tr key={idx}>
                      {activeTab === "sent" ? (
                        <>
                          <td className="bold-email">{item.email}</td>
                          <td>
                            {item.name || (
                              <span className="null-val">Não informado</span>
                            )}
                          </td>
                          <td className="text-center">
                            {item.clientId || "---"}
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="bold-email">{item.recipientEmail}</td>
                          <td>
                            <span
                              className={`status-pill ${(
                                item.interactionType || ""
                              ).toLowerCase()}`}
                            >
                              {item.interactionType || "N/A"}
                            </span>
                          </td>
                          <td className="url-text" title={item.linkUrl}>
                            {item.linkUrl || "Pixel de Abertura"}
                          </td>
                          <td className="text-center time-text">
                            {item.timestamp
                              ? new Date(item.timestamp).toLocaleString()
                              : "---"}
                          </td>
                        </>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={activeTab === "sent" ? 3 : 4}
                      className="no-data-msg"
                    >
                      Nenhum registro encontrado para esta busca.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="modal-custom-pagination">
            <div className="pag-summary">
              Total: <strong>{tableData.totalCount}</strong> registros
            </div>
            <div className="pag-controls">
              <button
                className="pag-btn-circle"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                <i className="fa-solid fa-chevron-left"></i>
              </button>
              <div className="pag-numbers">
                <span>{currentPage}</span> / <span>{totalPages || 1}</span>
              </div>
              <button
                className="pag-btn-circle"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                <i className="fa-solid fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>

        <footer className="campaign-modal-footer">
          <button className="btn-modal-close" onClick={onClose}>
            Fechar Relatório
          </button>
        </footer>
      </div>
    </div>
  );
}
