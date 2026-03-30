import React, { useState } from "react";
import PlanejadorLeadsHeader from "./PlanejadorLeadsHeader";
import { Calendar, X } from "lucide-react";

const PlanejadorLeadsAnalysis = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleClearFilters = () => {
    setStartDate("");
    setEndDate("");
  };

  const hasFilters = startDate || endDate;

  const filterStyles = {
    container: {
      padding: "24px",
      backgroundColor: "#ffffff",
      borderRadius: "12px",
      marginBottom: "24px",
      border: "1.5px solid #e2e8f0",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
    },
    title: {
      fontSize: "16px",
      fontWeight: "700",
      color: "#0f172a",
      marginBottom: "16px",
      marginTop: 0,
    },
    filterRow: {
      display: "flex",
      gap: "16px",
      alignItems: "flex-end",
      flexWrap: "wrap",
    },
    filterGroup: {
      display: "flex",
      flexDirection: "column",
      gap: "6px",
    },
    label: {
      fontSize: "13px",
      fontWeight: "600",
      color: "#64748b",
      textTransform: "uppercase",
      letterSpacing: "0.3px",
    },
    input: {
      padding: "10px 12px",
      border: "1.5px solid #e2e8f0",
      borderRadius: "8px",
      fontSize: "14px",
      fontFamily: "inherit",
      transition: "all 0.3s ease",
      minWidth: "160px",
    },
    button: {
      padding: "10px 16px",
      backgroundColor: "#6366f1",
      color: "#ffffff",
      border: "none",
      borderRadius: "8px",
      fontSize: "14px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.3s ease",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    clearButton: {
      padding: "10px 16px",
      backgroundColor: "#f1f5f9",
      color: "#64748b",
      border: "1.5px solid #e2e8f0",
      borderRadius: "8px",
      fontSize: "14px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.3s ease",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    filterIndicator: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      padding: "8px 12px",
      backgroundColor: "#6366f115",
      color: "#6366f1",
      borderRadius: "8px",
      fontSize: "13px",
      fontWeight: "600",
    },
  };

  return (
    <div style={{ padding: "24px" }}>
      {/* Filtro de Datas */}
      <div style={filterStyles.container}>
        <h3 style={filterStyles.title}>🔍 Filtrar por Período</h3>
        <div style={filterStyles.filterRow}>
          <div style={filterStyles.filterGroup}>
            <label style={filterStyles.label}>Data Inicial</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              style={filterStyles.input}
            />
          </div>
          <div style={filterStyles.filterGroup}>
            <label style={filterStyles.label}>Data Final</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              style={filterStyles.input}
            />
          </div>
          {hasFilters && (
            <button
              onClick={handleClearFilters}
              style={filterStyles.clearButton}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#e2e8f0";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "#f1f5f9";
              }}
            >
              <X size={16} />
              Limpar Filtros
            </button>
          )}
          {hasFilters && (
            <div style={filterStyles.filterIndicator}>
              ✓ Filtrando resultados
            </div>
          )}
        </div>
      </div>

      {/* Dashboard Header com Filtros */}
      <PlanejadorLeadsHeader startDate={startDate} endDate={endDate} />
    </div>
  );
};

export default PlanejadorLeadsAnalysis;
