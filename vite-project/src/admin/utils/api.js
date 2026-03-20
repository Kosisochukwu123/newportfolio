const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const token = () => localStorage.getItem("portfolio_token");

const h = (formData = false) => {
  const headers = {};
  if (token()) headers["Authorization"] = `Bearer ${token()}`;
  if (!formData) headers["Content-Type"] = "application/json";
  return headers;
};

const req = async (method, path, body = null, formData = false) => {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: h(formData),
    body: body ? (formData ? body : JSON.stringify(body)) : null,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
};

export const api = {
  get:    (path)              => req("GET",    path),
  post:   (path, body, fd)    => req("POST",   path, body, fd),
  put:    (path, body, fd)    => req("PUT",    path, body, fd),
  patch:  (path, body)        => req("PATCH",  path, body),
  delete: (path, body)        => req("DELETE", path, body),
};
