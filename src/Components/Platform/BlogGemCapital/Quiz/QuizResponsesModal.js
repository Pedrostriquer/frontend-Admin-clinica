import React, { useState, useEffect } from "react";
import styles from "./QuizResponsesModalStyle";
import { FiX, FiCheck, FiCircle } from "react-icons/fi";

const QuizResponsesModal = ({
  isOpen,
  onClose,
  quiz,
  loading,
  onMarkAsContacted,
  onUpdateObservations,
  onFetchResponses,
}) => {
  const [responses, setResponses] = useState([]);
  const [loadingResponses, setLoadingResponses] = useState(false);
  const [selectedResponse, setSelectedResponse] = useState(null);
  const [filterContacted, setFilterContacted] = useState("all");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen && quiz && onFetchResponses) {
      fetchResponses();
    }
  }, [isOpen, quiz, onFetchResponses]);

  const fetchResponses = async () => {
    if (!quiz || !onFetchResponses) return;

    try {
      setLoadingResponses(true);
      setError("");
      const data = await onFetchResponses(quiz.id);
      setResponses(data || []);
    } catch (err) {
      setError(err.message || "Erro ao buscar respostas");
    } finally {
      setLoadingResponses(false);
    }
  };

  const filteredResponses = responses.filter((r) => {
    if (filterContacted === "contacted") return r.contacted;
    if (filterContacted === "not-contacted") return !r.contacted;
    return true;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!isOpen) return null;

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div
        style={{
          ...styles.modalContent,
          maxWidth: selectedResponse ? "600px" : "900px",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {!selectedResponse ? (
          <>
            <div style={styles.modalHeader}>
              <div>
                <h2 style={styles.modalTitle}>Respostas: {quiz?.name}</h2>
                <p style={styles.modalSubtitle}>
                  Total de {responses.length} resposta(s)
                </p>
              </div>
              <button style={styles.closeButton} onClick={onClose}>
                <FiX size={24} />
              </button>
            </div>

            {error && <div style={styles.errorMessage}>{error}</div>}

            <div style={styles.filterSection}>
              <select
                style={styles.filterSelect}
                value={filterContacted}
                onChange={(e) => setFilterContacted(e.target.value)}
              >
                <option value="all">
                  Todos ({responses.length})
                </option>
                <option value="contacted">
                  Contactados (
                  {responses.filter((r) => r.contacted).length})
                </option>
                <option value="not-contacted">
                  Não Contactados (
                  {responses.filter((r) => !r.contacted).length})
                </option>
              </select>
            </div>

            <div style={styles.responsesContainer}>
              {loadingResponses ? (
                <div style={styles.loadingContainer}>
                  <div style={styles.spinner}></div>
                  <p>Carregando respostas...</p>
                </div>
              ) : filteredResponses.length > 0 ? (
                <div style={styles.responsesList}>
                  {filteredResponses.map((response) => (
                    <div
                      key={response.id}
                      style={styles.responseCard}
                      onClick={() => setSelectedResponse(response)}
                    >
                      <div style={styles.responseCardHeader}>
                        <div style={styles.responseCardInfo}>
                          <h4 style={styles.responseCardName}>
                            {response.fullName}
                          </h4>
                          <p style={styles.responseCardEmail}>
                            {response.email}
                          </p>
                          <p style={styles.responseCardPhone}>
                            {response.phone}
                          </p>
                        </div>
                        <div style={styles.responseCardMeta}>
                          <span
                            style={{
                              ...styles.contactBadge,
                              backgroundColor: response.contacted
                                ? "#d1fae5"
                                : "#f3f4f6",
                              color: response.contacted ? "#047857" : "#6b7280",
                            }}
                          >
                            {response.contacted ? (
                              <>
                                <FiCheck size={14} style={{ marginRight: "4px" }} />
                                Contactado
                              </>
                            ) : (
                              <>
                                <FiCircle size={14} style={{ marginRight: "4px" }} />
                                Não Contactado
                              </>
                            )}
                          </span>
                          <span style={styles.responseDate}>
                            {formatDate(response.respondedAt)}
                          </span>
                        </div>
                      </div>

                      <div style={styles.responseCardFooter}>
                        <small style={styles.clickHint}>
                          Clique para ver detalhes
                        </small>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={styles.emptyState}>
                  <p>Nenhuma resposta encontrada</p>
                </div>
              )}
            </div>
          </>
        ) : (
          <ResponseDetail
            response={selectedResponse}
            onBack={() => setSelectedResponse(null)}
            onMarkAsContacted={() => {
              onMarkAsContacted(selectedResponse.id);
              fetchResponses();
              setSelectedResponse(null);
            }}
            onUpdateObservations={(obs) => {
              onUpdateObservations(selectedResponse.id, obs);
              fetchResponses();
              setSelectedResponse(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

const ResponseDetail = ({
  response,
  onBack,
  onMarkAsContacted,
  onUpdateObservations,
}) => {
  const [observations, setObservations] = useState(
    response.adminObservations || ""
  );
  const [saving, setSaving] = useState(false);

  const handleSaveObservations = async () => {
    setSaving(true);
    await onUpdateObservations(observations);
    setSaving(false);
  };

  return (
    <>
      <div style={styles.detailHeader}>
        <div>
          <button style={styles.backButton} onClick={onBack}>
            ← Voltar
          </button>
          <h3 style={styles.detailTitle}>{response.fullName}</h3>
          <p style={styles.detailSubtitle}>{response.email}</p>
        </div>
      </div>

      <div style={styles.detailContent}>
        <div style={styles.detailSection}>
          <label style={styles.detailLabel}>Email</label>
          <p style={styles.detailValue}>{response.email}</p>
        </div>

        <div style={styles.detailSection}>
          <label style={styles.detailLabel}>Telefone</label>
          <p style={styles.detailValue}>{response.phone}</p>
        </div>

        <div style={styles.detailSection}>
          <label style={styles.detailLabel}>IP Address</label>
          <p style={styles.detailValue}>{response.ipAddress}</p>
        </div>

        <div style={styles.detailSection}>
          <label style={styles.detailLabel}>Status de Contato</label>
          <p style={styles.detailValue}>
            {response.contacted ? "✓ Contactado" : "○ Não Contactado"}
            {response.contactedAt && (
              <small style={{ display: "block", color: "#6b7280", marginTop: "4px" }}>
                em {new Date(response.contactedAt).toLocaleDateString("pt-BR")}
              </small>
            )}
          </p>
        </div>

        <div style={styles.detailSection}>
          <label style={styles.detailLabel}>Observações do Admin</label>
          <textarea
            style={styles.observationsTextarea}
            value={observations}
            onChange={(e) => setObservations(e.target.value)}
            placeholder="Adicione suas observações sobre este lead"
            rows="4"
          />
        </div>

        {response.quizSnapshot && (
          <div style={styles.detailSection}>
            <label style={styles.detailLabel}>Quiz Respondido</label>
            <pre style={styles.jsonDisplay}>
              {JSON.stringify(response.quizSnapshot, null, 2)}
            </pre>
          </div>
        )}
      </div>

      <div style={styles.detailActions}>
        <button style={styles.cancelButton} onClick={onBack}>
          Voltar
        </button>
        {!response.contacted && (
          <button
            style={styles.contactButton}
            onClick={onMarkAsContacted}
          >
            Marcar como Contactado
          </button>
        )}
        <button
          style={styles.saveButton}
          onClick={handleSaveObservations}
          disabled={saving}
        >
          {saving ? "Salvando..." : "Salvar Observações"}
        </button>
      </div>
    </>
  );
};

export default QuizResponsesModal;
