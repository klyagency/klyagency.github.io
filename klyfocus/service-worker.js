self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('klyfocus-cache').then((cache) => {
      return cache.addAll([
        '/klyfocus/index.html',
        '/klyfocus/logo.jpg',
        '/klyfocus/manifest.json',
        '/klyfocus/web-app-manifest-192x192.png',
        '/klyfocus/web-app-manifest-512x512.png',
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