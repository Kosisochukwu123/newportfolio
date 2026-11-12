import { useEffect, useLayoutEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";
import { getLenis } from "../utils/smoothScroll";

// where each history entry was scrolled to, so Back/Forward can return there
const positions = new Map();

export default function AdvancedScrollRestoration() {
  const { pathname, hash, key } = useLocation();
  const navType = useNavigationType(); // "PUSH" | "REPLACE" | "POP" (back/forward)

  const keyRef = useRef(key);
  const pathRef = useRef(null);

  // We do the restoring ourselves, so the browser must not also do it.
  useEffect(() => {
    const previous = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    return () => {
      window.history.scrollRestoration = previous;
    };
  }, []);

  // Remember the scroll position of whichever page is showing.
  useEffect(() => {
    keyRef.current = key;
    let raf = 0;
    const save = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => positions.set(keyRef.current, window.scrollY));
    };
    window.addEventListener("scroll", save, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", save);
    };
  }, [key]);

  // Runs before the browser paints, so there is no flash of the old scroll position.
  useLayoutEffect(() => {
    const lenis = getLenis();
    const jump = (y) => {
      if (lenis) lenis.scrollTo(y, { immediate: true, force: true });
      else window.scrollTo(0, y);
    };

    const pathChanged = pathRef.current !== pathname;
    pathRef.current = pathname;

    let timer = 0;

    if (hash) {
      // e.g. /#cases: start from the top of a new page, then glide to the section.
      if (pathChanged) jump(0);
      const id = decodeURIComponent(hash.slice(1));
      let tries = 0;
      const go = () => {
        const el = document.getElementById(id);
        if (el) {
          if (lenis) lenis.scrollTo(el, { duration: 1.1 });
          else el.scrollIntoView({ behavior: "smooth", block: "start" });
          return;
        }
        // the section may not exist yet (data still loading): try again shortly
        if (tries++ < 25) timer = setTimeout(go, 80);
      };
      go();
    } else if (navType === "POP" && positions.has(key)) {
      jump(positions.get(key)); // Back/Forward: return to where you were
    } else if (pathChanged) {
      jump(0); // a new page starts at the top
    }

    return () => clearTimeout(timer);
  }, [pathname, hash, key, navType]);

  return null;
}