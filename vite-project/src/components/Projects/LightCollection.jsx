import { useEffect, useRef, useState } from "react";
import "./LightCollection.css";

function clamp(n, min = 0, max = 1) {
  return Math.min(max, Math.max(min, n));
}

export default function LightCollection({ onComplete, triggerProgress }) {
  const containerRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let raf = 0;

    const update = () => {
      const el = containerRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const scrollable = el.offsetHeight - vh;
      const scrolled = clamp(-rect.top, 0, scrollable);
      const p = scrollable > 0 ? scrolled / scrollable : 0;
      
      setProgress(p);
      
      if (p >= 0.95 && !isComplete) {
        setIsComplete(true);
        if (onComplete) onComplete();
      }
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [onComplete, isComplete]);

  // Smooth transitions - starting from where projects left off
  const fadeIn = clamp((progress) / 0.2, 0, 1);
  const collectionPhase = clamp((progress - 0.1) / 0.4, 0, 1);
  const concentrationPhase = clamp((progress - 0.35) / 0.25, 0, 1);
  const burstPhase = clamp((progress - 0.55) / 0.2, 0, 1);
  const completePhase = clamp((progress - 0.75) / 0.15, 0, 1);

  // Background transitions from dark to white
  // Start with dark (matching projects) and gradually become white
  const bgOpacity = clamp((progress - 0.05) / 0.5, 0, 1);
  
  // Gradient overlay for seamless blending from projects
  const gradientOpacity = clamp((progress) / 0.3, 0, 1);

  // Particles with smooth appearance
  const particles = Array.from({ length: 80 }, (_, i) => {
    const angle = (i / 80) * Math.PI * 2 + Math.random() * 0.5;
    const radius = 15 + Math.random() * 70;
    const delay = Math.random() * 0.8;
    const size = 2 + Math.random() * 8;
    const speed = 0.3 + Math.random() * 0.7;
    const phaseOffset = Math.random() * Math.PI * 2;
    
    const currentRadius = radius * (1 - collectionPhase * 0.85);
    const x = 50 + Math.cos(angle + phaseOffset) * currentRadius * (1 + burstPhase * 0.3);
    const y = 50 + Math.sin(angle + phaseOffset) * currentRadius * (1 + burstPhase * 0.3);
    
    return {
      id: i,
      x,
      y,
      size: size * (1 + concentrationPhase * 3),
      delay,
      speed,
      angle: angle + collectionPhase * 2,
      opacity: clamp((1 - completePhase * 1.5) * (0.3 + fadeIn * 0.7), 0, 1),
      scale: 1 + concentrationPhase * 2 + burstPhase * 0.5,
    };
  });

  return (
    <section
      ref={containerRef}
      className="lc-root"
      style={{
        height: "150vh",
        background: `rgba(255, 255, 255, ${bgOpacity})`,
        // Start with dark background matching projects
        backgroundColor: `rgb(11, 11, 12)`,
      }}
    >
      {/* Seamless blend gradient from dark to light - starts transparent */}
      <div 
        className="lc-blend-gradient"
        style={{
          opacity: gradientOpacity,
          background: `linear-gradient(
            to bottom,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, ${0.1 * clamp((progress - 0.1) / 0.3, 0, 1)}) 15%,
            rgba(255, 255, 255, ${0.2 * clamp((progress - 0.15) / 0.3, 0, 1)}) 30%,
            rgba(255, 255, 255, ${0.4 * clamp((progress - 0.2) / 0.3, 0, 1)}) 45%,
            rgba(255, 255, 255, ${0.6 * clamp((progress - 0.25) / 0.3, 0, 1)}) 55%,
            rgba(255, 255, 255, ${0.8 * clamp((progress - 0.3) / 0.3, 0, 1)}) 70%,
            rgba(255, 255, 255, ${0.95 * clamp((progress - 0.35) / 0.3, 0, 1)}) 85%,
            rgba(255, 255, 255, 1) 100%
          )`,
        }}
      />
      
      <div className="lc-sticky">
        <div className="lc-container">
          {/* Glowing orb - appears gradually */}
          <div
            className="lc-orb"
            style={{
              transform: `scale(${1 + concentrationPhase * 2.5})`,
              opacity: clamp((1 - completePhase * 0.6) * (0.1 + fadeIn * 0.9), 0, 1),
              boxShadow: `
                0 0 ${80 + concentrationPhase * 300}px rgba(255, 255, 255, ${(0.2 + concentrationPhase * 0.4) * fadeIn}),
                0 0 ${150 + concentrationPhase * 500}px rgba(255, 255, 255, ${(0.1 + concentrationPhase * 0.3) * fadeIn}),
                0 0 ${250 + concentrationPhase * 700}px rgba(255, 255, 255, ${(0.05 + concentrationPhase * 0.2) * fadeIn})
              `,
              background: `radial-gradient(
                circle at 30% 30%,
                rgba(255, 255, 255, ${(0.3 + concentrationPhase * 0.4) * fadeIn}) 0%,
                rgba(255, 255, 255, ${(0.2 + concentrationPhase * 0.4) * fadeIn}) 30%,
                rgba(255, 255, 255, ${(0.05 + concentrationPhase * 0.2) * fadeIn}) 60%,
                rgba(255, 255, 255, 0) 100%
              )`,
            }}
          />

          {/* Particles */}
          <div className="lc-particles">
            {particles.map((p) => (
              <div
                key={p.id}
                className="lc-particle"
                style={{
                  left: `${p.x}%`,
                  top: `${p.y}%`,
                  width: `${p.size}px`,
                  height: `${p.size}px`,
                  opacity: p.opacity,
                  transform: `scale(${p.scale}) rotate(${p.angle}rad)`,
                  animationDelay: `${p.delay}s`,
                  animationDuration: `${3 / p.speed}s`,
                  background: `radial-gradient(
                    circle at 30% 30%,
                    rgba(255, 255, 255, ${(0.4 + concentrationPhase * 0.3) * fadeIn}),
                    rgba(255, 255, 255, ${(0.1 + concentrationPhase * 0.3) * fadeIn})
                  )`,
                }}
              />
            ))}
          </div>

          {/* Light rays */}
          <div
            className="lc-rays"
            style={{
              opacity: burstPhase * 0.8 * fadeIn,
              transform: `scale(${1 + burstPhase * 4})`,
            }}
          >
            {Array.from({ length: 32 }, (_, i) => {
              const angle = (i / 32) * Math.PI * 2 + burstPhase * 0.5;
              return (
                <div
                  key={i}
                  className="lc-ray"
                  style={{
                    transform: `rotate(${angle}rad)`,
                    opacity: (0.1 + Math.random() * 0.3 + burstPhase * 0.3) * fadeIn,
                    height: `${60 + burstPhase * 40}vh`,
                  }}
                />
              );
            })}
          </div>

          {/* Title - emerges gradually */}
          <div
            className="lc-title"
            style={{
              opacity: clamp((progress - 0.4) / 0.3, 0, 1) * fadeIn,
              transform: `
                translateY(${(1 - clamp((progress - 0.4) / 0.3, 0, 1)) * 60}px)
                scale(${0.7 + clamp((progress - 0.4) / 0.3, 0, 1) * 0.3})
              `,
            }}
          >
            <h2>Let's Create Something</h2>
            <p>Together, we can build the future</p>
          </div>

          {/* Progress */}
          <div className="lc-progress">
            <div
              className="lc-progress-bar"
              style={{
                width: `${collectionPhase * 100}%`,
                opacity: 0.3 + fadeIn * 0.7,
              }}
            />
          </div>

          {/* Scroll hint - fades in with everything else */}
          {progress < 0.85 && (
            <div className="lc-hint" style={{ opacity: 0.2 + fadeIn * 0.8 }}>
              <span>Continue</span>
              <span className="lc-hint-arrow">↓</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}