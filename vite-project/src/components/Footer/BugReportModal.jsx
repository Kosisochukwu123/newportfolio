import { useState } from "react";
import "./BugReportModal.css";

const API = import.meta.env.VITE_API_URL || "/api";

const SEVERITIES = [
  { value: "low", label: "Low — cosmetic issue" },
  { value: "medium", label: "Medium — something's off" },
  { value: "high", label: "High — feature doesn't work" },
  { value: "critical", label: "Critical — site is broken" },
];

export default function BugReportModal({ onClose }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    description: "",
    severity: "medium",
  });
  const [status, setStatus] = useState(null); // "sending" | "sent" | "error"

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.description.trim()) return;

    setStatus("sending");
    try {
      const res = await fetch(`${API}/bugs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          pageUrl: window.location.href,
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="bug-overlay" onClick={onClose}>
      <div className="bug-modal" onClick={(e) => e.stopPropagation()}>
        <button className="bug-close" onClick={onClose} aria-label="Close">
          ✕
        </button>

        {status === "sent" ? (
          <div className="bug-success">
            <span className="bug-success-icon">🎉</span>
            <h3>Thanks for the report!</h3>
            <p>We'll look into it. Appreciate you taking the time.</p>
            <button className="btn btn-primary" onClick={onClose}>
              Close
            </button>
          </div>
        ) : (
          <>
            <p className="bug-eyebrow">🐞 Report a Bug</p>
            <h3 className="bug-title">Found something broken?</h3>
            <p className="bug-sub">
              Tell us what happened — the more detail, the faster we can fix it.
            </p>

            <form className="bug-form" onSubmit={handleSubmit}>
              <div className="bug-form-row">
                <input
                  className="bug-input"
                  placeholder="Your name (optional)"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                />
                <input
                  className="bug-input"
                  type="email"
                  placeholder="Email (optional, for follow-up)"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                />
              </div>

              <textarea
                className="bug-input bug-textarea"
                placeholder="What went wrong? What were you trying to do?"
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                required
              />

              <select
                className="bug-input bug-select"
                value={form.severity}
                onChange={(e) => set("severity", e.target.value)}
              >
                {SEVERITIES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>

              <button
                type="submit"
                className="btn btn-primary bug-submit"
                disabled={status === "sending" || !form.description.trim()}
              >
                {status === "sending" ? "Sending…" : "Submit Report"}
              </button>

              {status === "error" && (
                <p className="bug-error">Something went wrong. Try again, or email us directly.</p>
              )}
            </form>
          </>
        )}
      </div>
    </div>
  );
}