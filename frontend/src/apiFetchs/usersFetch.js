export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

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

export async function registerUser({ name, email, password }) {
  const res = await fetch(`${API_BASE_URL}/users/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });

  return handleResponse(res);
}

export async function loginUser({ email, password }) {
  const res = await fetch(`${API_BASE_URL}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  return handleResponse(res);
}

export function saveAuthToken(token) {
  if (typeof window !== 'undefined' && token) {
    localStorage.setItem('mizu_token', token);
  }
}

export function getAuthToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('mizu_token');
}

export function clearAuthToken() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('mizu_token');
  }
}

export function authHeaders() {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}
