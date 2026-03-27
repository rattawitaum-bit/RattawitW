const CACHE_NAME = 'flight-stat-pro-v1.0.7';

// รายชื่อไฟล์พื้นฐานที่ต้องการแคชเก็บไว้ใช้ตอน Offline
const ASSETS = [
    './',
    './FLIGHT_STAT_PRO.html',
    './manifest.json',
    './icon-192.png',
    './icon-512.png'
];

self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
    );
});

// ลบแคชเวอร์ชันเก่าทิ้ง เมื่อมีการเปลี่ยนชื่อ CACHE_NAME
self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(keys.map((key) => {
                if (key !== CACHE_NAME) {
                    return caches.delete(key);
                }
            }));
        })
    );
});

// Network-First Strategy: พยายามดึงข้อมูลอัปเดตใหม่สุดจากเน็ตก่อน
// ถ้าดึงไม่ได้ (offline) ค่อยเอาของเก่าจาก Cache มาแสดง
self.addEventListener('fetch', (e) => {
    e.respondWith(
        fetch(e.request)
            .then((response) => {
                const responseClone = response.clone();
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(e.request, responseClone);
                });
                return response;
            })
            .catch(() => {
                return caches.match(e.request);
            })
    );
});
