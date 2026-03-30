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

const ImprovedItemSelector = ({ items, selectedItems, onToggleItem, placeholder, enableRemoteSearch = false }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasSearched, setHasSearched] = useState(false);
  const [productsData, setProductsData] = useState({
    items: items || [],
    totalCount: items?.length || 0,
  });

  // Load first page on component mount when remote search is enabled
  useEffect(() => {
    if (enableRemoteSearch && !hasSearched) {
      const loadInitialProducts = async () => {
        setIsLoadingMore(true);
        setHasSearched(true);
        try {
          const result = await productServices.searchActiveProductsForPromotion(
            "",
            1,
            10
          );
          setProductsData(result);
          setCurrentPage(1);
        } catch (error) {
          console.error("Erro ao buscar produtos iniciais:", error);
        } finally {
          setIsLoadingMore(false);
        }
      };
      loadInitialProducts();
    }
  }, [enableRemoteSearch]);

  // Manual search function triggered by button click
  const handleManualSearch = async () => {
    if (enableRemoteSearch) {
      setIsLoadingMore(true);
      setHasSearched(true);
      try {
        const result = await productServices.searchActiveProductsForPromotion(
          searchTerm,
          1,
          10
        );
        setProductsData(result);
        setCurrentPage(1);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      } finally {
        setIsLoadingMore(false);
      }
    }
  };

  // Filter items based on search (apenas se não estiver usando remote search)
  const filteredItems = useMemo(() => {
    let filtered = [];

    if (enableRemoteSearch) {
      // For remote search, use products from backend only after search is triggered
      filtered = hasSearched ? productsData.items : [];
    } else {
      // For local search, filter items as user types
      filtered = items.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort items
    if (sortBy === "name") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "price") {
      filtered.sort((a, b) => (a.value || 0) - (b.value || 0));
    }

    return filtered;
  }, [items, searchTerm, sortBy, enableRemoteSearch, productsData.items, hasSearched]);

  const selectedCount = selectedItems.length;
  const totalCount = enableRemoteSearch ? (hasSearched ? productsData.totalCount : 0) : items.length;

  const handleLoadMore = async () => {
    if (enableRemoteSearch && currentPage * 10 < productsData.totalCount) {
      setIsLoadingMore(true);
      try {
        const result = await productServices.searchActiveProductsForPromotion(
          searchTerm,
          currentPage + 1,
          10
        );
        setProductsData((prev) => ({
          ...prev,
          items: [...prev.items, ...result.items],
        }));
        setCurrentPage(currentPage + 1);
      } catch (error) {
        console.error("Erro ao carregar mais produtos:", error);
      } finally {
        setIsLoadingMore(false);
      }
    }
  };

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
            onKeyPress={(e) => {
              if (e.key === "Enter" && enableRemoteSearch) {
                handleManualSearch();
              }
            }}
          />
          {searchTerm && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={() => {
                setSearchTerm("");
                setHasSearched(false);
                setProductsData({ items: [], totalCount: 0 });
              }}
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          )}
          {enableRemoteSearch && (
            <button
              type="button"
              className="search-btn"
              onClick={handleManualSearch}
              disabled={isLoadingMore}
              title="Clique para pesquisar ou pressione Enter"
            >
              {isLoadingMore ? (
                <>
                  <i className="fa-solid fa-spinner"></i>
                  <span>Pesquisando...</span>
                </>
              ) : (
                <span>Pesquisar</span>
              )}
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
        {isLoadingMore && hasSearched ? (
          <div className="loading-state">
            <i className="fa-solid fa-spinner"></i>
            <p>Buscando produtos...</p>
          </div>
        ) : filteredItems.length > 0 ? (
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
      <div className="selector-footer">
        <div className="selection-info">
          <i className="fa-solid fa-circle-info"></i>
          <span>{selectedCount} produto{selectedCount !== 1 ? "s" : ""} selecionado{selectedCount !== 1 ? "s" : ""}</span>
          {enableRemoteSearch && (
            <span className="text-muted">
              · {filteredItems.length} de {totalCount} resultado{totalCount !== 1 ? "s" : ""}
            </span>
          )}
        </div>
        {enableRemoteSearch && filteredItems.length < totalCount && (
          <button
            type="button"
            className="load-more-btn"
            onClick={handleLoadMore}
            disabled={isLoadingMore}
            title={`Mostrar mais produtos (${Math.min(10, totalCount - filteredItems.length)} restante${totalCount - filteredItems.length !== 1 ? "s" : ""})`}
          >
            {isLoadingMore ? (
              <>
                <i className="fa-solid fa-spinner"></i> Carregando...
              </>
            ) : (
              <>
                <i className="fa-solid fa-chevron-down"></i> Carregar mais ({totalCount - filteredItems.length})
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

// ========================================================================
// MODAL COMPONENTS
// ========================================================================

const DetailsModal = ({ promo, allProducts, onSave, onUpdateStatus, onClose, isClosing }) => {
  const [formData, setFormData] = useState({ ...promo });
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});

  const actionableStatus = getActionableStatus(promo.status);

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts editing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleToggleProduct = (productId) => {
    setFormData((prev) => {
      const newProductIds = prev.productIds.includes(productId)
        ? prev.productIds.filter((id) => id !== productId)
        : [...prev.productIds, productId];
      return { ...prev, productIds: newProductIds };
    });
    if (errors.productIds) {
      setErrors((prev) => ({ ...prev, productIds: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Nome da promoção é obrigatório";
    if (formData.discountValue <= 0) newErrors.discountValue = "Valor deve ser maior que 0";
    if (formData.productIds.length === 0) newErrors.productIds = "Selecione pelo menos um produto";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveChanges = () => {
    if (validateForm()) {
      onSave(formData);
      setIsEditing(false);
    }
  };

  const handleStatusChange = (newStatus) => onUpdateStatus(promo.id, newStatus);

  const discountValue = formData.discountValue;
  const discountType = formData.discountType;
  const selectedProducts = allProducts.filter((p) => formData.productIds.includes(p.id));
  const totalProductsValue = selectedProducts.reduce((sum, p) => sum + (p.value || 0), 0);

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
              <h3>{formData.name}</h3>
              <span className={`status-badge-promo status-${promo.status.toLowerCase()}`}>
                {statusMap[promo.status] || promo.status}
              </span>
            </div>
          </div>
          <button
            type="button"
            className="edit-toggle-btn"
            onClick={() => {
              if (isEditing) {
                setErrors({});
              }
              setIsEditing(!isEditing);
            }}
          >
            <i className={`fa-solid fa-${isEditing ? "times" : "pen"}`}></i>
            {isEditing ? "Cancelar" : "Editar"}
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body-improved">
          {/* Info Summary Card */}
          {!isEditing && (
            <div className="promo-summary-card">
              <div className="summary-item">
                <span className="summary-label">Tipo de Desconto</span>
                <span className="summary-value">{discountType === "Percentage" ? "Porcentagem" : "Valor Fixo"}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Valor do Desconto</span>
                <span className="summary-value">
                  {discountType === "Percentage" ? `${discountValue}%` : `R$ ${discountValue.toFixed(2)}`}
                </span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Produtos</span>
                <span className="summary-value">{formData.productIds.length}</span>
              </div>
            </div>
          )}

          {/* Form Section */}
          <div className="form-section">
            <h4>Informações da Promoção</h4>
            <div className="form-grid">
              <div className="form-group">
                <label>
                  Nome da Promoção
                  {isEditing && <span className="required">*</span>}
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  disabled={!isEditing}
                  className={`${!isEditing ? "disabled" : ""} ${errors.name ? "error" : ""}`}
                  placeholder="Ex: Liquidação Inverno"
                />
                {errors.name && <span className="error-text">{errors.name}</span>}
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
                <label>
                  Valor do Desconto
                  {isEditing && <span className="required">*</span>}
                </label>
                <div className="input-with-unit">
                  <input
                    type="number"
                    value={formData.discountValue}
                    onChange={(e) => handleInputChange("discountValue", parseFloat(e.target.value) || 0)}
                    disabled={!isEditing}
                    className={`${!isEditing ? "disabled" : ""} ${errors.discountValue ? "error" : ""}`}
                    placeholder="0"
                    min="0"
                  />
                  <span className="unit">{formData.discountType === "Percentage" ? "%" : "R$"}</span>
                </div>
                {errors.discountValue && <span className="error-text">{errors.discountValue}</span>}
              </div>
            </div>
          </div>

          {/* Products Section */}
          <div className="form-section products-section">
            <div className="section-header">
              <h4>
                Produtos Associados
                {isEditing && <span className="required">*</span>}
              </h4>
              <span className="product-count">{formData.productIds.length} selecionado{formData.productIds.length !== 1 ? "s" : ""}</span>
            </div>
            {isEditing ? (
              <>
                <ImprovedItemSelector
                  items={allProducts}
                  selectedItems={formData.productIds}
                  onToggleItem={handleToggleProduct}
                  placeholder="Buscar produtos ativos..."
                  enableRemoteSearch={true}
                />
                {errors.productIds && <span className="error-text">{errors.productIds}</span>}
              </>
            ) : (
              <div className="products-display">
                {formData.productIds.length > 0 ? (
                  <div className="products-grid">
                    {selectedProducts.map((product) => (
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
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleToggleProduct = (productId) => {
    setFormData((prev) => {
      const newProductIds = prev.productIds.includes(productId)
        ? prev.productIds.filter((id) => id !== productId)
        : [...prev.productIds, productId];
      return { ...prev, productIds: newProductIds };
    });
    setTouched((prev) => ({ ...prev, productIds: true }));
    if (errors.productIds) {
      setErrors((prev) => ({ ...prev, productIds: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Nome da promoção é obrigatório";
    if (formData.discountValue <= 0) newErrors.discountValue = "Valor deve ser maior que 0";
    if (formData.productIds.length === 0) newErrors.productIds = "Selecione pelo menos um produto";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreatePromotion = () => {
    if (validateForm()) {
      onSave(formData);
    }
  };

  const isFormValid = formData.name.trim() !== "" && formData.discountValue > 0 && formData.productIds.length > 0;
  const selectedProducts = allProducts.filter((p) => formData.productIds.includes(p.id));

  return (
    <div className={`modal-backdrop-promo ${isClosing ? "closing" : ""}`} onClick={onClose}>
      <div className={`modal-content-promo large ${isClosing ? "closing" : ""}`} onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header-improved create-modal-header">
          <div className="header-title">
            <button type="button" className="back-btn" onClick={onClose}>
              <i className="fa-solid fa-chevron-left"></i>
            </button>
            <div className="header-text">
              <h3>Criar Nova Promoção</h3>
              <p className="header-subtitle">Preencha os dados abaixo para criar uma nova promoção</p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="modal-body-improved">
          {/* Progress Indicator */}
          <div className="creation-progress">
            <div className={`progress-step ${formData.name.trim() ? "completed" : "pending"}`}>
              <div className="step-indicator">
                <i className="fa-solid fa-check"></i>
              </div>
              <span>Informações</span>
            </div>
            <div className={`progress-step ${formData.discountValue > 0 ? "completed" : "pending"}`}>
              <div className="step-indicator">
                <i className="fa-solid fa-percent"></i>
              </div>
              <span>Desconto</span>
            </div>
            <div className={`progress-step ${formData.productIds.length > 0 ? "completed" : "pending"}`}>
              <div className="step-indicator">
                <i className="fa-solid fa-box"></i>
              </div>
              <span>Produtos</span>
            </div>
          </div>

          {/* Form Section */}
          <div className="form-section">
            <h4>Informações da Promoção</h4>
            <div className="form-grid">
              <div className="form-group full-width">
                <label>
                  Nome da Promoção
                  <span className="required">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Ex: Liquidação Inverno, Black Friday, etc."
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className={errors.name && touched.name ? "error" : ""}
                />
                {errors.name && touched.name && <span className="error-text">{errors.name}</span>}
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
                <label>
                  Valor do Desconto
                  <span className="required">*</span>
                </label>
                <div className="input-with-unit">
                  <input
                    type="number"
                    placeholder="0"
                    value={formData.discountValue}
                    onChange={(e) => handleInputChange("discountValue", parseFloat(e.target.value) || 0)}
                    className={errors.discountValue && touched.discountValue ? "error" : ""}
                    min="0"
                  />
                  <span className="unit">{formData.discountType === "Percentage" ? "%" : "R$"}</span>
                </div>
                {errors.discountValue && touched.discountValue && <span className="error-text">{errors.discountValue}</span>}
              </div>
            </div>
          </div>

          {/* Products Section */}
          <div className="form-section products-section">
            <div className="section-header">
              <h4>
                Selecione os Produtos
                <span className="required">*</span>
              </h4>
              <span className="product-count">{formData.productIds.length} selecionado{formData.productIds.length !== 1 ? "s" : ""}</span>
            </div>
            <ImprovedItemSelector
              items={allProducts}
              selectedItems={formData.productIds}
              onToggleItem={handleToggleProduct}
              placeholder="Buscar produtos ativos..."
              enableRemoteSearch={true}
            />
            {errors.productIds && touched.productIds && <span className="error-text">{errors.productIds}</span>}
          </div>

          {/* Preview Card */}
          {isFormValid && (
            <div className="promo-preview-card">
              <h4>Resumo da Promoção</h4>
              <div className="preview-grid">
                <div className="preview-item">
                  <span className="label">Nome</span>
                  <span className="value">{formData.name}</span>
                </div>
                <div className="preview-item">
                  <span className="label">Desconto</span>
                  <span className="value discount">
                    {formData.discountType === "Percentage" ? `${formData.discountValue}%` : `R$ ${formData.discountValue.toFixed(2)}`}
                  </span>
                </div>
                <div className="preview-item">
                  <span className="label">Produtos</span>
                  <span className="value">{formData.productIds.length} produto{formData.productIds.length !== 1 ? "s" : ""}</span>
                </div>
              </div>
            </div>
          )}
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
              onClick={handleCreatePromotion}
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
    }
  }, [token]);

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
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await promotionServices.updatePromotionStatus(id, newStatus);
      handleCloseModal();
      await fetchInitialData();
    } catch (error) {
      console.error("Erro ao alterar o status da promoção.", error);
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
