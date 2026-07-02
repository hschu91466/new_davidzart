import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, loading } = useContext(AuthContext);

  // Wait until we know if the user is logged in
  if (loading) {
    return <div>Loading...</div>;
  }

  // If no user → redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If admin is required but user isn't admin → redirect
  if (requireAdmin && user.role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  // If logged in → allow access
  return children;
};

export default ProtectedRoute;
