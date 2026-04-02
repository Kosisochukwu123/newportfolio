import { useEffect, useState } from "react";
import "./Skills.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const GROUPS = ["Frontend", "Backend", "Database", "DevOps & Tools"];

const FALLBACK = [
  { name: "React.js",      group: "Frontend" },
  { name: "Redux Toolkit", group: "Frontend" },
  { name: "Next.js",       group: "Frontend" },
  { name: "Node.js",       group: "Backend" },
  { name: "Express.js",    group: "Backend" },
  { name: "MongoDB",       group: "Database" },
  { name: "Mongoose",      group: "Database" },
  { name: "Docker",        group: "DevOps & Tools" },
];

export default function Skills() {
  const [skills, setSkills] = useState(FALLBACK);

  useEffect(() => {
    fetch(`${API}/skills`)
      .then((r) => r.json())
      .then((d) => { if (d.success && d.data.length) setSkills(d.data); })
      .catch(() => {});
  }, []);

  const grouped = GROUPS.reduce((acc, g) => {
    acc[g] = skills.filter((s) => s.group === g);
    return acc;
  }, {});

  return (
    <section id="skills" className="skills-section">
      <div className="container">
        <p className="section-label">01. Skills</p>
        <h2 className="section-title">
          The stack I build <span className="accent">with</span>
        </h2>
        <div className="skills-grid">
          {GROUPS.map((group) =>
            grouped[group]?.length > 0 ? (
              <div className="skill-group" key={group}>
                <h3 className="skill-group-label">{group}</h3>
                <div className="skill-list">
                  {grouped[group].map((s) => (
                    <span className="skill-pill" key={s._id || s.name}>{s.name}</span>
                  ))}
                </div>
              </div>
            ) : null
          )}
        </div>
      </div>
    </section>
  );
}
