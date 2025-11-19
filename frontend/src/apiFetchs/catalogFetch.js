import { API_BASE_URL } from "./productsFetch";

async function handleResponse(res) {
  const contentType = res.headers.get("content-type") || "";
  const text = await res.text();
  const payload = contentType.includes("application/json") && text ? JSON.parse(text) : { raw: text };

  if (!res.ok) {
    const err = payload?.error || payload?.message || payload?.raw || `Error ${res.status}`;
    throw new Error(err);
  }

  return payload;
}

export async function fetchCatalogCategories({ includeSubcategories = true } = {}) {
  const url = new URL(`${API_BASE_URL}/categories`);
  if (includeSubcategories) {
    url.searchParams.set("includeSubcategories", "true");
  }

  const payload = await handleResponse(await fetch(url.toString()));
  return payload?.data || [];
}

export async function fetchCatalogSubcategories({ categoryId, includeCategory = false } = {}) {
  const url = new URL(`${API_BASE_URL}/subcategories`);
  if (categoryId) {
    url.searchParams.set("categoryId", categoryId);
  }
  if (includeCategory) {
    url.searchParams.set("includeCategory", "true");
  }

  const payload = await handleResponse(await fetch(url.toString()));
  return payload?.data || [];
}