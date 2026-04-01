import { useEffect, useState } from "react";
import "./Hero.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function Hero() {
  const [profile, setProfile] = useState({
    name: "Your Name",
    tagline: "Full Stack MERN Developer",
    heroBio:
      "I architect and build fast, scalable web applications from database schemas to pixel-perfect UIs. Specialising in the MongoDB · Express · React · Node stack — turning complex problems into clean, maintainable code.",
    terminalLines: [
      "MongoDB, Express.js, React.js, Node.js,",
      "REST APIs, JWT Auth, Redux, Tailwind,",
      "Docker, AWS, Git",
    ],
    availableForWork: true,
  });

  useEffect(() => {
    fetch(`${API}/profile`)
      .then((r) => r.json())
      .then((d) => { if (d.success) setProfile(d.data); })
      .catch(() => {});
  }, []);

  const nameParts = profile.name.trim().split(" ");
  const firstName = nameParts.slice(0, -1).join(" ") || profile.name;
  const lastName  = nameParts.length > 1 ? nameParts[nameParts.length - 1] : "";

  return (
    <section className="hero" id="hero">
      <div className="hero-grid-bg" aria-hidden />
      <div className="container hero-inner">
        <div className="hero-content fade-up">
          <p className="hero-greeting">
            <span className="mono-tag">Hello, world — I am</span>
          </p>
          <h1 className="hero-name">
            {firstName && <>{firstName}<br /></>}
            <span className="name-accent">{lastName || firstName}.</span>
          </h1>
          <h2 className="hero-title">{profile.tagline}</h2>
          <p className="hero-bio">{profile.heroBio}</p>
          <div className="hero-cta">
            <a href="#projects" className="btn btn-primary">View my work</a>
            <a href="#contact"  className="btn btn-outline">Get in touch</a>
          </div>
        </div>

        <div className="hero-terminal fade-up" style={{ animationDelay: "0.2s" }}>
          <div className="terminal-header">
            <span className="dot red" />
            <span className="dot yellow" />
            <span className="dot green" />
            <span className="terminal-title">~/portfolio</span>
          </div>
          <div className="terminal-body">
            <p><span className="t-prompt">$</span> whoami</p>
            <p className="t-output">full-stack-mern-developer</p>
            <p className="t-spacer" />
            <p><span className="t-prompt">$</span> skills --list</p>
            {(profile.terminalLines || []).map((line, i) => (
              <p className="t-output" key={i}>{line}</p>
            ))}
            <p className="t-spacer" />
            <p><span className="t-prompt">$</span> status</p>
            <p className={`t-output ${profile.availableForWork ? "t-green" : ""}`}>
              {profile.availableForWork ? "✓ Available for new projects" : "✗ Not currently available"}
            </p>
            <p className="t-cursor">
              <span className="t-prompt">$</span>
              <span className="blink"> ▋</span>
            </p>
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
