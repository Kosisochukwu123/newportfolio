import { useEffect, useState, useRef } from "react";
import { api } from "../utils/api";
import { useToast } from "../hooks/useToast";
import Toast from "../components/Toast";
import { clearCached } from "../../utils/Cache";

const API = import.meta.env.VITE_API_URL || "/api";

const EMPTY_FORM = {
  name: "",
  tagline: "",
  heroBio: "",
  terminalLines: ["", "", ""],
  availableForWork: true,

  aboutHeadline: "",
  aboutDescription: "",
  aboutBio: ["", "", ""],
  mission: "",
  vision: "",

  yearsExperience: "",
  projectsShipped: "",
  clientsServed: "",

  services: [],
  milestones: [],

  email: "",
  phone: "",
  location: "",
  timezone: "",
  socials: [],

  resumeUrl: "",
  metaTitle: "",
  metaDescription: "",
  ogImageUrl: "",
  avatarUrl: "",
};

export default function ProfilePage() {
  const { show, toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const fileRef = useRef(null);

  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => {
    let mounted = true;

    api
      .get("/profile")
      .then(({ data }) => {
        if (!mounted) return;

        setForm({
          ...EMPTY_FORM,
          ...data,

          terminalLines: data.terminalLines?.length
            ? data.terminalLines
            : ["", "", ""],

          aboutBio: data.aboutBio?.length ? data.aboutBio : ["", "", ""],

          services: data.services || [],
          milestones: data.milestones || [],
          socials: data.socials || [],
        });
      })
      .catch((err) => {
        console.error("Profile load failed:", err);
        show("Failed to load profile", "error");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const set = (key, value) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const setArrayItem = (key, index, value) => {
    setForm((current) => {
      const updated = [...current[key]];
      updated[index] = value;

      return {
        ...current,
        [key]: updated,
      };
    });
  };

  const addArrayItem = (key, value) => {
    setForm((current) => ({
      ...current,
      [key]: [...current[key], value],
    }));
  };

  const removeArrayItem = (key, index) => {
    setForm((current) => ({
      ...current,
      [key]: current[key].filter((_, i) => i !== index),
    }));
  };

  const setObjectItem = (key, index, field, value) => {
    setForm((current) => {
      const updated = [...current[key]];

      updated[index] = {
        ...updated[index],
        [field]: value,
      };

      return {
        ...current,
        [key]: updated,
      };
    });
  };

  const save = async () => {
    setSaving(true);

    try {
      await api.put("/profile", form);
      clearCached("profile");
      show("Profile saved successfully!");
    } catch (error) {
      show(error.message || "Failed to save profile", "error");
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

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Photo upload failed");
      }

      set("avatarUrl", data.avatarUrl || "");
      show("Photo uploaded successfully!");
    } catch (error) {
      show(error.message, "error");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  if (loading) {
    return (
      <div>
        <div className="page-header">
          <h1>Profile</h1>
          <p>Loading company profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <Toast toast={toast} />

      <div className="page-header">
        <h1>Profile</h1>
        <p>Manage the information displayed across your company website.</p>
      </div>

      {/* PROFILE PHOTO */}
      <div className="admin-card">
        <div className="admin-card-title">📷 Company Profile Photo</div>

        <div className="avatar-wrap">
          <div className="avatar-box" onClick={() => fileRef.current?.click()}>
            {form.avatarUrl ? (
              <img src={form.avatarUrl} alt="Company profile" />
            ) : (
              <span>👤</span>
            )}
          </div>

          <button
            type="button"
            className="btn-admin btn-ghost-admin"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Upload Photo"}
          </button>

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(event) => uploadPhoto(event.target.files?.[0])}
          />
        </div>
      </div>

      {/* HERO */}
      <div className="admin-card">
        <div className="admin-card-title">🦸 Hero Section</div>

        <label className="profile-field-label">Company Name</label>
        <input
          className="form-input"
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
          placeholder="GH Studios"
        />

        <label className="profile-field-label">Tagline</label>
        <input
          className="form-input"
          value={form.tagline}
          onChange={(e) => set("tagline", e.target.value)}
          placeholder="Your company tagline"
        />

        <label className="profile-field-label">Hero Description</label>
        <textarea
          className="form-textarea"
          value={form.heroBio}
          onChange={(e) => set("heroBio", e.target.value)}
          placeholder="Describe what your company does..."
        />

        <label className="profile-field-label">Terminal Lines</label>
        {form.terminalLines.map((line, index) => (
          <input
            key={index}
            className="form-input"
            value={line}
            onChange={(e) =>
              setArrayItem("terminalLines", index, e.target.value)
            }
            placeholder={`Terminal line ${index + 1}`}
          />
        ))}

        <label className="toggle-row">
          <span>Available for new projects</span>
          <input
            type="checkbox"
            checked={form.availableForWork}
            onChange={(e) => set("availableForWork", e.target.checked)}
          />
        </label>
      </div>

      {/* ABOUT */}
      <div className="admin-card">
        <div className="admin-card-title">🏢 About Section</div>

        <label className="profile-field-label">About Heading</label>
        <input
          className="form-input"
          value={form.aboutHeadline}
          onChange={(e) => set("aboutHeadline", e.target.value)}
          placeholder="Your company introduction heading"
        />

        <label className="profile-field-label">About Description</label>
        <textarea
          className="form-textarea"
          value={form.aboutDescription}
          onChange={(e) => set("aboutDescription", e.target.value)}
          placeholder="Describe your company..."
        />

        <label className="profile-field-label">About Paragraphs</label>
        {form.aboutBio.map((bio, index) => (
          <div key={index} className="profile-array-row">
            <textarea
              className="form-textarea"
              value={bio}
              onChange={(e) => setArrayItem("aboutBio", index, e.target.value)}
              placeholder={`About paragraph ${index + 1}`}
            />
            <button
              type="button"
              className="btn-admin btn-ghost-admin"
              onClick={() => removeArrayItem("aboutBio", index)}
            >
              Remove
            </button>
          </div>
        ))}

        <button
          type="button"
          className="btn-admin btn-ghost-admin"
          onClick={() => addArrayItem("aboutBio", "")}
        >
          + Add Paragraph
        </button>

        <label className="profile-field-label">Our Mission</label>
        <textarea
          className="form-textarea"
          value={form.mission}
          onChange={(e) => set("mission", e.target.value)}
        />

        <label className="profile-field-label">Our Vision</label>
        <textarea
          className="form-textarea"
          value={form.vision}
          onChange={(e) => set("vision", e.target.value)}
        />
      </div>

      {/* STATISTICS */}
      <div className="admin-card">
        <div className="admin-card-title">📊 Company Statistics</div>

        <label className="profile-field-label">Years of Experience</label>
        <input
          type="number"
          min="0"
          className="form-input"
          value={form.yearsExperience}
          onChange={(e) => set("yearsExperience", e.target.value)}
        />

        <label className="profile-field-label">Projects Shipped</label>
        <input
          type="number"
          min="0"
          className="form-input"
          value={form.projectsShipped}
          onChange={(e) => set("projectsShipped", e.target.value)}
        />

        <label className="profile-field-label">Clients Served</label>
        <input
          type="number"
          min="0"
          className="form-input"
          value={form.clientsServed}
          onChange={(e) => set("clientsServed", e.target.value)}
        />
      </div>

      {/* SERVICES */}
      <div className="admin-card">
        <div className="admin-card-title">⚙️ Company Services</div>

        {form.services.map((service, index) => (
          <div key={index} className="profile-array-row">
            <input
              className="form-input"
              value={service}
              onChange={(e) => setArrayItem("services", index, e.target.value)}
              placeholder={`Service ${index + 1}`}
            />

            <button
              type="button"
              className="btn-admin btn-ghost-admin"
              onClick={() => removeArrayItem("services", index)}
            >
              Remove
            </button>
          </div>
        ))}

        <button
          type="button"
          className="btn-admin btn-ghost-admin"
          onClick={() => addArrayItem("services", "")}
        >
          + Add Service
        </button>
      </div>

      {/* MILESTONES */}
      <div className="admin-card">
        <div className="admin-card-title">🏆 Company Milestones</div>

        {form.milestones.map((milestone, index) => (
          <div key={index} className="profile-milestone">
            <input
              className="form-input"
              value={milestone.year || ""}
              onChange={(e) =>
                setObjectItem("milestones", index, "year", e.target.value)
              }
              placeholder="Year"
            />

            <input
              className="form-input"
              value={milestone.label || ""}
              onChange={(e) =>
                setObjectItem("milestones", index, "label", e.target.value)
              }
              placeholder="Milestone description"
            />

            <button
              type="button"
              className="btn-admin btn-ghost-admin"
              onClick={() => removeArrayItem("milestones", index)}
            >
              Remove
            </button>
          </div>
        ))}

        <button
          type="button"
          className="btn-admin btn-ghost-admin"
          onClick={() => addArrayItem("milestones", { year: "", label: "" })}
        >
          + Add Milestone
        </button>
      </div>

      {/* CONTACT */}
      <div className="admin-card">
        <div className="admin-card-title">📩 Contact Information</div>

        <label className="profile-field-label">Email Address</label>
        <input
          type="email"
          className="form-input"
          value={form.email}
          onChange={(e) => set("email", e.target.value)}
        />

        <label className="profile-field-label">Phone Number</label>
        <input
          className="form-input"
          value={form.phone}
          onChange={(e) => set("phone", e.target.value)}
        />

        <label className="profile-field-label">Location</label>
        <input
          className="form-input"
          value={form.location}
          onChange={(e) => set("location", e.target.value)}
        />

        <label className="profile-field-label">Timezone</label>
        <input
          className="form-input"
          value={form.timezone}
          onChange={(e) => set("timezone", e.target.value)}
          placeholder="Africa/Lagos"
        />

        <label className="profile-field-label">Resume URL</label>
        <input
          className="form-input"
          value={form.resumeUrl}
          onChange={(e) => set("resumeUrl", e.target.value)}
          placeholder="https://..."
        />
      </div>

      {/* SOCIAL LINKS */}
      <div className="admin-card">
        <div className="admin-card-title">🌐 Social Media Links</div>

        {form.socials.map((social, index) => (
          <div key={index} className="profile-social-row">
            <input
              className="form-input"
              value={social.label || ""}
              onChange={(e) =>
                setObjectItem("socials", index, "label", e.target.value)
              }
              placeholder="Platform (e.g. LinkedIn)"
            />

            <input
              className="form-input"
              value={social.url || ""}
              onChange={(e) =>
                setObjectItem("socials", index, "url", e.target.value)
              }
              placeholder="https://..."
            />

            <button
              type="button"
              className="btn-admin btn-ghost-admin"
              onClick={() => removeArrayItem("socials", index)}
            >
              Remove
            </button>
          </div>
        ))}

        <button
          type="button"
          className="btn-admin btn-ghost-admin"
          onClick={() => addArrayItem("socials", { label: "", url: "" })}
        >
          + Add Social Link
        </button>
      </div>

      {/* SEO */}
      <div className="admin-card">
        <div className="admin-card-title">🔎 SEO & Social Sharing</div>

        <label className="profile-field-label">Meta Title</label>
        <input
          className="form-input"
          value={form.metaTitle}
          onChange={(e) => set("metaTitle", e.target.value)}
          placeholder="Website title"
        />

        <label className="profile-field-label">Meta Description</label>
        <textarea
          className="form-textarea"
          value={form.metaDescription}
          onChange={(e) => set("metaDescription", e.target.value)}
          placeholder="Search engine description..."
        />

        <label className="profile-field-label">Social Sharing Image URL</label>
        <input
          className="form-input"
          value={form.ogImageUrl}
          onChange={(e) => set("ogImageUrl", e.target.value)}
          placeholder="https://..."
        />
      </div>

      {/* SAVE */}
      <button
        type="button"
        className="btn-admin btn-save"
        onClick={save}
        disabled={saving}
      >
        {saving ? "Saving..." : "Save Profile"}
      </button>
    </div>
  );
}
