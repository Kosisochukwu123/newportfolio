import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer({
  company = {
    name: "GH Studios",
    email: "hello@ghstudios.com",
    location: "Switzerland",
  },
}) {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Top */}
        <div className="footer-top">
          <div className="footer-left">
            <p className="footer-label">07. Contact</p>

            <h2 className="footer-heading">
              Let's build something
              <span className="footer-accent"> great.</span>
            </h2>

            <p className="footer-description">
              Looking for web development, cybersecurity solutions,
              backend systems, or digital product design?
              Let's create something users actually remember.
            </p>

            <div className="footer-buttons">
              <Link to="/contact" className="btn btn-primary">
                Start Project
              </Link>
              <a href="mailto:bugs@ghstudios.com" className="btn btn-outline">
                🐞 Report Bug
              </a>
            </div>
          </div>

          {/* right side */}
          <div className="footer-right">
            <div className="footer-block">
              <h4>Navigation</h4>
              <Link to="/#hero">Home</Link>
              <Link to="/#about">About</Link>
              <Link to="/#cases">Projects</Link>
              <Link to="/team">Team</Link>
              <Link to="/contact">Contact</Link>
            </div>

            <div className="footer-block">
              <h4>Services</h4>
              <p>Web Development</p>
              <p>Cyber Security</p>
              <p>Backend Systems</p>
              <p>UI / UX Design</p>
            </div>

            <div className="footer-block">
              <h4>Contact</h4>
              <p>{company.email}</p>
              <p>{company.location}</p>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="footer-newsletter">
          <div>
            <h3>Subscribe to updates</h3>
            <p>Product launches, case studies and development notes.</p>
          </div>

          <form className="newsletter-form">
            <input type="email" placeholder="Email address" />
            <button>→</button>
          </form>
        </div>

        {/* giant branding */}
        <div className="footer-brand">{company.name}</div>

        {/* bottom */}
        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} {company.name}
          </p>

          <div className="footer-socials">
            <a href="#">Github</a>
            <a href="#">LinkedIn</a>
            <a href="#">Instagram</a>
          </div>
        </div>
      </div>
    </footer>
  );
}