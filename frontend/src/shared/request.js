const API_URL = "http://localhost:3000";

export async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers
    },
    ...options
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Terjadi kesalahan." }));
    throw new Error(error.message);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}
