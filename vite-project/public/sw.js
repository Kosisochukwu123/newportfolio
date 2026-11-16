
const SHELL_CACHE = "gh-studios-shell-v1";
const IMAGE_CACHE = "gh-studios-images-v2";

// Install the application shell and its generated assets.
self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(SHELL_CACHE);

      const manifestResponse = await fetch("/precache-manifest.json", {
        cache: "no-cache",
      });

      if (!manifestResponse.ok) {
        throw new Error("Could not load offline precache manifest");
      }

      const files = await manifestResponse.json();

      // Cache the homepage first so an offline fallback is available.
      await cache.add("/index.html");

      // Cache individual files so one missing optional file
      // doesn't prevent the entire service worker from installing.
      const results = await Promise.allSettled(
        files
          .filter((url) => url !== "/index.html")
          .map(async (url) => {
            const response = await fetch(url);

            if (!response.ok) {
              throw new Error(`Failed to cache ${url}`);
            }

            await cache.put(url, response);
          }),
      );

      const failures = results.filter(
        (result) => result.status === "rejected",
      );

      console.log(
        `[GH Studios] Offline shell cached: ${files.length - failures.length} files`,
      );

      if (failures.length) {
        console.warn(
          "[GH Studios] Some optional files could not be cached:",
          failures.length,
        );
      }

      await self.skipWaiting();
    })(),
  );
});

// Clean up older versions and take control of open pages.
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys();

      await Promise.all(
        cacheNames
          .filter(
            (name) =>
              (name.startsWith("gh-studios-shell-") &&
                name !== SHELL_CACHE) ||
              (name.startsWith("gh-studios-images-") &&
                name !== IMAGE_CACHE),
          )
          .map((name) => caches.delete(name)),
      );

      await self.clients.claim();
    })(),
  );
});

// Proactively cache public content images.
self.addEventListener("message", (event) => {
  if (event.data?.type !== "CACHE_PUBLIC_IMAGES") return;

  const urls = Array.isArray(event.data.urls) ? event.data.urls : [];

  event.waitUntil(
    (async () => {
      const cache = await caches.open(IMAGE_CACHE);

      await Promise.all(
        urls.map(async (url) => {
          try {
            const parsed = new URL(url, self.location.origin);

            if (!["http:", "https:"].includes(parsed.protocol)) return;

            const request = new Request(parsed.href, {
              mode: "no-cors",
            });

            const response = await fetch(request);

            if (response.ok || response.type === "opaque") {
              await cache.put(request, response.clone());
            }
          } catch {
            // Continue if an individual image cannot be cached.
          }
        }),
      );
    })(),
  );
});

// Handle website navigation, application assets and images.
self.addEventListener("fetch", (event) => {
  const request = event.request;

  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // Handle images, including external Cloudinary images.
  if (request.destination === "image") {
    const refreshPromise = caches.open(IMAGE_CACHE).then(async (cache) => {
      const response = await fetch(request);

      if (response.ok || response.type === "opaque") {
        await cache.put(request, response.clone());
      }

      return response;
    });

    event.waitUntil(refreshPromise.catch(() => {}));

    event.respondWith(
      (async () => {
        const cache = await caches.open(IMAGE_CACHE);
        const savedImage = await cache.match(request);

        if (savedImage) return savedImage;

        try {
          return await refreshPromise;
        } catch {
          return new Response("", {
            status: 503,
            statusText: "Image unavailable offline",
          });
        }
      })(),
    );

    return;
  }

  // Only handle the website's own files below this point.
  if (url.origin !== self.location.origin) return;

  // Navigation: try the network first, then use saved HTML.
  if (request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const response = await fetch(request);

          if (response.ok) {
            const cache = await caches.open(SHELL_CACHE);

            const path =
              url.pathname === "/"
                ? "/index.html"
                : url.pathname.endsWith("/")
                  ? `${url.pathname}index.html`
                  : `${url.pathname}/index.html`;

            await cache.put(path, response.clone());
          }

          return response;
        } catch {
          const cache = await caches.open(SHELL_CACHE);

          const path =
            url.pathname === "/"
              ? "/index.html"
              : url.pathname.endsWith("/")
                ? `${url.pathname}index.html`
                : `${url.pathname}/index.html`;

          const savedPage = await cache.match(path);

          if (savedPage) return savedPage;

          const homepage = await cache.match("/index.html");

          if (homepage) return homepage;

          return new Response("GH Studios is unavailable offline.", {
            status: 503,
            headers: { "Content-Type": "text/plain" },
          });
        }
      })(),
    );

    return;
  }

  // Application JavaScript, CSS, fonts and other local assets.
  event.respondWith(
    (async () => {
      const cache = await caches.open(SHELL_CACHE);
      const savedFile = await cache.match(request);

      if (savedFile) return savedFile;

      try {
        const response = await fetch(request);

        if (response.ok) {
          await cache.put(request, response.clone());
        }

        return response;
      } catch {
        return new Response("File unavailable offline.", {
          status: 503,
          headers: { "Content-Type": "text/plain" },
        });
      }
    })(),
  );
});
