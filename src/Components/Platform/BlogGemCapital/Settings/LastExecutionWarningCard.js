import React, { useState } from "react";

export default function LastExecutionWarningCard({
  lastExecutedDate,
  onClear,
  isLoading,
  styles,
}) {
  const [showConfirmation, setShowConfirmation] = useState(false);

  const formatDateTime = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return isNaN(date.getTime())
      ? null
      : date.toLocaleString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });
  };

  const handleClearClick = async () => {
    if (!showConfirmation) {
      setShowConfirmation(true);
      return;
    }

    try {
      await onClear();
      setShowConfirmation(false);
    } catch (error) {
      console.error("Erro ao limpar execução:", error);
    }
  };

  const handleCancel = () => {
    setShowConfirmation(false);
  };

  const isTodayExecution = () => {
    if (!lastExecutedDate) return false;
    const executionDate = new Date(lastExecutedDate).toDateString();
    const today = new Date().toDateString();
    return executionDate === today;
  };

  const formattedDate = formatDateTime(lastExecutedDate);

  const mergeStyles = (...stylesToMerge) => {
    return Object.assign({}, ...stylesToMerge);
  };

  return (
    <div style={styles.warningCard}>
      <div style={styles.warningHeader}>
        <i
          className="fa-solid fa-shield-exclamation"
          style={styles.warningIcon}
        ></i>
        <h3 style={styles.warningTitle}>🔒 Trava de Segurança Ativa</h3>
      </div>

      <div style={styles.warningContent}>
        {lastExecutedDate ? (
          <>
            <p style={styles.warningText}>
              <strong>Última execução:</strong>{" "}
              <span style={styles.highlightDate}>{formattedDate}</span>
            </p>

            {isTodayExecution() && (
              <div style={styles.warningBadge}>
                <i className="fa-solid fa-circle-check"></i>
                <span>Já foi executado hoje</span>
              </div>
            )}

            <p style={styles.warningDescription}>
              Para evitar envios duplicados, a plataforma permite apenas{" "}
              <strong>um envio automático por dia</strong>. Se você deseja executar a
              campanha automaticamente hoje novamente, clique no botão abaixo para remover a
              trava.
            </p>

            <div style={styles.warningInfoBox}>
              <i
                className="fa-solid fa-info-circle"
                style={styles.warningInfoIcon}
              ></i>
              <div>
                <strong>ℹ️ Importante:</strong> Limpar este registro{" "}
                <u>NÃO apagará</u> a timeline de execuções anteriores. Todas as
                estatísticas (visualizações, cliques, envios) do último envio
                continuarão visíveis no histórico. Você apenas estará removendo
                a trava para permitir um novo envio no mesmo dia.
              </div>
            </div>

            {showConfirmation ? (
              <div style={styles.confirmationBox}>
                <p style={styles.confirmationText}>
                  ⚠️ Você tem certeza que deseja remover a trava?
                </p>
                <div style={styles.confirmationButtons}>
                  <button
                    onClick={handleClearClick}
                    disabled={isLoading}
                    style={mergeStyles(
                      styles.btnConfirmClear,
                      isLoading && styles.btnDisabled
                    )}
                  >
                    {isLoading ? (
                      <>
                        <span style={styles.spinner}></span> Removendo...
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-check"></i> Sim, remover
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={isLoading}
                    style={mergeStyles(
                      styles.btnCancelClear,
                      isLoading && styles.btnDisabled
                    )}
                  >
                    <i className="fa-solid fa-times"></i> Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={handleClearClick}
                disabled={isLoading}
                style={mergeStyles(
                  styles.btnClearExecution,
                  isLoading && styles.btnDisabled
                )}
                onMouseEnter={(e) => {
                  e.target.style.background = "#d97706";
                  e.target.style.boxShadow =
                    "0 4px 12px rgba(245, 158, 11, 0.4)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "#f59e0b";
                  e.target.style.boxShadow = "none";
                }}
              >
                <i className="fa-solid fa-trash-restore"></i>
                {isLoading ? "Removendo..." : "Remover Trava de Hoje"}
              </button>
            )}
          </>
        ) : (
          <p style={styles.warningText}>
            <i
              className="fa-solid fa-circle-check"
              style={{ color: "#10b981", marginRight: "8px" }}
            ></i>
            Nenhuma execução registrada hoje. Você pode executar a campanha
            normalmente.
          </p>
        )}
      </div>
    </div>
  );
}
