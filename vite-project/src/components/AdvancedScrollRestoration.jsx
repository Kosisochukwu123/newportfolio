// src/components/AdvancedScrollRestoration.jsx
import { useEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

export default function AdvancedScrollRestoration() {
  const { pathname, key } = useLocation();
  const navigationType = useNavigationType();
  const scrollPositions = useRef({});

  useEffect(() => {
    // Save current scroll position before leaving
    const saveCurrentPosition = () => {
      scrollPositions.current[key] = window.scrollY;
    };

    // Restore or reset scroll position
    const handleScrollRestoration = () => {
      // If hash exists, scroll to element
      const hash = window.location.hash;
      if (hash) {
        const element = document.getElementById(hash.replace("#", ""));
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
          return;
        }
      }

      // If going back/forward, restore position
      if (navigationType === "POP") {
        const savedPosition = scrollPositions.current[key];
        if (savedPosition !== undefined) {
          window.scrollTo({
            top: savedPosition,
            behavior: "auto",
          });
          return;
        }
      }

      // New navigation: scroll to top
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    };

    // Save before unload
    window.addEventListener("beforeunload", saveCurrentPosition);
    
    // Execute scroll restoration
    handleScrollRestoration();

    return () => {
      window.removeEventListener("beforeunload", saveCurrentPosition);
      saveCurrentPosition();
    };
  }, [pathname, key, navigationType]);

  return null;
}