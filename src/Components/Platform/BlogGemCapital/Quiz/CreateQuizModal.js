import React, { useState, useEffect } from "react";
import styles from "./CreateQuizModalStyle";
import { FiX, FiPlus, FiTrash2 } from "react-icons/fi";
import InvestorProfileTypesInput from "./InvestorProfileTypesInput";

const CreateQuizModal = ({
  isOpen,
  onClose,
  onSubmit,
  editingQuiz,
  loading,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    investorProfileTypes: [],
    questions: [],
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

  useEffect(() => {
    console.log("\n📍 useEffect triggered - editingQuiz:", editingQuiz, "isOpen:", isOpen);

    if (editingQuiz) {
      console.log("✏️ Mode: EDITING");
      setFormData({
        name: editingQuiz.name || "",
        description: editingQuiz.description || "",
        investorProfileTypes: editingQuiz.investorProfileTypes || [],
        questions: editingQuiz.questions || [],
      });
    } else {
      console.log("➕ Mode: CREATING NEW");
      console.log("Resetting formData and currentQuestion");
      setFormData({
        name: "",
        description: "",
        investorProfileTypes: [],
        questions: [],
      });
      const initialQuestion = {
        orderIndex: 1,
        questionText: "",
        alternatives: [
          { id: "A", text: "" },
          { id: "B", text: "" },
        ],
      };
      console.log("Initial alternatives for new question:", initialQuestion.alternatives);
      setCurrentQuestion(initialQuestion);
    }
    setError("");
    setFormErrors({ name: false, investorProfileTypes: false });
    setTouchedFields({ name: false, investorProfileTypes: false });
  }, [editingQuiz, isOpen]);

  const handleAddAlternative = () => {
    const nextIndex = currentQuestion.alternatives.length;
    const newId = String.fromCharCode(65 + nextIndex);

    console.log(`🟡 handleAddAlternative chamado:`);
    console.log(`  nextIndex: ${nextIndex}`);
    console.log(`  newId: "${newId}" (typeof: ${typeof newId})`);
    console.log(`  String.fromCharCode(65 + ${nextIndex}): "${String.fromCharCode(65 + nextIndex)}" (typeof: ${typeof String.fromCharCode(65 + nextIndex)})`);
    console.log(`  currentQuestion.alternatives ANTES:`, currentQuestion.alternatives.map(a => ({ id: a.id, idType: typeof a.id, text: a.text })));

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

    // LOG: Before adding question to formData
    console.log(`🔵 ANTES de adicionar pergunta #${formData.questions.length + 1}:`);
    currentQuestion.alternatives.forEach((alt, idx) => {
      console.log(`  Alt[${idx}]: id="${alt.id}" (typeof: ${typeof alt.id}), text="${alt.text}"`);
    });

    setFormData({
      ...formData,
      questions: [...formData.questions, currentQuestion],
    });

    // LOG: After resetting currentQuestion
    const newOrderIndex = formData.questions.length + 2;
    console.log(`🟢 Reset currentQuestion para pergunta #${formData.questions.length + 2}:`);
    console.log(`  alternatives[0]: id="A" (typeof: ${typeof "A"})`);
    console.log(`  alternatives[1]: id="B" (typeof: ${typeof "B"})`);

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

    // LOG: Mostrar o JSON que será enviado
    console.log("📤 Enviando quiz para API:");
    console.log("formData.questions:", formData.questions);
    console.log(JSON.stringify(formData, null, 2));

    // Verificar tipos dos IDs das alternativas
    console.log("\n🔍 ANÁLISE DETALHADA DOS IDs:");
    formData.questions.forEach((q, qIdx) => {
      console.log(`\nPergunta ${qIdx + 1}:`);
      console.log(`  orderIndex: ${q.orderIndex}, questionText: "${q.questionText}"`);
      console.log(`  alternatives:`, q.alternatives);
      q.alternatives.forEach((alt, aIdx) => {
        console.log(
          `    Alt[${aIdx}]: id="${alt.id}" (tipo: ${typeof alt.id}), text="${alt.text}"`
        );
      });
    });

    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}>
            {editingQuiz ? "Editar Quiz" : "Criar Novo Quiz"}
          </h2>
          <button style={styles.closeButton} onClick={onClose}>
            <FiX size={24} />
          </button>
        </div>

        {error && <div style={styles.errorMessage}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Quiz Name */}
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

          {/* Description */}
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

          {/* Investor Profile Types */}
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

          {/* Questions List */}
          {!editingQuiz && (
            <>
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
                          <small>{q.alternatives.length} alternativas</small>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Question Form */}
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
            </>
          )}

          {/* Form Actions */}
          <div style={styles.formActions}>
            <button
              type="button"
              style={styles.cancelButton}
              onClick={onClose}
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
      </div>
    </div>
  );
};

export default CreateQuizModal;
