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
import PostModal from "./PostModal/PostModal";
import AddsManager from "./AddsManager/AddsManager";

const ITEMS_PER_PAGE = 10;

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
    if (tab === 4) return;
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
        <button
          className={`tab-button ${tab === 4 ? "active" : ""}`}
          onClick={() => setTab(4)}
        >
          Adds
        </button>
      </div>

      {tab === 4 ? (
        <>
          <AddsManager />
        </>
      ) : (
        <>
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
                      {
                        categories.find((c) => c.id === p.categoryId)
                          ?.categoryName
                      }
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <div className="metrics-cell">
                        <span title="Curtidas">
                          <i className="fa-solid fa-heart"></i>{" "}
                          {getCount(p.likes)}
                        </span>
                        <span title="Visualizações">
                          <i className="fa-solid fa-eye"></i>{" "}
                          {getCount(p.views)}
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
        </>
      )}
    </div>
  );
}
export default BlogAdminPage;
