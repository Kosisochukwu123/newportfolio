import "./Skills.css";

const skillGroups = [
  {
    label: "Frontend",
    skills: ["React.js", "Redux Toolkit", "Next.js", "Tailwind CSS", "Framer Motion", "TypeScript"],
  },
  {
    label: "Backend",
    skills: ["Node.js", "Express.js", "REST APIs", "GraphQL", "Socket.io", "JWT / OAuth"],
  },
  {
    label: "Database",
    skills: ["MongoDB", "Mongoose", "Redis", "PostgreSQL", "Firebase", "Prisma"],
  },
  {
    label: "DevOps & Tools",
    skills: ["Git & GitHub", "Docker", "AWS (EC2, S3)", "Nginx", "CI/CD", "Postman"],
  },
];

export default function Skills() {
  return (
    <section id="skills" className="skills-section">
      <div className="container">
        <p className="section-label">02. Skills</p>
        <h2 className="section-title">
          The stack I build <span className="accent">with</span>
        </h2>

        <div className="skills-grid">
          {skillGroups.map((group) => (
            <div className="skill-group" key={group.label}>
              <h3 className="skill-group-label">{group.label}</h3>
              <div className="skill-list">
                {group.skills.map((s) => (
                  <span className="skill-pill" key={s}>
                    {s}
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
