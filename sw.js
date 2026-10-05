const CACHE = "hoanggia-ai-v13";
const CORE = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./expert09.html",
  "./expert09.css",
  "./expert09.js",
  "./core/multishot-engine.js",
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
  "./assets/apple-touch-icon.png",
  "./assets/brand.svg",
  "./assets/icon-192.png",
  "./assets/icon-512.png",
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
      .then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  const request = event.request;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then(response => {
          if (response && response.ok) {
            const copy = response.clone();
            caches.open(CACHE).then(cache => cache.put(request, copy));
          }
          return response;
        })
        .catch(async () => (await caches.match(request)) || (await caches.match("./index.html")))
    );
    return;
  }

  // Network-first for code/assets so a new GitHub Pages deployment is picked up immediately.
  event.respondWith(
    fetch(request)
      .then(response => {
        if (response && response.ok) {
          const copy = response.clone();
          caches.open(CACHE).then(cache => cache.put(request, copy));
        }
        return response;
      })
      .catch(() => caches.match(request))
  );
});
