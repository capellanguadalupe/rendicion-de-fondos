const CACHE = "rendicion-v13";
const SHELL = ["./", "index.html", "config.js", "manifest.webmanifest", "icon-192.png", "icon-512.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== "GET" || url.hostname.endsWith("googleapis.com") && url.hostname.startsWith("firestore")) return;
  const sameOrigin = url.origin === location.origin;
  if (sameOrigin) {
    // Páginas y configuración: primero la red (para recibir actualizaciones), con respaldo sin conexión.
    e.respondWith(fetch(req, { cache: "no-cache" }).then(r => { const c = r.clone(); caches.open(CACHE).then(x => x.put(req, c)); return r; }).catch(() => caches.match(req).then(m => m || caches.match("index.html"))));
  } else {
    // Librerías externas y fuentes: del caché si ya están, y se actualizan en segundo plano.
    e.respondWith(caches.match(req).then(m => {
      const net = fetch(req).then(r => { if (r && (r.ok || r.type === "opaque")) { const c = r.clone(); caches.open(CACHE).then(x => x.put(req, c)); } return r; }).catch(() => m);
      return m || net;
    }));
  }
});
