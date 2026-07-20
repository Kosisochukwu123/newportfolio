export function clamp(n, min = 0, max = 1) {
  return Math.min(max, Math.max(min, n));
}

export function easeInOut(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function easeOutQuint(t) {
  return 1 - Math.pow(1 - t, 5);
}