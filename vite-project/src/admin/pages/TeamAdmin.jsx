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

  // Editing state — only one card's edit form is open at a time.
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", role: "", bio: "" });
  const [editPhotoFile, setEditPhotoFile] = useState(null);
  const [editPhotoPreview, setEditPhotoPreview] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = () => {
    api
      .get("/team/admin/all")
      .then((d) => setMembers(d.data))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  // Revoke the object URL for the local photo preview whenever it
  // changes or the component unmounts, so we don't leak blob URLs.
  useEffect(() => {
    return () => {
      if (editPhotoPreview) URL.revokeObjectURL(editPhotoPreview);
    };
  }, [editPhotoPreview]);

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

  const startEdit = (m) => {
    setEditingId(m._id);
    setEditForm({
      name: m.name || "",
      role: m.role || "",
      bio: m.bio || "",
    });
    setEditPhotoFile(null);
    if (editPhotoPreview) URL.revokeObjectURL(editPhotoPreview);
    setEditPhotoPreview(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    if (editPhotoPreview) URL.revokeObjectURL(editPhotoPreview);
    setEditPhotoPreview(null);
    setEditPhotoFile(null);
  };

  const onPhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setEditPhotoFile(file);
    if (editPhotoPreview) URL.revokeObjectURL(editPhotoPreview);
    setEditPhotoPreview(URL.createObjectURL(file));
  };

  const saveEdit = async (id) => {
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("name", editForm.name);
      formData.append("role", editForm.role);
      formData.append("bio", editForm.bio);
      if (editPhotoFile) formData.append("photo", editPhotoFile);

      // NOTE: assumes PUT /team/admin/:id accepts multipart/form-data
      // and that `api.put` (like axios) will detect the FormData body
      // and set the correct Content-Type automatically. If your admin
      // update route or field names differ, adjust this call.
      await api.put(`/team/admin/${id}`, formData);
      show("Member updated");
      cancelEdit();
      load();
    } catch (e) {
      show(e.message, "error");
    } finally {
      setSaving(false);
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
        {members.map((m) => {
          const isEditing = editingId === m._id;

          return (
            <div key={m._id} className="admin-card" style={{ marginBottom: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
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

                  {/* Editing text/photo only makes sense once the
                      member has actually submitted something. */}
                  {m.status !== "invited" && (
                    <button
                      className="btn-admin btn-outline-admin"
                      style={{ padding: "0.4rem 0.7rem", fontSize: "0.78rem" }}
                      onClick={() => (isEditing ? cancelEdit() : startEdit(m))}
                    >
                      {isEditing ? "Cancel" : "Edit"}
                    </button>
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

              {isEditing && (
                <div
                  style={{
                    marginTop: "0.9rem",
                    paddingTop: "0.9rem",
                    borderTop: "1px solid var(--border)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.65rem",
                  }}
                >
                  <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem", alignItems: "center" }}>
                      <img
                        src={editPhotoPreview || m.photoUrl || ""}
                        alt=""
                        style={{
                          width: 72, height: 72, objectFit: "cover", borderRadius: "50%",
                          border: "1px solid var(--border)", background: "var(--bg-elevated)",
                          display: editPhotoPreview || m.photoUrl ? "block" : "none",
                        }}
                      />
                      <label
                        className="btn-admin btn-ghost-admin"
                        style={{ padding: "0.3rem 0.6rem", fontSize: "0.72rem", cursor: "pointer" }}
                      >
                        Change photo
                        <input
                          type="file"
                          accept="image/*"
                          onChange={onPhotoChange}
                          style={{ display: "none" }}
                        />
                      </label>
                    </div>

                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                      <input
                        className="input-admin"
                        placeholder="Name"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      />
                      <input
                        className="input-admin"
                        placeholder="Role"
                        value={editForm.role}
                        onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                      />
                      <textarea
                        className="input-admin"
                        placeholder="Bio"
                        rows={3}
                        value={editForm.bio}
                        onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                      />
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
                    <button
                      className="btn-admin btn-ghost-admin"
                      style={{ padding: "0.4rem 0.8rem", fontSize: "0.78rem" }}
                      onClick={cancelEdit}
                      disabled={saving}
                    >
                      Cancel
                    </button>
                    <button
                      className="btn-admin btn-save"
                      style={{ padding: "0.4rem 0.8rem", fontSize: "0.78rem" }}
                      onClick={() => saveEdit(m._id)}
                      disabled={saving}
                    >
                      {saving ? "Saving…" : "Save changes"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}