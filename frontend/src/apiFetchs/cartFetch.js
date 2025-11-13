import { API_BASE_URL, authHeaders, getAuthToken } from "./usersFetch";

const CART_BASE_URL = `${API_BASE_URL}/cart`;

function ensureAuthToken() {
  const token = getAuthToken();
  if (!token) {
    throw new Error("Debes iniciar sesión para gestionar el carrito");
  }
  return token;
}

async function handleResponse(res) {
  const contentType = res.headers.get("content-type") || "";
  const text = await res.text();
  let payload = {};

  if (contentType.includes("application/json") && text) {
    try {
      payload = JSON.parse(text);
    } catch (err) {
      payload = { raw: text };
    }
  } else if (text) {
    payload = { raw: text };
  }

  if (!res.ok) {
    const errorMessage =
      payload?.error ||
      payload?.message ||
      payload?.raw ||
      `Error ${res.status}`;
    throw new Error(errorMessage);
  }

  return payload;
}

function buildHeaders({ needsJson = false, extraHeaders = {} } = {}) {
  const headers = { ...authHeaders(), ...extraHeaders };
  if (needsJson && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }
  return headers;
}

export async function fetchCart() {
  ensureAuthToken();

  const res = await fetch(CART_BASE_URL, {
    method: "GET",
    headers: buildHeaders(),
  });

  const payload = await handleResponse(res);
  return payload?.data || null;
}

export async function addCartItem({ productId, quantity = 1 }) {
  ensureAuthToken();

  if (!productId) {
    throw new Error("El ID del producto es requerido");
  }

  const res = await fetch(`${CART_BASE_URL}/items`, {
    method: "POST",
    headers: buildHeaders({ needsJson: true }),
    body: JSON.stringify({ productId, quantity }),
  });

  const payload = await handleResponse(res);
  return payload?.data || null;
}

export async function updateCartItemQuantity({ itemId, quantity }) {
  ensureAuthToken();

  if (!itemId) {
    throw new Error("El ID del item es requerido");
  }

  if (!Number.isInteger(quantity) || quantity < 1) {
    throw new Error("La cantidad debe ser un entero mayor o igual a 1");
  }

  const res = await fetch(`${CART_BASE_URL}/items/${itemId}`, {
    method: "PUT",
    headers: buildHeaders({ needsJson: true }),
    body: JSON.stringify({ quantity }),
  });

  const payload = await handleResponse(res);
  return payload?.data || null;
}

export async function removeCartItem({ itemId }) {
  ensureAuthToken();

  if (!itemId) {
    throw new Error("El ID del item es requerido");
  }

  const res = await fetch(`${CART_BASE_URL}/items/${itemId}`, {
    method: "DELETE",
    headers: buildHeaders(),
  });

  const payload = await handleResponse(res);
  return payload?.message || "Item eliminado del carrito";
}

export async function clearCart() {
  ensureAuthToken();

  const res = await fetch(CART_BASE_URL, {
    method: "DELETE",
    headers: buildHeaders(),
  });

  const payload = await handleResponse(res);
  return payload?.message || "Carrito vaciado";
}

export async function addOrUpdateCartItem({ productId, quantity = 1 }) {
  ensureAuthToken();

  if (!productId) {
    throw new Error("El ID del producto es requerido");
  }

  if (!Number.isInteger(quantity) || quantity < 1) {
    throw new Error("La cantidad debe ser un entero mayor o igual a 1");
  }

  const cart = await fetchCart();
  const items = Array.isArray(cart?.items) ? cart.items : [];

  const existingItem = items.find((item) => {
    if (!item) return false;
    if (item.productId === productId) return true;
    return item.product?.id === productId;
  });

  if (!existingItem) {
    return addCartItem({ productId, quantity });
  }

  const newQuantity = existingItem.quantity + quantity;
  return updateCartItemQuantity({
    itemId: existingItem.id,
    quantity: newQuantity,
  });
}
