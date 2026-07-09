import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getLenis } from "../utils/smoothScroll";

export default function AdvancedScrollRestoration() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Don't interfere with hash scrolling
    if (window.location.hash) return;

    const lenis = getLenis();

    if (lenis) {
      lenis.scrollTo(0, {
        immediate: true,
      });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
}