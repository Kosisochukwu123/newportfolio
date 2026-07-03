import { useEffect, useState } from "react";
import "./Skills.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const GROUPS = [
  "Business Solutions",
  "Design",
  "Development",
  "Infrastructure",
];

export default function Skills() {
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    fetch(`${API}/skills`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setSkills(d.data);
      })
      .catch(() => {});
  }, []);

  const grouped = GROUPS.reduce((acc, g) => {
    acc[g] = skills.filter((s) => s.group === g);
    return acc;
  }, {});

  return (
    <section id="skills" className="skills-section">
      <div className="container">
        <p className="skills-label">Capabilities</p>
        <h2 className="skills-title">Crafted systems, not just code</h2>

        <div className="skills-grid">
          {GROUPS.map((group) => (
            <div className="skill-card" key={group}>
              <h3 className="skill-title">{group}</h3>

              <div className="skill-items">
                {grouped[group]?.map((skill) => (
                  <span className="skill-item" key={skill._id}>
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
