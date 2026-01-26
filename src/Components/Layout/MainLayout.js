import React, { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import NotificationContainer from "../Notifications/NotificationContainer";

const layoutStyles = {
  appContainer: {
    display: "flex",
    height: "100vh",
    width: "100vw",
    overflow: "hidden",
    backgroundColor: "#f8f9fa",
  },
  mainContent: {
    flex: 1,
    overflowY: "auto",
    height: "100vh",
    paddingLeft: "260px", // Mesma largura da sidebar
    paddingRight: "0px",
    transition: "padding-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    position: "relative",
  },
  mobileHeader: {
    display: "none",
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    height: "60px",
    backgroundColor: "#ffffff",
    borderBottom: "1px solid #e5e7eb",
    zIndex: 90,
    alignItems: "center",
    padding: "0 20px",
  },
  menuButton: {
    background: "none",
    border: "none",
    fontSize: "24px",
    cursor: "pointer",
    color: "#374151",
  },
};

export default function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Monitora redimensionamento da tela
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile) setSidebarCollapsed(true); // Começa fechada no mobile
    };
    window.addEventListener("resize", handleResize);
    handleResize(); // Executa ao montar
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getActiveContext = (path) => {
    if (path.startsWith("/ecommerce")) return "ecommerce";
    if (path.startsWith("/site")) return "site";
    if (path.startsWith("/gemvalue")) return "gemvalue";
    return "platform";
  };

  const activeContext = getActiveContext(location.pathname);

  const handleContextChange = (context) => {
    let newPath = "/platform/dashboard";
    if (context === "ecommerce") newPath = "/ecommerce/dashboard";
    else if (context === "site") newPath = "/site/home";
    else if (context === "gemvalue") newPath = "/gemvalue/hero";

    navigate(newPath);
    if (isMobile) setSidebarCollapsed(true); // Fecha ao navegar no mobile
  };

  const toggleSidebar = () => setSidebarCollapsed(!isSidebarCollapsed);

  const contentStyle = {
    ...layoutStyles.mainContent,
    paddingLeft: isMobile ? "0px" : isSidebarCollapsed ? "88px" : "260px",
    paddingTop: isMobile ? "60px" : "0px",
  };

  return (
    <div style={layoutStyles.appContainer}>
      <style>{`
        @media (max-width: 768px) {
          .mobile-header-active { display: flex !important; }
        }
      `}</style>

      <div className="mobile-header-active" style={layoutStyles.mobileHeader}>
        <button style={layoutStyles.menuButton} onClick={toggleSidebar}>
          <i className="fa-solid fa-bars"></i>
        </button>
        <span style={{ marginLeft: "15px", fontWeight: 600 }}>
          Gemas Brilhantes
        </span>
      </div>

      <Sidebar
        activeContext={activeContext}
        onContextChange={handleContextChange}
        isSidebarCollapsed={isSidebarCollapsed}
        onToggle={toggleSidebar}
        activePath={location.pathname}
        onLinkClick={(path) => {
          navigate(path);
          if (isMobile) setSidebarCollapsed(true);
        }}
        isMobile={isMobile}
      />

      <main style={contentStyle}>
        <Outlet />
      </main>
      <NotificationContainer />
    </div>
  );
}
