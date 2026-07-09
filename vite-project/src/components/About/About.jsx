import { useEffect, useRef, useState } from "react";
import "./About.css";

// const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const API = import.meta.env.VITE_API_URL || "/api";

const DEFAULT_CAPABILITIES = [
  "MERN Development",
  "UI/UX Design",
  "AI Integration",
  "Cloud Deployment",
];

const DEFAULT_MILESTONES = [
  { year: "2024", label: "Started GH Studios" },
  { year: "2025", label: "First International Client" },
  { year: "2026", label: "Agency Launch" },
];

export default function About() {
  const [company, setCompany] = useState({
    name: "Your Company",
    aboutBio: [
      "We are a digital product studio focused on building scalable, high-performance web applications.",
    ],
    yearsExperience: "3+",
    projectsShipped: "24+",
    clientsServed: "10+",
    avatarUrl: "",
    services: DEFAULT_CAPABILITIES,
    milestones: DEFAULT_MILESTONES,
  });

  const textRef = useRef(null);
  const cardRef = useRef(null);
  const timelineRefs = useRef([]);

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
      { threshold: 0.2, rootMargin: "0px 0px -60px 0px" },
    );

    if (textRef.current) observer.observe(textRef.current);
    if (cardRef.current) observer.observe(cardRef.current);
    timelineRefs.current.forEach((el) => el && observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const capabilities = company.services?.length
    ? company.services
    : DEFAULT_CAPABILITIES;
  const milestones = company.milestones?.length
    ? company.milestones
    : DEFAULT_MILESTONES;

  return (
    <section id="about" className="about-section">
      <div className="container">
        <p className="section-label">07. About Us</p>

        <div className="about-grid">
          {/* TEXT SIDE */}
          <div className="about-text reveal" ref={textRef}>
            <h2 className="section-title">
              Building digital products that{" "}
              <span className="accent">scale</span>
            </h2>

            {(company.aboutBio || []).slice(0, 1).map((para, i) => (
              <p key={i}>{para}</p>
            ))}

            {/* Who We Are checklist card */}
            <div className="who-we-are-card">
              <p className="who-we-are-label">Who We Are</p>
              <ul className="who-we-are-list">
                {capabilities.map((cap) => (
                  <li key={cap}>
                    <span className="check-icon" aria-hidden="true">
                      ✔
                    </span>
                    {cap}
                  </li>
                ))}
              </ul>
            </div>

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
          <div className="about-card reveal" ref={cardRef}>
            <div className="about-img-wrapper">
              <div className="about-img-dots" aria-hidden="true" />
              <div className="about-img-placeholder">
                <img
                  src={company.avatarUrl || "/about.jpg"}
                  alt={company.name}
                />
              </div>
              <div className="about-img-border" />
            </div>
          </div>
        </div>

        {/* Milestone timeline */}
        <div className="about-timeline">
          {milestones.map((m, i) => (
            <div
              className="timeline-item reveal"
              key={m.year + i}
              ref={(node) => (timelineRefs.current[i] = node)}
              style={{ transitionDelay: `${i * 0.12}s` }}
            >
              <div className="timeline-dot" />
              <span className="timeline-year">{m.year}</span>
              <span className="timeline-label">{m.label}</span>
              {i < milestones.length - 1 && (
                <div className="timeline-connector" aria-hidden="true" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
