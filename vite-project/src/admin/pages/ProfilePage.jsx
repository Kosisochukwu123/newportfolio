
import { useEffect, useRef, useState } from "react";
import { api } from "../utils/api";
import { useToast } from "../hooks/useToast";
import Toast from "../components/Toast";
import { clearCached } from "../../utils/Cache";

const API = import.meta.env.VITE_API_URL || "/api";

const EMPTY_FORM = {
  availableForWork: true,
  email: "",
  phone: "",
  location: "",
  timezone: "Africa/Lagos",
  socials: [],
  resumeUrl: "",
  metaTitle: "GH Studios",
  metaDescription: "",
  ogImageUrl: "",
  avatarUrl: "",
};

export default function ProfilePage() {
  const { show, toast } = useToast();

  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fileRef = useRef(null);

  useEffect(() => {
    let mounted = true;

    api
      .get("/profile")
      .then(({ data }) => {
        if (!mounted) return;

        setForm({
          ...EMPTY_FORM,
          ...data,
          socials: Array.isArray(data.socials) ? data.socials : [],
        });
      })
      .catch((error) => {
        console.error("Profile load failed:", error);
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

  const setSocial = (index, field, value) => {
    setForm((current) => {
      const socials = [...current.socials];

      socials[index] = {
        ...socials[index],
        [field]: value,
      };

      return { ...current, socials };
    });
  };

  const addSocial = () => {
    setForm((current) => ({
      ...current,
      socials: [...current.socials, { label: "", url: "" }],
    }));
  };

  const removeSocial = (index) => {
    setForm((current) => ({
      ...current,
      socials: current.socials.filter((_, i) => i !== index),
    }));
  };

  const save = async () => {
    setSaving(true);

    try {
      const payload = {
        availableForWork: form.availableForWork,
        email: form.email,
        phone: form.phone,
        location: form.location,
        timezone: form.timezone,
        socials: form.socials.filter(
          (social) => social.label.trim() && social.url.trim(),
        ),
        resumeUrl: form.resumeUrl,
        metaTitle: form.metaTitle,
        metaDescription: form.metaDescription,
        ogImageUrl: form.ogImageUrl,
      };

      await api.put("/profile", payload);

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
      const formData = new FormData();
      formData.append("avatar", file);

      const response = await fetch(`${API}/profile/avatar`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("portfolio_token")}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Photo upload failed");
      }

      set("avatarUrl", data.avatarUrl || "");
      clearCached("profile");
      show("Profile photo uploaded successfully!");
    } catch (error) {
      show(error.message || "Photo upload failed", "error");
    } finally {
      setUploading(false);

      if (fileRef.current) {
        fileRef.current.value = "";
      }
    }
  };

  if (loading) {
    return (
      <div className="page-header">
        <h1>Profile</h1>
        <p>Loading company profile...</p>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <Toast toast={toast} />

      <div className="page-header">
        <h1>Profile</h1>
        <p>
          Manage your company contact details, availability and search
          appearance.
        </p>
      </div>

      <div className="admin-card">
        <div className="admin-card-title">📷 Company Profile Photo</div>

        <div className="avatar-wrap">
          <div
            className="avatar-box"
            onClick={() => fileRef.current?.click()}
          >
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

      <div className="admin-card">
        <div className="admin-card-title">💼 Work Availability</div>

        <label className="toggle-row">
          <span>Available for new projects</span>
          <input
            type="checkbox"
            checked={form.availableForWork}
            onChange={(event) =>
              set("availableForWork", event.target.checked)
            }
          />
        </label>
      </div>

      <div className="admin-card">
        <div className="admin-card-title">📩 Contact Information</div>

        <label className="profile-field-label">Email Address</label>
        <input
          type="email"
          className="form-input"
          value={form.email}
          onChange={(event) => set("email", event.target.value)}
          placeholder="hello@example.com"
        />

        <label className="profile-field-label">Phone Number</label>
        <input
          type="tel"
          className="form-input"
          value={form.phone}
          onChange={(event) => set("phone", event.target.value)}
          placeholder="+234..."
        />

        <label className="profile-field-label">Location</label>
        <input
          className="form-input"
          value={form.location}
          onChange={(event) => set("location", event.target.value)}
          placeholder="Uyo, Nigeria"
        />

        <label className="profile-field-label">Timezone</label>
        <input
          className="form-input"
          value={form.timezone}
          onChange={(event) => set("timezone", event.target.value)}
          placeholder="Africa/Lagos"
        />

        <label className="profile-field-label">Resume URL</label>
        <input
          className="form-input"
          value={form.resumeUrl}
          onChange={(event) => set("resumeUrl", event.target.value)}
          placeholder="https://..."
        />
      </div>

      <div className="admin-card">
        <div className="admin-card-title">🌐 Social Media Links</div>

        {form.socials.map((social, index) => (
          <div key={index} className="profile-social-row">
            <input
              className="form-input"
              value={social.label || ""}
              onChange={(event) =>
                setSocial(index, "label", event.target.value)
              }
              placeholder="Platform (e.g. LinkedIn)"
            />

            <input
              className="form-input"
              value={social.url || ""}
              onChange={(event) =>
                setSocial(index, "url", event.target.value)
              }
              placeholder="https://..."
            />

            <button
              type="button"
              className="btn-admin btn-ghost-admin"
              onClick={() => removeSocial(index)}
            >
              Remove
            </button>
          </div>
        ))}

        <button
          type="button"
          className="btn-admin btn-ghost-admin"
          onClick={addSocial}
        >
          + Add Social Link
        </button>
      </div>

      <div className="admin-card">
        <div className="admin-card-title">🔎 SEO & Social Sharing</div>

        <label className="profile-field-label">Meta Title</label>
        <input
          className="form-input"
          value={form.metaTitle}
          onChange={(event) => set("metaTitle", event.target.value)}
          placeholder="GH Studios"
        />

        <label className="profile-field-label">Meta Description</label>
        <textarea
          className="form-textarea"
          value={form.metaDescription}
          onChange={(event) => set("metaDescription", event.target.value)}
          placeholder="Description shown in search results..."
        />

        <label className="profile-field-label">
          Social Sharing Image URL
        </label>
        <input
          className="form-input"
          value={form.ogImageUrl}
          onChange={(event) => set("ogImageUrl", event.target.value)}
          placeholder="https://..."
        />
      </div>

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
