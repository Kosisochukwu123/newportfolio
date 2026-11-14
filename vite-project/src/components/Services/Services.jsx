
import "./Services.css";

const DEFAULT_SERVICES = [
  {
    title: "Web Development",
    description:
      "Modern, responsive websites and web applications designed to give your business a strong digital presence and turn visitors into customers.",
    tag: "Websites & Web Apps",
  },
  {
    title: "UI/UX Design",
    description:
      "Thoughtful digital experiences built around your users, combining intuitive navigation, clear interfaces and purposeful visual design.",
    tag: "Research & Interface Design",
  },
  {
    title: "Backend Systems",
    description:
      "Reliable server-side systems, database architecture and business logic that keep your applications secure, organized and scalable.",
    tag: "Systems & Architecture",
  },
  {
    title: "API Development",
    description:
      "Well-structured APIs that connect your applications, services and data, making your digital products work together seamlessly.",
    tag: "Integration & Connectivity",
  },
  {
    title: "Cloud Deployment",
    description:
      "Deployment and configuration of your applications so they can run reliably online, with the infrastructure needed to grow.",
    tag: "Hosting & Infrastructure",
  },
  {
    title: "Performance Optimization",
    description:
      "Improving website speed, responsiveness and technical efficiency to create smoother experiences across devices.",
    tag: "Speed & Reliability",
  },
];

function getServices(profileServices) {
  if (!Array.isArray(profileServices) || profileServices.length === 0) {
    return DEFAULT_SERVICES;
  }

  return profileServices.map((service, index) => {
    const existing = DEFAULT_SERVICES.find(
      (item) =>
        item.title.toLowerCase() === String(service).trim().toLowerCase(),
    );

    return {
      number: String(index + 1).padStart(2, "0"),
      title: service,
      description:
        existing?.description ||
        "We provide tailored solutions in this area, combining thoughtful design and reliable engineering to meet your business needs.",
      tag: existing?.tag || "Digital Solutions",
    };
  });
}

export default function Services({ profile = {} }) {
  const services = getServices(profile.services);

  return (
    <section
      id="services"
      className="services"
      aria-labelledby="services-title"
    >
      <div className="container services-inner">
        <div className="services-heading">
          <div className="services-intro">
            <p className="section-label">What we do</p>

            <h2 id="services-title" className="section-title">
              Solutions built around
              <span className="accent"> your next move.</span>
            </h2>
          </div>

          <p className="services-description">
            From the first idea to the finished product, we combine design
            and engineering to build digital solutions that solve real
            business problems.
          </p>
        </div>

        <div className="services-grid">
          {services.map((service, index) => (
            <article
              className="service-card"
              key={`${service.title}-${index}`}
            >
              <div className="service-card-top">
                <span className="service-number">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <span className="service-arrow" aria-hidden="true">
                  ↗
                </span>
              </div>

              <div className="service-card-content">
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </div>

              <div className="service-card-bottom">
                <span>{service.tag}</span>
              </div>
            </article>
          ))}
        </div>

        <div className="services-bottom">
          <p>
            Have a project in mind? Let's figure out the right solution.
          </p>

          <a href="/contact" className="services-cta">
            Start a project <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </section>
  );
}
