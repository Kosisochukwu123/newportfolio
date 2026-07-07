import { useEffect, useRef, useState } from "react";
import "./About.css";

// const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const API = import.meta.env.VITE_API_URL || "/api";

const DEFAULT_CAPABILITIES = [
  "Web Development",
  "UI/UX Design",
  "Backend Systems",
  "Cyber Security",
  "Videography & Motion",
];

export default function About() {
  const [company, setCompany] = useState({
    name: "Your Company",
    aboutBio: [
      "We are a digital product studio focused on building scalable, high-performance web applications.",
      "Our work spans full-stack development, UI/UX design, and backend architecture for modern businesses.",
      "We believe in clean engineering, thoughtful design, and shipping products that solve real problems.",
    ],
    yearsExperience: "3+",
    projectsShipped: "24+",
    clientsServed: "10+",
    avatarUrl: "",
    services: DEFAULT_CAPABILITIES,
  });

  const textRef = useRef(null);
  const cardRef = useRef(null);

  useEffect(() => {
    fetch(`${API}/profile`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setCompany((c) => ({ ...c, ...d.data }));
      })
      .catch(() => {});
  }, []);

  // Scroll-reveal via IntersectionObserver — cheap, no scroll listener
  // (matches the approach used in Testimonials.jsx).
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("in-view");
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -60px 0px" }
    );

    if (textRef.current) observer.observe(textRef.current);
    if (cardRef.current) observer.observe(cardRef.current);

    return () => observer.disconnect();
  }, []);

  const capabilities = company.services?.length ? company.services : DEFAULT_CAPABILITIES;

  return (
    <section id="about" className="about-section">
      <div className="container">
        <p className="section-label">07. About Us</p>

        <div className="about-grid">
          {/* TEXT SIDE */}
          <div className="about-text reveal" ref={textRef}>
            <h2 className="section-title">
              Building digital products that <span className="accent">scale</span>
            </h2>

            {(company.aboutBio || []).map((para, i) => (
              <p key={i}>{para}</p>
            ))}

            <div className="about-capabilities">
              {capabilities.map((cap) => (
                <span className="capability-pill" key={cap}>
                  {cap}
                </span>
              ))}
            </div>

            <div className="about-stats">
              {[
                { num: company.yearsExperience || "3+", label: "Years Experience" },
                { num: company.projectsShipped || "20+", label: "Projects Delivered" },
                { num: company.clientsServed || "10+", label: "Clients Served" },
              ].map((s) => (
                <div className="stat" key={s.label}>
                  <span className="stat-num">{s.num}</span>
                  <span className="stat-label">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* VISUAL SIDE */}
          <div className="about-card reveal" ref={cardRef}>
            <div className="about-img-wrapper">
              <div className="about-img-dots" aria-hidden="true" />
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