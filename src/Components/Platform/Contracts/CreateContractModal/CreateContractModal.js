import React, { useState, useEffect, useCallback } from "react";
import { styles, colors } from "./CreateContractModalStyles";
import { useAuth } from "../../../../Context/AuthContext";
import { useLoad } from "../../../../Context/LoadContext";
import clientServices from "../../../../dbServices/clientServices";
import contractServices from "../../../../dbServices/contractServices";
import formatServices from "../../../../formatServices/formatServices";
import { toast } from "react-toastify";

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const ArrowLeftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"></line>
    <polyline points="12 19 5 12 12 5"></polyline>
  </svg>
);

const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={colors.success} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const StepClientSelection = ({ clientSearchTerm, setClientSearchTerm, searchClient, clientsSearched, handleSelectClient, isLoading, isInitialLoading, selectedClient }) => (
  <div style={styles.modalContent}>
    <div>
      <label style={styles.label}>Pesquisar Cliente</label>
      <div style={styles.inputGroup}>
        <input className="custom-input" style={styles.inputField} value={clientSearchTerm} onChange={(e) => setClientSearchTerm(e.target.value)} placeholder="Nome, CPF ou E-mail" disabled={isInitialLoading} onKeyDown={(e) => e.key === "Enter" && searchClient(clientSearchTerm)} />
        <button className="custom-btn" style={{ ...styles.searchButton, opacity: isLoading ? 0.7 : 1 }} onClick={() => searchClient(clientSearchTerm)} disabled={isLoading || isInitialLoading || clientSearchTerm.length < 3}>
          {isLoading ? "..." : "Buscar"}
        </button>
      </div>
    </div>
    {clientsSearched.length > 0 && !selectedClient && (
      <div style={styles.resultsContainer}>
        <span style={styles.listHeader}>Resultados da busca</span>
        {clientsSearched.map((client) => (
          <div key={client.id} className="list-item-hover" style={styles.listItem} onClick={() => handleSelectClient(client)}>
            <strong>{client.name}</strong>
            <span style={{ fontSize: 13, color: colors.secondary }}>ID: {client.id}</span>
          </div>
        ))}
      </div>
    )}
    {!isLoading && !isInitialLoading && !selectedClient && clientsSearched.length === 0 && clientSearchTerm.length > 0 && (
      <div style={{ textAlign: "center", padding: 20, color: colors.secondary }}>Nenhum cliente encontrado.</div>
    )}
    {selectedClient && (
      <div style={styles.selectedCard}>
        <div style={{ background: colors.white, borderRadius: "50%", padding: 10 }}><CheckIcon /></div>
        <div>
          <span style={{ display: "block", fontSize: 14, color: colors.secondary }}>Cliente selecionado</span>
          <strong style={styles.selectedText}>{selectedClient.name}</strong>
        </div>
        <button className="custom-btn" style={styles.btnPrimary} onClick={() => handleSelectClient(selectedClient)}>Prosseguir para Configuração</button>
      </div>
    )}
  </div>
);

const StepContractConfiguration = ({
  selectedClient, minPurchaseValue, investValue, setInvestValue, formattedValue, duration, setDuration, availableMonths, withGem, setWithGem,
  isRetroactive, setIsRetroactive, retroactiveDate, setRetroactiveDate, isCustom, setIsCustom, customMonths, setCustomMonths, customGain, setCustomGain,
  simulationResult, handleSimulateClick, handleCreateContract, isSimulating, isCreating, handleBack,
}) => {
  const isValueInvalid = investValue < minPurchaseValue;
  return (
    <div style={styles.modalContent}>
      <div style={styles.configHeaderRow}>
        <button onClick={handleBack} style={styles.backLink} className="hover-underline"><span style={{ marginRight: 5 }}><ArrowLeftIcon /></span> Voltar</button>
        <span style={{ fontSize: 14, color: colors.secondary }}>Contrato para: <strong>{selectedClient.name}</strong></span>
      </div>
      <div style={styles.formGroup}>
        <label style={styles.label}>Valor do Aporte <span style={{ fontSize: 12, fontWeight: 400 }}>(Mín. {formatServices.formatCurrencyBR(minPurchaseValue)})</span></label>
        <div style={styles.currencyWrapper}>
          <span style={styles.currencySymbol}>R$</span>
          <input className="custom-input" type="text" value={formattedValue} onChange={(e) => {
            let value = e.target.value.replace(/\D/g, "");
            let numericValue = Number(value) / 100;
            setInvestValue(numericValue);
          }} style={styles.inputCurrency} />
        </div>
        {isValueInvalid && <p style={styles.errorText}>O valor deve ser superior ao mínimo.</p>}
      </div>

      {!isCustom && (
        <div style={styles.formGroup}>
          <label style={styles.label}>Prazo (Meses)</label>
          <select value={duration} onChange={(e) => setDuration(e.target.value)} style={styles.selectField} className="custom-input">
            {availableMonths.map((month) => (<option key={month} value={month}>{month} meses</option>))}
          </select>
        </div>
      )}

      <div style={styles.customConfigBox}>
        <label style={{ ...styles.checkboxContainer, border: "none", padding: 0 }} className="checkbox-hover">
          <input type="checkbox" checked={isCustom} onChange={(e) => setIsCustom(e.target.checked)} style={styles.checkbox} />
          <span style={{ ...styles.checkboxLabel, fontWeight: "600" }}>Duração e Valorização Personalizada?</span>
        </label>
        {isCustom && (
          <div style={{ marginTop: 15, display: "flex", gap: 10, flexDirection: "column" }}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Meses de Duração</label>
              <input className="custom-input" type="number" value={customMonths} onChange={(e) => setCustomMonths(e.target.value)} placeholder="Ex: 15" style={styles.inputField} />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>% Valorização Mensal</label>
              <input className="custom-input" type="number" step="0.01" value={customGain} onChange={(e) => setCustomGain(e.target.value)} placeholder="Ex: 5.5" style={styles.inputField} />
            </div>
          </div>
        )}
      </div>

      <label style={styles.checkboxContainer} className="checkbox-hover">
        <input type="checkbox" checked={withGem} onChange={(e) => setWithGem(e.target.checked)} style={styles.checkbox} />
        <span style={styles.checkboxLabel}>Incluir gema física? <span style={{ fontSize: 13, color: colors.secondary }}></span></span>
      </label>

      <div style={styles.retroConfigBox}>
        <label style={{ ...styles.checkboxContainer, border: "none", padding: 0 }} className="checkbox-hover">
          <input type="checkbox" checked={isRetroactive} onChange={(e) => setIsRetroactive(e.target.checked)} style={{ ...styles.checkbox, accentColor: colors.warning }} />
          <span style={{ ...styles.checkboxLabel, color: colors.retroText, fontWeight: "600" }}>Criar contrato retroativo?</span>
        </label>
        {isRetroactive && (
          <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 5 }}>
            <label style={{ fontSize: 13, color: colors.retroText }}>Data de Criação Original:</label>
            <input type="datetime-local" value={retroactiveDate} onChange={(e) => setRetroactiveDate(e.target.value)} style={{ padding: "8px 12px", borderRadius: 6, border: "1px solid #FDBA74", outline: "none", width: "100%", boxSizing: "border-box" }} />
          </div>
        )}
      </div>

      {simulationResult && !isCustom && (
        <div style={styles.simulationBox}>
          <div style={styles.simRow}><span>Valorização Mensal:</span><span style={{ color: colors.textMain, fontWeight: "600" }}>{simulationResult.monthlyPercentage.toFixed(2)}%</span></div>
          <div style={styles.simRow}><span>Total Estimado:</span><span style={styles.simValue}>{formatServices.formatCurrencyBR(simulationResult.finalAmount)}</span></div>
        </div>
      )}

      <div style={styles.actionButtons}>
        {(!simulationResult && !isCustom) ? (
          <button className="custom-btn" style={{ ...styles.btnSecondary, opacity: isValueInvalid ? 0.5 : 1 }} onClick={handleSimulateClick} disabled={isSimulating || isValueInvalid}>{isSimulating ? "Calculando..." : "Simular Contrato"}</button>
        ) : (
          <div style={{ display: "flex", gap: 10 }}>
            {!isCustom && <button className="custom-btn" style={{ ...styles.btnSecondary, flex: 1 }} onClick={handleSimulateClick} disabled={isSimulating}>Recalcular</button>}
            <button className="custom-btn" style={{ ...styles.btnPrimary, flex: 2, opacity: isCreating ? 0.7 : 1 }} onClick={handleCreateContract} disabled={isCreating || isValueInvalid}>{isCreating ? "Criando..." : "Criar Contrato"}</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default function CreateContractModal({ onClose }) {
  const { token, user } = useAuth();
  const { startLoading, stopLoading } = useLoad();
  const [step, setStep] = useState("selection");
  const [clientSearchTerm, setClientSearchTerm] = useState("");
  const [selectedClient, setSelectedClient] = useState(null);
  const [clientsSearched, setClientsSearched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [investValue, setInvestValue] = useState(3000);
  const [duration, setDuration] = useState("");
  const [availableMonths, setAvailableMonths] = useState([]);
  const [withGem, setWithGem] = useState(false);
  const [simulationResult, setSimulationResult] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isRetroactive, setIsRetroactive] = useState(false);
  const [retroactiveDate, setRetroactiveDate] = useState("");
  const [isCustom, setIsCustom] = useState(false);
  const [customMonths, setCustomMonths] = useState("");
  const [customGain, setCustomGain] = useState("");
  const minPurchaseValue = 100;

  const fetchMonthsAndSettings = useCallback(async (authToken) => {
    if (!authToken) return;
    setIsInitialLoading(true);
    startLoading();
    try {
      const months = await contractServices.obterMesesDisponiveis(authToken);
      if (Array.isArray(months) && months.length > 0) {
        setAvailableMonths(months);
        setDuration(months[0].toString());
      }
      await contractServices.getContractSettings(authToken);
      setInvestValue(100);
    } catch (error) {
      toast.error("Erro ao carregar configurações.");
    } finally {
      setIsInitialLoading(false);
      stopLoading();
    }
  }, [startLoading, stopLoading]);

  useEffect(() => { if (token) fetchMonthsAndSettings(token); }, []);

  const searchClient = async (search) => {
    if (!token || search.length < 3) {
      setClientsSearched([]);
      toast.warn("Digite pelo menos 3 caracteres.");
      return;
    }
    setIsLoading(true);
    setSelectedClient(null);
    setSimulationResult(null);
    try {
      const data = await clientServices.getClients(search, 1, 10, "id", "desc");
      setClientsSearched(data.items || []);
    } catch (error) {
      setClientsSearched([]);
      toast.error("Erro ao buscar clientes.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectClient = (client) => {
    setSelectedClient(client);
    setClientsSearched([]);
    setClientSearchTerm("");
    if (step === "selection" && selectedClient?.id === client.id) setStep("configuration");
  };

  const handleSimulateClick = useCallback(async () => {
    if (!token || !duration || investValue < minPurchaseValue) {
      setSimulationResult(null);
      toast.warn(`Mínimo: ${formatServices.formatCurrencyBR(minPurchaseValue)}.`);
      return;
    }
    setIsSimulating(true);
    try {
      const simulation = await contractServices.simularContrato({ amount: investValue, months: Number(duration), withGem });
      setSimulationResult(simulation);
    } catch (error) {
      toast.error("Erro ao simular.");
      setSimulationResult(null);
    } finally {
      setIsSimulating(false);
    }
  }, [token, investValue, duration, withGem, minPurchaseValue]);

  const handleCreateContract = async () => {
    if (!token || !selectedClient || isCreating) return;
    if (!isCustom && !simulationResult) { toast.warn("Simule o contrato antes."); return; }
    if (isRetroactive && !retroactiveDate) { toast.warn("Selecione a data retroativa."); return; }
    if (isCustom && (!customMonths || !customGain)) { toast.warn("Preencha os campos personalizados."); return; }
    setIsCreating(true);
    startLoading();
    try {
      const contractData = {
        clientId: selectedClient.id,
        amount: investValue,
        months: isCustom ? Number(customMonths) : Number(duration),
        withGem: withGem,
        description: `Admin ID: ${user.id || "N/A"}`,
        paymentMethod: "DEPOSITO",
        allowWithdraw: false,
        dateCreated: isRetroactive && retroactiveDate ? new Date(retroactiveDate).toISOString() : null,
        isCustom: isCustom,
        customMonths: isCustom ? Number(customMonths) : null,
        customGainPercentage: isCustom ? Number(customGain) : null,
      };
      const response = await contractServices.createContractByAdmin(contractData);
      toast.success(`Contrato #${response.id} criado!`);
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Erro ao criar.");
    } finally {
      setIsCreating(false);
      stopLoading();
    }
  };

  const formattedValue = new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 2 }).format(investValue);

  return (
    <>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .custom-input:focus { border-color: ${colors.primary} !important; box-shadow: 0 0 0 3px ${colors.primary}20 !important; }
        .custom-btn:hover { filter: brightness(0.95); transform: translateY(-1px); }
        .custom-btn:active { transform: translateY(0); }
        .list-item-hover:hover { background-color: #F1F5F9 !important; }
        .checkbox-hover:hover { border-color: ${colors.primary}; background-color: ${colors.bgLight}; }
        .hover-underline:hover { text-decoration: underline; }
        .close-btn-hover:hover { background-color: #F1F5F9; color: ${colors.danger}; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #94A3B8; }
      `}</style>
      <div style={styles.modalContainer} onClick={onClose}>
        <div style={styles.modalBody} onClick={(e) => e.stopPropagation()}>
          <div style={styles.modalHeader}>
            <h2 style={styles.modalTitle}>Novo Contrato</h2>
            <button style={styles.closeButton} onClick={onClose} className="close-btn-hover"><CloseIcon /></button>
          </div>
          {step === "selection" ? (
            <StepClientSelection clientSearchTerm={clientSearchTerm} setClientSearchTerm={setClientSearchTerm} searchClient={searchClient} clientsSearched={clientsSearched} handleSelectClient={handleSelectClient} isLoading={isLoading} isInitialLoading={isInitialLoading} selectedClient={selectedClient} />
          ) : (
            <StepContractConfiguration
              selectedClient={selectedClient} minPurchaseValue={minPurchaseValue} investValue={investValue} setInvestValue={setInvestValue} formattedValue={formattedValue} duration={duration} setDuration={setDuration} availableMonths={availableMonths} withGem={withGem} setWithGem={setWithGem}
              isRetroactive={isRetroactive} setIsRetroactive={setIsRetroactive} retroactiveDate={retroactiveDate} setRetroactiveDate={setRetroactiveDate}
              isCustom={isCustom} setIsCustom={setIsCustom} customMonths={customMonths} setCustomMonths={setCustomMonths} customGain={customGain} setCustomGain={setCustomGain}
              simulationResult={simulationResult} handleSimulateClick={handleSimulateClick} handleCreateContract={handleCreateContract} isSimulating={isSimulating} isCreating={isCreating} handleBack={() => { setStep("selection"); setSimulationResult(null); }}
            />
          )}
        </div>
      </div>
    </>
  );
}