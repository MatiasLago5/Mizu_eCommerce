import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchUserProfile, getAuthToken, clearAuthToken } from "../apiFetchs/usersFetch";
import { resetCartState } from "./cartSlice";

const initialState = {
  user: null,
  isLoading: true,
  error: null,
};

export const refreshUserThunk = createAsyncThunk(
  "auth/refreshUser",
  async (_, { rejectWithValue, dispatch }) => {
    const token = getAuthToken();

    if (!token) {
      dispatch(resetCartState());
      return null;
    }

    try {
      const profile = await fetchUserProfile();
      const normalizedUser = profile?.user || profile || null;

      if (!normalizedUser) {
        dispatch(resetCartState());
      }

      return normalizedUser || null;
    } catch (error) {
      clearAuthToken();
      dispatch(resetCartState());
      return rejectWithValue(error?.message || "No se pudo cargar tu perfil");
    }
  }
);

export const logoutThunk = createAsyncThunk(
  "auth/logout",
  async (_, { dispatch }) => {
    clearAuthToken();
    dispatch(resetCartState());
    return null;
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload || null;
      state.isLoading = false;
      state.error = null;
    },
    resetAuthState: (state) => {
      state.user = null;
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(refreshUserThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(refreshUserThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload || null;
        state.error = null;
      })
      .addCase(refreshUserThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.error = action.payload || "No se pudo cargar tu perfil";
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        state.user = null;
        state.isLoading = false;
        state.error = null;
      });
  },
});

export const { setUser, resetAuthState } = authSlice.actions;

export const selectAuthState = (state) => state.auth;
export const selectAuthUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => Boolean(state.auth.user);
export const selectAuthStatus = (state) => ({
  isLoading: state.auth.isLoading,
  error: state.auth.error,
});

export default authSlice.reducer;
