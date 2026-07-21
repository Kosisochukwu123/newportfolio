import { useEffect, useRef, useState } from "react";
import "./Hero.css";

const COMMANDS = ["who_are_we", "services --list", "availability"];

export default function Hero({ profile = {} }) {
  const heroRef = useRef(null);
  const terminalRef = useRef(null);

  // ── Typewriter sequence ──
  // phase: which command (0..COMMANDS.length) we're on. Once it equals
  // COMMANDS.length, everything has been typed and only the final
  // blinking cursor shows.
  const [phase, setPhase] = useState(0);
  const [typedCmd, setTypedCmd] = useState("");
  const [outputShown, setOutputShown] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const timers = [];

    function typeCommand(text, onDone) {
      let i = 0;
      const tick = () => {
        if (cancelled) return;
        i++;
        setTypedCmd(text.slice(0, i));
        if (i < text.length) {
          timers.push(setTimeout(tick, 38));
        } else {
          timers.push(setTimeout(onDone, 350));
        }
      };
      tick();
    }

    function runPhase(p) {
      if (cancelled) return;
      if (p >= COMMANDS.length) return;

      setTypedCmd("");
      setOutputShown(false);

      typeCommand(COMMANDS[p], () => {
        if (cancelled) return;
        setOutputShown(true);
        timers.push(
          setTimeout(() => {
            setPhase(p + 1);
            runPhase(p + 1);
          }, 550),
        );
      });
    }

    runPhase(0);

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, []);

  // ── Mouse parallax on the terminal ──
  useEffect(() => {
    const container = heroRef.current;
    const el = terminalRef.current;
    if (!container || !el) return;

    let raf = 0;

    const handleMove = (e) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = container.getBoundingClientRect();
        const relX = (e.clientX - rect.left) / rect.width - 0.5;
        const relY = (e.clientY - rect.top) / rect.height - 0.5;
        el.style.transform = `perspective(900px) rotateX(${(-relY * 8).toFixed(2)}deg) rotateY(${(relX * 8).toFixed(2)}deg)`;
      });
    };

    const reset = () => {
      cancelAnimationFrame(raf);
      el.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
    };

    container.addEventListener("mousemove", handleMove);
    container.addEventListener("mouseleave", reset);

    return () => {
      cancelAnimationFrame(raf);
      container.removeEventListener("mousemove", handleMove);
      container.removeEventListener("mouseleave", reset);
    };
  }, []);

  const services = profile.services || [
    "Web Development(Mern Stack)",
    "TypeScript",
    "Backend Systems(Node.js, MongoDB)",
    "Cyber Security",
    "Videography & Motion Graphics",
    "Other services...",
  ];

  const renderOutput = (idx) => {
    if (idx === 0) {
      return <p className="t-output">{profile.name || "Digital Agency"}</p>;
    }
    if (idx === 1) {
      return services.map((service, i) => (
        <p className="t-output" key={i}>
          {service}
        </p>
      ));
    }
    if (idx === 2) {
      return (
        <p className={`t-output ${profile.availableForWork ? "t-green" : ""}`}>
          {profile.availableForWork
            ? "✓ Accepting new projects"
            : "✗ Currently at capacity"}
        </p>
      );
    }
    return null;
  };

  return (
    <section className="hero" id="hero" ref={heroRef}>
      {/* 🎬 VIDEO BACKGROUND */}
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

      <div className="hero-grid-bg" aria-hidden />

      <div className="container hero-inner">
        {/* LEFT SIDE */}
        <div className="hero-content fade-up">
          <p className="hero-greeting">
            <span className="mono-tag">We are</span>
          </p>

          <h1 className="hero-name">{profile.name || "Your Name"}.</h1>

          <h2 className="hero-title">{profile.tagline || ""}</h2>

          <p className="hero-bio">{profile.heroBio || ""}</p>

          <div className="hero-cta">
            <a href="#cases" className="btn btn-primary">
              View our work
            </a>
            <a href="/contact" className="btn btn-outline">
              Start a project
            </a>
          </div>

          {/* Stats counter */}
          {/* <div className="hero-stats">
            {[
              { num: profile.projectsShipped || "20+", label: "Projects" },
              { num: profile.clientsServed || "10+", label: "Clients" },
              { num: profile.yearsExperience || "3+", label: "Years Experience" },
            ].map((s) => (
              <div className="hero-stat" key={s.label}>
                <span className="hero-stat-num">{s.num}</span>
                <span className="hero-stat-label">{s.label}</span>
              </div>
            ))}
          </div> */}
        </div>

        {/* RIGHT SIDE */}
        <div
          className="hero-terminal fade-up"
          style={{ animationDelay: "0.2s" }}
          ref={terminalRef}
        >
          <div className="terminal-header">
            <span className="dot red" />
            <span className="dot yellow" />
            <span className="dot green" />
            <span className="terminal-title">~/profile</span>
          </div>

          <div className="terminal-body">
            {COMMANDS.map((cmdText, idx) => {
              if (idx > phase) return null;

              const isCurrent = idx === phase;
              const displayCmd = isCurrent ? typedCmd : cmdText;
              const showOutputForThis =
                idx < phase || (isCurrent && outputShown);
              const stillTyping = isCurrent && !outputShown;

              return (
                <div key={idx}>
                  <p>
                    <span className="t-prompt">$</span> {displayCmd}
                    {stillTyping && <span className="blink"> ▋</span>}
                  </p>
                  {showOutputForThis && renderOutput(idx)}
                  {showOutputForThis && <p className="t-spacer" />}
                </div>
              );
            })}

            {phase >= COMMANDS.length && (
              <p className="t-cursor">
                <span className="t-prompt">$</span>
                <span className="blink"> ▋</span>
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="scroll-hint">
        <span className="scroll-line" />
        <span className="mono-tag">scroll</span>
      </div>
    </section>
  );
}
