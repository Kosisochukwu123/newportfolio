import { useEffect, useState, useRef } from "react";
import { api } from "../utils/api";
import { useToast } from "../hooks/useToast";
import Toast from "../components/Toast";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const empty = {
  title: "",
  subtitle: "",
  description: "",
  tags: [],
  liveUrl: "",
  githubUrl: "",
  year: String(new Date().getFullYear()),
  featured: false,
  published: true,

  imageUrl: null,
  imageFile: null,

  faqs: [],
};

export default function ProjectEditor() {
  const id = window.location.pathname.split("/").pop();
  const isNew = id === "new";

  const { show, toast } = useToast();
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [newFaq, setNewFaq] = useState({ question: "", answer: "" });
  const [editFaq, setEditFaq] = useState(null); // { idx, ...faq }
  const fileRef = useRef();

  useEffect(() => {
    if (!isNew) {
      api
        .get(`/projects/${id}`)
        .then((res) => {
          const data = res.data; // was res.data.data
          setForm({
            ...data,
            imageFile: null,
            tags: data.tags || [],
            faqs: data.faqs || [],
          });
        })
        .catch((err) => {
          show(err?.message || "Failed to load project", "error");
        });
    }
  }, [id]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  // ── Tags ──
  const addTag = (e) => {
    if ((e.key === "Enter" || e.key === ",") && tagInput.trim()) {
      e.preventDefault();

      const t = tagInput.trim().replace(/,$/, "");

      if (!t) return;

      if (!form.tags.includes(t)) {
        set("tags", [...form.tags, t]);
      }

      setTagInput("");
    }
  };

  const removeTag = (t) =>
    set(
      "tags",
      form.tags.filter((x) => x !== t),
    );

  // ── Save project ──
  const save = async () => {
    setSaving(true);
    try {
      const fd = new FormData();
      [
        "title",
        "subtitle",
        "description",
        "liveUrl",
        "githubUrl",
        "year",
      ].forEach((k) => fd.append(k, form[k]));
      fd.append("featured", String(form.featured));
      fd.append("published", String(form.published));
      fd.append("tags", JSON.stringify(form.tags));
      fd.append(
        "faqs",
        JSON.stringify(
          form.faqs.map(({ question, answer, order }) => ({
            question,
            answer,
            order,
          })),
        ),
      );
      if (form.imageFile) fd.append("image", form.imageFile);

      const token = localStorage.getItem("portfolio_token");
      const url = isNew ? `${BASE}/projects` : `${BASE}/projects/${id}`;
      const res = await fetch(url, {
        method: isNew ? "POST" : "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      show("Project saved!");
      if (isNew) {
        setTimeout(() => {
          window.history.pushState({}, "", `/admin/projects/${data.data._id}`);

          window.dispatchEvent(new PopStateEvent("popstate"));
        }, 800);
      } else {
        setForm((f) => ({ ...f, faqs: data.data.faqs }));
      }
    } catch (e) {
      show(e.message, "error");
    } finally {
      setSaving(false);
    }
  };

  // ── FAQ actions ──
  const addFaq = async () => {
    if (!newFaq.question.trim() || !newFaq.answer.trim()) return;

    if (isNew) {
      set("faqs", [
        ...form.faqs,
        {
          ...newFaq,
          order: form.faqs.length,
        },
      ]);

      setNewFaq({
        question: "",
        answer: "",
      });

      return;
    }

    try {
      const res = await api.post(`/projects/${id}/faqs`, {
        ...newFaq,
        order: form.faqs.length,
      });

      set("faqs", res.data.data || []);

      setNewFaq({
        question: "",
        answer: "",
      });

      show("FAQ added");
    } catch (e) {
      show(e?.response?.data?.message || e.message, "error");
    }
  };

  const saveFaqEdit = async () => {
    if (isNew) {
      const { idx, ...cleanFaq } = editFaq;

      const updated = form.faqs.map((f, i) => (i === idx ? cleanFaq : f));

      set("faqs", updated);

      setEditFaq(null);

      return;
    }

    try {
      const res = await api.put(`/projects/${id}/faqs/${editFaq._id}`, {
        question: editFaq.question,
        answer: editFaq.answer,
      });

      set("faqs", res.data.data || []);

      setEditFaq(null);

      show("FAQ updated");
    } catch (e) {
      show(e?.response?.data?.message || e.message, "error");
    }
  };

  const deleteFaq = async (faq, idx) => {
    if (!confirm("Delete this FAQ?")) return;

    if (isNew) {
      set(
        "faqs",
        form.faqs.filter((_, i) => i !== idx),
      );

      return;
    }

    try {
      const res = await api.delete(`/projects/${id}/faqs/${faq._id}`);

      set("faqs", res.data.data || []);

      show("FAQ deleted");
    } catch (e) {
      show(e?.response?.data?.message || e.message, "error");
    }
  };

  return (
    <div>
      <Toast toast={toast} />
      <div
        className="page-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div>
          <h1>{isNew ? "New Project" : `Edit: ${form.title || "…"}`}</h1>
          <p>
            {isNew
              ? "Fill in the details below and save."
              : "Update project info, image, and FAQs."}
          </p>
        </div>
        <button
          onClick={() => {
            window.history.pushState({}, "", "/admin/projects");

            window.dispatchEvent(new PopStateEvent("popstate"));
          }}
        >
          Back
        </button>
      </div>

      {/* ── Basic info ── */}
      <div className="admin-card">
        <div className="admin-card-title">📋 Project Details</div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Title *</label>
            <input
              className="form-input"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="My Awesome Project"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Subtitle</label>
            <input
              className="form-input"
              value={form.subtitle}
              onChange={(e) => set("subtitle", e.target.value)}
              placeholder="E-Commerce Platform"
            />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Description *</label>
          <textarea
            className="form-textarea"
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            placeholder="What does this project do? Who is it for?"
            style={{ minHeight: 100 }}
          />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Live URL</label>
            <input
              className="form-input"
              value={form.liveUrl}
              onChange={(e) => set("liveUrl", e.target.value)}
              placeholder="https://..."
            />
          </div>
          <div className="form-group">
            <label className="form-label">GitHub URL</label>
            <input
              className="form-input"
              value={form.githubUrl}
              onChange={(e) => set("githubUrl", e.target.value)}
              placeholder="https://github.com/..."
            />
          </div>
          <div className="form-group">
            <label className="form-label">Year</label>
            <input
              className="form-input"
              value={form.year}
              onChange={(e) => set("year", e.target.value)}
              placeholder="2024"
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Tech Stack Tags</label>
          <div className="tags-input-wrapper">
            {form.tags.map((t) => (
              <span className="tag-chip" key={t}>
                {t} <button onClick={() => removeTag(t)}>×</button>
              </span>
            ))}
            <input
              className="tags-input"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={addTag}
              placeholder="Type a tag and press Enter…"
            />
          </div>
          <span className="form-hint">Press Enter or comma after each tag</span>
        </div>

        <div style={{ display: "flex", gap: "2rem" }}>
          <div className="toggle-row" style={{ flex: 1 }}>
            <div>
              <div className="toggle-label">Featured</div>
              <div className="toggle-sub">Show on homepage / top of list</div>
            </div>
            <label className="toggle">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => set("featured", e.target.checked)}
              />
              <span className="toggle-slider" />
            </label>
          </div>
          <div className="toggle-row" style={{ flex: 1 }}>
            <div>
              <div className="toggle-label">Published</div>
              <div className="toggle-sub">Visible on the live portfolio</div>
            </div>
            <label className="toggle">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) => set("published", e.target.checked)}
              />
              <span className="toggle-slider" />
            </label>
          </div>
        </div>
      </div>

      {/* ── Image ── */}
      <div className="admin-card">
        <div className="admin-card-title">🖼 Project Screenshot</div>
        <div className="upload-zone" onClick={() => fileRef.current.click()}>
          {form.imageFile ? (
            <img
              src={URL.createObjectURL(form.imageFile)}
              alt="preview"
              style={{
                maxHeight: 200,
                borderRadius: 6,
              }}
            />
          ) : form.imageUrl?.trim() ? (
            <img
              src={form.imageUrl}
              alt="current"
              style={{
                maxHeight: 200,
                borderRadius: 6,
              }}
            />
          ) : (
            <>
              <div
                style={{
                  fontSize: "2rem",
                  marginBottom: "0.5rem",
                }}
              >
                📸
              </div>

              <div className="upload-zone-text">
                Click to upload a screenshot
                <br />
                JPG, PNG or WebP · max 5 MB
              </div>
            </>
          )}
        </div>
        {(form.imageFile || form.imageUrl) && (
          <button
            className="btn-admin btn-ghost-admin"
            style={{ marginTop: "0.75rem", fontSize: "0.78rem" }}
            onClick={() => {
              set("imageFile", null);
              set("imageUrl", null);
            }}
          >
            Remove image
          </button>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={(e) =>
            e.target.files[0] && set("imageFile", e.target.files[0])
          }
        />
      </div>

      {/* ── FAQs ── */}
      <div className="admin-card">
        <div className="admin-card-title">❓ "How I Built It" FAQs</div>
        <p
          style={{
            fontSize: "0.82rem",
            color: "var(--text-muted)",
            marginBottom: "1.25rem",
          }}
        >
          These appear as an accordion under the project card on your portfolio.
        </p>

        {/* Existing FAQs */}
        {form.faqs.map((faq, idx) => (
          <div
            key={faq._id || idx}
            style={{
              background: "var(--bg-elevated)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              padding: "1rem",
              marginBottom: "0.75rem",
            }}
          >
            {editFaq?.idx === idx ? (
              <>
                <div className="form-group">
                  <label className="form-label">Question</label>
                  <input
                    className="form-input"
                    value={editFaq.question}
                    onChange={(e) =>
                      setEditFaq((f) => ({ ...f, question: e.target.value }))
                    }
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Answer</label>
                  <textarea
                    className="form-textarea"
                    value={editFaq.answer}
                    onChange={(e) =>
                      setEditFaq((f) => ({ ...f, answer: e.target.value }))
                    }
                  />
                </div>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button className="btn-admin btn-save" onClick={saveFaqEdit}>
                    Save FAQ
                  </button>
                  <button
                    className="btn-admin btn-ghost-admin"
                    onClick={() => setEditFaq(null)}
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: "1rem",
                }}
              >
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: "0.875rem",
                      marginBottom: "0.3rem",
                    }}
                  >
                    {faq.question}
                  </div>
                  <div
                    style={{
                      fontSize: "0.8rem",
                      color: "var(--text-muted)",
                      lineHeight: 1.6,
                    }}
                  >
                    {faq.answer}
                  </div>
                </div>
                <div style={{ display: "flex", gap: "0.4rem", flexShrink: 0 }}>
                  <button
                    className="btn-admin btn-ghost-admin"
                    style={{ padding: "0.35rem 0.65rem", fontSize: "0.75rem" }}
                    onClick={() => setEditFaq({ ...faq, idx })}
                  >
                    Edit
                  </button>
                  <button
                    className="btn-admin btn-danger"
                    style={{ padding: "0.35rem 0.65rem", fontSize: "0.75rem" }}
                    onClick={() => deleteFaq(faq, idx)}
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Add new FAQ */}
        <div
          style={{
            background: "var(--bg)",
            border: "1px dashed var(--border)",
            borderRadius: 8,
            padding: "1rem",
            marginTop: "0.5rem",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.7rem",
              color: "var(--accent)",
              marginBottom: "0.75rem",
              letterSpacing: "0.1em",
            }}
          >
            + ADD FAQ
          </div>
          <div className="form-group">
            <label className="form-label">Question</label>
            <input
              className="form-input"
              value={newFaq.question}
              onChange={(e) =>
                setNewFaq((f) => ({ ...f, question: e.target.value }))
              }
              placeholder="How did you implement authentication?"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Answer</label>
            <textarea
              className="form-textarea"
              value={newFaq.answer}
              onChange={(e) =>
                setNewFaq((f) => ({ ...f, answer: e.target.value }))
              }
              placeholder="I used JWT with bcrypt..."
              style={{ minHeight: 80 }}
            />
          </div>
          <button
            className="btn-admin btn-outline-admin"
            onClick={addFaq}
            disabled={!newFaq.question.trim() || !newFaq.answer.trim()}
          >
            + Add FAQ
          </button>
        </div>
      </div>

      <button
        className="btn-admin btn-save"
        style={{ width: "100%", justifyContent: "center", padding: "0.9rem" }}
        onClick={save}
        disabled={saving}
      >
        {saving ? "Saving…" : `💾 ${isNew ? "Create Project" : "Save Changes"}`}
      </button>
    </div>
  );
}
