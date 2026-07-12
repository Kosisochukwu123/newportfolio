import { useEffect, useState } from "react";
import { useAuth } from "./context/AuthContext";
import Sidebar from "./components/Sidebar";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProfilePage from "./pages/ProfilePage";
import ProjectsPage from "./pages/ProjectsPage";
import ProjectEditor from "./pages/ProjectEditor";
import SkillsPage from "./pages/SkillsPage";
import MessagesPage from "./pages/MessagesPage";
import SettingsPage from "./pages/SettingsPage";
import TeamAdmin from "./pages/TeamAdmin";
import TestimonialsAdmin from "./pages/TestimonialsAdmin";
import BugReportsAdmin from "./pages/BugReportsAdmin";
import "./admin.css";

// Simple client-side router — no react-router needed
function usePage() {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const update = () => {
      setPath(window.location.pathname);
    };

    window.addEventListener("popstate", update);

    return () => {
      window.removeEventListener("popstate", update);
    };
  }, []);

  if (path === "/admin") return "dashboard";
  if (path === "/admin/profile") return "profile";
  if (path === "/admin/projects/new") return "project-new";
  if (path.startsWith("/admin/projects/")) return "project-edit";
  if (path === "/admin/projects") return "projects";
  if (path === "/admin/skills") return "skills";
  if (path === "/admin/team") return "team";
  if (path === "/admin/testimonials") return "testimonials";
  if (path === "/admin/bug-reports") return "bug-reports";
  if (path === "/admin/messages") return "messages";
  if (path === "/admin/settings") return "settings";

  return "dashboard";
}

const pageTitles = {
  dashboard: "Dashboard",
  profile: "Edit Profile",
  projects: "Projects",
  "project-new": "New Project",
  "project-edit": "Edit Project",
  skills: "Skills",
  team: "Team",
  testimonials: "Testimonials",
  "bug-reports": "Bug Reports",
  messages: "Messages",
  settings: "Settings",
};

function PageContent({ page }) {
  switch (page) {
    case "profile":
      return <ProfilePage />;

    case "projects":
      return <ProjectsPage />;

    case "project-new":
      return <ProjectEditor />;

    case "project-edit":
      return <ProjectEditor />;

    case "skills":
      return <SkillsPage />;

    case "team":
      return <TeamAdmin />;

    case "testimonials":
      return <TestimonialsAdmin />;

    case "bug-reports":
      return <BugReportsAdmin />;

    case "messages":
      return <MessagesPage />;

    case "settings":
      return <SettingsPage />;

    default:
      return <Dashboard />;
  }
}

export default function AdminApp() {
  const { admin, loading } = useAuth();

  const page = usePage();

  const [path, setPath] = useState(window.location.pathname);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const update = () => {
      setPath(window.location.pathname);
      setSidebarOpen(false); // close mobile drawer on any navigation
    };

    window.addEventListener("popstate", update);

    return () => {
      window.removeEventListener("popstate", update);
    };
  }, []);

  if (loading) {
    return (
      <div
        className="admin-app"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            color: "var(--text-muted)",
            fontSize: "0.82rem",
          }}
        >
          Loading…
        </span>
      </div>
    );
  }

  if (!admin) {
    return (
      <div className="admin-app">
        <Login />
      </div>
    );
  }

  return (
    <div className="admin-app">
      <div className="admin-layout">
        <Sidebar
          currentPath={path}
          open={sidebarOpen}
          onNavigate={() => setSidebarOpen(false)}
        />

        {sidebarOpen && (
          <div
            className="admin-menu-overlay"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <div className="admin-main">
          <header className="admin-topbar">
            <div className="topbar-left">
              <button
                className={`admin-hamburger ${sidebarOpen ? "active" : ""}`}
                onClick={() => setSidebarOpen((o) => !o)}
                aria-label="Toggle menu"
              >
                <span />
                <span />
                <span />
              </button>
              <span className="topbar-title">{pageTitles[page]}</span>
            </div>

            <div className="topbar-actions">
              <a
                href="/"
                target="_blank"
                rel="noreferrer"
                className="btn-admin btn-ghost-admin"
                style={{
                  fontSize: "0.78rem",
                  padding: "0.4rem 0.8rem",
                }}
              >
                View Portfolio ↗
              </a>
            </div>
          </header>

          <div className="admin-content">
            <PageContent page={page} />
          </div>
        </div>
      </div>
    </div>
  );
}