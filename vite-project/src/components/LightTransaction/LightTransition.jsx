import { useEffect, useRef } from "react";
import "./LightTransition.css";

export default function LightTransition({ caption = "entering next chapter" }) {
  const rootRef = useRef(null);

  useEffect(() => {
    const element = rootRef.current;
    if (!element) return;

    let animationFrame = null;
    let ticking = false;

    const updateProgress = () => {
      ticking = false;

      const { top, height } = element.getBoundingClientRect();
      const viewportHeight = window.innerHeight || 1;

      const scrollable = height - viewportHeight;

      const progress =
        scrollable > 0
          ? Math.max(0, Math.min(-top, scrollable)) / scrollable
          : 0;

      element.style.setProperty("--p", progress.toFixed(4));
    };

    const handleScroll = () => {
      if (ticking) return;

      ticking = true;

      animationFrame = requestAnimationFrame(updateProgress);
    };

    updateProgress();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    window.addEventListener("resize", handleScroll);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }

      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
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
