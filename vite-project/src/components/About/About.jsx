import { useEffect, useState } from "react";
import "./About.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function About() {
  const [profile, setProfile] = useState({
    name: "Your Name",
    aboutBio: [
      "I'm a Full Stack MERN Developer with a passion for building complete web experiences — from architecting MongoDB schemas and crafting Express REST APIs to designing fluid React interfaces.",
      "I care deeply about clean code, developer experience, and shipping products that are fast, accessible, and a joy to use.",
      "When I'm not coding, I'm exploring new libraries, contributing to open source, or reading about system design and engineering culture.",
    ],
    yearsExperience: "3+",
    projectsShipped: "20+",
    avatarUrl: "",
  });

  useEffect(() => {
    fetch(`${API}/profile`)
      .then((r) => r.json())
      .then((d) => { if (d.success) setProfile(d.data); })
      .catch(() => {});
  }, []);

  return (
    <section id="about" className="about-section">
      <div className="container">
        <p className="section-label">01. About</p>
        <div className="about-grid">
          <div className="about-text">
            <h2 className="section-title">
              Building digital products that <span className="accent">matter</span>
            </h2>
            {(profile.aboutBio || []).map((para, i) => (
              <p key={i}>{para}</p>
            ))}
            <div className="about-stats">
              {[
                { num: profile.yearsExperience || "3+", label: "Years Experience" },
                { num: profile.projectsShipped || "20+", label: "Projects Shipped" },
                { num: "∞", label: "Coffee consumed" },
              ].map((s) => (
                <div className="stat" key={s.label}>
                  <span className="stat-num">{s.num}</span>
                  <span className="stat-label">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="about-card">
            <div className="about-img-wrapper">
              <div className="about-img-placeholder">
                {profile.avatarUrl
                  ? <img src={profile.avatarUrl} alt={profile.name} />
                  : <span>Your Photo</span>
                }
              </div>
              <div className="about-img-border" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
