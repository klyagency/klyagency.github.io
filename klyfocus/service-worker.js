const VERSION = "black-gold-gym-v4";
const CACHE_NAME = `${VERSION}-cache`;

const APP_SHELL = [
    "./",
    "./index.html",
    "./manifest.json",
    "./web-app-manifest-192x192.png"
];

// INSTALACIÓN
self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(APP_SHELL))
            .then(() => self.skipWaiting())
    );
});

// ACTIVACIÓN
self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys()
            .then(keys => {
                return Promise.all(
                    keys
                        .filter(key => key !== CACHE_NAME)
                        .map(key => caches.delete(key))
                );
            })
            .then(() => self.clients.claim())
    );
});

// PETICIONES
self.addEventListener("fetch", event => {

    // Solo GET
    if (event.request.method !== "GET") {
        return;
    }

    // HTML: SIEMPRE intenta conseguir la versión nueva de Internet
    if (event.request.mode === "navigate") {

        event.respondWith(
            fetch(event.request)
                .then(response => {

                    const copy = response.clone();

                    caches.open(CACHE_NAME)
                        .then(cache => {
                            cache.put("./index.html", copy);
                        });

                    return response;
                })
                .catch(() => {
                    return caches.match("./index.html");
                })
        );

        return;
    }

    // Resto de archivos
    event.respondWith(
        fetch(event.request)
            .then(response => {

                const copy = response.clone();

                caches.open(CACHE_NAME)
                    .then(cache => {
                        cache.put(event.request, copy);
                    });

                return response;
            })
            .catch(() => {
                return caches.match(event.request);
            })
    );
});