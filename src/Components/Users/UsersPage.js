import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import styles from "./UsersPageStyle";
import { useAuth } from "../../Context/AuthContext";
import adminServices from "../../dbServices/adminService";

// --- MAPA DE PERMISSÕES (IMPORTANTE) ---
// O Swagger pede Array de Inteiros [0], mas o front usa Strings.
// Mapeie aqui o ID real do seu banco de dados para cada string.
const permissionMap = {
  "Editar/Autorizar/Criar Contratos": 1,
  "Acessar Contratos": 2,
  "Criar/Editar/Autorizar Saques": 3,
  "Ver Saques": 4,
  "Antecipar Saldo": 5,
  "Criar/Editar Cliente": 6,
  "Acessar Controlador": 7,
  "Extrair Dados": 8,
  "Criar/Excluir Notícias": 9,
  "Gerenciar Consultores": 10,
  Indicação: 11,
  "Gerenciar Mensagens": 12,
  "Ver Acessos": 13,
  "Gerenciar Produto": 14,
  "Gerenciar Promoções": 15,
  "Gerenciar Clientes": 16,
  "Gerenciar Pedidos": 17,
  "Criar Usuários (Admin)": 18,
};

const allPermissions = {
  contracts: [
    "Editar/Autorizar/Criar Contratos",
    "Acessar Contratos",
    "Criar/Editar/Autorizar Saques",
    "Ver Saques",
    "Antecipar Saldo",
    "Criar/Editar Cliente",
    "Acessar Controlador",
    "Extrair Dados",
    "Criar/Excluir Notícias",
    "Gerenciar Consultores",
    "Indicação",
    "Gerenciar Mensagens",
    "Ver Acessos",
  ],
  ecommerce: [
    "Gerenciar Produto",
    "Gerenciar Promoções",
    "Gerenciar Clientes",
    "Gerenciar Pedidos",
  ],
  system: ["Criar Usuários (Admin)"],
};

const GlobalStyles = () => (
  <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }
        @keyframes scaleUp { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes scaleDown { from { transform: scale(1); opacity: 1; } to { transform: scale(0.95); opacity: 0; } }
    `}</style>
);

// --- MODAL DE DETALHES (Mantido igual) ---
const UserDetailsModal = ({ user, onClose, isClosing }) =>
  ReactDOM.createPortal(
    <div
      style={{
        ...styles.modalBackdrop,
        ...(isClosing && styles.modalBackdropClosing),
      }}
    >
      <GlobalStyles />
      <div
        style={{
          ...styles.modalContent,
          ...(isClosing && styles.modalContentClosing),
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={styles.modalHeader}>
          <h3 style={styles.modalHeaderH3}>Detalhes do Usuário</h3>
          <button style={styles.modalHeaderButton} onClick={onClose}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div style={styles.userDetailsGrid}>
          <p style={styles.userDetailsP}>
            <span style={styles.userDetailsPSpan}>Nome:</span> {user.name}
          </p>
          <p style={styles.userDetailsP}>
            <span style={styles.userDetailsPSpan}>Email:</span> {user.email}
          </p>
          <p style={styles.userDetailsP}>
            <span style={styles.userDetailsPSpan}>Celular:</span>{" "}
            {user.phone || "Não informado"}
          </p>
          <p style={styles.userDetailsP}>
            <span style={styles.userDetailsPSpan}>Cargo:</span>{" "}
            {user.role || "Não informado"}
          </p>
        </div>
        <div style={styles.permissionsDisplay}>
          <div style={styles.permissionGroup}>
            <h4 style={styles.permissionGroupH4}>IDs de Permissão</h4>
            <div style={styles.tags}>
              {user.permissionIds && user.permissionIds.length > 0 ? (
                user.permissionIds.map((id) => (
                  <span key={id} style={styles.tagSpan}>
                    {id}
                  </span>
                ))
              ) : (
                <span
                  style={{
                    ...styles.tagSpan,
                    backgroundColor: "#e2e8f0",
                    color: "#64748b",
                  }}
                >
                  Nenhuma permissão atribuída
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );

// --- MODAL DE CRIAÇÃO (Atualizado com Lógica API) ---
const CreateUserModal = ({ onClose, isClosing, onSuccess }) => {
  const [selectedPermissions, setSelectedPermissions] = useState(new Set());
  const [loading, setLoading] = useState(false);

  // State para o formulário
  const [formData, setFormData] = useState({
    name: "",
    cpf: "", // Nota: API Swagger não pede CPF explicitamente no JSON, verifique se deve ir no "role" ou concatenado
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const togglePermission = (permission) => {
    setSelectedPermissions((prev) => {
      const newSelection = new Set(prev);
      if (newSelection.has(permission)) newSelection.delete(permission);
      else newSelection.add(permission);
      return newSelection;
    });
  };

  const handleCreate = async () => {
    // Validações básicas
    if (!formData.name || !formData.email || !formData.password) {
      alert("Por favor, preencha os campos obrigatórios.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      alert("As senhas não coincidem.");
      return;
    }

    setLoading(true);

    try {
      // Converter Set de nomes para Array de IDs usando o permissionMap
      const permissionIds = Array.from(selectedPermissions)
        .map((name) => permissionMap[name])
        .filter((id) => id !== undefined); // Remove undefined se o nome não estiver no mapa

      // Montar payload conforme Swagger
      const payload = {
        id: 0,
        name: formData.name,
        nameNormalized: formData.name.toUpperCase(), // Backend geralmente espera isso ou gera sozinho
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        role: "Admin", // Definindo um padrão, ou você pode adicionar um select no form
        status: 1, // 1 = Ativo
        permissionIds: permissionIds,
        refreshToken: "", // Campos opcionais/gerados pelo back
        dateCreated: new Date().toISOString(),
      };

      await adminServices.createAdmin(payload);

      alert("Usuário criado com sucesso!");
      onSuccess(); // Atualiza a lista no componente pai
      onClose(); // Fecha modal
    } catch (error) {
      console.error(error);
      alert("Erro ao criar usuário. Verifique o console.");
    } finally {
      setLoading(false);
    }
  };

  return ReactDOM.createPortal(
    <div
      style={{
        ...styles.modalBackdrop,
        ...(isClosing && styles.modalBackdropClosing),
      }}
    >
      <GlobalStyles />
      <div
        style={{
          ...styles.modalContent,
          ...styles.modalContentLarge,
          ...(isClosing && styles.modalContentClosing),
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={styles.modalHeader}>
          <h3 style={styles.modalHeaderH3}>Informações Novo Usuário</h3>
        </div>
        <div style={styles.createUserGrid}>
          {/* Coluna do Formulário */}
          <div style={styles.formColumn}>
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Nome</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                type="text"
                style={styles.formInput}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>CPF</label>
              <input
                name="cpf"
                value={formData.cpf}
                onChange={handleChange}
                type="text"
                style={styles.formInput}
                placeholder="Opcional / Uso Interno"
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Contato</label>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                type="text"
                style={styles.formInput}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Email</label>
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
                style={styles.formInput}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Senha</label>
              <input
                name="password"
                value={formData.password}
                onChange={handleChange}
                type="password"
                style={styles.formInput}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Confirme a Senha</label>
              <input
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                type="password"
                style={styles.formInput}
              />
            </div>
          </div>

          {/* Coluna de Seleção de Permissões */}
          <div style={styles.permissionsColumn}>
            <h4 style={styles.permissionsColumnH4}>Permissões Disponíveis</h4>
            {Object.entries(allPermissions).map(([key, groupPerms]) => (
              <div key={key} style={styles.permissionGroup}>
                <h5 style={styles.permissionGroupH5}>
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </h5>
                <div style={styles.permissionButtons}>
                  {groupPerms
                    .filter((p) => !selectedPermissions.has(p))
                    .map((p) => (
                      <button
                        key={p}
                        style={styles.permissionButton}
                        onClick={() => togglePermission(p)}
                      >
                        {p}
                      </button>
                    ))}
                </div>
              </div>
            ))}
          </div>

          {/* Coluna de Permissões Selecionadas */}
          <div
            style={{
              ...styles.permissionsColumn,
              ...styles.permissionsColumnSelected,
            }}
          >
            <h4 style={styles.permissionsColumnH4}>Permissões Adicionadas</h4>
            {/* AQUI ESTÁ A CORREÇÃO VISUAL APLICADA: styles.selectedPermissionsList */}
            <div style={styles.selectedPermissionsList}>
              {Array.from(selectedPermissions).length === 0 && (
                <p style={styles.emptyState}>
                  Clique em uma permissão para adicioná-la aqui.
                </p>
              )}
              {Array.from(selectedPermissions).map((p) => (
                <button
                  key={p}
                  style={{
                    ...styles.permissionButton,
                    ...styles.permissionButtonSelected,
                  }}
                  onClick={() => togglePermission(p)}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div style={styles.modalFooter}>
          <button style={styles.cancelBtn} onClick={onClose} disabled={loading}>
            Cancelar
          </button>
          <button
            style={styles.createBtn}
            onClick={handleCreate}
            disabled={loading}
          >
            {loading ? "Criando..." : "Criar"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modal, setModal] = useState({ type: null, data: null });
  const [isClosing, setIsClosing] = useState(false);
  const [hoveredRow, setHoveredRow] = useState(null);
  const { token } = useAuth();

  const fetchUsers = async () => {
    if (!token) return;
    try {
      setIsLoading(true);
      const data = await adminServices.getAllAdmins();
      setUsers(data);
    } catch (err) {
      setError("Não foi possível carregar os usuários.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [token]);

  const handleOpenModal = (type, data = null) => {
    setModal({ type, data });
  };

  const handleCloseModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setModal({ type: null, data: null });
      setIsClosing(false);
    }, 300);
  };

  const renderTableContent = () => {
    if (isLoading)
      return (
        <tr>
          <td colSpan="4" style={{ textAlign: "center", padding: "20px" }}>
            Carregando usuários...
          </td>
        </tr>
      );
    if (error)
      return (
        <tr>
          <td
            colSpan="4"
            style={{ textAlign: "center", padding: "20px", color: "red" }}
          >
            {error}
          </td>
        </tr>
      );
    if (users.length === 0)
      return (
        <tr>
          <td colSpan="4" style={{ textAlign: "center", padding: "20px" }}>
            Nenhum usuário encontrado.
          </td>
        </tr>
      );

    return users.map((user) => (
      <tr
        key={user.id}
        onMouseEnter={() => setHoveredRow(user.id)}
        onMouseLeave={() => setHoveredRow(null)}
        style={{
          ...styles.tableRow,
          ...(hoveredRow === user.id && styles.tableRowHover),
        }}
      >
        <td style={styles.tableCell}>{user.name}</td>
        <td style={styles.tableCell}>{user.email}</td>
        <td style={styles.tableCell}>{user.phone || "N/A"}</td>
        <td style={styles.tableCell}>
          <button
            style={styles.optionsBtn}
            onClick={() => handleOpenModal("details", user)}
          >
            <i className="fa-solid fa-eye"></i>
          </button>
        </td>
      </tr>
    ));
  };

  return (
    <div style={styles.usersPageContainer}>
      <header style={styles.usersPageHeader}>
        <h1 style={styles.headerH1}>Usuários do Sistema</h1>
        <button
          style={styles.addUserButton}
          onClick={() => handleOpenModal("create")}
        >
          <i className="fa-solid fa-plus"></i> Adicionar Usuário
        </button>
      </header>
      <div style={styles.searchBox}>
        <input
          type="text"
          placeholder="Pesquisar por nome ou cargo..."
          style={styles.searchInput}
        />
      </div>
      <div style={styles.usersTableCard}>
        <table style={styles.usersTable}>
          <thead>
            <tr>
              <th style={{ ...styles.tableCell, ...styles.tableHeader }}>
                Nome
              </th>
              <th style={{ ...styles.tableCell, ...styles.tableHeader }}>
                E-mail
              </th>
              <th style={{ ...styles.tableCell, ...styles.tableHeader }}>
                Celular
              </th>
              <th style={{ ...styles.tableCell, ...styles.tableHeader }}>
                Opções
              </th>
            </tr>
          </thead>
          <tbody>{renderTableContent()}</tbody>
        </table>
      </div>
      {modal.type === "details" && (
        <UserDetailsModal
          user={modal.data}
          onClose={handleCloseModal}
          isClosing={isClosing}
        />
      )}
      {modal.type === "create" && (
        <CreateUserModal
          onClose={handleCloseModal}
          isClosing={isClosing}
          onSuccess={() => {
            fetchUsers(); // Recarrega a tabela após criar
          }}
        />
      )}
    </div>
  );
}

export default UsersPage;
