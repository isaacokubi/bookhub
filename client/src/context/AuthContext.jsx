import { createContext, useContext, useEffect, useState } from "react";
import { getProfile } from "../api/authApi";

const AuthContext = createContext();

// Keep legacy "customer" accounts compatible with the canonical "buyer" role.
export const normalizeRole = (value) => {
  const role = String(value || "").trim().toLowerCase();
  if (role === "customer" || role === "user") return "buyer";
  return role || "buyer";
};

const normalizeUser = (value) => {
  if (!value) return null;
  return { ...value, role: normalizeRole(value.role) };
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      return normalizeUser(stored ? JSON.parse(stored) : null);
    } catch {
      localStorage.removeItem("user");
      return null;
    }
  });
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const restoreSession = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        if (mounted) {
          setUser(null);
          setAuthLoading(false);
        }
        return;
      }

      try {
        const profile = await getProfile();
        const authenticatedUser = normalizeUser(profile?.user || profile);

        if (!authenticatedUser?._id && !authenticatedUser?.id) {
          throw new Error("Invalid profile response");
        }

        if (mounted) {
          setUser(authenticatedUser);
          localStorage.setItem("user", JSON.stringify(authenticatedUser));
        }
      } catch (error) {
        console.warn("Session restoration failed:", error.response?.data || error.message);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        if (mounted) setUser(null);
      } finally {
        if (mounted) setAuthLoading(false);
      }
    };

    restoreSession();
    return () => {
      mounted = false;
    };
  }, []);

  const login = (data) => {
    const normalized = normalizeUser(data?.user);
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(normalized));
    setUser(normalized);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, authLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
