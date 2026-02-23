import React, { useState, useEffect } from "react";
import { useLoad } from "../../../Context/LoadContext";
import { useNotification } from "../../../Context/NotificationContext";
import EmailModelModal from "./EmailModelModal";
import EmailModelViewAndEdit from "./EmailModelViewAndEdit";
import EmailModelStatsModal from "./EmailModelStatsModal";
import emailSenderService from "../../../dbServices/emailSenderService";
import "./EmailSender.css";

export default function EmailModelsPage() {
  const [models, setModels] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedModel, setSelectedModel] = useState(null);
  const [statsModel, setStatsModel] = useState(null);

  const { startLoading, stopLoading } = useLoad();

  const fetchModels = async () => {
    startLoading();
    try {
      const data = await emailSenderService.searchModels(searchTerm, page, 10);
      setModels(data.items || []);
      setTotalCount(data.totalCount || 0);
    } catch (error) {
      alert("Erro ao carregar modelos", "error");
    } finally {
      stopLoading();
    }
  };

  useEffect(() => {
    fetchModels();
  }, [page, searchTerm]);

  const totalPages = Math.ceil(totalCount / 10);

  return (
    <div className="emailsender-container">
      <header className="emailsender-header">
        <div className="header-title">
          <h1>Modelos de E-mail</h1>
          <p>Gerencie seus templates e personalizações</p>
        </div>
        <button className="btn-create-model" onClick={() => setShowModal(true)}>
          <i className="fa-solid fa-plus"></i> Novo Modelo
        </button>
      </header>

      <div className="emailsender-kpi-grid">
        <div className="kpi-card-glass">
          <div className="kpi-icon-wrapper">
            <i className="fa-solid fa-file-code"></i>
          </div>
          <div className="kpi-info">
            <h4>Total de Modelos</h4>
            <p className="kpi-value">{totalCount}</p>
          </div>
        </div>
      </div>

      <div className="emailsender-table-wrapper">
        <div className="table-controls">
          <div className="search-box">
            <i className="fa-solid fa-magnifying-glass"></i>
            <input
              type="text"
              placeholder="Buscar por nome ou assunto..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
            />
          </div>
        </div>

        <div className="table-responsive">
          <table className="emailsender-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Assunto</th>
                <th>Criado em</th>
                <th className="text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {models.length > 0 ? (
                models.map((model) => (
                  <tr key={model.id}>
                    <td className="font-bold">#{model.id}</td>
                    <td className="font-bold">{model.name}</td>
                    <td>{model.subject}</td>
                    <td>{new Date(model.date_created).toLocaleDateString()}</td>
                    <td className="text-center">
                      <div className="actions-cell">
                        <button
                          className="btn-table-action view"
                          title="Visualizar/Editar"
                          onClick={() => setSelectedModel(model)}
                        >
                          <i className="fa-solid fa-eye"></i>
                        </button>
                        <button
                          className="btn-table-action stats"
                          title="Ver Estatísticas"
                          onClick={() => setStatsModel(model)}
                        >
                          <i className="fa-solid fa-chart-line"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center empty-row">
                    Nenhum modelo encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="pagination-container">
          <div className="pagination-info">
            Mostrando <b>{models.length}</b> de <b>{totalCount}</b> modelos
          </div>
          <div className="pagination-actions">
            <button
              className="pagination-btn"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              <i className="fa-solid fa-chevron-left"></i> Anterior
            </button>
            <div className="pagination-pages">
              <span>{page}</span> / <span>{totalPages || 1}</span>
            </div>
            <button
              className="pagination-btn"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Próxima <i className="fa-solid fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <EmailModelModal
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            fetchModels();
          }}
        />
      )}

      {selectedModel && (
        <EmailModelViewAndEdit
          model={selectedModel}
          onClose={() => setSelectedModel(null)}
          onSuccess={() => {
            setSelectedModel(null);
            fetchModels();
          }}
        />
      )}

      {statsModel && (
        <EmailModelStatsModal
          model={statsModel}
          onClose={() => setStatsModel(null)}
        />
      )}
    </div>
  );
}
