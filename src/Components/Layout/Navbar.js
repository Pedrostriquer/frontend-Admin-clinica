import React, { useState } from "react";
import navbarStyles from "./NavbarStyle";

const NavButton = ({ id, label, icon, activeContext, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const isActive = activeContext === id;

  const style = {
    ...navbarStyles.contextButton,
    ...(isActive ? navbarStyles.contextButtonActive : {}),
    ...(isHovered && !isActive
      ? { color: "#111827", backgroundColor: "#f3f4f6" }
      : {}),
  };

  return (
    <button
      style={style}
      onClick={() => onClick(id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <i
        className={`fa-solid fa-${icon}`}
        style={navbarStyles.contextButtonIcon}
      ></i>
      <span className="nav-button-text">{label}</span>
    </button>
  );
};

export default function Navbar({ activeContext, onContextChange }) {
  const contexts = [
    { id: "platform", label: "Plataforma", icon: "briefcase" },
    { id: "ecommerce", label: "Gemas Preciosas", icon: "store" },
    { id: "site", label: "Site", icon: "globe" },
    { id: "gemvalue", label: "Site GemValue", icon: "gem" },
    { id: "emailsender", label: "Email Sender", icon: "envelope" },
  ];

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .desktop-navbar { display: none !important; }
        }
        @media (max-width: 1024px) {
          .nav-button-text { display: none; }
        }
      `}</style>

      <nav className="desktop-navbar" style={navbarStyles.navbar}>
        <div style={navbarStyles.logoSection}>
          <i className="fa-solid fa-gem" style={navbarStyles.logoIcon}></i>
          <h1 style={navbarStyles.logoTitle}>Gemas Brilhantes</h1>
        </div>

        <div style={navbarStyles.contextNav}>
          {contexts.map((ctx) => (
            <NavButton
              key={ctx.id}
              id={ctx.id}
              label={ctx.label}
              icon={ctx.icon}
              activeContext={activeContext}
              onClick={onContextChange}
            />
          ))}

          <NavButton
            id="support"
            label="Suporte"
            icon="headset"
            activeContext={activeContext === "support" ? "support" : ""}
            onClick={() => onContextChange("support")}
          />
        </div>

        <div style={navbarStyles.rightSection}>
          <div
            style={{
              padding: "8px 12px",
              borderRadius: "20px",
              backgroundColor: "#f3f4f6",
              fontSize: "12px",
              color: "#666",
            }}
          >
            <i
              className="fa-solid fa-user-shield"
              style={{ marginRight: "8px" }}
            ></i>
            Painel Admin
          </div>
        </div>
      </nav>
    </>
  );
}
