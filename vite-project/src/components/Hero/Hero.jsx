import "./Hero.css";
import { Link } from "react-router-dom";

export default function Hero({ profile = {} }) {
  return (
    <section className="hero" id="hero">
      {/* 🎬 VIDEO BACKGROUND */}
      <div className="hero-video-wrapper">
        <video className="hero-video" autoPlay muted loop playsInline>
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

          <h1 className="hero-name">
            {profile.name || "Your Name"}.
          </h1>

          <h2 className="hero-title">
            {profile.tagline || ""}
          </h2>

          <p className="hero-bio">
            {profile.heroBio || ""}
          </p>

          <div className="hero-cta">
            <a href="#cases" className="btn btn-primary">
              View our work
            </a>
            <a href="/contact" className="btn btn-outline">
              Start a project
            </a>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="hero-terminal fade-up" style={{ animationDelay: "0.2s" }}>
          <div className="terminal-header">
            <span className="dot red" />
            <span className="dot yellow" />
            <span className="dot green" />
            <span className="terminal-title">~/profile</span>
          </div>

          <div className="terminal-body">
            <p>
              <span className="t-prompt">$</span> who_are_we
            </p>

            <p className="t-output">
              {profile.name || "Digital Agency"}
            </p>

            <p className="t-spacer" />

            <p>
              <span className="t-prompt">$</span> services --list
            </p>

            {(profile.services || [
              "Web Development",
              "UI/UX Design",
              "Backend Systems",
              "Cyber Security",
              "Videography & Motion Graphics",
            ]).map((service, i) => (
              <p className="t-output" key={i}>
                {service}
              </p>
            ))}

            <p className="t-spacer" />

            <p>
              <span className="t-prompt">$</span> availability
            </p>

            <p className={`t-output ${profile.availableForWork ? "t-green" : ""}`}>
              {profile.availableForWork
                ? "✓ Accepting new projects"
                : "✗ Currently at capacity"}
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