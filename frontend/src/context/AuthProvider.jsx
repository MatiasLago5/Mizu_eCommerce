import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  logoutThunk,
  refreshUserThunk,
  selectAuthState,
  selectIsAuthenticated,
  setUser,
} from "../store/authSlice";
import { fetchCartThunk, resetCartState } from "../store/cartSlice";

export function AuthProvider({ children }) {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  useEffect(() => {
    dispatch(refreshUserThunk());
  }, [dispatch]);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const handleStorage = (event) => {
      if (event.key === "mizu_token") {
        dispatch(refreshUserThunk());
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCartThunk());
    } else {
      dispatch(resetCartState());
    }
  }, [dispatch, isAuthenticated]);

  return children;
}

export function useAuth() {
  const dispatch = useDispatch();
  const authState = useSelector(selectAuthState);

  const actions = useMemo(
    () => ({
      refreshUser: () => dispatch(refreshUserThunk()),
      logout: () => dispatch(logoutThunk()),
      setUser: (payload) => dispatch(setUser(payload)),
    }),
    [dispatch]
  );

  return {
    ...authState,
    isAuthenticated: Boolean(authState.user),
    ...actions,
  };
}
