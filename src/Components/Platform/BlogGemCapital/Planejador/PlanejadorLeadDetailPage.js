import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MessageCircle,
  CheckCircle,
  Circle,
  Save,
  Trash2,
  Mail,
  Phone,
  User,
  Calendar,
  DollarSign,
  AlertCircle,
} from "lucide-react";
import QualitySelector from "./QualitySelector";

const PlanejadorLeadDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState(null);
  const [observations, setObservations] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [changed, setChanged] = useState(false);

  const PLANEJADOR_TYPES = {
    GOAL_DEFINITION: "Definição de Meta",
    SET_DEADLINE: "Definir Prazo",
    CALCULATE_INCOME: "Calcular Renda",
  };

  const styles = {
    container: {
      maxWidth: "900px",
      margin: "0 auto",
      padding: "100px 24px 24px 24px",
    },
    header: {
      display: "flex",
      alignItems: "center",
      gap: "16px",
      marginBottom: "32px",
    },
    backButton: {
      background: "none",
      border: "none",
      cursor: "pointer",
      color: "#6366f1",
      padding: "8px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "8px",
      transition: "all 0.3s ease",
    },
    title: {
      fontSize: "28px",
      fontWeight: "800",
      color: "#0f172a",
      margin: 0,
    },
    card: {
      backgroundColor: "#ffffff",
      border: "1.5px solid #e2e8f0",
      borderRadius: "12px",
      padding: "28px",
      marginBottom: "24px",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
    },
    sectionTitle: {
      fontSize: "16px",
      fontWeight: "700",
      color: "#0f172a",
      marginBottom: "20px",
      marginTop: 0,
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(2, 1fr)",
      gap: "20px",
      marginBottom: "24px",
    },
    field: {
      display: "flex",
      flexDirection: "column",
      gap: "8px",
    },
    label: {
      fontSize: "13px",
      fontWeight: "600",
      color: "#64748b",
      textTransform: "uppercase",
      letterSpacing: "0.3px",
    },
    value: {
      fontSize: "15px",
      fontWeight: "500",
      color: "#1f2937",
    },
    fieldRow: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      marginBottom: "16px",
    },
    fieldRowValue: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      fontSize: "15px",
      color: "#1f2937",
    },
    textarea: {
      padding: "12px",
      border: "1.5px solid #e2e8f0",
      borderRadius: "8px",
      fontSize: "14px",
      fontFamily: "inherit",
      minHeight: "120px",
      resize: "vertical",
      transition: "all 0.3s ease",
    },
    button: {
      padding: "10px 16px",
      backgroundColor: "#6366f1",
      color: "#ffffff",
      border: "none",
      borderRadius: "8px",
      fontSize: "14px",
      fontWeight: "600",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      transition: "all 0.3s ease",
    },
    buttonSecondary: {
      padding: "10px 16px",
      backgroundColor: "#10b981",
      color: "#ffffff",
      border: "none",
      borderRadius: "8px",
      fontSize: "14px",
      fontWeight: "600",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      transition: "all 0.3s ease",
    },
    buttonDanger: {
      padding: "10px 16px",
      backgroundColor: "#ef4444",
      color: "#ffffff",
      border: "none",
      borderRadius: "8px",
      fontSize: "14px",
      fontWeight: "600",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      transition: "all 0.3s ease",
    },
    buttonGroup: {
      display: "flex",
      gap: "12px",
      flexWrap: "wrap",
    },
    status: {
      display: "inline-flex",
      alignItems: "center",
      gap: "8px",
      padding: "6px 12px",
      borderRadius: "6px",
      fontSize: "13px",
      fontWeight: "600",
    },
    statusContacted: {
      backgroundColor: "#10b98115",
      color: "#10b981",
    },
    statusPending: {
      backgroundColor: "#ef444415",
      color: "#ef4444",
    },
    icon: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
  };

  useEffect(() => {
    fetchLead();
  }, [id]);

  const fetchLead = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:5097/api/PlanejadorLeads/${id}`
      );
      if (!response.ok) throw new Error("Lead não encontrado");
      const data = await response.json();
      setLead(data);
      setObservations(data.adminObservations || "");
    } catch (error) {
      console.error("Erro ao buscar lead:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveObservations = async () => {
    try {
      setSaving(true);
      const response = await fetch(
        `http://localhost:5097/api/PlanejadorLeads/${id}/observacoes`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ observations }),
        }
      );

      if (!response.ok) throw new Error("Erro ao salvar observações");
      setChanged(false);
      alert("Observações salvas com sucesso!");
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao salvar observações");
    } finally {
      setSaving(false);
    }
  };

  const handleMarkAsContacted = async () => {
    try {
      const response = await fetch(
        `http://localhost:5097/api/PlanejadorLeads/${id}/marcar-contactado`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Erro ao atualizar status");
      setLead({ ...lead, contacted: !lead.contacted });
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao atualizar status");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Tem certeza que deseja excluir este lead?")) return;

    try {
      setDeleting(true);
      const response = await fetch(
        `http://localhost:5097/api/PlanejadorLeads/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error("Erro ao excluir lead");
      alert("Lead excluído com sucesso!");
      navigate("/platform/blog-gemcapital/planejador");
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao excluir lead");
    } finally {
      setDeleting(false);
    }
  };

  const handleSaveQuality = async (quality) => {
    try {
      const response = await fetch(
        `http://localhost:5097/api/PlanejadorLeads/${id}/qualidade`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            leadQuality: quality,
          }),
        }
      );

      if (!response.ok) throw new Error("Erro ao salvar qualidade");
      setLead({ ...lead, leadQuality: quality });
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao salvar qualidade do lead");
    }
  };

  const handleWhatsApp = () => {
    if (lead?.phone) {
      const phoneNumber = lead.phone.replace(/\D/g, "");
      const message = `Olá ${lead.name}, gostaria de conversar sobre o seu planejamento financeiro.`;
      const encodedMessage = encodeURIComponent(message);
      window.open(
        `https://wa.me/${phoneNumber}?text=${encodedMessage}`,
        "_blank"
      );
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={{ textAlign: "center", padding: "48px" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              border: "4px solid #f1f5f9",
              borderTop: "4px solid #6366f1",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
              margin: "0 auto",
            }}
          ></div>
        </div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div style={styles.container}>
        <div style={{ textAlign: "center", padding: "48px" }}>
          <AlertCircle size={48} color="#ef4444" />
          <p style={{ color: "#ef4444", marginTop: "16px" }}>
            Lead não encontrado
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      {/* Header */}
      <div style={styles.header}>
        <button
          style={styles.backButton}
          onClick={() => navigate("/platform/blog-gemcapital/planejador")}
          title="Voltar"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 style={styles.title}>{lead.name}</h1>
          <div style={{ marginTop: "8px" }}>
            <span
              style={{
                ...styles.status,
                ...(lead.contacted
                  ? styles.statusContacted
                  : styles.statusPending),
              }}
            >
              {lead.contacted ? (
                <>
                  <CheckCircle size={14} />
                  Contactado
                </>
              ) : (
                <>
                  <Circle size={14} />
                  Pendente de Contato
                </>
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Informações Gerais */}
      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>Informações Gerais</h2>
        <div style={styles.grid}>
          <div style={styles.field}>
            <span style={styles.label}>Nome</span>
            <span style={styles.value}>{lead.name}</span>
          </div>
          <div style={styles.field}>
            <span style={styles.label}>Email</span>
            <span style={styles.value}>{lead.email}</span>
          </div>
          <div style={styles.field}>
            <span style={styles.label}>Telefone</span>
            <span style={styles.value}>{lead.phone}</span>
          </div>
          <div style={styles.field}>
            <span style={styles.label}>Tipo de Planejador</span>
            <span style={styles.value}>
              {PLANEJADOR_TYPES[lead.planejadorType] || lead.planejadorType}
            </span>
          </div>
          <div style={styles.field}>
            <span style={styles.label}>Capital Inicial</span>
            <span style={styles.value}>
              R$ {lead.initialCapital?.toLocaleString("pt-BR") || "0,00"}
            </span>
          </div>
          <div style={styles.field}>
            <span style={styles.label}>Valor Alvo</span>
            <span style={styles.value}>
              R$ {lead.targetValue?.toLocaleString("pt-BR") || "0,00"}
            </span>
          </div>
          <div style={styles.field}>
            <span style={styles.label}>Período (meses)</span>
            <span style={styles.value}>{lead.periodMonths || "0"}</span>
          </div>
          <div style={styles.field}>
            <span style={styles.label}>Data de Criação</span>
            <span style={styles.value}>
              {new Date(lead.createdAt).toLocaleDateString("pt-BR")}
            </span>
          </div>
        </div>
      </div>

      {/* Qualidade do Lead */}
      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>Qualidade do Lead</h2>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <span
              style={{
                fontSize: "13px",
                fontWeight: "600",
                color: "#64748b",
                textTransform: "uppercase",
                letterSpacing: "0.3px",
              }}
            >
              Classificação
            </span>
            <QualitySelector
              value={lead.leadQuality || 0}
              onChange={handleSaveQuality}
            />
          </div>
        </div>
      </div>

      {/* Observações */}
      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>Observações do Administrador</h2>
        <textarea
          style={styles.textarea}
          value={observations}
          onChange={(e) => {
            setObservations(e.target.value);
            setChanged(true);
          }}
          placeholder="Adicione suas observações sobre este lead..."
        />
        {changed && (
          <p
            style={{
              fontSize: "13px",
              color: "#f59e0b",
              marginTop: "8px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <AlertCircle size={14} />
            Você tem alterações não salvas
          </p>
        )}
        <button
          style={{ ...styles.button, marginTop: "16px" }}
          onClick={handleSaveObservations}
          disabled={saving || !changed}
        >
          <Save size={16} />
          {saving ? "Salvando..." : "Salvar Observações"}
        </button>
      </div>

      {/* Ações */}
      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>Ações</h2>
        <div style={styles.buttonGroup}>
          <button
            style={styles.buttonSecondary}
            onClick={handleWhatsApp}
            title="Enviar mensagem no WhatsApp"
          >
            <MessageCircle size={16} />
            WhatsApp
          </button>
          <button
            style={styles.buttonSecondary}
            onClick={() => window.open(`mailto:${lead.email}`)}
            title="Enviar email"
          >
            <Mail size={16} />
            Email
          </button>
          <button
            style={styles.buttonSecondary}
            onClick={handleMarkAsContacted}
            title={
              lead.contacted
                ? "Marcar como não contactado"
                : "Marcar como contactado"
            }
          >
            {lead.contacted ? (
              <>
                <Circle size={16} />
                Desmarcar como Contactado
              </>
            ) : (
              <>
                <CheckCircle size={16} />
                Marcar como Contactado
              </>
            )}
          </button>
          <button
            style={styles.buttonDanger}
            onClick={handleDelete}
            disabled={deleting}
            title="Excluir este lead"
          >
            <Trash2 size={16} />
            {deleting ? "Excluindo..." : "Excluir"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlanejadorLeadDetailPage;
