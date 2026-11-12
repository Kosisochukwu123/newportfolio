import { useEffect, useRef } from "react";
import "./LightTransition.css";

// Dark to light, in one pinned screen: a bright horizon rises from the bottom
// like a sunrise, throws rays across the dark, and swallows the screen. The
// text on top flips from white to black as the light passes through it.
//
// light: the colour the screen ends on. Set it to the exact background colour
// of the section that follows, so there is no seam when the screen scrolls away.
export default function LightTransition({
  caption = "entering next chapter",
  title = "",
  light = "#ffffff",
}) {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
    const smooth = (t) => t * t * (3 - 2 * t);

    let target = 0;
    let current = 0;
    let raf = 0;
    let running = false;

    // The light starts rising as soon as this screen peeks into view (when its
    // top edge is 85% of the way down), instead of after it has fully pinned.
    // That removes the long black scroll before anything happens.
    const START = 0.85;

    // measured fresh on every read, so layout shifts above never throw it off
    const read = () => {
      const vh = window.innerHeight;
      const top = root.getBoundingClientRect().top;
      const pinned = Math.max(0, root.offsetHeight - vh); // distance it stays pinned
      const total = vh * START + pinned;
      return total > 0 ? clamp((vh * START - top) / total, 0, 1) : 0;
    };

    // While the screen is still sliding in, the light is lifted by the same
    // amount, so it always rises from the true bottom edge of the window.
    const setLift = () => {
      const top = root.getBoundingClientRect().top;
      root.style.setProperty("--lift", `${Math.max(0, top).toFixed(1)}px`);
    };

    const paint = (p) => {
      // phases: first a glow gathers at the bottom, then the horizon rises,
      // then it holds on full light for a moment before the screen scrolls away
      const e = smooth(clamp((p - 0.03) / 0.87, 0, 1)); // how far the light has risen
      const a = smooth(clamp(p / 0.15, 0, 1)) * (1 - e); // glow before it rises
      const c = 1 - smooth(clamp((p - 0.9) / 0.09, 0, 1)); // text fades out at the very end
      root.style.setProperty("--e", e.toFixed(4));
      root.style.setProperty("--a", a.toFixed(4));
      root.style.setProperty("--c", c.toFixed(4));
    };

    const tick = () => {
      current += (target - current) * 0.14;
      if (Math.abs(target - current) < 0.0004) current = target;
      paint(current);
      if (current !== target) raf = requestAnimationFrame(tick);
      else running = false;
    };

    const onScroll = () => {
      setLift();
      target = read();
      if (!running) {
        running = true;
        raf = requestAnimationFrame(tick);
      }
    };

    if (reduce) {
      // no motion: just show the finished light screen with its text
      root.style.setProperty("--e", "1");
      root.style.setProperty("--a", "0");
      root.style.setProperty("--c", "1");
      return;
    }

    setLift();
    target = current = read();
    paint(current);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section
      ref={rootRef}
      className="lt-root"
      style={{ "--lt-light": light }}
      aria-hidden="true"
    >
      <div className="lt-sticky">
        <div className="lt-horizon" />
        <div className="lt-rays" />
        <div className="lt-halo lt-halo-2" />
        <div className="lt-halo lt-halo-1" />
        <div className="lt-dome" />

        <div className="lt-copy">
          <p className="lt-caption">{caption}</p>
          {title && <p className="lt-title">{title}</p>}
        </div>
      </div>
    </section>
  );
}