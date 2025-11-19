import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCartThunk,
  selectCartCount,
  selectCartItems,
  selectCartStatus,
} from "../store/cartSlice";

export function useCart() {
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const count = useSelector(selectCartCount);
  const { isLoading, error } = useSelector(selectCartStatus);

  const refreshCart = useCallback(() => {
    dispatch(fetchCartThunk());
  }, [dispatch]);

  return {
    items,
    count,
    isLoading,
    error,
    refreshCart,
  };
}
