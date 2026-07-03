import "./Hero.css";

export default function Hero({ company = {} }) {
  return (
    <section className="hero" id="hero">
      
      {/* 🎬 VIDEO BACKGROUND */}
      <div className="hero-video-wrapper">
        <video className="hero-video" autoPlay muted loop playsInline>
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>

        {/* dark overlay for readability */}
        <div className="hero-overlay" />
      </div>

      {/* optional existing background grid (you can keep or remove) */}
      <div className="hero-grid-bg" aria-hidden />

      <div className="container hero-inner">
        {/* LEFT SIDE */}
        <div className="hero-content fade-up">
          <p className="hero-greeting">
            <span className="mono-tag">We are</span>
          </p>

          <h1 className="hero-name">
            {company.name || "Your Company"}.
          </h1>

          <h2 className="hero-title">{company.tagline || ""}</h2>

          <p className="hero-bio">{company.heroBio || ""}</p>

          <div className="hero-cta">
            <a href="#cases" className="btn btn-primary">
              View our work
            </a>
            <a href="#contact" className="btn btn-outline">
              Start a project
            </a>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div
          className="hero-terminal fade-up"
          style={{ animationDelay: "0.2s" }}
        >
          <div className="terminal-header">
            <span className="dot red" />
            <span className="dot yellow" />
            <span className="dot green" />
            <span className="terminal-title">~/company</span>
          </div>

          <div className="terminal-body">
            <p>
              <span className="t-prompt">$</span> who_we_are
            </p>
            <p className="t-output">digital-product-studio</p>

            <p className="t-spacer" />

            <p>
              <span className="t-prompt">$</span> services --list
            </p>

            {(
              company.services || [
                "Web Development",
                "UI/UX Design",
                "Backend Systems",
                "API Development",
              ]
            ).map((service, i) => (
              <p className="t-output" key={i}>
                {service}
              </p>
            ))}

            <p className="t-spacer" />

            <p>
              <span className="t-prompt">$</span> availability
            </p>

            <p
              className={`t-output ${
                company.availableForWork ? "t-green" : ""
              }`}
            >
              {company.availableForWork
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