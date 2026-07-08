import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import "./TeamJoin.css";

const API = import.meta.env.VITE_API_URL || "/api";

const emptySocial = { label: "", url: "" };

export default function TeamJoin() {
  const { token } = useParams();
  const fileRef = useRef();

  const [checking, setChecking] = useState(true);
  const [validToken, setValidToken] = useState(false);
  const [inviteError, setInviteError] = useState("");

  const [form, setForm] = useState({
    name: "",
    role: "",
    bio: "",
    photoFile: null,
  });
  const [socials, setSocials] = useState([{ ...emptySocial }]);

  const [saving, setSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API}/team/invite/${token}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setValidToken(true);
        else setInviteError(d.message || "This invite link isn't valid.");
      })
      .catch(() => setInviteError("Couldn't verify this invite link."))
      .finally(() => setChecking(false));
  }, [token]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const updateSocial = (i, key, value) => {
    setSocials((list) =>
      list.map((s, idx) => (idx === i ? { ...s, [key]: value } : s))
    );
  };

  const addSocial = () => setSocials((list) => [...list, { ...emptySocial }]);

  const removeSocial = (i) =>
    setSocials((list) => list.filter((_, idx) => idx !== i));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim() || !form.role.trim()) {
      setError("Name and role are required.");
      return;
    }

    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("role", form.role);
      fd.append("bio", form.bio);
      fd.append(
        "socials",
        JSON.stringify(socials.filter((s) => s.label.trim() && s.url.trim()))
      );
      if (form.photoFile) fd.append("photo", form.photoFile);


//       console.log("Submitting photo:", form.photoFile);
// console.log("FormData name:", form.name);
// console.log("FormData role:", form.role);


      const res = await fetch(`${API}/team/invite/${token}`, {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      setSubmitted(true);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (checking) {
    return (
      <section className="join-section">
        <div className="container join-status">Checking your invite…</div>
      </section>
    );
  }

  if (!validToken) {
    return (
      <section className="join-section">
        <div className="container join-status join-status-error">
          {inviteError}
        </div>
      </section>
    );
  }

  if (submitted) {
    return (
      <section className="join-section">
        <div className="container join-status join-status-success">
          ✓ Thanks! Your details have been submitted and are waiting on review.
          You'll show up on the team page once approved.
        </div>
      </section>
    );
  }

  return (
    <section className="join-section">
      <div className="container">
        <div className="join-card">
          <p className="join-eyebrow">You've been invited</p>
          <h1 className="join-title">Join the team</h1>
          <p className="join-sub">Fill in your details below — an admin will review before it goes live.</p>

          <form className="join-form" onSubmit={handleSubmit}>
            <div className="join-upload-zone" onClick={() => fileRef.current.click()}>
              {form.photoFile ? (
                <img src={URL.createObjectURL(form.photoFile)} alt="preview" />
              ) : (
                <>
                  <div className="join-upload-icon">📸</div>
                  <div className="join-upload-text">Click to upload a photo</div>
                </>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => e.target.files[0] && set("photoFile", e.target.files[0])}
            />

            <input
              className="join-input"
              placeholder="Your name"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              required
            />
            <input
              className="join-input"
              placeholder="Your role (e.g. Backend Developer)"
              value={form.role}
              onChange={(e) => set("role", e.target.value)}
              required
            />
            <textarea
              className="join-input join-textarea"
              placeholder="Short bio..."
              value={form.bio}
              onChange={(e) => set("bio", e.target.value)}
            />

            <p className="join-section-label">Social links (optional)</p>
            {socials.map((s, i) => (
              <div className="join-social-row" key={i}>
                <input
                  className="join-input"
                  placeholder="Label (e.g. GitHub)"
                  value={s.label}
                  onChange={(e) => updateSocial(i, "label", e.target.value)}
                />
                <input
                  className="join-input"
                  placeholder="https://..."
                  value={s.url}
                  onChange={(e) => updateSocial(i, "url", e.target.value)}
                />
                {socials.length > 1 && (
                  <button
                    type="button"
                    className="join-social-remove"
                    onClick={() => removeSocial(i)}
                    aria-label="Remove link"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button type="button" className="join-add-social" onClick={addSocial}>
              + Add another link
            </button>

            <button type="submit" className="btn btn-primary join-submit" disabled={saving}>
              {saving ? "Submitting…" : "Submit for review →"}
            </button>

            {error && <p className="join-error">{error}</p>}
          </form>
        </div>
      </div>
    </section>
  );
}