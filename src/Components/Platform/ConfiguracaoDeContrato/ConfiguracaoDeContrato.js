import React, { useState, useEffect } from "react";
import contractServices from "../../../dbServices/contractServices";
import styles from "./ConfiguracaoDeContratoStyle";

const ConfiguracaoDeContrato = () => {
  const [loading, setLoading] = useState(true);
  const [htmlContent, setHtmlContent] = useState("");
  const [htmlContentBackup, setHtmlContentBackup] = useState("");
  const [error, setError] = useState(null);
  const [isEditingHtml, setIsEditingHtml] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Estados para as informações dinâmicas com valores reais
  const [dynamicData, setDynamicData] = useState({
    clientName: "João de Alves Teixeira",
    clientCpfCnpj: "123.456.789-00",
    clientAddress: "Avenida Paulista, nº 1471, São Paulo-SP",
    contractAmount: "10.000,00",
    contractDuration: "12",
    monthly_percentage: "2,0",
    currentDay: "09",
    currentMonth: "abril",
    currentYear: "2026",
  });

  // Mapeamento de labels legíveis
  const dataLabels = {
    clientName: "Nome do Cliente",
    clientCpfCnpj: "CPF/CNPJ",
    clientAddress: "Endereço do Cliente",
    contractAmount: "Valor do Contrato",
    contractDuration: "Duração (meses)",
    monthly_percentage: "Porcentagem Mensal",
    currentDay: "Dia Atual",
    currentMonth: "Mês Atual",
    currentYear: "Ano Atual",
  };

  // Mapeamento de placeholders Handlebars
  const placeholders = {
    clientName: "{{clientName}}",
    clientCpfCnpj: "{{clientCpfCnpj}}",
    clientAddress: "{{clientAddress}}",
    contractAmount: "{{contractAmount}}",
    contractDuration: "{{contractDuration}}",
    monthly_percentage: "{{monthly_percentage}}",
    currentDay: "{{currentDay}}",
    currentMonth: "{{currentMonth}}",
    currentYear: "{{currentYear}}",
  };

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        setLoading(true);
        const response = await contractServices.getContractTemplate();
        setHtmlContent(response.html || "");
        setHtmlContentBackup(response.html || "");
        setError(null);
      } catch (err) {
        console.error("Erro ao carregar template:", err);
        setError("Erro ao carregar o template do contrato");
      } finally {
        setLoading(false);
      }
    };

    fetchTemplate();
  }, []);

  // Detectar mudanças de tamanho de tela
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleDynamicDataChange = (field, value) => {
    setDynamicData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleEditHtml = () => {
    setIsEditingHtml(true);
  };

  const handleCancelEdit = () => {
    setHtmlContent(htmlContentBackup);
    setIsEditingHtml(false);
  };

  const handleSaveHtml = async () => {
    try {
      setLoading(true);
      await contractServices.updateContractTemplate(htmlContent);
      setHtmlContentBackup(htmlContent);
      setIsEditingHtml(false);
      alert("Template atualizado com sucesso!");
    } catch (err) {
      console.error("Erro ao salvar template:", err);
      setError("Erro ao salvar o template do contrato");
    } finally {
      setLoading(false);
    }
  };

  // Função para substituir placeholders no HTML pelos valores dinâmicos
  const getRenderedHtml = () => {
    let rendered = htmlContent;
    Object.entries(dynamicData).forEach(([key, value]) => {
      const placeholder = placeholders[key];
      rendered = rendered.replace(new RegExp(placeholder, "g"), value);
    });
    return rendered;
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>
          Carregando Html do contrato do banco de dados....
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.errorContainer}>
        <p style={styles.errorText}>{error}</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.pageTitle}>Configuração de Contrato PDF</h1>
        <p style={styles.pageSubtitle}>
          Edite o template do contrato e teste com variáveis dinâmicas
        </p>
      </div>

      {/* Seção de Inputs Dinâmicos no Topo */}
      <div style={styles.topSection}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Variáveis Dinâmicas</h2>
          <p style={styles.sectionDescription}>
            Edite os valores de teste para visualizar como ficam no contrato
          </p>
        </div>
        <div style={styles.inputGrid}>
          {Object.entries(dynamicData).map(([key, value]) => (
            <div key={key} style={styles.inputGroup}>
              <label style={styles.label}>
                {dataLabels[key]}
              </label>
              <div style={styles.inputWrapper}>
                <input
                  type="text"
                  value={value}
                  onChange={(e) => handleDynamicDataChange(key, e.target.value)}
                  style={styles.input}
                />
                <span style={styles.placeholder}>{placeholders[key]}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Seção de Conteúdo em 2 Colunas (Desktop/Tablet) */}
      {!isMobile && (
        <div style={styles.contentSection}>
          {/* Coluna Esquerda - HTML */}
          <div style={styles.column}>
            <div style={styles.columnHeader}>
              <h3 style={styles.columnTitle}>HTML do Template</h3>
              {!isEditingHtml && (
                <button style={styles.editButton} onClick={handleEditHtml}>
                  <i style={{ marginRight: "5px" }}>✎</i> Editar HTML
                </button>
              )}
            </div>
            <div style={styles.htmlBox}>
              <textarea
                value={htmlContent}
                onChange={(e) => setHtmlContent(e.target.value)}
                style={{
                  ...styles.textarea,
                  ...(isEditingHtml ? {} : styles.textareaDisabled),
                }}
                disabled={!isEditingHtml}
              />
            </div>
            {isEditingHtml && (
              <div style={styles.buttonGroup}>
                <button style={styles.cancelButton} onClick={handleCancelEdit}>
                  Cancelar
                </button>
                <button style={styles.saveButton} onClick={handleSaveHtml}>
                  Salvar Alterações
                </button>
              </div>
            )}
          </div>

          {/* Coluna Direita - Renderização */}
          <div style={styles.column}>
            <div style={styles.columnHeader}>
              <h3 style={styles.columnTitle}>Visualização do Contrato</h3>
            </div>
            <div style={styles.previewBox}>
              <div
                dangerouslySetInnerHTML={{ __html: getRenderedHtml() }}
                style={styles.previewContent}
              />
            </div>
          </div>
        </div>
      )}

      {/* Seção Mobile - Apenas HTML */}
      {isMobile && (
        <div style={styles.mobileContentSection}>
          {/* Coluna Esquerda - HTML */}
          <div style={styles.column}>
            <div style={styles.columnHeader}>
              <h3 style={styles.columnTitle}>HTML do Template</h3>
              {!isEditingHtml && (
                <button style={styles.editButton} onClick={handleEditHtml}>
                  <i style={{ marginRight: "5px" }}>✎</i> Editar
                </button>
              )}
            </div>
            <div style={styles.htmlBox}>
              <textarea
                value={htmlContent}
                onChange={(e) => setHtmlContent(e.target.value)}
                style={{
                  ...styles.textarea,
                  ...(isEditingHtml ? {} : styles.textareaDisabled),
                }}
                disabled={!isEditingHtml}
              />
            </div>
            {isEditingHtml && (
              <div style={styles.buttonGroup}>
                <button style={styles.cancelButton} onClick={handleCancelEdit}>
                  Cancelar
                </button>
                <button style={styles.saveButton} onClick={handleSaveHtml}>
                  Salvar
                </button>
              </div>
            )}
          </div>

          {/* Botão Flutuante */}
          <button
            style={styles.floatingButton}
            onClick={() => setShowPreviewModal(true)}
            title="Visualizar contrato"
          >
            👁️
          </button>
        </div>
      )}

      {/* Modal de Visualização (Mobile) */}
      {isMobile && showPreviewModal && (
        <div style={styles.modalBackdrop} onClick={() => setShowPreviewModal(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Visualização do Contrato</h3>
              <button
                style={styles.modalCloseButton}
                onClick={() => setShowPreviewModal(false)}
              >
                ✕
              </button>
            </div>
            <div style={styles.modalBody}>
              <div
                dangerouslySetInnerHTML={{ __html: getRenderedHtml() }}
                style={styles.previewContent}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfiguracaoDeContrato;
