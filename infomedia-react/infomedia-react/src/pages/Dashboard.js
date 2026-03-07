import './Dashboard.css'
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const fullName = localStorage.getItem("fullName") || "Student";

  const handleLogout = () => {
    localStorage.clear();       
    navigate("/login");         
  };

  return (
    <div className="form-container">
      <h2>Welcome, {fullName}</h2>
      <p>Logged in successfully!</p>
      <button className="logout-button" onClick={handleLogout}>Log Out</button>
    </div>
  );
}