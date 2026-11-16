const memoryCache = new Map();
const pendingDeletes = new Map();
const cacheVersions = new Map();

const DEFAULT_TTL = 5 * 60 * 1000;
const DB_NAME = "gh-studios-offline";
const DB_VERSION = 1;
const STORE_NAME = "api-cache";

function openDatabase() {
  return new Promise((resolve, reject) => {
    if (!("indexedDB" in window)) {
      reject(new Error("IndexedDB is unavailable"));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;

      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "key" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function readPersistent(key) {
  try {
    const db = await openDatabase();

    return await new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readonly");
      const request = transaction.objectStore(STORE_NAME).get(key);

      request.onsuccess = () => {
        db.close();
        resolve(request.result || null);
      };

      request.onerror = () => {
        db.close();
        reject(request.error);
      };
    });
  } catch {
    return null;
  }
}

async function writePersistent(key, value) {
  try {
    const db = await openDatabase();

    await new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readwrite");

      transaction.objectStore(STORE_NAME).put({
        key,
        value,
        updatedAt: Date.now(),
      });

      transaction.oncomplete = resolve;
      transaction.onerror = () => reject(transaction.error);
      transaction.onabort = () => reject(transaction.error);
    });

    db.close();
  } catch (error) {
    console.warn("[cache] IndexedDB write failed:", error);
  }
}

async function deletePersistent(key) {
  let db;

  try {
    db = await openDatabase();

    await new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readwrite");

      transaction.objectStore(STORE_NAME).delete(key);

      transaction.oncomplete = resolve;
      transaction.onerror = () => reject(transaction.error);
      transaction.onabort = () => reject(transaction.error);
    });
  } catch (error) {
    console.warn("[cache] IndexedDB deletion failed:", error);
  } finally {
    db?.close();
  }
}
export function getCached(key) {
  const entry = memoryCache.get(key);

  if (entry && Date.now() < entry.expires) {
    return entry.value;
  }

  if (entry) memoryCache.delete(key);

  try {
    const raw = sessionStorage.getItem(key);

    if (raw) {
      const stored = JSON.parse(raw);

      if (Date.now() < stored.expires) {
        memoryCache.set(key, stored);
        return stored.value;
      }
    }
  } catch {
    // Storage may be unavailable.
  }

  return undefined;
}

export function setCached(key, value, ttl = DEFAULT_TTL) {
  const entry = {
    value,
    expires: Date.now() + ttl,
    updatedAt: Date.now(),
  };

  memoryCache.set(key, entry);

  try {
    sessionStorage.setItem(key, JSON.stringify(entry));
  } catch {
    // IndexedDB remains the persistent backup.
  }

  void writePersistent(key, value);
}

export function clearCached(key) {
  memoryCache.delete(key);
  cacheVersions.set(key, (cacheVersions.get(key) || 0) + 1);

  try {
    sessionStorage.removeItem(key);
  } catch {
    // Ignore unavailable sessionStorage.
  }

  const deletion = deletePersistent(key);
  pendingDeletes.set(key, deletion);

  deletion.then(() => {
    if (pendingDeletes.get(key) === deletion) {
      pendingDeletes.delete(key);
    }
  });

  return deletion;
}

export async function fetchWithCache(
  key,
  fetcher,
  ttl = DEFAULT_TTL,
  forceRefresh = false,
) {
  // Wait for any pending cache deletion to finish.
  while (pendingDeletes.has(key)) {
    const pending = pendingDeletes.get(key);

    await pending;

    if (pendingDeletes.get(key) === pending) {
      pendingDeletes.delete(key);
    }
  }

  const requestVersion = cacheVersions.get(key) || 0;

  const memoryEntry = memoryCache.get(key);
  let cached = memoryEntry?.value;
  let updatedAt = memoryEntry?.updatedAt || 0;

  if (cached === undefined) {
    try {
      const raw = sessionStorage.getItem(key);

      if (raw) {
        const entry = JSON.parse(raw);
        cached = entry.value;
        updatedAt = entry.updatedAt || 0;
      }
    } catch {
      // Continue to IndexedDB.
    }
  }

  if (cached === undefined) {
    const persistent = await readPersistent(key);

    // An admin update may have happened during the IndexedDB read.
    if ((cacheVersions.get(key) || 0) !== requestVersion) {
      return fetchWithCache(key, fetcher, ttl, true);
    }

    if (persistent) {
      cached = persistent.value;
      updatedAt = persistent.updatedAt || 0;
    }
  }

  if (cached !== undefined) {
    memoryCache.set(key, {
      value: cached,
      updatedAt,
      expires: updatedAt + ttl,
    });

    if (!forceRefresh && updatedAt && Date.now() - updatedAt < ttl) {
      console.log(`[cache] HIT (fresh): ${key}`);
      return cached;
    }

    console.log(`[cache] STALE: ${key} — attempting refresh`);
  } else {
    console.log(`[cache] MISS: ${key} — fetching from network`);
  }

  try {
    let data = await fetcher();

    // If invalidated while fetching, retry instead of saving
    // a potentially outdated response.
    if ((cacheVersions.get(key) || 0) !== requestVersion) {
      console.log(`[cache] Invalidated during fetch: ${key}`);

      data = await fetcher();

      if ((cacheVersions.get(key) || 0) !== requestVersion) {
        console.warn(`[cache] Changed again during retry: ${key}`);
        return data;
      }
    }

    setCached(key, data, ttl);

    console.log(`[cache] UPDATED: ${key}`);

    return data;
  } catch (error) {
    if (
      cached !== undefined &&
      (cacheVersions.get(key) || 0) === requestVersion
    ) {
      console.warn(`[cache] Using saved offline data: ${key}`);
      return cached;
    }

    throw error;
  }
}
