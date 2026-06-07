import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  // Wait until we know if the user is logged in
  if (loading) {
    return <div>Loading...</div>;
  }

  // If no user → redirect to login
  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  // If logged in → allow access
  return children;
};

export default ProtectedRoute;
