import React, { useState, useEffect } from "react";
import BlogGemCapitalContainer from "./BlogGemCapitalContainer";
import {
  QuizList,
  CreateQuizModal,
  QuizResponsesModal,
  AllQuizResponsesView,
} from "./Quiz";
import quizServices from "../../../dbServices/quizServices";

const QuizzesPage = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [quizSubTab, setQuizSubTab] = useState("manage"); // "manage" ou "responses"
  const [showCreateQuizModal, setShowCreateQuizModal] = useState(false);
  const [showQuizResponsesModal, setShowQuizResponsesModal] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [isLoadingQuiz, setIsLoadingQuiz] = useState(false);
  const [loadingQuizId, setLoadingQuizId] = useState(null);

  // Hook para estilos responsivos
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const responsive = {
    isMobile: windowSize.width < 640,
    isTablet: windowSize.width >= 640 && windowSize.width < 1024,
    isDesktop: windowSize.width >= 1024,
  };

  // Fetch quizzes ao montar
  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const data = await quizServices.getAllQuizzes();
      setQuizzes(data);
    } catch (error) {
      console.error("Erro ao buscar quizzes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQuiz = () => {
    setEditingQuiz(null);
    setShowCreateQuizModal(true);
  };

  const handleEditQuiz = (quiz) => {
    setEditingQuiz(quiz);
    setShowCreateQuizModal(true);
  };

  const handleViewQuizResponses = (quiz) => {
    setSelectedQuiz(quiz);
    setShowQuizResponsesModal(true);
  };

  const handleSaveQuiz = async (quizData) => {
    setIsLoadingQuiz(true);
    try {
      if (editingQuiz) {
        await quizServices.updateQuiz(editingQuiz.id, quizData);
      } else {
        await quizServices.createQuiz(quizData);
      }
      await fetchQuizzes();
      setShowCreateQuizModal(false);
      alert(editingQuiz ? "Quiz atualizado!" : "Quiz criado!");
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao salvar quiz");
    } finally {
      setIsLoadingQuiz(false);
    }
  };

  const handleDeleteQuiz = async (quizId) => {
    if (!window.confirm("Tem certeza que deseja deletar este quiz?")) return;

    setLoadingQuizId(quizId);
    try {
      await quizServices.deleteQuiz(quizId);
      await fetchQuizzes();
      alert("Quiz deletado com sucesso!");
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao deletar quiz");
    } finally {
      setLoadingQuizId(null);
    }
  };

  const handleActivateQuiz = async (quizId) => {
    setLoadingQuizId(quizId);
    try {
      await quizServices.activateQuiz(quizId);
      await fetchQuizzes();
      alert("Quiz ativado com sucesso!");
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao ativar quiz");
    } finally {
      setLoadingQuizId(null);
    }
  };

  const getResponsiveStyles = () => {
    return {
      tabsContainer: {
        display: "flex",
        gap: responsive.isMobile ? "8px" : "20px",
        marginBottom: responsive.isMobile ? "20px" : "30px",
        overflowX: responsive.isMobile ? "auto" : "visible",
        paddingBottom: responsive.isMobile ? "8px" : "0px",
      },
      tabButton: {
        border: "none",
        backgroundColor: "#e9ecef",
        color: "#495057",
        padding: responsive.isMobile ? "10px 14px" : "14px 20px",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "600",
        fontSize: responsive.isMobile ? "12px" : "14px",
        transition: "all 0.2s ease",
        whiteSpace: "nowrap",
      },
    };
  };

  const responsiveStyles = getResponsiveStyles();
  const tabButtonActive = {
    backgroundColor: "#007bff",
    color: "#fff",
  };

  return (
    <BlogGemCapitalContainer counts={{ quizzes: quizzes.length }}>
      {/* Sub-tabs para quizzes */}
      <div style={responsiveStyles.tabsContainer}>
        <button
          style={{
            ...responsiveStyles.tabButton,
            ...(quizSubTab === "manage" ? tabButtonActive : {}),
          }}
          onClick={() => setQuizSubTab("manage")}
        >
          📝 Gerenciar Quizzes
        </button>
        <button
          style={{
            ...responsiveStyles.tabButton,
            ...(quizSubTab === "responses" ? tabButtonActive : {}),
          }}
          onClick={() => setQuizSubTab("responses")}
        >
          📊 Todas as Respostas
        </button>
      </div>

      {/* Content dos sub-tabs */}
      {quizSubTab === "manage" && (
        <QuizList
          quizzes={quizzes}
          loading={loading}
          onCreateClick={handleCreateQuiz}
          onEditClick={handleEditQuiz}
          onViewClick={handleViewQuizResponses}
          onDeleteClick={handleDeleteQuiz}
          onActivateClick={handleActivateQuiz}
          loadingId={loadingQuizId}
        />
      )}

      {quizSubTab === "responses" && <AllQuizResponsesView loading={loading} />}

      {/* Modals */}
      {showCreateQuizModal && (
        <CreateQuizModal
          isOpen={showCreateQuizModal}
          onClose={() => setShowCreateQuizModal(false)}
          onSubmit={handleSaveQuiz}
          editingQuiz={editingQuiz}
          loading={isLoadingQuiz}
        />
      )}

      {showQuizResponsesModal && selectedQuiz && (
        <QuizResponsesModal
          isOpen={showQuizResponsesModal}
          onClose={() => {
            setShowQuizResponsesModal(false);
            setSelectedQuiz(null);
          }}
          quiz={selectedQuiz}
          loading={loading}
          onFetchResponses={async (quizId) => {
            return await quizServices.getQuizResponses(quizId);
          }}
          onMarkAsContacted={async (responseId) => {
            try {
              await quizServices.markAsContacted(responseId);
              alert("Marcado como contactado!");
            } catch (error) {
              alert("Erro: " + error.message);
            }
          }}
          onUpdateObservations={async (responseId, observations) => {
            try {
              await quizServices.updateObservations(responseId, observations);
              alert("Observações salvas!");
            } catch (error) {
              alert("Erro: " + error.message);
            }
          }}
        />
      )}
    </BlogGemCapitalContainer>
  );
};

export default QuizzesPage;
