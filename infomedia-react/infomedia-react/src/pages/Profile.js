import { useState, useEffect } from "react";
import { fetchUserPosts, updatePost, deletePost } from "../utils/api";
import { useNavigate } from "react-router-dom";
import './Profile.css';

export default function Profile({ setToken }) {
  const [posts, setPosts] = useState([]);
  const [editingPostId, setEditingPostId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [deletingPostId, setDeletingPostId] = useState(null);

  const fullName = localStorage.getItem("fullName") || "Student";
  const email = localStorage.getItem("email") || "";
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("token")) navigate("/login");

    const loadPosts = async () => {
      try {
        const data = await fetchUserPosts();
        setPosts(data);
      } catch (err) {
        console.error(err);
      }
    };
    loadPosts();
  }, [navigate]);

  const startEdit = (post) => {
    setEditingPostId(post.id);
    setEditTitle(post.title);
    setEditContent(post.content);
  };

  const cancelEdit = () => {
    setEditingPostId(null);
    setEditTitle("");
    setEditContent("");
  };

  const saveEdit = async (id) => {
    try {
      const updated = await updatePost(id, editTitle, editContent);
      setPosts(posts.map(p => p.id === id ? updated : p));
      cancelEdit();
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to update post");
    }
  };

  const startDelete = (id) => setDeletingPostId(id);
  const cancelDelete = () => setDeletingPostId(null);

  const confirmDelete = async (id) => {
    try {
      await deletePost(id);
      setPosts(posts.filter(p => p.id !== id));
      cancelDelete();
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to delete post");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setToken(null);
    navigate("/login");
  };

  return (
    <div className="profile-container">
      <header className="profile-header">
        <h2>{fullName}</h2>
        <p>{email}</p>
        <div className="header-buttons">
          <button onClick={() => navigate("/feed")}>Feed</button>
          <button onClick={handleLogout}>Log Out</button>
        </div>
      </header>

      <section className="profile-posts">
        <h3>My Posts:</h3>
        {posts.length === 0 && <p>No posts yet.</p>}
        {posts.map(p => (
          <div key={p.id} className="post">
            {editingPostId === p.id ? (
            <div className="post-edit">
                <input
                className="edit-title"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Title"
                />
                <textarea
                className="edit-content"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                placeholder="Content"
                />
                <div className="post-buttons">
                <button onClick={() => saveEdit(p.id)}>Save</button>
                <button onClick={cancelEdit}>Cancel</button>
                </div>
            </div>
            ) : (
            <>
                <h4>{p.title}</h4>
                <p>{p.content}</p>
                <small>at {new Date(p.createdAt).toLocaleString()}</small>

                {deletingPostId === p.id ? (
                <div className="delete-confirm">
                    <p>Ești sigur că vrei să ștergi această postare?</p>
                    <button onClick={() => confirmDelete(p.id)}>Da</button>
                    <button onClick={cancelDelete}>Nu</button>
                </div>
                ) : (
                <div className="post-buttons">
                    <button onClick={() => startEdit(p)}>Edit</button>
                    <button onClick={() => startDelete(p.id)}>Delete</button>
                </div>
                )}
            </>
            )}
          </div>
        ))}
      </section>
    </div>
  );
}