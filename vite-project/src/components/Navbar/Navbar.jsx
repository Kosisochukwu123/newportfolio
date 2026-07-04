import { useState, useEffect } from "react";
import "./Navbar.css";

const links = [
  { name: "Projects", id: "cases" },
  { name: "Skills", id: "skills" },
  { name: "About", id: "about" },
  { name: "Contact", id: "contact" },
];

export default function Navbar({ profile = {} }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      const sections = links.map((l) =>
        document.getElementById(l.id)
      );

      sections.forEach((section) => {
        if (!section) return;

        const top = section.offsetTop - 150;
        const height = section.offsetHeight;

        if (
          window.scrollY >= top &&
          window.scrollY < top + height
        ) {
          setActiveSection(section.id);
        }
      });
    };

    window.addEventListener(
      "scroll",
      handleScroll
    );

    return () =>
      window.removeEventListener(
        "scroll",
        handleScroll
      );
  }, []);

  return (
    <>
      <nav
        className={`navbar ${
          scrolled ? "scrolled" : ""
        }`}
      >
        <div className="navbar-inner">

          {/* Logo */}

          <a
            href="#hero"
            className="nav-logo"
          >
            <div className="logo-box">
              ■
            </div>

            <span className="logo-name">
              {profile?.name ||
                "Your Company"}
            </span>
          </a>

          {/* Nav */}

          <ul
            className={`nav-links ${
              menuOpen ? "open" : ""
            }`}
          >
            {links.map((l, i) => (
              <li key={l.name}>
                <a
                  href={`#${l.id}`}
                  className={
                    activeSection === l.id
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setMenuOpen(false)
                  }
                >
                  <span className="nav-num">
                    0{i + 1}.
                  </span>

                  {l.name}
                </a>
              </li>
            ))}

            <li>
              <a
                href="#contact"
                className="btn btn-primary nav-cta"
              >
                Let's Talk
              </a>
            </li>
          </ul>

          {/* Hamburger */}

          <button
            className={`hamburger ${
              menuOpen
                ? "active"
                : ""
            }`}
            onClick={() =>
              setMenuOpen(!menuOpen)
            }
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div
          className="menu-overlay"
          onClick={() =>
            setMenuOpen(false)
          }
        />
      )}
    </>
  );
}