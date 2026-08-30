import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminRoute({ children }) {
  const { user } = useAuth();
  const location = useLocation();
  const role = String(user?.role || user?.user?.role || "").trim().toLowerCase();

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}
