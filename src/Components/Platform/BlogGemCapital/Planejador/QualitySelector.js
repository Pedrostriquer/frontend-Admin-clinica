import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const QUALITY_OPTIONS = {
  0: { label: "Não Avaliado", color: "#94a3b8", bgColor: "#94a3b815" },
  1: { label: "Muito Ruim", color: "#dc2626", bgColor: "#dc262615" },
  2: { label: "Ruim", color: "#f97316", bgColor: "#f9731615" },
  3: { label: "Médio", color: "#eab308", bgColor: "#eab30815" },
  4: { label: "Bom", color: "#22c55e", bgColor: "#22c55e15" },
  5: { label: "Muito Bom", color: "#16a34a", bgColor: "#16a34a15" },
};

// Mapeamento de string para número (caso backend retorne como string)
const STRING_TO_NUMBER_MAP = {
  "NaoAvaliado": 0,
  "MuitoRuim": 1,
  "Ruim": 2,
  "Medio": 3,
  "Bom": 4,
  "MuitoBom": 5,
};

const convertQualityToNumber = (value) => {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    return STRING_TO_NUMBER_MAP[value] ?? 0;
  }
  return 0;
};

const QualitySelector = ({
  value,
  onChange,
  inline = false,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
  const containerRef = React.useRef(null);
  const numericValue = convertQualityToNumber(value);
  const currentQuality = QUALITY_OPTIONS[numericValue] || QUALITY_OPTIONS[0];

  const handleOpenDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      if (!isOpen && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const dropdownHeight = 250; // Altura aproximada do dropdown
        const viewportHeight = window.innerHeight;
        const spaceBelow = viewportHeight - rect.bottom;
        const spaceAbove = rect.top;

        let top;
        if (spaceBelow > dropdownHeight) {
          // Há espaço para baixo
          top = rect.bottom + 4;
        } else if (spaceAbove > dropdownHeight) {
          // Há espaço para cima
          top = rect.top - dropdownHeight - 4;
        } else {
          // Mostrar para baixo mesmo assim
          top = rect.bottom + 4;
        }

        setDropdownPos({
          top: top,
          left: rect.left,
        });
      }
    }
  };

  const styles = {
    container: {
      position: "relative",
      display: "inline-block",
    },
    button: {
      padding: inline ? "6px 12px" : "10px 14px",
      border: `1.5px solid ${currentQuality.color}`,
      backgroundColor: currentQuality.bgColor,
      color: currentQuality.color,
      borderRadius: "6px",
      cursor: disabled ? "not-allowed" : "pointer",
      fontSize: inline ? "13px" : "14px",
      fontWeight: "600",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      transition: "all 0.2s ease",
      opacity: disabled ? 0.6 : 1,
    },
    dropdown: {
      position: "fixed",
      backgroundColor: "#ffffff",
      border: "1.5px solid #e2e8f0",
      borderRadius: "8px",
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)",
      zIndex: 99999,
      minWidth: "180px",
      overflow: "hidden",
    },
    option: {
      padding: "10px 14px",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: "500",
      transition: "all 0.2s ease",
      display: "flex",
      alignItems: "center",
      gap: "10px",
    },
    optionDot: {
      width: "10px",
      height: "10px",
      borderRadius: "50%",
      flexShrink: 0,
    },
  };

  const handleSelect = (quality) => {
    onChange(quality);
    setIsOpen(false);
  };

  return (
    <div style={styles.container} ref={containerRef}>
      <button
        style={styles.button}
        onClick={handleOpenDropdown}
        disabled={disabled}
        title={currentQuality.label}
      >
        <span>{currentQuality.label}</span>
        {!inline && <ChevronDown size={16} />}
      </button>

      {isOpen && !disabled && (
        <div style={{ ...styles.dropdown, top: dropdownPos.top, left: dropdownPos.left }}>
          {Object.entries(QUALITY_OPTIONS).map(([key, option]) => (
            <div
              key={key}
              style={{
                ...styles.option,
                backgroundColor:
                  parseInt(key) === numericValue ? option.bgColor : "transparent",
                borderLeft: `3px solid ${
                  parseInt(key) === numericValue ? option.color : "transparent"
                }`,
              }}
              onClick={() => handleSelect(parseInt(key))}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = option.bgColor;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor =
                  parseInt(key) === numericValue ? option.bgColor : "transparent";
              }}
            >
              <div
                style={{
                  ...styles.optionDot,
                  backgroundColor: option.color,
                }}
              />
              <span style={{ color: option.color }}>{option.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QualitySelector;
export { QUALITY_OPTIONS };
