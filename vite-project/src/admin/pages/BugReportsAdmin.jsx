import { useEffect, useState } from "react";
import { api } from "../utils/api";
import { useToast } from "../hooks/useToast";
import Toast from "../components/Toast";

const SEVERITY_COLOR = {
  low: "var(--text-muted)",
  medium: "var(--blue, #4d9eff)",
  high: "#ffbd2e",
  critical: "var(--red)",
};

const STATUS_LABEL = {
  new: "New",
  reviewed: "Reviewed",
  resolved: "Resolved",
};

export default function BugReportsAdmin() {
  const { show, toast } = useToast();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    api.get("/bugs/admin/all").then((d) => setReports(d.data)).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const setStatus = async (id, status) => {
    try {
      await api.put(`/bugs/admin/${id}`, { status });
      show("Status updated");
      load();
    } catch (e) {
      show(e.message, "error");
    }
  };

  const remove = async (id) => {
    if (!confirm("Delete this bug report?")) return;
    try {
      await api.delete(`/bugs/admin/${id}`);
      show("Deleted");
      load();
    } catch (e) {
      show(e.message, "error");
    }
  };

  return (
    <div>
      <Toast toast={toast} />
      <div className="page-header">
        <h1>Bug Reports</h1>
        <p>Reports submitted through the site's "Report Bug" form.</p>
      </div>

      {loading && (
        <p style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)", fontSize: "0.82rem" }}>
          Loading…
        </p>
      )}

      {!loading && reports.length === 0 && (
        <div className="empty-state">No bug reports yet — good sign!</div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {reports.map((r) => (
          <div key={r._id} className="admin-card" style={{ marginBottom: 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", marginBottom: "0.75rem" }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.3rem" }}>
                  <span
                    style={{
                      width: 8, height: 8, borderRadius: "50%",
                      background: SEVERITY_COLOR[r.severity] || "var(--text-muted)",
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", textTransform: "uppercase", color: "var(--text-muted)" }}>
                    {r.severity}
                  </span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "var(--text-muted)" }}>
                    {new Date(r.createdAt).toLocaleString()}
                  </span>
                </div>
                <p style={{ fontSize: "0.9rem", lineHeight: 1.6 }}>{r.description}</p>
                {(r.name || r.email) && (
                  <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.4rem" }}>
                    {r.name || "Anonymous"} {r.email && `· ${r.email}`}
                  </p>
                )}
                {r.pageUrl && (
                  <a
                    href={r.pageUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--accent)", display: "inline-block", marginTop: "0.3rem" }}
                  >
                    {r.pageUrl} ↗
                  </a>
                )}
              </div>

              <span
                style={{
                  fontFamily: "var(--font-mono)", fontSize: "0.68rem", padding: "0.2rem 0.55rem", borderRadius: 4, flexShrink: 0,
                  background: r.status === "resolved" ? "var(--green-dim)" : r.status === "reviewed" ? "var(--accent-dim)" : "var(--red-dim)",
                  color: r.status === "resolved" ? "var(--green)" : r.status === "reviewed" ? "var(--accent)" : "var(--red)",
                }}
              >
                {STATUS_LABEL[r.status]}
              </span>
            </div>

            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {r.status !== "reviewed" && (
                <button className="btn-admin btn-ghost-admin" style={{ padding: "0.4rem 0.7rem", fontSize: "0.78rem" }} onClick={() => setStatus(r._id, "reviewed")}>
                  Mark Reviewed
                </button>
              )}
              {r.status !== "resolved" && (
                <button className="btn-admin btn-save" style={{ padding: "0.4rem 0.7rem", fontSize: "0.78rem" }} onClick={() => setStatus(r._id, "resolved")}>
                  Mark Resolved
                </button>
              )}
              <button className="btn-admin btn-danger" style={{ padding: "0.4rem 0.7rem", fontSize: "0.78rem" }} onClick={() => remove(r._id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}