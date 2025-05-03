import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedRoute({ allowedRoles }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>;
  }

  // Not logged in - redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check if user role is allowed
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect based on role
    if (user.role === "admin") {
      return <Navigate to="/" replace />;
    } else if (user.role === "cashier") {
      return <Navigate to="/pos" replace />;
    }

    // Default fallback
    return <Navigate to="/" replace />;
  }

  // Allow access to the route
  return <Outlet />;
}
