import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BlogGemCapitalContainer from "../BlogGemCapitalContainer";
import gemCapitalBlogServices from "../../../../dbServices/gemCapitalBlogServices";
import styles from "../ViewPostModalStyle";

const PostDetailPage = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadPost();
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

  const handleDelete = async () => {
    if (!window.confirm("Tem certeza que deseja deletar este post?")) return;

    try {
      await gemCapitalBlogServices.deletePost(postId);
      navigate("/platform/blog-gemcapital/posts");
    } catch (err) {
      console.error("Erro ao deletar:", err);
      alert("Erro ao deletar post");
    }
  };

  const handleEditClick = () => {
    navigate(`/platform/blog-gemcapital/posts/edit/${postId}`);
  };

  const handleBackClick = () => {
    navigate("/platform/blog-gemcapital/posts");
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

  if (error || !post) {
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
            {error || "Post não encontrado"}
          </div>
          <button
            onClick={handleBackClick}
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
            Voltar para Posts
          </button>
        </div>
      </BlogGemCapitalContainer>
    );
  }

  const publishDate = new Date(post.publishedAt || post.createdAt).toLocaleDateString(
    "pt-BR",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );

  return (
    <BlogGemCapitalContainer>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        {/* Header com Botões */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
          flexWrap: "wrap",
          gap: "15px",
        }}>
          <button
            onClick={handleBackClick}
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
          >
            ← Voltar
          </button>

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={handleEditClick}
              style={{
                padding: "10px 16px",
                backgroundColor: "#C9A96E",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "600",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#b8956b";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "#C9A96E";
              }}
            >
              ✎ Editar
            </button>

            <button
              onClick={handleDelete}
              style={{
                padding: "10px 16px",
                backgroundColor: "#ff4444",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "600",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#dd2222";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "#ff4444";
              }}
            >
              🗑 Deletar
            </button>
          </div>
        </div>

        {/* Imagem Destaque */}
        {post.featuredImage && (
          <img
            src={post.featuredImage}
            alt={post.title}
            style={{
              width: "100%",
              maxHeight: "400px",
              objectFit: "cover",
              borderRadius: "8px",
              marginBottom: "30px",
            }}
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        )}

        {/* Metadados */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "15px",
          marginBottom: "30px",
          padding: "20px",
          backgroundColor: "#f8f9fc",
          borderRadius: "8px",
        }}>
          <div>
            <strong style={{ color: "#122C4F", fontSize: "12px" }}>CATEGORIA</strong>
            <div style={{ color: "#8892a0", fontSize: "14px", marginTop: "4px" }}>
              {post.categories?.[0]?.name || "Sem categoria"}
            </div>
          </div>
          <div>
            <strong style={{ color: "#122C4F", fontSize: "12px" }}>DATA</strong>
            <div style={{ color: "#8892a0", fontSize: "14px", marginTop: "4px" }}>
              {publishDate}
            </div>
          </div>
          <div>
            <strong style={{ color: "#122C4F", fontSize: "12px" }}>AUTOR</strong>
            <div style={{ color: "#8892a0", fontSize: "14px", marginTop: "4px" }}>
              {post.author || "Equipe GemCapital"}
            </div>
          </div>
          <div>
            <strong style={{ color: "#122C4F", fontSize: "12px" }}>TEMPO DE LEITURA</strong>
            <div style={{ color: "#8892a0", fontSize: "14px", marginTop: "4px" }}>
              {post.readTime} min
            </div>
          </div>
          <div>
            <strong style={{ color: "#122C4F", fontSize: "12px" }}>VISUALIZAÇÕES</strong>
            <div style={{ color: "#8892a0", fontSize: "14px", marginTop: "4px" }}>
              {post.views || 0}
            </div>
          </div>
          <div>
            <strong style={{ color: "#122C4F", fontSize: "12px" }}>STATUS</strong>
            <div style={{
              fontSize: "14px",
              marginTop: "4px",
              padding: "4px 12px",
              borderRadius: "20px",
              display: "inline-block",
              backgroundColor: post.active ? "#d4edda" : "#f8d7da",
              color: post.active ? "#155724" : "#856404",
              fontWeight: "600",
            }}>
              {post.active ? "Ativo" : "Inativo"}
            </div>
          </div>
        </div>

        {/* Título */}
        <h1 style={{
          fontSize: "32px",
          fontWeight: "700",
          color: "#122C4F",
          marginBottom: "16px",
          lineHeight: "1.3",
        }}>
          {post.title}
        </h1>

        {/* Resumo */}
        <div style={{
          fontSize: "16px",
          color: "#8892a0",
          fontStyle: "italic",
          marginBottom: "30px",
          paddingBottom: "20px",
          borderBottom: "1px solid #e0e6ed",
          lineHeight: "1.6",
        }}>
          {post.excerpt}
        </div>

        {/* Conteúdo HTML */}
        <div
          style={{
            fontSize: "15px",
            lineHeight: "1.8",
            color: "#4a5568",
          }}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>
    </BlogGemCapitalContainer>
  );
};

export default PostDetailPage;
