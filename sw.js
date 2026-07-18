/* Suisse 100 — service worker : app utilisable hors ligne (sauf tuiles de carte) */
const VERSION = "s100-v9";
const CORE = ["./", "./index.html", "./manifest.webmanifest", "./icon-180.png", "./icon-512.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET") return;

  // Tuiles OSM : réseau uniquement (politique d'usage OSM, et trop volumineux à cacher)
  if (url.hostname.endsWith("tile.openstreetmap.org")) return;

  // API des transports et météo : toujours en direct, jamais en cache
  if (url.hostname.endsWith("transport.opendata.ch")) return;
  if (url.hostname.endsWith("open-meteo.com")) return;

  // App + polices + Leaflet : cache d'abord, mise à jour en arrière-plan
  e.respondWith(
    caches.match(e.request).then(hit => {
      const refresh = fetch(e.request)
        .then(res => {
          if (res && res.ok) {
            const copy = res.clone();
            caches.open(VERSION).then(c => c.put(e.request, copy));
          }
          return res;
        })
        .catch(() => hit);
      return hit || refresh;
    })
  );
});
