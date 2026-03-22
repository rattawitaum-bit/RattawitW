```javascript
const CACHE_NAME = 'flight-stat-v1';
const urlsToCache = [
  './',
  './FLIGHT_STAT_PRO.html',
  './manifest.json'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // ออฟไลน์ให้คืนค่าจาก Cache, ออนไลน์ให้ Fetch ใหม่
        return response || fetch(event.request);
      })
  );
});
