import { useEffect, useRef } from "react";
import "./LightTransition.css";
/**
 * Scroll-driven dark → light bridge.
 *
 * Drop between a dark section (e.g. <Projects />) and a light section
 * (e.g. <About />). Motion is driven by a single CSS variable (--p)
 * updated on scroll via rAF — no infinite CSS animations, no filter:blur
 * repaints every frame, so it stays smooth on low-end machines.
 */
export default function LightTransition({ caption = "entering next chapter" }) {
  const rootRef = useRef(null);
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    let raf = 0;
    let ticking = false;
    const update = () => {
      ticking = false;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const runway = el.offsetHeight - vh;
      const scrolled = Math.min(Math.max(-rect.top, 0), runway);
      const p = runway > 0 ? scrolled / runway : 0;
      el.style.setProperty("--p", p.toFixed(4));
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
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
  return (
    <section ref={rootRef} className="lt-root" aria-hidden="true">
      <div className="lt-sticky">
        <div className="lt-streaks">
          <span className="lt-streak s1" />
          <span className="lt-streak s2" />
          <span className="lt-streak s3" />
          <span className="lt-streak s4" />
        </div>
        <div className="lt-halo" />
        <div className="lt-orb" />
        <p className="lt-caption">
          <span>{caption}</span>
        </p>
        <div className="lt-wash" />
      </div>
    </section>
  );
}