import { useEffect, useRef, useState } from "react";
import ProjectFAQ from "../ProjectFAQ/ProjectFAQ";
import ProjectInfo from "./ProjectInfo";
import { clamp } from "../../utils/animation";
import "./Projects.css"; // keep for now: ProjectFAQ's styles probably live here
import "./ProjectsStack.css";
import ProjectsIntro from "./ProjectsIntro"; // NEW: teddy + big header that opens the section
import "./ProjectsIntro.css";

// Each block holds still for the first and last part of its scroll and
// travels in the middle. Phones get a much shorter hold, so there is little
// dead scrolling before the next block starts moving.
const HOLD_EDGE = 0.18; // laptop: 18% at each end
const HOLD_EDGE_MOBILE = 0.05; // phones: 5%
const FOLLOW = 0.14; // 0..1, lower = floatier

const smooth = (t) => t * t * (3 - 2 * t);

// p runs 0..total-1 linearly with scroll. This returns the same range with
// a pause on every whole number.
const withHold = (p, total, edge) => {
  const i = Math.min(Math.floor(p), total - 1);
  return i + smooth(clamp((p - i - edge) / (1 - edge * 2), 0, 1));
};

export default function Projects({ projects = [] }) {
  const total = projects.length;

  const rootRef = useRef(null);
  const stageRef = useRef(null);
  // cardRefs[0] is the intro block, cardRefs[1..total] are the projects
  const cardRefs = useRef([]);
  const activeIdx = useRef(0);

  const [openFaqId, setOpenFaqId] = useState(null);
  // Which project the drawer shows. Stays set after closing, so the content
  // doesn't vanish while the drawer slides out.
  const [shownFaqId, setShownFaqId] = useState(null);
  const [activeQuestion, setActiveQuestion] = useState({});

  const toggleQuestion = (id, qIdx) =>
    setActiveQuestion((prev) => ({
      ...prev,
      [id]: prev[id] === qIdx ? null : qIdx,
    }));

  const openFaq = (id) => {
    setShownFaqId(id);
    setOpenFaqId(id);
  };

  useEffect(() => {
    if (!openFaqId) return;
    const onKey = (e) => e.key === "Escape" && setOpenFaqId(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openFaqId]);

  // The intro (teddy + headline) starts playing when it scrolls into view,
  // and resets when you leave, so it plays again next time.
  useEffect(() => {
    const el = cardRefs.current[0];
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => el.classList.toggle("is-in", entry.isIntersecting),
      { threshold: 0.12 }, // plays as soon as the top of the block is on screen
    );
    io.observe(el);
    return () => io.disconnect();
  }, [total]);

  // Scroll-driven animation. Everything below writes straight to the DOM
  // (no setState per frame), so React never re-renders while scrolling.
  useEffect(() => {
    if (!total) return;

    // the intro counts as the first slide, then one slide per project
    const slides = total + 1;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let target = 0;
    let current = 0;
    let raf = 0;
    let running = false;

    // The stage pins `stickyTop` px from the top of the screen, so progress
    // starts when the root reaches that offset.
    let stickyTop = 0;
    // How far (px) a waiting card sits below its resting spot: enough that
    // its top edge, shadow included, is past the bottom of the screen. Every
    // card therefore rises from the true bottom edge.
    let startOffset = 0;
    let edge = HOLD_EDGE;
    const measure = () => {
      const stage = stageRef.current;
      if (!stage) return;
      edge = window.matchMedia("(max-width: 760px)").matches
        ? HOLD_EDGE_MOBILE
        : HOLD_EDGE;
      stickyTop = parseFloat(getComputedStyle(stage).top) || 0;
      startOffset = window.innerHeight - stickyTop + 80;
    };

    const readTarget = () => {
      const root = rootRef.current;
      const stage = stageRef.current;
      if (!root || !stage) return 0;
      const scrollable = root.offsetHeight - stage.offsetHeight;
      const scrolled = clamp(
        stickyTop - root.getBoundingClientRect().top,
        0,
        scrollable,
      );
      return scrollable > 0 ? (scrolled / scrollable) * (slides - 1) : 0;
    };

    const paint = (p, force) => {
      // Reduced motion: no travel, cards just switch at each step.
      const pe = reduce ? Math.round(p) : withHold(p, slides, edge);

      for (let k = 0; k < slides; k++) {
        // Cards far from the current position are already at their resting
        // values, so skip them. `force` does a full pass.
        if (!force && Math.abs(pe - k) > 1.6) continue;

        const card = cardRefs.current[k];
        if (!card) continue;

        // How far this card has risen: 0 = waiting below, 1 = in place.
        const enter = k === 0 ? 1 : clamp(pe - (k - 1), 0, 1);

        // Each card is one solid block (image + text on black). The next
        // block rises over the whole thing and the one underneath stays
        // still, so it is covered text first, then image. No fading.
        card.style.transform = `translate3d(0,${(1 - enter) * startOffset}px,0)`;
        // Hidden until it starts moving, so waiting cards never show below the frame.
        card.style.visibility = k === 0 || enter > 0.001 ? "visible" : "hidden";
        card.inert = Math.round(pe) !== k; // no tabbing into covered cards
      }

      const active = Math.round(pe);
      // Close the FAQ drawer if the visible project changes underneath it.
      if (active !== activeIdx.current) {
        activeIdx.current = active;
        setOpenFaqId(null);
      }
    };

    const tick = () => {
      const prev = current;
      current += (target - current) * FOLLOW;
      if (Math.abs(target - current) < 0.001) current = target;
      // Big jumps (anchor links, scrollbar drags) need a full pass so the
      // cards we skip over don't keep stale styles.
      paint(current, Math.abs(current - prev) > 0.8);
      if (current !== target) raf = requestAnimationFrame(tick);
      else running = false;
    };

    const onScroll = () => {
      target = readTarget();
      if (reduce) {
        current = target;
        paint(current, true);
        return;
      }
      if (!running) {
        running = true;
        raf = requestAnimationFrame(tick);
      }
    };

    const onResize = () => {
      measure();
      target = current = readTarget();
      paint(current, true);
    };

    measure();
    target = current = readTarget();
    paint(current, true);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [total]);

  if (total === 0) {
    return <section className="pj-loading">No projects to show yet.</section>;
  }

  const faqItem = projects.find((p) => p._id === shownFaqId);

  return (
    <section
      id="cases"
      ref={rootRef}
      className="ps-root"
      style={{ "--ps-count": total + 1 }}
    >
      <div ref={stageRef} className="ps-stage">
        {/* NEW: big header block, the first thing in the stack */}
        <ProjectsIntro cardRef={(n) => (cardRefs.current[0] = n)} />

        {projects.map((item, idx) => (
          <article
            key={item._id}
            ref={(n) => (cardRefs.current[idx + 1] = n)}
            className="ps-card"
            style={{ zIndex: idx + 2 }}
          >
            <div className="ps-visual">
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  loading={idx < 2 ? "eager" : "lazy"}
                  decoding="async"
                />
              ) : (
                <div className="ps-empty" aria-hidden="true" />
              )}
            </div>

            <div className="ps-info">
              <ProjectInfo
                className="qq"
                item={item}
                hasFaqs={item.faqs?.length > 0}
                isFaqOpen={openFaqId === item._id}
                onOpenFaq={() => openFaq(item._id)}
              />
            </div>
          </article>
        ))}

        {/* FAQ lives in its own drawer, so nothing scrolls inside the
            pinned stage and window scroll stays in charge. */}
        <aside
          className={`ps-drawer${openFaqId ? " is-open" : ""}`}
          aria-hidden={!openFaqId}
          inert={!openFaqId}
          role="dialog"
          aria-label={
            faqItem ? `${faqItem.title} case details` : "Case details"
          }
        >
          <header className="ps-drawer-head">
            <p>{faqItem?.title}</p>
            <button
              type="button"
              onClick={() => setOpenFaqId(null)}
              aria-label="Close case details"
            >
              Close
            </button>
          </header>
          <div className="ps-drawer-body">
            {faqItem && (
              <ProjectFAQ
                item={faqItem}
                hasFaqs={faqItem.faqs?.length > 0}
                isFaqOpen
                activeQuestion={activeQuestion}
                toggleQuestion={toggleQuestion}
                onFaqPanelRef={() => {}}
              />
            )}
          </div>
        </aside>
      </div>
    </section>
  );
}