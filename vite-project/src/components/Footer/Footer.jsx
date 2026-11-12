import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { getLenis } from "../../utils/smoothScroll";
import BugReportModal from "./BugReportModal";
import "./Footer.css";

const API = import.meta.env.VITE_API_URL || "/api";
// Where the newsletter form sends the email. Change this to your real route.
const NEWSLETTER_ENDPOINT = `${API}/newsletter`;

// Defaults use your real details. Pass a `company` prop to override any of them.
const DEFAULT_COMPANY = {
  name: "GH Studios",
  email: "Kosiogbunuko@gmail.com",
  location: "Uyo, Nigeria",
  timeZone: "Africa/Lagos",
  available: true, // shows "Available for new projects" (false: "Fully booked")
  socials: [
    { label: "GitHub", href: "#" }, // put your real links here
    { label: "LinkedIn", href: "#" },
    { label: "Instagram", href: "#" },
  ],
};

const NAV = [
  { label: "Home", to: "/#hero" },
  { label: "About", to: "/#about" },
  { label: "Projects", to: "/#cases" },
  { label: "Team", to: "/team" },
  { label: "Contact", to: "/contact" },
];
const SERVICES = [
  "Web Development",
  "Cyber Security",
  "Backend Systems",
  "UI / UX Design",
  "Videography & Motion",
];

const formatTime = (timeZone) =>
  new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone,
  }).format(new Date());

const NEWSLETTER_MESSAGES = {
  invalid: "Please enter a valid email address.",
  error: "Something went wrong. Please try again.",
  done: "You\u2019re on the list. Thank you!",
};

export default function Footer({ company = {} }) {
  const c = { ...DEFAULT_COMPANY, ...company };

  const footerRef = useRef(null);
  const [inView, setInView] = useState(false);
  const [bugModalOpen, setBugModalOpen] = useState(false);
  const [time, setTime] = useState(() => formatTime(c.timeZone));
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | invalid | error | done

  // Everything rises in once, when the footer first scrolls into view.
  useEffect(() => {
    const el = footerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Live local time next to the location.
  useEffect(() => {
    const id = setInterval(() => setTime(formatTime(c.timeZone)), 30000);
    return () => clearInterval(id);
  }, [c.timeZone]);

  const scrollToTop = () => {
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(0);
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const subscribe = async (e) => {
    e.preventDefault();
    const value = email.trim();
    if (!/^\S+@\S+\.\S+$/.test(value)) {
      setStatus("invalid");
      return;
    }
    setStatus("loading");
    try {
      const res = await fetch(NEWSLETTER_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: value }),
      });
      if (!res.ok) throw new Error("Request failed");
      setEmail("");
      setStatus("done");
    } catch {
      setStatus("error");
    }
  };

  // each block rises in a little after the one before it
  const rise = (n) => ({ className: "ft-rise", style: { "--d": n } });

  return (
    <footer ref={footerRef} className={`footer${inView ? " is-in" : ""}`}>
      <div className="footer-container">
        {/* Top */}
        <div className="footer-top">
          <div className="footer-left">
            <div {...rise(0)}>
              <p className="footer-status">
                <span className={`footer-dot${c.available ? "" : " is-off"}`} aria-hidden="true" />
                {c.available ? "Available for new projects" : "Fully booked right now"}
                <span className="footer-status-sep" aria-hidden="true">·</span>
                <span className="footer-time">
                  {c.location} {time}
                </span>
              </p>
            </div>

            <h2 className="footer-heading ft-rise" style={{ "--d": 1 }}>
              Let&rsquo;s build something
              <span className="footer-accent"> great.</span>
            </h2>

            <p className="footer-description ft-rise" style={{ "--d": 2 }}>
              Looking for web development, cybersecurity solutions, backend
              systems, or digital product design? Let&rsquo;s create something
              users actually remember.
            </p>

            <div className="footer-buttons ft-rise" style={{ "--d": 3 }}>
              <Link to="/contact" className="btn btn-primary footer-cta">
                Start a project
                <span className="footer-cta-arrow" aria-hidden="true">→</span>
              </Link>
              <button
                type="button"
                className="btn btn-outline footer-bug"
                onClick={() => setBugModalOpen(true)}
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                  <path d="M9 7a3 3 0 0 1 6 0M8 10h8v5a4 4 0 0 1-8 0zM4 12h4M16 12h4M5 19l3-2M19 19l-3-2M5 6l3 2M19 6l-3 2" />
                </svg>
                Report a bug
              </button>
            </div>
          </div>

          {/* right side */}
          <div className="footer-right">
            <nav className="footer-block ft-rise" style={{ "--d": 2 }} aria-label="Footer navigation">
              <h4>Navigation</h4>
              {NAV.map((l) => (
                <Link key={l.label} to={l.to} className="footer-link">
                  {l.label}
                </Link>
              ))}
            </nav>

            <div className="footer-block ft-rise" style={{ "--d": 3 }}>
              <h4>Services</h4>
              {SERVICES.map((s) => (
                <Link key={s} to="/contact" className="footer-link">
                  {s}
                </Link>
              ))}
            </div>

            <div className="footer-block ft-rise" style={{ "--d": 4 }}>
              <h4>Contact</h4>
              <a href={`mailto:${c.email}`} className="footer-link">
                {c.email}
              </a>
              <p className="footer-plain">{c.location}</p>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="footer-newsletter ft-rise" style={{ "--d": 4 }}>
          <div>
            <h3>Subscribe to updates</h3>
            <p>Product launches, case studies and development notes.</p>
          </div>

          <div className="newsletter-side">
            <form className="newsletter-form" onSubmit={subscribe} noValidate>
              <label htmlFor="footer-email" className="ft-sr">
                Email address
              </label>
              <input
                id="footer-email"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status !== "idle" && status !== "loading") setStatus("idle");
                }}
                aria-invalid={status === "invalid"}
                disabled={status === "loading"}
              />
              <button type="submit" aria-label="Subscribe" disabled={status === "loading"}>
                {status === "loading" ? <span className="ft-spinner" aria-hidden="true" /> : "→"}
              </button>
            </form>
            <p className={`newsletter-msg is-${status}`} role="status" aria-live="polite">
              {NEWSLETTER_MESSAGES[status] || ""}
            </p>
          </div>
        </div>

        {/* bottom */}
        <div className="footer-bottom ft-rise" style={{ "--d": 5 }}>
          <p>
            &copy; {new Date().getFullYear()} {c.name}
          </p>

          <div className="footer-bottom-right">
            <div className="footer-socials">
              {c.socials
                .filter((s) => s.href)
                .map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noreferrer">
                    {s.label}
                  </a>
                ))}
            </div>

            <button
              type="button"
              className="footer-back-to-top"
              onClick={scrollToTop}
              aria-label="Back to top"
            >
              <span>Back to top</span>
              <span className="footer-back-to-top-arrow" aria-hidden="true">↑</span>
            </button>
          </div>
        </div>
      </div>

      {/* giant company name: the letters rise in, and it is cropped at the bottom edge */}
      <div className="footer-brand" aria-hidden="true">
        {[...c.name].map((ch, i) => (
          <span key={i} className="footer-brand-letter" style={{ "--l": i }}>
            {ch === " " ? "\u00A0" : ch}
          </span>
        ))}
      </div>

      {bugModalOpen && <BugReportModal onClose={() => setBugModalOpen(false)} />}
    </footer>
  );
}