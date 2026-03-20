import { useAuth } from "../context/AuthContext";

const navItems = [
  { icon: "⬡", label: "Dashboard",  path: "/admin" },
  { icon: "◈", label: "Profile",    path: "/admin/profile" },
  { icon: "◻", label: "Projects",   path: "/admin/projects" },
  { icon: "◈", label: "Skills",     path: "/admin/skills" },
  { icon: "◉", label: "Messages",   path: "/admin/messages" },
  { icon: "⚙", label: "Settings",   path: "/admin/settings" },
];

export default function Sidebar({ currentPath }) {
  const { admin, logout } = useAuth();

  return (
    <aside className="admin-sidebar">
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
          >
            <span className="sidebar-link-icon">{item.icon}</span>
            {item.label}
          </a>
        ))}

        <div className="sidebar-section-label" style={{ marginTop: "0.5rem" }}>
          Site
        </div>
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
