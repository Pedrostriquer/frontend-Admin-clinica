import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import "./BlogAdminPage.css";
import blogServices from "../../../dbServices/blogServices";
import { useLoad } from "../../../Context/LoadContext";

const ITEMS_PER_PAGE = 10;

// --- HELPERS ---
const ensureProtocol = (url) => {
  if (!url) return "";
  if (!/^https?:\/\//i.test(url)) {
    return `https://${url}`;
  }
  return url;
};

const generateId = () => Math.random().toString(36).substr(2, 9);

// Helper para contar likes/views com segurança
const getCount = (arr) => {
  if (!arr) return 0;
  return Array.isArray(arr) ? arr.length : 0;
};

// --- MODAIS AUXILIARES ---
const ConfirmationModal = ({
  title,
  message,
  onConfirm,
  onClose,
  isClosing,
}) => (
  <div className={`modal-backdrop-prod ${isClosing ? "closing" : ""}`}>
    <div
      className={`modal-content-prod small ${isClosing ? "closing" : ""}`}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="modal-header-prod">
        <h3>{title || "Confirmar"}</h3>
      </div>
      <p className="confirmation-text">{message}</p>
      <div className="modal-footer-prod confirmation">
        <button type="button" className="close-btn-prod" onClick={onClose}>
          Cancelar
        </button>
        <button
          type="button"
          className="save-btn-prod confirm"
          onClick={onConfirm}
        >
          <i className="fa-solid fa-check"></i> Confirmar
        </button>
      </div>
    </div>
  </div>
);

const CategoryManagerModal = ({ categories, onClose, onSave, isClosing }) => {
  const [newCategoryName, setNewCategoryName] = useState("");
  const handleAdd = async () => {
    if (!newCategoryName.trim()) return;
    try {
      await blogServices.createBlogCategory(newCategoryName);
      setNewCategoryName("");
      onSave();
    } catch {
      alert("Erro ao criar.");
    }
  };
  const handleDelete = async (id) => {
    if (window.confirm("Excluir categoria?")) {
      try {
        await blogServices.deleteBlogCategory(id);
        onSave();
      } catch {
        alert("Erro ao excluir.");
      }
    }
  };
  return (
    <div className={`modal-backdrop-prod ${isClosing ? "closing" : ""}`}>
      <div
        className={`modal-content-prod ${isClosing ? "closing" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header-prod">
          <h3>Categorias</h3>
        </div>
        <div className="category-manager-body">
          <div className="category-list">
            {categories.map((cat) => (
              <div key={cat.id} className="category-item">
                <span>{cat.categoryName}</span>
                <button onClick={() => handleDelete(cat.id)}>
                  <i className="fa-solid fa-trash-can"></i>
                </button>
              </div>
            ))}
          </div>
          <div className="add-category-form">
            <input
              type="text"
              placeholder="Nova categoria"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
            />
            <button className="save-btn-prod" onClick={handleAdd}>
              Adicionar
            </button>
          </div>
        </div>
        <div className="modal-footer-prod">
          <button className="close-btn-prod" onClick={onClose}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

// --- CMS PRINCIPAL ---
const PostModal = ({
  post,
  categories,
  onClose,
  onSave,
  onStatusChange,
  isClosing,
}) => {
  const isEditing = !!post;
  const textAreaRef = useRef(null);

  const DEFAULT_CTA_COLOR = "#122C4F";
  const DEFAULT_CTA_SIZE = 16; // px

  // --- 1. FUNÇÃO PURA DE PARSE (SEM SET STATE) ---
  const parseContentOnLoad = (htmlText) => {
    if (!htmlText) return { text: "", ctas: {}, prods: {} };
    let processed = htmlText;

    // Limpa visualização de links antigos
    processed = processed.replace(
      /<a href="([^"]+)" target="_blank" style="color: ([^;]+);[^>]*">([^<]+)<\/a>/g,
      "/*$3*/"
    );

    // Parse CTAs (Captura Cor e Tamanho)
    const ctaRegex =
      /<div style="text-align:center;margin:35px 0;"><a href="([^"]+)" target="_blank" style="display:inline-block;background:([^;]+);[^>]*font-size:([^;]+);[^>]*">([^<]+)<\/a><\/div>/g;

    const newCtas = {};
    processed = processed.replace(
      ctaRegex,
      (match, url, color, fontSizeStr, text) => {
        const id = generateId();
        let size = parseInt(fontSizeStr);
        if (isNaN(size)) size = DEFAULT_CTA_SIZE;
        if (fontSizeStr.includes("rem")) size = DEFAULT_CTA_SIZE;

        newCtas[id] = {
          id,
          text,
          url,
          color: color.trim(),
          fontSize: size,
        };
        return `\n(( 🔘 BOTÃO CTA: ${id} ))\n`;
      }
    );

    // Parse Produtos
    const prodRegex =
      /\[\[PRODUCT:id=(\d+)\|img=(true|false)\|name=(true|false)\|price=(true|false)\|btn=(true|false)\]\]/g;
    const newProds = {};
    processed = processed.replace(
      prodRegex,
      (match, id, img, name, price, btn) => {
        const uniqueKey = generateId();
        newProds[uniqueKey] = {
          uniqueKey,
          prodId: id,
          opts: {
            showImage: img === "true",
            showName: name === "true",
            showPrice: price === "true",
            showBtn: btn === "true",
          },
        };
        return `\n(( 🛍️ PRODUTO: ${uniqueKey} ))\n`;
      }
    );

    return { text: processed, ctas: newCtas, prods: newProds };
  };

  const parseLinksOnLoad = (htmlText) => {
    const links = {};
    if (!htmlText) return links;
    const regex =
      /<a href="([^"]+)" target="_blank" style="color: ([^;]+);[^>]*">([^<]+)<\/a>/g;
    let match;
    while ((match = regex.exec(htmlText)) !== null) {
      links[match[3]] = { url: match[1], color: match[2] };
    }
    return links;
  };

  // --- 2. INICIALIZAÇÃO COM USEMEMO (EVITA LOOP) ---
  const initialData = useMemo(() => {
    return parseContentOnLoad(isEditing ? post.text : "");
  }, [isEditing, post]);

  // States inicializados com os dados processados
  const [managedCtas, setManagedCtas] = useState(initialData.ctas);
  const [managedProducts, setManagedProducts] = useState(initialData.prods);

  const [formData, setFormData] = useState({
    title: isEditing ? post.title : "",
    text: initialData.text,
    categoryId: isEditing ? post.categoryId : "",
    imageUrls: isEditing && post.imageUrls ? post.imageUrls : [],
    redirectLink: isEditing ? post.redirectLink || "" : "",
    status: isEditing ? post.status : 1,
  });

  const [linkConfigs, setLinkConfigs] = useState(
    isEditing ? parseLinksOnLoad(post.text) : {}
  );
  const [detectedMarkers, setDetectedMarkers] = useState([]);
  const [charCount, setCharCount] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [activeTool, setActiveTool] = useState("none");

  // Tool States
  const [productSearch, setProductSearch] = useState("");
  const [productResults, setProductResults] = useState([]);
  const [selectedProductsToInsert, setSelectedProductsToInsert] = useState([]);
  const [searchingProd, setSearchingProd] = useState(false);
  const [prodOpts, setProdOpts] = useState({
    showImage: true,
    showName: true,
    showPrice: true,
    showBtn: true,
  });

  const [newCtaData, setNewCtaData] = useState({
    text: "SAIBA MAIS",
    url: "",
    color: DEFAULT_CTA_COLOR,
    fontSize: DEFAULT_CTA_SIZE,
  });

  // --- EFEITOS ---
  useEffect(() => {
    setCharCount(formData.text.length);
    const matches = [...formData.text.matchAll(/\/\*(.*?)\*\//g)].map(
      (m) => m[1]
    );
    setDetectedMarkers(matches);
    setLinkConfigs((prev) => {
      const newConfigs = { ...prev };
      matches.forEach((text) => {
        if (!newConfigs[text]) newConfigs[text] = { url: "", color: "#3b82f6" };
      });
      return newConfigs;
    });
  }, [formData.text]);

  // --- PREPARE FOR SAVE (Marcador -> HTML) ---
  const prepareContentForSave = (editorText) => {
    let processed = editorText;

    // 1. Links
    detectedMarkers.forEach((marker) => {
      const conf = linkConfigs[marker] || { url: "#", color: "red" };
      const safeUrl = ensureProtocol(conf.url);
      const htmlLink = `<a href="${safeUrl}" target="_blank" style="color: ${conf.color}; font-weight: 600; text-decoration: underline;">${marker}</a>`;
      processed = processed.split(`/*${marker}*/`).join(htmlLink);
    });

    // 2. CTAs
    Object.values(managedCtas).forEach((cta) => {
      const marker = `(( 🔘 BOTÃO CTA: ${cta.id} ))`;
      if (processed.includes(marker)) {
        const safeUrl = ensureProtocol(cta.url);
        const sizePx = cta.fontSize || DEFAULT_CTA_SIZE;
        const bgColor = cta.color || DEFAULT_CTA_COLOR;

        // Padding dinâmico para manter proporção
        const padY = Math.round(sizePx * 0.75);
        const padX = Math.round(sizePx * 2.5);

        const html = `<div style="text-align:center;margin:35px 0;"><a href="${safeUrl}" target="_blank" style="display:inline-block;background:${bgColor};color:#ffffff;padding:${padY}px ${padX}px;border-radius:8px;text-decoration:none;font-weight:600;font-size:${sizePx}px;box-shadow:0 4px 10px rgba(0,0,0,0.2);font-family:'Poppins',sans-serif;transition:transform 0.2s;">${cta.text.toUpperCase()}</a></div>`;
        processed = processed.replace(marker, html);
      }
    });
    processed = processed.replace(/\(\( 🔘 BOTÃO CTA: [a-zA-Z0-9]+ \)\)/g, "");

    // 3. Produtos
    Object.values(managedProducts).forEach((prod) => {
      const marker = `(( 🛍️ PRODUTO: ${prod.uniqueKey} ))`;
      if (processed.includes(marker)) {
        const shortcode = `[[PRODUCT:id=${prod.prodId}|img=${prod.opts.showImage}|name=${prod.opts.showName}|price=${prod.opts.showPrice}|btn=${prod.opts.showBtn}]]`;
        processed = processed.replace(marker, shortcode);
      }
    });
    processed = processed.replace(/\(\( 🛍️ PRODUTO: [a-zA-Z0-9]+ \)\)/g, "");

    return processed.replace(/\n/g, "<br/>");
  };

  const insertAtCursor = (content) => {
    const input = textAreaRef.current;
    if (!input) return;
    const start = input.selectionStart;
    const end = input.selectionEnd;
    const newText =
      formData.text.substring(0, start) +
      content +
      formData.text.substring(end);
    setFormData((prev) => ({ ...prev, text: newText }));
    setTimeout(() => {
      input.selectionStart = input.selectionEnd = start + content.length;
      input.focus();
    }, 0);
  };

  // --- ACTIONS ---
  const insertLinkMarker = () => {
    const input = textAreaRef.current;
    let textTomark = "texto aqui";
    if (input && input.selectionStart !== input.selectionEnd) {
      textTomark = formData.text.substring(
        input.selectionStart,
        input.selectionEnd
      );
    }
    insertAtCursor(`/*${textTomark}*/`);
    setActiveTool("links");
  };

  const updateLinkConfig = (marker, field, value) => {
    setLinkConfigs((prev) => ({
      ...prev,
      [marker]: { ...prev[marker], [field]: value },
    }));
  };

  // Produtos
  useEffect(() => {
    const delay = setTimeout(async () => {
      if (productSearch.length > 2) {
        setSearchingProd(true);
        try {
          const res = await blogServices.searchProducts(productSearch);
          setProductResults(res.items || []);
        } catch (err) {
          console.error(err);
        } finally {
          setSearchingProd(false);
        }
      } else {
        setProductResults([]);
      }
    }, 600);
    return () => clearTimeout(delay);
  }, [productSearch]);

  const toggleProductSelection = (prod) => {
    if (selectedProductsToInsert.find((p) => p.id === prod.id)) {
      setSelectedProductsToInsert((prev) =>
        prev.filter((p) => p.id !== prod.id)
      );
    } else {
      setSelectedProductsToInsert((prev) => [...prev, prod]);
    }
  };

  const insertProducts = () => {
    if (selectedProductsToInsert.length === 0) return;
    let markersOutput = "";
    const newManagedProds = { ...managedProducts };
    selectedProductsToInsert.forEach((prod) => {
      const uniqueKey = generateId();
      newManagedProds[uniqueKey] = {
        uniqueKey,
        prodId: prod.id,
        opts: { ...prodOpts },
      };
      markersOutput += `\n(( 🛍️ PRODUTO: ${uniqueKey} ))\n`;
    });
    setManagedProducts(newManagedProds);
    insertAtCursor(markersOutput);
    setSelectedProductsToInsert([]);
    setProductSearch("");
  };

  const removeManagedProduct = (uniqueKey) => {
    const marker = `(( 🛍️ PRODUTO: ${uniqueKey} ))`;
    const newText = formData.text.replace(marker, "");
    const newManaged = { ...managedProducts };
    delete newManaged[uniqueKey];
    setFormData((prev) => ({ ...prev, text: newText }));
    setManagedProducts(newManaged);
  };

  // CTA
  const insertCta = () => {
    const id = generateId();
    const newCta = { id, ...newCtaData };
    setManagedCtas((prev) => ({ ...prev, [id]: newCta }));
    insertAtCursor(`\n(( 🔘 BOTÃO CTA: ${id} ))\n`);
    setNewCtaData({
      text: "SAIBA MAIS",
      url: "",
      color: DEFAULT_CTA_COLOR,
      fontSize: DEFAULT_CTA_SIZE,
    });
  };

  const updateManagedCta = (id, field, value) => {
    setManagedCtas((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const removeManagedCta = (id) => {
    const marker = `(( 🔘 BOTÃO CTA: ${id} ))`;
    let newText = formData.text
      .replace(`\n${marker}\n`, "")
      .replace(marker, "");
    setFormData((prev) => ({ ...prev, text: newText }));
    const newManaged = { ...managedCtas };
    delete newManaged[id];
    setManagedCtas(newManaged);
  };

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const url = await blogServices.uploadPostImage(file);
      // Aqui está a mudança: removemos o "...prev.imageUrls" para substituir
      setFormData((prev) => ({
        ...prev,
        imageUrls: [url],
      }));
    } catch {
      alert("Erro no upload");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = () => {
    const finalText = prepareContentForSave(formData.text);
    const data = {
      ...formData,
      text: finalText,
      imageUrls: formData.imageUrls.filter((u) => u.trim() !== ""),
      categoryId: Number(formData.categoryId),
      status: Number(formData.status),
      redirectLink: formData.redirectLink
        ? ensureProtocol(formData.redirectLink.trim())
        : null,
    };
    onSave(data, isEditing);
  };

  const renderActionButtons = () => {
    if (!isEditing) {
      return (
        <div className="action-buttons-group">
          <button className="close-btn-prod" onClick={onClose}>
            Fechar
          </button>
          <button className="save-btn-prod" onClick={handleSave}>
            <i className="fa-solid fa-save"></i> Criar e Arquivar
          </button>
        </div>
      );
    }
    const currentStatus = formData.status;
    return (
      <div className="footer-actions-container">
        <div className="left-actions">
          <button className="close-btn-prod" onClick={onClose}>
            Fechar
          </button>
          <button
            className="delete-btn-prod"
            onClick={() => onStatusChange(post.id, 4)}
          >
            <i className="fa-solid fa-trash-can"></i> Excluir
          </button>
        </div>
        <div className="right-actions">
          {currentStatus === 1 && (
            <>
              <button
                className="status-btn publish"
                onClick={() => onStatusChange(post.id, 2)}
              >
                <i className="fa-solid fa-upload"></i> Publicar
              </button>
              <button
                className="status-btn cancel"
                onClick={() => onStatusChange(post.id, 3)}
              >
                <i className="fa-solid fa-ban"></i> Cancelar
              </button>
            </>
          )}
          {currentStatus === 2 && (
            <>
              <button
                className="status-btn archive"
                onClick={() => onStatusChange(post.id, 1)}
              >
                <i className="fa-solid fa-box-archive"></i> Arquivar
              </button>
              <button
                className="status-btn cancel"
                onClick={() => onStatusChange(post.id, 3)}
              >
                <i className="fa-solid fa-ban"></i> Cancelar
              </button>
            </>
          )}
          {currentStatus === 3 && (
            <>
              <button
                className="status-btn publish"
                onClick={() => onStatusChange(post.id, 2)}
              >
                <i className="fa-solid fa-upload"></i> Publicar
              </button>
              <button
                className="status-btn archive"
                onClick={() => onStatusChange(post.id, 1)}
              >
                <i className="fa-solid fa-box-archive"></i> Arquivar
              </button>
            </>
          )}
          <button className="save-btn-prod" onClick={handleSave}>
            <i className="fa-solid fa-save"></i> Salvar Alterações
          </button>
        </div>
      </div>
    );
  };

  const PagePreview = () => {
    const renderPreviewHtml = (text) =>
      prepareContentForSave(text).replace(
        /\[\[PRODUCT:.*?\]\]/g,
        '<div style="background:#f1f5f9;padding:20px;text-align:center;border:1px dashed #ccc;margin:10px 0;"><i class="fa-solid fa-gem"></i> Produto inserido (Shortcode)</div>'
      );
    return (
      <div className="preview-box grow">
        <div className="preview-header">Prévia da Página</div>
        <div className="preview-page-frame web">
          <div
            className="post-hero-preview"
            style={{
              backgroundImage: `url(${
                formData.imageUrls[0] || "https://placehold.co/600"
              })`,
            }}
          >
            <div className="hero-overlay"></div>
            <div className="hero-content">
              <h1>{formData.title || "Título Principal"}</h1>
            </div>
          </div>
          <div
            className="post-body-preview"
            dangerouslySetInnerHTML={{
              __html: renderPreviewHtml(formData.text),
            }}
          />
        </div>
      </div>
    );
  };

  const activeCtas = Object.values(managedCtas).filter((cta) =>
    formData.text.includes(cta.id)
  );
  const activeProds = Object.values(managedProducts).filter((p) =>
    formData.text.includes(p.uniqueKey)
  );

  return (
    <div
      className={`modal-backdrop-prod full-screen ${
        isClosing ? "closing" : ""
      }`}
    >
      <div
        className={`modal-content-prod full-screen ${
          isClosing ? "closing" : ""
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header-prod">
          <h3>{isEditing ? "Editar Artigo" : "Criar Artigo"}</h3>
          <button className="close-btn-prod" onClick={onClose}>
            <i className="fa-solid fa-times"></i>
          </button>
        </div>

        <div className="split-layout">
          <div className="editor-pane">
            <div className="toolbar-cms">
              <button
                className={`tool-btn ${activeTool === "links" ? "active" : ""}`}
                onClick={() =>
                  setActiveTool(activeTool === "links" ? "none" : "links")
                }
              >
                <i className="fa-solid fa-link"></i> Links
              </button>
              <button
                className={`tool-btn highlighted ${
                  activeTool === "products" ? "active" : ""
                }`}
                onClick={() =>
                  setActiveTool(activeTool === "products" ? "none" : "products")
                }
              >
                <i className="fa-solid fa-gem"></i> Produtos (
                {activeProds.length})
              </button>
              <button
                className={`tool-btn ${activeTool === "cta" ? "active" : ""}`}
                onClick={() =>
                  setActiveTool(activeTool === "cta" ? "none" : "cta")
                }
              >
                <i className="fa-solid fa-bullhorn"></i> Botões CTA (
                {activeCtas.length})
              </button>
            </div>

            {activeTool === "links" && (
              <div className="tool-drawer links-manager">
                <div className="drawer-header">
                  <h4>
                    <i className="fa-solid fa-link"></i> Gerenciador de Links
                  </h4>
                  <button
                    className="manual-insert-btn"
                    onClick={insertLinkMarker}
                  >
                    + Link na Seleção
                  </button>
                </div>
                {detectedMarkers.length === 0 ? (
                  <div className="empty-state">
                    Nenhum link marcado (/*texto*/) encontrado.
                  </div>
                ) : (
                  <div className="links-list-scroll">
                    {detectedMarkers.map((marker, idx) => (
                      <div key={idx} className="link-config-item">
                        <div className="marker-label">
                          Texto: <b>{marker}</b>
                        </div>
                        <div className="link-inputs">
                          <input
                            type="text"
                            className="cms-input-mini"
                            placeholder="ex: google.com"
                            value={linkConfigs[marker]?.url || ""}
                            onChange={(e) =>
                              updateLinkConfig(marker, "url", e.target.value)
                            }
                          />
                          <input
                            type="color"
                            className="cms-color-picker"
                            value={linkConfigs[marker]?.color || "#3b82f6"}
                            onChange={(e) =>
                              updateLinkConfig(marker, "color", e.target.value)
                            }
                            title="Cor"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTool === "products" && (
              <div className="tool-drawer">
                <h4>Gerenciar Produtos Inseridos</h4>
                {activeProds.length > 0 && (
                  <div className="active-items-list">
                    {activeProds.map((p) => (
                      <div key={p.uniqueKey} className="active-item-card">
                        <div className="item-header">
                          <span>
                            <i className="fa-solid fa-tag"></i> ID: {p.prodId}
                          </span>
                          <button
                            onClick={() => removeManagedProduct(p.uniqueKey)}
                            className="delete-icon-btn"
                          >
                            <i className="fa-solid fa-trash"></i>
                          </button>
                        </div>
                        <div className="item-body-simple">
                          <small>
                            Opções:{" "}
                            {[
                              p.opts.showImage && "Foto",
                              p.opts.showName && "Nome",
                              p.opts.showPrice && "Preço",
                            ]
                              .filter(Boolean)
                              .join(", ")}
                          </small>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <hr className="drawer-divider" />
                <h4>Inserir Novo Produto</h4>
                {selectedProductsToInsert.length > 0 && (
                  <div className="selected-products-box">
                    <div className="box-title">
                      Selecionados ({selectedProductsToInsert.length})
                    </div>
                    <div className="selected-list">
                      {selectedProductsToInsert.map((p) => (
                        <div key={p.id} className="selected-item-row">
                          <img
                            src={p.mediaUrls?.[0] || "https://placehold.co/40"}
                            alt=""
                          />
                          <div className="s-info">
                            <span className="s-name">{p.name}</span>
                            <span className="s-price">
                              R${" "}
                              {p.value.toLocaleString("pt-BR", {
                                minimumFractionDigits: 2,
                              })}
                            </span>
                          </div>
                          <button
                            onClick={() => toggleProductSelection(p)}
                            className="remove-item-btn"
                          >
                            <i className="fa-solid fa-times"></i>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="search-prod-wrapper">
                  <i className="fa-solid fa-search"></i>
                  <input
                    type="text"
                    placeholder="Buscar produto..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                  />
                </div>
                <div className="display-options">
                  <label>
                    <input
                      type="checkbox"
                      checked={prodOpts.showImage}
                      onChange={(e) =>
                        setProdOpts({
                          ...prodOpts,
                          showImage: e.target.checked,
                        })
                      }
                    />{" "}
                    Foto
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={prodOpts.showName}
                      onChange={(e) =>
                        setProdOpts({ ...prodOpts, showName: e.target.checked })
                      }
                    />{" "}
                    Nome
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={prodOpts.showPrice}
                      onChange={(e) =>
                        setProdOpts({
                          ...prodOpts,
                          showPrice: e.target.checked,
                        })
                      }
                    />{" "}
                    Preço
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={prodOpts.showBtn}
                      onChange={(e) =>
                        setProdOpts({ ...prodOpts, showBtn: e.target.checked })
                      }
                    />{" "}
                    Botão
                  </label>
                </div>
                {searchingProd ? (
                  <small className="searching-lbl">Buscando...</small>
                ) : (
                  <div className="prod-results">
                    {productResults.map((p) => (
                      <div
                        key={p.id}
                        className={`prod-item ${
                          selectedProductsToInsert.find((x) => x.id === p.id)
                            ? "selected"
                            : ""
                        }`}
                        onClick={() => toggleProductSelection(p)}
                      >
                        <img src={p.mediaUrls?.[0]} alt="" />
                        <div className="prod-info">
                          <span>{p.name}</span>
                          <small>
                            R${" "}
                            {p.value.toLocaleString("pt-BR", {
                              minimumFractionDigits: 2,
                            })}
                          </small>
                        </div>
                        {selectedProductsToInsert.find((x) => x.id === p.id) ? (
                          <i className="fa-solid fa-check-circle selected-icon"></i>
                        ) : (
                          <i className="fa-regular fa-circle unselected-icon"></i>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                <button
                  className="confirm-insert block"
                  disabled={selectedProductsToInsert.length === 0}
                  onClick={insertProducts}
                >
                  Inserir
                </button>
              </div>
            )}

            {activeTool === "cta" && (
              <div className="tool-drawer">
                <h4>Gerenciar Botões CTA</h4>
                {activeCtas.length > 0 ? (
                  <div className="active-items-list">
                    {activeCtas.map((cta) => (
                      <div key={cta.id} className="active-item-card">
                        <div className="item-header">
                          <span style={{ color: cta.color }}>
                            Botão Personalizado
                          </span>
                          <button
                            onClick={() => removeManagedCta(cta.id)}
                            className="delete-icon-btn"
                          >
                            <i className="fa-solid fa-trash"></i>
                          </button>
                        </div>
                        <div className="item-body-inputs">
                          <input
                            type="text"
                            className="cms-input-mini"
                            placeholder="Texto"
                            value={cta.text}
                            onChange={(e) =>
                              updateManagedCta(cta.id, "text", e.target.value)
                            }
                          />
                          <input
                            type="text"
                            className="cms-input-mini"
                            placeholder="Link URL"
                            value={cta.url}
                            onChange={(e) =>
                              updateManagedCta(cta.id, "url", e.target.value)
                            }
                          />
                          <div className="link-inputs">
                            <div className="flex-col" style={{ flex: 1 }}>
                              <label className="mini-lbl">Tamanho (px)</label>
                              <input
                                type="number"
                                className="cms-input-mini"
                                value={cta.fontSize}
                                onChange={(e) =>
                                  updateManagedCta(
                                    cta.id,
                                    "fontSize",
                                    parseInt(e.target.value)
                                  )
                                }
                              />
                            </div>
                            <div className="flex-col">
                              <label className="mini-lbl">Cor</label>
                              <input
                                type="color"
                                className="cms-color-picker"
                                value={cta.color}
                                onChange={(e) =>
                                  updateManagedCta(
                                    cta.id,
                                    "color",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">Nenhum botão inserido.</div>
                )}

                <hr className="drawer-divider" />
                <h4>Inserir Novo CTA</h4>
                <input
                  type="text"
                  className="cms-input"
                  placeholder="Texto (ex: COMPRAR)"
                  value={newCtaData.text}
                  onChange={(e) =>
                    setNewCtaData({ ...newCtaData, text: e.target.value })
                  }
                />
                <input
                  type="text"
                  className="cms-input"
                  placeholder="URL (ex: google.com)"
                  value={newCtaData.url}
                  onChange={(e) =>
                    setNewCtaData({ ...newCtaData, url: e.target.value })
                  }
                />

                <div className="form-group-row">
                  <div className="flex-col" style={{ flex: 1 }}>
                    <label className="mini-lbl">Tamanho da Fonte (px)</label>
                    <input
                      type="number"
                      className="cms-input"
                      value={newCtaData.fontSize}
                      onChange={(e) =>
                        setNewCtaData({
                          ...newCtaData,
                          fontSize: parseInt(e.target.value) || 16,
                        })
                      }
                    />
                  </div>
                  <div className="flex-col">
                    <label className="mini-lbl">Cor de Fundo</label>
                    <div className="color-picker-wrapper">
                      <input
                        type="color"
                        className="cms-color-picker big"
                        value={newCtaData.color}
                        onChange={(e) =>
                          setNewCtaData({
                            ...newCtaData,
                            color: e.target.value,
                          })
                        }
                      />
                      <span>{newCtaData.color}</span>
                    </div>
                  </div>
                </div>
                <button
                  className="confirm-insert block"
                  disabled={!newCtaData.url}
                  onClick={insertCta}
                >
                  Inserir Botão no Cursor
                </button>
              </div>
            )}

            <div className="form-group-prod">
              <label>Título do Post</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="cms-select title-input"
              />
            </div>
            <div className="form-row-prod">
              <div className="form-group-prod half">
                <label>Categoria</label>
                <select
                  className="cms-select"
                  value={formData.categoryId}
                  onChange={(e) =>
                    setFormData({ ...formData, categoryId: e.target.value })
                  }
                >
                  <option value="">Selecione uma categoria</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.categoryName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group-prod half">
                <label>Imagem de Capa</label>
                <div className="file-importer">
                  <input
                    type="text"
                    readOnly
                    className="cms-select"
                    value={formData.imageUrls[0] || ""}
                    placeholder="Nenhuma imagem"
                  />

                  {/* ✨ NOVO: Botão de remover imagem (Aparece apenas se existir uma imagem) */}
                  {formData.imageUrls.length > 0 && (
                    <button
                      type="button"
                      className="delete-img-btn"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, imageUrls: [] }))
                      }
                      title="Remover imagem"
                    >
                      <i className="fa-solid fa-trash-can"></i>
                    </button>
                  )}

                  <label className="upload-icon">
                    {isUploading ? (
                      <i className="fa-solid fa-spinner fa-spin"></i>
                    ) : (
                      <i className="fa-solid fa-upload"></i>
                    )}
                    <input type="file" hidden onChange={handleFile} />
                  </label>
                </div>
              </div>
            </div>
            <div className="form-group-prod big-text">
              <div className="text-header">
                <label>Conteúdo</label> <span>{charCount} caracteres</span>
              </div>
              <textarea
                ref={textAreaRef}
                value={formData.text}
                onChange={(e) =>
                  setFormData({ ...formData, text: e.target.value })
                }
                className="cms-textarea"
                placeholder="Escreva seu artigo aqui..."
              ></textarea>
            </div>
          </div>
          <div className="preview-pane">
            <div className="preview-box">
              <div className="preview-header">Prévia do Card</div>
              <div className="blog-horizontal-card preview container-fake">
                <div className="horizontal-card-image-wrapper">
                  <img
                    src={formData.imageUrls[0] || "https://placehold.co/400"}
                    alt=""
                    className="horizontal-card-img"
                  />
                </div>
                <div className="horizontal-card-content">
                  <div className="card-header">
                    <span className="card-date">HOJE</span>
                  </div>
                  <h3 className="card-title">
                    {formData.title || "Título do Artigo"}
                  </h3>
                  <p className="card-excerpt">
                    {formData.text
                      ? formData.text
                          .replace(/\[\[.*?\]\]/g, "")
                          .replace(/\/\*|\*\//g, "")
                          .replace(/<[^>]*>?/gm, "")
                          .substring(0, 120) + "..."
                      : "Resumo..."}
                  </p>
                </div>
              </div>
            </div>
            <div className="divider-preview"></div>
            <PagePreview />
          </div>
        </div>

        <div className="modal-footer-prod">{renderActionButtons()}</div>
      </div>
    </div>
  );
};

function BlogAdminPage() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tab, setTab] = useState(2);
  const [modal, setModal] = useState({ type: null, data: null });
  const [term, setTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isClosing, setIsClosing] = useState(false);
  const { startLoading, stopLoading } = useLoad();

  const fetchCats = useCallback(async () => {
    try {
      setCategories((await blogServices.getBlogCategories()) || []);
    } catch {}
  }, []);

  const fetchPosts = useCallback(async () => {
    startLoading();
    try {
      const res = await blogServices.searchPosts({
        status: tab,
        searchTerm: term,
        pageNumber: page,
        pageSize: ITEMS_PER_PAGE,
      });
      setPosts(res.items || []);
      setTotalPages(res.totalPages || 1);
    } catch {
      setPosts([]);
    } finally {
      stopLoading();
    }
  }, [tab, term, page]);

  useEffect(() => {
    fetchCats();
  }, [fetchCats]);
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const openModal = (type, data = null) => setModal({ type, data });
  const closeModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setModal({ type: null, data: null });
      setIsClosing(false);
    }, 300);
  };

  const savePost = async (data, edit) => {
    try {
      edit
        ? await blogServices.updatePost(modal.data.id, data)
        : await blogServices.createPost(data);
      closeModal();
      fetchPosts();
    } catch {
      alert("Erro ao salvar");
    }
  };
  const changeStatus = async (id, st) => {
    if (st === 4 && !window.confirm("Excluir permanentemente?")) return;
    await blogServices.updatePostStatus(id, st);
    closeModal();
    fetchPosts();
  };

  // Handlers de Paginação e Tab
  const handleTabChange = (newTab) => {
    setTab(newTab);
    setPage(1);
  };
  const handleNextPage = () => {
    if (page < totalPages) setPage((prev) => prev + 1);
  };
  const handlePrevPage = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  return (
    <div className="products-page-container">
      <header className="products-page-header">
        <h1>Gerenciador de Blog</h1>
        <p>Gerencie seus posts e conteúdos.</p>
      </header>
      <div className="tabs-container">
        <button
          className={`tab-button ${tab === 2 ? "active" : ""}`}
          onClick={() => handleTabChange(2)}
        >
          Ativos
        </button>
        <button
          className={`tab-button ${tab === 1 ? "active" : ""}`}
          onClick={() => handleTabChange(1)}
        >
          Arquivados
        </button>
        <button
          className={`tab-button ${tab === 3 ? "active" : ""}`}
          onClick={() => handleTabChange(3)}
        >
          Cancelados
        </button>
      </div>
      <div className="product-controls-wrapper">
        <div className="product-controls">
          <button
            className="create-product-button secondary"
            onClick={() => openModal("cats")}
          >
            {" "}
            Categorias
          </button>
          <div style={{ flex: 1 }}></div>
          <button
            className="create-product-button"
            onClick={() => openModal("create")}
          >
            <i className="fa-solid fa-plus"></i> Novo Post
          </button>
        </div>
      </div>
      <div className="products-table-card">
        <table className="products-table">
          <thead>
            <tr>
              <th>Artigo</th>
              <th>Categoria</th>
              <th style={{ textAlign: "center" }}>Engajamento</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((p) => (
              <tr key={p.id} onClick={() => openModal("edit", p)}>
                <td>
                  <div className="product-info-cell">
                    <img
                      src={p.imageUrls?.[0] || "https://placehold.co/50"}
                      alt=""
                    />{" "}
                    <span>{p.title}</span>
                  </div>
                </td>
                <td>
                  {categories.find((c) => c.id === p.categoryId)?.categoryName}
                </td>
                <td style={{ textAlign: "center" }}>
                  <div className="metrics-cell">
                    <span title="Curtidas">
                      <i className="fa-solid fa-heart"></i> {getCount(p.likes)}
                    </span>
                    <span title="Visualizações">
                      <i className="fa-solid fa-eye"></i> {getCount(p.views)}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* PAGINAÇÃO */}
        {posts.length > 0 && (
          <div className="pagination-footer">
            <button
              className="page-btn"
              disabled={page === 1}
              onClick={handlePrevPage}
            >
              <i className="fa-solid fa-chevron-left"></i> Anterior
            </button>
            <span className="page-info">
              Página {page} de {totalPages}
            </span>
            <button
              className="page-btn"
              disabled={page === totalPages}
              onClick={handleNextPage}
            >
              Próxima <i className="fa-solid fa-chevron-right"></i>
            </button>
          </div>
        )}
      </div>
      {(modal.type === "create" || modal.type === "edit") && (
        <PostModal
          post={modal.data}
          categories={categories}
          onClose={closeModal}
          onSave={savePost}
          onStatusChange={changeStatus}
          isClosing={isClosing}
        />
      )}
      {modal.type === "cats" && (
        <CategoryManagerModal
          categories={categories}
          onClose={closeModal}
          onSave={fetchCats}
          isClosing={isClosing}
        />
      )}
    </div>
  );
}
export default BlogAdminPage;
