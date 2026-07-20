import React from 'react';

const ProjectFAQ = ({
  item,
  hasFaqs,
  isFaqOpen,
  activeQuestion,
  toggleQuestion,
  onFaqPanelRef,        
}) => {
  if (!hasFaqs) return null;

  return (
    <div
      ref={(node) => onFaqPanelRef(item._id, node)}   // ← use callback
      className={`pj-faq ${isFaqOpen ? "is-open" : ""}`}
    >
      <div className="pj-faq-scroll">
        {item.faqs.map((faq, qIdx) => {
          const key = faq.id ?? `${item._id}-${qIdx}`;
          const isQOpen = activeQuestion[item._id] === qIdx;

          return (
            <div className="pj-faq-item" key={key}>
              <button
                type="button"
                className="pj-faq-question"
                onClick={() => toggleQuestion(item._id, qIdx)}
                aria-expanded={isQOpen}
              >
                <span>{faq.question}</span>
                <span className="pj-faq-icon">
                  {isQOpen ? "−" : "+"}
                </span>
              </button>
              <div
                className={`pj-faq-answer ${isQOpen ? "is-open" : ""}`}
              >
                <p>{faq.answer}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProjectFAQ;