import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchCart as fetchCartRequest } from "../apiFetchs/cartFetch";

const normalizeItems = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.items)) return payload.items;
  return [];
};

export const fetchCartThunk = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      const cart = await fetchCartRequest();
      return cart;
    } catch (error) {
      return rejectWithValue(error?.message || "No pudimos cargar tu carrito");
    }
  }
);

const initialState = {
  items: [],
  isLoading: false,
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCartItems: (state, action) => {
      state.items = normalizeItems(action.payload);
      state.error = null;
    },
    resetCartState: (state) => {
      state.items = [];
      state.error = null;
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCartThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCartThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = normalizeItems(action.payload);
      })
      .addCase(fetchCartThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.items = [];
        state.error = action.payload || "No pudimos cargar tu carrito";
      });
  },
});

export const { setCartItems, resetCartState } = cartSlice.actions;

export const selectCartItems = (state) => state.cart.items;
export const selectCartCount = (state) =>
  state.cart.items.reduce((acc, item) => acc + (item?.quantity ?? 0), 0);
export const selectCartStatus = (state) => ({
  isLoading: state.cart.isLoading,
  error: state.cart.error,
});

export default cartSlice.reducer;
