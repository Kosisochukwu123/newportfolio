import { useEffect, useRef, useState } from "react";
import "./Projects.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function clamp(n, min = 0, max = 1) {
  return Math.min(max, Math.max(min, n));
}

function easeInOut(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function easeOutQuint(t) {
  return 1 - Math.pow(1 - t, 5);
}

export default function Projects() {
  const containerRef = useRef(null);

  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    fetch(`${API}/projects`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setCases(data.data);
        } else {
          setError(true);
        }
      })
      .catch((err) => {
        console.error("Failed to load projects:", err);
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let raf = 0;

    const update = () => {
      const el = containerRef.current;

      if (!el) return;

      const rect = el.getBoundingClientRect();

      const vh = window.innerHeight;

      const scrollable = el.offsetHeight - vh;

      const scrolled = clamp(-rect.top, 0, scrollable);

      setProgress(scrollable > 0 ? scrolled / scrollable : 0);
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);

      raf = requestAnimationFrame(update);
    };

    update();

    window.addEventListener("scroll", onScroll, { passive: true });

    window.addEventListener("resize", onScroll);

    return () => {
      cancelAnimationFrame(raf);

      window.removeEventListener("scroll", onScroll);

      window.removeEventListener("resize", onScroll);
    };
  }, []);

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

  if (cases.length === 0) {
    return <section className="pj-loading">No projects to show yet.</section>;
  }

  const total = cases.length;

  const OVERLAP = 0.35;

  const HOLD = 0.75;

  const stride = 1 + HOLD;

  const scaled = progress * total * stride;

  const metrics = cases.map((_, idx) => {
    const local = scaled - idx * stride;

    if (local <= 0) {
      const raw = clamp((local + 1) / (1 - OVERLAP), 0, 1);

      const t = easeInOut(raw);

      const o = easeOutQuint(raw);

      return {
        translateY: `${(1 - t) * 60}%`,
        scale: 0.92 + t * 0.08,
        opacity: o,
        local,
      };
    }

    if (local <= HOLD) {
      return {
        translateY: "0%",
        scale: 1,
        opacity: 1,
        local,
      };
    }

    const raw = clamp((local - HOLD) / (1 - OVERLAP), 0, 1);

    const t = easeInOut(raw);

    const o = easeOutQuint(raw);

    return {
      translateY: `${-t * 18}%`,
      scale: 1 - t * 0.09,
      opacity: 1 - o,
      local,
    };
  });

  return (
    <section
      id="cases"
      ref={containerRef}
      className="pj-root"
      style={{
        height: `${(total * stride + 1) * 100}dvh`,
      }}
    >
      <div className="pj-sticky">
        {cases.map((item, idx) => {
          const { translateY, scale, opacity, local } = metrics[idx];

          // Only the card that's visually dominant should be clickable.
          // Every card is position:absolute/inset:0 and stacked in the
          // same box, so without this, faded-out neighboring cards sit
          // on top (by z-index) and swallow clicks meant for the
          // active card's "View Project" link underneath them.
          const isInteractive = opacity > 0.6;

          return (
            <article
              key={item._id}
              className="pj-card"  style={{
                transform: `translate3d(0,${translateY},0) scale(${scale})`,
                opacity,
                zIndex: 10 + idx,
                filter:
                  local > 0 ? `blur(${(local * 4).toFixed(2)}px)` : "none",
                pointerEvents: isInteractive ? "auto" : "none",
              }}
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
          );
        })}
      </div>

    </section>



  );
}
