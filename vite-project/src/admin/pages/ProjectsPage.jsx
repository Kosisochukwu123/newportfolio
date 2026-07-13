import { useEffect, useState } from "react";
import { api } from "../utils/api";
import { useToast } from "../hooks/useToast";
import Toast from "../components/Toast";

export default function ProjectsPage() {
  const { show, toast } = useToast();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = (url) => {
    window.history.pushState({}, "", url);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  const load = () => {
    api
      .get("/projects/admin/all")
      .then((d) => setProjects(d.data))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const togglePublish = async (p) => {
    try {
      const fd = new FormData();

      fd.append("published", String(!p.published));

      await api.put(`/projects/${p._id}`, fd, true);

      show(`Project ${!p.published ? "published" : "unpublished"}`);

      load();
    } catch (e) {
      show(e.message, "error");
    }
  };

  const deleteProject = async (id) => {
    if (!confirm("Delete this project? This cannot be undone.")) return;

    try {
      await api.delete(`/projects/${id}`);

      show("Project deleted");

      load();
    } catch (e) {
      show(e.message, "error");
    }
  };

  return (
    <div>
      <Toast toast={toast} />

      <div
        className="page-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div>
          <h1>Projects</h1>
          <p>Add, edit, or remove your portfolio projects.</p>
        </div>

        <button
          className="btn-admin btn-save"
          onClick={() => navigate("/admin/projects/new")}
        >
          + New Project
        </button>
      </div>

      {loading && (
        <p
          style={{
            color: "var(--text-muted)",
            fontFamily: "var(--font-mono)",
            fontSize: "0.82rem",
          }}
        >
          Loading…
        </p>
      )}

      {!loading && projects.length === 0 && (
        <div className="empty-state">
          No projects yet.
          <button
            style={{
              color: "var(--accent)",
              border: "none",
              background: "none",
              cursor: "pointer",
              marginLeft: "8px",
            }}
            onClick={() => navigate("/admin/projects/new")}
          >
            Add your first one →
          </button>
        </div>
      )}

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
        }}
      >
        {projects.map((p) => (
          <div
            key={p._id}
            className="admin-card"
            style={{
              marginBottom: 0,
              display: "flex",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            {p.imageUrl?.trim() ? (
              <img
                src={p.imageUrl}
                alt={p.title}
                loading="lazy"
                decoding="async"
                style={{
                  width: 80,
                  height: 52,
                  objectFit: "cover",
                  borderRadius: 6,
                  border: "1px solid var(--border)",
                  flexShrink: 0,
                }}
              />
            ) : (
              <div
                style={{
                  width: 80,
                  height: 52,
                  background: "var(--bg-elevated)",
                  borderRadius: 6,
                  border: "1px solid var(--border)",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--text-muted)",
                  fontSize: "0.7rem",
                  fontFamily: "var(--font-mono)",
                }}
              >
                no img
              </div>
            )}

            <div
              style={{
                flex: 1,
                minWidth: 0,
              }}
            >
              <div
                style={{
                  fontWeight: 700,
                  fontSize: "0.95rem",
                }}
              >
                {p.title}
              </div>

              <div
                style={{
                  color: "var(--text-muted)",
                  fontSize: "0.78rem",
                  fontFamily: "var(--font-mono)",
                  marginTop: 2,
                }}
              >
                {p.subtitle} · {p.year}
                {" · "}
                {p.faqs?.length ?? 0}
                {" FAQs"}
              </div>
            </div>

            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                alignItems: "center",
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.68rem",
                  padding: "0.2rem 0.55rem",
                  borderRadius: 4,
                  background: p.published
                    ? "var(--green-dim)"
                    : "var(--bg-elevated)",
                  color: p.published ? "var(--green)" : "var(--text-muted)",
                }}
              >
                {p.published ? "live" : "draft"}
              </span>

              <button
                className="btn-admin btn-ghost-admin"
                style={{
                  padding: "0.4rem 0.7rem",
                  fontSize: "0.78rem",
                }}
                onClick={() => togglePublish(p)}
              >
                {p.published ? "Unpublish" : "Publish"}
              </button>

              <button
                className="btn-admin btn-outline-admin"
                style={{
                  padding: "0.4rem 0.7rem",
                  fontSize: "0.78rem",
                }}
                onClick={() => navigate(`/admin/projects/${p._id}`)}
              >
                Edit
              </button>

              <button
                className="btn-admin btn-danger"
                style={{
                  padding: "0.4rem 0.7rem",
                  fontSize: "0.78rem",
                }}
                onClick={() => deleteProject(p._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
