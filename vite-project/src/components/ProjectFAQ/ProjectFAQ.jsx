import { useState } from "react";
import "./ProjectFAQ.css";

export default function ProjectFAQ({ faqs }) {
  const [open, setOpen] = useState(null);

  const toggle = (i) => setOpen(open === i ? null : i);

  return (
    <div className="faq-section">
      <p className="faq-heading">
        <span className="faq-icon">⚙</span> Technical breakdown
      </p>
      <div className="faq-list">
        {faqs.map((item, i) => (
          <div className={`faq-item ${open === i ? "faq-open" : ""}`} key={i}>
            <button className="faq-trigger" onClick={() => toggle(i)}>
              <span className="faq-q">{item.q}</span>
              <span className="faq-chevron">{open === i ? "−" : "+"}</span>
            </button>
            <div
              className="faq-body"
              style={{
                maxHeight: open === i ? "300px" : "0",
              }}
            >
              <p className="faq-answer">{item.a}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
