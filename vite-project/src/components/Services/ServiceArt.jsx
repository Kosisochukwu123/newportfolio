import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

// ServiceArt.jsx — the little animated scene at the top of each service card
// (like the chart / prompt box / flow cards in your reference). Each one acts out
// what the service does. The animations are plain CSS (see Services.css) and only
// run while their card is on screen.

const POINTER = "M4 2.5v16.4l4.4-4 3 7 2.6-1.1-3-6.8h6.1z";

/* ---------- Web Development: a page builds itself, then goes live ---------- */
function WebArt() {
  return (
    <div className="art art-web" aria-hidden="true">
      <div className="w-bar">
        <i />
        <i />
        <i />
        <span className="w-url">ghstudios.online</span>
      </div>
      <div className="w-page">
        <span className="w-nav a-build" style={{ "--d": 0.2 }} />
        <span className="w-h w-h1 a-grow" style={{ "--d": 0.7 }} />
        <span className="w-h w-h2 a-grow" style={{ "--d": 1.2 }} />
        <span className="w-p a-grow" style={{ "--d": 1.8 }} />
        <span className="w-btn a-build" style={{ "--d": 2.4 }}>
          Get started
        </span>
        <span className="w-img a-build" style={{ "--d": 3 }} />
      </div>
      <span className="w-live a-build" style={{ "--d": 3.8 }}>
        <i />
        Live
      </span>
      <svg className="w-cursor" viewBox="0 0 24 24">
        <path
          d={POINTER}
          fill="#111"
          stroke="#fff"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

/* ---------- UI/UX Design: wireframe boxes turn into a finished design ---------- */
function DesignArt() {
  return (
    <div className="art art-design" aria-hidden="true">
      <span className="d-shape d-img" style={{ "--fill": "#111", "--d": 0 }} />
      <span className="d-shape d-t1" style={{ "--fill": "#111", "--d": 0.4 }} />
      <span
        className="d-shape d-t2"
        style={{ "--fill": "#cfcbbf", "--d": 0.8 }}
      />
      <span
        className="d-shape d-t3"
        style={{ "--fill": "#cfcbbf", "--d": 1 }}
      />
      <span
        className="d-shape d-btn"
        style={{ "--fill": "var(--accent, #e8ff47)", "--d": 1.4 }}
      />
      <span className="d-dot d-dot1 a-build" style={{ "--d": 2.2 }} />
      <span className="d-dot d-dot2 a-build" style={{ "--d": 2.5 }} />
      <span className="d-dot d-dot3 a-build" style={{ "--d": 2.8 }} />
      <span className="d-sel">
        <b>Design</b>
      </span>
      <svg className="d-cursor" viewBox="0 0 24 24">
        <path
          d={POINTER}
          fill="#ff5ea8"
          stroke="#fff"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

/* ---------- Backend Systems: a request travels down the racks ---------- */
function BackendArt() {
  return (
    <div className="art art-backend" aria-hidden="true">
      {[0, 1, 2].map((n) => (
        <div className="b-rack" key={n} style={{ "--n": n }}>
          <span className="b-led" style={{ "--d": n * 0.5 }} />
          <span className="b-led b-led2" style={{ "--d": n * 0.5 + 0.8 }} />
          <span className="b-lines" />
          <span className="b-ring" style={{ "--d": 0.9 + n * 0.9 }} />
        </div>
      ))}
      <span className="b-packet" />
      <span className="b-pill b-pill1 a-build" style={{ "--d": 0.6 }}>
        Encrypted
      </span>
      <span className="b-pill b-pill2 a-build" style={{ "--d": 1.8 }}>
        99.9% uptime
      </span>
      <span className="b-pill b-pill3 a-build" style={{ "--d": 3 }}>
        Scales with you
      </span>
    </div>
  );
}

/* ---------- API Development: requests flow between systems ---------- */
// three sources on the left, one API in the middle, three destinations on the right
const FLOWS = [
  {
    d: "M30 48 C 95 48 95 112 150 112 C 205 112 205 58 270 58",
    w: 12,
    o: 0.18,
    begin: 0,
  },
  {
    d: "M30 112 C 95 112 95 112 150 112 C 205 112 205 112 270 112",
    w: 7,
    o: 0.28,
    begin: 1.1,
  },
  {
    d: "M30 176 C 95 176 95 112 150 112 C 205 112 205 166 270 166",
    w: 12,
    o: 0.18,
    begin: 2.2,
  },
];

function ApiArt() {
  const svgRef = useRef(null);

  // pause the moving dots while the card is off screen
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || typeof svg.pauseAnimations !== "function") return;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduce) {
      svg.pauseAnimations();
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) =>
        entry.isIntersecting ? svg.unpauseAnimations() : svg.pauseAnimations(),
      { threshold: 0.1 },
    );
    io.observe(svg);
    return () => io.disconnect();
  }, []);

  return (
    <div className="art art-api" aria-hidden="true">
      <svg
        ref={svgRef}
        viewBox="0 0 300 225"
        preserveAspectRatio="xMidYMid meet"
      >
        {FLOWS.map((f) => (
          <path
            key={f.d}
            d={f.d}
            fill="none"
            stroke="#111"
            strokeOpacity={f.o}
            strokeWidth={f.w}
            strokeLinecap="round"
          />
        ))}
        {/* sources and destinations */}
        {[48, 112, 176].map((y) => (
          <circle
            key={`s${y}`}
            cx="30"
            cy={y}
            r="6"
            fill="#fff"
            stroke="#111"
            strokeWidth="2"
          />
        ))}
        {[58, 112, 166].map((y) => (
          <circle
            key={`t${y}`}
            cx="270"
            cy={y}
            r="6"
            fill="#fff"
            stroke="#111"
            strokeWidth="2"
          />
        ))}
        {/* the API in the middle */}
        <rect x="124" y="92" width="52" height="40" rx="12" fill="#111" />
        <text
          x="150"
          y="117"
          textAnchor="middle"
          fontSize="13"
          fontWeight="800"
          fill="#e8ff47"
          fontFamily="system-ui, sans-serif"
        >
          API
        </text>
        {/* requests travelling along the flows */}
        {FLOWS.map((f, i) => (
          <circle
            key={`p${i}`}
            r="4.2"
            fill={i === 1 ? "#e8ff47" : "#111"}
            stroke={i === 1 ? "#111" : "none"}
            strokeWidth="1.4"
          >
            <animateMotion
              dur="3.6s"
              begin={`${f.begin}s`}
              repeatCount="indefinite"
              path={f.d}
            />
          </circle>
        ))}
      </svg>
      <span className="p-pill p-pill1 a-build" style={{ "--d": 0.4 }}>
        POST /orders
      </span>
      <span className="p-pill p-pill2 a-build" style={{ "--d": 1.6 }}>
        200 OK
      </span>
      <span className="p-pill p-pill3 a-build" style={{ "--d": 2.8 }}>
        12 ms
      </span>
    </div>
  );
}

/* ---------- Performance: slow bars shrink and the fast one lights up ---------- */
const BARS = [
  [88, 40],
  [74, 30],
  [92, 44],
  [70, 26],
  [84, 34],
  [96, 20],
  [78, 38],
  [90, 18],
  [72, 32],
  [86, 36],
  [80, 24],
  [94, 40],
  [76, 28],
];
const STAR_BAR = 7; // the highlighted bar

function SpeedArt() {
  return (
    <div className="art art-speed" aria-hidden="true">
      <div className="s-bars">
        {BARS.map(([h0, h1], i) => (
          <span
            key={i}
            className={`s-bar${i === STAR_BAR ? " is-star" : ""}`}
            style={{ "--h0": `${h0}%`, "--h1": `${h1}%`, "--d": i * 0.07 }}
          />
        ))}
      </div>
      <span className="s-pill a-build" style={{ "--d": 1.2 }}>
        ↓ 62% load time
      </span>
      <span className="s-axis">
        <span>BEFORE</span>
        <span>AFTER</span>
      </span>
    </div>
  );
}

/* ---------- Start a project: a prompt box that types out ideas ---------- */
const PHRASES = [
  "An online store with secure payments",
  "A booking app for my clinic",
  "A dashboard for our sales team",
  "A brand video and a new website",
];

export function PromptArt() {
  const ref = useRef(null);
  const reduce = useRef(false);
  const [text, setText] = useState(PHRASES[0]);
  const [live, setLive] = useState(false);

  useEffect(() => {
    reduce.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const el = ref.current;
    if (!el || reduce.current) return;
    const io = new IntersectionObserver(
      ([entry]) => setLive(entry.isIntersecting),
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // types a phrase, holds it, deletes it, then starts the next one
  useEffect(() => {
    if (!live) return;
    let i = 0;
    let p = 0;
    let mode = "type";
    let timer;
    const step = () => {
      const phrase = PHRASES[p];
      if (mode === "type") {
        i += 1;
        setText(phrase.slice(0, i));
        if (i >= phrase.length) {
          mode = "hold";
          timer = setTimeout(step, 1700);
        } else timer = setTimeout(step, 48);
      } else if (mode === "hold") {
        mode = "erase";
        timer = setTimeout(step, 30);
      } else {
        i -= 1;
        setText(phrase.slice(0, Math.max(i, 0)));
        if (i <= 0) {
          mode = "type";
          p = (p + 1) % PHRASES.length;
          timer = setTimeout(step, 350);
        } else timer = setTimeout(step, 22);
      }
    };
    timer = setTimeout(step, 400);
    return () => clearTimeout(timer);
  }, [live]);

  return (
    <div className="art art-prompt" ref={ref}>
      <div className="pr-head">
        <span className="pr-ic" aria-hidden="true">
          ✦
        </span>
        <b>GH Studios</b>
      </div>
      <p className="pr-q">What are you building?</p>
      <div className="pr-box" aria-hidden="true">
        <span>{text}</span>
        <i className="pr-caret" />
      </div>
      <Link to="/contact" className="pr-btn">
        Start a project <span aria-hidden="true">✦</span>
      </Link>
    </div>
  );
}

const ARTS = {
  web: WebArt,
  design: DesignArt,
  backend: BackendArt,
  api: ApiArt,
  speed: SpeedArt,
};

export function ServiceArt({ kind }) {
  const Art = ARTS[kind];
  return Art ? <Art /> : null;
}
