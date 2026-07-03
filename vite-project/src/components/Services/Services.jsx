import "./Services.css";

export default function Services() {
  const services = [
    "Web Development",
    "UI/UX Design",
    "Backend Systems",
    "API Development",
    "Cloud Deployment",
    "Performance Optimization",
  ];

  return (
    <section id="services" className="services">
      <div className="container">

        <p className="section-label">Services</p>

        <h2 className="section-title">
          What we <span className="accent">do</span>
        </h2>

        <div className="services-grid">
          {services.map((s) => (
            <div key={s} className="service-card">
              {s}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}