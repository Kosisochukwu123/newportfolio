import { useEffect, useRef, useState } from "react";
import "./Projects.css";

const API = import.meta.env.VITE_API_URL || "/api";

function clamp(n, min = 0, max = 1) {
  return Math.min(max, Math.max(min, n));
}

function easeInOut(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function easeOutQuint(t) {
  return 1 - Math.pow(1 - t, 5);
}

const OVERLAP = 0.35;
const HOLD = 0.75;
const STRIDE = 1 + HOLD;

export default function Projects() {
  const containerRef = useRef(null);
  const cardRefs = useRef([]);

  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`${API}/projects`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setCases(data.data);
        else setError(true);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const total = cases.length;

  // Applies transform/opacity/filter/pointer-events directly to each
  // card's DOM node, bypassing React re-render entirely. Calling
  // setState on every scroll frame (the old approach) forced a full
  // React reconciliation of every card, every frame — that render cost
  // is what was actually showing up as the 'message handler' /
  // forced-reflow violations, not the math itself. Direct DOM writes
  // keep this at a steady 60fps regardless of how many cards there are.
  const applyMetrics = (progress) => {
    const scaled = progress * total * STRIDE;

    for (let idx = 0; idx < total; idx++) {
      const el = cardRefs.current[idx];
      if (!el) continue;

      const local = scaled - idx * STRIDE;
      let translateY, scale, opacity;

      if (local <= 0) {
        const raw = clamp((local + 1) / (1 - OVERLAP), 0, 1);
        const t = easeInOut(raw);
        const o = easeOutQuint(raw);
        translateY = `${(1 - t) * 60}%`;
        scale = 0.92 + t * 0.08;
        opacity = o;
      } else if (local <= HOLD) {
        translateY = "0%";
        scale = 1;
        opacity = 1;
      } else {
        const raw = clamp((local - HOLD) / (1 - OVERLAP), 0, 1);
        const t = easeInOut(raw);
        const o = easeOutQuint(raw);
        translateY = `${-t * 18}%`;
        scale = 1 - t * 0.09;
        opacity = 1 - o;
      }

      el.style.transform = `translate3d(0,${translateY},0) scale(${scale})`;
      el.style.opacity = opacity;
      // el.style.filter = local > 0 ? `blur(${(local * 4).toFixed(2)}px)` : "none";
      el.style.filter = "none";
      el.style.pointerEvents = opacity > 0.6 ? "auto" : "none";
    }
  };

  useEffect(() => {
    if (total === 0) return;

    let raf = 0;

    const update = () => {
      const el = containerRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const scrollable = el.offsetHeight - vh;
      const scrolled = clamp(-rect.top, 0, scrollable);
      const progress = scrollable > 0 ? scrolled / scrollable : 0;

      applyMetrics(progress);
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    update(); // set correct initial positions without waiting for a scroll event

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total]);

  if (loading) {
    return <section className="pj-loading">Loading projects...</section>;
  }

  if (error) {
    return (
      <section className="pj-loading">
        Couldn't load projects — please try refreshing.
      </section>
    );
  }

  if (total === 0) {
    return <section className="pj-loading">No projects to show yet.</section>;
  }

  return (
    <section
      id="cases"
      ref={containerRef}
      className="pj-root"
      style={{ height: `${(total * STRIDE + 1) * 100}dvh` }}
    >
      <div className="pj-sticky">
        {cases.map((item, idx) => (
          <article
            key={item._id}
            ref={(node) => (cardRefs.current[idx] = node)}
            className="pj-card"
            style={{ zIndex: 10 + idx }}
          >
            <div className="pj-grid">
              <div className="pj-visual">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.title} />
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
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}