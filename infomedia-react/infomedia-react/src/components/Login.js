import { useState } from "react";
import { loginUser } from "../utils/api";
import { useNavigate, Link } from "react-router-dom";
import './Login.css';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await loginUser(email, password);
      localStorage.setItem("token", data.token);
      localStorage.setItem("fullName", data.fullName);
      setMessage("Login successful!");
      navigate("/dashboard");
    } catch (err) {
      setMessage("Login failed: Check your email and password!");
    }
  };

  return (
    <div className="form-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
        <button type="submit">Login</button>
      </form>
      {message && <p className={message.includes("successful") ? "success-message" : "error-message"}>{message}</p>}
      <p className="switch-link">
        Don’t have an account? <Link to="/register" style={{ color: "#61dafb" }}>Create account</Link>
      </p>
    </div>
  );
}