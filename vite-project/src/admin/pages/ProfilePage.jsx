import { useEffect, useRef, useState } from "react";
import { api } from "../utils/api";
import { useToast } from "../hooks/useToast";
import Toast from "../components/Toast";
import "./Profile.css";

const API =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const EMPTY_PROFILE = {
  name: "GH Studios",
  tagline: "",
  heroBio: "",
  availableForWork: true,

  aboutHeadline: "",
  aboutDescription: "",
  aboutBio: [],
  mission: "",
  vision: "",

  yearsExperience: "",
  projectsShipped: "",
  clientsServed: "",

  services: [],
  milestones: [],

  avatarUrl: "",

  email: "",
  phone: "",
  location: "",
  timezone: "",

  socials: [],

  metaTitle: "GH Studios",
  metaDescription: "",
  ogImageUrl: "",
};

const SECTIONS = [
  { id: "identity", label: "Company identity", number: "01" },
  { id: "hero", label: "Homepage hero", number: "02" },
  { id: "about", label: "About the company", number: "03" },
  { id: "services", label: "Services", number: "04" },
  { id: "journey", label: "Company journey", number: "05" },
  { id: "contact", label: "Contact information", number: "06" },
  { id: "socials", label: "Social media", number: "07" },
  { id: "seo", label: "SEO & sharing", number: "08" },
];

export default function ProfilePage() {
  const { show, toast } = useToast();

  const [form, setForm] = useState(EMPTY_PROFILE);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fileRef = useRef(null);

  useEffect(() => {
    let mounted = true;

    const loadProfile = async () => {
      try {
        const response = await api.get("/profile");

        if (!mounted) return;

        const data = response?.data || {};

        setForm({
          ...EMPTY_PROFILE,
          ...data,
          aboutBio: Array.isArray(data.aboutBio) ? data.aboutBio : [],
          services: Array.isArray(data.services) ? data.services : [],
          milestones: Array.isArray(data.milestones)
            ? data.milestones
            : [],
          socials: Array.isArray(data.socials) ? data.socials : [],
        });
      } catch (error) {
        console.error("Profile load failed:", error);
        if (mounted) show("Could not load company profile", "error");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadProfile();

    return () => {
      mounted = false;
    };
  }, []);

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const updateArrayItem = (field, index, value) => {
    setForm((current) => {
      const items = [...current[field]];
      items[index] = value;

      return {
        ...current,
        [field]: items,
      };
    });
  };

  const addArrayItem = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: [...current[field], value],
    }));
  };

  const removeArrayItem = (field, index) => {
    setForm((current) => ({
      ...current,
      [field]: current[field].filter((_, i) => i !== index),
    }));
  };

  const updateObjectItem = (field, index, key, value) => {
    setForm((current) => {
      const items = [...current[field]];

      items[index] = {
        ...items[index],
        [key]: value,
      };

      return {
        ...current,
        [field]: items,
      };
    });
  };

  const saveProfile = async () => {
    setSaving(true);

    try {
      const payload = {
        ...form,

        aboutBio: form.aboutBio
          .map((item) => item.trim())
          .filter(Boolean),

        services: form.services
          .map((item) => item.trim())
          .filter(Boolean),

        milestones: form.milestones.filter(
          (item) => item.year.trim() || item.label.trim(),
        ),

        socials: form.socials.filter(
          (item) => item.label.trim() && item.url.trim(),
        ),
      };

      const response = await api.put("/profile", payload);

      if (response?.data) {
        setForm((current) => ({
          ...current,
          ...response.data,
        }));
      }

      show("Company profile saved successfully");
    } catch (error) {
      show(error.message || "Could not save company profile", "error");
    } finally {
      setSaving(false);
    }
  };

  const uploadLogo = async (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      show("Please select an image file", "error");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      show("Image must be smaller than 5MB", "error");
      return;
    }

    setUploading(true);

    try {
      const body = new FormData();
      body.append("avatar", file);

      const response = await fetch(`${API}/profile/avatar`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("portfolio_token")}`,
        },
        body,
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Image upload failed");
      }

      updateField("avatarUrl", result.avatarUrl || "");
      show("Company image uploaded successfully");
    } catch (error) {
      show(error.message || "Image upload failed", "error");
    } finally {
      setUploading(false);

      if (fileRef.current) {
        fileRef.current.value = "";
      }
    }
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <span className="profile-spinner" />
        <p>Loading company profile...</p>
      </div>
    );
  }

  return (
    <div className="company-profile-page">
      <Toast toast={toast} />

      <div className="page-header company-profile-header">
        <div>
          <span className="profile-eyebrow">GH STUDIOS / ADMINISTRATION</span>
          <h1>Company Profile</h1>
          <p>
            Manage the information, identity and public details of your
            company website.
          </p>
        </div>

        <button
          className="btn-admin btn-save profile-top-save"
          onClick={saveProfile}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <div className="profile-layout">
        <aside className="profile-navigation admin-card">
          <div className="profile-navigation-heading">PROFILE CONTENT</div>

          {SECTIONS.map((section) => (
            <a
              key={section.id}
              href={`#profile-${section.id}`}
              className="profile-navigation-link"
            >
              <span>{section.number}</span>
              {section.label}
            </a>
          ))}

          <div className="profile-navigation-note">
            Changes are not published until you save them.
          </div>
        </aside>

        <div className="profile-content">
          {/* COMPANY IDENTITY */}
          <section
            className="admin-card profile-section"
            id="profile-identity"
          >
            <div className="profile-section-heading">
              <div>
                <span className="profile-section-number">01 / BRAND</span>
                <h2>Company identity</h2>
                <p>The name and visual identity visitors associate with you.</p>
              </div>
            </div>

            <div className="profile-brand-row">
              <div className="profile-logo-preview">
                {form.avatarUrl ? (
                  <img src={form.avatarUrl} alt="Company brand" />
                ) : (
                  <span>{form.name?.trim()?.charAt(0) || "G"}</span>
                )}
              </div>

              <div className="profile-logo-actions">
                <strong>Company logo / brand image</strong>
                <p>Upload an image up to 5MB.</p>

                <button
                  type="button"
                  className="btn-admin btn-ghost-admin"
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                >
                  {uploading ? "Uploading..." : "Upload image"}
                </button>

                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(event) =>
                    uploadLogo(event.target.files?.[0])
                  }
                />
              </div>
            </div>

            <div className="profile-form-grid">
              <Field label="Company name">
                <input
                  className="form-input"
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  placeholder="GH Studios"
                />
              </Field>

              <Field label="Company tagline">
                <input
                  className="form-input"
                  value={form.tagline}
                  onChange={(e) => updateField("tagline", e.target.value)}
                  placeholder="A short statement about your company"
                />
              </Field>
            </div>
          </section>

          {/* HERO */}
          <section className="admin-card profile-section" id="profile-hero">
            <SectionHeading
              number="02"
              category="HOMEPAGE"
              title="Hero section"
              description="The introduction visitors see when they land on your homepage."
            />

            <Field label="Hero introduction">
              <textarea
                className="form-textarea profile-large-textarea"
                value={form.heroBio}
                onChange={(e) => updateField("heroBio", e.target.value)}
                placeholder="Introduce GH Studios and explain what the company does."
              />
            </Field>

            <label className="profile-availability">
              <span>
                <strong>Accepting new projects</strong>
                <small>
                  Controls the availability status shown on the website.
                </small>
              </span>

              <input
                type="checkbox"
                checked={Boolean(form.availableForWork)}
                onChange={(e) =>
                  updateField("availableForWork", e.target.checked)
                }
              />
            </label>
          </section>

          {/* ABOUT */}
          <section className="admin-card profile-section" id="profile-about">
            <SectionHeading
              number="03"
              category="COMPANY INFORMATION"
              title="About GH Studios"
              description="Explain who the company is, what it believes in and what it has achieved."
            />

            <Field label="About heading">
              <input
                className="form-input"
                value={form.aboutHeadline}
                onChange={(e) =>
                  updateField("aboutHeadline", e.target.value)
                }
                placeholder="A headline for the About section"
              />
            </Field>

            <Field label="About introduction">
              <textarea
                className="form-textarea profile-large-textarea"
                value={form.aboutDescription}
                onChange={(e) =>
                  updateField("aboutDescription", e.target.value)
                }
                placeholder="A short introduction to GH Studios."
              />
            </Field>

            <Field label="Company story / paragraphs">
              <div className="profile-repeat-list">
                {form.aboutBio.map((paragraph, index) => (
                  <div className="profile-repeat-item" key={index}>
                    <textarea
                      className="form-textarea"
                      value={paragraph}
                      onChange={(e) =>
                        updateArrayItem("aboutBio", index, e.target.value)
                      }
                      placeholder={`Company story paragraph ${index + 1}`}
                    />

                    <button
                      type="button"
                      className="profile-remove-button"
                      onClick={() => removeArrayItem("aboutBio", index)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              <button
                type="button"
                className="profile-add-button"
                onClick={() => addArrayItem("aboutBio", "")}
              >
                + Add paragraph
              </button>
            </Field>

            <div className="profile-form-grid">
              <Field label="Mission">
                <textarea
                  className="form-textarea"
                  value={form.mission}
                  onChange={(e) => updateField("mission", e.target.value)}
                  placeholder="What is the company's purpose?"
                />
              </Field>

              <Field label="Vision">
                <textarea
                  className="form-textarea"
                  value={form.vision}
                  onChange={(e) => updateField("vision", e.target.value)}
                  placeholder="What future is the company working towards?"
                />
              </Field>
            </div>

            <div className="profile-subheading">Company statistics</div>
            <p className="profile-help">
              Enter real figures only. Leave a field empty if you don't want
              to display that statistic.
            </p>

            <div className="profile-form-grid profile-stats-grid">
              <Field label="Years of experience">
                <input
                  className="form-input"
                  value={form.yearsExperience}
                  onChange={(e) =>
                    updateField("yearsExperience", e.target.value)
                  }
                  placeholder="e.g. 3+"
                />
              </Field>

              <Field label="Projects delivered">
                <input
                  className="form-input"
                  value={form.projectsShipped}
                  onChange={(e) =>
                    updateField("projectsShipped", e.target.value)
                  }
                  placeholder="e.g. 20+"
                />
              </Field>

              <Field label="Clients served">
                <input
                  className="form-input"
                  value={form.clientsServed}
                  onChange={(e) =>
                    updateField("clientsServed", e.target.value)
                  }
                  placeholder="e.g. 10+"
                />
              </Field>
            </div>
          </section>

          {/* SERVICES */}
          <section
            className="admin-card profile-section"
            id="profile-services"
          >
            <SectionHeading
              number="04"
              category="WHAT WE DO"
              title="Services"
              description="Manage the services offered by your company."
            />

            <div className="profile-repeat-list">
              {form.services.map((service, index) => (
                <div className="profile-inline-item" key={index}>
                  <input
                    className="form-input"
                    value={service}
                    onChange={(e) =>
                      updateArrayItem("services", index, e.target.value)
                    }
                    placeholder="Service name"
                  />

                  <button
                    type="button"
                    className="profile-remove-button"
                    onClick={() => removeArrayItem("services", index)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              className="profile-add-button"
              onClick={() => addArrayItem("services", "")}
            >
              + Add service
            </button>
          </section>

          {/* MILESTONES */}
          <section className="admin-card profile-section" id="profile-journey">
            <SectionHeading
              number="05"
              category="OUR HISTORY"
              title="Company journey"
              description="Add important moments and achievements in the company's history."
            />

            <div className="profile-repeat-list">
              {form.milestones.map((milestone, index) => (
                <div className="profile-milestone-item" key={index}>
                  <Field label="Year">
                    <input
                      className="form-input"
                      value={milestone.year || ""}
                      onChange={(e) =>
                        updateObjectItem(
                          "milestones",
                          index,
                          "year",
                          e.target.value,
                        )
                      }
                      placeholder="2026"
                    />
                  </Field>

                  <Field label="Milestone">
                    <input
                      className="form-input"
                      value={milestone.label || ""}
                      onChange={(e) =>
                        updateObjectItem(
                          "milestones",
                          index,
                          "label",
                          e.target.value,
                        )
                      }
                      placeholder="Describe the achievement"
                    />
                  </Field>

                  <button
                    type="button"
                    className="profile-remove-button"
                    onClick={() => removeArrayItem("milestones", index)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              className="profile-add-button"
              onClick={() =>
                addArrayItem("milestones", { year: "", label: "" })
              }
            >
              + Add milestone
            </button>
          </section>

          {/* CONTACT */}
          <section className="admin-card profile-section" id="profile-contact">
            <SectionHeading
              number="06"
              category="GET IN TOUCH"
              title="Contact information"
              description="The official contact details visitors can use to reach the company."
            />

            <div className="profile-form-grid">
              <Field label="Business email">
                <input
                  className="form-input"
                  type="email"
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  placeholder="hello@example.com"
                />
              </Field>

              <Field label="Phone / WhatsApp">
                <input
                  className="form-input"
                  value={form.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  placeholder="+234..."
                />
              </Field>

              <Field label="Location">
                <input
                  className="form-input"
                  value={form.location}
                  onChange={(e) => updateField("location", e.target.value)}
                  placeholder="City, Country"
                />
              </Field>

              <Field label="Timezone">
                <input
                  className="form-input"
                  value={form.timezone}
                  onChange={(e) => updateField("timezone", e.target.value)}
                  placeholder="Africa/Lagos"
                />
              </Field>
            </div>
          </section>

          {/* SOCIALS */}
          <section className="admin-card profile-section" id="profile-socials">
            <SectionHeading
              number="07"
              category="ONLINE PRESENCE"
              title="Social media"
              description="Add the social platforms where people can find GH Studios."
            />

            <div className="profile-repeat-list">
              {form.socials.map((social, index) => (
                <div className="profile-social-item" key={index}>
                  <Field label="Platform">
                    <input
                      className="form-input"
                      value={social.label || ""}
                      onChange={(e) =>
                        updateObjectItem(
                          "socials",
                          index,
                          "label",
                          e.target.value,
                        )
                      }
                      placeholder="Instagram"
                    />
                  </Field>

                  <Field label="Profile URL">
                    <input
                      className="form-input"
                      value={social.url || ""}
                      onChange={(e) =>
                        updateObjectItem(
                          "socials",
                          index,
                          "url",
                          e.target.value,
                        )
                      }
                      placeholder="https://..."
                    />
                  </Field>

                  <button
                    type="button"
                    className="profile-remove-button"
                    onClick={() => removeArrayItem("socials", index)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              className="profile-add-button"
              onClick={() =>
                addArrayItem("socials", { label: "", url: "" })
              }
            >
              + Add social link
            </button>
          </section>

          {/* SEO */}
          <section className="admin-card profile-section" id="profile-seo">
            <SectionHeading
              number="08"
              category="SEARCH VISIBILITY"
              title="SEO & social sharing"
              description="Manage the default search engine and link-sharing information for the company."
            />

            <Field label="SEO title">
              <input
                className="form-input"
                value={form.metaTitle}
                onChange={(e) => updateField("metaTitle", e.target.value)}
                placeholder="GH Studios | Digital Solutions"
              />
            </Field>

            <Field label="SEO description">
              <textarea
                className="form-textarea"
                value={form.metaDescription}
                onChange={(e) =>
                  updateField("metaDescription", e.target.value)
                }
                placeholder="Describe GH Studios for search engines."
              />
            </Field>

            <Field label="Social sharing image URL">
              <input
                className="form-input"
                value={form.ogImageUrl}
                onChange={(e) => updateField("ogImageUrl", e.target.value)}
                placeholder="https://..."
              />
            </Field>
          </section>

          <div className="profile-bottom-save">
            <div>
              <strong>Ready to update your company profile?</strong>
              <p>Save your changes when you're finished.</p>
            </div>

            <button
              className="btn-admin btn-save"
              onClick={saveProfile}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Company Profile"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className="form-group profile-field">
      <label className="form-label">{label}</label>
      {children}
    </div>
  );
}

function SectionHeading({ number, category, title, description }) {
  return (
    <div className="profile-section-heading">
      <div>
        <span className="profile-section-number">
          {number} / {category}
        </span>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
    </div>
  );
}