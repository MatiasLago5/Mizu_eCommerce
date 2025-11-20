import { API_BASE_URL, authHeaders } from "./usersFetch";

async function handleResponse(res) {
  const contentType = res.headers.get("content-type") || "";
  const text = await res.text();
  const payload = contentType.includes("application/json") && text
    ? JSON.parse(text)
    : { raw: text };

  if (!res.ok) {
    const err = payload?.error || payload?.message || payload?.raw || `Error ${res.status}`;
    throw new Error(err);
  }

  return payload;
}

export async function checkoutCart(payload = {}) {
  const res = await fetch(`${API_BASE_URL}/orders/checkout`, {
    method: "POST",
    headers: {
      ...authHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return handleResponse(res);
}

export async function fetchSalesStats() {
  const res = await fetch(`${API_BASE_URL}/orders/stats/sales`);
  return handleResponse(res);
}

export async function fetchMyOrders() {
  const res = await fetch(`${API_BASE_URL}/orders/me`, {
    headers: {
      ...authHeaders(),
    },
  });

  return handleResponse(res);
}
