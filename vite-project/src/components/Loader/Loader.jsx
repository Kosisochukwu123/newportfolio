import { useEffect, useState } from "react";
import "./Loader.css";

export default function Loader({ onComplete = () => {} }) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState(0);
  const [exiting, setExiting] = useState(false);

  const lines = [
    "Initializing systems...",
    "Connecting cloud services...",
    "Loading business solutions...",
    "Preparing user experience...",
    "Ready for launch.",
  ];

  // progress animation
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }

        const remaining = 100 - prev;

        // smoother progress
        const step = Math.max(1, Math.ceil(remaining * 0.06));

        return Math.min(prev + step, 100);
      });
    }, 80);

    return () => clearInterval(interval);
  }, []);

  // terminal lines
  useEffect(() => {
    if (phase >= lines.length - 1) return;

    const timer = setTimeout(() => {
      setPhase((prev) => prev + 1);
    }, 500);

    return () => clearTimeout(timer);
  }, [phase]);

  // only leave after EVERYTHING is complete
  useEffect(() => {
    const finishedLines = phase === lines.length - 1;

    const finishedProgress = progress === 100;

    if (!finishedLines || !finishedProgress) return;

    setExiting(true);

    const timer = setTimeout(() => {
      onComplete?.();
    }, 700);

    return () => clearTimeout(timer);
  }, [progress, phase, onComplete]);

  return (
    <div className={`loader-overlay ${exiting ? "exiting" : ""}`}>
      <div className="loader-inner">
        <div className="loader-logo">
          <span className="loader-accent">■</span>
          <span>YourCompany</span>
        </div>

        <div className="loader-terminal">
          {lines.slice(0, phase + 1).map((line, i) => (
            <div
              key={i}
              className={`loader-line ${
                i === phase ? "loader-line-active" : "loader-line-done"
              }`}
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

        <div className="loader-bar-track">
          <div
            className="loader-bar-fill"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>

        <div className="loader-percent">
          {progress}
          <span>%</span>
        </div>
      </div>
    </div>
  );
}
