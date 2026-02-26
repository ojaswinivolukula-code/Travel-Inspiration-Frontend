import { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../services/axiosInstance";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const clearStorage = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("sb-")) localStorage.removeItem(key);
    });
  };

  useEffect(() => {
  const checkAuth = async () => {
    const token = sessionStorage.getItem("token");
    console.log("1. TOKEN:", token ? "EXISTS" : "NULL");

    if (!token) {
      console.log("2. NO TOKEN - stopping");
      setLoading(false);
      return;
    }

    try {
      console.log("3. CALLING /auth/me...");
      const { data } = await axiosInstance.get("/auth/me");
      console.log("4. AUTH ME DATA:", data);
      if (data) setUser(data);
      else {
        console.log("5. NO DATA - clearing");
        clearStorage();
        setUser(null);
      }
    } catch (err) {
      console.log("6. ERROR:", err.response?.status, err.message);
      clearStorage();
      setUser(null);
    }

    setLoading(false);
  };

  checkAuth();
}, []);
  // LOGIN
  const login = async ({ email, password }) => {
    const { data } = await axiosInstance.post("/auth/login", { email, password });

    if (!data.session?.access_token || !data.user)
      throw new Error("Login failed");

    // ✅ sessionStorage only
    sessionStorage.setItem("token", data.session.access_token);
    sessionStorage.setItem("user", JSON.stringify(data.user));

    setUser(data.user);
    return data.user;
  };

  // REGISTER
  const register = async ({ name, email, password }) => {
    await axiosInstance.post("/auth/register", { name, email, password });
    return await login({ email, password });
  };

  // LOGOUT
  const logout = () => {
    clearStorage();
    setUser(null);
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};