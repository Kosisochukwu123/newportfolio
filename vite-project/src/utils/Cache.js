// Lightweight cache for API responses.
// - In-memory Map: fastest, lives as long as the tab/session does.
// - sessionStorage backup: survives full page reloads within the same
//   tab, but clears when the tab closes (so content can't go stale
//   forever if an admin updates something).
// - TTL-based expiry: no invalidation messaging needed — entries just
//   naturally go stale and refetch after `ttl` ms.

console.log("[cache.js] module loaded"); // proves this file is actually running

const memoryCache = new Map();
const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

function readMemory(key) {
  const entry = memoryCache.get(key);
  if (entry && Date.now() < entry.expires) return entry.value;
  if (entry) memoryCache.delete(key);
  return undefined;
}

function readSession(key) {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return undefined;

    const entry = JSON.parse(raw);
    if (Date.now() < entry.expires) {
      memoryCache.set(key, entry); // promote to memory for next time
      return entry.value;
    }
    sessionStorage.removeItem(key);
  } catch {
    // sessionStorage unavailable or corrupted entry — just miss the cache
  }
  return undefined;
}

export function getCached(key) {
  const fromMemory = readMemory(key);
  if (fromMemory !== undefined) {
    console.log(`[cache] HIT (memory): ${key}`);
    return fromMemory;
  }

  const fromSession = readSession(key);
  if (fromSession !== undefined) {
    console.log(`[cache] HIT (sessionStorage): ${key}`);
    return fromSession;
  }

  console.log(`[cache] MISS: ${key} — will fetch from network`);
  return undefined;
}

export function setCached(key, value, ttl = DEFAULT_TTL) {
  const entry = { value, expires: Date.now() + ttl };
  memoryCache.set(key, entry);
  try {
    sessionStorage.setItem(key, JSON.stringify(entry));
    console.log(`[cache] SET: ${key} (expires in ${Math.round(ttl / 1000)}s)`);
  } catch {
    console.log(`[cache] SET failed (sessionStorage blockedd?): ${key}`);
  }
}

export function clearCached(key) {
  memoryCache.delete(key);
  try {
    sessionStorage.removeItem(key);
  } catch {}
}

// Wraps a fetcher function with cache-first behavior.
// Usage: const data = await fetchWithCache("projects", () => fetch(url).then(r => r.json()));
export async function fetchWithCache(key, fetcher, ttl = DEFAULT_TTL) {
  const cached = getCached(key);
  if (cached !== undefined) return cached;

  const data = await fetcher();
  setCached(key, data, ttl);
  return data;
}