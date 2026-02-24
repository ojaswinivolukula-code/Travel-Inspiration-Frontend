import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get user data from localStorage
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      // If no user, redirect to login
      navigate("/login");
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!user) return null; // prevent flashing before user is loaded

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      backgroundColor: "#f0f2f5",
      textAlign: "center"
    }}>
      <div style={{
        backgroundColor: "#fff",
        padding: "40px",
        borderRadius: "10px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        width: "400px"
      }}>
        <h1 style={{ marginBottom: "20px" }}>Welcome, {user?.name || "User"}!</h1>
        <p style={{ marginBottom: "30px" }}>You have successfully logged in.</p>
        <button 
          onClick={handleLogout} 
          style={{
            padding: "10px 20px",
            borderRadius: "5px",
            border: "none",
            backgroundColor: "#ff4d4f",
            color: "#fff",
            fontSize: "16px",
            cursor: "pointer"
          }}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;