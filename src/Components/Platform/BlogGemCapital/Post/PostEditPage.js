import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BlogGemCapitalContainer from "../BlogGemCapitalContainer";
import PostForm from "./PostForm";
import gemCapitalBlogServices from "../../../../dbServices/gemCapitalBlogServices";

const PostEditPage = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [categories, setCategories] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(postId && postId !== "novo-post" ? true : false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategories();
    fetchPosts();
    if (postId && postId !== "novo-post") {
      loadPost();
    }
  }, [postId]);

  const loadPost = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await gemCapitalBlogServices.getPostById(postId);
      setPost(data);
    } catch (err) {
      console.error("Erro ao carregar post:", err);
      setError("Erro ao carregar o post. Tente novamente.");
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

  const handleSavePost = async (formData) => {
    setIsSaving(true);
    try {
      if (postId && postId !== "novo-post") {
        // Editando
        await gemCapitalBlogServices.updatePost(postId, formData);
        alert("Post atualizado com sucesso!");
        navigate(`/platform/blog-gemcapital/posts/${postId}`);
      } else {
        // Criando novo
        const newPost = await gemCapitalBlogServices.createPost(formData);
        alert("Post criado com sucesso!");
        navigate(`/platform/blog-gemcapital/posts/${newPost.id}`);
      }
    } catch (err) {
      console.error("Erro ao salvar post:", err);
      alert("Erro ao salvar post. Tente novamente.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleBack = () => {
    if (postId && postId !== "novo-post") {
      navigate(`/platform/blog-gemcapital/posts/${postId}`);
    } else {
      navigate("/platform/blog-gemcapital/posts");
    }
  };

  if (loading) {
    return (
      <BlogGemCapitalContainer>
        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
        }}>
          <div style={{ fontSize: "16px", color: "#8892a0" }}>
            Carregando post...
          </div>
        </div>
      </BlogGemCapitalContainer>
    );
  }

  if (error) {
    return (
      <BlogGemCapitalContainer>
        <div style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
          gap: "20px",
        }}>
          <div style={{ fontSize: "16px", color: "#ff4444" }}>
            {error}
          </div>
          <button
            onClick={handleBack}
            style={{
              padding: "10px 20px",
              backgroundColor: "#122C4F",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "600",
            }}
          >
            Voltar
          </button>
        </div>
      </BlogGemCapitalContainer>
    );
  }

  return (
    <BlogGemCapitalContainer>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
        }}>
          <h2 style={{
            fontSize: "24px",
            fontWeight: "700",
            color: "#122C4F",
            margin: 0,
          }}>
            {postId ? "Editar Post" : "Novo Post"}
          </h2>
          <button
            onClick={handleBack}
            style={{
              padding: "10px 16px",
              backgroundColor: "transparent",
              color: "#122C4F",
              border: "1px solid #e0e6ed",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "600",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#f8f9fc";
              e.target.style.borderColor = "#C9A96E";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "transparent";
              e.target.style.borderColor = "#e0e6ed";
            }}
            disabled={isSaving}
          >
            ← Voltar
          </button>
        </div>

        {/* Formulário */}
        <PostForm
          post={post}
          categories={categories}
          onSave={handleSavePost}
          isLoading={isSaving}
          posts={posts}
        />
      </div>
    </BlogGemCapitalContainer>
  );
};

export default PostEditPage;
