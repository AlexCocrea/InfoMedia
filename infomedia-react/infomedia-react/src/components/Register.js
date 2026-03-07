import { useState } from "react";
import { registerUser } from "../utils/api";
import { useNavigate } from "react-router-dom";
import './Register.css';

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setSuccess(false);

    const emailPattern = /^[a-z]+\.[a-z]+@stud\.ubbcluj\.ro$/;
    if (!emailPattern.test(email)) {
      setMessage("Email trebuie sa fie prenume.nume@stud.ubbcluj.ro");
      return;
    }

    const passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*.]).{8,}$/;
    if (!passwordPattern.test(password)) {
      setMessage("Parola trebuie sa aiba minim 8 caractere, o litera mare, o cifra si un caracter special");
      return;
    }

    try {
      const data = await registerUser(fullName, email, password);
      setMessage(data.message || "Registered successfully!");
      setSuccess(true);
      setFullName("");
      setEmail("");
      setPassword("");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setMessage(err?.Email ? err.Email[0] : err.message || "Registration failed");
    }
  };

  return (
    <div className="form-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Full Name" value={fullName} onChange={e => setFullName(e.target.value)} required />
        <input type="email" placeholder="Email (prenume.nume@stud.ubbcluj.ro)" value={email} onChange={e => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
        <button type="submit">Register</button>
      </form>
      {message && <p className={success ? "success-message" : "error-message"}>{message}</p>}
    </div>
  );
}