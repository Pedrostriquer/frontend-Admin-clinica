import React, { useState, useEffect } from "react";
import styles from "./AllQuizResponsesViewStyle";
import { FiEye, FiTrash2 } from "react-icons/fi";
import QuizResponseDetailsModal from "./QuizResponseDetailsModal";
import ConfirmModal from "./ConfirmModal";
import SuccessModal from "./SuccessModal";
import FilterPanel from "./FilterPanel";
import quizServices from "../../../../dbServices/quizServices";

const AllQuizResponsesView = ({ loading, onDeleteResponse }) => {
  const [paginatedData, setPaginatedData] = useState({
    data: [],
    totalCount: 0,
    page: 1,
    pageSize: 20,
    totalPages: 0,
  });
  const [stats, setStats] = useState({
    total: 0,
    contacted: 0,
    notContacted: 0,
  });
  const [selectedResponse, setSelectedResponse] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Estado de Filtros
  const [searchName, setSearchName] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Estado de Modais
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    responseId: null,
  });
  const [contactModal, setContactModal] = useState({
    isOpen: false,
    responseId: null,
  });
  const [successModal, setSuccessModal] = useState({
    isOpen: false,
    title: "",
    message: "",
  });

  // Buscar todas as respostas ao montar
  useEffect(() => {
    fetchAllResponses();
  }, []);

  // Buscar respostas quando filtros mudam
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchFilteredResponses();
    }, 300); // Debounce de 300ms

    return () => clearTimeout(delayDebounceFn);
  }, [searchName, statusFilter, sortOrder, dateFrom, dateTo, currentPage]);

  const fetchAllResponses = async () => {
    try {
      setIsLoading(true);
      const result = await quizServices.getAllResponsesFiltered({
        page: 1,
        pageSize: 20,
      });

      setPaginatedData(result);

      // Calcular estatísticas (sem filtros)
      const total = result.totalCount;
      // Para estatísticas, buscar sem filtro de status
      const contactedResult = await quizServices.getAllResponsesFiltered({
        status: "contacted",
        page: 1,
        pageSize: 1,
      });
      const contacted = contactedResult.totalCount;
      const notContacted = total - contacted;

      setStats({
        total,
        contacted,
        notContacted,
      });
    } catch (error) {
      console.error("Erro ao buscar respostas:", error);
      setSuccessModal({
        isOpen: true,
        title: "Erro",
        message: "Erro ao buscar respostas",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFilteredResponses = async () => {
    try {
      setIsLoading(true);
      const statusValue = statusFilter === "all" ? null : statusFilter;

      const result = await quizServices.getAllResponsesFiltered({
        searchName: searchName || null,
        status: statusValue,
        sortOrder,
        dateFrom: dateFrom || null,
        dateTo: dateTo || null,
        page: currentPage,
        pageSize: 20,
      });

      setPaginatedData(result);
    } catch (error) {
      console.error("Erro ao buscar respostas filtradas:", error);
      setSuccessModal({
        isOpen: true,
        title: "Erro",
        message: "Erro ao buscar respostas",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewResponse = async (response) => {
    try {
      setIsLoading(true);
      // Buscar detalhes completos com snapshots
      const fullResponse = await quizServices.getResponseDetails(response.id);
      setSelectedResponse(fullResponse);
      setShowDetailsModal(true);
    } catch (error) {
      console.error("Erro ao buscar detalhes:", error);
      setSuccessModal({
        isOpen: true,
        title: "Erro",
        message: "Erro ao carregar detalhes da resposta",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteResponse = (responseId) => {
    setDeleteModal({
      isOpen: true,
      responseId,
    });
  };

  const confirmDelete = async () => {
    try {
      await quizServices.deleteResponse(deleteModal.responseId);
      await fetchAllResponses();
      setDeleteModal({ isOpen: false, responseId: null });
      setSuccessModal({
        isOpen: true,
        title: "Sucesso!",
        message: "Resposta deletada com sucesso!",
      });
    } catch (error) {
      console.error("Erro:", error);
      setSuccessModal({
        isOpen: true,
        title: "Erro",
        message: "Erro ao deletar resposta",
      });
    }
  };

  const handleMarkAsContacted = (responseId) => {
    setContactModal({
      isOpen: true,
      responseId,
    });
  };

  const confirmMarkAsContacted = async () => {
    try {
      await quizServices.markAsContacted(contactModal.responseId);
      await fetchAllResponses();
      setContactModal({ isOpen: false, responseId: null });
      setSuccessModal({
        isOpen: true,
        title: "Sucesso!",
        message: "Marcado como contactado!",
      });
    } catch (error) {
      console.error("Erro:", error);
      setSuccessModal({
        isOpen: true,
        title: "Erro",
        message: "Erro ao marcar como contactado",
      });
    }
  };

  const handleClearFilters = () => {
    setSearchName("");
    setStatusFilter("all");
    setSortOrder("newest");
    setDateFrom("");
    setDateTo("");
    setCurrentPage(1);
  };

  return (
    <div style={styles.container}>
      {/* Header com Estatísticas */}
      <div style={styles.statsContainer}>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{stats.total}</div>
          <div style={styles.statLabel}>Total de Respostas</div>
        </div>
        <div style={{ ...styles.statCard, ...styles.statCardContacted }}>
          <div style={styles.statNumber}>{stats.contacted}</div>
          <div style={styles.statLabel}>Contactados</div>
        </div>
        <div style={{ ...styles.statCard, ...styles.statCardPending }}>
          <div style={styles.statNumber}>{stats.notContacted}</div>
          <div style={styles.statLabel}>Faltando Contactar</div>
        </div>
      </div>

      {/* Painel de Filtros */}
      <FilterPanel
        searchName={searchName}
        onSearchNameChange={setSearchName}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        sortOrder={sortOrder}
        onSortOrderChange={setSortOrder}
        dateFrom={dateFrom}
        onDateFromChange={setDateFrom}
        dateTo={dateTo}
        onDateToChange={setDateTo}
        onClearFilters={handleClearFilters}
      />

      {/* Tabela de Respostas */}
      {paginatedData.data.length > 0 ? (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Nome</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Telefone</th>
                <th style={styles.th}>Quiz</th>
                <th style={styles.th}>Perfil</th>
                <th style={styles.th}>Data Resposta</th>
                <th style={styles.th}>Contactado</th>
                <th style={styles.th}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.data.map((response) => (
                <tr key={response.id} style={styles.tr}>
                  <td style={styles.td}>{response.fullName}</td>
                  <td style={styles.td}>{response.email}</td>
                  <td style={styles.td}>{response.phone}</td>
                  <td style={styles.td}>Quiz ID: {response.quizId}</td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.badge,
                      backgroundColor: response.investorProfile ? "#e0f2fe" : "#f3f4f6",
                      color: response.investorProfile ? "#0369a1" : "#6b7280",
                    }}>
                      {response.investorProfile || "Não definido"}
                    </span>
                  </td>
                  <td style={styles.td}>
                    {new Date(response.respondedAt).toLocaleDateString("pt-BR")}
                  </td>
                  <td style={styles.td}>
                    <span
                      style={{
                        ...styles.badge,
                        ...(response.contacted
                          ? styles.badgeContacted
                          : styles.badgePending),
                      }}
                    >
                      {response.contacted ? "✓ Sim" : "✗ Não"}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <button
                      style={styles.actionButton}
                      onClick={() => handleViewResponse(response)}
                      title="Visualizar"
                    >
                      <FiEye size={16} />
                    </button>
                    {!response.contacted && (
                      <button
                        style={{
                          ...styles.actionButton,
                          ...styles.contactButton,
                        }}
                        onClick={() => handleMarkAsContacted(response.id)}
                        title="Marcar como contactado"
                      >
                        ✓
                      </button>
                    )}
                    <button
                      style={{ ...styles.actionButton, ...styles.deleteButton }}
                      onClick={() => handleDeleteResponse(response.id)}
                      title="Deletar"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Paginação */}
          <div style={{ marginTop: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: "12px", color: "#666" }}>
              Mostrando {paginatedData.data.length} de {paginatedData.totalCount} resultados
              {paginatedData.totalCount > 0 && (
                <span>
                  {" "} (Página {paginatedData.page} de {paginatedData.totalPages})
                </span>
              )}
            </div>

            <div style={{ display: "flex", gap: "8px" }}>
              <button
                style={{
                  ...styles.actionButton,
                  opacity: !paginatedData.hasPreviousPage ? 0.5 : 1,
                  cursor: paginatedData.hasPreviousPage ? "pointer" : "not-allowed",
                }}
                onClick={() => setCurrentPage(paginatedData.page - 1)}
                disabled={!paginatedData.hasPreviousPage}
                title="Página anterior"
              >
                ← Anterior
              </button>
              <button
                style={{
                  ...styles.actionButton,
                  opacity: !paginatedData.hasNextPage ? 0.5 : 1,
                  cursor: paginatedData.hasNextPage ? "pointer" : "not-allowed",
                }}
                onClick={() => setCurrentPage(paginatedData.page + 1)}
                disabled={!paginatedData.hasNextPage}
                title="Próxima página"
              >
                Próxima →
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>○</div>
          <h4 style={styles.emptyTitle}>
            {paginatedData.totalCount === 0 ? "Nenhuma resposta de quiz" : "Nenhum resultado encontrado"}
          </h4>
          <p style={styles.emptyText}>
            {paginatedData.totalCount === 0
              ? "Ainda não há respostas de leads para nenhum quiz"
              : "Tente ajustar os filtros de busca"}
          </p>
        </div>
      )}

      {/* Modal de Detalhes */}
      {showDetailsModal && selectedResponse && (
        <QuizResponseDetailsModal
          response={selectedResponse}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedResponse(null);
          }}
          onMarkAsContacted={() => {
            handleMarkAsContacted(selectedResponse.id);
            setShowDetailsModal(false);
          }}
        />
      )}

      {/* Modal de Confirmação de Exclusão */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title="Deletar Resposta"
        message="Tem certeza que deseja deletar esta resposta? Esta ação não pode ser desfeita."
        confirmText="Deletar"
        cancelText="Cancelar"
        danger={true}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteModal({ isOpen: false, responseId: null })}
      />

      {/* Modal de Confirmação de Contactado */}
      <ConfirmModal
        isOpen={contactModal.isOpen}
        title="Marcar como Contactado"
        message="Deseja marcar esta resposta como contactada?"
        confirmText="Marcar"
        cancelText="Cancelar"
        onConfirm={confirmMarkAsContacted}
        onCancel={() => setContactModal({ isOpen: false, responseId: null })}
      />

      {/* Modal de Sucesso */}
      <SuccessModal
        isOpen={successModal.isOpen}
        title={successModal.title}
        message={successModal.message}
        onClose={() =>
          setSuccessModal({ isOpen: false, title: "", message: "" })
        }
      />
    </div>
  );
};

export default AllQuizResponsesView;
