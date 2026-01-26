import React, { useState, useEffect } from "react";
import "./PopUpModal.css";
import popUpService from "../../dbServices/popUpService";
import FormModel from "./Forms/FormModel";

const PopUpModal = ({ popUp, onClose }) => {
  const [activeTab, setActiveTab] = useState("info");
  const [responses, setResponses] = useState([]);
  const [loadingResp, setLoadingResp] = useState(false);
  const [filterType, setFilterType] = useState("all"); // all, communicated, pending

  useEffect(() => {
    if (activeTab === "responses") loadResponses();
  }, [activeTab]);

  const loadResponses = async () => {
    setLoadingResp(true);
    try {
      const data = await popUpService.getPopUpResponses(popUp.id, 1, 100);
      setResponses(data.items || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingResp(false);
    }
  };

  const handleToggleCommunication = async (resId) => {
    try {
      await popUpService.toggleResponseCommunication(resId);
      setResponses((prev) =>
        prev.map((r) =>
          r.id === resId ? { ...r, isCommunicated: !r.isCommunicated } : r
        )
      );
    } catch (error) {
      alert("Erro ao atualizar status.");
    }
  };

  const filteredResponses = responses.filter((res) => {
    if (filterType === "communicated") return res.isCommunicated;
    if (filterType === "pending") return !res.isCommunicated;
    return true;
  });

  const renderLivePreview = () => {
    const parts = popUp.contentHtml.split("{{FORM}}");
    return (
      <div className="pum-preview-render">
        <div dangerouslySetInnerHTML={{ __html: parts[0] }} />
        {popUp.formSchema && parts.length > 1 && (
          <div className="pum-form-wrapper">
            <FormModel initialSchema={popUp.formSchema} isAdmin={false} />
          </div>
        )}
        {parts.length > 1 && (
          <div dangerouslySetInnerHTML={{ __html: parts[1] }} />
        )}
      </div>
    );
  };

  return (
    <div className="pum-overlay">
      <div className="pum-container">
        <aside className="pum-sidebar">
          <div className="pum-sidebar-header">
            <div className="pum-icon-badge">
              <i className="fa-solid fa-gauge-high"></i>
            </div>
            <div className="pum-header-text">
              <h3>Painel PopUp</h3>
              <span>ID: #{popUp.id}</span>
            </div>
          </div>

          <nav className="pum-nav">
            <button
              className={`pum-nav-link ${activeTab === "info" ? "active" : ""}`}
              onClick={() => setActiveTab("info")}
            >
              <i className="fa-solid fa-circle-info"></i> Detalhes & Preview
            </button>
            <button
              className={`pum-nav-link ${
                activeTab === "responses" ? "active" : ""
              }`}
              onClick={() => setActiveTab("responses")}
            >
              <i className="fa-solid fa-comment-dots"></i> Respostas Leads
            </button>
          </nav>

          <button className="pum-close-btn" onClick={onClose}>
            <i className="fa-solid fa-arrow-left-long"></i> Voltar
          </button>
        </aside>

        <main className="pum-content">
          {activeTab === "info" ? (
            <div className="pum-tab-content info-view animate-fade-in">
              <div className="pum-view-split">
                <div className="pum-details-section">
                  <div className="pum-section-header">
                    <h2>{popUp.name}</h2>
                    <span
                      className={`pum-status-tag ${
                        popUp.isActive ? "active" : ""
                      }`}
                    >
                      {popUp.isActive ? "Ativo" : "Inativo"}
                    </span>
                  </div>

                  <div className="pum-info-grid">
                    <div className="pum-info-item">
                      <label>Localização</label>
                      <p>{popUp.displayLocation}</p>
                    </div>
                    <div className="pum-info-item">
                      <label>Delay (Segundos)</label>
                      <p>{popUp.displayDelaySeconds}s</p>
                    </div>
                  </div>

                  <div className="pum-code-section">
                    <label>Código Estrutural (HTML)</label>
                    <div className="pum-code-block">
                      <pre>
                        <code>{popUp.contentHtml}</code>
                      </pre>
                    </div>
                  </div>
                </div>

                <div className="pum-preview-section">
                  <div className="pum-preview-header">
                    <i className="fa-solid fa-eye"></i> Visualização Final
                  </div>
                  <div className="pum-preview-window">
                    <div className="pum-browser-bar">
                      <div className="pum-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                    <div className="pum-browser-body">
                      {renderLivePreview()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="pum-tab-content responses-view animate-fade-in">
              <div className="pum-section-header">
                <div className="pum-header-left">
                  <h2>Interações Coletadas</h2>
                  <div className="pum-count-badge">
                    {filteredResponses.length} leads
                  </div>
                </div>

                <div className="pum-filters">
                  <button
                    className={filterType === "all" ? "active" : ""}
                    onClick={() => setFilterType("all")}
                  >
                    Todos
                  </button>
                  <button
                    className={filterType === "pending" ? "active" : ""}
                    onClick={() => setFilterType("pending")}
                  >
                    Pendentes
                  </button>
                  <button
                    className={filterType === "communicated" ? "active" : ""}
                    onClick={() => setFilterType("communicated")}
                  >
                    Comunicados
                  </button>
                </div>
              </div>

              {loadingResp ? (
                <div className="pum-loader-container">
                  <div className="pum-spinner"></div>
                </div>
              ) : filteredResponses.length > 0 ? (
                <div className="pum-responses-grid">
                  {filteredResponses.map((res) => (
                    <div
                      key={res.id}
                      className={`pum-response-card ${
                        res.isCommunicated ? "done" : ""
                      }`}
                    >
                      <div className="pum-res-header">
                        <div className="pum-res-avatar">
                          <i className="fa-solid fa-user"></i>
                        </div>
                        <span className="pum-res-date">
                          {new Date(res.dateSubmitted).toLocaleString()}
                        </span>
                      </div>
                      <div className="pum-res-body">
                        {Object.entries(res.answers).map(([key, val]) => (
                          <div className="pum-res-line" key={key}>
                            <span className="pum-res-key">{key}:</span>
                            <span className="pum-res-val">
                              {val.toString()}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="pum-res-footer">
                        <button
                          className={`pum-comm-btn ${
                            res.isCommunicated ? "is-done" : ""
                          }`}
                          onClick={() => handleToggleCommunication(res.id)}
                        >
                          {res.isCommunicated ? (
                            <>
                              <i className="fa-solid fa-check-double"></i>{" "}
                              Comunicado
                            </>
                          ) : (
                            <>
                              <i className="fa-regular fa-paper-plane"></i>{" "}
                              Marcar Comunicado
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="pum-empty-state">
                  <i className="fa-solid fa-inbox"></i>
                  <p>Nenhum lead encontrado neste filtro.</p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default PopUpModal;
