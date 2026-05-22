// Service Worker for offline support and caching
const CACHE_NAME = 'ntv360-v3';
const STATIC_CACHE = [
  '/fonts/Poppins-Regular.woff2',
  '/fonts/Poppins-Bold.woff2',
  '/images/logo.avif',
  '/images/home.avif',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch event - Network First for HTML, Cache First for assets
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;
  
  // Skip API routes
  if (event.request.url.includes('/api/')) {
    return;
  }

  const url = new URL(event.request.url);
  
  // Cache-first strategy for static assets (fonts, images, CSS, JS)
  if (
    url.pathname.startsWith('/fonts/') ||
    url.pathname.startsWith('/images/') ||
    url.pathname.startsWith('/_astro/') ||
    url.pathname.match(/\.(woff2?|ttf|otf|eot|avif|webp|jpg|jpeg|png|gif|svg|css|js)$/)
  ) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request).then((fetchResponse) => {
          if (fetchResponse && fetchResponse.status === 200) {
            const responseToCache = fetchResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return fetchResponse;
        });
      })
    );
    return;
  }

  // Network-first strategy for HTML pages (always get fresh content)
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cache successful HTML responses for offline fallback
        if (response && response.status === 200 && response.type === 'basic') {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        // If network fails, try to serve from cache (offline mode)
        return caches.match(event.request);
      })
  );
});
