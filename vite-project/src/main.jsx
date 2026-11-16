
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./admin/context/AuthContext";
import AdminApp from "./admin/AdminApp";
import App from "./App.jsx";
import "./styles/globals.css";

const isAdmin = window.location.pathname.startsWith("/admin");

// Register offline image caching for the public website only.
// The admin dashboard is deliberately excluded.
if (
  !isAdmin &&
  import.meta.env.PROD &&
  "serviceWorker" in navigator
) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log(
          "[GH Studios] Offline image caching enabled:",
          registration.scope,
        );
      })
      .catch((error) => {
        console.error(
          "[GH Studios] Service worker registration failed:",
          error,
        );
      });
  });
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {isAdmin ? (
      <AuthProvider>
        <AdminApp />
      </AuthProvider>
    ) : (
      <BrowserRouter>
        <App />
      </BrowserRouter>
    )}
  </StrictMode>
);
