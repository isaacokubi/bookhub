import { Navigate, useLocation } from "react-router-dom";
import { useAuth, normalizeRole } from "../context/AuthContext";

export default function RoleRoute({ roles = [], children }) {
  const { user, authLoading } = useAuth();
  const location = useLocation();

  if (authLoading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-5 text-sm font-semibold text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
          Loading your dashboard…
        </div>
      </main>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  const role = normalizeRole(user.role);
  const allowedRoles = roles.map(normalizeRole);

  if (!allowedRoles.includes(role)) {
    if (role === "admin" || role === "superadmin") return <Navigate to="/admin/dashboard" replace />;
    if (["seller", "seller_admin", "tour_guide", "tour_manager"].includes(role)) {
      return <Navigate to="/seller/dashboard" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
