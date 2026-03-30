import React, { useState } from "react";
import { useAuth } from "../../Context/AuthContext";
import styles from "./LoginStyle";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoggingIn(true);
    try {
      await login(email, password, rememberMe);
    } catch (err) {
      setError("Email ou senha inválidos. Tente novamente.");
      setIsLoggingIn(false);
    }
  };

  return (
    <div style={styles.loginContainer}>
      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.7; }
          100% { transform: scale(1); opacity: 1; }
        }
        @media (max-width: 900px) {
          .admin-branding-panel { display: none !important; }
          .admin-form-area { width: 100% !important; flex: none !important; padding: 20px !important; }
          .mobile-header { display: flex !important; }
        }
      `}</style>

      <div className="admin-branding-panel" style={styles.loginBranding}>
        <div style={styles.brandingContent}>
          <div style={styles.iconCircle}>
            <i className="fa-solid fa-gem" style={styles.brandingIcon}></i>
          </div>
          <h1 style={styles.brandingH1}>Gemas Brilhantes</h1>
          <p style={styles.brandingP}>
            Gestão inteligente de contratos e ativos preciosos em um só lugar.
          </p>
        </div>
      </div>

      <div className="admin-form-area" style={styles.loginFormArea}>
        {isLoggingIn && (
          <div style={styles.loadingOverlay}>
            <div
              className="pu-spinner"
              style={{
                width: "40px",
                height: "40px",
                border: "3px solid #f3f3f3",
                borderTop: "3px solid #007bff",
                borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
              }}
            ></div>
            <p style={styles.loadingText}>Autenticando...</p>
          </div>
        )}

        <form style={styles.loginForm} onSubmit={handleLogin}>
          <div className="mobile-header" style={styles.mobileHeader}>
            <i className="fa-solid fa-gem" style={styles.mobileIcon}></i>
            <h2 style={styles.mobileTitle}>Gemas Brilhantes</h2>
          </div>

          <div style={styles.textHeader}>
            <h2 style={styles.loginFormH2}>Painel Administrativo</h2>
            <p style={styles.formSubtitle}>
              Entre com suas credenciais de acesso.
            </p>
          </div>

          {error && (
            <div style={styles.errorMessage}>
              <i className="fa-solid fa-triangle-exclamation"></i> {error}
            </div>
          )}

          <div style={styles.inputGroup}>
            <label style={styles.fieldLabel}>E-mail</label>
            <div
              style={{
                ...styles.inputWrapper,
                ...(focusedInput === "email" && styles.inputWrapperFocus),
              }}
            >
              <i className="fa-solid fa-envelope" style={styles.inputIcon}></i>
              <input
                type="email"
                placeholder="exemplo@gemas.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={styles.inputField}
                onFocus={() => setFocusedInput("email")}
                onBlur={() => setFocusedInput(null)}
              />
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.fieldLabel}>Senha</label>
            <div
              style={{
                ...styles.inputWrapper,
                ...(focusedInput === "password" && styles.inputWrapperFocus),
              }}
            >
              <i className="fa-solid fa-lock" style={styles.inputIcon}></i>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={styles.inputField}
                onFocus={() => setFocusedInput("password")}
                onBlur={() => setFocusedInput(null)}
              />
              <i
                className={`fa-solid ${
                  showPassword ? "fa-eye-slash" : "fa-eye"
                }`}
                style={styles.passwordToggleIcon}
                onClick={() => setShowPassword(!showPassword)}
              ></i>
            </div>
          </div>

          <div style={styles.optionsRow}>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={styles.checkbox}
              />
              Mantenha-me conectado
            </label>
          </div>

          <button
            type="submit"
            style={styles.loginButton}
            disabled={isLoggingIn}
          >
            {isLoggingIn ? "Processando..." : "Acessar Painel"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
