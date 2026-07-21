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
  { name: "Team", path: "/team" },
  { name: "Contact", path: "/contact" },
];

const SCROLL_RANGE = 140;

export default function Navbar({ profile = {} }) {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const isPagesActive = pageLinks.some((p) => location.pathname === p.path);

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [pagesOpen, setPagesOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  const sectionPositions = useRef([]);

  const calculateSections = () => {
    sectionPositions.current = sectionLinks
      .map((link) => {
        const el = document.getElementById(link.id);

        return el
          ? {
              id: link.id,
              top: el.offsetTop,
            }
          : null;
      })
      .filter(Boolean);
  };

  useEffect(() => {
    calculateSections();

    window.addEventListener("resize", calculateSections);

    return () => window.removeEventListener("resize", calculateSections);
  }, [isHome]);

  const dropdownRef = useRef(null);
  const navRef = useRef(null);

  useEffect(() => {
    let raf = 0;

    const compute = () => {
      const y = window.scrollY;
      setScrolled(y > 50);

      const progress = Math.min(1, y / SCROLL_RANGE);
      if (navRef.current) {
        navRef.current.style.setProperty(
          "--scroll-progress",
          progress.toFixed(3),
        );
      }

      if (!isHome) return;

      const NAV_OFFSET = 150;
      const scrollPos = y + NAV_OFFSET;

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
          <Link
            to="/"
            className="na
          v-logo"
            onClick={closeMenus}
          >
            <div className="logo-box">
              <img
                src="/GHStudios-logo-preview.png"
                alt="GH Studios Logo"
                className="logo-img"
              />
            </div>
            <span className="logo-name" />
          </Link>

          {/* Navigation Links */}
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

            {/* Pages Dropdown */}
            <li className="nav-dropdown" ref={dropdownRef}>
              <button
                type="button"
                className={`nav-dropdown-trigger ${isPagesActive ? "active" : ""}`}
                onClick={() => setPagesOpen((o) => !o)}
              >
                <span className="nav-num">0{sectionLinks.length + 1}.</span>
                Connect
                <span className={`nav-caret ${pagesOpen ? "open" : ""}`}>
                  ▾
                </span>
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

            {/* Download Resume Button */}
            <li>
              <Link
                to="/resume"
                className="btn btn-primary nav-resume-btn"
                onClick={closeMenus}
              >
                Download Resume
              </Link>
            </li>

            {/* Contact CTA */}
            <li>
              <Link
                to="/contact"
                className="btn btn-primary nav-cta"
                onClick={closeMenus}
              >
                Let's Talk
              </Link>
            </li>
          </ul>

          {/* Hamburger Menu */}
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
