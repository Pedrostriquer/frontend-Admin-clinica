import React, { useEffect, useState } from "react";
import "./Toast.css";

const Toast = ({ id, type = "info", message, duration = 3000, onClose }) => {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsClosing(true);
      setTimeout(() => onClose(id), 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => onClose(id), 300);
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return "fa-solid fa-circle-check";
      case "error":
        return "fa-solid fa-circle-xmark";
      case "warning":
        return "fa-solid fa-triangle-exclamation";
      case "info":
      default:
        return "fa-solid fa-info-circle";
    }
  };

  return (
    <div
      className={`toast toast-${type} ${isClosing ? "toast-closing" : ""}`}
    >
      <div className="toast-icon">
        <i className={getIcon()}></i>
      </div>
      <div className="toast-message">{message}</div>
      <button className="toast-close" onClick={handleClose}>
        <i className="fa-solid fa-xmark"></i>
      </button>
    </div>
  );
};

export default Toast;
