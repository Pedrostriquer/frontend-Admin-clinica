import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import blogGemCapitalSubscriberService from "../../../../dbServices/blogGemCapitalSubscriberService";
import styles from "./SubscriberDetailPageStyle";

const SubscriberDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [subscriber, setSubscriber] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editData, setEditData] = useState({ status: 1, notes: "" });

  useEffect(() => {
    fetchSubscriber();
  }, [id]);

  const fetchSubscriber = async () => {
    try {
      setLoading(true);
      const data = await blogGemCapitalSubscriberService.getSubscriberById(id);
      setSubscriber(data);

      // Converte o status string vindo do backend para o número do Enum
      const statusMap = {
        "Active": 1,
        "Paused": 2,
        "Cancelled": 3
      };

      // Se data.status já for número, usa ele. Se for string, usa o mapa.
      const statusValue = typeof data.status === "string" 
        ? (statusMap[data.status] || 1) 
        : data.status;

      setEditData({
        status: statusValue,
        notes: data.notes || "",
      });
    } catch (error) {
      console.error("Erro ao buscar detalhes:", error);
      alert("Assinante não encontrado.");
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      // Garante que estamos enviando um número inteiro para o backend
      await blogGemCapitalSubscriberService.updateSubscriber(id, {
        status: parseInt(editData.status),
        notes: editData.notes,
      });
      alert("Dados atualizados com sucesso!");
      fetchSubscriber();
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Erro ao atualizar dados.");
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("pt-BR");
  };

  if (loading)
    return <div style={styles.loading}>Carregando perfil do assinante...</div>;

  return (
    <div style={styles.pageContainer}>
      <div style={styles.header}>
        <button onClick={() => navigate(-1)} style={styles.backButton}>
          ← Voltar
        </button>
        <h1 style={styles.title}>Perfil do Assinante</h1>
      </div>

      <div style={styles.contentGrid}>
        <div style={styles.infoCard}>
          <h3 style={styles.cardTitle}>Dados Pessoais</h3>
          <div style={styles.infoRow}>
            <span style={styles.label}>Nome:</span>
            <span style={styles.value}>{subscriber.name}</span>
          </div>
          <div style={styles.infoRow}>
            <span style={styles.label}>Email:</span>
            <span style={styles.value}>{subscriber.email}</span>
          </div>
          <div style={styles.infoRow}>
            <span style={styles.label}>Telefone:</span>
            <span style={styles.value}>
              {subscriber.phone || "Não informado"}
            </span>
          </div>
          <div style={styles.infoRow}>
            <span style={styles.label}>Nascimento:</span>
            <span style={styles.value}>
              {subscriber.dateOfBirth ? new Date(subscriber.dateOfBirth).toLocaleDateString("pt-BR") : "-"}
            </span>
          </div>
          <div style={styles.infoRow}>
            <span style={styles.label}>Inscrito em:</span>
            <span style={styles.value}>{formatDate(subscriber.createdAt)}</span>
          </div>
        </div>

        <div style={styles.infoCard}>
          <h3 style={styles.cardTitle}>Pesquisa de Inscrição</h3>
          <div style={styles.infoRowVertical}>
            <span style={styles.label}>Como nos conheceu?</span>
            <p style={styles.textValue}>
              {subscriber.howDidYouKnowAboutUs || "Não respondeu"}
            </p>
          </div>
          <div style={styles.infoRowVertical}>
            <span style={styles.label}>Motivo da Assinatura:</span>
            <p style={styles.textValue}>
              {subscriber.reasonForSubscription || "Não respondeu"}
            </p>
          </div>
        </div>

        <div style={styles.editCard}>
          <h3 style={styles.cardTitle}>Gestão Administrativa</h3>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Status da Assinatura</label>
            <select
              value={editData.status}
              onChange={(e) =>
                setEditData({ ...editData, status: parseInt(e.target.value) })
              }
              style={styles.select}
            >
              <option value={1}>Ativo</option>
              <option value={2}>Pausado</option>
              <option value={3}>Cancelado</option>
            </select>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Anotações Internas</label>
            <textarea
              value={editData.notes}
              onChange={(e) =>
                setEditData({ ...editData, notes: e.target.value })
              }
              style={styles.textarea}
              placeholder="Adicione observações sobre este assinante..."
            />
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            style={{ ...styles.saveButton, opacity: saving ? 0.7 : 1 }}
          >
            {saving ? "Salvando..." : "Salvar Alterações"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubscriberDetailPage;