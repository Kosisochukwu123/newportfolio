import { useEffect, useState } from "react";
import { api } from "../utils/api";
import { useToast } from "../hooks/useToast";
import Toast from "../components/Toast";

export default function MessagesPage() {
  const { show, toast } = useToast();
  const [messages, setMessages] = useState([]);
  const [open, setOpen]         = useState(null);
  const [loading, setLoading]   = useState(true);

  const load = () => {
    api.get("/contact")
      .then((d) => setMessages(d.data))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const read = async (msg) => {
    if (open?._id === msg._id) { setOpen(null); return; }
    setOpen(msg);
    if (!msg.read) {
      await api.patch(`/contact/${msg._id}/read`).catch(() => {});
      setMessages((m) => m.map((x) => x._id === msg._id ? { ...x, read: true } : x));
    }
  };

  const del = async (id) => {
    if (!confirm("Delete this message?")) return;
    try {
      await api.delete(`/contact/${id}`);
      setMessages((m) => m.filter((x) => x._id !== id));
      if (open?._id === id) setOpen(null);
      show("Message deleted");
    } catch (e) { show(e.message, "error"); }
  };

  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <div>
      <Toast toast={toast} />
      <div className="page-header">
        <h1>Messages {unreadCount > 0 && <span style={{ fontSize: "0.9rem", background: "var(--red-dim)", color: "var(--red)", borderRadius: 6, padding: "0.2rem 0.55rem", marginLeft: "0.5rem", fontFamily: "var(--font-mono)" }}>{unreadCount} unread</span>}</h1>
        <p>Contact form submissions from visitors.</p>
      </div>

      {loading && <p style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)", fontSize: "0.82rem" }}>Loading…</p>}

      {!loading && messages.length === 0 && (
        <div className="empty-state">No messages yet. Your contact form submissions will appear here.</div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {messages.map((msg) => (
          <div key={msg._id}>
            <div
              onClick={() => read(msg)}
              className="admin-card"
              style={{
                marginBottom: 0, cursor: "pointer",
                borderColor: !msg.read ? "rgba(232,255,71,0.2)" : "var(--border)",
                display: "flex", alignItems: "center", gap: "1rem",
              }}
            >
              {!msg.read && (
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--accent)", flexShrink: 0 }} />
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
                  <span style={{ fontWeight: msg.read ? 400 : 700, fontSize: "0.9rem" }}>{msg.name}</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "var(--text-muted)", flexShrink: 0 }}>
                    {new Date(msg.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: 2 }}>
                  {msg.email}{msg.subject ? ` · ${msg.subject}` : ""}
                </div>
                <div style={{ fontSize: "0.82rem", color: "var(--text-dim)", marginTop: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {msg.message}
                </div>
              </div>
              <button className="btn-admin btn-danger" style={{ padding: "0.35rem 0.65rem", fontSize: "0.75rem", flexShrink: 0 }}
                onClick={(e) => { e.stopPropagation(); del(msg._id); }}>✕</button>
            </div>

            {/* Expanded view */}
            {open?._id === msg._id && (
              <div style={{
                background: "var(--bg-elevated)", border: "1px solid var(--border)", borderTop: "none",
                borderRadius: "0 0 var(--radius) var(--radius)", padding: "1.5rem",
              }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", marginBottom: "1rem" }}>
                  {[["From", msg.name], ["Email", msg.email], ["Subject", msg.subject || "—"], ["Date", new Date(msg.createdAt).toLocaleString()]].map(([k, v]) => (
                    <div key={k}>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 2 }}>{k}</div>
                      <div style={{ fontSize: "0.85rem" }}>{v}</div>
                    </div>
                  ))}
                </div>
                <div style={{ borderTop: "1px solid var(--border)", paddingTop: "1rem", fontSize: "0.9rem", lineHeight: 1.75, whiteSpace: "pre-wrap" }}>
                  {msg.message}
                </div>
                <a href={`mailto:${msg.email}?subject=Re: ${msg.subject || "Your message"}`}
                  className="btn-admin btn-outline-admin" style={{ marginTop: "1rem", display: "inline-flex" }}>
                  Reply via Email ↗
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
