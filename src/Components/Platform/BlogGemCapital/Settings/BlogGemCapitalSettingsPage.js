import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useLoad } from "../../../../Context/LoadContext";
import { useToast } from "../../../../Components/Toast/ToastContainer";
import gemCapitalBlogCampaignService from "../../../../dbServices/gemCapitalBlogCampaignService";
import LastExecutionWarningCard from "./LastExecutionWarningCard";
import {
  styles,
  spinnerStyles,
  mergeStyles,
} from "./BlogGemCapitalSettingsPageStyle";

const days = [
  { value: 0, label: "Domingo" },
  { value: 1, label: "Segunda-feira" },
  { value: 2, label: "Terça-feira" },
  { value: 3, label: "Quarta-feira" },
  { value: 4, label: "Quinta-feira" },
  { value: 5, label: "Sexta-feira" },
  { value: 6, label: "Sábado" },
];

export default function BlogGemCapitalSettingsPage() {
  const navigate = useNavigate();
  const { startLoading, stopLoading } = useLoad();
  const toast = useToast();

  const [config, setConfig] = useState({
    day_of_week: 1,
    hour: 9,
    minute: 0,
    is_automatic: false,
    last_executed_date: null,
  });

  const [timeline, setTimeline] = useState([]);
  const [summary, setSummary] = useState({
    totalExecutions: 0,
    totalSuccess: 0,
    totalFailed: 0,
    lastExecutionDate: null,
    periodTotal: 0,
    periodSuccess: 0,
    periodFailed: 0,
    isFilteredByDate: false,
  });

  const [filters, setFilters] = useState({
    page: 1,
    pageSize: 10,
    search: "",
    status: "",
    startDate: "",
    endDate: "",
    orderBy: "desc",
  });

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [filterLoading, setFilterLoading] = useState(false);
  const [buttonHover, setButtonHover] = useState(false);
  const [actionButtonHover, setActionButtonHover] = useState(null);
  const [clearing, setClearing] = useState(false);
  const [showManualSendModal, setShowManualSendModal] = useState(false);
  const [manualSendConfirmed, setManualSendConfirmed] = useState(false);
  const [sendingManually, setSendingManually] = useState(false);

  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.textContent = spinnerStyles;
    document.head.appendChild(styleSheet);
    return () => document.head.removeChild(styleSheet);
  }, []);

  const fetchTimeline = useCallback(async (currentFilters) => {
    try {
      setFilterLoading(true);
      const response = await gemCapitalBlogCampaignService.getExecutionTimeline(
        currentFilters
      );
      setTimeline(response.data);
      setSummary(response.summary);
      setPagination(response.pagination);
    } catch (error) {
      console.error("Erro ao carregar timeline:", error);
      toast.error("Erro ao carregar histórico");
    } finally {
      setFilterLoading(false);
    }
  }, [toast]);

  const fetchInitialData = async () => {
    try {
      startLoading();
      setLoading(true);
      const configData = await gemCapitalBlogCampaignService.getCronConfig();
      console.log(configData)
      setConfig(configData);
      await fetchTimeline(filters);
    } catch (error) {
      toast.error("Erro ao carregar dados");
    } finally {
      stopLoading();
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const handleClearLastExecutedDate = async () => {
    try {
      setClearing(true);
      await gemCapitalBlogCampaignService.clearLastExecutedDate();
      toast.success("Trava de segurança removida com sucesso!");
      // Recarregar tudo para refletir a mudança
      await fetchInitialData();
    } catch (error) {
      toast.error("Erro ao remover trava");
      console.error("Erro:", error);
    } finally {
      setClearing(false);
    }
  };

  const handleSendCampaignManual = async () => {
    if (!manualSendConfirmed) {
      toast.error("Confirme o envio marcando a checkbox");
      return;
    }

    try {
      setSendingManually(true);
      startLoading();
      await gemCapitalBlogCampaignService.sendCampaignAdminForce(true);
      toast.success("Campanha disparada com sucesso!");
      setShowManualSendModal(false);
      setManualSendConfirmed(false);
      // Recarregar tudo para refletir a mudança
      await fetchInitialData();
    } catch (error) {
      toast.error("Erro ao disparar campanha");
      console.error("Erro:", error);
    } finally {
      setSendingManually(false);
      stopLoading();
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      startLoading();
      await gemCapitalBlogCampaignService.updateCronConfig(config);
      toast.success("Configurações salvas com sucesso!");
    } catch (error) {
      toast.error("Erro ao salvar configurações");
    } finally {
      setSaving(false);
      stopLoading();
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value, page: 1 }));
  };

  const applyFilters = () => {
    fetchTimeline(filters);
  };

  const clearFilters = () => {
    const resetFilters = {
      page: 1,
      pageSize: 10,
      search: "",
      status: "",
      startDate: "",
      endDate: "",
      orderBy: "desc",
    };
    setFilters(resetFilters);
    fetchTimeline(resetFilters);
  };

  const handlePageChange = (newPage) => {
    const updatedFilters = { ...filters, page: newPage };
    setFilters(updatedFilters);
    fetchTimeline(updatedFilters);
  };

  const handleChange = (field, value) => {
    setConfig({ ...config, [field]: value });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "--";
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "--" : date.toLocaleString("pt-BR");
  };

  if (loading) {
    return (
      <div style={styles.settingsLoading}>
        <div style={styles.spinner}></div>
        <p>Carregando plataforma...</p>
      </div>
    );
  }


  return (
    <div style={styles.settingsContainer}>
      {/* BOTÃO DE DISPARO MANUAL */}
      <div style={styles.manualSendButtonContainer}>
        <button
          onClick={() => setShowManualSendModal(true)}
          disabled={sendingManually}
          onMouseEnter={() => setActionButtonHover("manualSend")}
          onMouseLeave={() => setActionButtonHover(null)}
          style={mergeStyles(
            styles.buttonManualSend,
            actionButtonHover === "manualSend" && styles.buttonManualSendHover,
            sendingManually && styles.buttonManualSendDisabled
          )}
        >
          <i className="fa-solid fa-rocket"></i>
          {sendingManually ? "Enviando..." : "Enviar Campanha Manualmente"}
        </button>
      </div>

      {/* SEÇÃO 1: CONFIGURAÇÕES */}
      <div style={styles.settingsCard}>
        <div style={styles.settingsHeader}>
          <h2 style={styles.settingsHeaderH2}>
            <i className="fa-solid fa-paper-plane"></i> Conf. Campanha
          </h2>
          <p style={styles.settingsHeaderP}>
            Gerencie o agendamento de disparos automáticos de email
          </p>
        </div>

        <div style={styles.settingsContent}>
          <div style={styles.settingsSection}>
            <div style={styles.settingItem}>
              <div style={styles.settingLabel}>
                <label style={styles.settingLabelLabel} htmlFor="is_automatic">
                  Ativar Disparo Automático
                </label>
                <span style={styles.settingDescription}>
                  Os emails serão enviados apenas uma vez por dia, respeitando o
                  ciclo de 24h.
                </span>
              </div>
              <div style={styles.settingControl}>
                <input
                  id="is_automatic"
                  type="checkbox"
                  checked={config.is_automatic}
                  onChange={(e) =>
                    handleChange("is_automatic", e.target.checked)
                  }
                  style={styles.checkboxInput}
                />
                <span
                  style={mergeStyles(
                    styles.toggleIndicator,
                    config.is_automatic && styles.toggleIndicatorActive
                  )}
                >
                  {config.is_automatic ? "Ativado" : "Desativado"}
                </span>
              </div>
            </div>
          </div>

          {config.is_automatic && (
            <div style={styles.scheduleSection}>
              <h3 style={styles.settingsSectionH3}>Agendamento</h3>
              <div style={styles.settingItem}>
                <div style={styles.settingLabel}>
                  <label style={styles.settingLabelLabel}>Dia da Semana</label>
                </div>
                <div style={styles.settingControl}>
                  <select
                    value={config.day_of_week}
                    onChange={(e) =>
                      handleChange("day_of_week", parseInt(e.target.value))
                    }
                    style={styles.selectInput}
                  >
                    {days.map((day) => (
                      <option key={day.value} value={day.value}>
                        {day.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={styles.settingItemLast}>
                <div style={styles.settingLabel}>
                  <label style={styles.settingLabelLabel}>
                    Hora e Minuto (Horário Local)
                  </label>
                </div>
                <div style={styles.settingControl}>
                  <input
                    type="number"
                    min="0"
                    max="23"
                    value={config.hour}
                    onChange={(e) =>
                      handleChange(
                        "hour",
                        Math.max(0, Math.min(23, parseInt(e.target.value) || 0))
                      )
                    }
                    style={styles.numberInput}
                  />
                  <span style={{ fontWeight: "bold" }}>:</span>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={config.minute}
                    onChange={(e) =>
                      handleChange(
                        "minute",
                        Math.max(0, Math.min(59, parseInt(e.target.value) || 0))
                      )
                    }
                    style={styles.numberInput}
                  />
                </div>
              </div>

              <div style={styles.scheduleSummary}>
                <i
                  className="fa-solid fa-circle-check"
                  style={styles.scheduleSummaryIcon}
                ></i>
                <span>
                  Configurado para disparar toda{" "}
                  <strong>
                    {days.find((d) => d.value === config.day_of_week)?.label}
                  </strong>{" "}
                  às{" "}
                  <strong>
                    {String(config.hour).padStart(2, "0")}:
                    {String(config.minute).padStart(2, "0")}
                  </strong>
                  .
                </span>
              </div>
            </div>
          )}
        </div>

        <div style={styles.settingsFooter}>
          <button
            onClick={handleSave}
            disabled={saving}
            onMouseEnter={() => setButtonHover(true)}
            onMouseLeave={() => setButtonHover(false)}
            style={mergeStyles(
              styles.buttonSave,
              !saving && buttonHover && styles.buttonSaveHover,
              saving && styles.buttonSaveDisabled
            )}
          >
            <i className="fa-solid fa-floppy-disk"></i>
            {saving ? "Salvando..." : "Salvar Configurações"}
          </button>
        </div>
      </div>

      {/* 🆕 NOVO: Warning de Última Execução */}
      <LastExecutionWarningCard
        lastExecutedDate={config.last_executed_date}
        onClear={handleClearLastExecutedDate}
        isLoading={clearing}
        styles={styles}
      />

      {/* SEÇÃO 2: SUMÁRIO E TIMELINE */}
      <div style={styles.summaryGrid}>
        <div style={styles.summaryCard}>
          <div style={styles.summaryIconContainer}>
            <i
              className="fa-solid fa-layer-group"
              style={{ color: "#6366f1" }}
            ></i>
          </div>
          <div style={styles.summaryContent}>
            <span style={styles.summaryLabel}>Total Geral</span>
            <strong style={styles.summaryValue}>
              {summary.totalExecutions}
            </strong>
          </div>
        </div>
        <div style={styles.summaryCard}>
          <div style={styles.summaryIconContainer}>
            <i
              className="fa-solid fa-circle-check"
              style={{ color: "#10b981" }}
            ></i>
          </div>
          <div style={styles.summaryContent}>
            <span style={styles.summaryLabel}>Sucessos</span>
            <strong style={{ ...styles.summaryValue, color: "#10b981" }}>
              {summary.totalSuccess}
            </strong>
          </div>
        </div>
        <div style={styles.summaryCard}>
          <div style={styles.summaryIconContainer}>
            <i
              className="fa-solid fa-circle-xmark"
              style={{ color: "#ef4444" }}
            ></i>
          </div>
          <div style={styles.summaryContent}>
            <span style={styles.summaryLabel}>Falhas</span>
            <strong style={{ ...styles.summaryValue, color: "#ef4444" }}>
              {summary.totalFailed}
            </strong>
          </div>
        </div>
        <div style={styles.summaryCard}>
          <div style={styles.summaryIconContainer}>
            <i
              className="fa-solid fa-calendar-day"
              style={{ color: "#f59e0b" }}
            ></i>
          </div>
          <div style={styles.summaryContent}>
            <span style={styles.summaryLabel}>Última Execução</span>
            <strong style={styles.summaryValue}>
              {summary.lastExecutionDate
                ? new Date(summary.lastExecutionDate).toLocaleDateString(
                    "pt-BR"
                  )
                : "--"}
            </strong>
          </div>
        </div>
        <div style={styles.summaryCard}>
          <div style={styles.summaryIconContainer}>
            <i
              className="fa-solid fa-eye"
              style={{ color: "#8b5cf6" }}
            ></i>
          </div>
          <div style={styles.summaryContent}>
            <span style={styles.summaryLabel}>Total de Visualizações</span>
            <strong style={{ ...styles.summaryValue, color: "#8b5cf6" }}>
              {summary.totalViews || 0}
            </strong>
          </div>
        </div>
        <div style={styles.summaryCard}>
          <div style={styles.summaryIconContainer}>
            <i
              className="fa-solid fa-computer-mouse"
              style={{ color: "#ec4899" }}
            ></i>
          </div>
          <div style={styles.summaryContent}>
            <span style={styles.summaryLabel}>Total de Cliques</span>
            <strong style={{ ...styles.summaryValue, color: "#ec4899" }}>
              {summary.totalClicks || 0}
            </strong>
          </div>
        </div>
      </div>

      {summary.isFilteredByDate && (
        <div style={styles.periodBadge}>
          <i className="fa-solid fa-filter"></i>
          <span>
            Período: <strong>{summary.periodTotal}</strong> execuções (
            <span style={{ color: "#059669" }}>
              {summary.periodSuccess} Sucessos
            </span>{" "}
            |
            <span style={{ color: "#dc2626" }}>
              {" "}
              {summary.periodFailed} Falhas
            </span>
            )
          </span>
        </div>
      )}

      <div style={styles.timelineCard}>
        <div style={styles.timelineHeader}>
          <h3
            style={{
              margin: 0,
              fontSize: "18px",
              color: "#1e293b",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <i className="fa-solid fa-clock-rotate-left"></i> Histórico de
            Execuções
          </h3>
        </div>

        <div style={styles.filterSection}>
          <div style={styles.filterGrid}>
            <div style={styles.filterGroup}>
              <label style={styles.label}>Mensagem</label>
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Buscar..."
                style={styles.input}
              />
            </div>
            <div style={styles.filterGroup}>
              <label style={styles.label}>Status</label>
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                style={styles.select}
              >
                <option value="">Todos</option>
                <option value="success">Sucesso</option>
                <option value="failed">Falha</option>
              </select>
            </div>
            <div style={styles.filterGroup}>
              <label style={styles.label}>Início</label>
              <input
                type="date"
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
                style={styles.input}
              />
            </div>
            <div style={styles.filterGroup}>
              <label style={styles.label}>Fim</label>
              <input
                type="date"
                name="endDate"
                value={filters.endDate}
                onChange={handleFilterChange}
                style={styles.input}
              />
            </div>
            <div style={styles.buttonGroup}>
              <button onClick={applyFilters} style={styles.btnApply}>
                Filtrar
              </button>
              <button onClick={clearFilters} style={styles.btnClear}>
                Limpar
              </button>
            </div>
          </div>
        </div>

        <div style={{ padding: "0 20px", position: "relative" }}>
          {filterLoading && (
            <div style={styles.tableLoadingOverlay}>
              <div style={styles.miniSpinner}></div>
              <p>Pesquisando...</p>
            </div>
          )}
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Data/Hora</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Mensagem</th>
                <th style={styles.th}>Visualizações</th>
                <th style={styles.th}>Cliques</th>
                <th style={styles.th}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {timeline.length > 0 ? (
                timeline.map((item) => (
                  <tr key={item.id} style={styles.tr}>
                      <td style={styles.td}>
                      #{item.id}
                    </td>
                    <td style={styles.td}>
                      {formatDate(item.executedAt)}
                    </td>
                    <td style={styles.td}>
                      <span
                        style={
                          item.status === "success"
                            ? styles.statusSuccess
                            : styles.statusError
                        }
                      >
                        {item.status.toUpperCase()}
                      </span>
                    </td>
                    <td style={styles.td}>{item.message}</td>
                    <td style={styles.td}>
                      <div style={styles.metricsCell}>
                        <i
                          className="fa-solid fa-eye"
                          style={{ color: "#8b5cf6" }}
                        ></i>
                        <span>{item.email_opens || 0}</span>
                      </div>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.metricsCell}>
                        <i
                          className="fa-solid fa-computer-mouse"
                          style={{ color: "#ec4899" }}
                        ></i>
                        <span>{item.link_clicks || 0}</span>
                      </div>
                    </td>
                    <td style={styles.td}>
                      <button
                        onClick={() =>
                          navigate(
                            `/platform/blog-gemcapital/execution/${item.id}`
                          )
                        }
                        onMouseEnter={() => setActionButtonHover(item.id)}
                        onMouseLeave={() => setActionButtonHover(null)}
                        style={mergeStyles(
                          styles.actionButton,
                          actionButtonHover === item.id &&
                            styles.actionButtonHover
                        )}
                      >
                        <i className="fa-solid fa-eye"></i> Detalhes
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={styles.tdEmpty}>
                    Nenhum registro.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div style={styles.paginationContainer}>
          <div style={styles.paginationInfo}>
            Mostrando {timeline.length} de {pagination.totalItems}
          </div>
          <div style={styles.paginationControls}>
            <button
              disabled={pagination.currentPage === 1}
              onClick={() => handlePageChange(filters.page - 1)}
              style={styles.pageButton}
            >
              Anterior
            </button>
            <span style={styles.pageInfo}>
              {pagination.currentPage} / {pagination.totalPages}
            </span>
            <button
              disabled={
                pagination.currentPage === pagination.totalPages ||
                pagination.totalPages === 0
              }
              onClick={() => handlePageChange(filters.page + 1)}
              style={styles.pageButton}
            >
              Próxima
            </button>
          </div>
        </div>
      </div>

      {/* MODAL DE CONFIRMAÇÃO DE ENVIO MANUAL */}
      {showManualSendModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>
                <i className="fa-solid fa-triangle-exclamation"></i> Enviar
                Campanha Manualmente
              </h3>
              <button
                onClick={() => {
                  setShowManualSendModal(false);
                  setManualSendConfirmed(false);
                }}
                style={styles.modalCloseBtn}
              >
                ✕
              </button>
            </div>

            <div style={styles.modalContent}>
              <p style={styles.modalMessage}>
                Você está prestes a enviar a campanha para todos os subscribers
                ativos, <strong>ignorando a trava de segurança diária</strong>.
              </p>
              <p style={styles.modalSubMessage}>
                A trava será reativada após o envio, impedindo novos disparos
                nas próximas 24 horas.
              </p>

              <div style={styles.modalCheckbox}>
                <input
                  type="checkbox"
                  id="confirmManualSend"
                  checked={manualSendConfirmed}
                  onChange={(e) => setManualSendConfirmed(e.target.checked)}
                  style={styles.checkboxInput}
                />
                <label htmlFor="confirmManualSend" style={styles.checkboxLabel}>
                  Confirmo que desejo enviar a campanha manualmente
                </label>
              </div>
            </div>

            <div style={styles.modalFooter}>
              <button
                onClick={() => {
                  setShowManualSendModal(false);
                  setManualSendConfirmed(false);
                }}
                style={styles.buttonCancel}
              >
                Cancelar
              </button>
              <button
                onClick={handleSendCampaignManual}
                disabled={!manualSendConfirmed || sendingManually}
                style={mergeStyles(
                  styles.buttonConfirmSend,
                  (!manualSendConfirmed || sendingManually) &&
                    styles.buttonConfirmSendDisabled
                )}
              >
                <i className="fa-solid fa-paper-plane"></i>{" "}
                {sendingManually ? "Enviando..." : "Confirmar e Enviar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
