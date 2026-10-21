/* Suisse 100 — service worker
   - fichiers de l'app : réseau d'abord (la nouvelle version s'affiche tout de suite),
     cache en secours hors ligne ou si le réseau traîne plus de 3,5 s ;
   - polices et Leaflet : cache d'abord, mis à jour en arrière-plan ;
   - API (CFF, météo, OpenStreetMap, Wikipédia) et images : jamais mises en cache ici. */
const VERSION = "s100-v14";
const CORE = ["./", "./index.html", "./app.js", "./data.js", "./images.js", "./manifest.webmanifest", "./icon-180.png", "./icon-512.png"];
const CDN = ["fonts.googleapis.com", "fonts.gstatic.com", "unpkg.com"];

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

function networkFirst(req){
  const u = new URL(req.url), key = u.search ? u.origin + u.pathname : req;   // ?v=… : une seule copie de la page
  return caches.open(VERSION).then(cache => {
    const net = fetch(req).then(res => {
      if (res && res.ok) cache.put(key, res.clone());
      return res;
    });
    const slow = new Promise(resolve => setTimeout(resolve, 3500));
    const fromCache = () => cache.match(req, { ignoreSearch: true })
      .then(hit => hit || (req.mode === "navigate" ? cache.match("./index.html") : undefined));
    // le réseau gagne s'il répond vite ; sinon le cache, et le réseau met quand même le cache à jour
    return Promise.race([net.catch(() => null), slow.then(() => "slow")]).then(r => {
      if (r && r !== "slow") return r;
      return fromCache().then(hit => hit || net);
    }).catch(() => fromCache());
  });
}

function cacheFirst(req){
  return caches.open(VERSION).then(cache => cache.match(req).then(hit => {
    const refresh = fetch(req).then(res => { if (res && (res.ok || res.type === "opaque")) cache.put(req, res.clone()); return res; }).catch(() => hit);
    return hit || refresh;
  }));
}

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin === self.location.origin) e.respondWith(networkFirst(req));
  else if (CDN.some(h => url.hostname.endsWith(h))) e.respondWith(cacheFirst(req));
  // tout le reste (API, tuiles de carte, photos) : réseau direct
});
