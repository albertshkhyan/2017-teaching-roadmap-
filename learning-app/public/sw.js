/* Service worker — precache app shell for offline; network-first with cache fallback. */
const CACHE_NAME = 'learning-app-v2'

const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/src/main.js',
  '/src/style.css',
  '/manifest.json',
  '/vite.svg',
]

self.addEventListener('install', (event) => {
  self.skipWaiting()
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      cache.addAll(PRECACHE_URLS).catch(() => {})
    )
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return
  const url = new URL(event.request.url)
  if (url.origin !== self.location.origin) return
  event.respondWith(
    fetch(event.request)
      .then((res) => {
        if (res.ok && res.type === 'basic') {
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, res.clone()))
        }
        return res
      })
      .catch(() => caches.match(event.request))
  )
})
