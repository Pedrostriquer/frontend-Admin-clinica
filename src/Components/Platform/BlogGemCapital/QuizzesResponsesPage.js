import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BlogGemCapitalContainer from "./BlogGemCapitalContainer";
import { AllQuizResponsesView } from "./Quiz";
import quizServices from "../../../dbServices/quizServices";

const QuizzesResponsesPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [quizCount, setQuizCount] = useState(0);

  useEffect(() => {
    fetchQuizCount();
  }, []);

  const fetchQuizCount = async () => {
    try {
      const quizzes = await quizServices.getAllQuizzes();
      setQuizCount(quizzes.length);
    } catch (error) {
      console.error("Erro ao buscar contagem de quizzes:", error);
    }
  };

  const styles = {
    headerContainer: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "30px",
      flexWrap: "wrap",
      gap: "15px",
    },
    backButton: {
      padding: "10px 15px",
      backgroundColor: "#6c757d",
      color: "white",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      fontWeight: "500",
      fontSize: "14px",
      transition: "background-color 0.2s ease",
    },
    title: {
      fontSize: "24px",
      fontWeight: "bold",
      color: "#1f2937",
    },
  };

  return (
    <BlogGemCapitalContainer counts={{ quizzes: quizCount }}>
      {/* Header com botão de volta */}
      <div style={styles.headerContainer}>
        <h2 style={styles.title}>📊 Todas as Respostas</h2>
        <button
          style={styles.backButton}
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

      {/* All Responses View */}
      <AllQuizResponsesView loading={loading} />
    </BlogGemCapitalContainer>
  );
};

export default QuizzesResponsesPage;
