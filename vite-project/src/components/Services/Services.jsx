import { useEffect, useRef } from "react";
import { ServiceArt, PromptArt } from "./ServiceArt";
import "./Services.css";

// Replaces Skills. Same behaviour as before: it slides up over the section above,
// the headline sits pinned while its words come in one by one. New: the cards now
// rise up over the headline as it fades, instead of arriving after a long gap.

const LABEL = "What we do";
const HEADLINE = "Solutions built around your next move.";
const ACCENT_FROM = 3; // from this word on, the headline is lime
const DESCRIPTION =
  "From the first idea to the finished product, we combine design and engineering to build digital solutions that solve real business problems.";
const WORDS = HEADLINE.split(" ");

const SERVICES = [
  {
    art: "web",
    title: "Web Development",
    description:
      "Modern, responsive websites and web applications designed to give your business a strong digital presence and turn visitors into customers.",
    tag: "Websites & Web Apps",
  },
  {
    art: "design",
    title: "UI/UX Design",
    description:
      "Thoughtful digital experiences built around your users, combining intuitive navigation, clear interfaces and purposeful visual design.",
    tag: "Research & Interface Design",
  },
  {
    art: "backend",
    title: "Backend Systems",
    description:
      "Reliable server-side systems, database architecture and business logic that keep your applications secure, organized and scalable.",
    tag: "Systems & Architecture",
  },
  {
    art: "api",
    title: "API Development",
    description:
      "Well-structured APIs that connect your applications, services and data, making your digital products work together seamlessly.",
    tag: "Integration & Connectivity",
  },
  {
    art: "speed",
    title: "Performance Optimization",
    description:
      "Improving website speed, responsiveness and technical efficiency to create smoother experiences across devices.",
    tag: "Speed & Reliability",
  },
];

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const smooth = (t) => t * t * (3 - 2 * t);

export default function Services() {
  const introRef = useRef(null);
  const copyRef = useRef(null);
  const labelRef = useRef(null);
  const descRef = useRef(null);
  const wordRefs = useRef([]);
  const bodyRef = useRef(null);
  const gridRef = useRef(null);

  // Headline reveal + fade-out, both driven by scroll. Direct DOM writes (no state
  // per frame): the words come in as you scroll, then the headline fades and
  // shrinks away as the cards rise over it.
  useEffect(() => {
    const intro = introRef.current;
    const body = bodyRef.current;
    const copy = copyRef.current;
    if (!intro || !body || !copy) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const words = wordRefs.current;
    const n = words.length;
    let target = 0;
    let current = 0;
    let raf = 0;
    let running = false;

    // how far the words have come in (0..1): starts while the section is still
    // sliding up, and finishes a little before the pin ends
    const read = () => {
      const vh = window.innerHeight;
      const top = intro.getBoundingClientRect().top;
      return clamp((vh * 0.6 - top) / (vh * 0.95), 0, 1);
    };

    const paint = (p) => {
      if (labelRef.current) {
        const l = smooth(clamp(p / 0.2, 0, 1));
        labelRef.current.style.opacity = l;
        labelRef.current.style.transform = `translate3d(0,${(1 - l) * 10}px,0)`;
      }
      for (let i = 0; i < n; i++) {
        const w = words[i];
        if (!w) continue;
        const t = smooth(clamp((p - (i / n) * 0.62) / 0.3, 0, 1));
        w.style.opacity = 0.08 + 0.92 * t;
        w.style.transform = `translate3d(0,${(1 - t) * 0.45}em,0)`;
        w.style.filter =
          t >= 1 ? "none" : `blur(${((1 - t) * 5).toFixed(2)}px)`;
      }
      if (descRef.current) {
        const d = smooth(clamp((p - 0.62) / 0.3, 0, 1));
        descRef.current.style.opacity = d;
        descRef.current.style.transform = `translate3d(0,${(1 - d) * 14}px,0)`;
      }
    };

    // the fade follows the cards exactly: the closer their top edge gets to the
    // headline, the more it fades, lifts and shrinks. Not smoothed on purpose, so
    // it can never lag behind the scroll.
    const fade = () => {
      const vh = window.innerHeight;
      const top = body.getBoundingClientRect().top;
      const f = clamp((vh * 0.8 - top) / (vh * 0.45), 0, 1);
      copy.style.opacity = (1 - f * 0.94).toFixed(3);
      copy.style.transform = `translate3d(0,${(-f * 36).toFixed(1)}px,0) scale(${(1 - f * 0.05).toFixed(3)})`;
    };

    const tick = () => {
      current += (target - current) * 0.16;
      if (Math.abs(target - current) < 0.0005) current = target;
      paint(current);
      if (current !== target) raf = requestAnimationFrame(tick);
      else running = false;
    };

    const onScroll = () => {
      fade();
      target = read();
      if (reduce) {
        current = target = 1;
        paint(1);
        return;
      }
      if (!running) {
        running = true;
        raf = requestAnimationFrame(tick);
      }
    };

    if (reduce) {
      paint(1);
      return;
    }
    target = current = read();
    paint(current);
    fade();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Each card pops in as it scrolls into view, and its little scene only plays
  // while the card is on screen.
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          e.target.classList.toggle("is-live", e.isIntersecting);
          if (e.isIntersecting) e.target.classList.add("is-in");
        });
      },
      { threshold: 0.15 },
    );
    grid.querySelectorAll(".sv-card").forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, []);

  return (
    <section id="skills" className="sv" aria-labelledby="services-title">
      {/* pinned headline: the words come in as you scroll */}
      <div className="sv-intro" ref={introRef}>
        <div className="sv-stage">
          <div className="sv-copy" ref={copyRef}>
            <p className="sv-label" ref={labelRef}>
              {LABEL}
            </p>
            <h2 id="services-title" className="sv-title" aria-label={HEADLINE}>
              {WORDS.map((word, i) => (
                <span
                  key={i}
                  aria-hidden="true"
                  className={`sv-word${i >= ACCENT_FROM ? " is-accent" : ""}`}
                  ref={(node) => (wordRefs.current[i] = node)}
                >
                  {word}
                </span>
              ))}
            </h2>
            <p className="sv-desc" ref={descRef}>
              {DESCRIPTION}
            </p>
          </div>
        </div>
      </div>

      {/* the cards: a light panel that rises over the headline */}
      <div className="sv-body" ref={bodyRef}>
        <div className="sv-panel">
          <div className="sv-grid" ref={gridRef}>
            {SERVICES.map((s, i) => (
              <article className="sv-card" key={s.title} style={{ "--c": i }}>
                <div className="sv-art">
                  <ServiceArt kind={s.art} />
                </div>

                <div className="sv-text">
                  <h3>{s.title}</h3>
                  <p>{s.description}</p>
                </div>

                <div className="sv-foot">
                  <span className="sv-tag">{s.tag}</span>
                  <span className="sv-num">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="sv-arrow" aria-hidden="true">
                    ↗
                  </span>
                </div>
              </article>
            ))}

            {/* the last card is the call to action, with a prompt box that types out ideas */}
            <article
              className="sv-card is-cta"
              style={{ "--c": SERVICES.length }}
            >
              <div className="sv-art">
                <PromptArt />
              </div>
              <div className="sv-text">
                <h3>Have a project in mind?</h3>
                <p>
                  Describe it in a sentence. We&rsquo;ll come back with the
                  right solution.
                </p>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
