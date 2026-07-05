import { useEffect, useState } from "react";
import "./Team.css";

const API = import.meta.env.VITE_API_URL || "/api";

export default function Team() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`${API}/team`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setMembers(d.data);
        else setError(true);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  // Static team data matching the image design
  const staticMembers = [
    { name: "Rachel Gray", role: "CEO", photoUrl: null },
    { name: "Joel Pearson", role: "PROJECT MANAGER", photoUrl: null },
    { name: "Ingrid Vulk", role: "ART DIRECTOR", photoUrl: null },
    { name: "Julie Coleman", role: "UI/UX DESIGNER", photoUrl: null },
    { name: "Harold Nelson", role: "WEB DEVELOPER", photoUrl: null },
    { name: "Raymond Cole", role: "UI DESIGNER", photoUrl: null },
    { name: "Kevin Wels", role: "WEB DEVELOPER", photoUrl: null },
    { name: "Mary Fox", role: "UX DESIGNER", photoUrl: null },
  ];

  const displayMembers = members.length > 0 ? members : staticMembers;

  // Positions list
  const positions = [
    "Marketing Manager",
    "UI Designer",
    "iOS Developer"
  ];

  return (
    <section id="team" className="team-section">
      <div className="container">
        {/* Header with Navigation */}
        <div className="team-header">
          <span className="team-badge">EINAR?</span>
          <nav className="team-nav">
            <a href="#" className="active">Home</a>
            <a href="#">Pages</a>
            <a href="#">Portfolio</a>
            <a href="#">Blog</a>
            <a href="#">Shop</a>
          </nav>
        </div>

        {/* Team Title */}
        <div className="team-title-wrapper">
          <h2 className="team-title">Our Team</h2>
        </div>

        {/* Team Grid */}
        {loading && <p className="team-status">Loading team…</p>}
        {!loading && error && (
          <p className="team-status">Couldn't load the team — please try refreshing.</p>
        )}
        {!loading && !error && members.length === 0 && (
          <div className="team-grid">
            {staticMembers.map((m, idx) => (
              <div className="team-card" key={idx}>
                <div className="team-photo">
                  <div className="team-photo-empty" aria-hidden="true">
                    {m.name?.[0] || "?"}
                  </div>
                </div>
                <h3 className="team-name">{m.name}</h3>
                <p className="team-role">{m.role}</p>
              </div>
            ))}
          </div>
        )}

        {!loading && !error && members.length > 0 && (
          <div className="team-grid">
            {members.map((m) => (
              <div className="team-card" key={m._id}>
                <div className="team-photo">
                  {m.photoUrl ? (
                    <img src={m.photoUrl} alt={m.name} />
                  ) : (
                    <div className="team-photo-empty" aria-hidden="true">
                      {m.name?.[0] || "?"}
                    </div>
                  )}
                </div>
                <h3 className="team-name">{m.name}</h3>
                <p className="team-role">{m.role}</p>
              </div>
            ))}
          </div>
        )}

        {/* Join Our Team Section */}
        <div className="team-join">
          <h3 className="join-title">Join our team, check open positions</h3>
          <a href="#" className="join-button">APPLY →</a>
        </div>

        {/* Positions List */}
        <div className="team-positions">
          {positions.map((pos, idx) => (
            <div key={idx} className="position-item">
              <span className="position-bullet">→</span>
              <span className="position-name">{pos}</span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <footer className="team-footer">
          <div className="footer-top">
            <div className="footer-brand">
              <span className="footer-logo">EINAR</span>
              <p className="footer-subscribe">Subscribe to our Newsletter</p>
            </div>
            <div className="footer-contact">
              <a href="mailto:CONTACT@EXAMPLE.COM" className="footer-email">
                CONTACT@EXAMPLE.COM
              </a>
            </div>
            <div className="footer-social">
              <a href="#" className="social-link">DRISBBLE</a>
              <a href="#" className="social-link">BEHANCE</a>
              <a href="#" className="social-link">INKEDIN</a>
            </div>
          </div>
          <div className="footer-bottom">
            <div className="footer-copyright">
              <span>www.DownloadNewThemes.com</span>
              <span className="footer-separator">•</span>
              <span>EINAR</span>
            </div>
          </div>
        </footer>
      </div>
    </section>
  );
}