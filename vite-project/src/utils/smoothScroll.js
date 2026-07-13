import Lenis from "lenis";

let lenis = null;

export function initSmoothScroll() {
  if (lenis) return lenis;

  lenis = new Lenis({
    autoRaf: true,
    smoothWheel: true,
    syncTouch: false,
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