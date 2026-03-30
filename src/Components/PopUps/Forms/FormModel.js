import React, { useState, useEffect } from "react";

const FormModel = ({
  initialSchema = [],
  onSchemaChange,
  onSubmit,
  isAdmin = false,
}) => {
  const [fields, setFields] = useState(initialSchema);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFields(initialSchema);
  }, [initialSchema]);

  const handleInputChange = (label, value) => {
    setFormData((prev) => ({ ...prev, [label]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (isAdmin) return;

    setLoading(true);
    try {
      if (onSubmit) {
        await onSubmit(formData);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (index) => {
    if (!isAdmin) return;
    setDraggedIndex(index);
  };

  const handleDragOver = (e, index) => {
    if (!isAdmin) return;
    e.preventDefault();
    if (draggedIndex === index) return;

    const newFields = [...fields];
    const draggedItem = newFields[draggedIndex];

    newFields.splice(draggedIndex, 1);
    newFields.splice(index, 0, draggedItem);

    setDraggedIndex(index);
    setFields(newFields);

    if (onSchemaChange) onSchemaChange(newFields);
  };

  const styles = {
    container: {
      width: "100%",
      maxWidth: "500px",
      backgroundColor: "#ffffff",
      borderRadius: "16px",
      padding: "24px",
      boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
      fontFamily: "'Inter', sans-serif",
      display: "flex",
      flexDirection: "column",
      gap: "12px",
      border: "1px solid #f1f5f9",
    },
    fieldWrapper: (index, isDragging) => ({
      padding: "12px",
      borderRadius: "12px",
      backgroundColor: isDragging ? "#f8fafc" : "transparent",
      border: isAdmin ? "1px dashed #e2e8f0" : "none",
      cursor: isAdmin ? "grab" : "default",
      transition: "all 0.2s ease",
      opacity: isDragging ? 0.5 : 1,
      position: "relative",
    }),
    dragHandle: {
      position: "absolute",
      right: "10px",
      top: "10px",
      color: "#cbd5e1",
      display: isAdmin ? "block" : "none",
    },
    label: {
      display: "block",
      fontSize: "14px",
      fontWeight: "600",
      color: "#475569",
      marginBottom: "6px",
      textAlign: "left",
    },
    input: {
      width: "100%",
      padding: "12px 16px",
      borderRadius: "10px",
      border: "1.5px solid #e2e8f0",
      fontSize: "15px",
      color: "#1e293b",
      outline: "none",
      transition: "border-color 0.2s",
      boxSizing: "border-box",
      backgroundColor: "#fdfdfd",
    },
    textArea: {
      width: "100%",
      padding: "12px 16px",
      borderRadius: "10px",
      border: "1.5px solid #e2e8f0",
      fontSize: "15px",
      color: "#1e293b",
      outline: "none",
      minHeight: "100px",
      resize: "vertical",
      fontFamily: "inherit",
      boxSizing: "border-box",
      backgroundColor: "#fdfdfd",
    },
    submitBtn: {
      width: "100%",
      padding: "14px",
      borderRadius: "12px",
      border: "none",
      backgroundColor: "#4f46e5",
      color: "#ffffff",
      fontSize: "16px",
      fontWeight: "700",
      cursor: loading ? "not-allowed" : "pointer",
      marginTop: "10px",
      transition: "all 0.2s",
      opacity: loading ? 0.7 : 1,
    },
    emptyState: {
      padding: "40px",
      textAlign: "center",
      color: "#94a3b8",
      fontSize: "14px",
      border: "2px dashed #e2e8f0",
      borderRadius: "12px",
    },
  };

  return (
    <form style={styles.container} onSubmit={handleFormSubmit}>
      {fields.length > 0 ? (
        <>
          {fields.map((field, index) => (
            <div
              key={field.id || index}
              style={styles.fieldWrapper(index, draggedIndex === index)}
              draggable={isAdmin}
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={() => setDraggedIndex(null)}
            >
              {isAdmin && (
                <div style={styles.dragHandle}>
                  <i className="fa-solid fa-grip-vertical"></i>
                </div>
              )}

              <label style={styles.label}>
                {field.label}{" "}
                {field.required && <span style={{ color: "#ef4444" }}>*</span>}
              </label>

              {field.fieldType === "textArea" ? (
                <textarea
                  style={styles.textArea}
                  required={field.required}
                  placeholder={
                    field.placeholder ||
                    `Digite seu ${field.label.toLowerCase()}...`
                  }
                  readOnly={isAdmin}
                  value={isAdmin ? "" : formData[field.label] || ""}
                  onChange={(e) =>
                    handleInputChange(field.label, e.target.value)
                  }
                />
              ) : (
                <input
                  type={field.type || "text"}
                  style={styles.input}
                  required={field.required}
                  placeholder={
                    field.placeholder || `Seu ${field.label.toLowerCase()}...`
                  }
                  readOnly={isAdmin}
                  value={isAdmin ? "" : formData[field.label] || ""}
                  onChange={(e) =>
                    handleInputChange(field.label, e.target.value)
                  }
                  onFocus={(e) =>
                    !isAdmin && (e.target.style.borderColor = "#4f46e5")
                  }
                  onBlur={(e) =>
                    !isAdmin && (e.target.style.borderColor = "#e2e8f0")
                  }
                />
              )}
            </div>
          ))}

          {!isAdmin && (
            <button type="submit" style={styles.submitBtn} disabled={loading}>
              {loading ? "Enviando..." : "Enviar Informações"}
            </button>
          )}
        </>
      ) : (
        <div style={styles.emptyState}>
          <i
            className="fa-solid fa-wpforms"
            style={{ fontSize: "24px", marginBottom: "10px", display: "block" }}
          ></i>
          Nenhum campo adicionado ao formulário.
        </div>
      )}
    </form>
  );
};

export default FormModel;
