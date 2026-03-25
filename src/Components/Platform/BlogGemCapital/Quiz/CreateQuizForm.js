import React, { useState } from "react";
import styles from "./CreateQuizModalStyle";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import InvestorProfileTypesInput from "./InvestorProfileTypesInput";

const CreateQuizForm = ({ onSubmit, onCancel, loading, editingQuiz }) => {
  const [formData, setFormData] = useState({
    name: editingQuiz?.name || "",
    description: editingQuiz?.description || "",
    investorProfileTypes: editingQuiz?.investorProfileTypes || [],
    questions: editingQuiz?.questions || [],
  });

  const [formErrors, setFormErrors] = useState({
    name: false,
    investorProfileTypes: false,
  });
  const [touchedFields, setTouchedFields] = useState({
    name: false,
    investorProfileTypes: false,
  });

  const [currentQuestion, setCurrentQuestion] = useState({
    orderIndex: 1,
    questionText: "",
    alternatives: [
      { id: "A", text: "" },
      { id: "B", text: "" },
    ],
  });

  const [error, setError] = useState("");

  const handleAddAlternative = () => {
    const nextIndex = currentQuestion.alternatives.length;
    const newId = String.fromCharCode(65 + nextIndex);

    setCurrentQuestion({
      ...currentQuestion,
      alternatives: [
        ...currentQuestion.alternatives,
        { id: newId, text: "" },
      ],
    });
  };

  const handleUpdateAlternative = (index, text) => {
    const newAlternatives = [...currentQuestion.alternatives];
    newAlternatives[index].text = text;
    setCurrentQuestion({
      ...currentQuestion,
      alternatives: newAlternatives,
    });
  };

  const handleRemoveAlternative = (index) => {
    if (currentQuestion.alternatives.length > 2) {
      setCurrentQuestion({
        ...currentQuestion,
        alternatives: currentQuestion.alternatives.filter((_, i) => i !== index),
      });
    }
  };

  const handleAddQuestion = () => {
    setError("");

    if (!currentQuestion.questionText.trim()) {
      setError("Digite a pergunta");
      return;
    }

    const emptyAlternatives = currentQuestion.alternatives.filter(
      (a) => !a.text.trim()
    );
    if (emptyAlternatives.length > 0) {
      setError("Preencha todas as alternativas");
      return;
    }

    setFormData({
      ...formData,
      questions: [...formData.questions, currentQuestion],
    });

    const newOrderIndex = formData.questions.length + 2;
    setCurrentQuestion({
      orderIndex: newOrderIndex,
      questionText: "",
      alternatives: [
        { id: "A", text: "" },
        { id: "B", text: "" },
      ],
    });
  };

  const handleRemoveQuestion = (index) => {
    const newQuestions = formData.questions.filter((_, i) => i !== index);
    setFormData({ ...formData, questions: newQuestions });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // Validate form
    const newErrors = { name: false, investorProfileTypes: false };
    const newTouched = { name: true, investorProfileTypes: true };

    if (!formData.name.trim()) {
      newErrors.name = true;
      setError("Digite o nome do quiz");
    }

    if (formData.investorProfileTypes.length === 0) {
      newErrors.investorProfileTypes = true;
      setError("Adicione pelo menos um tipo de perfil investidor");
    }

    if (formData.questions.length === 0 && !editingQuiz) {
      setError("Adicione pelo menos uma pergunta");
    }

    setFormErrors(newErrors);
    setTouchedFields(newTouched);

    if (newErrors.name || newErrors.investorProfileTypes || (formData.questions.length === 0 && !editingQuiz)) {
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      {error && <div style={styles.errorMessage}>{error}</div>}

      {/* Nome do Quiz */}
      <div style={styles.formGroup}>
        <label style={styles.label}>Nome do Quiz *</label>
        <input
          type="text"
          style={styles.input}
          placeholder="Ex: Perfil Investidor"
          value={formData.name}
          onChange={(e) =>
            setFormData({ ...formData, name: e.target.value })
          }
          required
        />
      </div>

      {/* Descrição */}
      <div style={styles.formGroup}>
        <label style={styles.label}>Descrição</label>
        <textarea
          style={styles.textarea}
          placeholder="Descreva o propósito deste quiz"
          rows="3"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />
      </div>

      {/* Tipos de Perfil Investidor */}
      <div style={styles.formGroup}>
        <label style={styles.label}>
          Tipos de Perfil Investidor *
        </label>
        <InvestorProfileTypesInput
          value={formData.investorProfileTypes}
          onChange={(types) =>
            setFormData({
              ...formData,
              investorProfileTypes: types,
            })
          }
          error={formErrors.investorProfileTypes}
          touched={touchedFields.investorProfileTypes}
          disabled={loading}
        />
      </div>

      {/* Lista de Perguntas */}
      <div style={styles.questionsSection}>
        <h3 style={styles.questionsTitle}>
          Perguntas ({formData.questions.length})
        </h3>

        {formData.questions.length > 0 && (
          <div style={styles.questionsList}>
            {formData.questions.map((q, index) => (
              <div key={index} style={styles.questionItem}>
                <div style={styles.questionHeader}>
                  <span style={styles.questionNumber}>{index + 1}</span>
                  <span style={styles.questionText}>{q.questionText}</span>
                  <button
                    type="button"
                    style={styles.removeQuestionBtn}
                    onClick={() => handleRemoveQuestion(index)}
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
                <div style={styles.questionDetails}>
                  <small>{q.alternatives.length} alternatives</small>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Formulário Adicionar Pergunta */}
        <div style={styles.addQuestionSection}>
          <h4 style={styles.addQuestionTitle}>Adicionar Pergunta</h4>

          <div style={styles.formGroup}>
            <label style={styles.label}>Pergunta *</label>
            <textarea
              style={styles.textarea}
              placeholder="Digite a pergunta"
              rows="2"
              value={currentQuestion.questionText}
              onChange={(e) =>
                setCurrentQuestion({
                  ...currentQuestion,
                  questionText: e.target.value,
                })
              }
            />
          </div>

          <div style={styles.alternativesSection}>
            <label style={styles.label}>Alternativas *</label>
            {currentQuestion.alternatives.map((alt, index) => (
              <div
                key={index}
                style={styles.alternativeInput}
              >
                <span style={styles.alternativeLabel}>
                  {String.fromCharCode(65 + index)}.
                </span>
                <input
                  type="text"
                  style={styles.alternativeTextInput}
                  placeholder={`Alternativa ${String.fromCharCode(
                    65 + index
                  )}`}
                  value={alt.text}
                  onChange={(e) =>
                    handleUpdateAlternative(index, e.target.value)
                  }
                />
                {currentQuestion.alternatives.length > 2 && (
                  <button
                    type="button"
                    style={styles.removeAltBtn}
                    onClick={() => handleRemoveAlternative(index)}
                  >
                    <FiTrash2 size={14} />
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              style={styles.addAltBtn}
              onClick={handleAddAlternative}
            >
              <FiPlus size={16} style={{ marginRight: "6px" }} />
              Adicionar Alternativa
            </button>
          </div>

          <button
            type="button"
            style={styles.addQuestionBtn}
            onClick={handleAddQuestion}
          >
            <FiPlus size={16} style={{ marginRight: "6px" }} />
            Adicionar Pergunta
          </button>
        </div>
      </div>

      {/* Ações do Formulário */}
      <div style={styles.formActions}>
        <button
          type="button"
          style={styles.cancelButton}
          onClick={onCancel}
          disabled={loading}
        >
          Cancelar
        </button>
        <button
          type="submit"
          style={styles.submitButton}
          disabled={loading}
        >
          {loading
            ? "Salvando..."
            : editingQuiz
            ? "Atualizar Quiz"
            : "Criar Quiz"}
        </button>
      </div>
    </form>
  );
};

export default CreateQuizForm;
