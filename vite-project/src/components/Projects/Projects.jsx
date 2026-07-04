import { useEffect, useRef, useState } from "react";
import "./Projects.css";

import case1 from "../../assets/hero.png";
import case2 from "../../assets/hero.png";
import case3 from "../../assets/hero.png";
import case4 from "../../assets/hero.png";

const CASES = [
  {
    id: "1",
    year: "2025",
    title: "Real-time analytics platform",
    subtitle: "Enterprise SaaS · 40M events/day",
    description:
      "Rebuilt the data pipeline and dashboard experience from the ground up. Sub-second query latency across 40M daily events with a UI that stays out of the way of the work.",
    tags: ["React", "TypeScript", "ClickHouse", "WebSockets"],
    liveUrl: "#",
    image: case1,
  },
  {
    id: "2",
    year: "2024",
    title: "Editorial commerce storefront",
    subtitle: "DTC brand · +38% conversion",
    description:
      "A headless storefront focused on story-first product pages. Streaming SSR, image-first layouts, and a bespoke cart animation that lifted checkout conversion by 38%.",
    tags: ["Next.js", "Shopify", "GSAP", "Edge"],
    liveUrl: "#",
    image: case2,
  },
  {
    id: "3",
    year: "2024",
    title: "Fintech mobile onboarding",
    subtitle: "Neobank · 12-screen KYC flow",
    description:
      "Rewrote the KYC and onboarding stack to cut drop-off in half. Progressive disclosure, native-feeling motion, and an offline-first architecture that survives bad networks.",
    tags: ["React Native", "Reanimated", "Rust", "gRPC"],
    image: case3,
  },
  {
    id: "4",
    year: "2023",
    title: "Collaborative workspace",
    subtitle: "Productivity · 200k active users",
    description:
      "A real-time collaboration surface with CRDT-backed documents, presence, and a plugin system. Shipped from prototype to public launch in nine months.",
    tags: ["Yjs", "TipTap", "TypeScript", "Postgres"],
    liveUrl: "#",
    image: case4,
  },
];

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
  const [progress, setProgress] = useState(0);
  const [debug, setDebug] = useState(() => {
    if (typeof window === "undefined") return false;
    const params = new URLSearchParams(window.location.search);
    return params.get("debug") === "1";
  });

  useEffect(() => {
    const onKey = (e) => {
      const target = e.target;
      if (target && /^(input|textarea|select)$/i.test(target.tagName)) return;
      if (e.key === "d" || e.key === "D") setDebug((v) => !v);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
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

  const total = CASES.length;
  const OVERLAP = 0.35;
  // HOLD adds a "plateau" per card so the active card stays put long enough
  // for the user to read the copy and click the CTA before the next card
  // starts transitioning in.
  const HOLD = 0.75;
  const stride = 1 + HOLD;
  const scaled = progress * total * stride;

  const metrics = CASES.map((_, idx) => {
    const local = scaled - idx * stride;
    if (local <= 0) {
      // incoming
      const raw = clamp((local + 1) / (1 - OVERLAP), 0, 1);
      const t = easeInOut(raw);
      const o = easeOutQuint(raw);
      return {
        local,
        raw,
        phase: "incoming",
        translateY: `${(1 - t) * 60}%`,
        scale: 0.92 + t * 0.08,
        opacity: o,
      };
    }
    if (local <= HOLD) {
      // plateau — card is fully active, no motion so buttons are clickable
      return {
        local,
        raw: 0,
        phase: "active",
        translateY: "0%",
        scale: 1,
        opacity: 1,
      };
    }
    // leaving
    const raw = clamp((local - HOLD) / (1 - OVERLAP), 0, 1);
    const t = easeInOut(raw);
    const o = easeOutQuint(raw);
    return {
      local,
      raw,
      phase: "leaving",
      translateY: `${-t * 18}%`,
      scale: 1 - t * 0.09,
      opacity: 1 - o,
    };
  });

  return (
    <section
      id="cases"
      ref={containerRef}
      className="pj-root"
      style={{ height: `${(total * stride + 1) * 100}dvh` }}
    >
      <div className="pj-sticky">
        <div className="pj-ribbon">
          <p className="pj-eyebrow">02 · Case Studies</p>
          <p className="pj-eyebrow">
            {String(
              Math.min(total, Math.floor(scaled / stride) + 1)
            ).padStart(2, "0")}
            <span className="pj-slash">/</span>
            {String(total).padStart(2, "0")}
          </p>
        </div>

        <div className="pj-rail">
          {CASES.map((c, i) => {
            const active = Math.round(scaled / stride) === i;
            return (
              <span
                key={c.id}
                className={`pj-rail-tick${active ? " is-active" : ""}`}
              />
            );
          })}
        </div>

        {CASES.map((item, idx) => {
          const { translateY, scale, opacity, local } = metrics[idx];
          return (
            <article
              key={item.id}
              className="pj-card"
              style={{
                transform: `translate3d(0, ${translateY}, 0) scale(${scale})`,
                opacity,
                zIndex: 10 + idx,
                filter: local > 0 ? `blur(${(local * 4).toFixed(2)}px)` : "none",
                pointerEvents: opacity > 0.6 ? "auto" : "none",
              }}
              aria-hidden={Math.round(scaled / stride) !== idx}
            >
              <div className="pj-grid">
                <div className="pj-visual">
                  <img
                    src={item.image}
                    alt={item.title}
                    width={1024}
                    height={1024}
                    loading={idx === 0 ? "eager" : "lazy"}
                  />
                  <div className="pj-visual-fade" />
                  <div className="pj-visual-tag">
                    {String(idx + 1).padStart(2, "0")} — {item.year}
                  </div>
                  {item.liveUrl && (
                    <a
                      href={item.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="pj-visual-cta"
                      aria-label={`Visit ${item.title}`}
                    >
                      Visit site <span aria-hidden="true">↗</span>
                    </a>
                  )}
                </div>

                <div className="pj-content">
                  <p className="pj-subtitle">{item.subtitle}</p>
                  <h3 className="pj-title">{item.title}</h3>
                  <p className="pj-desc">{item.description}</p>

                  <div className="pj-tags">
                    {item.tags.map((t) => (
                      <span key={t} className="pj-tag">
                        {t}
                      </span>
                    ))}
                  </div>

                  {item.liveUrl && (
                    <div className="pj-actions">
                      <a
                        href={item.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="pj-btn pj-btn-primary"
                      >
                        View project <span>↗</span>
                      </a>
                      <a href="#" className="pj-btn pj-btn-ghost">
                        Read case study
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </article>
          );
        })}

        <div
          className="pj-hint"
          style={{ opacity: progress > 0.05 ? 0 : 1 }}
        >
          <div className="pj-hint-inner">
            Scroll
            <span className="pj-hint-bar" />
          </div>
        </div>

        {debug && (
          <DebugOverlay
            progress={progress}
            scaled={scaled}
            overlap={OVERLAP}
            total={total}
            metrics={metrics}
            onClose={() => setDebug(false)}
          />
        )}
      </div>
    </section>
  );
}

function DebugOverlay({ progress, scaled, overlap, total, metrics, onClose }) {
  const clampPct = (v) => `${Math.max(0, Math.min(1, v)) * 100}%`;
  return (
    <div className="pj-debug">
      <div className="pj-debug-head">
        <span>Debug · press D</span>
        <button onClick={onClose}>hide</button>
      </div>
      <div className="pj-debug-stats">
        <span>progress</span><span>{progress.toFixed(4)}</span>
        <span>scaled</span><span>{scaled.toFixed(3)} / {total}</span>
        <span>overlap</span><span>{overlap.toFixed(2)}</span>
      </div>
      <div className="pj-debug-bar">
        <div className="pj-debug-bar-fill" style={{ width: `${progress * 100}%` }} />
      </div>
      <div className="pj-debug-rows">
        {metrics.map((m, i) => {
          const startIn = (i - (1 - overlap)) / total;
          const activeAt = i / total;
          const endOut = (i + (1 - overlap)) / total;
          return (
            <div key={i} className="pj-debug-row">
              <span className="pj-debug-idx">{String(i + 1).padStart(2, "0")}</span>
              <div className="pj-debug-track">
                <span className="pj-debug-in" style={{ left: clampPct(startIn), width: `calc(${clampPct(activeAt)} - ${clampPct(startIn)})` }} />
                <span className="pj-debug-out" style={{ left: clampPct(activeAt), width: `calc(${clampPct(endOut)} - ${clampPct(activeAt)})` }} />
                <span className="pj-debug-tick" style={{ left: clampPct(activeAt) }} />
                <span className="pj-debug-head-mark" style={{ left: clampPct(progress) }} />
              </div>
              <span className="pj-debug-op">{m.opacity.toFixed(2)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}