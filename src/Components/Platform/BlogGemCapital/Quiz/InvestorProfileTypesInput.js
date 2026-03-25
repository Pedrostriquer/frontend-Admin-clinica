import React, { useState } from "react";
import { FiPlus, FiTrash2 } from "react-icons/fi";

const InvestorProfileTypesInput = ({
  value = [],
  onChange,
  disabled = false,
  error = false,
  touched = false,
}) => {
  const [inputValue, setInputValue] = useState("");

  const handleAddType = () => {
    if (inputValue.trim() && !value.includes(inputValue.trim())) {
      const newValue = [...value, inputValue.trim()];
      onChange(newValue);
      setInputValue("");
    } else if (value.includes(inputValue.trim())) {
      alert("Este tipo de perfil já foi adicionado");
    }
  };

  const handleRemoveType = (index) => {
    const newValue = value.filter((_, i) => i !== index);
    onChange(newValue);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddType();
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <div style={{ display: "flex", gap: "8px" }}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ex: Conservador, Moderado, Agressivo..."
          disabled={disabled}
          style={{
            flex: 1,
            padding: "12px",
            borderRadius: "6px",
            border: `1px solid ${
              error && touched ? "#ef4444" : "#ddd"
            }`,
            fontSize: "14px",
            fontFamily: "inherit",
            backgroundColor: disabled ? "#f5f5f5" : "white",
            color: disabled ? "#999" : "#333",
          }}
        />
        <button
          type="button"
          onClick={handleAddType}
          disabled={disabled || !inputValue.trim()}
          style={{
            padding: "12px 16px",
            backgroundColor:
              disabled || !inputValue.trim() ? "#ccc" : "#007bff",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor:
              disabled || !inputValue.trim() ? "not-allowed" : "pointer",
            fontSize: "14px",
            fontWeight: "600",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            opacity: disabled || !inputValue.trim() ? 0.6 : 1,
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            if (!disabled && inputValue.trim()) {
              e.target.style.backgroundColor = "#0056b3";
            }
          }}
          onMouseLeave={(e) => {
            if (!disabled && inputValue.trim()) {
              e.target.style.backgroundColor = "#007bff";
            }
          }}
        >
          <FiPlus size={16} />
          Adicionar
        </button>
      </div>

      {/* Exibir tipos adicionados */}
      {value.length > 0 && (
        <div
          style={{
            padding: "12px",
            backgroundColor: "#f8f9fa",
            borderRadius: "6px",
            border: "1px solid #e9ecef",
            display: "flex",
            flexWrap: "wrap",
            gap: "8px",
          }}
        >
          {value.map((type, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "6px 12px",
                backgroundColor: "white",
                borderRadius: "4px",
                border: "1px solid #e9ecef",
                fontSize: "13px",
                fontWeight: "500",
              }}
            >
              {type}
              <button
                type="button"
                onClick={() => handleRemoveType(index)}
                disabled={disabled}
                style={{
                  background: "none",
                  border: "none",
                  color: "#dc3545",
                  cursor: disabled ? "not-allowed" : "pointer",
                  padding: "0",
                  display: "flex",
                  alignItems: "center",
                  opacity: disabled ? 0.5 : 1,
                }}
                title="Remover tipo de perfil"
              >
                <FiTrash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Mensagem de erro */}
      {error && touched && (
        <div style={{ fontSize: "12px", color: "#ef4444", fontWeight: "500" }}>
          ✗ Campo obrigatório - Adicione pelo menos um tipo de perfil investidor
        </div>
      )}

      {/* Mensagem informativa */}
      {value.length === 0 && !error && (
        <div
          style={{
            fontSize: "12px",
            color: "#6b7280",
            fontStyle: "italic",
          }}
        >
          💡 Exemplo: Conservador, Moderado, Moderado Agressivo, Agressivo
        </div>
      )}
    </div>
  );
};

export default InvestorProfileTypesInput;
