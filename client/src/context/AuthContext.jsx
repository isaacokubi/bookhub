import { createContext, useContext, useEffect, useState } from "react";
import { getProfile } from "../api/authApi";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
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
        // The JWT-backed profile is authoritative. This prevents a stale
        // localStorage user/role from disagreeing with the authenticated API user.
        const profile = await getProfile();
        const authenticatedUser = profile?.user || profile;

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
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
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
