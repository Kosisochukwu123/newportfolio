import { useEffect, useState } from "react";
import "./Loader.css";

export default function Loader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase]       = useState(0); // 0=counting, 1=done, 2=exiting

  const lines = [
    "Initialising portfolio...",
    "Connecting to database...",
    "Loading projects...",
    "Rendering UI...",
    "Ready.",
  ];

  useEffect(() => {
    // Progress bar — goes 0→100 over ~2.4s
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) { clearInterval(interval); return 100; }
        // Ease in: fast at start, slows near end
        const remaining = 100 - p;
        const step = Math.max(1, remaining * 0.07);
        return Math.min(100, p + step);
      });
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // Cycle through terminal lines
  useEffect(() => {
    if (phase >= lines.length - 1) return;
    const t = setTimeout(() => setPhase((p) => p + 1), 480);
    return () => clearTimeout(t);
  }, [phase]);

  // Once progress hits 100, start exit animation
  useEffect(() => {
    if (progress < 100) return;
    const t = setTimeout(() => onComplete(), 600);
    return () => clearTimeout(t);
  }, [progress]);

  return (
    <div className="loader-overlay">
      <div className="loader-inner">

        {/* Logo */}
        <div className="loader-logo">
          <span className="loader-bracket">&lt;</span>
          <span className="loader-slash">/</span>
          <span className="loader-bracket">&gt;</span>
        </div>

        {/* Terminal lines */}
        <div className="loader-terminal">
          {lines.slice(0, phase + 1).map((line, i) => (
            <div
              key={i}
              className={`loader-line ${i === phase ? "loader-line-active" : "loader-line-done"}`}
            >
              <span className="loader-prompt">$</span>
              <span>{line}</span>
              {i === phase && progress < 100 && (
                <span className="loader-cursor">▋</span>
              )}
              {i === phase && progress >= 100 && (
                <span className="loader-check">✓</span>
              )}
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="loader-bar-track">
          <div
            className="loader-bar-fill"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="loader-percent">
          {Math.round(progress)}<span>%</span>
        </div>

      </div>
    </div>
  );
}
