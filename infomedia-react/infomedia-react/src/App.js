import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Feed from "./pages/Feed"; // Dashboard redenumit
import Profile from "./pages/Profile";
import React from "react";
import './App.css';

function App() {
  const [token, setToken] = React.useState(localStorage.getItem("token"));

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={token ? <Navigate to="/feed" /> : <Navigate to="/login" />} />
          <Route path="/login" element={token ? <Navigate to="/feed" /> : <Login setToken={setToken} />} />
          <Route path="/register" element={token ? <Navigate to="/feed" /> : <Register />} />
          <Route path="/feed" element={token ? <Feed setToken={setToken} /> : <Navigate to="/login" />} />
          <Route path="/profile" element={token ? <Profile setToken={setToken} /> : <Navigate to="/login" />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;