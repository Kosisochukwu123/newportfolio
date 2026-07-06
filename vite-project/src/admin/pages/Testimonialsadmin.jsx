import { useEffect, useState, useRef } from "react";
import { api } from "../utils/api";
import { useToast } from "../hooks/useToast";
import Toast from "../components/Toast";

const empty = { name: "", role: "", quote: "", published: true, photoFile: null };

export default function TestimonialsAdmin() {
  const { show, toast } = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef();

  const load = () =>
    api.get("/testimonials/admin/all").then((d) => setItems(d.data)).finally(() => setLoading(false));

  useEffect(load, []);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const addTestimonial = async () => {
    if (!form.name.trim() || !form.quote.trim()) return;
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("role", form.role);
      fd.append("quote", form.quote);
      fd.append("published", String(form.published));
      fd.append("order", items.length);
      if (form.photoFile) fd.append("photo", form.photoFile);

      await api.post("/testimonials/admin", fd, true);
      setForm(empty);
      await load();
      show("Testimonial added");
    } catch (e) {
      show(e.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const togglePublished = async (t) => {
    try {
      const fd = new FormData();
      fd.append("published", String(!t.published));
      await api.put(`/testimonials/admin/${t._id}`, fd, true);
      await load();
      show(t.published ? "Hidden from site" : "Now visible on site");
    } catch (e) {
      show(e.message, "error");
    }
  };

  const remove = async (id) => {
    if (!confirm("Delete this testimonial?")) return;
    try {
      await api.delete(`/testimonials/admin/${id}`);
      await load();
      show("Testimonial deleted");
    } catch (e) {
      show(e.message, "error");
    }
  };

  return (
    <div>
      <Toast toast={toast} />
      <div className="page-header">
        <h1>Testimonials</h1>
        <p>Manage what shows in the testimonials section on your site.</p>
      </div>

      <div className="admin-card">
        <div className="admin-card-title">+ Add a Testimonial</div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Name</label>
            <input
              className="form-input"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="Adilla & Fadil"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Role / Context (optional)</label>
            <input
              className="form-input"
              value={form.role}
              onChange={(e) => set("role", e.target.value)}
              placeholder="Client — Wedding Project"
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Quote</label>
          <textarea
            className="form-textarea"
            value={form.quote}
            onChange={(e) => set("quote", e.target.value)}
            placeholder="What did they say?"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Photo (optional)</label>
          <div
            className="upload-zone"
            style={{ padding: "1rem" }}
            onClick={() => fileRef.current.click()}
          >
            {form.photoFile ? (
              <img src={URL.createObjectURL(form.photoFile)} alt="preview" style={{ maxHeight: 80, borderRadius: "50%" }} />
            ) : (
              <div className="upload-zone-text">Click to upload a photo</div>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => e.target.files[0] && set("photoFile", e.target.files[0])}
          />
        </div>

        <button
          className="btn-admin btn-save"
          onClick={addTestimonial}
          disabled={saving || !form.name.trim() || !form.quote.trim()}
        >
          {saving ? "Adding…" : "+ Add Testimonial"}
        </button>
      </div>

      {loading && <p style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)", fontSize: "0.82rem" }}>Loading…</p>}

      {!loading && items.length === 0 && (
        <div className="empty-state">No testimonials yet.</div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {items.map((t) => (
          <div key={t._id} className="admin-card" style={{ marginBottom: 0, display: "flex", alignItems: "center", gap: "1rem" }}>
            {t.photoUrl ? (
              <img src={t.photoUrl} alt={t.name} style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover", border: "1px solid var(--border)", flexShrink: 0 }} />
            ) : (
              <div style={{ width: 48, height: 48, borderRadius: "50%", background: "var(--bg-elevated)", border: "1px solid var(--border)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)", fontSize: "0.8rem" }}>
                {t.name?.[0] || "?"}
              </div>
            )}

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>{t.name}</div>
              <div style={{ color: "var(--text-muted)", fontSize: "0.78rem", marginTop: 2 }}>
                {t.quote.length > 80 ? t.quote.slice(0, 80) + "…" : t.quote}
              </div>
            </div>

            <span
              style={{
                fontFamily: "var(--font-mono)", fontSize: "0.68rem", padding: "0.2rem 0.55rem", borderRadius: 4,
                background: t.published ? "var(--green-dim)" : "var(--bg-elevated)",
                color: t.published ? "var(--green)" : "var(--text-muted)",
                flexShrink: 0,
              }}
            >
              {t.published ? "live" : "hidden"}
            </span>

            <button className="btn-admin btn-ghost-admin" style={{ padding: "0.4rem 0.7rem", fontSize: "0.78rem" }} onClick={() => togglePublished(t)}>
              {t.published ? "Hide" : "Publish"}
            </button>
            <button className="btn-admin btn-danger" style={{ padding: "0.4rem 0.7rem", fontSize: "0.78rem" }} onClick={() => remove(t._id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}