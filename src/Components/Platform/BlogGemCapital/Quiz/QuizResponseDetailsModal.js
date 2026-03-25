import React, { useState, useMemo } from "react";
import ReactDOM from "react-dom";
import styles from "./QuizResponseDetailsModalStyle";
import { FiX, FiChevronLeft, FiChevronRight, FiCheck, FiEdit2 } from "react-icons/fi";

const QuizResponseDetailsModal = ({ response, quiz, onClose, onMarkAsContacted, onUpdateObservations, onUpdateLeadQuality, onUpdateInvestorProfile }) => {
  const [activeTab, setActiveTab] = useState("lead"); // "lead" ou "quiz"
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showObservationEditor, setShowObservationEditor] = useState(false);
  const [observationText, setObservationText] = useState(response?.adminObservations || "");
  const [showQualityEditor, setShowQualityEditor] = useState(false);
  const [isSavingObservation, setIsSavingObservation] = useState(false);
  const [isSavingQuality, setIsSavingQuality] = useState(false);
  const [savingMessage, setSavingMessage] = useState("");
  const [selectedQuality, setSelectedQuality] = useState(response?.leadQuality ?? 0);
  const [showInvestorProfileEditor, setShowInvestorProfileEditor] = useState(false);
  const [investorProfileText, setInvestorProfileText] = useState(response?.investorProfile || "");
  const [isSavingInvestorProfile, setIsSavingInvestorProfile] = useState(false);

  // Parsear os snapshots
  const quizData = useMemo(() => {
    try {
      if (!response.quizSnapshot) return {};
      if (typeof response.quizSnapshot === "object") {
        return response.quizSnapshot;
      }
      return JSON.parse(response.quizSnapshot) || {};
    } catch (e) {
      console.error("Erro ao parsear quizSnapshot:", e);
      return {};
    }
  }, [response.quizSnapshot]);

  const responsesData = useMemo(() => {
    try {
      if (!response.responsesSnapshot) return [];
      if (Array.isArray(response.responsesSnapshot)) {
        return response.responsesSnapshot;
      }
      const parsed = JSON.parse(response.responsesSnapshot);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error("Erro ao parsear responsesSnapshot:", e);
      return [];
    }
  }, [response.responsesSnapshot]);

  const questions = useMemo(() => {
    if (quizData && quizData.Questions) {
      return quizData.Questions;
    }
    if (quizData && quizData.questions) {
      return quizData.questions;
    }
    return [];
  }, [quizData]);

  const currentQuestion = questions[currentQuestionIndex] || null;

  const currentAnswer = useMemo(() => {
    if (!currentQuestion || !responsesData.length) return null;
    const response = responsesData.find(
      (r) => r.QuestionId === currentQuestion.Id || r.questionId === currentQuestion.id
    );
    return response?.SelectedAlternative || response?.selectedAlternative || null;
  }, [currentQuestion, responsesData]);

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleSaveObservation = async () => {
    if (onUpdateObservations) {
      try {
        setIsSavingObservation(true);
        setSavingMessage("Salvando anotações...");
        await onUpdateObservations(response.id, observationText);
        setSavingMessage("✓ Anotações salvas com sucesso!");
        setTimeout(() => {
          setShowObservationEditor(false);
          setSavingMessage("");
        }, 1500);
      } catch (error) {
        setSavingMessage("✗ Erro ao salvar anotações");
        setTimeout(() => setSavingMessage(""), 2000);
      } finally {
        setIsSavingObservation(false);
      }
    }
  };

  const handleSaveQuality = async (quality) => {
    if (onUpdateLeadQuality) {
      try {
        setIsSavingQuality(true);
        setSavingMessage("Salvando avaliação...");
        await onUpdateLeadQuality(response.id, quality);
        setSavingMessage("✓ Avaliação salva com sucesso!");
        setTimeout(() => {
          setShowQualityEditor(false);
          setSavingMessage("");
        }, 1500);
      } catch (error) {
        setSavingMessage("✗ Erro ao salvar avaliação");
        setTimeout(() => setSavingMessage(""), 2000);
      } finally {
        setIsSavingQuality(false);
      }
    }
  };

  const handleSaveInvestorProfile = async () => {
    // This handler will be implemented when we add the backend endpoint
    if (onUpdateInvestorProfile) {
      try {
        setIsSavingInvestorProfile(true);
        setSavingMessage("Salvando perfil investidor...");
        await onUpdateInvestorProfile(response.id, investorProfileText);
        setSavingMessage("✓ Perfil investidor salvo com sucesso!");
        setTimeout(() => {
          setShowInvestorProfileEditor(false);
          setSavingMessage("");
        }, 1500);
      } catch (error) {
        setSavingMessage("✗ Erro ao salvar perfil investidor");
        setTimeout(() => setSavingMessage(""), 2000);
      } finally {
        setIsSavingInvestorProfile(false);
      }
    }
  };

  const leadQualityOptions = [
    { value: 0, label: "Não Avaliado" },
    { value: 1, label: "Ruim" },
    { value: 2, label: "Regular" },
    { value: 3, label: "Bom" },
    { value: 4, label: "Muito Bom" },
  ];

  const getQualityLabel = (quality) => {
    const option = leadQualityOptions.find(o => o.value === quality);
    return option ? option.label : "Não Avaliado";
  };

  return ReactDOM.createPortal(
    <>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
      <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerContent}>
            <h2 style={styles.title}>Detalhes da Resposta</h2>
            <p style={styles.subtitle}>
              {response.fullName} • {response.email}
            </p>
            {savingMessage && (
              <div style={{
                fontSize: "12px",
                marginTop: "8px",
                padding: "8px 12px",
                borderRadius: "4px",
                backgroundColor: isSavingQuality || isSavingObservation ? "#e7f5ff" : savingMessage.includes("✓") ? "#d1fae5" : "#fef3c7",
                color: isSavingQuality || isSavingObservation ? "#0066cc" : savingMessage.includes("✓") ? "#065f46" : "#92400e",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}>
                {(isSavingQuality || isSavingObservation) && (
                  <span style={{
                    display: "inline-block",
                    animation: "spin 1s linear infinite",
                    transformOrigin: "center",
                  }}>⏳</span>
                )}
                {savingMessage}
              </div>
            )}
          </div>
          <button style={styles.closeButton} onClick={onClose}>
            <FiX size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div style={{
          display: "flex",
          gap: "0",
          borderBottom: "2px solid #e9ecef",
          backgroundColor: "#f8f9fa",
          padding: "0 24px",
        }}>
          <button
            onClick={() => setActiveTab("lead")}
            style={{
              padding: "14px 20px",
              border: "none",
              backgroundColor: "transparent",
              cursor: "pointer",
              fontWeight: activeTab === "lead" ? "600" : "500",
              color: activeTab === "lead" ? "#007bff" : "#666",
              borderBottom: activeTab === "lead" ? "3px solid #007bff" : "none",
              fontSize: "14px",
              transition: "all 0.2s ease",
              marginBottom: "-2px",
            }}
          >
            👤 Detalhes do Lead
          </button>
          <button
            onClick={() => setActiveTab("quiz")}
            style={{
              padding: "14px 20px",
              border: "none",
              backgroundColor: "transparent",
              cursor: "pointer",
              fontWeight: activeTab === "quiz" ? "600" : "500",
              color: activeTab === "quiz" ? "#007bff" : "#666",
              borderBottom: activeTab === "quiz" ? "3px solid #007bff" : "none",
              fontSize: "14px",
              transition: "all 0.2s ease",
              marginBottom: "-2px",
            }}
          >
            📝 Ver Quiz
          </button>
        </div>

        {/* Content */}
        <div style={styles.content}>
          {/* Lead Tab */}
          {activeTab === "lead" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              {/* Lead Information */}
              <div style={{
                padding: "20px",
                backgroundColor: "#f8f9fa",
                borderRadius: "8px",
                border: "1px solid #e9ecef",
              }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                  <div>
                    <div style={{ fontSize: "12px", fontWeight: "600", color: "#666", marginBottom: "4px", textTransform: "uppercase" }}>
                      Nome
                    </div>
                    <div style={{ fontSize: "14px", fontWeight: "500", color: "#333" }}>
                      {response.fullName}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: "12px", fontWeight: "600", color: "#666", marginBottom: "4px", textTransform: "uppercase" }}>
                      Email
                    </div>
                    <div style={{ fontSize: "14px", fontWeight: "500", color: "#333" }}>
                      {response.email}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: "12px", fontWeight: "600", color: "#666", marginBottom: "4px", textTransform: "uppercase" }}>
                      Telefone
                    </div>
                    <div style={{ fontSize: "14px", fontWeight: "500", color: "#333" }}>
                      {response.phone}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: "12px", fontWeight: "600", color: "#666", marginBottom: "4px", textTransform: "uppercase" }}>
                      Data Resposta
                    </div>
                    <div style={{ fontSize: "14px", fontWeight: "500", color: "#333" }}>
                      {new Date(response.respondedAt).toLocaleDateString("pt-BR", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Investor Profile */}
              <div>
                <div style={{ fontSize: "12px", fontWeight: "600", color: "#666", marginBottom: "10px", textTransform: "uppercase" }}>
                  👥 Perfil Investidor
                </div>
                {!showInvestorProfileEditor ? (
                  <div style={{
                    padding: "14px",
                    backgroundColor: "#f8f9fa",
                    borderRadius: "8px",
                    border: "1px solid #e9ecef",
                    fontSize: "13px",
                    color: "#333",
                    minHeight: "50px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}>
                    <span style={{ flex: 1 }}>
                      {response?.investorProfile || "Não obtido"}
                    </span>
                    <button
                      onClick={() => setShowInvestorProfileEditor(true)}
                      disabled={isSavingInvestorProfile}
                      style={{
                        padding: "6px 12px",
                        backgroundColor: isSavingInvestorProfile ? "#ccc" : "#007bff",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        fontSize: "12px",
                        fontWeight: "600",
                        cursor: isSavingInvestorProfile ? "not-allowed" : "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        opacity: isSavingInvestorProfile ? 0.6 : 1,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {isSavingInvestorProfile ? "⏳" : <FiEdit2 size={13} />}
                      {isSavingInvestorProfile ? "Salvando..." : "Editar"}
                    </button>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {quiz?.investorProfileTypes && quiz.investorProfileTypes.length > 0 ? (
                      <>
                        <select
                          value={investorProfileText}
                          onChange={(e) => setInvestorProfileText(e.target.value)}
                          style={{
                            width: "100%",
                            padding: "12px",
                            borderRadius: "6px",
                            border: "1px solid #ddd",
                            fontSize: "13px",
                            fontFamily: "inherit",
                            backgroundColor: "white",
                          }}
                        >
                          <option value="">-- Selecione um perfil investidor --</option>
                          {quiz.investorProfileTypes.map((type, index) => (
                            <option key={index} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                        <div style={{ display: "flex", gap: "8px" }}>
                          <button
                            onClick={handleSaveInvestorProfile}
                            disabled={isSavingInvestorProfile || !investorProfileText}
                            style={{
                              flex: 1,
                              padding: "8px",
                              backgroundColor: isSavingInvestorProfile || !investorProfileText ? "#ccc" : "#007bff",
                              color: "white",
                              border: "none",
                              borderRadius: "4px",
                              fontSize: "12px",
                              fontWeight: "600",
                              cursor: isSavingInvestorProfile || !investorProfileText ? "not-allowed" : "pointer",
                              opacity: isSavingInvestorProfile || !investorProfileText ? 0.7 : 1,
                              transition: "all 0.2s ease",
                            }}
                          >
                            {isSavingInvestorProfile ? "⏳ Salvando..." : "✓ Salvar"}
                          </button>
                          <button
                            onClick={() => {
                              setShowInvestorProfileEditor(false);
                              setInvestorProfileText(response?.investorProfile || "");
                            }}
                            disabled={isSavingInvestorProfile}
                            style={{
                              flex: 1,
                              padding: "8px",
                              backgroundColor: isSavingInvestorProfile ? "#ddd" : "#e9ecef",
                              color: "#333",
                              border: "none",
                              borderRadius: "4px",
                              fontSize: "12px",
                              fontWeight: "600",
                              cursor: isSavingInvestorProfile ? "not-allowed" : "pointer",
                              opacity: isSavingInvestorProfile ? 0.6 : 1,
                            }}
                          >
                            ✕ Cancelar
                          </button>
                        </div>
                      </>
                    ) : (
                      <div style={{
                        padding: "12px",
                        backgroundColor: "#fee2e2",
                        borderRadius: "6px",
                        border: "1px solid #fecaca",
                        color: "#991b1b",
                        fontSize: "12px",
                        fontWeight: "500",
                      }}>
                        ⚠️ Nenhum tipo de perfil investidor configurado para este quiz
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Observations */}
              <div>
                <div style={{ fontSize: "12px", fontWeight: "600", color: "#666", marginBottom: "10px", textTransform: "uppercase" }}>
                  📝 Anotações
                </div>
                {!showObservationEditor ? (
                  <div style={{
                    padding: "14px",
                    backgroundColor: "#f8f9fa",
                    borderRadius: "8px",
                    border: "1px solid #e9ecef",
                    fontSize: "13px",
                    color: "#333",
                    minHeight: "100px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                  }}>
                    <span style={{ marginBottom: "12px", flex: 1 }}>
                      {response?.adminObservations || "Nenhuma anotação adicionada"}
                    </span>
                    <button
                      onClick={() => setShowObservationEditor(true)}
                      disabled={isSavingObservation}
                      style={{
                        alignSelf: "flex-start",
                        padding: "6px 12px",
                        backgroundColor: isSavingObservation ? "#ccc" : "#007bff",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        fontSize: "12px",
                        fontWeight: "600",
                        cursor: isSavingObservation ? "not-allowed" : "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        opacity: isSavingObservation ? 0.6 : 1,
                      }}
                    >
                      {isSavingObservation ? "⏳" : <FiEdit2 size={13} />}
                      {isSavingObservation ? "Salvando..." : "Editar"}
                    </button>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    <textarea
                      value={observationText}
                      onChange={(e) => setObservationText(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "6px",
                        border: "1px solid #ddd",
                        fontSize: "13px",
                        fontFamily: "inherit",
                        minHeight: "120px",
                        resize: "vertical",
                      }}
                      placeholder="Adicione anotações sobre este lead..."
                    />
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        onClick={handleSaveObservation}
                        disabled={isSavingObservation}
                        style={{
                          flex: 1,
                          padding: "8px",
                          backgroundColor: isSavingObservation ? "#ccc" : "#007bff",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          fontSize: "12px",
                          fontWeight: "600",
                          cursor: isSavingObservation ? "not-allowed" : "pointer",
                          opacity: isSavingObservation ? 0.7 : 1,
                          transition: "all 0.2s ease",
                        }}
                      >
                        {isSavingObservation ? "⏳ Salvando..." : "✓ Salvar"}
                      </button>
                      <button
                        onClick={() => {
                          setShowObservationEditor(false);
                          setObservationText(response?.adminObservations || "");
                        }}
                        disabled={isSavingObservation}
                        style={{
                          flex: 1,
                          padding: "8px",
                          backgroundColor: isSavingObservation ? "#ddd" : "#e9ecef",
                          color: "#333",
                          border: "none",
                          borderRadius: "4px",
                          fontSize: "12px",
                          fontWeight: "600",
                          cursor: isSavingObservation ? "not-allowed" : "pointer",
                          opacity: isSavingObservation ? 0.6 : 1,
                        }}
                      >
                        ✕ Cancelar
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Lead Quality - Small */}
              <div>
                <div style={{ fontSize: "12px", fontWeight: "600", color: "#666", marginBottom: "10px", textTransform: "uppercase" }}>
                  ⭐ Qualidade do Lead
                </div>
                {!showQualityEditor ? (
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{
                      padding: "6px 12px",
                      backgroundColor: "#f0f7ff",
                      borderRadius: "6px",
                      border: "1px solid #007bff",
                      fontSize: "12px",
                      fontWeight: "600",
                      color: "#007bff",
                    }}>
                      {getQualityLabel(response?.leadQuality)}
                    </div>
                    <button
                      onClick={() => setShowQualityEditor(true)}
                      disabled={isSavingQuality}
                      style={{
                        padding: "6px 12px",
                        backgroundColor: isSavingQuality ? "#ccc" : "#007bff",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        fontSize: "12px",
                        fontWeight: "600",
                        cursor: isSavingQuality ? "not-allowed" : "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        opacity: isSavingQuality ? 0.6 : 1,
                      }}
                    >
                      {isSavingQuality ? "⏳" : <FiEdit2 size={13} />}
                      {isSavingQuality ? "Salvando..." : "Avaliar"}
                    </button>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {leadQualityOptions.map((option) => (
                      <label
                        key={option.value}
                        onClick={() => !isSavingQuality && setSelectedQuality(option.value)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          padding: "12px 14px",
                          backgroundColor: selectedQuality === option.value ? "#f0f7ff" : "white",
                          borderRadius: "6px",
                          border: selectedQuality === option.value ? "2px solid #007bff" : "1px solid #e9ecef",
                          cursor: isSavingQuality ? "not-allowed" : "pointer",
                          fontSize: "13px",
                          transition: "all 0.2s ease",
                          opacity: isSavingQuality ? 0.6 : 1,
                        }}
                      >
                        <input
                          type="radio"
                          name="quality"
                          value={option.value}
                          checked={selectedQuality === option.value}
                          onChange={() => {}}
                          disabled={isSavingQuality}
                          style={{ marginRight: "10px", cursor: isSavingQuality ? "not-allowed" : "pointer" }}
                        />
                        {option.label}
                        {isSavingQuality && selectedQuality === option.value && (
                          <span style={{ marginLeft: "auto" }}>⏳</span>
                        )}
                      </label>
                    ))}
                    <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                      <button
                        onClick={() => handleSaveQuality(selectedQuality)}
                        disabled={isSavingQuality || selectedQuality === response?.leadQuality}
                        style={{
                          flex: 1,
                          padding: "8px",
                          backgroundColor: isSavingQuality || selectedQuality === response?.leadQuality ? "#ccc" : "#007bff",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          fontSize: "12px",
                          fontWeight: "600",
                          cursor: isSavingQuality || selectedQuality === response?.leadQuality ? "not-allowed" : "pointer",
                          opacity: isSavingQuality || selectedQuality === response?.leadQuality ? 0.7 : 1,
                          transition: "all 0.2s ease",
                        }}
                      >
                        {isSavingQuality ? "⏳ Salvando..." : "✓ Salvar"}
                      </button>
                      <button
                        onClick={() => {
                          setShowQualityEditor(false);
                          setSelectedQuality(response?.leadQuality ?? 0);
                        }}
                        disabled={isSavingQuality}
                        style={{
                          flex: 1,
                          padding: "8px",
                          backgroundColor: isSavingQuality ? "#ddd" : "#e9ecef",
                          color: "#333",
                          border: "none",
                          borderRadius: "4px",
                          fontSize: "12px",
                          fontWeight: "600",
                          cursor: isSavingQuality ? "not-allowed" : "pointer",
                          opacity: isSavingQuality ? 0.6 : 1,
                        }}
                      >
                        ✕ Cancelar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Quiz Tab */}
          {activeTab === "quiz" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {questions.length > 0 && currentQuestion ? (
                <>
                  {/* Progress */}
                  <div style={styles.progressContainer}>
                    <div style={styles.progressLabel}>
                      Pergunta {currentQuestionIndex + 1} de {questions.length}
                    </div>
                    <div style={styles.progressBar}>
                      <div
                        style={{
                          ...styles.progressFill,
                          width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Question */}
                  <div style={styles.questionContainer}>
                    <h3 style={styles.questionText}>{currentQuestion.QuestionText}</h3>

                    {/* Alternatives with Response */}
                    <div style={styles.alternativesContainer}>
                      {currentQuestion.Alternatives &&
                        currentQuestion.Alternatives.map((alt, idx) => {
                          const isSelected =
                            currentAnswer === alt.Id ||
                            currentAnswer === alt.Text ||
                            (Array.isArray(currentAnswer) &&
                              (currentAnswer.includes(alt.Id) ||
                                currentAnswer.includes(alt.Text)));

                          return (
                            <div
                              key={idx}
                              style={{
                                ...styles.alternative,
                                ...(isSelected
                                  ? styles.alternativeSelected
                                  : {}),
                              }}
                            >
                              <div style={styles.alternativeContent}>
                                <span style={styles.alternativeId}>
                                  {alt.Id}
                                </span>
                                <span style={styles.alternativeText}>
                                  {alt.Text}
                                </span>
                              </div>
                              {isSelected && (
                                <div style={styles.selectedCheck}>
                                  <FiCheck size={20} color="#28a745" />
                                </div>
                              )}
                            </div>
                          );
                        })}
                    </div>
                  </div>

                  {/* Navigation */}
                  <div style={styles.navigation}>
                    <button
                      style={{
                        ...styles.navButton,
                        ...(currentQuestionIndex === 0
                          ? styles.navButtonDisabled
                          : {}),
                      }}
                      onClick={handlePrevQuestion}
                      disabled={currentQuestionIndex === 0}
                    >
                      <FiChevronLeft size={16} />
                      Anterior
                    </button>
                    <span style={styles.navInfo}>
                      {currentQuestionIndex + 1} / {questions.length}
                    </span>
                    <button
                      style={{
                        ...styles.navButton,
                        ...(currentQuestionIndex === questions.length - 1
                          ? styles.navButtonDisabled
                          : {}),
                      }}
                      onClick={handleNextQuestion}
                      disabled={currentQuestionIndex === questions.length - 1}
                    >
                      Próxima
                      <FiChevronRight size={16} />
                    </button>
                  </div>
                </>
              ) : (
                <div style={styles.noContent}>
                  Nenhuma pergunta encontrada neste quiz
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
    </>,
    document.getElementById('modal-root')
  );
};

export default QuizResponseDetailsModal;
