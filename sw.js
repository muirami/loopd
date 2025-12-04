// This service worker is required for the app to be installable (PWA)
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Simple pass-through strategy for MVP testing
  // This ensures the app works online without complex caching issues
  event.respondWith(fetch(event.request));
});