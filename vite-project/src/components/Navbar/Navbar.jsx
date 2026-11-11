
import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

const sectionLinks = [
  { name: "Projects", id: "cases" },
  { name: "Skills", id: "skills" },
  { name: "Testimonials", id: "testimonials" },
  { name: "About", id: "about" },
];

const pageLinks = [
  { name: "Our Team", path: "/team" },
  { name: "Contact Us", path: "/contact" },
];

const SCROLL_RANGE = 140;

export default function Navbar() {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const isPagesActive = pageLinks.some(
    (page) => location.pathname === page.path
  );

  const [menuOpen, setMenuOpen] = useState(false);
  const [pagesOpen, setPagesOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  const sectionPositions = useRef([]);
  const dropdownRef = useRef(null);
  const navRef = useRef(null);

  const calculateSections = () => {
    sectionPositions.current = sectionLinks
      .map((link) => {
        const el = document.getElementById(link.id);

        return el
          ? {
              id: link.id,
              top: el.getBoundingClientRect().top + window.scrollY,
            }
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

      navRef.current?.style.setProperty(
        "--scroll-progress",
        progress.toFixed(3)
      );

      if (!isHome) return;

      const scrollPos = y + 150;
      let current = sectionLinks[0]?.id ?? "";

      for (const section of sectionPositions.current) {
        if (section.top <= scrollPos) {
          current = section.id;
        }
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

  // Close dropdown when clicking outside.
  useEffect(() => {
    const onDown = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setPagesOpen(false);
      }
    };

    document.addEventListener("mousedown", onDown);

    return () => {
      document.removeEventListener("mousedown", onDown);
    };
  }, []);

  // Lock page scrolling while mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";

    if (!menuOpen) return;

    const onKey = (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
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
    setPagesOpen(false);
  }, [location.pathname, location.hash]);

  const closeMenus = () => {
    setMenuOpen(false);
    setPagesOpen(false);
  };

  return (
    <nav
      ref={navRef}
      className={`nb${menuOpen ? " is-open" : ""}`}
    >
      <div className="nb-inner">
        <Link
          to="/"
          className="nb-logo"
          onClick={closeMenus}
          aria-label="GH Studios home"
        >
          <img src="/GHStudios-logo-preview.png" alt="GH Studios" />
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
        <ul className="nb-links">
          {sectionLinks.map((link, index) => (
            <li key={link.id} style={{ "--i": index }}>
              <Link
                to={`/#${link.id}`}
                className={`nb-link${
                  isHome && activeSection === link.id ? " is-active" : ""
                }`}
                onClick={closeMenus}
              >
                <span className="nb-link-text">
                  <span className="nb-num">0{index + 1}</span>
                  {link.name}
                </span>
              </Link>
            </li>
          ))}

          <li
            className="nb-dd"
            ref={dropdownRef}
            style={{ "--i": sectionLinks.length }}
          >
            <button
              type="button"
              className={`nb-link nb-dd-trigger${
                isPagesActive ? " is-active" : ""
              }`}
              onClick={() => setPagesOpen((open) => !open)}
              aria-expanded={pagesOpen}
            >
              Connect

              <span
                className={`nb-caret${pagesOpen ? " is-open" : ""}`}
                aria-hidden="true"
              />
            </button>

            <ul className={`nb-dd-menu${pagesOpen ? " is-open" : ""}`}>
              {pageLinks.map((page, index) => (
                <li
                  key={page.path}
                  style={{ "--i": sectionLinks.length + index }}
                >
                  <Link
                    to={page.path}
                    className={`nb-link${
                      location.pathname === page.path ? " is-active" : ""
                    }`}
                    onClick={closeMenus}
                  >
                    <span className="nb-link-text">
                      <span className="nb-num">
                        0{sectionLinks.length + 1 + index}
                      </span>
                      {page.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        </ul>

        <div className="nb-cta">
          <Link
            to="/contact"
            className="nb-btn nb-btn-solid"
            onClick={closeMenus}
          >
            Build Your First Project
            <span className="nb-btn-arrow" aria-hidden="true">
              ↗
            </span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
