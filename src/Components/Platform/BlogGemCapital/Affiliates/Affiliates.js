import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AffiliatesStyle";
import affiliateService from "../../../../dbServices/affiliatesService";
import {
  Users,
  CheckCircle,
  Clock,
  MessageCircle,
  Trash2,
  Filter,
  ChevronLeft,
  ChevronRight,
  Circle,
  Eye,
} from "lucide-react";

const Affiliates = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [affiliates, setAffiliates] = useState([]);
  const [stats, setStats] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [isContacted, setIsContacted] = useState("");
  const [hasCNPJ, setHasCNPJ] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true);
      const data = await affiliateService.searchAffiliates({
        searchTerm,
        isContacted: isContacted === "" ? null : isContacted === "true",
        hasCNPJ: hasCNPJ === "" ? null : hasCNPJ === "true",
        pageNumber: page,
        pageSize: pageSize,
        order: "desc",
      });

      setAffiliates(data.data || []);
      setTotalCount(data.totalCount || 0);

      const statistics = await affiliateService.getStatistics();
      setStats(statistics);
    } catch (error) {
      console.error("Erro ao carregar afiliados:", error);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, isContacted, hasCNPJ, page, pageSize]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchLeads();
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [fetchLeads]);

  const handleToggleContact = async (id, currentStatus, observations) => {
    try {
      await affiliateService.updateContactStatus(id, {
        isContacted: !currentStatus,
        observations: observations || "Contato realizado via painel Admin.",
      });
      fetchLeads();
    } catch (error) {
      alert("Erro ao atualizar status de contato.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Deseja realmente excluir este afiliado?")) {
      await affiliateService.deleteAffiliate(id);
      fetchLeads();
    }
  };

  const openWhatsApp = (phone, name) => {
    const cleanPhone = phone.replace(/\D/g, "");
    const msg = encodeURIComponent(
      `Olá ${name}, recebemos sua solicitação para o programa de afiliados GemCapital.`
    );
    window.open(`https://wa.me/55${cleanPhone}?text=${msg}`, "_blank");
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div style={styles.container}>
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={{ ...styles.statIcon, backgroundColor: "#eef2ff" }}>
            <Users color="#4f46e5" size={24} />
          </div>
          <div style={styles.statInfo}>
            <span style={styles.statValue}>{stats?.totalAffiliates || 0}</span>
            <span style={styles.statLabel}>Total de Candidatos</span>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statIcon, backgroundColor: "#ecfdf5" }}>
            <CheckCircle color="#10b981" size={24} />
          </div>
          <div style={styles.statInfo}>
            <span style={styles.statValue}>
              {stats?.affiliatesWithAgreement || 0}
            </span>
            <span style={styles.statLabel}>Contratos Aceitos</span>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statIcon, backgroundColor: "#fff7ed" }}>
            <Clock color="#f97316" size={24} />
          </div>
          <div style={styles.statInfo}>
            <span style={styles.statValue}>
              {(stats?.totalAffiliates || 0) -
                (stats?.affiliatesWithAgreement || 0)}
            </span>
            <span style={styles.statLabel}>Pendentes</span>
          </div>
        </div>
      </div>

      <div style={styles.filterSection}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "20px",
          }}
        >
          <Filter size={20} color="#374151" />
          <span style={styles.filterTitle}>Filtrar Afiliados</span>
        </div>
        <div style={styles.filterRow}>
          <div style={styles.filterGroup}>
            <label style={styles.label}>Buscar Nome ou Email</label>
            <input
              style={styles.input}
              placeholder="Ex: João Silva..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div style={styles.filterGroup}>
            <label style={styles.label}>Status de Contato</label>
            <select
              style={styles.select}
              value={isContacted}
              onChange={(e) => setIsContacted(e.target.value)}
            >
              <option value="">Todos</option>
              <option value="true">Contactados</option>
              <option value="false">Não Contactados</option>
            </select>
          </div>
          <div style={styles.filterGroup}>
            <label style={styles.label}>Possui CNPJ?</label>
            <select
              style={styles.select}
              value={hasCNPJ}
              onChange={(e) => setHasCNPJ(e.target.value)}
            >
              <option value="">Indiferente</option>
              <option value="true">Sim</option>
              <option value="false">Não</option>
            </select>
          </div>
          <button
            style={styles.clearButton}
            onClick={() => {
              setSearchTerm("");
              setIsContacted("");
              setHasCNPJ("");
              setPage(1);
            }}
          >
            Limpar
          </button>
        </div>
      </div>

      <div style={styles.tableContainer}>
        {loading ? (
          <div style={styles.loadingContainer}>
            <div style={styles.spinner}></div>
            <p style={{ color: "#6b7280", fontWeight: "500" }}>
              Carregando dados...
            </p>
          </div>
        ) : (
          <>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.tableHeader}>Nome / Email</th>
                  <th style={styles.tableHeader}>WhatsApp</th>
                  <th style={styles.tableHeader}>Localização</th>
                  <th style={styles.tableHeader}>CNPJ</th>
                  <th style={styles.tableHeader}>Status</th>
                  <th style={{ ...styles.tableHeader, textAlign: "right" }}>
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                {affiliates.map((item) => (
                  <tr key={item.id}>
                    <td style={styles.tableCell}>
                      <div style={{ fontWeight: "600" }}>{item.fullName}</div>
                      <div style={{ fontSize: "12px", color: "#6b7280" }}>
                        {item.email}
                      </div>
                    </td>
                    <td style={styles.tableCell}>{item.whatsApp}</td>
                    <td style={styles.tableCell}>
                      {item.city} - {item.state}
                    </td>
                    <td style={styles.tableCell}>
                      <span
                        style={{
                          ...styles.badge,
                          backgroundColor: item.hasActiveCNPJ
                            ? "#dcfce7"
                            : "#fee2e2",
                          color: item.hasActiveCNPJ ? "#166534" : "#991b1b",
                        }}
                      >
                        {item.hasActiveCNPJ ? "Sim" : "Não"}
                      </span>
                    </td>
                    <td style={styles.tableCell}>
                      <span
                        style={{
                          ...styles.badge,
                          backgroundColor: item.isContacted
                            ? "#e0f2fe"
                            : "#f3f4f6",
                          color: item.isContacted ? "#075985" : "#4b5563",
                        }}
                      >
                        {item.isContacted ? "Contactado" : "Pendente"}
                      </span>
                    </td>
                    <td style={{ ...styles.tableCell, textAlign: "right" }}>
                      <div style={styles.actionButtons}>
                        <button
                          onClick={() =>
                            navigate(
                              `/platform/blog-gemcapital/affiliates/${item.id}`
                            )
                          }
                          title="Ver detalhes"
                          style={{
                            border: "none",
                            background: "none",
                            cursor: "pointer",
                            color: "#6366f1",
                          }}
                        >
                          <Eye size={20} />
                        </button>
                        <button
                          onClick={() =>
                            openWhatsApp(item.whatsApp, item.fullName)
                          }
                          title="Falar no WhatsApp"
                          style={{
                            border: "none",
                            background: "none",
                            cursor: "pointer",
                            color: "#22c55e",
                          }}
                        >
                          <MessageCircle size={20} />
                        </button>
                        <button
                          onClick={() =>
                            handleToggleContact(
                              item.id,
                              item.isContacted,
                              item.observations
                            )
                          }
                          title={
                            item.isContacted
                              ? "Desmarcar contato"
                              : "Marcar como contactado"
                          }
                          style={{
                            border: "none",
                            background: "none",
                            cursor: "pointer",
                            color: item.isContacted ? "#10b981" : "#94a3b8",
                          }}
                        >
                          {item.isContacted ? (
                            <CheckCircle size={20} />
                          ) : (
                            <Circle size={20} />
                          )}
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          title="Excluir"
                          style={{
                            border: "none",
                            background: "none",
                            cursor: "pointer",
                            color: "#ef4444",
                          }}
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={styles.pagination}>
              <span style={{ fontSize: "14px", color: "#6b7280" }}>
                Página <b>{page}</b> de <b>{totalPages || 1}</b> ({totalCount}{" "}
                registros)
              </span>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  style={{
                    ...styles.clearButton,
                    padding: "5px 10px",
                    opacity: page === 1 ? 0.5 : 1,
                    cursor: page === 1 ? "not-allowed" : "pointer",
                  }}
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  style={{
                    ...styles.clearButton,
                    padding: "5px 10px",
                    opacity: page >= totalPages ? 0.5 : 1,
                    cursor: page >= totalPages ? "not-allowed" : "pointer",
                  }}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Affiliates;
