/*
 * Service worker: maakt de app offline bruikbaar.
 * Strategie "stale-while-revalidate": toon meteen wat in de cache zit en
 * haal op de achtergrond de nieuwste versie op voor de volgende keer.
 * Verhoog CACHE_VERSION wanneer bestanden in APP_SHELL wijzigen van naam.
 */
'use strict';

const CACHE_VERSION = 'v1';
const CACHE_NAME = `lets-talk-${CACHE_VERSION}`;

const APP_SHELL = [
  './',
  'index.html',
  'manifest.webmanifest',
  'css/styles.css',
  'js/drawings.js',
  'js/phrases.js',
  'js/app.js',
  'js/pwa.js',
  'icons/icon.svg',
  'icons/icon-192.png',
  'icons/icon-512.png',
];

const CACHEABLE_ORIGINS = [
  self.location.origin,
  'https://fonts.googleapis.com',
  'https://fonts.gstatic.com',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys
          .filter((key) => key.startsWith('lets-talk-') && key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

function isCacheable(request) {
  if (request.method !== 'GET') return false;
  const { origin } = new URL(request.url);
  return CACHEABLE_ORIGINS.includes(origin);
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request, { ignoreSearch: request.mode === 'navigate' });

  const network = fetch(request)
    .then((response) => {
      // Google Fonts' stylesheet loads in no-cors mode and comes back "opaque".
      if (response.ok || response.type === 'opaque') {
        cache.put(request, response.clone()).catch((error) => {
          console.warn('[sw] Kon niet in cache opslaan:', request.url, error);
        });
      }
      return response;
    })
    .catch((error) => {
      console.warn('[sw] Netwerk niet bereikbaar:', request.url, error);
      return null;
    });

  if (cached) return cached;

  const response = await network;
  if (response) return response;

  if (request.mode === 'navigate') {
    const shell = await cache.match('index.html');
    if (shell) return shell;
  }
  return Response.error();
}

self.addEventListener('fetch', (event) => {
  if (!isCacheable(event.request)) return;
  event.respondWith(staleWhileRevalidate(event.request));
});
