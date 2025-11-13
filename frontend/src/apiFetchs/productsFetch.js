export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export async function fetchProducts({ limit = 200 } = {}) {
  const url = new URL(`${API_BASE_URL}/products`);
  url.searchParams.set("limit", limit);
  url.searchParams.set("includeCategory", "true");
  url.searchParams.set("includeSubcategory", "true");

  const res = await fetch(url.toString());
  const payload = await res.json();
  if (!res.ok) {
    throw new Error(payload?.error || "Error al obtener productos");
  }

  return payload.data || [];
}

export async function fetchProductById(id) {
  if (!id) {
    throw new Error("El ID del producto es requerido");
  }

  const res = await fetch(`${API_BASE_URL}/products/${id}`);
  const payload = await res.json();

  if (!res.ok) {
    throw new Error(payload?.error || `Error al obtener el producto ${id}`);
  }

  return payload?.data || null;
}
