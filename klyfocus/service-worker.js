// service-worker.js
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('kly-focus-cache').then(cache => {
      return cache.addAll([
        '/', // La raíz del proyecto
        'index.html', // Asegúrate de poner tus archivos estáticos
        'manifest.json',
        'web-app-manifest-192x192.png',
        'web-app-manifest-512x512.png',
        // Aquí puedes añadir más recursos que quieras cachear
      ]);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = ['kly-focus-cache'];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});