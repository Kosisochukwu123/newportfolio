import { useEffect, useState } from "react";
import { api } from "../utils/api";

export default function Dashboard() {
  const [stats, setStats] = useState({ projects: 0, skills: 0, messages: 0, unread: 0 });

  useEffect(() => {
    Promise.allSettled([
      api.get("/projects/admin/all"),
      api.get("/skills"),
      api.get("/contact"),
      api.get("/contact?unread=true"),
    ]).then(([proj, skills, msgs, unread]) => {
      setStats({
        projects: proj.value?.count ?? 0,
        skills:   skills.value?.data?.length ?? 0,
        messages: msgs.value?.count ?? 0,
        unread:   unread.value?.count ?? 0,
      });
    });
  }, []);

  const cards = [
    { label: "Projects",        value: stats.projects, icon: "◻", link: "/admin/projects", color: "#4d9eff" },
    { label: "Skills",          value: stats.skills,   icon: "◈", link: "/admin/skills",   color: "#e8ff47" },
    { label: "Total Messages",  value: stats.messages, icon: "◉", link: "/admin/messages", color: "#28c840" },
    { label: "Unread Messages", value: stats.unread,   icon: "●", link: "/admin/messages", color: "#ff4d4d" },
  ];

  return (
    <div>
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Welcome back. Here's what's happening with your portfolio.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        {cards.map((c) => (
          <a
            key={c.label}
            href={c.link}
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius)",
              padding: "1.5rem",
              display: "block",
              transition: "border-color 0.2s",
              textDecoration: "none",
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = c.color + "55"}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--border)"}
          >
            <div style={{ fontSize: "1.4rem", marginBottom: "0.75rem", color: c.color }}>{c.icon}</div>
            <div style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "0.25rem", color: c.color }}>{c.value}</div>
            <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>{c.label}</div>
          </a>
        ))}
      </div>

      <div className="admin-card">
        <div className="admin-card-title">⚡ Quick Actions</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
          {[
            { label: "Edit Profile",      href: "/admin/profile" },
            { label: "Add Project",       href: "/admin/projects/new" },
            { label: "Manage Skills",     href: "/admin/skills" },
            { label: "Read Messages",     href: "/admin/messages" },
            { label: "View Portfolio ↗",  href: "/", target: "_blank" },
          ].map((a) => (
            <a key={a.label} href={a.href} target={a.target} className="btn-admin btn-ghost-admin">
              {a.label}
            </a>
          ))}
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-title">📋 How to use the CMS</div>
        <ol style={{ paddingLeft: "1.25rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          {[
            "Go to Profile → update your name, bio, photo, and contact details",
            "Go to Projects → add/edit your work, upload screenshots, write FAQ answers",
            "Go to Skills → add or remove technologies from each category",
            "Go to Messages → read contact form submissions from visitors",
            "Every save instantly updates your live portfolio",
          ].map((step, i) => (
            <li key={i} style={{ fontSize: "0.875rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
              {step}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
