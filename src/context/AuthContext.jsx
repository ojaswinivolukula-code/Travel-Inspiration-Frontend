import { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../services/axiosInstance";

export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

const TOKEN_KEY = "token";
const USER_KEY = "user";

const saveAuth = (token, user) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

const clearAuth = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith("sb-")) localStorage.removeItem(key);
  });
  delete axiosInstance.defaults.headers.common["Authorization"];
};

export const AuthProvider = ({ children }) => {
  const getInitialUser = () => {
    const token = localStorage.getItem(TOKEN_KEY);
    const cached = localStorage.getItem(USER_KEY);
    if (!token || !cached) return null;
    try {
      return JSON.parse(cached);
    } catch {
      return null;
    }
  };

  const [user, setUser] = useState(getInitialUser);
  const [loading, _setLoading] = useState(false);

  const login = async ({ email, password }) => {
    clearAuth();
    setUser(null);

    const { data } = await axiosInstance.post("/auth/login", {
      email,
      password,
    });

    if (!data.session?.access_token)
      throw new Error("Login failed: no token returned");
    if (!data.user) throw new Error("Login failed: no user returned");

    const userWithRole = {
      ...data.user,
      role: data.user.role || "user",
    };

    saveAuth(data.session.access_token, userWithRole);
    setUser(userWithRole);

    console.log("LOGIN:", userWithRole.email, "| role:", userWithRole.role);
    return userWithRole;
  };

  const register = async ({ name, email, password }) => {
    await axiosInstance.post("/auth/register", { name, email, password });
    return await login({ email, password });
  };

  const logout = () => {
    clearAuth();
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
