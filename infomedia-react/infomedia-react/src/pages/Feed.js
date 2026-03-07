import { useState, useEffect } from "react";
import { createPost, fetchPosts } from "../utils/api";
import { useNavigate } from "react-router-dom";
import './Feed.css';

export default function Feed({ setToken }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");
  const [posts, setPosts] = useState([]);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const fullName = localStorage.getItem("fullName") || "Student";

  useEffect(() => {
    if (!token) navigate("/login");

    const loadPosts = async () => {
      try {
        const data = await fetchPosts();
        setPosts(data);
      } catch (err) {
        console.error(err);
      }
    };
    loadPosts();
  }, [token, navigate]);

  const handleLogout = () => {
    localStorage.clear();
    setToken(null);
    navigate("/login");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) return;

    try {
      const newPost = await createPost(title, content, token);
      setPosts([newPost, ...posts]);
      setTitle("");
      setContent("");
      setMessage("Post added!");
    } catch (err) {
      setMessage(err.message || "Failed to create post");
    }
  };

  return (
    <div className="feed-container">
      <header className="feed-header">
        <h2>Welcome, {fullName}</h2>
        <div className="header-buttons">
          <button onClick={() => navigate("/profile")}>Profile</button>
          <button onClick={handleLogout}>Log Out</button>
        </div>
      </header>

      <section className="post-section">
        <form onSubmit={handleSubmit} className="post-form">
          <input 
            placeholder="Title" 
            value={title} 
            onChange={e => setTitle(e.target.value)} 
            required 
          />
          <textarea 
            placeholder="Content" 
            value={content} 
            onChange={e => setContent(e.target.value)} 
            required 
          />
          <button type="submit">Post</button>
        </form>
        {message && <p className="status-message">{message}</p>}
      </section>

      <section className="feed-section">
        <h3>Feed:</h3>
        <div className="feed-list">
          {posts.map(p => (
            <div key={p.id} className="post">
              <h4>{p.title}</h4>
              <p>{p.content}</p>
              <small>by {p.author} at {new Date(p.createdAt).toLocaleString()}</small>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}