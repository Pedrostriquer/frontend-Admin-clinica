import React, {
  useState,
  useMemo,
  useRef,
  useEffect,
  useCallback,
} from "react";
import "./PromotionsPage.css";
import promotionServices from "../../../dbServices/promotionServices";
import productServices from "../../../dbServices/productServices";
import { useAuth } from "../../../Context/AuthContext";
import { useLoad } from "../../../Context/LoadContext";

// ========================================================================
// HELPERS, HOOKS E TRADUÇÕES
// ========================================================================

const statusMap = {
  Scheduled: "Agendada",
  Active: "Ativa",
  Finished: "Finalizada",
  Cancelled: "Cancelada",
};

const statusOptions = [
  { value: "Todos", label: "Todos os Status" },
  ...Object.entries(statusMap).map(([value, label]) => ({ value, label }))
];

const getActionableStatus = (backendStatus) => {
  switch (backendStatus) {
    case 'Scheduled':
    case 'Finished':
      return 'Inactive';
    default:
      return backendStatus;
  }
};

const useOutsideAlerter = (ref, callback) => {
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [ref, callback]);
};

// ========================================================================
// REUSABLE UI COMPONENTS
// ========================================================================

const CustomDropdown = ({ options, selected, onSelect, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef, () => setIsOpen(false));
  return (
    <div className="custom-dropdown-container-promo" ref={wrapperRef}>
      <button
        type="button"
        className="dropdown-header-promo"
        onClick={() => setIsOpen(!isOpen)}
      >
        {options.find((opt) => opt.value === selected)?.label || placeholder}
        <i className={`fa-solid fa-chevron-down ${isOpen ? "open" : ""}`}></i>
      </button>
      {isOpen && (
        <ul className="dropdown-list-promo">
          {options.map((option) => (
            <li
              key={option.value}
              onClick={() => {
                onSelect(option.value);
                setIsOpen(false);
              }}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// ========================================================================
// IMPROVED ITEM SELECTOR COMPONENT
// ========================================================================

const ImprovedItemSelector = ({ items, selectedItems, onToggleItem, placeholder }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");

  // Filter items based on search
  const filteredItems = useMemo(() => {
    let filtered = items.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort items
    if (sortBy === "name") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "price") {
      filtered.sort((a, b) => (a.value || 0) - (b.value || 0));
    }

    return filtered;
  }, [items, searchTerm, sortBy]);

  const selectedCount = selectedItems.length;
  const totalCount = items.length;

  return (
    <div className="improved-selector-wrapper">
      {/* Header with info */}
      <div className="selector-header-improved">
        <div className="selector-search-box">
          <i className="fa-solid fa-magnifying-glass"></i>
          <input
            type="text"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="selector-search-input"
          />
          {searchTerm && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={() => setSearchTerm("")}
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          )}
        </div>

        <div className="selector-sort-bar">
          <span className="selected-count">
            <i className="fa-solid fa-check-circle"></i> {selectedCount} de {totalCount}
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="name">Ordenar por Nome</option>
            <option value="price">Ordenar por Preço</option>
          </select>
        </div>
      </div>

      {/* Products list as table */}
      <div className="selector-list-improved">
        {filteredItems.length > 0 ? (
          <div className="products-table">
            <div className="table-header">
              <div className="col-checkbox"></div>
              <div className="col-name">Produto</div>
              <div className="col-price">Preço</div>
              <div className="col-stock">Estoque</div>
            </div>

            {filteredItems.map((item) => (
              <div
                key={item.id}
                className={`table-row ${selectedItems.includes(item.id) ? "selected" : ""}`}
              >
                <div className="col-checkbox">
                  <input
                    type="checkbox"
                    id={`product-${item.id}`}
                    checked={selectedItems.includes(item.id)}
                    onChange={() => onToggleItem(item.id)}
                    className="product-checkbox"
                  />
                </div>
                <label htmlFor={`product-${item.id}`} className="col-name">
                  <span className="product-name">{item.name}</span>
                </label>
                <div className="col-price">
                  <span className="price-value">
                    R$ {item.value ? item.value.toFixed(2) : "0.00"}
                  </span>
                </div>
                <div className="col-stock">
                  <span className={`stock-badge ${item.stock > 0 ? "in-stock" : "out-stock"}`}>
                    {item.stock || 0}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <i className="fa-solid fa-inbox"></i>
            <p>Nenhum produto encontrado</p>
            <small>Tente ajustar sua busca</small>
          </div>
        )}
      </div>

      {/* Footer with action */}
      {selectedCount > 0 && (
        <div className="selector-footer">
          <div className="selection-info">
            <i className="fa-solid fa-circle-info"></i>
            <span>{selectedCount} produto{selectedCount !== 1 ? "s" : ""} selecionado{selectedCount !== 1 ? "s" : ""}</span>
          </div>
        </div>
      )}
    </div>
  );
};

// ========================================================================
// MODAL COMPONENTS
// ========================================================================

const DetailsModal = ({ promo, allProducts, onSave, onUpdateStatus, onClose, isClosing }) => {
  const [formData, setFormData] = useState({ ...promo });
  const [isEditing, setIsEditing] = useState(false);

  const actionableStatus = getActionableStatus(promo.status);

  const handleInputChange = (name, value) => setFormData((prev) => ({ ...prev, [name]: value }));

  const handleToggleProduct = (productId) => {
    setFormData((prev) => {
      const newProductIds = prev.productIds.includes(productId)
        ? prev.productIds.filter((id) => id !== productId)
        : [...prev.productIds, productId];
      return { ...prev, productIds: newProductIds };
    });
  };

  const handleSaveChanges = () => {
    onSave(formData);
    setIsEditing(false);
  };

  const handleStatusChange = (newStatus) => onUpdateStatus(promo.id, newStatus);

  return (
    <div className={`modal-backdrop-promo ${isClosing ? "closing" : ""}`} onClick={onClose}>
      <div className={`modal-content-promo large ${isClosing ? "closing" : ""}`} onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header-improved">
          <div className="header-title">
            <button type="button" className="back-btn" onClick={onClose}>
              <i className="fa-solid fa-chevron-left"></i>
            </button>
            <div className="header-text">
              <h3>{promo.name}</h3>
              <span className={`status-badge-promo status-${promo.status.toLowerCase()}`}>
                {statusMap[promo.status] || promo.status}
              </span>
            </div>
          </div>
          <button type="button" className="edit-toggle-btn" onClick={() => setIsEditing(!isEditing)}>
            <i className={`fa-solid fa-${isEditing ? "check" : "pen"}`}></i>
            {isEditing ? "Feito" : "Editar"}
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body-improved">
          <div className="form-section">
            <h4>Informações da Promoção</h4>
            <div className="form-grid">
              <div className="form-group">
                <label>Nome da Promoção</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  disabled={!isEditing}
                  className={!isEditing ? "disabled" : ""}
                />
              </div>
              <div className="form-group">
                <label>Tipo de Desconto</label>
                <select
                  value={formData.discountType}
                  onChange={(e) => handleInputChange("discountType", e.target.value)}
                  disabled={!isEditing}
                  className={!isEditing ? "disabled" : ""}
                >
                  <option value="Percentage">Porcentagem (%)</option>
                  <option value="FixedValue">Valor Fixo (R$)</option>
                </select>
              </div>
              <div className="form-group">
                <label>Valor do Desconto</label>
                <div className="input-with-unit">
                  <input
                    type="number"
                    value={formData.discountValue}
                    onChange={(e) => handleInputChange("discountValue", parseFloat(e.target.value) || 0)}
                    disabled={!isEditing}
                    className={!isEditing ? "disabled" : ""}
                  />
                  <span className="unit">{formData.discountType === "Percentage" ? "%" : "R$"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Products Section */}
          <div className="form-section products-section">
            <div className="section-header">
              <h4>Produtos Associados</h4>
              <span className="product-count">{formData.productIds.length} selecionado{formData.productIds.length !== 1 ? "s" : ""}</span>
            </div>
            {isEditing ? (
              <ImprovedItemSelector
                items={allProducts}
                selectedItems={formData.productIds}
                onToggleItem={handleToggleProduct}
                placeholder="Buscar produtos..."
              />
            ) : (
              <div className="products-display">
                {formData.productIds.length > 0 ? (
                  <div className="products-grid">
                    {allProducts
                      .filter((p) => formData.productIds.includes(p.id))
                      .map((product) => (
                        <div key={product.id} className="product-badge">
                          <span>{product.name}</span>
                          <small>R$ {product.value?.toFixed(2)}</small>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="no-products">Nenhum produto selecionado</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer-improved">
          <div className="status-actions">
            {(actionableStatus === 'Active' || actionableStatus === 'Inactive') && (
              <>
                <button
                  type="button"
                  className={`action-btn-promo ${actionableStatus === 'Active' ? 'warning' : 'success'}`}
                  onClick={() => handleStatusChange(actionableStatus === 'Active' ? 'Inactive' : 'Active')}
                >
                  <i className={`fa-solid fa-${actionableStatus === 'Active' ? 'pause' : 'play'}`}></i>
                  {actionableStatus === 'Active' ? 'Desativar' : 'Ativar'}
                </button>
                <button
                  type="button"
                  className="action-btn-promo danger"
                  onClick={() => handleStatusChange('Cancelled')}
                >
                  <i className="fa-solid fa-ban"></i> Cancelar
                </button>
              </>
            )}
            {actionableStatus === 'Cancelled' && (
              <button
                type="button"
                className="action-btn-promo success"
                onClick={() => handleStatusChange('Active')}
              >
                <i className="fa-solid fa-redo"></i> Reativar
              </button>
            )}
          </div>
          <div className="main-actions">
            <button type="button" className="close-btn-promo" onClick={onClose}>
              <i className="fa-solid fa-xmark"></i> Fechar
            </button>
            {isEditing && (
              <button type="button" className="action-btn-promo primary" onClick={handleSaveChanges}>
                <i className="fa-solid fa-save"></i> Salvar Alterações
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const CreateModal = ({ allProducts, onSave, onClose, isClosing }) => {
  const [formData, setFormData] = useState({
    name: "",
    discountType: "Percentage",
    discountValue: 0,
    productIds: [],
  });

  const handleInputChange = (name, value) => setFormData((prev) => ({ ...prev, [name]: value }));

  const handleToggleProduct = (productId) => {
    setFormData((prev) => {
      const newProductIds = prev.productIds.includes(productId)
        ? prev.productIds.filter((id) => id !== productId)
        : [...prev.productIds, productId];
      return { ...prev, productIds: newProductIds };
    });
  };

  const isFormValid = formData.name.trim() !== "" && formData.productIds.length > 0;

  return (
    <div className={`modal-backdrop-promo ${isClosing ? "closing" : ""}`} onClick={onClose}>
      <div className={`modal-content-promo large ${isClosing ? "closing" : ""}`} onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header-improved">
          <div className="header-title">
            <button type="button" className="back-btn" onClick={onClose}>
              <i className="fa-solid fa-chevron-left"></i>
            </button>
            <h3>Criar Nova Promoção</h3>
          </div>
        </div>

        {/* Modal Body */}
        <div className="modal-body-improved">
          <div className="form-section">
            <h4>Informações da Promoção</h4>
            <div className="form-grid">
              <div className="form-group full-width">
                <label>Nome da Promoção *</label>
                <input
                  type="text"
                  placeholder="Ex: Liquidação Inverno"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Tipo de Desconto</label>
                <select
                  value={formData.discountType}
                  onChange={(e) => handleInputChange("discountType", e.target.value)}
                >
                  <option value="Percentage">Porcentagem (%)</option>
                  <option value="FixedValue">Valor Fixo (R$)</option>
                </select>
              </div>
              <div className="form-group">
                <label>Valor do Desconto *</label>
                <div className="input-with-unit">
                  <input
                    type="number"
                    placeholder="Ex: 15"
                    value={formData.discountValue}
                    onChange={(e) => handleInputChange("discountValue", parseFloat(e.target.value) || 0)}
                  />
                  <span className="unit">{formData.discountType === "Percentage" ? "%" : "R$"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Products Section */}
          <div className="form-section products-section">
            <div className="section-header">
              <h4>Selecione os Produtos *</h4>
              <span className="product-count">{formData.productIds.length} selecionado{formData.productIds.length !== 1 ? "s" : ""}</span>
            </div>
            <ImprovedItemSelector
              items={allProducts}
              selectedItems={formData.productIds}
              onToggleItem={handleToggleProduct}
              placeholder="Buscar produtos..."
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer-improved">
          <div className="main-actions">
            <button type="button" className="close-btn-promo" onClick={onClose}>
              <i className="fa-solid fa-xmark"></i> Cancelar
            </button>
            <button
              type="button"
              className={`action-btn-promo primary ${!isFormValid ? "disabled" : ""}`}
              onClick={() => onSave(formData)}
              disabled={!isFormValid}
            >
              <i className="fa-solid fa-plus"></i> Criar Promoção
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ========================================================================
// MAIN PAGE COMPONENT
// ========================================================================

function PromotionsPage() {
  const { token } = useAuth();
  const [allPromotions, setAllPromotions] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modal, setModal] = useState({ type: null, data: null });
  const [isClosing, setIsClosing] = useState(false);
  const [filters, setFilters] = useState({ searchTerm: "", status: "Todos" });
  const { startLoading, stopLoading } = useLoad();

  const fetchInitialData = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    startLoading();
    try {
      const [promoData, productData] = await Promise.all([
        promotionServices.getAllPromotions(),
        productServices.searchProducts({}, 1, 1000),
      ]);
      setAllPromotions(promoData || []);
      setAllProducts(productData.items || []);
    } catch (error) {
      console.error("Não foi possível carregar os dados da página.", error);
    } finally {
      setIsLoading(false);
      stopLoading();
    }
  }, [token, startLoading, stopLoading]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  const handleFilterChange = (name, value) => setFilters((prev) => ({ ...prev, [name]: value }));

  const handleOpenModal = (type, data = null) => setModal({ type, data });

  const handleCloseModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setModal({ type: null, data: null });
      setIsClosing(false);
    }, 300);
  };

  const handleSavePromotion = async (promoData) => {
    startLoading();
    try {
      if (promoData.id) {
        await promotionServices.updatePromotion(promoData.id, promoData);
      } else {
        await promotionServices.createPromotion(promoData);
      }
      handleCloseModal();
      await fetchInitialData();
    } catch (error) {
      console.error("Erro ao salvar a promoção.", error);
    } finally {
      stopLoading();
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    startLoading();
    try {
      await promotionServices.updatePromotionStatus(id, newStatus);
      handleCloseModal();
      await fetchInitialData();
    } catch (error) {
      console.error("Erro ao alterar o status da promoção.", error);
    } finally {
      stopLoading();
    }
  };

  const filteredPromotions = useMemo(() => {
    if (!allPromotions) return [];
    return allPromotions
      .filter((promo) =>
        promo.name.toLowerCase().includes(filters.searchTerm.toLowerCase())
      )
      .filter(
        (promo) => filters.status === "Todos" || promo.status === filters.status
      );
  }, [filters, allPromotions]);

  const activePromos = useMemo(() => allPromotions?.filter(p => p.status === 'Active').length || 0, [allPromotions]);
  const scheduledPromos = useMemo(() => allPromotions?.filter(p => p.status === 'Cancelled').length || 0, [allPromotions]);

  return (
    <div className="promotions-page-container">
      <header className="promotions-page-header">
        <h1>Promoções</h1>
        <button className="create-promo-button" onClick={() => handleOpenModal("create")}>
          <i className="fa-solid fa-plus"></i> Criar Promoção
        </button>
      </header>

      <section className="promo-kpi-cards">
        <div className="promo-kpi-card">
          <i className="fa-solid fa-tags"></i>
          <div>
            <h4>Total de Promoções</h4>
            <p className="kpi-main-value-promo">{allPromotions?.length || 0}</p>
          </div>
        </div>
        <div className="promo-kpi-card">
          <i className="fa-solid fa-rocket"></i>
          <div>
            <h4>Status Atual</h4>
            <p className="kpi-main-value-promo">{activePromos} <span className="kpi-unit-promo">Ativas</span></p>
            <p className="kpi-sub-value-promo">{scheduledPromos} Canceladas</p>
          </div>
        </div>
      </section>

      <section className="promo-controls">
        <div className="search-box-promo">
          <i className="fa-solid fa-magnifying-glass"></i>
          <input
            type="text"
            placeholder="Buscar promoções..."
            onChange={(e) => handleFilterChange("searchTerm", e.target.value)}
          />
        </div>
        <div className="promo-filters">
          <CustomDropdown
            placeholder="Status"
            options={statusOptions}
            selected={filters.status}
            onSelect={(value) => handleFilterChange("status", value)}
          />
        </div>
      </section>

      {isLoading ? (
        <div className="loading-message">
          <i className="fa-solid fa-spinner"></i> Carregando promoções...
        </div>
      ) : (
        <>
          <div className="promotions-list">
            {filteredPromotions.length > 0 ? (
              filteredPromotions.map((promo) => (
                <div key={promo.id} className="promo-card" onClick={() => handleOpenModal("details", promo)}>
                  <div className="promo-card-header">
                    <h4>{promo.name}</h4>
                    <span className={`status-badge-promo status-${promo.status.toLowerCase()}`}>
                      {statusMap[promo.status] || promo.status}
                    </span>
                  </div>
                  <div className="promo-card-body">
                    <p><strong>Produtos:</strong> {promo.productIds?.length || 0}</p>
                  </div>
                  <div className="promo-card-footer">
                    <span>Ver Detalhes <i className="fa-solid fa-arrow-right"></i></span>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-results-message">
                <i className="fa-solid fa-inbox"></i>
                <p>Nenhuma promoção encontrada.</p>
              </div>
            )}
          </div>
        </>
      )}

      {modal.type === "details" && (
        <DetailsModal
          promo={modal.data}
          allProducts={allProducts}
          onSave={handleSavePromotion}
          onUpdateStatus={handleUpdateStatus}
          onClose={handleCloseModal}
          isClosing={isClosing}
        />
      )}
      {modal.type === "create" && (
        <CreateModal
          allProducts={allProducts}
          onSave={handleSavePromotion}
          onClose={handleCloseModal}
          isClosing={isClosing}
        />
      )}
    </div>
  );
}

export default PromotionsPage;
