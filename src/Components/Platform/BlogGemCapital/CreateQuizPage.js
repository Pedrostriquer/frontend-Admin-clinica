import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BlogGemCapitalContainer from "./BlogGemCapitalContainer";
import CreateQuizForm from "./Quiz/CreateQuizForm";
import quizServices from "../../../dbServices/quizServices";

const CreateQuizPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSaveQuiz = async (quizData) => {
    setLoading(true);
    setError("");
    try {
      const createdQuiz = await quizServices.createQuiz(quizData);
      // Redirecionar para a página de detalhes do quiz criado
      navigate(`/platform/blog-gemcapital/quizzes/gerenciar/${createdQuiz.id}`);
    } catch (err) {
      console.error("Erro ao criar quiz:", err);
      setError(
        err.response?.data?.message ||
          "Erro ao criar quiz. Tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/platform/blog-gemcapital/quizzes/gerenciar");
  };

  return (
    <BlogGemCapitalContainer counts={{ quizzes: 0 }}>
      <div style={styles.container}>
        <div style={styles.headerContainer}>
          <div style={styles.header}>
            <h1 style={styles.title}>Criar Novo Quiz</h1>
            <p style={styles.subtitle}>
              Configure seu quiz com perguntas e tipos de perfil investidor
            </p>
          </div>
          <button
            onClick={handleCancel}
            style={{ ...styles.button, ...styles.secondaryButton }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#5a6268";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#6c757d";
            }}
            disabled={loading}
          >
            ← Voltar
          </button>
        </div>

        {error && <div style={styles.errorMessage}>{error}</div>}

        <div style={styles.formContainer}>
          <CreateQuizForm
            onSubmit={handleSaveQuiz}
            onCancel={handleCancel}
            loading={loading}
          />
        </div>
      </div>
    </BlogGemCapitalContainer>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "30px",
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "20px",
  },
  headerContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "20px",
    flexWrap: "wrap",
  },
  header: {
    flex: 1,
    minWidth: "300px",
  },
  title: {
    fontSize: "28px",
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: "10px",
  },
  subtitle: {
    fontSize: "14px",
    color: "#6b7280",
    margin: 0,
  },
  button: {
    padding: "10px 20px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "500",
    fontSize: "14px",
    transition: "all 0.2s ease",
  },
  secondaryButton: {
    backgroundColor: "#6c757d",
    color: "white",
  },
  formContainer: {
    backgroundColor: "white",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
    padding: "30px",
  },
  errorMessage: {
    padding: "15px 20px",
    backgroundColor: "#fee2e2",
    border: "1px solid #fecaca",
    borderRadius: "8px",
    color: "#991b1b",
    fontSize: "14px",
    fontWeight: "500",
  },
};

export default CreateQuizPage;
