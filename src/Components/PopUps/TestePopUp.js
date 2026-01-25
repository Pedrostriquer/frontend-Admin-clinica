import React, { useState, useEffect } from "react";
import axios from "axios";
import FormModel from "./Forms/FormModel";

const TestePopUp = () => {
  const [popUp, setPopUp] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivePopUp = async () => {
      try {
        // Busca o popup marcado como ativo no banco
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_ROUTE}PopUp/active`
        );
        if (response.data) {
          setPopUp(response.data);
          // Simula um delay de entrada para UX (opcional)
          setTimeout(() => setIsVisible(true), 1500);
        }
      } catch (error) {
        console.error("Nenhum popup ativo encontrado ou erro na busca.");
      } finally {
        setLoading(false);
      }
    };

    fetchActivePopUp();
  }, []);

  const handleFormSubmit = async (formData) => {
    try {
      await axios.post(`${process.env.REACT_APP_BASE_ROUTE}PopUp/respond`, {
        popUpId: popUp.id,
        answers: formData,
      });
      alert("Sucesso! Sua resposta foi salva no banco de dados.");
      setIsVisible(false);
    } catch (error) {
      alert("Erro ao enviar resposta. Verifique o console.");
      console.error(error);
    }
  };

  const renderContent = () => {
    if (!popUp) return null;

    const parts = popUp.contentHtml.split("{{FORM}}");

    return (
      <>
        <div dangerouslySetInnerHTML={{ __html: parts[0] }} />
        {popUp.formSchema && parts.length > 1 && (
          <div style={{ margin: "20px 0" }}>
            <FormModel
              initialSchema={popUp.formSchema}
              isAdmin={false}
              onSubmit={handleFormSubmit}
            />
          </div>
        )}
        {parts.length > 1 && (
          <div dangerouslySetInnerHTML={{ __html: parts[1] }} />
        )}
      </>
    );
  };

  if (loading)
    return (
      <div style={{ padding: "20px" }}>Carregando ambiente de teste...</div>
    );
  if (!popUp && !loading)
    return (
      <div style={{ padding: "20px" }}>Não há popups ativos para testar.</div>
    );

  const styles = {
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0,0,0,0.7)",
      display: isVisible ? "flex" : "none",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9999,
      backdropFilter: "blur(5px)",
      transition: "opacity 0.3s ease",
    },
    modal: {
      backgroundColor: "#fff",
      padding: "40px",
      borderRadius: "24px",
      maxWidth: "600px",
      width: "90%",
      position: "relative",
      boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
      maxHeight: "90vh",
      overflowY: "auto",
    },
    closeBtn: {
      position: "absolute",
      top: "15px",
      right: "15px",
      border: "none",
      background: "#f1f5f9",
      width: "30px",
      height: "30px",
      borderRadius: "50%",
      cursor: "pointer",
      fontWeight: "bold",
      color: "#64748b",
    },
  };

  return (
    <div
      style={{ padding: "50px", textAlign: "center", fontFamily: "sans-serif" }}
    >
      <h1>Página de Teste do Cliente</h1>
      <p>O PopUp aparecerá em 1.5 segundos caso haja um ativo...</p>
      <button
        onClick={() => setIsVisible(true)}
        style={{ padding: "10px 20px", cursor: "pointer" }}
      >
        Forçar Abertura do PopUp
      </button>

      <div style={styles.overlay}>
        <div style={styles.modal}>
          <button style={styles.closeBtn} onClick={() => setIsVisible(false)}>
            &times;
          </button>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default TestePopUp;
