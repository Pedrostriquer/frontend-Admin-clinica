import React, { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import NotificationContainer from "../Notifications/NotificationContainer";
import navbarStyles from "./NavbarStyle";

const layoutStyles = {
  appContainer: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    width: "100vw",
    overflow: "hidden",
    backgroundColor: "#f8f9fa",
  },
  bodyContainer: {
    display: "flex",
    flex: 1,
    height: "calc(100vh - 70px)",
    overflow: "hidden",
  },
  mainContent: {
    flex: 1,
    overflowY: "auto",
    transition: "padding-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    position: "relative",
    backgroundColor: "#f8f9fa",
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
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
};

const navButtonStyle = (active) => ({
  display: "flex",
  alignItems: "center",
  gap: "12px",
  padding: "14px",
  borderRadius: "8px",
  border: "none",
  backgroundColor: active ? "#f3f4f6" : "transparent",
  color: active ? "#3b82f6" : "#6b7280",
  fontWeight: active ? "600" : "400",
  textAlign: "left",
  cursor: "pointer",
  fontSize: "0.9rem",
  width: "100%",
});

export default function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isContextOpen, setIsContextOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarCollapsed(true);
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getActiveContext = (path) => {
    if (path.startsWith("/ecommerce")) return "ecommerce";
    if (path.startsWith("/site")) return "site";
    if (path.startsWith("/gemvalue")) return "gemvalue";
    if (path.startsWith("/support")) return "support";
    if (path.startsWith("/emailsender")) return "emailsender";
    return "platform";
  };

  const activeContext = getActiveContext(location.pathname);

  const handleContextChange = (context) => {
    let newPath = "/platform/dashboard";
    if (context === "ecommerce") newPath = "/ecommerce/dashboard";
    else if (context === "site") newPath = "/site/home";
    else if (context === "gemvalue") newPath = "/gemvalue/hero";
    else if (context === "support") newPath = "/support";
    else if (context === "emailsender") newPath = "/emailsender/models";

    navigate(newPath);
    if (isMobile) {
      setSidebarCollapsed(true);
      setIsContextOpen(false);
    }
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!isSidebarCollapsed);
    if (isContextOpen) setIsContextOpen(false);
  };

  const toggleContext = () => {
    setIsContextOpen(!isContextOpen);
    if (!isSidebarCollapsed) setSidebarCollapsed(true);
  };

  const contentStyle = {
    ...layoutStyles.mainContent,
    paddingLeft: isMobile ? "0px" : isSidebarCollapsed ? "88px" : "260px",
    paddingTop: isMobile ? "60px" : "0px",
  };

  return (
    <div style={layoutStyles.appContainer}>
      <style>{`
        @media (max-width: 768px) {
          .mobile-header-active { display: flex !important; justify-content: space-between !important; }
        }
      `}</style>

      <Navbar
        activeContext={activeContext}
        onContextChange={handleContextChange}
      />

      <div className="mobile-header-active" style={layoutStyles.mobileHeader}>
        <button style={layoutStyles.menuButton} onClick={toggleSidebar}>
          <i className="fa-solid fa-bars"></i>
        </button>
        <span style={{ fontWeight: 600 }}>Gemas Brilhantes</span>
        <button style={layoutStyles.menuButton} onClick={toggleContext}>
          <i className="fa-solid fa-layer-group"></i>
        </button>
      </div>

      {isMobile && isContextOpen && (
        <>
          <div style={navbarStyles.mobileBackdrop} onClick={toggleContext} />
          <div
            style={{
              ...navbarStyles.mobileContextSidebar,
              transform: isContextOpen ? "translateX(0)" : "translateX(100%)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "20px",
                alignItems: "center",
              }}
            >
              <h4 style={{ margin: 0 }}>Sistemas</h4>
              <button
                onClick={toggleContext}
                style={{
                  border: "none",
                  background: "none",
                  fontSize: "24px",
                  cursor: "pointer",
                }}
              >
                &times;
              </button>
            </div>

            <button
              style={navButtonStyle(activeContext === "platform")}
              onClick={() => handleContextChange("platform")}
            >
              <i
                className="fa-solid fa-briefcase"
                style={{ width: "20px" }}
              ></i>{" "}
              Plataforma
            </button>
            <button
              style={navButtonStyle(activeContext === "ecommerce")}
              onClick={() => handleContextChange("ecommerce")}
            >
              <i className="fa-solid fa-store" style={{ width: "20px" }}></i>{" "}
              Gemas Preciosas
            </button>
            <button
              style={navButtonStyle(activeContext === "site")}
              onClick={() => handleContextChange("site")}
            >
              <i className="fa-solid fa-globe" style={{ width: "20px" }}></i>{" "}
              Site
            </button>
            <button
              style={navButtonStyle(activeContext === "gemvalue")}
              onClick={() => handleContextChange("gemvalue")}
            >
              <i className="fa-solid fa-gem" style={{ width: "20px" }}></i> Site
              GemValue
            </button>
            <button
              style={navButtonStyle(activeContext === "emailsender")}
              onClick={() => handleContextChange("emailsender")}
            >
              <i className="fa-solid fa-envelope" style={{ width: "20px" }}></i>{" "}
              Email Sender
            </button>
            <button
              style={navButtonStyle(activeContext === "support")}
              onClick={() => handleContextChange("support")}
            >
              <i className="fa-solid fa-headset" style={{ width: "20px" }}></i>{" "}
              Suporte
            </button>
          </div>
        </>
      )}

      <div style={layoutStyles.bodyContainer}>
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
      </div>

      <NotificationContainer />
    </div>
  );
}
