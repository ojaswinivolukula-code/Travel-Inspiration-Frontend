import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LandingPage from "../pages/LandingPage";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import AdminDashboard from "../pages/AdminDashboard";
import DestinationDetail from "../pages/DestinationDetail";
import ProtectedRoute from "./ProtectedRoute";
import Explore from "../pages/Explore";
import TripDetail from "../pages/TripDetail";

const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "18px",
          color: "#64748b",
          fontFamily: "'Segoe UI', sans-serif",
        }}
      >
        Loading...
      </div>
    );

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/login"
        element={user ? <Navigate to="/dashboard" /> : <Login />}
      />
      <Route
        path="/register"
        element={user ? <Navigate to="/dashboard" /> : <Register />}
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            {user?.user_metadata?.role === "admin" ? (
              <Navigate to="/admin" />
            ) : (
              <Dashboard />
            )}
          </ProtectedRoute>
        }
      />

      <Route
        path="/destinations/:id"
        element={
          <ProtectedRoute>
            <DestinationDetail />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute adminOnly={true}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/explore"
        element={
          <ProtectedRoute>
            <Explore />
          </ProtectedRoute>
        }
      />

      <Route path="/trips/:id" element={
  <ProtectedRoute><TripDetail /></ProtectedRoute>
} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;
