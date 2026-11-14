import { useEffect, useRef } from "react";
import LiveCursors from "./LiveCursors";
import "./About.css";

const CAPABILITIES = [
  "MERN Development",
  "Typescript & React",
  "AI Integration",
  "Videography",
];

const MILESTONES = [
  { year: "2024", label: "Started GH Studios" },
  { year: "2025", label: "First International Client" },
  { year: "2026", label: "Agency Launch" },
];

const STATS = [
  { num: "4+", label: "Years Experience" },
  { num: "40+", label: "Projects Delivered" },
  { num: "20+", label: "Clients Served" },
];

export default function About() {
  const contentRef = useRef(null);
  const cardRef = useRef(null);
  const statsRef = useRef(null);
  const canvasRef = useRef(null);
  const timelineRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" },
    );

    [
      contentRef.current,
      cardRef.current,
      statsRef.current,
      canvasRef.current,
    ].forEach((el) => el && observer.observe(el));

    timelineRefs.current.forEach(
      (el) => el && observer.observe(el),
    );

    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" className="about-section" aria-labelledby="about-title">
      <div className="container about-inner">
        <div className="about-head reveal" ref={contentRef}>
          <h2 id="about-title" className="section-title">
            Building digital products that
            <span className="accent"> scale, quietly.</span>
          </h2>

          <p className="about-lede">
            A small studio shaping calm, considered software — from first
            sketch to shipped product.
          </p>
        </div>

        <div className="about-grid">
          <div className="about-left">
            <div className="who-we-are-card reveal" ref={cardRef}>
              <div className="who-we-are-header">
                <p className="who-we-are-label">Who We Are</p>
                <span className="who-we-are-badge">
                  Studio · Est. 2024
                </span>
              </div>

              <ul className="who-we-are-list">
                {CAPABILITIES.map((cap, index) => (
                  <li key={`${cap}-${index}`}>
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
              {STATS.map((stat, index) => (
                <div className="stat" key={stat.label}>
                  <span className="stat-index">
                    0{index + 1}
                  </span>
                  <span className="stat-num">{stat.num}</span>
                  <span className="stat-label">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="about-canvas reveal" ref={canvasRef}>
            <LiveCursors />
            <p className="about-canvas-note">
              Nothing great is made alone. Design, code, security and motion
              work on the same page, at the same time.
            </p>
          </div>
        </div>
      </div>

      <div className="about-timeline-wrap">
        <div className="container">
          <p className="timeline-eyebrow">The Journey</p>

          <div className="about-timeline">
            <div className="timeline-line" aria-hidden="true" />

            {MILESTONES.map((milestone, index) => (
              <div
                className="timeline-item reveal"
                key={`${milestone.year}-${index}`}
                ref={(node) => (timelineRefs.current[index] = node)}
                style={{ transitionDelay: `${index * 0.12}s` }}
              >
                <div className="timeline-dot">
                  <div className="timeline-dot-inner" />
                </div>

                <span className="timeline-year">
                  {milestone.year}
                </span>

                <span className="timeline-label">
                  {milestone.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
