import { useEffect, useRef, useState } from "react";
import {
  FaEnvelope,
  FaLocationDot,
  FaClock,
  FaBolt,
  FaCheck,
  FaCopy,
} from "react-icons/fa6";
import { usePageReady } from "../../utils/pageReady";
import SocialIcon from "./SocialIcon"; // fix the path to where you put SocialIcon.jsx
import "./Contact.css";

const API = import.meta.env.VITE_API_URL || "/api";

const CAPTCHA_CHARS = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

function generateCaptcha(length = 5) {
  let out = "";
  for (let i = 0; i < length; i++) {
    out += CAPTCHA_CHARS[Math.floor(Math.random() * CAPTCHA_CHARS.length)];
  }
  return out;
}

// the headline, one entry per word (accent = lime)
const TITLE = [
  { text: "Let\u2019s" },
  { text: "build" },
  { text: "something" },
  { text: "together", accent: true },
];

const EMPTY_FORM = { name: "", email: "", subject: "", message: "" };

// "14:32" in the studio's time zone, or "" if the saved value is not a real time zone
const timeIn = (timeZone) => {
  if (!timeZone) return "";
  try {
    return new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone,
    }).format(new Date());
  } catch {
    return "";
  }
};

// One input with a label that floats up when you type
function Field({ id, label, textarea = false, ...props }) {
  const Tag = textarea ? "textarea" : "input";
  return (
    <label className={`ct-field${textarea ? " is-area" : ""}`} htmlFor={id}>
      <Tag id={id} placeholder=" " {...props} />
      <span>{label}</span>
      <i className="ct-field-bar" aria-hidden="true" />
    </label>
  );
}

export default function Contact({ profile = {} }) {
  const notifyReady = usePageReady();
  const sectionRef = useRef(null);
  const copyTimer = useRef(0);

  const [form, setForm] = useState(EMPTY_FORM);
  const [status, setStatus] = useState(null); // null | sending | sent | error
  const [captcha, setCaptcha] = useState(() => generateCaptcha());
  const [captchaInput, setCaptchaInput] = useState("");
  const [captchaError, setCaptchaError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [time, setTime] = useState(() => timeIn(profile.timezone));

  useEffect(() => {
    notifyReady();
  }, [notifyReady]);

  // live clock for the studio's time zone
  useEffect(() => {
    const id = setInterval(() => setTime(timeIn(profile.timezone)), 30000);
    return () => clearInterval(id);
  }, [profile.timezone]);

  useEffect(() => () => clearTimeout(copyTimer.current), []);

  const refreshCaptcha = () => {
    setCaptcha(generateCaptcha());
    setCaptchaInput("");
    setCaptchaError(false);
  };

  const setField = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (captchaInput.trim().toUpperCase() !== captcha) {
      setCaptchaError(true);
      setCaptcha(generateCaptcha());
      setCaptchaInput("");
      return;
    }

    setStatus("sending");

    try {
      const res = await fetch(`${API}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form), // name, email, subject, message
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      setStatus("sent");
      setForm(EMPTY_FORM);
      refreshCaptcha();
    } catch {
      setStatus("error");
      refreshCaptcha();
    }
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard not available: the mailto link still works */
    }
  };

  // a soft light follows the cursor over the page (CSS variables, no re-render)
  const onMove = (e) => {
    const el = sectionRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--sx", `${e.clientX - r.left}px`);
    el.style.setProperty("--sy", `${e.clientY - r.top}px`);
  };

  const socials = Array.isArray(profile.socials)
    ? profile.socials.filter((s) => s.url || s.href)
    : [];
  const available = profile.availableForWork !== false;

  // only rows that have a value are shown
  const methods = [
    profile.email && { key: "email", Icon: FaEnvelope, label: "Email", value: profile.email, copy: true },
    profile.location && { key: "loc", Icon: FaLocationDot, label: "Location", value: profile.location, ping: true },
    (profile.timezone || time) && {
      key: "time",
      Icon: FaClock,
      label: "Local time",
      value: time ? `${time}${profile.timezone ? ` · ${profile.timezone}` : ""}` : profile.timezone,
    },
    { key: "resp", Icon: FaBolt, label: "Response", value: "Within 24 hours" },
  ].filter(Boolean);

  return (
    <section id="contact" className="contact-section ct" ref={sectionRef} onMouseMove={onMove}>
      {/* background: drifting glows, a dot grid and a light that follows the cursor */}
      <div className="ct-bg" aria-hidden="true">
        <span className="ct-blob ct-blob1" />
        <span className="ct-blob ct-blob2" />
        <span className="ct-blob ct-blob3" />
        <span className="ct-dots" />
        <span className="ct-spot" />
      </div>

      <div className="container ct-inner">
        {/* ---------- left: who, where, how to reach us ---------- */}
        <div className="ct-left">
          <p className={`ct-status ct-rise${available ? "" : " is-off"}`} style={{ "--d": 0 }}>
            <span className="ct-dot" aria-hidden="true" />
            {available ? "Open to new projects" : "Not available right now"}
          </p>

          <h1 className="ct-title" aria-label={TITLE.map((w) => w.text).join(" ")}>
            {TITLE.map((w, i) => (
              <span className="ct-word" key={w.text} aria-hidden="true">
                <span className={`ct-word-in${w.accent ? " is-accent" : ""}`} style={{ "--w": i }}>
                  {w.text}
                </span>
              </span>
            ))}
          </h1>

          <p className="ct-lede ct-rise" style={{ "--d": 4 }}>
            Whether you have a project in mind, need a team to build it, or just want to talk
            tech, our inbox is open.
          </p>

          <ul className="ct-methods">
            {methods.map(({ key, Icon, label, value, copy, ping }, i) => (
              <li className="ct-method ct-rise" key={key} style={{ "--d": 5 + i }}>
                <span className={`ct-method-icon${ping ? " has-ping" : ""}`}>
                  <Icon aria-hidden="true" />
                </span>
                <span className="ct-method-text">
                  <span className="ct-method-label">{label}</span>
                  {copy ? (
                    <a className="ct-method-value is-link" href={`mailto:${value}`}>
                      {value}
                    </a>
                  ) : (
                    <span className="ct-method-value">{value}</span>
                  )}
                </span>
                {copy && (
                  <button
                    type="button"
                    className={`ct-copy${copied ? " is-done" : ""}`}
                    onClick={copyEmail}
                    aria-label="Copy email address"
                  >
                    {copied ? <FaCheck aria-hidden="true" /> : <FaCopy aria-hidden="true" />}
                    <span>{copied ? "Copied" : "Copy"}</span>
                  </button>
                )}
              </li>
            ))}
          </ul>

          {socials.length > 0 && (
            <div className="ct-socials ct-rise" style={{ "--d": 9 }}>
              <p className="ct-socials-label">Find us online</p>
              <div className="ct-socials-row">
                {socials.map((s, i) => (
                  <SocialIcon key={`${s.label}-${i}`} social={s} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ---------- right: the form ---------- */}
        <div className="ct-card ct-rise ct-card-in" style={{ "--d": 3 }}>
          <span className="ct-card-shine" aria-hidden="true" />

          {status === "sent" ? (
            <div className="ct-sent" role="status">
              <svg className="ct-check" viewBox="0 0 52 52" aria-hidden="true">
                <circle cx="26" cy="26" r="24" />
                <path d="M15 27l8 8 15-17" />
              </svg>
              <h2>Message sent</h2>
              <p>Thank you. We&rsquo;ll get back to you within 24 hours.</p>
              <button type="button" className="ct-again" onClick={() => setStatus(null)}>
                Send another message
              </button>
            </div>
          ) : (
            <>
              <div className="ct-card-head">
                <span className="ct-card-logo">
                  <img src="/GHStudios-logo-preview.png" alt="" />
                </span>
                <div>
                  <h2>Tell us about your project</h2>
                  <p>We read every message and reply within 24 hours.</p>
                </div>
              </div>

              <form className="ct-form" onSubmit={handleSubmit}>
                <div className="ct-row">
                  <Field id="ct-name" label="Your name" value={form.name} onChange={setField("name")} required autoComplete="name" />
                  <Field id="ct-email" label="Your email" type="email" value={form.email} onChange={setField("email")} required autoComplete="email" />
                </div>

                <Field id="ct-subject" label="Subject" value={form.subject} onChange={setField("subject")} />

                <Field id="ct-message" label="Your message" textarea rows={5} value={form.message} onChange={setField("message")} required />

                {/* human check */}
                <div className="ct-captcha">
                  <div className="ct-captcha-box">
                    <div className="ct-captcha-code" aria-hidden="true">
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
                    <button type="button" className="ct-captcha-refresh" onClick={refreshCaptcha} aria-label="Get a new code" title="Get a new code">
                      ⟳
                    </button>
                  </div>

                  <Field
                    id="ct-captcha"
                    label="Enter the code above"
                    value={captchaInput}
                    onChange={(e) => {
                      setCaptchaInput(e.target.value);
                      setCaptchaError(false);
                    }}
                    required
                    autoComplete="off"
                  />
                  {captchaError && <p className="ct-error">That code didn&rsquo;t match. Try the new one.</p>}
                </div>

                <button type="submit" className={`ct-submit${status === "sending" ? " is-sending" : ""}`} disabled={status === "sending"}>
                  {status === "sending" ? (
                    <>
                      <span className="ct-spinner" aria-hidden="true" /> Sending…
                    </>
                  ) : (
                    <>
                      Send message <span className="ct-submit-arrow" aria-hidden="true">→</span>
                    </>
                  )}
                </button>

                {status === "error" && (
                  <p className="ct-error" role="alert">
                    Something went wrong.{" "}
                    {profile.email ? (
                      <>
                        Try emailing <a href={`mailto:${profile.email}`}>{profile.email}</a> directly.
                      </>
                    ) : (
                      "Please try again."
                    )}
                  </p>
                )}
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  );
}