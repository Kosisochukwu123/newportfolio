import { useState } from "react";
import { projects } from "../../data/projects";
import ProjectFAQ from"../ProjectFAQ/ProjectFAQ"
import "./Projects.css";

export default function Projects() {
  const [activeProject, setActiveProject] = useState(null);

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
              className={`project-card ${activeProject === project.id ? "expanded" : ""}`}
              key={project.id}
            >
              {/* Card header row */}
              <div className="project-top">
                {/* Left: image / placeholder */}
                <div className="project-visual">
                  {project.image ? (
                    <img
                      src={project.image}
                      alt={project.title}
                      className="project-img"
                    />
                  ) : (
                    <div className="project-img-placeholder">
                      <span className="placeholder-num">0{idx + 1}</span>
                    </div>
                  )}
                </div>

                {/* Right: info */}
                <div className="project-info">
                  <div className="project-meta">
                    <span className="project-year">{project.year}</span>
                    <span className="project-num">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="project-title">{project.title}</h3>
                  <p className="project-subtitle">{project.subtitle}</p>
                  <p className="project-desc">{project.description}</p>

                  <div className="project-tags">
                    {project.tags.map((t) => (
                      <span className="tag" key={t}>
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="project-links">
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-primary"
                    >
                      Live ↗
                    </a>
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-outline"
                    >
                      GitHub
                    </a>
                    <button
                      className="btn btn-ghost"
                      onClick={() =>
                        setActiveProject(
                          activeProject === project.id ? null : project.id
                        )
                      }
                    >
                      {activeProject === project.id
                        ? "Hide details ↑"
                        : "How I built it ↓"}
                    </button>
                  </div>
                </div>
              </div>

              {/* FAQ accordion — expands below the card */}
              <div
                className="project-faq-wrapper"
                style={{
                  maxHeight:
                    activeProject === project.id ? "1200px" : "0",
                }}
              >
                <ProjectFAQ faqs={project.faqs} />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
