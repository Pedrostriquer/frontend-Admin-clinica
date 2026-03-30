import React, { useState, useEffect, useRef } from "react";
import * as XLSX from "xlsx";
import emailSenderService from "../../../dbServices/emailSenderService";
import clientServices from "../../../dbServices/clientServices";
import { useLoad } from "../../../Context/LoadContext";
import "./CreateCampaignModal.css";

export default function CreateCampaignModal({ onClose, onSave }) {
  const [campaignName, setCampaignName] = useState("");
  const [selectedModelId, setSelectedModelId] = useState("");
  const [models, setModels] = useState([]);
  const [recipients, setRecipients] = useState([]);
  const [newRecipient, setNewRecipient] = useState({ name: "", email: "" });
  const [allClientsIncluded, setAllClientsIncluded] = useState(false);

  const [clientSearch, setClientSearch] = useState("");
  const [foundClients, setFoundClients] = useState([]);
  const [showClientResults, setShowClientResults] = useState(false);

  const [importData, setImportData] = useState(null);
  const [columns, setColumns] = useState([]);
  const [mapping, setMapping] = useState({ name: "", email: "" });
  const fileInputRef = useRef(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const { startLoading, stopLoading } = useLoad();

  useEffect(() => {
    const fetchModels = async () => {
      startLoading();
      try {
        const data = await emailSenderService.searchModels("", 1, 100);
        setModels(data.items || []);
      } catch (err) {
        alert("Erro ao carregar modelos.");
      } finally {
        stopLoading();
      }
    };
    fetchModels();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (clientSearch.length >= 3) {
        handleSearchClients();
      } else {
        setFoundClients([]);
        setShowClientResults(false);
      }
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [clientSearch]);

  const handleSearchClients = async () => {
    try {
      const res = await clientServices.getClients(clientSearch, 1, 5);
      setFoundClients(res.items || []);
      setShowClientResults(true);
    } catch (err) {
      console.error("Erro ao buscar clientes", err);
    }
  };

  const addClientFromSystem = (client) => {
    if (
      recipients.some(
        (r) => r.email.toLowerCase() === client.email.toLowerCase()
      )
    ) {
      alert("Este e-mail já está na lista.");
      return;
    }
    setRecipients([
      {
        name: client.name,
        email: client.email.toLowerCase(),
        clientId: client.id,
      },
      ...recipients,
    ]);
    setClientSearch("");
    setShowClientResults(false);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(ws);
      if (data.length > 0) {
        setImportData(data);
        setColumns(Object.keys(data[0]));
      }
    };
    reader.readAsBinaryString(file);
  };

  const processImport = () => {
    if (!mapping.email) return alert("Selecione a coluna de e-mail.");
    const newList = [...recipients];
    importData.forEach((row) => {
      const email = String(row[mapping.email] || "")
        .trim()
        .toLowerCase();
      const name = mapping.name ? String(row[mapping.name] || "").trim() : "";
      if (email && !newList.some((r) => r.email === email)) {
        newList.push({ name, email });
      }
    });
    setRecipients(newList);
    setImportData(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleAddManual = (e) => {
    e.preventDefault();
    if (!newRecipient.email) return;
    const email = newRecipient.email.trim().toLowerCase();
    if (recipients.some((r) => r.email === email))
      return alert("E-mail já adicionado.");
    setRecipients([{ ...newRecipient, email }, ...recipients]);
    setNewRecipient({ name: "", email: "" });
    setCurrentPage(1);
  };

  const removeRecipient = (index) => {
    const realIndex = (currentPage - 1) * itemsPerPage + index;
    setRecipients(recipients.filter((_, i) => i !== realIndex));
  };

  const handleFinish = () => {
    if (!campaignName || !selectedModelId)
      return alert("Preencha o nome e o modelo.");
    if (recipients.length === 0 && !allClientsIncluded)
      return alert("Adicione destinatários.");

    onSave({
      modelId: selectedModelId,
      campaignName: campaignName,
      recipients: recipients,
      allClientsIncluded: allClientsIncluded,
    });
  };

  const totalPages = Math.ceil(recipients.length / itemsPerPage);
  const paginatedRecipients = recipients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="create-campaign-backdrop" onClick={onClose}>
      <div
        className="create-campaign-content"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="create-campaign-header">
          <div>
            <h3>Novo Disparo em Massa</h3>
            <p>Selecione clientes, importe planilhas ou adicione manualmente</p>
          </div>
          <button className="close-x" onClick={onClose}>
            &times;
          </button>
        </header>

        <div className="create-campaign-scroll-area">
          <div className="campaign-setup-section">
            <div className="setup-grid">
              <div className="setup-field">
                <label>Nome da Campanha</label>
                <input
                  type="text"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  placeholder="Ex: Promoção de Verão"
                />
              </div>
              <div className="setup-field">
                <label>Modelo de E-mail</label>
                <select
                  value={selectedModelId}
                  onChange={(e) => setSelectedModelId(e.target.value)}
                >
                  <option value="">Selecione um modelo...</option>
                  {models.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="client-system-section">
            <label className="section-label">Puxar Clientes do Sistema</label>
            <div className="system-actions">
              <div className="search-wrapper-system">
                <input
                  type="text"
                  placeholder="Pesquisar por nome..."
                  value={clientSearch}
                  onChange={(e) => setClientSearch(e.target.value)}
                />
                {showClientResults && foundClients.length > 0 && (
                  <div className="system-results-dropdown">
                    {foundClients.map((c) => (
                      <div
                        key={c.id}
                        className="result-row"
                        onClick={() => addClientFromSystem(c)}
                      >
                        <span className="res-name">{c.name}</span>
                        <span className="res-email">{c.email}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <button
                className={`btn-all-clients ${
                  allClientsIncluded ? "active" : ""
                }`}
                onClick={() => setAllClientsIncluded(!allClientsIncluded)}
              >
                <i
                  className={
                    allClientsIncluded
                      ? "fa-solid fa-check-double"
                      : "fa-solid fa-users"
                  }
                ></i>
                {allClientsIncluded ? "Todos Ativados" : "Incluir Todos"}
              </button>
            </div>
          </div>

          <div className="import-section">
            <label className="section-label">Importar Planilha</label>
            <input
              type="file"
              accept=".xlsx, .xls, .csv"
              onChange={handleFileUpload}
              ref={fileInputRef}
            />
            {importData && (
              <div className="mapping-area">
                <div className="mapping-grid">
                  <select
                    onChange={(e) =>
                      setMapping({ ...mapping, name: e.target.value })
                    }
                  >
                    <option value="">-- Nome --</option>
                    {columns.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <select
                    onChange={(e) =>
                      setMapping({ ...mapping, email: e.target.value })
                    }
                  >
                    <option value="">-- E-mail --</option>
                    {columns.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <button
                    className="btn-confirm-import"
                    onClick={processImport}
                  >
                    Importar
                  </button>
                </div>
              </div>
            )}
          </div>

          <form className="add-recipient-form" onSubmit={handleAddManual}>
            <label className="section-label">Adicionar Manual</label>
            <div className="input-group">
              <input
                type="text"
                placeholder="Nome"
                value={newRecipient.name}
                onChange={(e) =>
                  setNewRecipient({ ...newRecipient, name: e.target.value })
                }
              />
              <input
                required
                type="email"
                placeholder="E-mail"
                value={newRecipient.email}
                onChange={(e) =>
                  setNewRecipient({ ...newRecipient, email: e.target.value })
                }
              />
              <button type="submit" className="btn-add-circle">
                <i className="fa-solid fa-plus"></i>
              </button>
            </div>
          </form>

          <div className="recipients-table-section">
            <div className="table-header-info">
              <span>Lista de Destinatários</span>
              <span className="badge-count">
                <strong>{recipients.length}</strong> individuais
              </span>
            </div>
            <div className="create-table-wrapper">
              <table className="create-modal-table">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>E-mail</th>
                    <th className="text-center">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedRecipients.length > 0 ? (
                    paginatedRecipients.map((item, idx) => (
                      <tr key={idx}>
                        <td>{item.name || "-"}</td>
                        <td className="bold-email">{item.email}</td>
                        <td className="text-center">
                          <button
                            className="btn-remove-row"
                            onClick={() => removeRecipient(idx)}
                          >
                            <i className="fa-solid fa-trash-can"></i>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="empty-create-table">
                        Nenhum destinatário individual.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <footer className="create-campaign-footer">
          <div className="footer-left">
            {recipients.length > itemsPerPage && (
              <div className="frontend-pagination">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                >
                  <i className="fa-solid fa-chevron-left"></i>
                </button>
                <span>
                  {currentPage} / {totalPages}
                </span>
                <button
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                >
                  <i className="fa-solid fa-chevron-right"></i>
                </button>
              </div>
            )}
          </div>
          <div className="footer-btns">
            <button className="btn-cancel-disparo" onClick={onClose}>
              Cancelar
            </button>
            <button className="btn-next-step" onClick={handleFinish}>
              Disparar Campanha
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
