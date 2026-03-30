import React, { useState } from "react";

const ActionButton = ({
  icon: Icon,
  onClick,
  title,
  color = "#6366f1",
  hoverColor = null,
  size = 18,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const styles = {
    container: {
      position: "relative",
      display: "inline-block",
    },
    button: {
      background: "none",
      border: "none",
      cursor: "pointer",
      color: color,
      padding: "6px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "6px",
      transition: "all 0.2s ease",
    },
    tooltip: {
      position: "absolute",
      bottom: "100%",
      left: "50%",
      transform: "translateX(-50%)",
      backgroundColor: "#1f2937",
      color: "#ffffff",
      padding: "8px 12px",
      borderRadius: "6px",
      fontSize: "12px",
      fontWeight: "600",
      whiteSpace: "nowrap",
      marginBottom: "8px",
      zIndex: 10000,
      pointerEvents: "none",
      animation: "tooltipSlideIn 0.2s ease-out",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
    },
    tooltipArrow: {
      position: "absolute",
      top: "100%",
      left: "50%",
      transform: "translateX(-50%)",
      width: "0",
      height: "0",
      borderLeft: "6px solid transparent",
      borderRight: "6px solid transparent",
      borderTop: "6px solid #1f2937",
    },
  };

  return (
    <>
      <style>{`
        @keyframes tooltipSlideIn {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(4px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
      `}</style>
      <div
        style={styles.container}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <button
          style={styles.button}
          onClick={onClick}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = `${hoverColor || color}15`;
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "transparent";
          }}
        >
          <Icon size={size} />
        </button>
        {showTooltip && (
          <div style={styles.tooltip}>
            {title}
            <div style={styles.tooltipArrow}></div>
          </div>
        )}
      </div>
    </>
  );
};

export default ActionButton;
