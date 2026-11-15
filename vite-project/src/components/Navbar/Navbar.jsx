import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

const sectionLinks = [
  { name: "Projects", id: "cases" },
  { name: "Skills", id: "skills" },
  { name: "Testimonials", id: "testimonials" },
  { name: "About", id: "about" },
];

// Our Team is a regular page link (no dropdown).
const pageLinks = [{ name: "Our Team", path: "/team" }];

const BRAND = "GH Studios";
const SCROLL_RANGE = 140;

export default function Navbar() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  const sectionPositions = useRef([]);
  const navRef = useRef(null);
  const linksRef = useRef(null);

  // ---------- sliding hover pill (laptop) ----------
  // One pill glides to whichever link you point at, and returns to the current
  // page's link when you leave. Positions go straight to CSS variables, so React
  // never re-renders while you move the mouse.
  const moveHighlight = useCallback((li) => {
    const ul = linksRef.current;
    if (!ul) return;
    if (!li) {
      ul.style.setProperty("--hl-o", "0");
      return;
    }
    ul.style.setProperty("--hl-x", `${li.offsetLeft - 12}px`);
    ul.style.setProperty("--hl-w", `${li.offsetWidth + 24}px`);
    ul.style.setProperty("--hl-o", "1");
  }, []);

  const syncHighlight = useCallback(() => {
    const ul = linksRef.current;
    // only the top-level links count (not the ones inside the dropdown)
    const active = ul?.querySelector(":scope > li > .nb-link.is-active");
    moveHighlight(active ? active.parentElement : null);
  }, [moveHighlight]);

  const onLinksOver = (e) => {
    const ul = linksRef.current;
    let li = e.target.closest("li");
    while (li && li.parentElement !== ul) li = li.parentElement?.closest("li") ?? null;
    if (li && !li.classList.contains("nb-hl")) moveHighlight(li);
  };

  // the glare that trails the cursor across the glass
  const onLinksMove = (e) => {
    const ul = linksRef.current;
    if (!ul) return;
    const r = ul.getBoundingClientRect();
    ul.style.setProperty("--mx", `${e.clientX - r.left}px`);
    ul.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  const onLinksBlur = (e) => {
    if (!linksRef.current?.contains(e.relatedTarget)) syncHighlight();
  };

  useEffect(() => {
    syncHighlight();
  }, [activeSection, location.pathname, syncHighlight]);

  useEffect(() => {
    window.addEventListener("resize", syncHighlight);
    document.fonts?.ready.then(syncHighlight); // widths change once the font loads
    return () => window.removeEventListener("resize", syncHighlight);
  }, [syncHighlight]);

  // ---------- section positions + scroll ----------
  const calculateSections = () => {
    sectionPositions.current = sectionLinks
      .map((link) => {
        const el = document.getElementById(link.id);
        return el
          ? { id: link.id, top: el.getBoundingClientRect().top + window.scrollY }
          : null;
      })
      .filter(Boolean);
  };

  useEffect(() => {
    calculateSections();
    window.addEventListener("resize", calculateSections);
    window.addEventListener("load", calculateSections);
    return () => {
      window.removeEventListener("resize", calculateSections);
      window.removeEventListener("load", calculateSections);
    };
  }, [isHome]);

  // Scroll progress and active section tracking.
  useEffect(() => {
    let raf = 0;

    const compute = () => {
      const y = window.scrollY;
      const progress = Math.min(1, y / SCROLL_RANGE);
      navRef.current?.style.setProperty("--scroll-progress", progress.toFixed(3));

      if (!isHome) return;

      const scrollPos = y + 150;
      let current = sectionLinks[0]?.id ?? "";
      for (const section of sectionPositions.current) {
        if (section.top <= scrollPos) current = section.id;
      }
      setActiveSection(current);
    };

    const handleScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(compute);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    compute();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isHome]);

  // Lock page scrolling while mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    if (!menuOpen) return;

    const onKey = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Close menus after navigation.
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname, location.hash]);

  const closeMenus = () => {
    setMenuOpen(false);
  };

  return (
    <nav ref={navRef} className={`nb${menuOpen ? " is-open" : ""}`}>
      <div className="nb-inner">
        <Link to="/" className="nb-logo" onClick={closeMenus} aria-label={`${BRAND} home`}>
          <img src="/GHStudios-logo-preview.png" alt="" />
          <span className="nb-brand">{BRAND}</span>
        </Link>

        <button
          type="button"
          className="nb-toggle"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="nb-panel"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          <span className="nb-toggle-label" aria-hidden="true">
            <span>Menu</span>
            <span>Close</span>
          </span>

          <span className="nb-toggle-lines" aria-hidden="true">
            <i />
            <i />
          </span>
        </button>
      </div>

      <div id="nb-panel" className="nb-panel">
        <ul
          ref={linksRef}
          className="nb-links"
          onMouseOver={onLinksOver}
          onMouseMove={onLinksMove}
          onMouseLeave={syncHighlight}
          onFocus={onLinksOver}
          onBlur={onLinksBlur}
        >
          {/* the sliding pill (decorative, laptop only) */}
          <li className="nb-hl" aria-hidden="true" />

          {sectionLinks.map((link, index) => (
            <li key={link.id} style={{ "--i": index }}>
              <Link
                to={`/#${link.id}`}
                className={`nb-link${isHome && activeSection === link.id ? " is-active" : ""}`}
                onClick={closeMenus}
              >
                <span className="nb-link-text">
                  <span className="nb-num">0{index + 1}</span>
                  {link.name}
                </span>
              </Link>
            </li>
          ))}

          {pageLinks.map((page, index) => (
            <li key={page.path} style={{ "--i": sectionLinks.length + index }}>
              <Link
                to={page.path}
                className={`nb-link${location.pathname === page.path ? " is-active" : ""}`}
                onClick={closeMenus}
              >
                <span className="nb-link-text">
                  <span className="nb-num">0{sectionLinks.length + 1 + index}</span>
                  {page.name}
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="nb-cta">
          <Link to="/contact" className="nb-btn nb-btn-solid" onClick={closeMenus}>
            {/* shorter wording on mid-size laptops, where space is tight */}
            <span className="nb-btn-long">Build Your First Project</span>
            <span className="nb-btn-short">Start a project</span>
            <span className="nb-btn-arrow" aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}