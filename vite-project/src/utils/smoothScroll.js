
import Lenis from "lenis";

let lenis = null;

export function initSmoothScroll() {
  if (lenis) return lenis;

  lenis = new Lenis({
    autoRaf: true,
    smoothWheel: true,
    syncTouch: false,
    wheelMultiplier: 1,
    lerp: 0.12,
  });

  window.lenis = lenis;

  return lenis;
}

export function getLenis() {
  return lenis;
}

export function destroySmoothScroll() {
  lenis?.destroy();
  lenis = null;
}
