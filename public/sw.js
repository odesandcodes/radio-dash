// radidash service worker: makes the app installable in Chrome and caches
// the app shell for fast loads. Audio streams are cross-origin and are
// never cached. Navigation requests always go to the network first, so a
// new deploy shows up right away; the cache is only an offline fallback.
const CACHE = 'radidash-v1';

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE)
            .then((cache) => cache.addAll([
                '/',
 '/manifest.webmanifest',
                '/icon-192.png',
                '/icon-512.png'
            ]))
            .then(() => self.skipWaiting())
            .catch(() => {})
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then((keys) => Promise.all(
                keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))
            ))
            .then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;
    const url = new URL(event.request.url);
    if (url.origin !== self.location.origin) return; // leave streams alone

    // Page loads: network first, so deploys are never stale.
    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request).catch(() => caches.match('/'))
        );
        return;
    }

    // Static assets: cache first, refresh the cache in the background.
    event.respondWith(
        caches.match(event.request).then((hit) => {
            const network = fetch(event.request).then((res) => {
                if (res.ok) {
                    const copy = res.clone();
                    caches.open(CACHE).then((cache) => cache.put(event.request, copy));
                }
                return res;
            }).catch(() => hit);
            return hit || network;
        })
    );
});
