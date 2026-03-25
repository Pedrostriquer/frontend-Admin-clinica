import React, { useState, useEffect } from "react";
import BlogGemCapitalContainer from "./BlogGemCapitalContainer";
import CategoriesList from "./CategoriesList";
import CreateCategoryModal from "./CreateCategoryModal";
import gemCapitalBlogServices from "../../../dbServices/gemCapitalBlogServices";

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateCategoryModal, setShowCreateCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [isLoadingCategory, setIsLoadingCategory] = useState(false);

  // Fetch data ao montar
  useEffect(() => {
    fetchCategories();
    fetchPosts();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await gemCapitalBlogServices.getAllCategories();
      setCategories(data);
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPosts = async () => {
    try {
      const data = await gemCapitalBlogServices.getAllPosts();
      setPosts(data);
    } catch (error) {
      console.error("Erro ao buscar posts:", error);
    }
  };

  const handleCreateCategory = () => {
    setEditingCategory(null);
    setShowCreateCategoryModal(true);
  };

  const handleEditCategory = async (category) => {
    setEditingCategory(category);
    setShowCreateCategoryModal(true);
  };

  const handleSaveCategory = async (categoryData) => {
    setIsLoadingCategory(true);
    try {
      if (editingCategory) {
        await gemCapitalBlogServices.updateCategory(editingCategory.id, categoryData);
      } else {
        await gemCapitalBlogServices.createCategory(categoryData);
      }
      await fetchCategories();
      setShowCreateCategoryModal(false);
      alert(editingCategory ? "Categoria atualizada!" : "Categoria criada!");
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao salvar categoria");
    } finally {
      setIsLoadingCategory(false);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm("Tem certeza que deseja deletar esta categoria?")) return;

    try {
      await gemCapitalBlogServices.deleteCategory(categoryId);
      await fetchCategories();
      alert("Categoria deletada com sucesso!");
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao deletar categoria");
    }
  };

  return (
    <BlogGemCapitalContainer counts={{ posts: posts.length, categories: categories.length }}>
      <CategoriesList
        categories={categories}
        loading={loading}
        onCreateCategory={handleCreateCategory}
        onEditCategory={handleEditCategory}
        onDeleteCategory={handleDeleteCategory}
      />

      {showCreateCategoryModal && (
        <CreateCategoryModal
          category={editingCategory}
          onClose={() => setShowCreateCategoryModal(false)}
          onSave={handleSaveCategory}
          isLoading={isLoadingCategory}
          totalCategories={categories.length}
        />
      )}
    </BlogGemCapitalContainer>
  );
};

export default CategoriesPage;
