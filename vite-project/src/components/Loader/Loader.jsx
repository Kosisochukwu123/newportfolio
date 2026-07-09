import { useEffect, useState } from "react";
import "./Loader.css";

// Status messages cycle based on progress thresholds. "Ready." only
// ever shows once dataReady is actually true (see the ceiling logic
// below) — it's never shown just because the cosmetic bar reached 100
// on its own, which is what used to cause the black-flash bug.
const STATUS_STEPS = [
  { at: 0, label: "Compiling portfolio..." },
  { at: 25, label: "Loading assets..." },
  { at: 60, label: "Connecting..." },
  { at: 100, label: "Ready." },
];

function getStatus(progress, dataReady) {
  if (progress >= 100 && dataReady) return "Ready.";
  // Never show "Ready." before data actually arrives, even if the
  // cosmetic bar is sitting at its 92% ceiling.
  const steps = STATUS_STEPS.filter((s) => s.at <= progress && s.label !== "Ready.");
  return steps.length ? steps[steps.length - 1].label : STATUS_STEPS[0].label;
}

// `dataReady` should reflect whether your real API calls have actually
// resolved — NOT a fixed timer. This is what fixes the "pops to black"
// bug: the loader can visually creep up to 92% on its own for a calm,
// alive feel, but it will never cross the finish line (and therefore
// never call onComplete/unmount) until the real content is ready.
export default function Loader({ dataReady = false, onComplete = () => {} }) {
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const ceiling = dataReady ? 100 : 92;
        if (prev >= ceiling) return prev;
        const remaining = ceiling - prev;
        const step = Math.max(0.4, remaining * 0.05);
        return Math.min(prev + step, ceiling);
      });
    }, 45);

    return () => clearInterval(interval);
  }, [dataReady]);

  useEffect(() => {
    if (progress < 100) return;

    setExiting(true);
    const timer = setTimeout(() => onComplete?.(), 650);
    return () => clearTimeout(timer);
  }, [progress, onComplete]);

  const status = getStatus(progress, dataReady);
  const blockCount = 10;
  const filledBlocks = Math.round((progress / 100) * blockCount);

  return (
    <div className={`loader-overlay ${exiting ? "exiting" : ""}`}>
      {/* White flash burst — plays once as the loader exits, on top of
          the dark background, before the homepage is revealed. */}
      {exiting && <div className="loader-flash" />}

      <div className="loader-inner">
        <div className="loader-mark">
          <img
            src="/GHStudios-logo-preview.png"
            alt="GH Studios"
            className="loader-logo"
          />
        </div>

        <div className="loader-track loader-track-blocks">
          {Array.from({ length: blockCount }).map((_, i) => (
            <span
              key={i}
              className={`loader-block ${i < filledBlocks ? "filled" : ""}`}
            />
          ))}
        </div>

        <p className="loader-status">{status}</p>
      </div>
    </div>
  );
}