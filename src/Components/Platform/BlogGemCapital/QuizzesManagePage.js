import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BlogGemCapitalContainer from "./BlogGemCapitalContainer";
import { QuizList } from "./Quiz";
import quizServices from "../../../dbServices/quizServices";

const QuizzesManagePage = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingQuizId, setLoadingQuizId] = useState(null);

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
    navigate("/platform/blog-gemcapital/quizzes/gerenciar/novo-quiz");
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

  return (
    <BlogGemCapitalContainer counts={{ quizzes: quizzes.length }}>
      <div style={{
        display: "flex",
        justifyContent: "flex-end",
        marginBottom: "20px",
      }}>
        <button
          style={{
            padding: "10px 15px",
            backgroundColor: "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "500",
            fontSize: "14px",
            transition: "background-color 0.2s ease",
          }}
          onClick={() => navigate("/platform/blog-gemcapital/quizzes")}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "#5a6268";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "#6c757d";
          }}
        >
          ← Voltar
        </button>
      </div>

      {/* Quiz List */}
      <QuizList
        quizzes={quizzes}
        loading={loading}
        onCreateClick={handleCreateQuiz}
        onDeleteClick={handleDeleteQuiz}
        onActivateClick={handleActivateQuiz}
        loadingId={loadingQuizId}
      />
    </BlogGemCapitalContainer>
  );
};

export default QuizzesManagePage;
