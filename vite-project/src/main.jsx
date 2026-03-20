import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AuthProvider } from "./admin/context/AuthContext";
import AdminApp from "./admin/AdminApp";
import App from "./App.jsx";
import "./styles/globals.css";

const isAdmin = window.location.pathname.startsWith("/admin");

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {isAdmin ? (
      <AuthProvider>
        <AdminApp />
      </AuthProvider>
    ) : (
      <App />
    )}
  </StrictMode>
);
