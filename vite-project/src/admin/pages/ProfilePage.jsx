import { useEffect, useState, useRef } from "react";
import { api } from "../utils/api";
import { useToast } from "../hooks/useToast";
import Toast from "../components/Toast";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function ProfilePage() {
  const { show, toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef();

  const [form, setForm] = useState({
    name: "", tagline: "", heroBio: "",
    terminalLines: ["", "", ""],
    availableForWork: true,
    aboutBio: ["", "", ""],
    yearsExperience: "", projectsShipped: "",
    email: "", location: "", timezone: "",
    socials: [],
    resumeUrl: "", metaTitle: "", metaDescription: "",
    avatarUrl: "",
  });

  useEffect(() => {
    api.get("/profile").then(({ data }) => {
      setForm({
        name:             data.name || "",
        tagline:          data.tagline || "",
        heroBio:          data.heroBio || "",
        terminalLines:    data.terminalLines?.length ? data.terminalLines : ["", "", ""],
        availableForWork: data.availableForWork ?? true,
        aboutBio:         data.aboutBio?.length ? data.aboutBio : ["", "", ""],
        yearsExperience:  data.yearsExperience || "",
        projectsShipped:  data.projectsShipped || "",
        email:            data.email || "",
        location:         data.location || "",
        timezone:         data.timezone || "",
        socials:          data.socials || [],
        resumeUrl:        data.resumeUrl || "",
        metaTitle:        data.metaTitle || "",
        metaDescription:  data.metaDescription || "",
        avatarUrl:        data.avatarUrl || "",
      });
    });
  }, []);

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const setLine = (arr, key, idx, val) =>
    setForm((f) => {
      const copy = [...f[key]];
      copy[idx] = val;
      return { ...f, [key]: copy };
    });

  const setSocial = (idx, field, val) =>
    setForm((f) => {
      const s = [...f.socials];
      s[idx] = { ...s[idx], [field]: val };
      return { ...f, socials: s };
    });

  const addSocial    = () => setForm((f) => ({ ...f, socials: [...f.socials, { label: "", url: "" }] }));
  const removeSocial = (i) => setForm((f) => ({ ...f, socials: f.socials.filter((_, idx) => idx !== i) }));

  const save = async () => {
    setSaving(true);
    try {
      await api.put("/profile", form);
      show("Profile saved!");
    } catch (e) {
      show(e.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const uploadPhoto = async (file) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("avatar", file);
      const token = localStorage.getItem("portfolio_token");
      const res = await fetch(`${BASE}/profile/avatar`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      set("avatarUrl", data.avatarUrl);
      show("Photo uploaded!");
    } catch (e) {
      show(e.message, "error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <Toast toast={toast} />
      <div className="page-header">
        <h1>Profile</h1>
        <p>Edit everything displayed on your portfolio — hero, about, contact.</p>
      </div>

      {/* ── Photo ── */}
      <div className="admin-card">
        <div className="admin-card-title">📷 Profile Photo</div>
        <div style={{ display: "flex", gap: "1.5rem", alignItems: "center", flexWrap: "wrap" }}>
          <div
            className="upload-zone"
            style={{ width: 140, height: 140, padding: 0, overflow: "hidden", borderRadius: "50%" }}
            onClick={() => fileRef.current.click()}
          >
            {form.avatarUrl
              ? <img src={form.avatarUrl} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: "2rem" }}>👤</span>
                </div>
            }
          </div>
          <div>
            <button className="btn-admin btn-ghost-admin" onClick={() => fileRef.current.click()} disabled={uploading}>
              {uploading ? "Uploading…" : "Upload Photo"}
            </button>
            <p className="form-hint" style={{ marginTop: "0.5rem" }}>JPG, PNG or WebP · max 3 MB</p>
          </div>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }}
            onChange={(e) => e.target.files[0] && uploadPhoto(e.target.files[0])} />
        </div>
      </div>

      {/* ── Hero ── */}
      <div className="admin-card">
        <div className="admin-card-title">🦸 Hero Section</div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Your Name</label>
            <input className="form-input" value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Your Name" />
          </div>
          <div className="form-group">
            <label className="form-label">Tagline / Job Title</label>
            <input className="form-input" value={form.tagline} onChange={(e) => set("tagline", e.target.value)} placeholder="Full Stack MERN Developer" />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Hero Bio</label>
          <textarea className="form-textarea" value={form.heroBio} onChange={(e) => set("heroBio", e.target.value)} placeholder="Short intro paragraph..." />
        </div>
        <div className="form-group">
          <label className="form-label">Terminal Lines (3 lines shown in the code block)</label>
          {form.terminalLines.map((line, i) => (
            <input key={i} className="form-input" style={{ marginBottom: "0.4rem" }}
              value={line} onChange={(e) => setLine(null, "terminalLines", i, e.target.value)}
              placeholder={`Line ${i + 1}`} />
          ))}
        </div>
        <div className="toggle-row">
          <div>
            <div className="toggle-label">Available for work</div>
            <div className="toggle-sub">Shows the green "Available" badge on your contact card</div>
          </div>
          <label className="toggle">
            <input type="checkbox" checked={form.availableForWork}
              onChange={(e) => set("availableForWork", e.target.checked)} />
            <span className="toggle-slider" />
          </label>
        </div>
      </div>

      {/* ── About ── */}
      <div className="admin-card">
        <div className="admin-card-title">👤 About Section</div>
        <div className="form-group">
          <label className="form-label">Bio Paragraphs (one per box)</label>
          {form.aboutBio.map((para, i) => (
            <textarea key={i} className="form-textarea" style={{ marginBottom: "0.5rem", minHeight: 80 }}
              value={para} onChange={(e) => setLine(null, "aboutBio", i, e.target.value)}
              placeholder={`Paragraph ${i + 1}`} />
          ))}
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Years Experience</label>
            <input className="form-input" value={form.yearsExperience} onChange={(e) => set("yearsExperience", e.target.value)} placeholder="3+" />
          </div>
          <div className="form-group">
            <label className="form-label">Projects Shipped</label>
            <input className="form-input" value={form.projectsShipped} onChange={(e) => set("projectsShipped", e.target.value)} placeholder="20+" />
          </div>
        </div>
      </div>

      {/* ── Contact ── */}
      <div className="admin-card">
        <div className="admin-card-title">📬 Contact Info</div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Location</label>
            <input className="form-input" value={form.location} onChange={(e) => set("location", e.target.value)} placeholder="Lagos, Nigeria" />
          </div>
          <div className="form-group">
            <label className="form-label">Timezone</label>
            <input className="form-input" value={form.timezone} onChange={(e) => set("timezone", e.target.value)} placeholder="WAT / UTC+1" />
          </div>
          <div className="form-group">
            <label className="form-label">Resume URL</label>
            <input className="form-input" value={form.resumeUrl} onChange={(e) => set("resumeUrl", e.target.value)} placeholder="https://..." />
          </div>
        </div>

        <label className="form-label" style={{ marginBottom: "0.75rem", display: "block" }}>Social Links</label>
        {form.socials.map((s, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 2fr auto", gap: "0.5rem", marginBottom: "0.5rem" }}>
            <input className="form-input" value={s.label} onChange={(e) => setSocial(i, "label", e.target.value)} placeholder="GitHub" />
            <input className="form-input" value={s.url} onChange={(e) => setSocial(i, "url", e.target.value)} placeholder="https://github.com/..." />
            <button className="btn-admin btn-danger" onClick={() => removeSocial(i)}>✕</button>
          </div>
        ))}
        <button className="btn-admin btn-ghost-admin" style={{ marginTop: "0.5rem" }} onClick={addSocial}>+ Add Social Link</button>
      </div>

      {/* ── SEO ── */}
      <div className="admin-card">
        <div className="admin-card-title">🔍 SEO / Meta</div>
        <div className="form-group">
          <label className="form-label">Page Title</label>
          <input className="form-input" value={form.metaTitle} onChange={(e) => set("metaTitle", e.target.value)} placeholder="Your Name — MERN Developer" />
        </div>
        <div className="form-group">
          <label className="form-label">Meta Description</label>
          <textarea className="form-textarea" style={{ minHeight: 70 }} value={form.metaDescription}
            onChange={(e) => set("metaDescription", e.target.value)} placeholder="Short description for Google..." />
        </div>
      </div>

      <button className="btn-admin btn-save" style={{ width: "100%", justifyContent: "center", padding: "0.9rem" }}
        onClick={save} disabled={saving}>
        {saving ? "Saving…" : "💾 Save Profile"}
      </button>
    </div>
  );
}
