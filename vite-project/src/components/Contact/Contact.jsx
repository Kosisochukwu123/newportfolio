import { useEffect, useState } from "react";
import { usePageReady } from "../../utils/pageReady";
import "./Contact.css";

// const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const API = import.meta.env.VITE_API_URL || "/api";

// Characters chosen to avoid ambiguous look-alikes (0/O, 1/I)
const CAPTCHA_CHARS = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

function generateCaptcha(length = 5) {
  let out = "";
  for (let i = 0; i < length; i++) {
    out += CAPTCHA_CHARS[Math.floor(Math.random() * CAPTCHA_CHARS.length)];
  }
  return out;
}

const HOW_FOUND_OPTIONS = [
  "Google / Search Engine",
  "Social Media",
  "Referral",
  "Friend / Colleague",
  "Other",
];

export default function Contact() {
  const notifyReady = usePageReady();

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

  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    howFound: "",
    referralCode: "",
    referredBy: "",
  });

  const [status, setStatus] = useState(null); // "sending" | "sent" | "error"

  const [captcha, setCaptcha]           = useState(() => generateCaptcha());
  const [captchaInput, setCaptchaInput] = useState("");
  const [captchaError, setCaptchaError] = useState(false);

  const refreshCaptcha = () => {
    setCaptcha(generateCaptcha());
    setCaptchaInput("");
    setCaptchaError(false);
  };

  useEffect(() => {
    fetch(`${API}/profile`)
      .then((r) => r.json())
      .then((d) => { if (d.success) setProfile(d.data); })
      .catch(() => {})
      .finally(() => notifyReady());
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate CAPTCHA before doing anything else
    if (captchaInput.trim().toUpperCase() !== captcha) {
      setCaptchaError(true);
      setCaptcha(generateCaptcha());
      setCaptchaInput("");
      return;
    }

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
      setForm({
        name: "",
        email: "",
        subject: "",
        message: "",
        howFound: "",
        referralCode: "",
        referredBy: "",
      });
      refreshCaptcha();
    } catch {
      setStatus("error");
      refreshCaptcha();
    }
  };

  return (
    <section id="contact" className="contact-section">
      <div className="container">
        {/* <p className="section-label">04. Contact</p> */}
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
            <div className="contact-form-card">
              <div className="contact-form-logo">
                <img src="/GHStudios-logo-preview.png" alt="GH Studios" />
              </div>

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

              {/* Optional referral details */}
              <p className="form-section-label">Optional</p>

              <select
                className="contact-input contact-select"
                value={form.howFound}
                onChange={(e) => setForm((f) => ({ ...f, howFound: e.target.value }))}
              >
                <option value="">How did you find us?</option>
                {HOW_FOUND_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>

              <div className="contact-form-row">
                <input
                  className="contact-input"
                  placeholder="Referral code (optional)"
                  value={form.referralCode}
                  onChange={(e) => setForm((f) => ({ ...f, referralCode: e.target.value }))}
                />
                <input
                  className="contact-input"
                  placeholder="Referred by (optional)"
                  value={form.referredBy}
                  onChange={(e) => setForm((f) => ({ ...f, referredBy: e.target.value }))}
                />
              </div>

              {/* CAPTCHA */}
              <div className="captcha-wrap">
                <div className="captcha-box">
                  <div className="captcha-code" aria-hidden="true">
                    {captcha.split("").map((ch, i) => (
                      <span
                        key={i}
                        style={{
                          transform: `rotate(${((i * 37) % 17) - 8}deg) translateY(${((i * 13) % 7) - 3}px)`,
                        }}
                      >
                        {ch}
                      </span>
                    ))}
                  </div>
                  <button
                    type="button"
                    className="captcha-refresh"
                    onClick={refreshCaptcha}
                    aria-label="Get a new code"
                    title="Get a new code"
                  >
                    ⟳
                  </button>
                </div>
                <input
                  className="contact-input"
                  placeholder="Enter the code above"
                  value={captchaInput}
                  onChange={(e) => {
                    setCaptchaInput(e.target.value);
                    setCaptchaError(false);
                  }}
                  required
                />
                {captchaError && (
                  <p className="form-error">That code didn't match — try the new one.</p>
                )}
              </div>

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
            </div>

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
                { key: "Email",    val: "Kosiogbunuko@gmail.com" },
                { key: "Location", val: "Uyo, Nigeria" },
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
