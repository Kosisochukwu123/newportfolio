// ProjectCard.jsx
import React from 'react';
import ProjectFAQ from '../ProjectFAQ/ProjectFAQ';

const ProjectCard = ({
  item,
  idx,
  isFaqOpen,
  hasFaqs,
  activeQuestion,
  toggleQuestion,
  toggleFaqPanel,
  onFaqPanelRef,
  cardRef,           // We'll pass the ref callback from parent
}) => {
  return (
    <article
      ref={cardRef}
      className="pj-card"
      style={{ zIndex: 10 + idx }}
    >
      <div className="pj-grid">
        <div className="pj-visual">
          {item.imageUrl ? (
            <img
              src={item.imageUrl}
              alt={item.title}
              loading={idx === 0 ? "eager" : "lazy"}
              decoding="async"
            />
          ) : (
            <div className="pj-visual-empty" aria-hidden="true" />
          )}
        </div>

        <div className="pj-content">
          <p className="pj-subtitle">{item.subtitle}</p>
          <h2 className="pj-title">{item.title}</h2>
          <p className="pj-desc">{item.description}</p>

          <div className="pj-tags">
            {item.tags?.map((tag) => (
              <span key={tag} className="pj-tag">
                {tag}
              </span>
            ))}
          </div>

          <div className="pj-actions">
            {item.liveUrl && (
              <a
                href={item.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="pj-btn pj-btn-primary"
              >
                View Project ↗
              </a>
            )}
            {item.githubUrl && (
              <a
                href={item.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="pj-btn pj-btn-ghost"
              >
                GitHub
              </a>
            )}
            {hasFaqs && (
              <button
                type="button"
                className="pj-btn pj-btn-ghost"
                onClick={() => toggleFaqPanel(item._id)}
                aria-expanded={isFaqOpen}
              >
                {isFaqOpen ? "Close Case ↑" : "Open Case ↓"}
              </button>
            )}
          </div>

          <ProjectFAQ
            item={item}
            hasFaqs={hasFaqs}
            isFaqOpen={isFaqOpen}
            activeQuestion={activeQuestion}
            toggleQuestion={toggleQuestion}
            onFaqPanelRef={onFaqPanelRef}
          />
        </div>
      </div>
    </article>
  );
};

export default ProjectCard;