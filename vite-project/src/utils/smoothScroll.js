import Lenis from "lenis";

let lenis = null;

// duration/easing control how "heavy" the glide feels — higher duration
// = slower, more luxurious deceleration. Tune to taste.
export function initSmoothScroll() {
  if (lenis) return lenis;

  lenis = new Lenis({
    duration: 1.3,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 1.5,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  return lenis;
}

export function getLenis() {
  return lenis;
}

export function destroySmoothScroll() {
  lenis?.destroy();
  lenis = null;
}