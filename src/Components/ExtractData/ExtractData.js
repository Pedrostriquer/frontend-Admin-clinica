// src/pages/ExtractData/ExtractData.js

import React, { useState, useEffect, useCallback } from "react";
import "./ExtractData.css";
import { useAuth } from "../../Context/AuthContext";

import clientServices from "../../dbServices/clientServices";
import consultantService from "../../dbServices/consultantService";
import contractServices from "../../dbServices/contractServices";
import withdrawServices from "../../dbServices/withdrawServices";
import productServices from "../../dbServices/productServices";
import categoryServices from "../../dbServices/categoryServices";
import formServices from "../../dbServices/formServices";
import saleServices from "../../dbServices/saleServices";
import promotionServices from "../../dbServices/promotionServices";
import leadsService from "../../dbServices/leadsService";
import extractDataServices from "../../dbServices/extractDataServices";

const formatCurrency = (value) =>
  (value || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const formatDate = (dateString) =>
  dateString ? new Date(dateString).toLocaleDateString("pt-BR") : "N/A";
const formatStatus = (status, map) => map[status] || status;


const DATA_SOURCES = {
  Clientes: {
    fetchFunction: (filters, page, pageSize = 10) =>
      clientServices.getClients(filters.searchTerm, page, pageSize),
    downloadFunction: (filters) =>
      extractDataServices.downloadClientsCsv(filters.searchTerm),
    columns: [
      { header: "ID", accessor: "id" },
      { header: "Nome", accessor: "name" },
      { header: "CPF/CNPJ", accessor: "cpfCnpj" },
      { header: "Email", accessor: "email" },
      {
        header: "Saldo",
        accessor: "balance",
        render: (val) => formatCurrency(val),
      },
    ],
  },
  Consultores: {

    fetchFunction: (filters, page, pageSize = 10) =>
      consultantService.getConsultants(
        filters.searchTerm || "",
        page,
        pageSize
      ),
    downloadFunction: () => extractDataServices.downloadConsultantsCsv(), // O download não precisa de filtro
    columns: [
      { header: "ID", accessor: "id" },
      { header: "Nome", accessor: "name" },
      { header: "Email", accessor: "email" },
      { header: "CPF", accessor: "cpfCnpj" },
      {
        header: "Status",
        accessor: "status",
        render: (val) => formatStatus(val, { 1: "Ativo", 0: "Inativo" }),
      },
    ],
  },
  Contratos: {
    fetchFunction: (filters, page, pageSize = 10) =>
      contractServices.getContracts({ status: "Todos" }, page, pageSize),
    downloadFunction: () => extractDataServices.downloadContractsCsv(),
    columns: [
      { header: "ID", accessor: "id" },
      { header: "Cliente", accessor: "client.name" },
      {
        header: "Valor",
        accessor: "amount",
        render: (val) => formatCurrency(val),
      },
      {
        header: "Finaliza em",
        accessor: "endContractDate",
        render: (val) => formatDate(val),
      },
      {
        header: "Status",
        accessor: "status",
        render: (val) =>
          formatStatus(val, {
            1: "Pendente",
            2: "Valorizando",
            3: "Cancelado",
            4: "Finalizado",
          }),
      },
    ],
  },
  Saques: {
    fetchFunction: (filters, page, pageSize = 10) =>
      withdrawServices.getWithdrawals({ status: "Todos" }, page, pageSize),
    downloadFunction: () => extractDataServices.downloadWithdrawsCsv(),
    columns: [
      { header: "ID", accessor: "id" },
      { header: "Cliente", accessor: "client.name" },
      {
        header: "Data",
        accessor: "dateCreated",
        render: (val) => formatDate(val),
      },
      {
        header: "Valor",
        accessor: "amountWithdrawn",
        render: (val) => formatCurrency(val),
      },
      {
        header: "Status",
        accessor: "status",
        render: (val) =>
          formatStatus(val, { 1: "Pendente", 2: "Pago", 3: "Cancelado" }),
      },
    ],
  },
  "Leads Simulação": {
    fetchFunction: (filters, page, pageSize = 10) =>
      leadsService.getLeads(filters.searchTerm || "", page, pageSize),
    downloadFunction: () => extractDataServices.downloadLeadsSimulationCsv(),
    columns: [
      { header: "ID", accessor: "id" },
      { header: "Nome", accessor: "name" },
      { header: "Email", accessor: "email" },
      { header: "Telefone", accessor: "phone" },
      { header: "Cidade", accessor: "fromCity" },
      {
        header: "Valor Simulado",
        accessor: "simulatedAmount",
        render: (val) => formatCurrency(val),
      },
      { header: "Meses", accessor: "simulatedMonths" },
      {
        header: "Com Gema Física",
        accessor: "withPhysicalGem",
        render: (val) => (val ? "Sim" : "Não"),
      },
      {
        header: "Contatado",
        accessor: "contacted",
        render: (val) => (val ? "Sim" : "Não"),
      },
      {
        header: "Data Criação",
        accessor: "dateCreated",
        render: (val) => formatDate(val),
      },
    ],
  },
  // O resto das configurações permanece o mesmo
  Produtos: {
    fetchFunction: (filters, page, pageSize = 10) =>
      productServices.searchProducts(
        { status: "Todos", itemType: "Todos" },
        page,
        pageSize
      ),
    columns: [
      { header: "ID", accessor: "id" },
      { header: "Nome", accessor: "name" },
      {
        header: "Tipo",
        accessor: "itemType",
        render: (val) => (val === 1 ? "Joia" : "Gema"),
      },
      {
        header: "Preço",
        accessor: "value",
        render: (val) => formatCurrency(val),
      },
      {
        header: "Status",
        accessor: "status",
        render: (val) => (val === 1 ? "Ativo" : "Inativo"),
      },
    ],
  },
  Categorias: {
    fetchFunction: async () => {
      const data = await categoryServices.getAllCategories();
      return { items: data, totalCount: data.length, pageSize: data.length };
    },
    columns: [
      { header: "ID", accessor: "id" },
      { header: "Nome", accessor: "name" },
      { header: "Status", accessor: "status" },
      { header: "Qtd. Produtos", accessor: "productCount" },
    ],
  },
  Formulários: {
    fetchFunction: async () => {
      const data = await formServices.getAllForms();
      return { items: data, totalCount: data.length, pageSize: data.length };
    },
    columns: [
      { header: "ID", accessor: "id" },
      {
        header: "Data",
        accessor: "dateCreated",
        render: (val) => formatDate(val),
      },
      { header: "Nome", accessor: "name" },
      { header: "Contato", accessor: "phoneNumber" },
      { header: "Objetivo", accessor: "objective" },
    ],
  },
  Promoções: {
    fetchFunction: async () => {
      const data = await promotionServices.getAllPromotions();
      return { items: data, totalCount: data.length, pageSize: data.length };
    },
    columns: [
      { header: "ID", accessor: "id" },
      { header: "Nome", accessor: "name" },
      { header: "Tipo", accessor: "discountType" },
      { header: "Valor", accessor: "discountValue" },
      { header: "Status", accessor: "status" },
    ],
  },
  Pedidos: {
    fetchFunction: (filters, page) => saleServices.getAllSales({}, page, 10),
    columns: [
      { header: "ID", accessor: "id" },
      { header: "Cliente", accessor: "client.name" },
      {
        header: "Data",
        accessor: "saleDate",
        render: (val) => formatDate(val),
      },
      {
        header: "Total",
        accessor: "totalValue",
        render: (val) => formatCurrency(val),
      },
      { header: "Status", accessor: "status" },
    ],
  },
};

const DATA_OPTIONS = [
  {
    group: "Plataforma",
    items: [
      { key: "Clientes", label: "Clientes", icon: "fa-solid fa-users" },
      {
        key: "Consultores",
        label: "Consultores",
        icon: "fa-solid fa-user-tie",
      },
      {
        key: "Contratos",
        label: "Contratos",
        icon: "fa-solid fa-file-signature",
      },
      { key: "Saques", label: "Saques", icon: "fa-solid fa-money-bill-wave" },
      {
        key: "Leads Simulação",
        label: "Leads Simulação",
        icon: "fa-solid fa-chart-line",
      },
    ],
  },
  {
    group: "E-commerce",
    items: [
      { key: "Produtos", label: "Produtos", icon: "fa-solid fa-gem" },
      { key: "Categorias", label: "Categorias", icon: "fa-solid fa-sitemap" },
      {
        key: "Formulários",
        label: "Formulários",
        icon: "fa-solid fa-file-alt",
      },
      { key: "Promoções", label: "Promoções", icon: "fa-solid fa-tags" },
      { key: "Pedidos", label: "Pedidos", icon: "fa-solid fa-box-open" },
    ],
  },
];

function ExtractData() {
  const { token } = useAuth();
  const [activeGroup, setActiveGroup] = useState("Plataforma");
  const [selectedDataType, setSelectedDataType] = useState(null);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [openFormatMenu, setOpenFormatMenu] = useState(false);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    searchTerm: "",
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
  });
  const currentConfig = selectedDataType
    ? DATA_SOURCES[selectedDataType]
    : null;

  const fetchData = useCallback(async () => {
    if (!selectedDataType || !currentConfig || !token) {
      setData([]);
      return;
    }
    setIsLoading(true);
    try {
      const result = await currentConfig.fetchFunction(
        filters,
        pagination.currentPage
      );
      setData(result.items || []);
      setPagination((prev) => ({
        ...prev,
        totalPages:
          result.pageSize > 0
            ? Math.ceil(result.totalCount / result.pageSize)
            : 1,
        totalCount: result.totalCount,
      }));
    } catch (error) {
      console.error(`Erro ao buscar ${selectedDataType}:`, error);
      setData([]);
    } finally {
      setIsLoading(false);
    }
  }, [selectedDataType, currentConfig, token, filters, pagination.currentPage]);

  useEffect(() => {
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  }, [filters, selectedDataType]);
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleGroupChange = (group) => {
    setActiveGroup(group);
    setSelectedDataType(null);
    setData([]);
  };

  const handleDownload = async (format = "csv") => {
    if (!selectedDataType) {
      alert("Nenhum tipo de dado selecionado.");
      return;
    }

    setExportLoading(true);
    try {
      console.log("========== INICIANDO EXPORTAÇÃO ==========");
      console.log("Tipo de dado:", selectedDataType);
      console.log("Formato:", format);
      console.log("Filtros:", filters);

      const config = DATA_SOURCES[selectedDataType];
      if (!config) {
        alert("Tipo de dado não suportado.");
        return;
      }

      // Busca TODOS os dados com um pageSize grande (10000) para exportação
      console.log("🔄 Buscando dados com pageSize=10000...");
      const allData = await config.fetchFunction(filters, 1, 10000);

      console.log("✅ Dados recebidos do fetchFunction:");
      console.log("   - Total Count:", allData.totalCount);
      console.log("   - Page Size:", allData.pageSize);
      console.log("   - Items recebidos:", allData.items?.length || 0);
      console.log("   - Primeiros 3 itens:", allData.items?.slice(0, 3));

      if (!allData || !allData.items || allData.items.length === 0) {
        console.warn("⚠️ Nenhum dado encontrado para exportar!");
        alert("Nenhum dado para exportar.");
        return;
      }

      const exportFunction =
        extractDataServices.getExportFunction(selectedDataType);
      if (!exportFunction) {
        alert(
          "A exportação para este tipo de dado ainda não foi implementada."
        );
        return;
      }

      // Envia TODOS os dados (até 10000) para o backend gerar o arquivo
      console.log(
        "📤 Enviando",
        allData.items.length,
        "itens para o backend..."
      );
      const response = await exportFunction(allData.items, format);

      console.log("📦 Resposta do backend recebida");
      console.log(
        "   - Tamanho do arquivo:",
        response.data?.length || "desconhecido"
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;

      const fileExtension = format === "excel" ? "xlsx" : "csv";
      const fileName = `${selectedDataType.toLowerCase()}_${
        new Date().toISOString().split("T")[0]
      }.${fileExtension}`;

      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

      console.log("✅ Download iniciado:", fileName);
      console.log("========== EXPORTAÇÃO CONCLUÍDA ==========");

      setOpenFormatMenu(false);
    } catch (error) {
      console.error("❌ Erro ao gerar o arquivo:", error);
      console.error("   - Detalhes:", error.message);
      alert("Não foi possível gerar o arquivo. Tente novamente.");
    } finally {
      setExportLoading(false);
    }
  };

  const getNestedValue = (obj, path) =>
    path.split(".").reduce((acc, part) => acc && acc[part], obj);
  const changePage = (newPage) => {
    if (newPage > 0 && newPage <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, currentPage: newPage }));
    }
  };

  return (
    <div className="extract-data-container">
      <header className="extract-data-header">
        <h1>Extrair Dados</h1>
        <p>
          Selecione uma fonte de dados, aplique filtros e extraia as informações
          que precisa.
        </p>
      </header>
      <section className="data-selector-container">
        <div className="group-selector">
          {DATA_OPTIONS.map(({ group }) => (
            <button
              key={group}
              className={`group-btn ${activeGroup === group ? "active" : ""}`}
              onClick={() => handleGroupChange(group)}
            >
              {group}
            </button>
          ))}
        </div>
        <div className="data-type-grid">
          {DATA_OPTIONS.find((g) => g.group === activeGroup)?.items.map(
            (item) => (
              <button
                key={item.key}
                className={`data-type-btn ${
                  selectedDataType === item.key ? "active" : ""
                }`}
                onClick={() => setSelectedDataType(item.key)}
              >
                <i className={item.icon}></i>
                {item.label}
              </button>
            )
          )}
        </div>
      </section>
      {selectedDataType && (
        <section className="data-display-section">
          <div className="filters-container">
            {selectedDataType === "Clientes" && (
              <>
                <div className="filter-item search-filter">
                  <label>Buscar</label>
                  <input
                    type="text"
                    name="searchTerm"
                    placeholder="Buscar por nome, CPF/CNPJ..."
                    value={filters.searchTerm}
                    onChange={handleFilterChange}
                  />
                </div>
                <div className="filter-item">
                  <label>Data de Início</label>
                  <input
                    type="date"
                    name="startDate"
                    value={filters.startDate}
                    onChange={handleFilterChange}
                  />
                </div>
                <div className="filter-item">
                  <label>Data de Fim</label>
                  <input
                    type="date"
                    name="endDate"
                    value={filters.endDate}
                    onChange={handleFilterChange}
                  />
                </div>
              </>
            )}
            <div
              className="extract-button-wrapper"
              style={{ position: "relative" }}
            >
              <button
                className="extract-button"
                onClick={() => setOpenFormatMenu(!openFormatMenu)}
                disabled={exportLoading}
              >
                <i className="fa-solid fa-download"></i> Extrair Dados
              </button>
              {openFormatMenu && (
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    backgroundColor: "#ffffff",
                    border: "1px solid #ddd",
                    borderRadius: "6px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    zIndex: 1000,
                    minWidth: "180px",
                    marginTop: "4px",
                  }}
                >
                  <button
                    onClick={() => handleDownload("csv")}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      textAlign: "left",
                      border: "none",
                      backgroundColor: "#ffffff",
                      cursor: "pointer",
                      fontSize: "14px",
                      color: "#333",
                      borderBottom: "1px solid #eee",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) =>
                      (e.target.style.backgroundColor = "#f5f5f5")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.backgroundColor = "#ffffff")
                    }
                  >
                    📄 CSV (.csv)
                  </button>
                  <button
                    onClick={() => handleDownload("excel")}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      textAlign: "left",
                      border: "none",
                      backgroundColor: "#ffffff",
                      cursor: "pointer",
                      fontSize: "14px",
                      color: "#333",
                      borderBottom: "none",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) =>
                      (e.target.style.backgroundColor = "#f5f5f5")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.backgroundColor = "#ffffff")
                    }
                  >
                    📊 Excel (.xlsx)
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="data-table-card">
            <table className="data-table">
              <thead>
                <tr>
                  {currentConfig?.columns.map((col) => (
                    <th key={col.header}>{col.header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={currentConfig?.columns.length}>
                      Carregando dados...
                    </td>
                  </tr>
                ) : data.length > 0 ? (
                  data.map((row, rowIndex) => (
                    <tr key={row.id || rowIndex}>
                      {currentConfig?.columns.map((col) => (
                        <td key={col.accessor}>
                          {col.render
                            ? col.render(getNestedValue(row, col.accessor))
                            : getNestedValue(row, col.accessor)}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={currentConfig?.columns.length}>
                      Nenhum dado encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="pagination-controls">
            <button
              onClick={() => changePage(pagination.currentPage - 1)}
              disabled={pagination.currentPage <= 1 || isLoading}
            >
              Anterior
            </button>
            <span>
              Página {pagination.currentPage} de {pagination.totalPages}
            </span>
            <button
              onClick={() => changePage(pagination.currentPage + 1)}
              disabled={
                pagination.currentPage >= pagination.totalPages || isLoading
              }
            >
              Próxima
            </button>
          </div>
        </section>
      )}
    </div>
  );
}

export default ExtractData;
