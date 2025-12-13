const colors = {
    primary: "#3B82F6", // Azul moderno
    primaryHover: "#2563EB",
    secondary: "#64748B", // Slate gray para textos secundários
    textMain: "#1E293B", // Slate dark para títulos
    backgroundOverlay: "rgba(15, 23, 42, 0.6)", // Fundo escuro com leve tom azul
    white: "#FFFFFF",
    bgLight: "#F8FAFC", // Fundo muito claro para inputs
    border: "#E2E8F0",
    success: "#10B981",
    successBg: "#ECFDF5",
    danger: "#EF4444",
    dangerBg: "#FEF2F2",
    warning: "#F59E0B",
};

const styles = {
    // --- Estilos Base ---
    modalContainer: {
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 1000,
        background: colors.backgroundOverlay,
        backdropFilter: "blur(4px)", // Efeito de vidro
        padding: 20,
        boxSizing: "border-box",
        animation: "fadeIn 0.2s ease-out",
    },
    modalBody: {
        width: "100%",
        maxWidth: 550,
        background: colors.white,
        borderRadius: 16,
        boxShadow:
            "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        padding: 0, // Padding controlado internamente
        display: "flex",
        flexDirection: "column",
        maxHeight: "90vh",
        overflow: "hidden", // Importante para o header fixo
        position: "relative",
    },

    // Header do Modal (Fixo)
    modalHeader: {
        padding: "20px 24px",
        borderBottom: `1px solid ${colors.border}`,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: colors.white,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "600",
        color: colors.textMain,
        margin: 0,
    },
    closeButton: {
        background: "transparent",
        border: "none",
        cursor: "pointer",
        padding: 8,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: colors.secondary,
        transition: "all 0.2s",
    },

    // Conteúdo Scrollável
    modalContent: {
        padding: "24px",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        gap: 20,
    },

    // --- Etapa 1: Seleção ---
    inputGroup: {
        display: "flex",
        gap: 12,
        width: "100%",
    },
    inputField: {
        flexGrow: 1,
        padding: "12px 16px",
        borderRadius: 8,
        border: `1px solid ${colors.border}`,
        backgroundColor: colors.bgLight,
        fontSize: 15,
        color: colors.textMain,
        outline: "none",
        transition: "border-color 0.2s, box-shadow 0.2s",
    },
    searchButton: {
        padding: "0 24px",
        borderRadius: 8,
        border: "none",
        backgroundColor: colors.primary,
        color: colors.white,
        fontWeight: "600",
        cursor: "pointer",
        transition: "background-color 0.2s",
    },

    // Lista de Resultados
    resultsContainer: {
        border: `1px solid ${colors.border}`,
        borderRadius: 8,
        overflow: "hidden",
        marginTop: 10,
    },
    listHeader: {
        display: "block",
        padding: "10px 16px",
        fontSize: 13,
        textTransform: "uppercase",
        letterSpacing: "0.5px",
        color: colors.secondary,
        backgroundColor: colors.bgLight,
        fontWeight: "600",
        borderBottom: `1px solid ${colors.border}`,
    },
    listItem: {
        padding: "12px 16px",
        cursor: "pointer",
        fontSize: 15,
        color: colors.textMain,
        borderBottom: `1px solid ${colors.border}`,
        transition: "background-color 0.15s",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },

    // Cliente Selecionado
    selectedCard: {
        marginTop: 10,
        padding: 20,
        borderRadius: 12,
        backgroundColor: colors.successBg,
        border: `1px solid ${colors.success}40`, // 40 é hex para opacidade
        display: "flex",
        flexDirection: "column",
        gap: 15,
        alignItems: "center",
        textAlign: "center",
    },
    selectedText: {
        fontSize: 16,
        color: "#065F46", // Dark green
    },

    // --- Etapa 2: Configuração ---
    configHeaderRow: {
        display: "flex",
        alignItems: "center",
        marginBottom: 10,
    },
    backLink: {
        background: "none",
        border: "none",
        color: colors.secondary,
        cursor: "pointer",
        fontSize: 14,
        display: "flex",
        alignItems: "center",
        padding: 0,
        marginRight: 15,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: colors.textMain,
    },

    formGroup: {
        display: "flex",
        flexDirection: "column",
        gap: 8,
    },
    label: {
        fontSize: 14,
        fontWeight: "500",
        color: colors.secondary,
    },
    currencyWrapper: {
        position: "relative",
        display: "flex",
        alignItems: "center",
    },
    currencySymbol: {
        position: "absolute",
        left: 16,
        color: colors.secondary,
        fontWeight: "500",
    },
    inputCurrency: {
        width: "100%",
        padding: "12px 16px 12px 40px", // Padding left maior para o R$
        borderRadius: 8,
        border: `1px solid ${colors.border}`,
        backgroundColor: colors.bgLight,
        fontSize: 16,
        color: colors.textMain,
        outline: "none",
    },
    selectField: {
        width: "100%",
        padding: "12px 16px",
        borderRadius: 8,
        border: `1px solid ${colors.border}`,
        backgroundColor: colors.bgLight,
        fontSize: 15,
        color: colors.textMain,
        outline: "none",
        cursor: "pointer",
    },

    // Checkbox Customizado
    checkboxContainer: {
        display: "flex",
        alignItems: "center",
        padding: "12px 16px",
        borderRadius: 8,
        border: `1px solid ${colors.border}`,
        cursor: "pointer",
        transition: "all 0.2s",
    },
    checkbox: {
        width: 18,
        height: 18,
        marginRight: 12,
        accentColor: colors.primary,
        cursor: "pointer",
    },
    checkboxLabel: {
        fontSize: 15,
        color: colors.textMain,
        cursor: "pointer",
    },

    // Área de Ação e Resultados
    simulationBox: {
        backgroundColor: "#EFF6FF", // Azul bem claro
        border: `1px solid ${colors.primary}30`,
        borderRadius: 10,
        padding: 16,
        marginTop: 10,
    },
    simRow: {
        display: "flex",
        justifyContent: "space-between",
        marginBottom: 8,
        fontSize: 14,
        color: colors.secondary,
    },
    simValue: {
        fontWeight: "700",
        color: colors.primary,
        fontSize: 16,
    },

    actionButtons: {
        display: "flex",
        flexDirection: "column",
        gap: 12,
        marginTop: 20,
    },
    btnPrimary: {
        width: "100%",
        padding: "14px",
        borderRadius: 10,
        border: "none",
        backgroundColor: colors.primary,
        color: colors.white,
        fontSize: 16,
        fontWeight: "600",
        cursor: "pointer",
        transition: "background-color 0.2s",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    btnSecondary: {
        width: "100%",
        padding: "14px",
        borderRadius: 10,
        border: `1px solid ${colors.primary}`,
        backgroundColor: "transparent",
        color: colors.primary,
        fontSize: 16,
        fontWeight: "600",
        cursor: "pointer",
        transition: "all 0.2s",
    },
    btnCancel: {
        width: "100%",
        padding: "12px",
        marginTop: 10,
        background: "transparent",
        border: "none",
        color: colors.secondary,
        cursor: "pointer",
        fontSize: 14,
    },
    errorText: {
        fontSize: 13,
        color: colors.danger,
        marginTop: 4,
    },
};

export { styles, colors };