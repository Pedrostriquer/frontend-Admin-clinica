import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./QuizListStyle";
import { FiTrash2, FiEye, FiPlus, FiCheck, FiCircle } from "react-icons/fi";

const QuizList = ({
  quizzes,
  onCreateClick,
  onDeleteClick,
  onActivateClick,
  loading,
  loadingId,
}) => {
  const navigate = useNavigate();
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div style={styles.container}>
      <style>{`
        .quiz-action-button {
          position: relative;
        }

        .quiz-action-button[title]:hover::after {
          content: attr(title);
          position: absolute;
          bottom: 125%;
          left: 50%;
          transform: translateX(-50%);
          background-color: #1f2937;
          color: #ffffff;
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
          white-space: nowrap;
          z-index: 1000;
          pointer-events: none;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .quiz-action-button[title]:hover::before {
          content: '';
          position: absolute;
          bottom: 115%;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-top: 6px solid #1f2937;
          z-index: 1000;
          pointer-events: none;
        }
      `}</style>
      <div style={styles.headerSection}>
        <div>
          <h3 style={styles.sectionTitle}>📝 Gerenciar Quizzes</h3>
          <p style={styles.sectionSubtitle}>
            Crie e administre seus quizzes de perfil investidor
          </p>
        </div>
        <button
          className="quiz-action-button"
          style={styles.createButton}
          onClick={onCreateClick}
          title="Criar um novo quiz"
        >
          <FiPlus size={18} style={{ marginRight: "8px" }} />
          Novo Quiz
        </button>
      </div>

      {loading ? (
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <p>Carregando quizzes...</p>
        </div>
      ) : quizzes && quizzes.length > 0 ? (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeader}>
                <th style={styles.thId}>ID</th>
                <th style={styles.thStatus}>Status</th>
                <th style={styles.thName}>Nome</th>
                <th style={styles.thDescription}>Descrição</th>
                <th style={styles.thDate}>Criado em</th>
                <th style={styles.thActions}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {quizzes.map((quiz) => (
                <tr
                  key={quiz.id}
                  style={{
                    ...styles.tableRow,
                    backgroundColor: quiz.isActive ? "#f0f9ff" : "transparent",
                  }}
                >
                  <td style={{...styles.tdId, fontWeight: "600", color: "#6366f1"}}>
                    #{quiz.id}
                  </td>
                  <td style={styles.tdStatus}>
                    <div style={styles.statusBadge}>
                      {quiz.isActive ? (
                        <>
                          <FiCheck size={16} color="#10b981" />
                          <span style={{ marginLeft: "6px" }}>Ativo</span>
                        </>
                      ) : (
                        <>
                          <FiCircle size={16} color="#9ca3af" />
                          <span style={{ marginLeft: "6px" }}>Inativo</span>
                        </>
                      )}
                    </div>
                  </td>
                  <td style={styles.tdName}>{quiz.name}</td>
                  <td style={styles.tdDescription}>
                    {quiz.description || "Sem descrição"}
                  </td>
                  <td style={styles.tdDate}>{formatDate(quiz.createdAt)}</td>
                  <td style={styles.tdActions}>
                    <button
                      className="quiz-action-button"
                      style={styles.actionButton}
                      onClick={() => navigate(`/platform/blog-gemcapital/quizzes/gerenciar/${quiz.id}`)}
                      title="Ver detalhes e respostas"
                    >
                      <FiEye size={16} />
                    </button>

                    {!quiz.isActive && (
                      <button
                        className="quiz-action-button"
                        style={styles.actionButton}
                        onClick={() => onActivateClick(quiz.id)}
                        disabled={loadingId === quiz.id}
                        title="Ativar este quiz (desativa outros)"
                      >
                        ⚡
                      </button>
                    )}

                    <button
                      className="quiz-action-button"
                      style={styles.actionButton}
                      onClick={() => onDeleteClick(quiz.id)}
                      title="Deletar quiz permanentemente"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>○</div>
          <h4 style={styles.emptyTitle}>Nenhum quiz criado</h4>
          <p style={styles.emptyText}>
            Comece criando seu primeiro quiz de perfil investidor
          </p>
          <button
            className="quiz-action-button"
            style={styles.createButtonEmpty}
            onClick={onCreateClick}
            title="Criar um novo quiz"
          >
            Criar Primeiro Quiz
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizList;
