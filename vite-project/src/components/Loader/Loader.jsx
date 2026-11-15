
import { useEffect, useRef, useState } from "react";
import "./Loader.css";

const STATUS_STEPS = [
  { at: 0, label: "Compiling portfolio..." },
  { at: 25, label: "Loading assets..." },
  { at: 60, label: "Connecting..." },
  { at: 100, label: "Ready." },
];

function getStatus(progress) {
  const steps = STATUS_STEPS.filter((step) => step.at <= progress);
  return steps[steps.length - 1]?.label || STATUS_STEPS[0].label;
}

export default function Loader({
  dataReady = false,
  onComplete = () => {},
  fast = false,
}) {
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);
  const [posterReady, setPosterReady] = useState(false);

  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  // Load and decode the Hero poster while the loader is visible.
  useEffect(() => {
    let cancelled = false;

    const poster = new Image();
    poster.src = "/hero-poster.webp";

    const preparePoster = async () => {
      try {
        if (typeof poster.decode === "function") {
          await poster.decode();
        } else if (!poster.complete) {
          await new Promise((resolve) => {
            poster.onload = resolve;
            poster.onerror = resolve;
          });
        }
      } catch {
        // Don't leave the loader running forever if the image fails.
      }

      if (!cancelled) {
        setPosterReady(true);
      }
    };

    preparePoster();

    return () => {
      cancelled = true;
    };
  }, []);

  // Progress animation.
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((previous) => {
        if (previous >= 100) return 100;

        const increment = fast
          ? 4
          : Math.max(0.6, (100 - previous) * 0.055);

        return Math.min(previous + increment, 100);
      });
    }, fast ? 30 : 50);

    return () => clearInterval(interval);
  }, [fast]);

  // Only begin exiting after the poster is ready.
  useEffect(() => {
    if (progress < 100 || !posterReady) return;

    setExiting(true);

    const timer = setTimeout(() => {
      onCompleteRef.current?.();
    }, 680);

    return () => clearTimeout(timer);
  }, [progress, posterReady]);

  const status = getStatus(progress);

  return (
    <div className={`loader-overlay ${exiting ? "exiting" : ""}`}>
      {exiting && <div className="loader-flash" />}

      <div className="loader-inner">
        <div className="loader-ring-container">
          <div
            className="loader-ring"
            style={{ "--progress": `${progress}%` }}
          />

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
