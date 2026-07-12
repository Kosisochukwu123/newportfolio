import "./Collaborations.css";
/**
 * Understated "in good company" section.
 * - Pure JSX, no Tailwind, no external deps.
 * - Drop-in: <Collaborations /> after <Projects />.
 * - Replace PARTNERS with your real logos (SVG string, image URL, or short text mark).
 *
 * Each partner may provide:
 *   { name, logo?: <svg/> string, src?: image url, url?: link }
 * If neither logo nor src is given, the name renders as a clean wordmark.
 */
const PARTNERS = [
  { name: "Northwind", url: "#" },
  { name: "Acme Co.", url: "#" },
  { name: "Dragon Shot", url: "#" },
  { name: "FrankAustine", url: "#" },
  // { name: "Kepler", url: "#" },
  // { name: "Meridian", url: "#" },
  // { name: "Halcyon", url: "#" },
  // { name: "Ovant", url: "#" },
];
export default function Collaborations() {
  return (
    <section className="cl-root" aria-labelledby="cl-title">
      <div className="cl-inner">
        <header className="cl-head">
          <p className="cl-eyebrow">03 · In good company</p>
          <h2 id="cl-title" className="cl-title">
            Trusted collaborators <span className="cl-accent">we build with.</span>
          </h2>
          <p className="cl-lede">
            A quiet list of the teams we partner with — from early-stage
            studios to public companies — to ship the work above.
          </p>
        </header>
        <ul className="cl-grid" role="list">
          {PARTNERS.map((p) => {
            const inner = p.logo ? (
              <span
                className="cl-logo"
                aria-hidden="true"
                dangerouslySetInnerHTML={{ __html: p.logo }}
              />
            ) : p.src ? (
              <img className="cl-img" src={p.src} alt={`${p.name} logo`} loading="lazy" />
            ) : (
              <span className="cl-wordmark">{p.name}</span>
            );
            return (
              <li key={p.name} className="cl-cell">
                {p.url ? (
                  <a
                    className="cl-link"
                    href={p.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={p.name}
                  >
                    {inner}
                  </a>
                ) : (
                  <span className="cl-link" aria-label={p.name}>
                    {inner}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
        <p className="cl-foot">
          <span className="cl-dot" /> Currently accepting two new partners for Q3.
        </p>
      </div>
    </section>
  );
}