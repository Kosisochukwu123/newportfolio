// ProjectInfo.jsx — replaces ProjectCard.jsx.
// The text side of a project. It sits on the same solid card as the image
// (see Projects.jsx), so the two always move as one block.
export default function ProjectInfo({ item, hasFaqs, isFaqOpen, onOpenFaq }) {
  return (
    <div className="ps-text">
      {item.subtitle && <p className="ps-kind">{item.subtitle}</p>}
      <h2 className="ps-title">{item.title}</h2>
      {item.description && <p className="ps-desc">{item.description}</p>}

      {item.tags?.length > 0 && (
        <ul className="ps-tags">
          {item.tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
      )}

      <div className="ps-actions">
        {item.liveUrl && (
          <a href={item.liveUrl} target="_blank" rel="noreferrer" className="ps-btn ps-btn-primary">
            View project ↗
          </a>
        )}
        {item.githubUrl && (
          <a href={item.githubUrl} target="_blank" rel="noreferrer" className="ps-btn ps-btn-ghost">
            GitHub
          </a>
        )}
        {hasFaqs && (
          <button
            type="button"
            className="ps-btn ps-btn-ghost"
            onClick={onOpenFaq}
            aria-haspopup="dialog"
            aria-expanded={isFaqOpen}
          >
            Open case
          </button>
        )}
      </div>
    </div>
  );
}