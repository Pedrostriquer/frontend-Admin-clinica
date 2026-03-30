import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FileText, FolderOpen, Eye, BarChart3, TrendingUp, Users } from "lucide-react";
import styles from "./BlogGemCapitalStyle";

// Hook para detectar tamanho da tela
const useResponsive = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return {
    isMobile: windowSize.width < 640,
    isTablet: windowSize.width >= 640 && windowSize.width < 1024,
    isDesktop: windowSize.width >= 1024,
    width: windowSize.width,
  };
};

const BlogGemCapitalContainer = ({ children, counts = {} }) => {
  const responsive = useResponsive();
  const navigate = useNavigate();
  const location = useLocation();

  // Detectar qual tab está ativo pela rota
  const getCurrentTab = () => {
    const path = location.pathname;
    if (path.includes("/planejador")) return "planejador";
    if (path.includes("/posts")) return "posts";
    if (path.includes("/categorias")) return "categories";
    if (path.includes("/pixels")) return "pixels";
    if (path.includes("/quizzes")) return "quizzes";
    if (path.includes("/affiliates")) return "affiliates";
    return "posts";
  };

  const activeTab = getCurrentTab();

  // Gera estilos responsivos
  const getResponsiveStyles = () => {
    return {
      container: {
        ...styles.container,
        padding: responsive.isMobile
          ? "70px 16px 20px 16px"
          : responsive.isTablet
            ? "75px 24px 30px 24px"
            : "80px 40px 40px 40px",
      },
      header: {
        ...styles.header,
        marginBottom: responsive.isMobile ? "24px" : "40px",
      },
      title: {
        ...styles.title,
        fontSize: responsive.isMobile ? "24px" : responsive.isTablet ? "28px" : "32px",
      },
      subtitle: {
        ...styles.subtitle,
        fontSize: responsive.isMobile ? "13px" : "15px",
      },
      tabsContainer: {
        ...styles.tabsContainer,
        gap: responsive.isMobile ? "8px" : responsive.isTablet ? "12px" : "20px",
        marginBottom: responsive.isMobile ? "20px" : "30px",
        overflowX: responsive.isMobile ? "auto" : "visible",
        paddingBottom: responsive.isMobile ? "8px" : "0px",
      },
      tabButton: {
        ...styles.tabButton,
        padding: responsive.isMobile ? "10px 14px" : "14px 20px",
        fontSize: responsive.isMobile ? "12px" : "14px",
        minWidth: responsive.isMobile ? "auto" : "auto",
      },
      contentArea: {
        ...styles.contentArea,
        padding: responsive.isMobile ? "16px" : responsive.isTablet ? "20px" : "30px",
        borderRadius: responsive.isMobile ? "8px" : "12px",
      },
    };
  };

  const responsiveStyles = getResponsiveStyles();

  const handleTabClick = (tab) => {
    const routes = {
      planejador: "/platform/blog-gemcapital/planejador",
      posts: "/platform/blog-gemcapital/posts",
      categories: "/platform/blog-gemcapital/categorias",
      pixels: "/platform/blog-gemcapital/pixels",
      quizzes: "/platform/blog-gemcapital/quizzes",
      affiliates: "/platform/blog-gemcapital/affiliates",
    };
    navigate(routes[tab]);
  };

  const tabIcons = {
    planejador: <TrendingUp size={18} />,
    posts: <FileText size={18} />,
    categories: <FolderOpen size={18} />,
    pixels: <Eye size={18} />,
    quizzes: <BarChart3 size={18} />,
    affiliates: <Users size={18} />,
  };

  const tabs = [
    { id: "posts", label: "Posts" },
    { id: "categories", label: "Categorias" },
    { id: "pixels", label: "Pixels" },
    { id: "quizzes", label: "Quizzes" },
    { id: "planejador", label: "Planejador" },
    { id: "affiliates", label: "Afiliados" },
  ];

  return (
    <div style={responsiveStyles.container}>
      {/* Header */}
      <div style={responsiveStyles.header}>
        <h1 style={responsiveStyles.title}>Gerenciar Blog GemCapital</h1>
        <p style={responsiveStyles.subtitle}>
          Gerencie posts, categorias e conteúdo visual
        </p>
      </div>

      {/* Tabs */}
      <div style={responsiveStyles.tabsContainer}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            style={{
              ...responsiveStyles.tabButton,
              ...(activeTab === tab.id ? styles.tabButtonActive : {}),
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: activeTab === tab.id ? "#122C4F" : "#8892a0",
            }}
            onClick={() => handleTabClick(tab.id)}
          >
            <span style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "currentColor",
            }}>
              {tabIcons[tab.id]}
            </span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={responsiveStyles.contentArea}>{children}</div>
    </div>
  );
};

export default BlogGemCapitalContainer;
