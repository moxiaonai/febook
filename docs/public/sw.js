const CACHE_PREFIX = 'febook-pwa';
const STATIC_CACHE = CACHE_PREFIX + '-static-v1';
const RUNTIME_CACHE = CACHE_PREFIX + '-runtime-v1';

const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/404.html',
  '/manifest.webmanifest',
  '/protocol-handler.html',
  '/favicon.svg',
  '/logo.svg',
  '/pwa-180.png',
  '/pwa-192.png',
  '/pwa-512.png',
  '/pwa-maskable-512.png',
];

const CORE_ASSETS = new Set(PRECACHE_URLS.filter((url) => url !== '/'));

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) =>
        Promise.all(
          PRECACHE_URLS.map((url) =>
            cache.add(new Request(url, { cache: 'reload' })).catch(() => undefined),
          ),
        ),
      )
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith(CACHE_PREFIX) && ![STATIC_CACHE, RUNTIME_CACHE].includes(key))
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  if (request.method !== 'GET') {
    return;
  }

  const url = new URL(request.url);

  if (url.origin !== self.location.origin) {
    return;
  }

  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request));
    return;
  }

  if (shouldCacheAsset(request, url)) {
    event.respondWith(staleWhileRevalidate(request));
  }
});

function shouldCacheAsset(request, url) {
  return (
    CORE_ASSETS.has(url.pathname) ||
    url.pathname.startsWith('/static/') ||
    ['style', 'script', 'worker', 'font', 'image', 'manifest'].includes(request.destination) ||
    /\.(?:css|js|mjs|json|svg|png|jpg|jpeg|gif|webp|avif|ico|woff2?|ttf|otf)$/i.test(url.pathname)
  );
}

async function networkFirst(request) {
  const cache = await caches.open(RUNTIME_CACHE);

  try {
    const response = await fetch(request);

    if (isSuccessful(response)) {
      await cache.put(request, response.clone());
    }

    return response;
  } catch (error) {
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    return (await caches.match('/')) || (await caches.match('/index.html')) || Response.error();
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  const cachedResponse = await cache.match(request);

  const networkResponsePromise = fetch(request)
    .then((response) => {
      if (isSuccessful(response)) {
        cache.put(request, response.clone());
      }

      return response;
    })
    .catch(() => undefined);

  if (cachedResponse) {
    return cachedResponse;
  }

  return (await networkResponsePromise) || Response.error();
}

function isSuccessful(response) {
  return response && response.ok && response.type === 'basic';
}
