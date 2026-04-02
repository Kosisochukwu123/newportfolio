import { useEffect, useState } from "react";
import ProjectFAQ from "../ProjectFAQ/ProjectFAQ";
import "./Projects.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function Projects() {
  const [projects, setProjects]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [activeProject, setActive]    = useState(null);

  useEffect(() => {
    fetch(`${API}/projects`)
      .then((r) => r.json())
      .then((d) => { if (d.success) setProjects(d.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section id="projects" className="projects-section">
        <div className="container">
          <p className="section-label">01. Projects</p>
          <p style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)", fontSize: "0.82rem" }}>
            Loading projects...
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="projects-section">
      <div className="container">
        <p className="section-label">01. Projects</p>
        <h2 className="section-title">
          Things I've <span className="accent">built</span>
        </h2>
        <p className="projects-intro">
          A selection of full-stack projects — each built end-to-end, deployed
          to production, and documented below.
        </p>

        <div className="project-list">
          {projects.map((project, idx) => (
            <article
              key={project._id}
              className={`project-card ${activeProject === project._id ? "expanded" : ""}`}
            >
              <div className="project-top">
                <div className="project-visual">
                  {project.imageUrl ? (
                    <img src={project.imageUrl} alt={project.title} className="project-img" />
                  ) : (
                    <div className="project-img-placeholder">
                      <span className="placeholder-num">0{idx + 1}</span>
                    </div>
                  )}
                </div>

                <div className="project-info">
                  <div className="project-meta">
                    <span className="project-year">{project.year}</span>
                    <span className="project-num">{String(idx + 1).padStart(2, "0")}</span>
                  </div>
                  <h3 className="project-title">{project.title}</h3>
                  <p className="project-subtitle">{project.subtitle}</p>
                  <p className="project-desc">{project.description}</p>

                  <div className="project-tags">
                    {(project.tags || []).map((t) => (
                      <span className="tag" key={t}>{t}</span>
                    ))}
                  </div>

                  <div className="project-links">
                    {project.liveUrl && (
                      <a href={project.liveUrl} target="_blank" rel="noreferrer" className="btn btn-primary">
                        Live ↗
                      </a>
                    )}
                    {project.githubUrl && (
                      <a href={project.githubUrl} target="_blank" rel="noreferrer" className="btn btn-outline">
                        GitHub
                      </a>
                    )}
                    {project.faqs?.length > 0 && (
                      <button
                        className="btn btn-ghost"
                        onClick={() => setActive(activeProject === project._id ? null : project._id)}
                      >
                        {activeProject === project._id ? "Hide details ↑" : "How I built it ↓"}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {project.faqs?.length > 0 && (
                <div
                  className="project-faq-wrapper"
                  style={{ maxHeight: activeProject === project._id ? "1200px" : "0" }}
                >
                  <ProjectFAQ faqs={project.faqs} />
                </div>
              )}
            </article>
          ))}

          {projects.length === 0 && (
            <p style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)", fontSize: "0.85rem" }}>
              No projects published yet.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
