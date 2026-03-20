import "./About.css";

export default function About() {
  return (
    <section id="about" className="about-section">
      <div className="container">
        <p className="section-label">03. About</p>
        <div className="about-grid">
          <div className="about-text">
            <h2 className="section-title">
              Building digital products that <span className="accent">matter</span>
            </h2>
            <p>
              I'm a Full Stack MERN Developer with a passion for building
              complete web experiences — from architecting MongoDB schemas and
              crafting Express REST APIs to designing fluid React interfaces.
            </p>
            <p>
              I care deeply about clean code, developer experience, and shipping
              products that are fast, accessible, and a joy to use.
            </p>
            <p>
              When I'm not coding, I'm exploring new libraries, contributing to
              open source, or reading about system design and engineering culture.
            </p>
            <div className="about-stats">
              {[
                { num: "3+", label: "Years Experience" },
                { num: "20+", label: "Projects Shipped" },
                { num: "∞", label: "Coffee consumed" },
              ].map((s) => (
                <div className="stat" key={s.label}>
                  <span className="stat-num">{s.num}</span>
                  <span className="stat-label">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="about-card">
            <div className="about-img-wrapper">
              <div className="about-img-placeholder">
                <span>Your Photo</span>
              </div>
              <div className="about-img-border" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
