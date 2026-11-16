
const IMAGE_FIELD_PATTERN = /image|photo|avatar|logo/i;

export function cachePublicImages(data) {
  if (!("serviceWorker" in navigator)) return;

  const urls = new Set(["/GHStudios-logo-preview.png"]);

  const collectImages = (value) => {
    if (!value || typeof value !== "object") return;

    if (Array.isArray(value)) {
      value.forEach(collectImages);
      return;
    }

    Object.entries(value).forEach(([key, item]) => {
      if (
        IMAGE_FIELD_PATTERN.test(key) &&
        typeof item === "string" &&
        item.trim()
      ) {
        urls.add(item.trim());
      } else if (item && typeof item === "object") {
        collectImages(item);
      }
    });
  };

  collectImages(data);

  navigator.serviceWorker.ready
    .then((registration) => {
      registration.active?.postMessage({
        type: "CACHE_PUBLIC_IMAGES",
        urls: [...urls],
      });
    })
    .catch((error) => {
      console.warn("[GH Studios] Image caching unavailable:", error);
    });
}
