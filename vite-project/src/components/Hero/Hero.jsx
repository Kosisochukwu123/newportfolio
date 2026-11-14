import { useEffect, useRef, useState } from "react";
import "./Hero.css";

const INTERVAL = 3000;

const COMPANY_NAME = "GH Studios";
const TAGLINE = "on your terms.";
const HERO_BIO =
  "GH Studios is a digital development studio creating modern websites, custom web applications and software solutions through thoughtful design and engineering.";

const ROTATOR = [
  {
    word: "Build",
    icon: "build",
    from: "#ffe066",
    to: "#f5a623",
    line: "Websites, apps and backend systems on the MERN stack and TypeScript.",
  },
  {
    word: "Design",
    icon: "design",
    from: "#ffa66b",
    to: "#ff5e62",
    line: "Interfaces and brand identities that feel considered, never templated.",
  },
  {
    word: "Secure",
    icon: "secure",
    from: "#6ff0b0",
    to: "#1fa971",
    line: "Cyber security, hardening and audits, so what you ship stays safe.",
  },
  {
    word: "Animate",
    icon: "animate",
    from: "#8fd0ff",
    to: "#5470f5",
    line: "Videography and motion graphics that make people stop scrolling.",
  },
];

function Icon({ name }) {
  const p = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#fff",
    strokeWidth: 1.7,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };

  if (name === "build")
    return (
      <svg {...p}>
        <path d="M9 7l-5 5 5 5M15 7l5 5-5 5M13.5 5l-3 14" />
      </svg>
    );

  if (name === "design")
    return (
      <svg {...p}>
        <path d="M12 3l2.2 6.3L21 12l-6.8 2.7L12 21l-2.2-6.3L3 12l6.8-2.7z" />
      </svg>
    );

  if (name === "secure")
    return (
      <svg {...p}>
        <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    );

  return (
    <svg {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="M10 8.5l5.5 3.5-5.5 3.5z" />
    </svg>
  );
}

export default function Hero() {
  const heroRef = useRef(null);
  const [idx, setIdx] = useState(0);

  const [reduceMotion] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    if (reduceMotion) return;

    const t = setTimeout(
      () => setIdx((i) => (i + 1) % ROTATOR.length),
      INTERVAL,
    );

    return () => clearTimeout(t);
  }, [idx, reduceMotion]);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;

    const update = () => {
      const covered =
        window.scrollY > el.offsetTop + el.offsetHeight + 20;

      el.style.visibility = covered ? "hidden" : "visible";
    };

    update();

    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      el.style.visibility = "";
    };
  }, []);

  const stateOf = (i) =>
    i === idx
      ? "is-active"
      : i === (idx - 1 + ROTATOR.length) % ROTATOR.length
        ? "is-prev"
        : "";

  return (
    <section
      className="hero"
      id="hero"
      ref={heroRef}
      style={{ "--hero-ms": `${INTERVAL}ms` }}
    >
      <div className="hero-video-wrapper">
        <video
          className="hero-video"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>

        <div className="hero-overlay" />
        <div className="hero-fade-bottom" />
      </div>

      <div className="container hero-inner">
        <div className="hero-content hero-enter">
          <p className="hero-greeting">
            <span className="mono-tag">We are {COMPANY_NAME}</span>
          </p>

          <div className="hero-icon" aria-hidden="true">
            {ROTATOR.map((r, i) => (
              <span
                key={r.word}
                className={`hero-icon-face ${stateOf(i)}`}
                style={{
                  background: `linear-gradient(145deg, ${r.from}, ${r.to})`,
                  boxShadow: `inset 0 2px 0 rgba(255,255,255,.55), 0 16px 44px -10px ${r.to}`,
                }}
              >
                <Icon name={r.icon} />
              </span>
            ))}
          </div>

          <h1 className="hero-title">
            <span className="hero-sr">
              {COMPANY_NAME} builds websites, custom web applications and
              digital experiences for businesses. {TAGLINE}
            </span>

            <span className="hero-rot" aria-hidden="true">
              {ROTATOR.map((r, i) => (
                <span
                  key={r.word}
                  className={`hero-word ${stateOf(i)}`}
                >
                  {r.word}
                </span>
              ))}
            </span>

            <span className="hero-rest" aria-hidden="true">
              {TAGLINE}
            </span>
          </h1>

          <div className="hero-lines" aria-hidden="true">
            {ROTATOR.map((r, i) => (
              <p
                key={r.word}
                className={`hero-line ${stateOf(i)}`}
              >
                {r.line}
              </p>
            ))}
          </div>

          <p className="hero-description">{HERO_BIO}</p>

          <div className="hero-steps">
            {ROTATOR.map((r, i) => (
              <button
                key={r.word}
                type="button"
                className={`hero-step${i === idx ? " is-active" : ""}`}
                onClick={() => setIdx(i)}
                aria-label={`Show: ${r.word}`}
                aria-current={i === idx}
              >
                <i />
              </button>
            ))}
          </div>

          <div className="hero-cta">
            <a href="#cases" className="btn btn-primary">
              View our work
            </a>

            <a href="/contact" className="btn btn-outline">
              Start a project
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
