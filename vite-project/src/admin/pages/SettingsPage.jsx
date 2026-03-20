import { useState } from "react";
import { api } from "../utils/api";
import { useToast } from "../hooks/useToast";
import Toast from "../components/Toast";
import { useAuth } from "../context/AuthContext";

export default function SettingsPage() {
  const { admin } = useAuth();
  const { show, toast } = useToast();
  const [pw, setPw] = useState({ current: "", next: "", confirm: "" });
  const [saving, setSaving] = useState(false);

  const changePassword = async () => {
    if (pw.next !== pw.confirm) { show("New passwords don't match", "error"); return; }
    if (pw.next.length < 8)     { show("Password must be at least 8 characters", "error"); return; }
    setSaving(true);
    try {
      await api.put("/auth/change-password", { currentPassword: pw.current, newPassword: pw.next });
      setPw({ current: "", next: "", confirm: "" });
      show("Password updated!");
    } catch (e) { show(e.message, "error"); }
    finally { setSaving(false); }
  };

  return (
    <div>
      <Toast toast={toast} />
      <div className="page-header">
        <h1>Settings</h1>
        <p>Manage your admin account.</p>
      </div>

      <div className="admin-card">
        <div className="admin-card-title">👤 Account</div>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "0.5rem 0" }}>
          <div style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--accent-dim)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent)", fontWeight: 800, fontSize: "1.1rem" }}>
            {admin?.email?.[0]?.toUpperCase()}
          </div>
          <div>
            <div style={{ fontWeight: 600 }}>{admin?.email}</div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>Administrator</div>
          </div>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-title">🔐 Change Password</div>
        <div className="form-group">
          <label className="form-label">Current Password</label>
          <input className="form-input" type="password" value={pw.current}
            onChange={(e) => setPw((p) => ({ ...p, current: e.target.value }))} />
        </div>
        <div className="form-group">
          <label className="form-label">New Password</label>
          <input className="form-input" type="password" value={pw.next}
            onChange={(e) => setPw((p) => ({ ...p, next: e.target.value }))} />
        </div>
        <div className="form-group">
          <label className="form-label">Confirm New Password</label>
          <input className="form-input" type="password" value={pw.confirm}
            onChange={(e) => setPw((p) => ({ ...p, confirm: e.target.value }))} />
        </div>
        <button className="btn-admin btn-save" onClick={changePassword} disabled={saving || !pw.current || !pw.next || !pw.confirm}>
          {saving ? "Updating…" : "Update Password"}
        </button>
      </div>

      <div className="admin-card">
        <div className="admin-card-title">🔗 Useful Links</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          {[
            { label: "View live portfolio", href: "/" },
            { label: "Backend health check", href: `${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/health` },
          ].map((l) => (
            <a key={l.label} href={l.href} target="_blank" rel="noreferrer"
              style={{ fontFamily: "var(--font-mono)", fontSize: "0.82rem", color: "var(--accent)", display: "flex", alignItems: "center", gap: "0.4rem" }}>
              {l.label} ↗
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
