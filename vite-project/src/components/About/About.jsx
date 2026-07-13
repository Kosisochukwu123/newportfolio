import { useEffect, useRef, useState } from "react";
import "./About.css";
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
  const cardRef = useRef(null);
  const statsRef = useRef(null);
  const timelineRefs = useRef([]);
  useEffect(() => {
    fetch(`${API}/profile`)
      .then((r) => r.json())
      .then((d) => {
        if (d?.success) setCompany((c) => ({ ...c, ...d.data }));
      })
      .catch(() => {});
  }, []);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("in-view");
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    [contentRef.current, cardRef.current, statsRef.current].forEach(
      (el) => el && observer.observe(el)
    );
    timelineRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);
  const capabilities = company.services?.length ? company.services : DEFAULT_CAPABILITIES;
  const milestones = company.milestones?.length ? company.milestones : DEFAULT_MILESTONES;
  const stats = [
    { num:  "4+", label: "Years Experience" },
    { num:  "40+", label: "Projects Delivered" },
    { num:  "20+", label: "Clients Served" },
  ];
  return (
    <section id="about" className="about-section" aria-labelledby="about-title">
      {/* Full-bleed background photo */}
      <div className="about-bg" aria-hidden="true">
        <img src={company.avatarUrl || "/about.jpg"} alt="" />
        <div className="about-bg-overlay" />
        <div className="about-bg-grain" />
      </div>
      <div className="container about-inner">
        <div className="about-head reveal" ref={contentRef}>
          <p className="section-label">
          </p>
          <h2 id="about-title" className="section-title">
            Building digital products that
             <span className="accent"> scale, quietly.</span>
          </h2>
          <p className="about-lede">
            A small studio shaping calm, considered software — from first
            sketch to shipped product.
          </p>
        </div>
        <div className="about-columns">
          {/* Who We Are checklist — glass card over the photo */}
          <div className="who-we-are-card reveal" ref={cardRef}>
            <div className="who-we-are-header">
              <p className="who-we-are-label">Who We Are</p>
              <span className="who-we-are-badge">Studio · Est. 2024</span>
            </div>
            <ul className="who-we-are-list">
              {capabilities.map((cap) => (
                <li key={cap}>
                  <span className="check-icon" aria-hidden="true">
                    <svg viewBox="0 0 12 12" width="10" height="10">
                      <path
                        d="M2.5 6.2 5 8.5 9.5 3.8"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <span>{cap}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="about-stats reveal" ref={statsRef}>
            {stats.map((s, i) => (
              <div className="stat" key={s.label}>
                <span className="stat-index">0{i + 1}</span>
                <span className="stat-num">{s.num}</span>
                <span className="stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Milestone timeline — its own solid strip below the photo */}
      <div className="about-timeline-wrap">
        <div className="container">
          <p className="timeline-eyebrow">The Journey</p>
          <div className="about-timeline">
            <div className="timeline-line" aria-hidden="true" />
            {milestones.map((m, i) => (
              <div
                className="timeline-item reveal"
                key={m.year + i}
                ref={(node) => (timelineRefs.current[i] = node)}
                style={{ transitionDelay: `${i * 0.12}s` }}
              >
                <div className="timeline-dot">
                  <div className="timeline-dot-inner" />
                </div>
                <span className="timeline-year">{m.year}</span>
                <span className="timeline-label">{m.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}