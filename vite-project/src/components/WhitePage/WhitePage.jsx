import { useEffect, useRef, useState } from "react";
import "./WhitePage.css";

function clamp(n, min = 0, max = 1) {
  return Math.min(max, Math.max(min, n));
}

export default function WhitePage() {
  const containerRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

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
      
      if (p > 0.01 && !hasStarted) {
        setHasStarted(true);
      }
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    setTimeout(update, 100);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [hasStarted]);

  // Transition phases
  const phase1Dark = clamp(progress / 0.1, 0, 1);
  const phase2Mist = clamp((progress - 0.1) / 0.2, 0, 1);
  const phase3Light = clamp((progress - 0.3) / 0.15, 0, 1);
  const phase4White = clamp((progress - 0.45) / 0.15, 0, 1);

  // Different gradient style - more atmospheric
  const bgGradient = `radial-gradient(
    ellipse at 50% ${50 + phase2Mist * 20}%,
    rgba(255, 255, 255, ${0.1 + phase3Light * 0.7}) 0%,
    rgba(200, 200, 210, ${0.05 + phase2Mist * 0.3}) 30%,
    rgba(100, 100, 120, ${0.02 + phase2Mist * 0.2}) 50%,
    rgba(40, 40, 50, ${0.01 + phase1Dark * 0.15}) 70%,
    rgba(11, 11, 12, ${0.5 - phase1Dark * 0.4}) 100%
  )`;

  // Atmospheric light beams
  const lightBeams = Array.from({ length: 20 }, (_, i) => {
    const angle = (i / 20) * Math.PI * 2 + Math.random() * 0.1;
    const distance = 40 + Math.random() * 60;
    const width = 2 + Math.random() * 4;
    const height = 50 + Math.random() * 80;
    const delay = Math.random() * 0.5;
    const duration = 8 + Math.random() * 12;
    
    return {
      id: i,
      angle,
      distance,
      width,
      height,
      delay,
      duration,
      opacity: (0.1 + Math.random() * 0.3) * phase2Mist,
    };
  });

  // Floating light orbs
  const lightOrbs = Array.from({ length: 25 }, (_, i) => {
    const x = 10 + Math.random() * 80;
    const y = 10 + Math.random() * 80;
    const size = 10 + Math.random() * 40;
    const delay = Math.random() * 1.5;
    const duration = 6 + Math.random() * 10;
    
    return {
      id: i,
      x,
      y,
      size,
      delay,
      duration,
      opacity: (0.1 + Math.random() * 0.2) * phase3Light,
      pulse: 0.5 + Math.random() * 0.5,
    };
  });

  // Sparkle particles
  const sparkles = Array.from({ length: 60 }, (_, i) => {
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const size = 1 + Math.random() * 3;
    const delay = Math.random() * 2;
    const duration = 2 + Math.random() * 3;
    
    return {
      id: i,
      x,
      y,
      size,
      delay,
      duration,
      opacity: (0.2 + Math.random() * 0.4) * phase4White,
    };
  });

  // Central glow ring
  const ringGlow = phase3Light * 0.8;

  return (
    <section
      ref={containerRef}
      className="wp-root"
      style={{
        height: "180vh",
        background: bgGradient,
        opacity: hasStarted ? 1 : 0,
        transition: "opacity 0.3s ease",
      }}
    >
      <div className="wp-sticky">
        {/* Central glow ring */}
        <div
          className="wp-ring"
          style={{
            opacity: ringGlow * 0.6,
            transform: `scale(${1 + phase3Light * 1.5}) rotate(${phase3Light * 45}deg)`,
            borderColor: `rgba(255, 255, 255, ${0.1 + ringGlow * 0.3})`,
            boxShadow: `
              0 0 ${60 + ringGlow * 200}px rgba(255, 255, 255, ${0.1 + ringGlow * 0.3}),
              inset 0 0 ${60 + ringGlow * 200}px rgba(255, 255, 255, ${0.05 + ringGlow * 0.2})
            `,
          }}
        />

        {/* Second ring */}
        <div
          className="wp-ring-secondary"
          style={{
            opacity: ringGlow * 0.4,
            transform: `scale(${1.5 + phase3Light * 1.2}) rotate(${-phase3Light * 30}deg)`,
            borderColor: `rgba(255, 255, 255, ${0.05 + ringGlow * 0.2})`,
          }}
        />

        {/* Light beams */}
        <div className="wp-beams">
          {lightBeams.map((beam) => (
            <div
              key={beam.id}
              className="wp-beam"
              style={{
                transform: `rotate(${beam.angle}rad)`,
                opacity: beam.opacity,
                width: `${beam.width}px`,
                height: `${beam.height}vh`,
                animationDelay: `${beam.delay}s`,
                animationDuration: `${beam.duration}s`,
              }}
            />
          ))}
        </div>

        {/* Floating light orbs */}
        <div className="wp-orbs">
          {lightOrbs.map((orb) => (
            <div
              key={orb.id}
              className="wp-orb-float"
              style={{
                left: `${orb.x}%`,
                top: `${orb.y}%`,
                width: `${orb.size}px`,
                height: `${orb.size}px`,
                opacity: orb.opacity,
                animationDelay: `${orb.delay}s`,
                animationDuration: `${orb.duration}s`,
              }}
            />
          ))}
        </div>

        {/* Sparkles */}
        <div className="wp-sparkles">
          {sparkles.map((sparkle) => (
            <div
              key={sparkle.id}
              className="wp-sparkle"
              style={{
                left: `${sparkle.x}%`,
                top: `${sparkle.y}%`,
                width: `${sparkle.size}px`,
                height: `${sparkle.size}px`,
                opacity: sparkle.opacity,
                animationDelay: `${sparkle.delay}s`,
                animationDuration: `${sparkle.duration}s`,
              }}
            />
          ))}
        </div>

        {/* Vertical light pillars */}
        <div
          className="wp-pillars"
          style={{
            opacity: phase2Mist * 0.3,
          }}
        >
          {Array.from({ length: 5 }, (_, i) => {
            const x = 15 + i * 17.5;
            return (
              <div
                key={i}
                className="wp-pillar"
                style={{
                  left: `${x}%`,
                  height: `${30 + phase3Light * 40}vh`,
                  opacity: 0.1 + Math.random() * 0.2,
                }}
              />
            );
          })}
        </div>

        {/* Subtle gradient overlay */}
        <div
          className="wp-overlay"
          style={{
            opacity: phase4White * 0.5,
          }}
        />
      </div>
    </section>
  );
}