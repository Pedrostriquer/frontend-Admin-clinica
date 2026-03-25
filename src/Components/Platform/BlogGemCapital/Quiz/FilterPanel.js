import React from "react";
import { FiFilter, FiX } from "react-icons/fi";

const FilterPanel = ({
  searchName,
  onSearchNameChange,
  statusFilter,
  onStatusFilterChange,
  sortOrder,
  onSortOrderChange,
  dateFrom,
  onDateFromChange,
  dateTo,
  onDateToChange,
  onClearFilters
}) => {
  const styles = {
    container: {
      backgroundColor: "#f9fafb",
      border: "1px solid #e5e7eb",
      borderRadius: "8px",
      padding: "16px",
      marginBottom: "20px",
    },
    header: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      marginBottom: "16px",
      fontSize: "14px",
      fontWeight: "600",
      color: "#1a3a52",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: "12px",
    },
    inputGroup: {
      display: "flex",
      flexDirection: "column",
      gap: "4px",
    },
    label: {
      fontSize: "12px",
      fontWeight: "500",
      color: "#666",
      textTransform: "uppercase",
    },
    input: {
      padding: "8px 12px",
      border: "1px solid #d1d5db",
      borderRadius: "6px",
      fontSize: "14px",
      fontFamily: "inherit",
      transition: "all 0.2s ease",
      outline: "none",
      ":focus": {
        borderColor: "#1a3a52",
        boxShadow: "0 0 0 3px rgba(26, 58, 82, 0.1)",
      },
    },
    select: {
      padding: "8px 12px",
      border: "1px solid #d1d5db",
      borderRadius: "6px",
      fontSize: "14px",
      fontFamily: "inherit",
      backgroundColor: "#fff",
      cursor: "pointer",
      transition: "all 0.2s ease",
      outline: "none",
    },
    buttonGroup: {
      display: "flex",
      gap: "8px",
      alignItems: "flex-end",
    },
    clearBtn: {
      padding: "8px 12px",
      backgroundColor: "#fff",
      border: "1px solid #d1d5db",
      borderRadius: "6px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "4px",
      fontSize: "12px",
      fontWeight: "500",
      color: "#666",
      transition: "all 0.2s ease",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <FiFilter size={16} />
        <span>Filtrar Respostas</span>
      </div>

      <div style={styles.grid}>
        {/* Buscar por Nome */}
        <div style={styles.inputGroup}>
          <label style={styles.label}>👤 Nome</label>
          <input
            type="text"
            style={styles.input}
            placeholder="Buscar por nome..."
            value={searchName}
            onChange={(e) => onSearchNameChange(e.target.value)}
          />
        </div>

        {/* Filtrar por Status */}
        <div style={styles.inputGroup}>
          <label style={styles.label}>📌 Status</label>
          <select
            style={styles.select}
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
          >
            <option value="all">Todos</option>
            <option value="contacted">Contactados</option>
            <option value="notContacted">Não Contactados</option>
          </select>
        </div>

        {/* Ordenação */}
        <div style={styles.inputGroup}>
          <label style={styles.label}>📅 Ordenar</label>
          <select
            style={styles.select}
            value={sortOrder}
            onChange={(e) => onSortOrderChange(e.target.value)}
          >
            <option value="newest">Mais Novo</option>
            <option value="oldest">Mais Antigo</option>
          </select>
        </div>

        {/* Data Inicial */}
        <div style={styles.inputGroup}>
          <label style={styles.label}>📅 Data Inicial</label>
          <input
            type="date"
            style={styles.input}
            value={dateFrom}
            onChange={(e) => onDateFromChange(e.target.value)}
          />
        </div>

        {/* Data Final */}
        <div style={styles.inputGroup}>
          <label style={styles.label}>📅 Data Final</label>
          <input
            type="date"
            style={styles.input}
            value={dateTo}
            onChange={(e) => onDateToChange(e.target.value)}
          />
        </div>

        {/* Botão Limpar Filtros */}
        <div style={styles.buttonGroup}>
          <button
            style={styles.clearBtn}
            onClick={onClearFilters}
            title="Limpar todos os filtros"
          >
            <FiX size={14} />
            Limpar
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
