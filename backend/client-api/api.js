// src/services/api.js
// Drop this into your React portfolio's src/services/ folder.
// It gives you one clean interface to every backend endpoint.

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// ── Helpers ──────────────────────────────────────────────────────────────────

const getToken = () => localStorage.getItem("portfolio_token");

const headers = (isFormData = false) => {
  const h = {};
  const token = getToken();
  if (token) h["Authorization"] = `Bearer ${token}`;
  if (!isFormData) h["Content-Type"] = "application/json";
  return h;
};

const request = async (method, path, body = null, isFormData = false) => {
  const options = {
    method,
    headers: headers(isFormData),
  };
  if (body) options.body = isFormData ? body : JSON.stringify(body);

  const res = await fetch(`${BASE_URL}${path}`, options);
  const data = await res.json();

  if (!res.ok) throw new Error(data.message || "API request failed");
  return data;
};

// ── Auth ─────────────────────────────────────────────────────────────────────

export const authAPI = {
  login: (email, password) =>
    request("POST", "/auth/login", { email, password }),

  getMe: () => request("GET", "/auth/me"),

  changePassword: (currentPassword, newPassword) =>
    request("PUT", "/auth/change-password", { currentPassword, newPassword }),

  logout: () => localStorage.removeItem("portfolio_token"),

  saveToken: (token) => localStorage.setItem("portfolio_token", token),
};

// ── Profile ──────────────────────────────────────────────────────────────────

export const profileAPI = {
  get: () => request("GET", "/profile"),

  update: (data) => request("PUT", "/profile", data),

  uploadAvatar: (file) => {
    const form = new FormData();
    form.append("avatar", file);
    return request("POST", "/profile/avatar", form, true);
  },
};

// ── Projects ─────────────────────────────────────────────────────────────────

export const projectsAPI = {
  // Public
  getAll: () => request("GET", "/projects"),
  getFeatured: () => request("GET", "/projects?featured=true"),
  getOne: (id) => request("GET", `/projects/${id}`),

  // Admin
  getAllAdmin: () => request("GET", "/projects/admin/all"),

  create: (formData) => request("POST", "/projects", formData, true),

  update: (id, formData) => request("PUT", `/projects/${id}`, formData, true),

  delete: (id) => request("DELETE", `/projects/${id}`),

  reorder: (orderArray) =>
    request("PATCH", "/projects/reorder", { order: orderArray }),

  // FAQs
  addFaq: (projectId, faq) =>
    request("POST", `/projects/${projectId}/faqs`, faq),

  updateFaq: (projectId, faqId, data) =>
    request("PUT", `/projects/${projectId}/faqs/${faqId}`, data),

  deleteFaq: (projectId, faqId) =>
    request("DELETE", `/projects/${projectId}/faqs/${faqId}`),
};

// ── Skills ───────────────────────────────────────────────────────────────────

export const skillsAPI = {
  getAll: () => request("GET", "/skills"),

  create: (skill) => request("POST", "/skills", skill),

  update: (id, data) => request("PUT", `/skills/${id}`, data),

  delete: (id) => request("DELETE", `/skills/${id}`),

  bulkReplace: (skills) => request("POST", "/skills/bulk", { skills }),
};

// ── Contact ──────────────────────────────────────────────────────────────────

export const contactAPI = {
  // Public
  send: (name, email, subject, message) =>
    request("POST", "/contact", { name, email, subject, message }),

  // Admin
  getMessages: (unreadOnly = false) =>
    request("GET", `/contact${unreadOnly ? "?unread=true" : ""}`),

  markRead: (id) => request("PATCH", `/contact/${id}/read`),

  delete: (id) => request("DELETE", `/contact/${id}`),
};

// ── Upload ───────────────────────────────────────────────────────────────────

export const uploadAPI = {
  image: (file) => {
    const form = new FormData();
    form.append("image", file);
    return request("POST", "/upload/image", form, true);
  },

  deleteImage: (publicId) =>
    request("DELETE", "/upload/image", { publicId }),
};
