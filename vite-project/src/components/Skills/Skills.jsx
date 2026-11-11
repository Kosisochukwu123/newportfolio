import { useEffect, useRef, useState } from "react";
import "./Skills.css";

const API = import.meta.env.VITE_API_URL || "/api";

const GROUPS = [
  "Business Solutions",
  "Design",
  "Development",
  "Infrastructure",
];

const LABEL = "What we do";
const HEADLINE = "Crafted systems, not just code";
const WORDS = HEADLINE.split(" ");

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const smooth = (t) => t * t * (3 - 2 * t);

export default function Skills() {
  const [skills, setSkills] = useState([]);

  const introRef = useRef(null);
  const labelRef = useRef(null);
  const wordRefs = useRef([]);
  const gridRef = useRef(null);

  useEffect(() => {
    fetch(`${API}/skills`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setSkills(d.data);
      })
      .catch(() => {});
  }, []);

  // Headline reveal, driven by scroll. The section slides up over the hero,
  // then the headline sits pinned while its words come in one after another
  // (rising, un-blurring, fading up). Direct DOM writes, no state per frame.
  useEffect(() => {
    const intro = introRef.current;
    if (!intro) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const words = wordRefs.current;
    const n = words.length;
    let target = 0;
    let current = 0;
    let raf = 0;
    let running = false;

    const read = () => {
      const vh = window.innerHeight;
      const top = intro.getBoundingClientRect().top;
      // starts while the section is still sliding up (top at 60% of the
      // screen) and finishes a little before the pin ends
      return clamp((vh * 0.6 - top) / (vh * 1.1), 0, 1);
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
        // each word gets its own window of the progress, staggered left to right
        const t = smooth(clamp((p - (i / n) * 0.7) / 0.3, 0, 1));
        w.style.opacity = 0.08 + 0.92 * t;
        w.style.transform = `translate3d(0,${(1 - t) * 0.45}em,0)`;
        w.style.filter =
          t >= 1 ? "none" : `blur(${((1 - t) * 5).toFixed(2)}px)`;
      }
    };

    const tick = () => {
      current += (target - current) * 0.16;
      if (Math.abs(target - current) < 0.0005) current = target;
      paint(current);
      if (current !== target) raf = requestAnimationFrame(tick);
      else running = false;
    };

    const onScroll = () => {
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

    target = current = reduce ? 1 : read();
    paint(current);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Cards pop in (and their pills follow, one by one) as they scroll into view.
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.2 },
    );
    grid.querySelectorAll(".skill-card").forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, []);

  const grouped = GROUPS.reduce((acc, g) => {
    acc[g] = skills.filter((s) => s.group === g);
    return acc;
  }, {});

  return (
    <section id="skills" className="skills-section">
      {/* Pinned headline: words reveal as you scroll */}
      <div className="skills-intro" ref={introRef}>
        <div className="skills-stage">
          <p className="skills-label" ref={labelRef}>
            {LABEL}
          </p>
          <h2 className="skills-title">
            {WORDS.map((word, i) => (
              <span
                key={i}
                className="skills-word"
                ref={(n) => (wordRefs.current[i] = n)}
              >
                {word}
              </span>
            ))}
          </h2>
        </div>
      </div>

      <div className="skills-body">
        <div className="container">
          <div className="skills-grid" ref={gridRef}>
            {GROUPS.map((group, gi) => (
              <div
                className="skill-card is-in"
                key={group}
                style={{ "--c": gi }}
              >
                {/* natural photo behind the card (public/skills/skills-1..4.jpg) */}
                <img
                  className="skill-bg"
                  src={`/skills/skills-${gi + 1}.jpg`}
                  alt=""
                  onLoad={(e) => {
                    console.log(
                      "SKILLS IMAGE LOADED:",
                      e.currentTarget.src,
                      e.currentTarget.naturalWidth,
                      e.currentTarget.naturalHeight,
                    );
                  }}
                  onError={(e) => {
                    console.error("SKILLS IMAGE FAILED:", e.currentTarget.src);
                  }}
                />
                <div className="skill-head">
                  <span className="skill-num">0{gi + 1}</span>
                  <h3 className="skill-title">{group}</h3>
                </div>

                <div className="skill-items">
                  {grouped[group]?.map((skill, i) => (
                    <span
                      className="skill-item"
                      key={skill._id}
                      style={{ "--i": i }}
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
