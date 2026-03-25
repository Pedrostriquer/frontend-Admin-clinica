import React, { useState, useEffect } from "react";
import BlogGemCapitalContainer from "./BlogGemCapitalContainer";
import PixelsList from "./PixelsList";
import CreatePixelModal from "./CreatePixelModal";
import gemCapitalBlogServices from "../../../dbServices/gemCapitalBlogServices";

const PixelsPage = () => {
  const [pixels, setPixels] = useState([]);
  const [categories, setCategories] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreatePixelModal, setShowCreatePixelModal] = useState(false);
  const [editingPixel, setEditingPixel] = useState(null);
  const [isLoadingPixel, setIsLoadingPixel] = useState(false);
  const [loadingPixelId, setLoadingPixelId] = useState(null);

  // Fetch data ao montar
  useEffect(() => {
    fetchPixels();
    fetchCategories();
    fetchPosts();
  }, []);

  const fetchPixels = async () => {
    try {
      setLoading(true);
      const data = await gemCapitalBlogServices.getAllPixels();
      setPixels(data);
    } catch (error) {
      console.error("Erro ao buscar pixels:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await gemCapitalBlogServices.getAllCategories();
      setCategories(data);
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
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

  const handleCreatePixel = () => {
    setEditingPixel(null);
    setShowCreatePixelModal(true);
  };

  const handleEditPixel = (pixel) => {
    setEditingPixel(pixel);
    setShowCreatePixelModal(true);
  };

  const handleSavePixel = async (pixelData) => {
    setIsLoadingPixel(true);
    try {
      if (editingPixel) {
        await gemCapitalBlogServices.updatePixel(editingPixel.id, pixelData);
      } else {
        await gemCapitalBlogServices.createPixel(pixelData);
      }
      await fetchPixels();
      setShowCreatePixelModal(false);
      alert(editingPixel ? "Pixel atualizado!" : "Pixel criado!");
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao salvar pixel");
    } finally {
      setIsLoadingPixel(false);
    }
  };

  const handleDeletePixel = async (pixelId) => {
    if (!window.confirm("Tem certeza que deseja deletar este pixel?")) return;

    try {
      await gemCapitalBlogServices.deletePixel(pixelId);
      await fetchPixels();
      alert("Pixel deletado com sucesso!");
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao deletar pixel");
    }
  };

  const handleTogglePixel = async (pixelId, currentStatus) => {
    setLoadingPixelId(pixelId);
    try {
      await gemCapitalBlogServices.togglePixelStatus(pixelId, !currentStatus);
      await fetchPixels();
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao atualizar pixel");
    } finally {
      setLoadingPixelId(null);
    }
  };

  return (
    <BlogGemCapitalContainer counts={{ posts: posts.length, categories: categories.length, pixels: pixels.length }}>
      <PixelsList
        pixels={pixels}
        loading={loading}
        onCreatePixel={handleCreatePixel}
        onEditPixel={handleEditPixel}
        onDeletePixel={handleDeletePixel}
        onTogglePixel={handleTogglePixel}
        loadingPixelId={loadingPixelId}
      />

      {showCreatePixelModal && (
        <CreatePixelModal
          pixel={editingPixel}
          onClose={() => setShowCreatePixelModal(false)}
          onSave={handleSavePixel}
          isLoading={isLoadingPixel}
        />
      )}
    </BlogGemCapitalContainer>
  );
};

export default PixelsPage;
