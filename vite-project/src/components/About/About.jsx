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
    yearsExperience: "3+",
    projectsShipped: "24+",
    clientsServed: "10+",
    avatarUrl: "",
    services: DEFAULT_CAPABILITIES,
    milestones: DEFAULT_MILESTONES,
  });

  const contentRef = useRef(null);
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
      { threshold: 0.2, rootMargin: "0px 0px -60px 0px" }
    );

    if (contentRef.current) observer.observe(contentRef.current);
    timelineRefs.current.forEach((el) => el && observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const capabilities = company.services?.length ? company.services : DEFAULT_CAPABILITIES;
  const milestones = company.milestones?.length ? company.milestones : DEFAULT_MILESTONES;

  return (
    <section id="about" className="about-section">
      {/* Full-bleed background photo */}
      <div className="about-bg" aria-hidden="true">
        <img src={company.avatarUrl || "/about.jpg"} alt="" />
        <div className="about-bg-overlay" />
      </div>

      <div className="container about-inner reveal" ref={contentRef}>
        <p className="section-label">07. About Us</p>

        <h2 className="section-title">
          Building digital products that <span className="accent">scale</span>
        </h2>

        {/* Who We Are checklist — glass card over the photo */}
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

      {/* Milestone timeline — its own solid strip below the photo */}
      <div className="about-timeline-wrap">
        <div className="container">
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
      </div>
    </section>
  );
}