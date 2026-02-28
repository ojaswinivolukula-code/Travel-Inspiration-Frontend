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
import WriteReview from "../pages/WriteReview";
import Journal from "@/pages/Journal";
import Deals from "../pages/Deals";

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
      {/* ✅ HOME - Redirect if logged in, show landing if not */}
      <Route
        path="/"
        element={
          user ? (
            <Navigate to={user.role === "admin" ? "/admin" : "/dashboard"} />
          ) : (
            <LandingPage />
          )
        }
      />

      {/* LOGIN - Redirect if already logged in */}
      <Route
        path="/login"
        element={
          user ? (
            <Navigate to={user.role === "admin" ? "/admin" : "/dashboard"} />
          ) : (
            <Login />
          )
        }
      />

      {/* REGISTER - Redirect if already logged in */}
      <Route
        path="/register"
        element={
          user ? (
            <Navigate to={user.role === "admin" ? "/admin" : "/dashboard"} />
          ) : (
            <Register />
          )
        }
      />

      {/* PROTECTED ROUTES */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
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

      <Route
        path="/trips/:id"
        element={
          <ProtectedRoute>
            <TripDetail />
          </ProtectedRoute>
        }
      />

      <Route
        path="/review/:destinationId"
        element={
          <ProtectedRoute>
            <WriteReview />
          </ProtectedRoute>
        }
      />

      <Route
        path="/journal"
        element={
          <ProtectedRoute>
            <Journal />
          </ProtectedRoute>
        }
      />

      <Route
        path="/deals"
        element={
          <ProtectedRoute>
            <Deals />
          </ProtectedRoute>
        }
      />

      {/* CATCH ALL - Redirect unknown routes to home */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;
