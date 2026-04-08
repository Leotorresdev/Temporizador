const CACHE_NAME = "tempo-flow-static-v3";
const URLS_TO_CACHE = ["/manifest.json", "/icono.png", "/tempo.png"];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(URLS_TO_CACHE))
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }

          return Promise.resolve(false);
        }),
      ),
    ).then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const requestUrl = new URL(event.request.url);
  const isSameOrigin = requestUrl.origin === self.location.origin;
  const isNavigation = event.request.mode === "navigate";
  const isNextAsset = requestUrl.pathname.startsWith("/_next/");

  // Para HTML y chunks de Next preferimos red. Asi evitamos servir JS viejo del cache.
  if (isNavigation || isNextAsset) {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request).then((cached) => cached || caches.match("/"))),
    );
    return;
  }

  // Cacheamos solo assets estaticos de nuestra app.
  if (!isSameOrigin) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request).then((response) => {
        if (!response.ok) {
          return response;
        }

        const clonedResponse = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, clonedResponse);
        });

        return response;
      });
    }),
  );
});
