import { useEffect, useRef, useState } from "react";
import "./Testimonials.css";

// Copy, written for GH Studios: web, security and video work for real clients.
// Change any of these lines.
const KICKER = "The people behind the projects";
const HEADLINE = [
  { text: "What", tone: "serif" },
  { text: "they", tone: "bold" },
  { text: "say", tone: "serif" },
];
const SUBLINE =
  "Real words from the clients we\u2019ve built, secured and filmed for.";
const BADGE = "GH Studios"; // the little oval sticker beside the headline

const PER_PAGE = 4; // cards shown around the headline at once (laptop)

// Give every headline letter a running number, so they can appear one after another.
const WORDS = HEADLINE.reduce(
  (acc, w) => {
    const letters = [...w.text.toUpperCase()].map((ch, k) => ({
      ch,
      i: acc.n + k,
    }));
    return { n: acc.n + letters.length, list: [...acc.list, { ...w, letters }] };
  },
  { n: 0, list: [] },
).list;
const HEADLINE_LABEL = HEADLINE.map((w) => w.text).join(" ");

// Becomes true (once) when the element scrolls into view.
function useInView(threshold = 0.25) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px -50px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, seen];
}

function useMediaQuery(query) {
  const [matches, setMatches] = useState(
    () => typeof window !== "undefined" && window.matchMedia(query).matches,
  );
  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setMatches(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [query]);
  return matches;
}

// One client: a photo "sticker" with a name tag, and their words underneath.
function TestimonialCard({ t, i }) {
  const [ref, seen] = useInView(0.2);
  const slot = i % PER_PAGE;
  return (
    <figure
      ref={ref}
      className={`tm-card pos-${slot + 1}${seen ? " is-in" : ""}`}
      style={{ "--i": slot }}
    >
      <div className="tm-photo" data-tone={i % 4}>
        {t.photoUrl ? (
          <img src={t.photoUrl} alt={t.name} loading="lazy" decoding="async" />
        ) : (
          <span className="tm-initial" aria-hidden="true">
            {t.name?.[0] || "?"}
          </span>
        )}
        <span className="tm-name">{t.name}</span>
      </div>

      <blockquote className="tm-quote">{t.quote}</blockquote>
      {t.role && <figcaption className="tm-role">{t.role}</figcaption>}
    </figure>
  );
}

// theme: "light" (default, continues from the light transition) or "dark"
export default function Testimonials({ testimonials = [], theme = "light" }) {
  const [page, setPage] = useState(0);
  const [headRef, headIn] = useInView(0.35);
  const isMobile = useMediaQuery("(max-width: 860px)");

  if (testimonials.length === 0) return null;

  // Laptop: four cards around the headline, with dots to flip through more.
  // Mobile: every card in one list.
  const pages = isMobile ? 1 : Math.ceil(testimonials.length / PER_PAGE);
  const current = Math.min(page, pages - 1);
  const shown = isMobile
    ? testimonials
    : testimonials.slice(current * PER_PAGE, current * PER_PAGE + PER_PAGE);

  return (
    <section id="testimonials" className={`testimonials-section tm-${theme}`}>
      <div className="container">
        <div className="tm-stage">
          {/* centre: sticker, kicker, headline, subline */}
          <div ref={headRef} className={`tm-head${headIn ? " is-in" : ""}`}>
            <span className="tm-badge" aria-hidden="true">
              {BADGE}
            </span>
            <p className="tm-kicker">{KICKER}</p>
            <h2 className="tm-title" aria-label={HEADLINE_LABEL}>
              {WORDS.map((w) => (
                <span className={`tm-word tm-${w.tone}`} key={w.text} aria-hidden="true">
                  {w.letters.map(({ ch, i }) => (
                    <span className="tm-letter" key={i} style={{ "--l": i }}>
                      {ch}
                    </span>
                  ))}
                </span>
              ))}
            </h2>
            <p className="tm-sub">{SUBLINE}</p>
          </div>

          {/* around it: the clients, scattered at angles */}
          <div className="tm-cards">
            {shown.map((t, i) => (
              <TestimonialCard key={`${current}-${t._id ?? i}`} t={t} i={i} />
            ))}
          </div>
        </div>

        {pages > 1 && (
          <div className="tm-dots" role="group" aria-label="More testimonials">
            {Array.from({ length: pages }, (_, p) => (
              <button
                key={p}
                type="button"
                className={p === current ? "is-active" : ""}
                onClick={() => setPage(p)}
                aria-label={`Show testimonials ${p + 1} of ${pages}`}
                aria-current={p === current}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}