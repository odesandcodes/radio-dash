// radidash service worker: makes the app installable in Chrome and caches
// the app shell for fast loads. Audio streams are cross-origin and are
// never cached. Navigation requests always go to the network first, so a
// new deploy shows up right away; the cache is only an offline fallback.
const CACHE = 'radidash-v2';

self.addEventListener('install', (event) => {
    // Cache the shell, but never let a single failed cache entry stop the
    // worker from activating: Chrome needs an ACTIVE service worker before
    // it will install the app, and the old code only called skipWaiting()
    // when every cache.add succeeded. If one file hiccuped, the worker sat
    // in "waiting" forever and Install failed with "cannot be installed".
    event.waitUntil(
        caches.open(CACHE)
            .then((cache) => Promise.allSettled([
                cache.add('/'),
                cache.add('/manifest.webmanifest'),
                cache.add('/icon-192.png'),
                cache.add('/icon-512.png')
            ]))
            .catch(() => {})
            .then(() => self.skipWaiting())
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

    // Page loads and the manifest: network first, so deploys (including
    // manifest changes like orientation) are never stale.
    if (event.request.mode === 'navigate' || url.pathname === '/manifest.webmanifest') {
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
