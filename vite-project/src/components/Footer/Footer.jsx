
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { getLenis } from "../../utils/smoothScroll";
import BugReportModal from "./BugReportModal";
import "./Footer.css";

const API = import.meta.env.VITE_API_URL || "/api";
const NEWSLETTER_ENDPOINT = `${API}/newsletter`;

const DEFAULT_COMPANY = {
  name: "GH Studios",
  email: "Kosiogbunuko@gmail.com",
  location: "Uyo, Nigeria",
  timezone: "Africa/Lagos",
  availableForWork: true,
  socials: [
    { label: "GitHub", url: "#" },
    { label: "LinkedIn", url: "#" },
    { label: "Instagram", url: "#" },
  ],
};

const NAV = [
  { label: "Home", to: "/#hero" },
  { label: "About", to: "/#about" },
  { label: "Projects", to: "/#cases" },
  { label: "Team", to: "/team" },
  { label: "Contact", to: "/contact" },
];

const DEFAULT_SERVICES = [
  "Web Development",
  "Cyber Security",
  "Backend Systems",
  "UI / UX Design",
  "Videography & Motion",
];

const formatTime = (timeZone) => {
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

const NEWSLETTER_MESSAGES = {
  invalid: "Please enter a valid email address.",
  error: "Something went wrong. Please try again.",
  done: "You’re on the list. Thank you!",
};

export default function Footer({ company = {} }) {
  const c = {
    ...DEFAULT_COMPANY,
    ...company,
    socials: company.socials ?? DEFAULT_COMPANY.socials,
  };

  const available = c.availableForWork ?? c.available ?? true;
  const timezone = c.timezone || c.timeZone || DEFAULT_COMPANY.timezone;

  const socials = (c.socials || [])
    .map((social) => ({
      ...social,
      href: social.url || social.href || "",
    }))
    .filter((social) => social.href);

  const services =
    c.services?.length > 0 ? c.services : DEFAULT_SERVICES;

  const footerRef = useRef(null);
  const [inView, setInView] = useState(false);
  const [bugModalOpen, setBugModalOpen] = useState(false);
  const [time, setTime] = useState(() => formatTime(timezone));
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");

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

  useEffect(() => {
    const updateTime = () => setTime(formatTime(timezone));

    updateTime();
    const id = setInterval(updateTime, 30000);

    return () => clearInterval(id);
  }, [timezone]);

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

  const rise = (n) => ({
    className: "ft-rise",
    style: { "--d": n },
  });

  return (
    <footer
      ref={footerRef}
      className={`footer${inView ? " is-in" : ""}`}
    >
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-left">
            <div {...rise(0)}>
              <p className="footer-status">
                <span
                  className={`footer-dot${available ? "" : " is-off"}`}
                  aria-hidden="true"
                />
                {available
                  ? "Available for new projects"
                  : "Fully booked right now"}

                <span className="footer-status-sep" aria-hidden="true">
                  ·
                </span>

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
                <span className="footer-cta-arrow" aria-hidden="true">
                  →
                </span>
              </Link>

              <button
                type="button"
                className="btn btn-outline footer-bug"
                onClick={() => setBugModalOpen(true)}
              >
                <svg
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <path d="M9 7a3 3 0 0 1 6 0M8 10h8v5a4 4 0 0 1-8 0zM4 12h4M16 12h4M5 19l3-2M19 19l-3-2M5 6l3 2M19 6l-3 2" />
                </svg>
                Report a bug
              </button>
            </div>
          </div>

          <div className="footer-right">
            <nav
              className="footer-block ft-rise"
              style={{ "--d": 2 }}
              aria-label="Footer navigation"
            >
              <h4>Navigation</h4>

              {NAV.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  className="footer-link"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="footer-block ft-rise" style={{ "--d": 3 }}>
              <h4>Services</h4>

              {services.map((service, index) => (
                <Link
                  key={`${service}-${index}`}
                  to="/contact"
                  className="footer-link"
                >
                  {service}
                </Link>
              ))}
            </div>

            <div className="footer-block ft-rise" style={{ "--d": 4 }}>
              <h4>Contact</h4>

              {c.email && (
                <a href={`mailto:${c.email}`} className="footer-link">
                  {c.email}
                </a>
              )}

              <p className="footer-plain">{c.location}</p>
            </div>
          </div>
        </div>

        <div className="footer-newsletter ft-rise" style={{ "--d": 4 }}>
          <div>
            <h3>Subscribe to updates</h3>
            <p>Product launches, case studies and development notes.</p>
          </div>

          <div className="newsletter-side">
            <form
              className="newsletter-form"
              onSubmit={subscribe}
              noValidate
            >
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

                  if (status !== "idle" && status !== "loading") {
                    setStatus("idle");
                  }
                }}
                aria-invalid={status === "invalid"}
                disabled={status === "loading"}
              />

              <button
                type="submit"
                aria-label="Subscribe"
                disabled={status === "loading"}
              >
                {status === "loading" ? (
                  <span className="ft-spinner" aria-hidden="true" />
                ) : (
                  "→"
                )}
              </button>
            </form>

            <p
              className={`newsletter-msg is-${status}`}
              role="status"
              aria-live="polite"
            >
              {NEWSLETTER_MESSAGES[status] || ""}
            </p>
          </div>
        </div>

        <div className="footer-bottom ft-rise" style={{ "--d": 5 }}>
          <p>
            &copy; {new Date().getFullYear()} {c.name}
          </p>

          <div className="footer-bottom-right">
            <div className="footer-socials">
              {socials.map((social, index) => (
                <a
                  key={`${social.label}-${index}`}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  {social.label}
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
              <span className="footer-back-to-top-arrow" aria-hidden="true">
                ↑
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="footer-brand" aria-hidden="true">
        {[...c.name].map((ch, index) => (
          <span
            key={index}
            className="footer-brand-letter"
            style={{ "--l": index }}
          >
            {ch === " " ? "\u00A0" : ch}
          </span>
        ))}
      </div>

      {bugModalOpen && (
        <BugReportModal onClose={() => setBugModalOpen(false)} />
      )}
    </footer>
  );
}
