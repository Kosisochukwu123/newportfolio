import { useEffect, useState } from "react";
import ProjectFAQ from "../ProjectFAQ/ProjectFAQ";
import "./Projects.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function Projects() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(null);

  useEffect(() => {
    fetch(`${API}/projects`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setCases(d.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section id="cases" className="projects-section">
        <div className="container">
          <p className="section-label">02. Case Studies</p>
          <p className="section-loading">Loading case studies...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="cases" className="projects-section">
      <div className="container">
        <p className="section-label">02. Case Studies</p>

        <h2 className="section-title">
          Real <span className="accent">business impact</span>
        </h2>

        <p className="projects-intro">
          A selection of production systems focused on scalability, performance,
          and user experience.
        </p>

        {/* STACK WRAPPER */}
        <div className="project-list">
          {cases.map((item, idx) => (
            <article
              key={item._id}
              className={`project-card ${
                active === item._id ? "expanded" : ""
              }`}
            >
              <div className="project-top">
                {/* IMAGE */}
                <div className="project-visual">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="project-img"
                    />
                  ) : (
                    <div className="project-img-placeholder">
                      <span className="placeholder-num">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                    </div>
                  )}
                </div>

                {/* INFO */}
                <div className="project-info">
                  <div className="project-meta">
                    <span className="project-year">{item.year}</span>
                    <span className="project-num">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <h3 className="project-title">{item.title}</h3>

                  <p className="project-subtitle">{item.subtitle}</p>

                  <p className="project-desc">{item.description}</p>

                  {/* TAGS */}
                  <div className="project-tags">
                    {(item.tags || []).map((t) => (
                      <span className="tag" key={t}>
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* BUTTONS */}
                  <div className="project-links">
                    {item.liveUrl && (
                      <a
                        href={item.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-primary"
                      >
                        View Project ↗
                      </a>
                    )}

                    <button
                      className="btn btn-outline"
                      onClick={() =>
                        setActive(active === item._id ? null : item._id)
                      }
                    >
                      {active === item._id
                        ? "Hide details ↑"
                        : "View case study ↓"}
                    </button>
                  </div>
                </div>
              </div>

              {/* FAQ */}
              {item.faqs?.length > 0 && (
                <div
                  className="project-faq-wrapper"
                  style={{
                    maxHeight: active === item._id ? "1200px" : "0",
                  }}
                >
                  <ProjectFAQ faqs={item.faqs} />
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}