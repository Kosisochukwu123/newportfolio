import "./Contact.css";

export default function Contact() {
  return (
    <section id="contact" className="contact-section">
      <div className="container">
        <p className="section-label">04. Contact</p>
        <div className="contact-inner">
          <div className="contact-text">
            <h2 className="section-title">
              Let's build something <span className="accent">together</span>
            </h2>
            <p>
              Whether you have a project in mind, need a full-stack developer to
              join your team, or just want to talk tech — my inbox is open.
            </p>
            <a
              href="mailto:yourname@email.com"
              className="btn btn-primary contact-btn"
            >
              Say Hello →
            </a>

            <div className="social-links">
              {[
                { label: "GitHub", href: "https://github.com/yourusername" },
                { label: "LinkedIn", href: "https://linkedin.com/in/yourusername" },
                { label: "Twitter / X", href: "https://twitter.com/yourusername" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="social-link"
                >
                  {s.label} ↗
                </a>
              ))}
            </div>
          </div>

          <div className="contact-card">
            <p className="contact-card-label">Current availability</p>
            <div className="availability-badge">
              <span className="pulse-dot" />
              Open to opportunities
            </div>
            <div className="contact-details">
              <div className="contact-detail">
                <span className="detail-key">Email</span>
                <span className="detail-val">yourname@email.com</span>
              </div>
              <div className="contact-detail">
                <span className="detail-key">Location</span>
                <span className="detail-val">Your City, Country</span>
              </div>
              <div className="contact-detail">
                <span className="detail-key">Timezone</span>
                <span className="detail-val">WAT / UTC+1</span>
              </div>
              <div className="contact-detail">
                <span className="detail-key">Response</span>
                <span className="detail-val">Within 24 hours</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
