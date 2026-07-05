import { useEffect, useState } from "react";
import { api } from "../utils/api"; // adjust path to match your admin folder structure
import { useToast } from "../hooks/useToast";
import Toast from "../components/Toast";

const STATUS_LABEL = {
  invited: "Invite sent — awaiting response",
  submitted: "Pending review",
  approved: "Live on team page",
  rejected: "Rejected",
};

export default function TeamAdmin() {
  const { show, toast } = useToast();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [latestLink, setLatestLink] = useState(null);

  const load = () => {
    api
      .get("/team/admin/all")
      .then((d) => setMembers(d.data))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const generateInvite = async () => {
    setGenerating(true);
    try {
      const res = await api.post("/team/admin/invite");
      const link = `${window.location.origin}/join/${res.data.inviteToken}`;
      setLatestLink(link);
      show("Invite link created");
      load();
    } catch (e) {
      show(e.message, "error");
    } finally {
      setGenerating(false);
    }
  };

  const copyLink = (link) => {
    navigator.clipboard.writeText(link);
    show("Link copied to clipboard");
  };

  const approve = async (id) => {
    try {
      await api.put(`/team/admin/${id}/approve`);
      show("Member approved — now live");
      load();
    } catch (e) {
      show(e.message, "error");
    }
  };

  const reject = async (id) => {
    try {
      await api.put(`/team/admin/${id}/reject`);
      show("Submission rejected");
      load();
    } catch (e) {
      show(e.message, "error");
    }
  };

  const remove = async (id) => {
    if (!confirm("Delete this invite/member? This cannot be undone.")) return;
    try {
      await api.delete(`/team/admin/${id}`);
      show("Removed");
      load();
    } catch (e) {
      show(e.message, "error");
    }
  };

  return (
    <div>
      <Toast toast={toast} />

      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1>Team</h1>
          <p>Invite friends to join the team, and review submissions before they go live.</p>
        </div>
        <button className="btn-admin btn-save" onClick={generateInvite} disabled={generating}>
          {generating ? "Creating…" : "+ Generate Invite Link"}
        </button>
      </div>

      {latestLink && (
        <div className="admin-card" style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <code style={{ flex: 1, fontFamily: "var(--font-mono)", fontSize: "0.8rem", wordBreak: "break-all" }}>
            {latestLink}
          </code>
          <button className="btn-admin btn-outline-admin" onClick={() => copyLink(latestLink)}>
            Copy
          </button>
        </div>
      )}

      {loading && <p style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)", fontSize: "0.82rem" }}>Loading…</p>}

      {!loading && members.length === 0 && (
        <div className="empty-state">No invites yet — generate one to get started.</div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {members.map((m) => (
          <div key={m._id} className="admin-card" style={{ marginBottom: 0, display: "flex", alignItems: "center", gap: "1rem" }}>
            {m.photoUrl ? (
              <img
                src={m.photoUrl}
                alt={m.name}
                style={{ width: 52, height: 52, objectFit: "cover", borderRadius: "50%", border: "1px solid var(--border)", flexShrink: 0 }}
              />
            ) : (
              <div
                style={{
                  width: 52, height: 52, borderRadius: "50%", background: "var(--bg-elevated)",
                  border: "1px solid var(--border)", flexShrink: 0, display: "flex",
                  alignItems: "center", justifyContent: "center", color: "var(--text-muted)", fontSize: "0.7rem",
                }}
              >
                {m.status === "invited" ? "…" : "no img"}
              </div>
            )}

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>
                {m.name || "(not yet filled in)"}
              </div>
              <div style={{ color: "var(--text-muted)", fontSize: "0.78rem", fontFamily: "var(--font-mono)", marginTop: 2 }}>
                {m.role || "—"} · {STATUS_LABEL[m.status]}
              </div>
            </div>

            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexShrink: 0 }}>
              {m.status === "invited" && (
                <button
                  className="btn-admin btn-ghost-admin"
                  style={{ padding: "0.4rem 0.7rem", fontSize: "0.78rem" }}
                  onClick={() => copyLink(`${window.location.origin}/join/${m.inviteToken}`)}
                >
                  Copy Link
                </button>
              )}

              {m.status === "submitted" && (
                <>
                  <button
                    className="btn-admin btn-save"
                    style={{ padding: "0.4rem 0.7rem", fontSize: "0.78rem" }}
                    onClick={() => approve(m._id)}
                  >
                    Approve
                  </button>
                  <button
                    className="btn-admin btn-danger"
                    style={{ padding: "0.4rem 0.7rem", fontSize: "0.78rem" }}
                    onClick={() => reject(m._id)}
                  >
                    Reject
                  </button>
                </>
              )}

              <button
                className="btn-admin btn-danger"
                style={{ padding: "0.4rem 0.7rem", fontSize: "0.78rem" }}
                onClick={() => remove(m._id)}
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