import React, { useState, useEffect } from "react";
import BlogGemCapitalContainer from "./BlogGemCapitalContainer";
import PostsList from "./PostsList";
import gemCapitalBlogServices from "../../../dbServices/gemCapitalBlogServices";

const PostsPage = () => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch data ao montar
  useEffect(() => {
    fetchPosts();
    fetchCategories();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await gemCapitalBlogServices.getAllPosts();
      setPosts(data);
    } catch (error) {
      console.error("Erro ao buscar posts:", error);
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

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Tem certeza que deseja deletar este post?")) return;

    try {
      await gemCapitalBlogServices.deletePost(postId);
      await fetchPosts();
      alert("Post deletado com sucesso!");
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao deletar post");
    }
  };

  return (
    <BlogGemCapitalContainer counts={{ posts: posts.length, categories: categories.length }}>
      <PostsList
        posts={posts}
        loading={loading}
        onDeletePost={handleDeletePost}
      />
    </BlogGemCapitalContainer>
  );
};

export default PostsPage;
