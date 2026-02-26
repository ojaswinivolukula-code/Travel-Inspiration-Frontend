import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LandingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGetStarted = () => {
    if (user) navigate("/dashboard");
    else navigate("/register");
  };  

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", background: "linear-gradient(135deg, #667eea 0%, #f093fb 50%, #f5576c 100%)", color: "#fff", padding: "20px", textAlign: "center" }}>
      <h1 style={{ fontSize: "clamp(28px, 6vw, 52px)", fontWeight: "800", marginBottom: "16px", textShadow: "0 2px 10px rgba(0,0,0,0.2)" }}>
        ✈️ Welcome to Travel Inspo
      </h1>
      <p style={{ fontSize: "clamp(14px, 2.5vw, 18px)", marginBottom: "48px", maxWidth: "500px", opacity: 0.9, lineHeight: 1.6 }}>
        Discover amazing destinations, plan your trips, and share your adventures with fellow travelers.
      </p>

      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center" }}>
        <button onClick={handleGetStarted} style={getStartedStyle}>Get Started</button>
        <button onClick={handleLogin} style={loginStyle}>Login</button>
      </div>
    </div>
  );
}

const getStartedStyle = {
  padding: "14px 36px",
  backgroundColor: "#fff",
  color: "#667eea",
  fontWeight: "700",
  fontSize: "16px",
  borderRadius: "50px",
  border: "none",
  cursor: "pointer",
  boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
  transition: "transform 0.2s",
};

const loginStyle = {
  padding: "14px 36px",
  backgroundColor: "transparent",
  color: "#fff",
  fontWeight: "700",
  fontSize: "16px",
  borderRadius: "50px",
  border: "2px solid #fff",
  cursor: "pointer",
  transition: "transform 0.2s",
};