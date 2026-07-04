import { useEffect, useState } from "react";
import ProjectFAQ from "../ProjectFAQ/ProjectFAQ";
import "./CaseStudies.css";

// const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const API = import.meta.env.VITE_API_URL || "/api";

export default function CaseStudies() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(null);

  useEffect(() => {
    fetch(`${API}/projects`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setCases(d.data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="projects-section">
        <p className="section-loading">Loading case studies...</p>
      </section>
    );
  }

  return (
    <section id="cases" className="projects-section">
      <div className="projects-inner-wrapper">

        <p className="section-label">Case Studies</p>

        <h2 className="section-title">
          Real <span className="accent">impact</span> delivered
        </h2>

        <p className="projects-intro">
          Production-ready systems focused on scalability, performance, and UX.
        </p>

        <div className="project-stack">

          {cases.map((item, idx) => {
            const isActive = active === item._id;

            return (
              <article
                key={item._id}
                className={`project-panel ${
                  active && !isActive ? "inactive" : ""
                } ${isActive ? "active" : ""}`}
              >
                <div className="project-inner">

                  {/* IMAGE */}
                  <div className="project-visual">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.title} />
                    ) : (
                      <div className="placeholder">
                        {String(idx + 1).padStart(2, "0")}
                      </div>
                    )}
                  </div>

                  {/* CONTENT */}
                  <div className="project-content">

                    <div className="meta">
                      <span>{item.year}</span>
                      <span>0{idx + 1}</span>
                    </div>

                    <h3>{item.title}</h3>
                    <p className="subtitle">{item.subtitle}</p>
                    <p className="desc">{item.description}</p>

                    <div className="tags">
                      {(item.tags || []).map((t) => (
                        <span key={t}>{t}</span>
                      ))}
                    </div>

                    <div className="actions">
                      {item.liveUrl && (
                        <a href={item.liveUrl} target="_blank" rel="noreferrer">
                          View Project ↗
                        </a>
                      )}

                      {item.faqs?.length > 0 && (
                        <button
                          onClick={() =>
                            setActive(isActive ? null : item._id)
                          }
                        >
                          {isActive ? "Close Case ↑" : "Open Case ↓"}
                        </button>
                      )}
                    </div>

                    <div className={`faq ${isActive ? "show" : ""}`}>
                      {item.faqs?.length > 0 && (
                        <ProjectFAQ faqs={item.faqs} />
                      )}
                    </div>

                  </div>
                </div>
              </article>
            );
          })}

        </div>
      </div>
    </section>
  );
}