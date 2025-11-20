export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

function getAuthHeaders() {
  const token = localStorage.getItem('mizu_token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  };
}

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

export async function fetchDashboardStats() {
  const res = await fetch(`${API_BASE_URL}/admin/stats`, {
    headers: getAuthHeaders()
  });
  return handleResponse(res);
}

export async function fetchAllUsers() {
  const res = await fetch(`${API_BASE_URL}/admin/users`, {
    headers: getAuthHeaders()
  });
  const payload = await handleResponse(res);
  return payload?.data || [];
}

export async function updateUserRole(userId, role) {
  const res = await fetch(`${API_BASE_URL}/admin/users/${userId}/role`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ role })
  });
  return handleResponse(res);
}

export async function deleteUser(userId) {
  const res = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  return handleResponse(res);
}

export async function createProduct(productData) {
  const res = await fetch(`${API_BASE_URL}/products`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(productData)
  });
  return handleResponse(res);
}

export async function updateProduct(productId, productData) {
  const res = await fetch(`${API_BASE_URL}/products/${productId}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(productData)
  });
  return handleResponse(res);
}

export async function deleteProduct(productId) {
  const res = await fetch(`${API_BASE_URL}/products/${productId}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  return handleResponse(res);
}

export async function fetchCategories() {
  const res = await fetch(`${API_BASE_URL}/categories`);
  const payload = await handleResponse(res);
  return payload?.data || [];
}

export async function createCategory(categoryData) {
  const res = await fetch(`${API_BASE_URL}/categories`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(categoryData)
  });
  return handleResponse(res);
}

export async function updateCategory(categoryId, categoryData) {
  const res = await fetch(`${API_BASE_URL}/categories/${categoryId}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(categoryData)
  });
  return handleResponse(res);
}

export async function deleteCategory(categoryId) {
  const res = await fetch(`${API_BASE_URL}/categories/${categoryId}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  return handleResponse(res);
}

export async function fetchSubcategories() {
  const res = await fetch(`${API_BASE_URL}/subcategories`);
  const payload = await handleResponse(res);
  return payload?.data || [];
}

export async function createSubcategory(subcategoryData) {
  const res = await fetch(`${API_BASE_URL}/subcategories`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(subcategoryData)
  });
  return handleResponse(res);
}

export async function updateSubcategory(subcategoryId, subcategoryData) {
  const res = await fetch(`${API_BASE_URL}/subcategories/${subcategoryId}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(subcategoryData)
  });
  return handleResponse(res);
}

export async function deleteSubcategory(subcategoryId) {
  const res = await fetch(`${API_BASE_URL}/subcategories/${subcategoryId}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  return handleResponse(res);
}

export async function fetchAllOrders() {
  const res = await fetch(`${API_BASE_URL}/admin/orders`, {
    headers: getAuthHeaders()
  });
  const payload = await handleResponse(res);
  return payload?.data || [];
}

export async function updateOrderStatus(orderId, status) {
  const res = await fetch(`${API_BASE_URL}/admin/orders/${orderId}/status`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ status })
  });
  return handleResponse(res);
}

export async function fetchRefuges() {
  const res = await fetch(`${API_BASE_URL}/admin/refuges`, {
    headers: getAuthHeaders()
  });
  const payload = await handleResponse(res);
  return payload?.data || [];
}

export async function createRefuge(refugeData) {
  const res = await fetch(`${API_BASE_URL}/admin/refuges`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(refugeData)
  });
  return handleResponse(res);
}

export async function updateRefuge(refugeId, refugeData) {
  const res = await fetch(`${API_BASE_URL}/admin/refuges/${refugeId}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(refugeData)
  });
  return handleResponse(res);
}

export async function deleteRefuge(refugeId) {
  const res = await fetch(`${API_BASE_URL}/admin/refuges/${refugeId}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  return handleResponse(res);
}