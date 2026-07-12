import { useEffect, useRef } from "react";
import "./Testimonials.css";

export default function Testimonials({ testimonials = [] }) {
  const cardRefs = useRef([]);

  useEffect(() => {
    // IntersectionObserver, not a scroll listener — only fires when a
    // card actually enters/leaves the viewport, costing nothing while
    // scrolling past sections that don't need it.
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
          }
        });
      },
      { threshold: 0.25, rootMargin: "0px 0px -60px 0px" }
    );

    cardRefs.current.forEach((el) => el && observer.observe(el));

    return () => observer.disconnect();
  }, [testimonials]);

  if (testimonials.length === 0) return null;

  return (
    <section id="testimonials" className="testimonials-section">
      <div className="container">
        {/* <p className="section-label">06. Testimonials</p> */}
        <h2 className="section-title">
          What people <span className="accent">say</span>
        </h2>

        <div
          className="testimonials-stage"
          style={{ "--card-count": testimonials.length }}
        >
          {/* Phone mockup, centered */}
          <div className="phone-mockup" aria-hidden="true">
            <div className="phone-notch" />
            <div className="phone-screen">
              <img
                src="/testimonial-phone-screenshot.png"
                alt=""
                className="phone-screen-image"
              />
            </div>
          </div>

          {/* Cards scattered around the phone at different corners/angles */}
          <div className="testimonials-cards">
            {testimonials.map((t, i) => {
              const variant = (i % 4) + 1; // cycles pos-1..pos-4
              return (
                <div
                  key={t._id}
                  ref={(node) => (cardRefs.current[i] = node)}
                  className={`testimonial-card pos-${variant}`}
                  style={{ "--i": i }}
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
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}