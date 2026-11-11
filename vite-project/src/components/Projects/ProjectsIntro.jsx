// ProjectsIntro.jsx — NEW. The big header that opens the Projects section:
// a teddy pops up and waves, then the headline rises in word by word.
// It is the first block in the stack, so the first project slides up over it.

// Change the headline here. Each inner array is one line.
const LINES = [
  ["Recent", "work,"],
  ["freshly", "built", "&", "deployed."],
];
// The speech bubble beside the teddy: a bold opener, then a longer line.
const GREETING_LEAD = "Hi there!";
const GREETING_TEXT =
  "Take a look around. These are projects we\u2019ve built and shipped for real clients, and every one of them is live.";

const LINE = "#3a2216";
const FUR = "#b9693b";
const SNOUT = "#ecc08f";
const SHIRT = "#f4efe6";
const STRIPE = "#5560b8";
const PANTS = "#6a2f34";

// An original teddy, drawn as SVG so every part can move on its own.
function Teddy() {
  const limb = (x1, y1, x2, y2, color, w) => (
    <>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={LINE} strokeWidth={w + 5} strokeLinecap="round" />
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={w} strokeLinecap="round" />
    </>
  );

  return (
    <svg
      className="pi-teddy"
      viewBox="44 18 136 234"
      role="img"
      aria-label="A friendly teddy bear waving hello"
    >
      <g className="tw-body">
        {/* legs and feet */}
        {limb(86, 196, 86, 228, PANTS, 19)}
        {limb(114, 196, 114, 228, PANTS, 19)}
        <ellipse cx="80" cy="238" rx="16" ry="9" fill={FUR} stroke={LINE} strokeWidth="2.5" />
        <ellipse cx="120" cy="238" rx="16" ry="9" fill={FUR} stroke={LINE} strokeWidth="2.5" />

        {/* resting arm */}
        {limb(72, 130, 60, 172, FUR, 15)}
        <circle cx="59" cy="176" r="9" fill={FUR} stroke={LINE} strokeWidth="2.5" />

        {/* striped shirt */}
        <clipPath id="pi-teddy-clip">
          <rect x="64" y="108" width="72" height="94" rx="26" />
        </clipPath>
        <rect x="64" y="108" width="72" height="94" rx="26" fill={SHIRT} />
        <g clipPath="url(#pi-teddy-clip)">
          <rect x="60" y="128" width="80" height="10" fill={STRIPE} />
          <rect x="60" y="150" width="80" height="10" fill={STRIPE} />
          <rect x="60" y="172" width="80" height="10" fill={STRIPE} />
          <rect x="60" y="190" width="80" height="16" fill={PANTS} />
        </g>
        <rect x="64" y="108" width="72" height="94" rx="26" fill="none" stroke={LINE} strokeWidth="2.5" />

        {/* waving arm: swings from the shoulder */}
        <g className="tw-arm">
          {limb(130, 128, 162, 84, FUR, 15)}
          <circle cx="164" cy="80" r="10" fill={FUR} stroke={LINE} strokeWidth="2.5" />
        </g>

        {/* head */}
        <g className="tw-head">
          <circle cx="64" cy="38" r="15" fill={FUR} stroke={LINE} strokeWidth="2.5" />
          <circle cx="136" cy="38" r="15" fill={FUR} stroke={LINE} strokeWidth="2.5" />
          <circle cx="64" cy="38" r="8" fill={SNOUT} />
          <circle cx="136" cy="38" r="8" fill={SNOUT} />
          <circle cx="100" cy="72" r="42" fill={FUR} stroke={LINE} strokeWidth="2.5" />
          <circle cx="76" cy="84" r="6" fill="#f19a8f" opacity="0.55" />
          <circle cx="124" cy="84" r="6" fill="#f19a8f" opacity="0.55" />
          <ellipse className="tw-eye" cx="84" cy="66" rx="4.5" ry="5.5" fill={LINE} />
          <ellipse className="tw-eye" cx="116" cy="66" rx="4.5" ry="5.5" fill={LINE} />
          <ellipse cx="100" cy="86" rx="19" ry="14" fill={SNOUT} stroke={LINE} strokeWidth="2.5" />
          <ellipse cx="100" cy="80" rx="7" ry="5" fill={LINE} />
          <path d="M100 85 V90 M92 90 Q100 98 108 90" fill="none" stroke={LINE} strokeWidth="2.5" strokeLinecap="round" />
        </g>
      </g>
    </svg>
  );
}

// each word gets a running number (0, 1, 2...) so they can rise one after another
const NUMBERED = LINES.reduce(
  (acc, line) => {
    const words = line.map((word, k) => ({ word, i: acc.n + k }));
    return { n: acc.n + line.length, lines: [...acc.lines, words] };
  },
  { n: 0, lines: [] },
).lines;

export default function ProjectsIntro({ cardRef }) {
  return (
    <article ref={cardRef} className="ps-card ps-intro" style={{ zIndex: 1 }}>
      {/* teddy and speech bubble sit in a row, so the bubble's text always
          wraps inside the space that is left (nothing runs off the screen) */}
      <div className="pi-top">
        <div className="pi-bear">
          <Teddy />
        </div>
        <p className="pi-bubble">
          <strong>{GREETING_LEAD}</strong> {GREETING_TEXT}
        </p>
      </div>

      <h2 className="pi-title" aria-label={LINES.map((l) => l.join(" ")).join(" ")}>
        {NUMBERED.map((line, li) => (
          <span className="pi-line" key={li} aria-hidden="true">
            {line.map(({ word, i }) => (
              <span className="pi-w" key={i}>
                <span className="pi-wi" style={{ "--w": i }}>
                  {word}
                </span>
              </span>
            ))}
          </span>
        ))}
      </h2>
    </article>
  );
}