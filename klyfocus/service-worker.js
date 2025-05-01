const CACHE_NAME = 'kly-focus-cache-v1';
const urlsToCache = [
  '/klyfocus/', 
  '/klyfocus/index.html', 
  '/klyfocus/manifest.json',
  '/klyfocus/web-app-manifest-192x192.png',
  '/klyfocus/web-app-manifest-512x512.png',
  '/klyfocus/offline.html', // Página para modo offline
];

self.addEventListener('install', event => {
  console.log('[Service Worker] Instalando...');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[Service Worker] Cacheando archivos...');
      return cache.addAll(urlsToCache);
    }).catch(error => {
      console.error('[Service Worker] Error al cachear archivos:', error);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request).catch(() => {
        // Retorna una página offline si falla la solicitud
        return caches.match('/klyfocus/offline.html');
      });
    }).catch(error => {
      console.error('[Service Worker] Error en fetch:', error);
    })
  );
});

self.addEventListener('activate', event => {
  console.log('[Service Worker] Activando...');
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
            console.log(`[Service Worker] Eliminando caché antiguo: ${cacheName}`);
            return caches.delete(cacheName);
          }
        })
      );
    }).catch(error => {
      console.error('[Service Worker] Error al activar:', error);
    })
  );
});