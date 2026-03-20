import "./Hero.css";

export default function Hero() {
  return (
    <section className="hero" id="hero">
      <div className="hero-grid-bg" aria-hidden />
      <div className="container hero-inner">
        <div className="hero-content fade-up">
          <p className="hero-greeting">
            <span className="mono-tag">Hello, world — I'm</span>
          </p>
          <h1 className="hero-name">
            Your<br />
            <span className="name-accent">Name.</span>
          </h1>
          <h2 className="hero-title">
            Full Stack MERN Developer
          </h2>
          <p className="hero-bio">
            I architect and build fast, scalable web applications from
            database schemas to pixel-perfect UIs. Specialising in the{" "}
            <strong>MongoDB · Express · React · Node</strong> stack — turning
            complex problems into clean, maintainable code.
          </p>
          <div className="hero-cta">
            <a href="#projects" className="btn btn-primary">
              View my work ↓
            </a>
            <a href="#contact" className="btn btn-outline">
              Get in touch
            </a>
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
            <p>
              <span className="t-prompt">$</span> whoami
            </p>
            <p className="t-output">full-stack-mern-developer</p>
            <p className="t-spacer" />
            <p>
              <span className="t-prompt">$</span> skills --list
            </p>
            <p className="t-output">
              MongoDB, Express.js, React.js, Node.js,
            </p>
            <p className="t-output">
              REST APIs, JWT Auth, Redux, Tailwind,
            </p>
            <p className="t-output">Docker, AWS, Git</p>
            <p className="t-spacer" />
            <p>
              <span className="t-prompt">$</span> status
            </p>
            <p className="t-output t-green">
              ✓ Available for new projects
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
