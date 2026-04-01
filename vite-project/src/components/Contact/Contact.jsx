import { useEffect, useState } from "react";
import "./Contact.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function Contact() {
  const [profile, setProfile] = useState({
    email: "yourname@email.com",
    location: "Your City, Country",
    timezone: "WAT / UTC+1",
    availableForWork: true,
    socials: [
      { label: "GitHub",      url: "https://github.com/yourusername" },
      { label: "LinkedIn",    url: "https://linkedin.com/in/yourusername" },
      { label: "Twitter / X", url: "https://twitter.com/yourusername" },
    ],
  });

  const [form, setForm]       = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus]   = useState(null); // "sending" | "sent" | "error"

  useEffect(() => {
    fetch(`${API}/profile`)
      .then((r) => r.json())
      .then((d) => { if (d.success) setProfile(d.data); })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res  = await fetch(`${API}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setStatus("sent");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="contact-section">
      <div className="container">
        <p className="section-label">04. Contact</p>
        <div className="contact-inner">
          <div className="contact-text">
            <h2 className="section-title">
              Let's build something <span className="accent">together</span>
            </h2>
            <p>
              Whether you have a project in mind, need a full-stack developer to
              join your team, or just want to talk tech — my inbox is open.
            </p>

            {/* Contact form */}
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="contact-form-row">
                <input
                  className="contact-input"
                  placeholder="Your name"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  required
                />
                <input
                  className="contact-input"
                  type="email"
                  placeholder="Your email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  required
                />
              </div>
              <input
                className="contact-input"
                placeholder="Subject"
                value={form.subject}
                onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
              />
              <textarea
                className="contact-input contact-textarea"
                placeholder="Your message..."
                value={form.message}
                onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                required
              />
              <button
                type="submit"
                className="btn btn-primary contact-btn"
                disabled={status === "sending"}
              >
                {status === "sending" ? "Sending…" : "Send Message →"}
              </button>
              {status === "sent"  && <p className="form-success">✓ Message sent! I'll get back to you soon.</p>}
              {status === "error" && <p className="form-error">Something went wrong. Try emailing directly.</p>}
            </form>

            <div className="social-links">
              {(profile.socials || []).map((s) => (
                <a key={s.label} href={s.url} target="_blank" rel="noreferrer" className="social-link">
                  {s.label} ↗
                </a>
              ))}
            </div>
          </div>

          <div className="contact-card">
            <p className="contact-card-label">Current availability</p>
            <div className={`availability-badge ${profile.availableForWork ? "" : "unavailable"}`}>
              <span className="pulse-dot" />
              {profile.availableForWork ? "Open to opportunities" : "Not available right now"}
            </div>
            <div className="contact-details">
              {[
                { key: "Email",    val: profile.email },
                { key: "Location", val: profile.location },
                { key: "Timezone", val: profile.timezone },
                { key: "Response", val: "Within 24 hours" },
              ].map(({ key, val }) => (
                <div className="contact-detail" key={key}>
                  <span className="detail-key">{key}</span>
                  <span className="detail-val">{val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
