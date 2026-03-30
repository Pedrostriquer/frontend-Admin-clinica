import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Save,
  MessageCircle,
  FileCheck,
  UserCheck,
  History,
} from "lucide-react";
import styles from "./AffiliateDetailPageStyle";
import affiliateService from "../../../../dbServices/affiliatesService";

const AffiliateDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [affiliate, setAffiliate] = useState(null);
  const [observations, setObservations] = useState("");
  const [isSavingObs, setIsSavingObs] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  useEffect(() => {
    fetchAffiliateDetails();
  }, [id]);

  const fetchAffiliateDetails = async () => {
    try {
      setLoading(true);
      const data = await affiliateService.getAffiliateById(id);
      setAffiliate(data);
      setObservations(data.observations || "");
    } catch (error) {
      console.error("Erro ao buscar detalhes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleContactStatus = async () => {
    try {
      setIsUpdatingStatus(true);
      const newStatus = !affiliate.isContacted;
      await affiliateService.updateContactStatus(id, {
        isContacted: newStatus,
        observations: observations, // Mantém as observações atuais
      });
      await fetchAffiliateDetails();
    } catch (error) {
      alert("Erro ao atualizar status de contato.");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleSaveObservations = async () => {
    try {
      setIsSavingObs(true);
      await affiliateService.updateContactStatus(id, {
        isContacted: affiliate.isContacted, // Mantém o status atual
        observations: observations,
      });
      alert("Observações salvas com sucesso!");
    } catch (error) {
      alert("Erro ao salvar observações.");
    } finally {
      setIsSavingObs(false);
    }
  };

  const openWhatsApp = () => {
    const phone = affiliate.whatsApp.replace(/\D/g, "");
    window.open(`https://wa.me/55${phone}`, "_blank");
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) return <div style={styles.loading}>Carregando perfil...</div>;
  if (!affiliate)
    return <div style={styles.error}>Afiliado não encontrado.</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button onClick={() => navigate(-1)} style={styles.backButton}>
          <ArrowLeft size={20} /> Voltar
        </button>
        <div style={styles.headerActions}>
          <button onClick={openWhatsApp} style={styles.whatsappButton}>
            <MessageCircle size={18} /> WhatsApp
          </button>
        </div>
      </div>

      <div style={styles.contentGrid}>
        <div style={styles.column}>
          {/* Card de Perfil */}
          <div style={styles.card}>
            <div style={styles.profileHeader}>
              <div style={styles.avatar}>
                {affiliate.fullName.charAt(0).toUpperCase()}
              </div>
              <h2 style={styles.name}>{affiliate.fullName}</h2>
              <div style={styles.idBadge}>ID: #{affiliate.id}</div>
            </div>

            <div style={styles.infoList}>
              <div style={styles.infoItem}>
                <Mail size={18} color="#64748b" />{" "}
                <span>{affiliate.email}</span>
              </div>
              <div style={styles.infoItem}>
                <Phone size={18} color="#64748b" />{" "}
                <span>{affiliate.whatsApp}</span>
              </div>
              <div style={styles.infoItem}>
                <MapPin size={18} color="#64748b" />{" "}
                <span>
                  {affiliate.city}/{affiliate.state}
                </span>
              </div>
              <div style={styles.infoItem}>
                <Calendar size={18} color="#64748b" />{" "}
                <span>Inscrito: {formatDate(affiliate.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* NOVO: Card de Controle de Status */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>
              <UserCheck size={18} /> Status de Atendimento
            </h3>
            <div style={styles.statusControlRow}>
              <div style={styles.statusInfoText}>
                <span style={styles.statusLabel}>Situação:</span>
                <span
                  style={{
                    ...styles.statusValue,
                    color: affiliate.isContacted ? "#10b981" : "#ef4444",
                  }}
                >
                  {affiliate.isContacted ? "CONCLUÍDO" : "PENDENTE"}
                </span>
              </div>
              <button
                onClick={handleToggleContactStatus}
                disabled={isUpdatingStatus}
                style={{
                  ...styles.toggleButton,
                  backgroundColor: affiliate.isContacted
                    ? "#fee2e2"
                    : "#dcfce7",
                  color: affiliate.isContacted ? "#991b1b" : "#166534",
                }}
              >
                {isUpdatingStatus
                  ? "..."
                  : affiliate.isContacted
                  ? "Desmarcar Contato"
                  : "Marcar como Contactado"}
              </button>
            </div>

            {affiliate.isContacted && (
              <div style={styles.contactDateBox}>
                <History size={14} />
                <span>Contactado em: {formatDate(affiliate.contactedAt)}</span>
              </div>
            )}
          </div>

          {/* NOVO: Card de Observações Independente */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Anotações do Admin</h3>
            <div style={styles.formGroup}>
              <textarea
                style={styles.textarea}
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
                placeholder="Escreva aqui detalhes sobre a conversa, perfil ou restrições..."
              />
            </div>
            <button
              onClick={handleSaveObservations}
              disabled={isSavingObs}
              style={styles.saveObsButton}
            >
              <Save size={18} />{" "}
              {isSavingObs ? "Salvando..." : "Salvar Anotações"}
            </button>
          </div>
        </div>

        {/* Coluna Direita: Dados Profissionais (Mantida) */}
        <div style={styles.column}>
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Perfil Profissional</h3>
            <div style={styles.dataGrid}>
              <div style={styles.dataItem}>
                <span style={styles.dataLayer}>Área de Atuação</span>
                <div style={styles.dataValue}>
                  <Briefcase size={16} /> {affiliate.workArea}
                </div>
              </div>
              <div style={styles.dataItem}>
                <span style={styles.dataLayer}>CNPJ Ativo</span>
                <div style={styles.dataValue}>
                  {affiliate.hasActiveCNPJ ? (
                    <CheckCircle2 size={16} color="#10b981" />
                  ) : (
                    <AlertCircle size={16} color="#ef4444" />
                  )}
                  {affiliate.hasActiveCNPJ ? "Sim" : "Não"}
                </div>
              </div>
              <div style={styles.dataItem}>
                <span style={styles.dataLayer}>Portfólio</span>
                <div style={styles.dataValue}>
                  {affiliate.clientPortfolio || "N/A"}
                </div>
              </div>
              <div style={styles.dataItem}>
                <span style={styles.dataLayer}>Origem</span>
                <div style={styles.dataValue}>{affiliate.howDidYouKnow}</div>
              </div>
            </div>
          </div>

          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Apresentação do Candidato</h3>
            <p style={styles.presentationText}>
              {affiliate.presentation || "Sem texto de apresentação."}
            </p>
          </div>

          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Termos e Aceites</h3>
            <div style={styles.checkItem}>
              <CheckCircle2
                size={20}
                color={affiliate.awarenessCheckbox ? "#10b981" : "#cbd5e1"}
              />
              <span>Ciente das regras do programa</span>
            </div>
            <div style={styles.checkItem}>
              <FileCheck
                size={20}
                color={affiliate.agreementCheckbox ? "#10b981" : "#cbd5e1"}
              />
              <span>Aceitou os termos de parceria</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AffiliateDetailPage;
