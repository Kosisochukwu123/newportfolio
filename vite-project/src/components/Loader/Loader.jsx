import { useEffect, useState } from "react";
import "./Loader.css";

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

  return (
    <div className={`loader-overlay ${exiting ? "exiting" : ""}`}>
      <div className="loader-inner">
        <div className="loader-mark">
          <img 
            src="/public/GHStudios-logo-preview.png" // Replace with your actual image filename
            alt="Logo" 
            className="loader-logo"
          />
        </div>
        <div className="loader-track">
          <div className="loader-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  );
}