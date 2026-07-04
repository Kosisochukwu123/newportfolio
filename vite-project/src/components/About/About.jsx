import { useEffect, useState } from "react";
import "./About.css";

// const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const API = import.meta.env.VITE_API_URL || "/api";

export default function About() {
  const [company, setCompany] = useState({
    name: "Your Company",
    aboutBio: [
      "We are a digital product studio focused on building scalable, high-performance web applications.",
      "Our work spans full-stack development, UI/UX design, and backend architecture for modern businesses.",
      "We believe in clean engineering, thoughtful design, and shipping products that solve real problems."
    ],
    yearsExperience: "3+",
    projectsShipped: "24+",
    clientsServed: "10+",
    avatarUrl: "",
  });

  useEffect(() => {
    fetch(`${API}/profile`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          // later we map profile → company
          setCompany(d.data);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section id="about" className="about-section">
      <div className="container">

        <p className="section-label">About Us</p>

        <div className="about-grid">

          {/* TEXT SIDE */}
          <div className="about-text">

            <h2 className="section-title">
              Building digital products that <span className="accent">scale</span>
            </h2>

            {(company.aboutBio || []).map((para, i) => (
              <p key={i}>{para}</p>
            ))}

            <div className="about-stats">

              {[
                {
                  num: company.yearsExperience || "3+",
                  label: "Years Experience",
                },
                {
                  num: company.projectsShipped || "20+",
                  label: "Projects Delivered",
                },
                {
                  num: company.clientsServed || "10+",
                  label: "Clients Served",
                },
              ].map((s) => (
                <div className="stat" key={s.label}>
                  <span className="stat-num">{s.num}</span>
                  <span className="stat-label">{s.label}</span>
                </div>
              ))}

            </div>
          </div>

          {/* VISUAL SIDE */}
          <div className="about-card">
            <div className="about-img-wrapper">

              <div className="about-img-placeholder">
                {company.avatarUrl ? (
                  <img src={company.avatarUrl} alt={company.name} />
                ) : (
                  <span>Company Identity</span>
                )}
              </div>

              <div className="about-img-border" />

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}