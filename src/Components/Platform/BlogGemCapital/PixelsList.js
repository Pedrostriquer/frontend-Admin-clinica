import React, { useState } from "react";
import styles from "./PixelsListStyle";

const PixelsList = ({
  pixels,
  loading,
  onCreatePixel,
  onEditPixel,
  onDeletePixel,
  onTogglePixel,
  loadingPixelId,
}) => {
  const [hoveredRow, setHoveredRow] = useState(null);

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingSpinner}></div>
        <div style={styles.loadingText}>Carregando pixels...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.listHeader}>
        <h2 style={styles.heading}>Pixels ({pixels.length})</h2>
        <button style={styles.createButton} onClick={onCreatePixel}>
          + Novo Pixel
        </button>
      </div>

      {/* Table */}
      {pixels.length > 0 ? (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead style={styles.tableHeader}>
              <tr>
                <th style={styles.tableHeaderCell}>Nome</th>
                <th style={styles.tableHeaderCell}>Tipo</th>
                <th style={styles.tableHeaderCell}>Código</th>
                <th style={styles.tableHeaderCell}>Placement</th>
                <th style={styles.tableHeaderCell}>Prioridade</th>
                <th style={styles.tableHeaderCell}>Status</th>
                <th style={styles.tableHeaderCell}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {pixels.map((pixel) => (
                <tr
                  key={pixel.id}
                  style={{
                    ...styles.tableRow,
                    ...(hoveredRow === pixel.id ? styles.tableRowHover : {}),
                  }}
                  onMouseEnter={() => setHoveredRow(pixel.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  <td style={styles.tableCell}>
                    <div style={styles.pixelName}>{pixel.name}</div>
                    {pixel.description && (
                      <div style={{ fontSize: "12px", color: "#8892a0", marginTop: "4px" }}>
                        {pixel.description}
                      </div>
                    )}
                  </td>
                  <td style={styles.tableCell}>
                    <span style={{ ...styles.badge, ...styles.badgeType }}>
                      {pixel.type}
                    </span>
                  </td>
                  <td style={styles.tableCell}>
                    <code
                      style={{
                        backgroundColor: "#f0f3f8",
                        padding: "4px 8px",
                        borderRadius: "4px",
                        fontSize: "12px",
                        fontFamily: "monospace",
                        color: "#122C4F",
                      }}
                    >
                      {pixel.code.substring(0, 30)}
                      {pixel.code.length > 30 ? "..." : ""}
                    </code>
                  </td>
                  <td style={styles.tableCell}>
                    <span
                      style={{
                        ...styles.badge,
                        ...(pixel.placement === "head"
                          ? styles.badgePlacementHead
                          : styles.badgePlacementBody),
                      }}
                    >
                      {pixel.placement === "head" ? "📍 Head" : "📍 Body"}
                    </span>
                  </td>
                  <td style={styles.tableCell}>
                    <span style={styles.priorityBadge}>#{pixel.priority}</span>
                  </td>
                  <td style={styles.tableCell}>
                    <span
                      style={{
                        ...styles.badge,
                        ...(pixel.active ? styles.badgeActive : styles.badgeInactive),
                      }}
                    >
                      {pixel.active ? "✓ Ativo" : "✗ Inativo"}
                    </span>
                  </td>
                  <td style={styles.tableCell}>
                    <div style={styles.actionsContainer}>
                      <button
                        style={{
                          ...styles.actionButton,
                          opacity: loadingPixelId === pixel.id ? 0.6 : 1,
                          cursor: loadingPixelId === pixel.id ? "not-allowed" : "pointer",
                        }}
                        onClick={() => onEditPixel(pixel)}
                        disabled={loadingPixelId === pixel.id}
                        title="Editar pixel"
                      >
                        ✏️ Editar
                      </button>
                      <button
                        style={{
                          ...styles.toggleButton,
                          backgroundColor: pixel.active ? "#f3e8ff" : "#dcfce7",
                          color: pixel.active ? "#7c3aed" : "#15803d",
                          opacity: loadingPixelId === pixel.id ? 0.6 : 1,
                          cursor: loadingPixelId === pixel.id ? "not-allowed" : "pointer",
                        }}
                        onClick={() => onTogglePixel(pixel.id)}
                        disabled={loadingPixelId === pixel.id}
                        title={pixel.active ? "Desativar pixel" : "Ativar pixel"}
                      >
                        {loadingPixelId === pixel.id && (
                          <span
                            style={{
                              display: "inline-block",
                              width: "10px",
                              height: "10px",
                              border: "2px solid currentColor",
                              borderTop: "2px solid transparent",
                              borderRadius: "50%",
                              animation: "spin 0.8s linear infinite",
                              marginRight: "4px",
                            }}
                          />
                        )}
                        {pixel.active ? "🔴 Desativar" : "🟢 Ativar"}
                      </button>
                      <button
                        style={{
                          ...styles.actionButton,
                          ...styles.deleteButton,
                          opacity: loadingPixelId === pixel.id ? 0.6 : 1,
                          cursor: loadingPixelId === pixel.id ? "not-allowed" : "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "4px",
                        }}
                        onClick={() => onDeletePixel(pixel.id)}
                        disabled={loadingPixelId === pixel.id}
                        title="Deletar pixel"
                      >
                        {loadingPixelId === pixel.id && (
                          <span
                            style={{
                              display: "inline-block",
                              width: "10px",
                              height: "10px",
                              border: "2px solid rgba(220, 53, 69, 0.5)",
                              borderTop: "2px solid #dc3545",
                              borderRadius: "50%",
                              animation: "spin 0.8s linear infinite",
                            }}
                          />
                        )}
                        🗑️ Deletar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>∅</div>
          <h3 style={{ margin: "0 0 8px 0", color: "#122C4F" }}>Nenhum pixel criado</h3>
          <p style={{ margin: "0 0 20px 0", color: "#8892a0" }}>
            Crie seu primeiro pixel para começar (Google, Meta, GTM, etc)
          </p>
          <button style={styles.createButton} onClick={onCreatePixel}>
            + Criar Primeiro Pixel
          </button>
        </div>
      )}
    </div>
  );
};

export default PixelsList;
