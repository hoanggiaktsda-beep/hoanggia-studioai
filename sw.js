const CACHE = "hoanggia-ai-v6";
const CORE = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./core/prompt-engine.js",
  "./core/edit-engine.js",
  "./core/expert-decision-layer.js",
  "./core/architectural-brain.js",
  "./core/material-engine.js",
  "./core/camera-engine.js",
  "./core/camera-decision-engine.js",
  "./core/furniture-engine.js",
  "./core/lighting-engine.js",
  "./assets/brand-mark.svg",
  "./assets/brand.svg",
  "./assets/icon-192.svg",
  "./assets/icon-512.svg",
  "./manifest.webmanifest"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(CORE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(key => key !== CACHE).map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  const request = event.request;
  const isNavigation = request.mode === "navigate";

  if (isNavigation) {
    event.respondWith(
      fetch(request)
        .then(response => {
          const copy = response.clone();
          caches.open(CACHE).then(cache => cache.put("./index.html", copy));
          return response;
        })
        .catch(() => caches.match("./index.html"))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;

      return fetch(request)
        .then(response => {
          if (response && response.ok) {
            const copy = response.clone();
            caches.open(CACHE).then(cache => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => caches.match("./index.html"));
    })
  );
});