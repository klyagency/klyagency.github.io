self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('klyfocus-cache').then((cache) => {
      return cache.addAll([
        '/klyfocus/index.html',
        '/logo.jpg',
        '/manifest.json',
        '/web-app-manifest-192×192.png',
        '/web-app-manifest-512×512.png',
        // Agrega más archivos que necesites cachear
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});