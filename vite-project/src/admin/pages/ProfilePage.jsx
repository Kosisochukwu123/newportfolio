import { useEffect, useState, useRef } from "react";
import { api } from "../utils/api";
import { useToast } from "../hooks/useToast";
import Toast from "../components/Toast";

const API = import.meta.env.VITE_API_URL;

export default function ProfilePage() {
  const { show, toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef();

  const [form, setForm] = useState({
    name: "",
    tagline: "",
    heroBio: "",
    terminalLines: ["", "", ""],
    availableForWork: true,
    aboutBio: ["", "", ""],
    yearsExperience: "",
    projectsShipped: "",
    email: "",
    location: "",
    timezone: "",
    socials: [],
    resumeUrl: "",
    metaTitle: "",
    metaDescription: "",
    avatarUrl: "",
  });

  useEffect(() => {
    let mounted = true;

    api.get("/profile")
      .then(({ data }) => {
        if (!mounted) return;

        setForm({
          name: data.name || "",
          tagline: data.tagline || "",
          heroBio: data.heroBio || "",
          terminalLines: data.terminalLines?.length ? data.terminalLines : ["", "", ""],
          availableForWork: data.availableForWork ?? true,
          aboutBio: data.aboutBio?.length ? data.aboutBio : ["", "", ""],
          yearsExperience: data.yearsExperience || "",
          projectsShipped: data.projectsShipped || "",
          email: data.email || "",
          location: data.location || "",
          timezone: data.timezone || "",
          socials: data.socials || [],
          resumeUrl: data.resumeUrl || "",
          metaTitle: data.metaTitle || "",
          metaDescription: data.metaDescription || "",
          avatarUrl: data.avatarUrl || "",
        });
      })
      .catch((err) => {
        console.error("Profile load failed:", err);
        show("Failed to load profile", "error");
      });

    return () => {
      mounted = false;
    };
  }, []);

  const set = (key, val) =>
    setForm((f) => ({ ...f, [key]: val }));

  const setLine = (key, idx, val) =>
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

  const addSocial = () =>
    setForm((f) => ({
      ...f,
      socials: [...f.socials, { label: "", url: "" }],
    }));

  const removeSocial = (i) =>
    setForm((f) => ({
      ...f,
      socials: f.socials.filter((_, idx) => idx !== i),
    }));

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
    if (!file) return;

    setUploading(true);

    try {
      const fd = new FormData();
      fd.append("avatar", file);

      const res = await fetch(`${API}/profile/avatar`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("portfolio_token")}`,
        },
        body: fd,
      });

      const data = await res.json();

      if (!data.success) throw new Error(data.message);

      set("avatarUrl", data.avatarUrl || "");
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
        <p>Edit your portfolio content</p>
      </div>

      {/* AVATAR */}
      <div className="admin-card">
        <div className="admin-card-title">📷 Profile Photo</div>

        <div className="avatar-wrap">
          <div
            className="avatar-box"
            onClick={() => fileRef.current.click()}
          >
            {form.avatarUrl ? (
              <img
                src={form.avatarUrl}
                alt="avatar"
              />
            ) : (
              <span>👤</span>
            )}
          </div>

          <button
            className="btn-admin btn-ghost-admin"
            onClick={() => fileRef.current.click()}
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Upload Photo"}
          </button>

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) =>
              uploadPhoto(e.target.files?.[0])
            }
          />
        </div>
      </div>

      {/* HERO */}
      <div className="admin-card">
        <div className="admin-card-title">🦸 Hero</div>

        <input
          className="form-input"
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
          placeholder="Name"
        />

        <input
          className="form-input"
          value={form.tagline}
          onChange={(e) => set("tagline", e.target.value)}
          placeholder="Tagline"
        />

        <textarea
          className="form-textarea"
          value={form.heroBio}
          onChange={(e) => set("heroBio", e.target.value)}
        />

        {form.terminalLines.map((l, i) => (
          <input
            key={i}
            className="form-input"
            value={l}
            onChange={(e) =>
              setLine("terminalLines", i, e.target.value)
            }
            placeholder={`Line ${i + 1}`}
          />
        ))}

        <label className="toggle-row">
          <span>Available</span>
          <input
            type="checkbox"
            checked={form.availableForWork}
            onChange={(e) =>
              set("availableForWork", e.target.checked)
            }
          />
        </label>
      </div>

      {/* SAVE */}
      <button
        className="btn-admin btn-save"
        onClick={save}
        disabled={saving}
      >
        {saving ? "Saving..." : "Save Profile"}
      </button>
    </div>
  );
}