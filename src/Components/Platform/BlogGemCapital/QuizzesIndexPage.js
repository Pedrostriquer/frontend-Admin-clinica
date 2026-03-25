import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BlogGemCapitalContainer from "./BlogGemCapitalContainer";
import quizServices from "../../../dbServices/quizServices";

const QuizzesIndexPage = () => {
  const navigate = useNavigate();
  const [quizCount, setQuizCount] = useState(0);
  const [responseCount, setResponseCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCounts();
  }, []);

  const fetchCounts = async () => {
    try {
      setLoading(true);
      const quizzes = await quizServices.getAllQuizzes();
      setQuizCount(quizzes.length);
      // Try to fetch response count
      // Note: You might need to add this endpoint to your service
      setResponseCount(0); // Default for now
    } catch (error) {
      console.error("Erro ao buscar contagens:", error);
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      padding: "40px 20px",
      maxWidth: "600px",
      margin: "0 auto",
    },
    header: {
      textAlign: "center",
      marginBottom: "50px",
    },
    title: {
      fontSize: "32px",
      fontWeight: "bold",
      color: "#1f2937",
      marginBottom: "10px",
    },
    subtitle: {
      fontSize: "16px",
      color: "#6b7280",
      marginBottom: "30px",
    },
    cardsContainer: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "20px",
      marginTop: "40px",
    },
    card: {
      padding: "30px",
      borderRadius: "12px",
      border: "2px solid #e5e7eb",
      cursor: "pointer",
      transition: "all 0.3s ease",
      textAlign: "center",
      backgroundColor: "#fff",
    },
    cardHover: {
      borderColor: "#007bff",
      boxShadow: "0 8px 16px rgba(0, 123, 255, 0.15)",
      transform: "translateY(-4px)",
    },
    cardIcon: {
      fontSize: "48px",
      marginBottom: "15px",
    },
    cardTitle: {
      fontSize: "20px",
      fontWeight: "bold",
      color: "#1f2937",
      marginBottom: "10px",
    },
    cardCount: {
      fontSize: "32px",
      fontWeight: "bold",
      color: "#007bff",
      marginBottom: "10px",
    },
    cardDescription: {
      fontSize: "14px",
      color: "#6b7280",
    },
  };

  const CardItem = ({ icon, title, count, description, onClick }) => {
    const [isHovered, setIsHovered] = React.useState(false);

    return (
      <div
        style={{
          ...styles.card,
          ...(isHovered ? styles.cardHover : {}),
        }}
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div style={styles.cardIcon}>{icon}</div>
        <div style={styles.cardCount}>{count}</div>
        <h3 style={styles.cardTitle}>{title}</h3>
        <p style={styles.cardDescription}>{description}</p>
      </div>
    );
  };

  return (
    <BlogGemCapitalContainer counts={{ quizzes: quizCount }}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>📋 Gerenciamento de Quizzes</h1>
          <p style={styles.subtitle}>
            Escolha uma opção para começar
          </p>
        </div>

        <div style={styles.cardsContainer}>
          <CardItem
            icon="📝"
            title="Gerenciar Quizzes"
            count={quizCount}
            description="Criar, editar ou deletar quizzes"
            onClick={() => navigate("/platform/blog-gemcapital/quizzes/gerenciar")}
          />

          <CardItem
            icon="📊"
            title="Todas as Respostas"
            count={responseCount}
            description="Visualizar e gerenciar respostas"
            onClick={() => navigate("/platform/blog-gemcapital/quizzes/respostas")}
          />
        </div>
      </div>
    </BlogGemCapitalContainer>
  );
};

export default QuizzesIndexPage;
