import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

// In-page scroll sections — these only exist on the homepage ("/")
const sectionLinks = [
  { name: "Projects", id: "cases" },
  { name: "Skills", id: "skills" },
  { name: "About", id: "about" },
];

export default function Navbar({ profile = {} }) {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const isContactPage = location.pathname === "/contact";

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      // Scroll-spy only makes sense on the homepage, where the
      // sections actually exist in the DOM.
      if (!isHome) return;

      const sections = sectionLinks.map((l) => document.getElementById(l.id));

      sections.forEach((section) => {
        if (!section) return;

        const top = section.offsetTop - 150;
        const height = section.offsetHeight;

        if (window.scrollY >= top && window.scrollY < top + height) {
          setActiveSection(section.id);
        }
      });
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);

  return (
    <>
      <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
        <div className="navbar-inner">
          {/* Logo */}
          <Link to="/" className="nav-logo">
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
                  onClick={() => setMenuOpen(false)}
                >
                  <span className="nav-num">0{i + 1}.</span>
                  {l.name}
                </Link>
              </li>
            ))}

            <li>
              <Link
                to="/team"
                className={location.pathname === "/team" ? "active" : ""}
                onClick={() => setMenuOpen(false)}
              >
                <span className="nav-num">0{sectionLinks.length + 1}.</span>
                Team
              </Link>
            </li>

            <li>
              <Link
                to="/contact"
                className={isContactPage ? "active" : ""}
                onClick={() => setMenuOpen(false)}
              >
                <span className="nav-num">0{sectionLinks.length + 2}.</span>
                Contact
              </Link>
            </li>

            <li>
              <Link
                to="/contact"
                className="btn btn-primary nav-cta"
                onClick={() => setMenuOpen(false)}
              >
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

      {menuOpen && (
        <div className="menu-overlay" onClick={() => setMenuOpen(false)} />
      )}
    </>
  );
}