import React, { useState, useEffect } from "react";
import styles from "./SidebarStyle";
import { useAuth } from "../../Context/AuthContext";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/config";

const FirebaseLoginModal = ({ onClose, onSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      onSuccess();
    } catch (err) {
      setError("Falha no login. Verifique suas credenciais.");
    }
  };

  return (
    <div style={styles.firebaseModalBackdrop}>
      <div
        style={styles.firebaseModalContent}
        onClick={(e) => e.stopPropagation()}
      >
        <h4>Acesso Restrito</h4>
        <p>Insira suas credenciais de administrador do site.</p>
        <form onSubmit={handleLogin}>
          <input
            style={styles.firebaseInput}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            style={styles.firebaseInput}
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p style={{ color: "red", fontSize: "0.8rem" }}>{error}</p>}
          <button style={styles.firebaseButton} type="submit">
            Entrar
          </button>
        </form>
        <button style={styles.firebaseModalClose} onClick={onClose}>
          &times;
        </button>
      </div>
    </div>
  );
};

const NavItem = ({
  isActive,
  isCollapsed,
  onClick,
  icon,
  children,
  hoverStyle,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const style = {
    ...styles.navItem,
    ...(isActive && styles.navItemActive),
    ...(isHovered && !isActive && (hoverStyle || styles.navItemHover)),
    ...(isCollapsed && styles.navItemCollapsed),
  };
  return (
    <li
      style={style}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <i className={icon} style={styles.navItemIcon}></i>
      <span
        style={{
          ...styles.navItemSpan,
          ...(isCollapsed && styles.navItemSpanCollapsed),
        }}
      >
        {children}
      </span>
    </li>
  );
};

const platformMenu = [
  {
    name: "Dashboard",
    icon: "fa-solid fa-chart-pie",
    path: "/platform/dashboard",
  },
  { name: "Clientes", icon: "fa-solid fa-users", path: "/platform/clients" },
  {
    name: "Consultores",
    icon: "fa-solid fa-user-tie",
    path: "/platform/consultants",
  },
  {
    name: "Contratos",
    icon: "fa-solid fa-file-signature",
    path: "/platform/contracts",
  },
  {
    name: "Saques",
    icon: "fa-solid fa-money-bill-wave",
    path: "/platform/withdraws",
  },
  { name: "PopUps", icon: "fa-solid fa-bell", path: "/platform/pop-ups" },
  {
    name: "Notificações",
    icon: "fa-solid fa-bell",
    path: "/platform/notifications",
  },
  { name: "Ofertas", icon: "fa-solid fa-newspaper", path: "/platform/offers" },
  {
    name: "Catalogo GemCash",
    icon: "fa-solid fa-newspaper",
    path: "/platform/catalogo-gemcash",
  },
  {
    name: "Controlador",
    icon: "fa-solid fa-sliders",
    path: "/platform/controller",
  },
];

const ecommerceMenu = [
  {
    name: "Dashboard",
    icon: "fa-solid fa-chart-pie",
    path: "/ecommerce/dashboard",
  },
  { name: "Produtos", icon: "fa-solid fa-gem", path: "/ecommerce/products" },
  {
    name: "Categorias",
    icon: "fa-solid fa-sitemap",
    path: "/ecommerce/categories",
  },
  {
    name: "Formulários",
    icon: "fa-solid fa-file-alt",
    path: "/ecommerce/forms",
  },
  { name: "Blog", icon: "fa-solid fa-newspaper", path: "/ecommerce/blog" },
  {
    name: "Promoções",
    icon: "fa-solid fa-tags",
    path: "/ecommerce/promotions",
  },
  { name: "Pedidos", icon: "fa-solid fa-box-open", path: "/ecommerce/orders" },
];

const siteMenu = [
  { name: "Home", icon: "fa-solid fa-house", path: "/site/home" },
  { name: "GemCash", icon: "fa-solid fa-coins", path: "/site/gemcash" },
  { name: "Jóias", icon: "fa-solid fa-ring", path: "/site/personalizadas" },
  {
    name: "Leads Simulação",
    icon: "fa-solid fa-users-line",
    path: "/site/leads",
  },
];

const gemvalueMenu = [
  { name: "Início (Hero)", icon: "fa-solid fa-star", path: "/gemvalue/hero" },
  {
    name: "Ativos Físicos",
    icon: "fa-solid fa-box-open",
    path: "/gemvalue/why-physical",
  },
  {
    name: "Por que Diamantes",
    icon: "fa-solid fa-gem",
    path: "/gemvalue/why-diamonds",
  },
  {
    name: "Como Funciona",
    icon: "fa-solid fa-gears",
    path: "/gemvalue/how-it-works",
  },
  {
    name: "Parâmetros",
    icon: "fa-solid fa-list-check",
    path: "/gemvalue/parameters",
  },
  {
    name: "Autoridade",
    icon: "fa-solid fa-award",
    path: "/gemvalue/authority",
  },
  {
    name: "Público-Alvo",
    icon: "fa-solid fa-users-rectangle",
    path: "/gemvalue/target-audience",
  },
  {
    name: "Simulação",
    icon: "fa-solid fa-calculator",
    path: "/gemvalue/simulation",
  },
  {
    name: "FAQ (Dúvidas)",
    icon: "fa-solid fa-question-circle",
    path: "/gemvalue/faq",
  },
  {
    name: "Rodapé",
    icon: "fa-solid fa-window-maximize",
    path: "/gemvalue/footer",
  },
];

const emailSenderMenu = [
  {
    name: "Modelos",
    icon: "fa-solid fa-file-code",
    path: "/emailsender/models",
  },
  {
    name: "Campanhas",
    icon: "fa-solid fa-paper-plane",
    path: "/emailsender/campaigns",
  },
];

function Sidebar({
  activeContext,
  onContextChange,
  isSidebarCollapsed,
  onToggle,
  activePath,
  onLinkClick,
  isMobile,
}) {
  const [isUserHovered, setIsUserHovered] = useState(false);
  const { logout } = useAuth();
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [showFirebaseModal, setShowFirebaseModal] = useState(false);
  const [isToggleHovered, setIsToggleHovered] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleFirebaseLoginSuccess = () => {
    setShowFirebaseModal(false);
    onContextChange("site");
  };

  const getMenu = () => {
    if (activePath.startsWith("/support")) return [];
    switch (activeContext) {
      case "platform":
        return platformMenu;
      case "ecommerce":
        return ecommerceMenu;
      case "site":
        return siteMenu;
      case "gemvalue":
        return gemvalueMenu;
      case "emailsender":
        return emailSenderMenu;
      default:
        return [];
    }
  };

  const navStyle = {
    ...styles.sidebar,
    ...(isSidebarCollapsed && !isMobile && styles.sidebarCollapsed),
    ...(isMobile && isSidebarCollapsed && styles.sidebarHidden),
    ...(isMobile && !isSidebarCollapsed && styles.sidebarMobileActive),
  };

  const userProfileStyle = {
    ...styles.userProfile,
    ...(isUserHovered && styles.userProfileHover),
    ...(isSidebarCollapsed && !isMobile && styles.userProfileCollapsed),
  };

  const floatingToggleStyle = {
    ...styles.floatingToggleButton,
    left: isSidebarCollapsed
      ? styles.sidebarCollapsed.width
      : styles.sidebar.width,
    ...(isToggleHovered && styles.floatingToggleButtonHover),
  };

  return (
    <>
      {showFirebaseModal && (
        <FirebaseLoginModal
          onClose={() => setShowFirebaseModal(false)}
          onSuccess={handleFirebaseLoginSuccess}
        />
      )}

      {isMobile && !isSidebarCollapsed && (
        <div style={styles.mobileBackdrop} onClick={onToggle} />
      )}

      {!isMobile && (
        <button
          style={floatingToggleStyle}
          onClick={onToggle}
          onMouseEnter={() => setIsToggleHovered(true)}
          onMouseLeave={() => setIsToggleHovered(false)}
        >
          <i
            className={`fa-solid ${
              isSidebarCollapsed ? "fa-chevron-right" : "fa-chevron-left"
            }`}
          ></i>
        </button>
      )}

      <nav style={navStyle}>
        {isMobile && !isSidebarCollapsed && (
          <button style={styles.mobileCloseBtn} onClick={onToggle}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        )}

        <div style={styles.mainNav}>
          <div style={styles.menuContainer}>
            <ul style={styles.globalMenu}>
              <NavItem
                isActive={activePath === "/users"}
                isCollapsed={isSidebarCollapsed && !isMobile}
                onClick={() => onLinkClick("/users")}
                icon="fa-solid fa-user-shield"
              >
                Usuários
              </NavItem>
              <NavItem
                isActive={activePath === "/extract-data"}
                isCollapsed={isSidebarCollapsed && !isMobile}
                onClick={() => onLinkClick("/extract-data")}
                icon="fa-solid fa-file-export"
              >
                Extrair dados
              </NavItem>
            </ul>
            <div style={styles.menuDivider}></div>
            <ul style={styles.contextMenu}>
              {getMenu().map((item) => (
                <NavItem
                  key={item.path}
                  isActive={activePath === item.path}
                  isCollapsed={isSidebarCollapsed && !isMobile}
                  onClick={() => onLinkClick(item.path)}
                  icon={item.icon}
                >
                  {item.name}
                </NavItem>
              ))}
            </ul>
          </div>
        </div>

        <footer style={styles.footer}>
          <div
            style={userProfileStyle}
            onClick={() => onLinkClick("/profile")}
            onMouseEnter={() => setIsUserHovered(true)}
            onMouseLeave={() => setIsUserHovered(false)}
          >
            <div style={styles.userAvatar}>MU</div>
            <div
              style={{
                ...styles.userInfo,
                ...(isSidebarCollapsed &&
                  !isMobile &&
                  styles.userInfoCollapsed),
              }}
            >
              <span style={styles.userNameText}>Manual</span>
              <span style={styles.userRoleText}>Admin</span>
            </div>
          </div>
          <ul style={styles.globalMenu}>
            <NavItem
              isCollapsed={isSidebarCollapsed && !isMobile}
              onClick={logout}
              icon="fa-solid fa-right-from-bracket"
              hoverStyle={styles.navItemLogoutHover}
            >
              Sair
            </NavItem>
          </ul>
        </footer>
      </nav>
    </>
  );
}

export default Sidebar;
