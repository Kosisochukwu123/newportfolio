import { useEffect, useRef } from "react";
import "./LightTransition.css";

export default function LightTransition({ caption = "entering next chapter" }) {
  const rootRef = useRef(null);

  useEffect(() => {
    const element = rootRef.current;
    if (!element) return;

    let animationFrame = null;
    let ticking = false;

    // Cache measurements
    let elementTop = 0;
    let elementHeight = 0;

    const calculateDimensions = () => {
      const rect = element.getBoundingClientRect();

      elementTop = rect.top + window.scrollY;
      elementHeight = element.offsetHeight;
    };

    const updateProgress = () => {
      ticking = false;

      const viewportHeight = window.innerHeight || 1;
      const scrollY = window.scrollY;

      const scrollable = elementHeight - viewportHeight;

      const distance = scrollY - elementTop;

      const progress =
        scrollable > 0
          ? Math.max(0, Math.min(distance, scrollable)) / scrollable
          : 0;

      element.style.setProperty("--p", progress.toFixed(4));
    };

    const handleScroll = () => {
      if (ticking) return;

      ticking = true;

      animationFrame = requestAnimationFrame(updateProgress);
    };

    const handleResize = () => {
      calculateDimensions();
      updateProgress();
    };

    // Initial measurement
    calculateDimensions();
    updateProgress();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    window.addEventListener("resize", handleResize);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }

      window.removeEventListener("scroll", handleScroll);

      window.removeEventListener("resize", handleResize);
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
