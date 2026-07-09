import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

// In-page scroll sections — these only exist on the homepage ("/")
const sectionLinks = [
  { name: "Projects", id: "cases" },
  { name: "Skills", id: "skills" },
  { name: "Testimonials", id: "testimonials" },
  { name: "About", id: "about" },
];

// Separate-page links, grouped under the "Pages" dropdown
const pageLinks = [
  { name: "Team", path: "/team" },
  { name: "Contact", path: "/contact" },
];

// Scroll distance (px) over which the navbar fully transitions from
// transparent/large to glass/compact — this is what makes the effect
// continuous (Apple-style) rather than a single on/off breakpoint.
const SCROLL_RANGE = 140;

export default function Navbar({ profile = {} }) {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const isPagesActive = pageLinks.some((p) => location.pathname === p.path);

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [pagesOpen, setPagesOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  const dropdownRef = useRef(null);
  const navRef = useRef(null);

  useEffect(() => {
    let raf = 0;

    const compute = () => {
      const y = window.scrollY;
      setScrolled(y > 50);

      // Continuous 0..1 progress drives the glass/compact transition
      // smoothly via a CSS variable, instead of an abrupt class swap.
      const progress = Math.min(1, y / SCROLL_RANGE);
      if (navRef.current) {
        navRef.current.style.setProperty("--scroll-progress", progress.toFixed(3));
      }

      // Scroll-spy only makes sense on the homepage, where the
      // sections actually exist in the DOM.
      if (!isHome) return;

      // Gap-free approach: walk the sections in order and keep track
      // of the LAST one whose top we've scrolled past. This avoids the
      // overlapping/gappy fixed-window checks that caused the active
      // link to jump or stick between sections.
      const NAV_OFFSET = 150;
      const scrollPos = y + NAV_OFFSET;

      let current = sectionLinks[0]?.id ?? "";

      for (const link of sectionLinks) {
        const section = document.getElementById(link.id);
        if (section && section.offsetTop <= scrollPos) {
          current = link.id;
        }
      }

      setActiveSection(current);
    };

    // Throttle through rAF so the (layout-reading) work above only
    // ever runs once per paint, no matter how many raw scroll events
    // fire in between — this is what stops the forced-reflow spikes.
    const handleScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(compute);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    compute(); // set correct state immediately, don't wait for first scroll

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isHome]);

  // Close the "Pages" dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setPagesOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const closeMenus = () => {
    setMenuOpen(false);
    setPagesOpen(false);
  };

  return (
    <>
      <nav ref={navRef} className={`navbar ${scrolled ? "scrolled" : ""}`}>
        <div className="navbar-inner">
          {/* Logo */}
          <Link to="/" className="nav-logo" onClick={closeMenus}>
            <div className="logo-box">
              <img
                src="/GHStudios-logo-preview.png"
                alt="GH Studios Logo"
                className="logo-img"
              />
            </div>
            <span className="logo-name" />
          </Link>

          {/* Nav */}
          <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
            {sectionLinks.map((l, i) => (
              <li key={l.name}>
                <Link
                  to={`/#${l.id}`}
                  className={isHome && activeSection === l.id ? "active" : ""}
                  onClick={closeMenus}
                >
                  <span className="nav-num">0{i + 1}.</span>
                  {l.name}
                </Link>
              </li>
            ))}

            {/* Pages dropdown — Team / Contact live on separate routes */}
            <li className="nav-dropdown" ref={dropdownRef}>
              <button
                type="button"
                className={`nav-dropdown-trigger ${isPagesActive ? "active" : ""}`}
                onClick={() => setPagesOpen((o) => !o)}
              >
                <span className="nav-num">0{sectionLinks.length + 1}.</span>
                Pages
                <span className={`nav-caret ${pagesOpen ? "open" : ""}`}>▾</span>
              </button>

              <ul className={`nav-dropdown-menu ${pagesOpen ? "open" : ""}`}>
                {pageLinks.map((p) => (
                  <li key={p.path}>
                    <Link
                      to={p.path}
                      className={location.pathname === p.path ? "active" : ""}
                      onClick={closeMenus}
                    >
                      {p.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>

            <li>
              <Link to="/contact" className="btn btn-primary nav-cta" onClick={closeMenus}>
                Let's Talk
              </Link>
            </li>
          </ul>

          {/* Hamburger */}
          <button
            className={`hamburger ${menuOpen ? "active" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>

      {menuOpen && <div className="menu-overlay" onClick={closeMenus} />}
    </>
  );
}