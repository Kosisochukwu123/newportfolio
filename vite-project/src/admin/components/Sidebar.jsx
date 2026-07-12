import { useAuth } from "../context/AuthContext";

const navItems = [
  { icon: "⬡", label: "Dashboard",  path: "/admin" },
  { icon: "◈", label: "Profile",    path: "/admin/profile" },
  { icon: "◻", label: "Projects",   path: "/admin/projects" },
  { icon: "◈", label: "Skills",     path: "/admin/skills" },
  { icon: "◐", label: "Team",       path: "/admin/team" },
  { icon: "❝",  label: "Testimonials", path: "/admin/testimonials" },
  { icon: "🐞", label: "Bug Reports", path: "/admin/bug-reports" },
  { icon: "◉", label: "Messages",   path: "/admin/messages" },
  { icon: "⚙", label: "Settings",   path: "/admin/settings" },
];

// Same pattern used by ProjectsPage.jsx — navigates without a full
// browser reload, so the React app (and AuthContext) never remounts.
function navigate(path) {
  window.history.pushState({}, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

export default function Sidebar({ currentPath, open, onNavigate }) {
  const { admin, logout } = useAuth();

  const handleLinkClick = (e, path) => {
    e.preventDefault();
    navigate(path);
    onNavigate?.(); // closes the mobile drawer after picking a page
  };

  return (
    <aside className={`admin-sidebar ${open ? "open" : ""}`}>
      <div className="sidebar-logo">
        <div className="sidebar-logo-text">▸ PORTFOLIO CMS</div>
        <div className="sidebar-logo-sub">Content Manager</div>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-section-label">Navigation</div>
        {navItems.map((item) => (
          <a
            key={item.path}
            href={item.path}
            className={`sidebar-link ${currentPath === item.path ? "active" : ""}`}
            onClick={(e) => handleLinkClick(e, item.path)}
          >
            <span className="sidebar-link-icon">{item.icon}</span>
            {item.label}
          </a>
        ))}

        <div className="sidebar-section-label" style={{ marginTop: "0.5rem" }}>
          Site
        </div>
        {/* This one stays a real navigation — it opens the public site
            in a new tab, so a full page load is exactly what we want. */}
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="sidebar-link"
        >
          <span className="sidebar-link-icon">↗</span>
          View Portfolio
        </a>
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">{admin?.email}</div>
        <button
          className="btn-admin btn-ghost-admin"
          style={{ width: "100%", justifyContent: "center" }}
          onClick={logout}
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}