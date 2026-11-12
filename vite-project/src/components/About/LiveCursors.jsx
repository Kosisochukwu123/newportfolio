import { useEffect, useRef } from "react";

// The five "teammates" are the studio's roles, each with a colour, and a route
// of things on the page they visit (design, frontend, backend, security, motion).
const PEOPLE = [
  { id: "design", name: "Design", color: "#ff5ea8", route: ["headline", "image", "cta", "card2"] },
  { id: "frontend", name: "Frontend", color: "#4c8dff", route: ["cta", "nav", "card2", "headline"] },
  { id: "backend", name: "Backend", color: "#1fb76a", route: ["card3", "cta", "sub", "card3"] },
  { id: "security", name: "Security", color: "#ff9a3d", route: ["card1", "nav", "card1", "cta"] },
  { id: "motion", name: "Motion", color: "#9b6bff", route: ["image", "headline", "image", "card2"] },
];

const rnd = (a, b) => a + Math.random() * (b - a);

// A page being built live. Cursors glide around it, select things, click the
// button, type into the API card, secure a card and drag the picture.
export default function LiveCursors() {
  const wrapRef = useRef(null);
  const bodyRef = useRef(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const body = bodyRef.current;
    if (!wrap || !body) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const targets = {};
    body.querySelectorAll("[data-t]").forEach((el) => (targets[el.dataset.t] = el));
    const cursors = {};
    body.querySelectorAll(".lc-cursor").forEach((el) => (cursors[el.dataset.p] = el));

    let running = false;
    let timers = [];
    const later = (fn, ms) => {
      timers.push(setTimeout(fn, ms));
    };

    // a point somewhere inside an element, relative to the page area
    const pointAt = (el) => {
      const b = body.getBoundingClientRect();
      const r = el.getBoundingClientRect();
      return {
        x: r.left - b.left + r.width * rnd(0.3, 0.7),
        y: r.top - b.top + r.height * rnd(0.35, 0.65),
      };
    };

    const place = (p, x, y, ms) => {
      const c = cursors[p.id];
      if (!c) return;
      c.style.transitionDuration = `${ms}ms`;
      c.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
    };

    // the coloured outline + name tag a cursor leaves on whatever it picks
    const select = (p, el) => {
      el.style.setProperty("--sel", p.color);
      el.dataset.by = p.name;
      el.dataset.owner = p.id;
      el.classList.add("is-selected");
    };
    const deselect = (p, el) => {
      if (el.dataset.owner !== p.id) return; // someone else has it now
      el.classList.remove("is-selected");
      delete el.dataset.owner;
    };

    const ripple = (x, y, color) => {
      const r = document.createElement("span");
      r.className = "lc-ripple";
      r.style.cssText = `left:${x}px;top:${y}px;--c:${color}`;
      body.appendChild(r);
      later(() => r.remove(), 800);
    };

    // what each person actually does when they arrive
    const act = (p, key, el, x, y) => {
      if (key === "cta") {
        el.classList.add("is-pressed");
        ripple(x, y, p.color);
        later(() => el.classList.remove("is-pressed"), 240);
      } else if (key === "card1" && p.id === "security") {
        el.classList.toggle("is-secured");
      } else if (key === "card3" && p.id === "backend") {
        el.classList.remove("is-typing");
        el.getBoundingClientRect(); // restart the typing animation
        el.classList.add("is-typing");
      } else if (key === "image" && p.id === "motion") {
        el.style.setProperty("--dx", `${rnd(-8, 8).toFixed(1)}px`);
        el.style.setProperty("--dy", `${rnd(-6, 6).toFixed(1)}px`);
        el.style.setProperty("--dr", `${rnd(-3, 3).toFixed(1)}deg`);
      }
    };

    const walk = (p, start) => {
      let k = start;
      const step = () => {
        if (!running) return;
        const key = p.route[k % p.route.length];
        k += 1;
        const el = targets[key];
        if (!el) return;
        const { x, y } = pointAt(el);
        const travel = rnd(950, 1700);
        place(p, x, y, travel);
        later(() => {
          select(p, el);
          act(p, key, el, x, y);
          later(() => {
            deselect(p, el);
            step();
          }, rnd(1300, 2300));
        }, travel + 60);
      };
      later(step, 300 + start * 420);
    };

    const start = () => {
      if (running) return;
      running = true;
      wrap.classList.add("is-live");
      const b = body.getBoundingClientRect();
      PEOPLE.forEach((p, i) => {
        place(p, b.width * (0.2 + i * 0.15), b.height * 1.02, 0); // enter from below
        walk(p, i);
      });
    };
    const stop = () => {
      running = false;
      wrap.classList.remove("is-live");
      timers.forEach(clearTimeout);
      timers = [];
      Object.values(targets).forEach((el) => el.classList.remove("is-selected"));
    };

    if (reduce) {
      // no motion: show each person resting on something, with their selection
      wrap.classList.add("is-live");
      PEOPLE.forEach((p, i) => {
        const el = targets[p.route[0]];
        if (!el) return;
        const { x, y } = pointAt(el);
        place(p, x + i * 6, y + i * 4, 0);
        if (i < 3) select(p, el);
      });
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { threshold: 0.25 },
    );
    io.observe(wrap);
    return () => {
      io.disconnect();
      stop();
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      className="lc-window"
      role="img"
      aria-label="Illustration: the Design, Frontend, Backend, Security and Motion teams editing the same page at once, each with their own coloured cursor"
    >
      <div className="lc-bar" aria-hidden="true">
        <span className="lc-dots">
          <i />
          <i />
          <i />
        </span>
        <span className="lc-title">gh-studios / new-product</span>
        <span className="lc-presence">
          {PEOPLE.map((p) => (
            <span key={p.id} className="lc-avatar" style={{ "--c": p.color }}>
              {p.name[0]}
            </span>
          ))}
          <span className="lc-live">5 editing</span>
        </span>
      </div>

      <div ref={bodyRef} className="lc-body" aria-hidden="true">
        {/* the page everyone is working on */}
        <div className="lc-page">
          <div className="lc-nav" data-t="nav">
            <i className="lc-logo" />
            <span />
            <span />
            <span />
            <b className="lc-navbtn" />
          </div>

          <div className="lc-hero">
            <div className="lc-copy">
              <h3 className="lc-h" data-t="headline">
                Calm software, built together.
              </h3>
              <p className="lc-p" data-t="sub">
                Design, code, security and motion, shaping one product at the same time.
              </p>
              <div className="lc-cta" data-t="cta">
                Start a project
              </div>
            </div>
            <div className="lc-img" data-t="image">
              <span className="lc-sun" />
            </div>
          </div>

          <div className="lc-cards">
            <div className="lc-card" data-t="card1">
              <span className="lc-ic">◆</span>
              <b>Secure</b>
              <em>Hardened by default</em>
              <span className="lc-ok">✓</span>
            </div>
            <div className="lc-card" data-t="card2">
              <span className="lc-ic">●</span>
              <b>Fast</b>
              <em>Built to scale</em>
            </div>
            <div className="lc-card" data-t="card3">
              <span className="lc-ic">▲</span>
              <b>API</b>
              <code className="lc-type">POST /api/projects</code>
            </div>
          </div>
        </div>

        {/* the live cursors */}
        {PEOPLE.map((p) => (
          <div key={p.id} className="lc-cursor" data-p={p.id} style={{ "--c": p.color }}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M4 2.5v16.4l4.4-4 3 7 2.6-1.1-3-6.8h6.1z"
                fill="var(--c)"
                stroke="#fff"
                strokeWidth="1.4"
                strokeLinejoin="round"
              />
            </svg>
            <span className="lc-tag">{p.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}