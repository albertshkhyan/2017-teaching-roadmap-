/* Minimal service worker — app shell can be cached for offline; lesson content stays network-first. */
const CACHE_NAME = 'learning-app-v1'

self.addEventListener('install', (event) => {
  self.skipWaiting()
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
    caches.open(CACHE_NAME).then((cache) =>
      fetch(event.request)
        .then((res) => {
          if (res.ok && res.type === 'basic') cache.put(event.request, res.clone())
          return res
        })
        .catch(() => cache.match(event.request))
    )
  )
})
