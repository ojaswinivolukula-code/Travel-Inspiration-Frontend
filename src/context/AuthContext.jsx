import { createContext, useContext, useState, useEffect } from "react";
import { loginUser, registerUser } from "../services/authService";

 export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Restore session on page reload
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Optionally decode token or fetch user profile from backend
      setUser({ token }); // simple placeholder
    }
  }, []);

  // Login function
  const login = async (formData) => {
    try {
      setLoading(true);
      const data = await loginUser(formData);

      if (!data.session || !data.user) {
        throw new Error("Login failed: user not found or email not confirmed");
      }

      localStorage.setItem("token", data.session.access_token);
      setUser(data.user);
      return data.user;
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (formData) => {
    try {
      setLoading(true);
      const data = await registerUser(formData);
      return data;
    } catch (err) {
      console.error("Register error:", err.response?.data || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};