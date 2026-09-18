export async function api(path, options = {}) {
  const token = localStorage.getItem("mandal-admin-token");
  const headers = { ...(options.headers || {}) };
  if (!(options.body instanceof FormData)) headers["Content-Type"] = "application/json";
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(path, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (res.status === 401) {
    localStorage.removeItem("mandal-admin-token");
    throw new Error(data.error || "Your admin session has expired. Please log in again.");
  }
  if (!res.ok) {
    throw new Error(
      data.error ||
      data.message ||
      `Request failed (${res.status})`
    );
  }
  return data;
}
