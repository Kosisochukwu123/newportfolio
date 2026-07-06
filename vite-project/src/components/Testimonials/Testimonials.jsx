import { useEffect, useRef } from "react";
import "./Testimonials.css";

export default function Testimonials({ testimonials = [] }) {
  const cardRefs = useRef([]);

  useEffect(() => {
    // IntersectionObserver, not a scroll listener — this only fires when
    // a card actually enters/leaves the viewport, so it costs nothing
    // while scrolling past sections that don't need it.
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
          }
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -60px 0px" }
    );

    cardRefs.current.forEach((el) => el && observer.observe(el));

    return () => observer.disconnect();
  }, [testimonials]);

  if (testimonials.length === 0) return null;

  return (
    <section id="testimonials" className="testimonials-section">
      <div className="container">
        <p className="section-label">06. Testimonials</p>
        <h2 className="section-title">
          What people <span className="accent">say</span>
        </h2>

        <div className="testimonials-list">
          {testimonials.map((t, i) => (
            <div
              key={t._id}
              ref={(node) => (cardRefs.current[i] = node)}
              className={`testimonial-card ${i % 2 === 0 ? "from-left" : "from-right"}`}
            >
              <span className="testimonial-quote-mark" aria-hidden="true">
                “
              </span>

              <p className="testimonial-quote">{t.quote}</p>

              <div className="testimonial-author">
                {t.photoUrl ? (
                  <img src={t.photoUrl} alt={t.name} className="testimonial-photo" />
                ) : (
                  <div className="testimonial-photo-empty" aria-hidden="true">
                    {t.name?.[0] || "?"}
                  </div>
                )}
                <div>
                  <p className="testimonial-name">{t.name}</p>
                  {t.role && <p className="testimonial-role">{t.role}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}