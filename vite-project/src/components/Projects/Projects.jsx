import { useEffect, useMemo, useRef, useState } from "react";
import ProjectFAQ from "../ProjectFAQ/ProjectFAQ";
import ProjectCard from './ProjectCard';  
import { clamp, easeInOut, easeOutQuint } from "../../utils/animation";
import "./Projects.css";

const API = import.meta.env.VITE_API_URL || "/api";

const OVERLAP = 0.35;
const HOLD = 0.5;
const STRIDE = 1 + HOLD;

export default function Projects({ projects = [] }) {
  const containerRef = useRef(null);
  const cardRefs = useRef([]);
  const faqPanelRefs = useRef({});
  const handleFaqPanelRef = (id, node) => {
    faqPanelRefs.current[id] = node;
  };

  const cases = projects;

  // FAQ accordion state — which card's FAQ panel is open, and which
  // question inside that panel is expanded. Kept separate from the
  // scroll-driven DOM writes below, since it's plain React state that
  // only changes on click, not on every scroll frame.
  const [openFaqId, setOpenFaqId] = useState(null);
  const [activeQuestion, setActiveQuestion] = useState({});

  const total = useMemo(() => cases.length, [cases]);

  const toggleFaqPanel = (id) => {
    setOpenFaqId((prev) => {
      const next = prev === id ? null : id;
      if (next) {
        // Wait for the max-height transition (450ms in Projects.css)
        // to settle before scrolling, so we scroll to the panel's
        // actual expanded position rather than its collapsed one.
        // block: "nearest" scrolls the nearest scrollable ancestor —
        // .pj-content's own overflow-y: auto — not the page/window,
        // since the scroll-jacked animation owns window scroll.
        setTimeout(() => {
          faqPanelRefs.current[next]?.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
          });
        }, 460);
      }
      return next;
    });
  };

  const toggleQuestion = (id, qIdx) => {
    setActiveQuestion((prev) => ({
      ...prev,
      [id]: prev[id] === qIdx ? null : qIdx,
    }));
  };

  // Applies transform/opacity/filter/pointer-events directly to each
  // card's DOM node, bypassing React re-render entirely. Calling
  // setState on every scroll frame (the old approach) forced a full
  // React reconciliation of every card, every frame — that render cost
  // is what was actually showing up as the 'message handler' /
  // forced-reflow violations, not the math itself. Direct DOM writes
  // keep this at a steady 60fps regardless of how many cards there are.
  //
  // Windowing: a card's resting style stops changing once it's more
  // than one stride away from the current scroll position — it's
  // already sitting at its fully-settled off-screen values and nothing
  // further will change until scroll comes back near it. Recomputing
  // and rewriting styles for every card, every frame, regardless of
  // distance, made the per-frame cost grow with total project count
  // instead of staying constant — that's what was causing the scroll
  // hang. Only cards within ACTIVE_MARGIN of the current position are
  // touched each frame; everything else is left alone.
  const ACTIVE_MARGIN = STRIDE * 1.5;

  const applyMetrics = (progress, force = false) => {
    const scaled = progress * total * STRIDE;

    for (let idx = 0; idx < total; idx++) {
      const distance = Math.abs(scaled - idx * STRIDE);
      if (!force && distance > ACTIVE_MARGIN) continue;

      const el = cardRefs.current[idx];

      if (!el) continue;

      const local = scaled - idx * STRIDE;
      let translateY, scale, opacity, blurPx;

      if (local <= 0) {
        const raw = clamp((local + 1) / (1 - OVERLAP), 0, 1);
        const t = easeInOut(raw);
        const o = easeOutQuint(raw);
        translateY = `${(1 - t) * 60}%`;
        scale = 0.92 + t * 0.08;
        opacity = o;
        blurPx = (1 - raw) * 4;
      } else if (local <= HOLD) {
        translateY = "0%";
        scale = 1;
        opacity = 1;
        blurPx = 0;
      } else {
        const raw = clamp((local - HOLD) / (1 - OVERLAP), 0, 1);
        const t = easeInOut(raw);
        const o = easeOutQuint(raw);
        translateY = `${-t * 18}%`;
        scale = 1 - t * 0.09;
        opacity = 1 - o;
        // Bug fix: this used to be `local * 4` — since `local` grows
        // unbounded the further you scroll past a card, blur radius
        // kept climbing indefinitely (40px, 80px, more) on cards that
        // were already invisible. Large-radius blur is extremely
        // expensive to paint, and doing it every scroll frame on full
        // project images was a real contributor to the scroll hang.
        // Clamped to the same 0..1 transition window as opacity/scale
        // instead, so blur maxes out at a cheap 4px and never grows
        // past that no matter how far you keep scrolling.
        blurPx = raw * 4;
      }

      el.style.transform = `translate3d(0,${translateY},0) scale(${scale})`;
      el.style.opacity = opacity;
      // Skip the filter entirely once basically invisible — one less
      // thing for the browser to paint per frame for offscreen cards.
      el.style.filter =
        opacity > 0.02 && blurPx > 0.05
          ? `blur(${blurPx.toFixed(2)}px)`
          : "none";
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

    // Force a full pass on mount so every card (not just ones near the
    // current scroll position) gets its correct resting style set at
    // least once — otherwise cards outside the initial active window
    // would have no inline style at all and briefly render at their
    // unstyled default (fully visible, stacked) until scroll reaches
    // them for the first time.
    (() => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const scrollable = el.offsetHeight - vh;
      const scrolled = clamp(-rect.top, 0, scrollable);
      const progress = scrollable > 0 ? scrolled / scrollable : 0;
      applyMetrics(progress, true);
    })();

    const onResize = () => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const scrollable = el.offsetHeight - vh;
      const scrolled = clamp(-rect.top, 0, scrollable);
      const progress = scrollable > 0 ? scrolled / scrollable : 0;
      applyMetrics(progress, true);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total]);

  if (total === 0) {
    return <section className="pj-loading">No projects to show yet.</section>;
  }

  return (
    <section
      id="cases"
      ref={containerRef}
      className="pj-root"
      style={{
        height: `${(total * STRIDE + 1) * 100}vh`,
      }}
    >
      <div className="pj-sticky">
        <div className="pj-ribbon">
          <p className="pj-eyebrow">
            Recent Work<span className="pj-slash">/</span>Freshly built &amp;
            deployed
          </p>
        </div>

        {cases.map((item, idx) => {
          const hasFaqs = item.faqs?.length > 0;
          const isFaqOpen = openFaqId === item._id;

          return (
            <ProjectCard
              key={item._id}
              item={item}
              idx={idx}
              isFaqOpen={isFaqOpen}
              hasFaqs={hasFaqs}
              activeQuestion={activeQuestion}
              toggleQuestion={toggleQuestion}
              toggleFaqPanel={toggleFaqPanel}
              onFaqPanelRef={handleFaqPanelRef}
              cardRef={(node) => (cardRefs.current[idx] = node)}
            />
          );
        })}
      </div>
    </section>
  );
}
