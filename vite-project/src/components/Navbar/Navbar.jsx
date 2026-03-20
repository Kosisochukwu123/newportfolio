import { useState, useEffect } from "react";
import "./Navbar.css";

const links = [ "Projects", "Skills", "About", "Contact"];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="navbar-inner">
        <a href="#" className="nav-logo">
          <span className="logo-bracket">&lt;</span>
          <span className="logo-name">YourName</span>
          <span className="logo-bracket"> /&gt;</span>
        </a>

        <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
          {links.map((l) => (
            <li key={l}>
              <a
                href={`#${l.toLowerCase()}`}
                onClick={() => setMenuOpen(false)}
              >
                <span className="nav-num">0{links.indexOf(l) + 1}.</span> {l}
              </a>
            </li>
          ))}
          <li>
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noreferrer"
              className="btn btn-outline nav-resume"
            >
              Resume
            </a>
          </li>
        </ul>

        <button
          className={`hamburger ${menuOpen ? "active" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </nav>
  );
}
