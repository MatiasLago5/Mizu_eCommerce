import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { fetchUserProfile, getAuthToken, clearAuthToken } from "../apiFetchs/usersFetch";
import { fetchCartThunk, resetCartState } from "../store/cartSlice";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  const refreshUser = useCallback(async () => {
    const token = getAuthToken();

    if (!token) {
      setUser(null);
      setError(null);
      setIsLoading(false);
      return null;
    }

    setIsLoading(true);

    try {
      const profile = await fetchUserProfile();
      const normalizedUser = profile?.user || profile;
      setUser(normalizedUser || null);
      setError(null);
      return normalizedUser || null;
    } catch (err) {
      console.error("Error al obtener el perfil:", err);
      setError(err?.message || "No se pudo cargar tu perfil");
      setUser(null);
      clearAuthToken();
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  useEffect(() => {
    if (user) {
      dispatch(fetchCartThunk());
    } else {
      dispatch(resetCartState());
    }
  }, [user, dispatch]);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const handleStorage = (event) => {
      if (event.key === "mizu_token") {
        refreshUser();
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [refreshUser]);

  const logout = useCallback(() => {
    clearAuthToken();
    setUser(null);
    setError(null);
    setIsLoading(false);
    dispatch(resetCartState());
  }, [dispatch]);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      error,
      refreshUser,
      logout,
      setUser,
    }),
    [user, isLoading, error, refreshUser, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
}
