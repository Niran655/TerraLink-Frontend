import { Navigate } from "react-router-dom";
import { useAuth } from "./src/context/AuthContext";
export default function ProtectedRoute({ children, requiredRoles = [] }) {
  const { isAuthenticated, hasPermission } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;

 
  if (requiredRoles && requiredRoles.length > 0 && !hasPermission(requiredRoles)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
