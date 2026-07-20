import { useEffect, useState } from "react";
import "./Loader.css";

const STATUS_STEPS = [
  { at: 0,   label: "Compiling portfolio..." },
  { at: 25,  label: "Loading assets..." },
  { at: 60,  label: "Connecting..." },
  { at: 100, label: "Ready." },
];

function getStatus(progress, dataReady) {
  if (progress >= 100 && dataReady) return "Ready.";
  const steps = STATUS_STEPS.filter((s) => s.at <= progress && s.label !== "Ready.");
  return steps.length ? steps[steps.length - 1].label : STATUS_STEPS[0].label;
}

export default function Loader({ dataReady = false, onComplete = () => {} }) {
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const ceiling = dataReady ? 100 : 92;
        if (prev >= ceiling) return prev;
        const remaining = ceiling - prev;
        const step = Math.max(0.6, remaining * 0.055);
        return Math.min(prev + step, ceiling);
      });
    }, 50);

    return () => clearInterval(interval);
  }, [dataReady]);

  useEffect(() => {
    if (progress < 100) return;

    setExiting(true);
    const timer = setTimeout(() => onComplete?.(), 680);
    return () => clearTimeout(timer);
  }, [progress, onComplete]);

  const status = getStatus(progress, dataReady);

  return (
    <div className={`loader-overlay ${exiting ? "exiting" : ""}`}>
      {exiting && <div className="loader-flash" />}

      <div className="loader-inner">
        <div className="loader-ring-container">
          {/* Neon Ring */}
          <div 
            className="loader-ring" 
            style={{ '--progress': `${progress}%` }}
          />
          
          {/* Logo inside the ring */}
          <div className="loader-logo-wrapper">
            <img
              src="/GHStudios-logo-preview.png"
              alt="GH Studios"
              className="loader-logo"
            />
          </div>
        </div>

        <p className="loader-status">{status}</p>
      </div>
    </div>
  );
}