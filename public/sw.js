/**
 * Enhanced Service Worker for PWA functionality
 * Provides offline support, caching, background sync, and push notifications
 */

const CACHE_NAME = 'long-portfolio-v2.1.0';
const STATIC_CACHE = 'static-v2.1.0';
const DYNAMIC_CACHE = 'dynamic-v2.1.0';
const IMAGE_CACHE = 'images-v2.1.0';

// Files to cache for offline functionality
const STATIC_FILES = [
  '/',
  '/index.html',
  '/manifest.json',
  '/assets/css/style.css',
  '/assets/css/modern-enhancements.css',
  '/assets/js/script.js',
  '/assets/js/modern-enhancements.js',
  '/assets/js/image-optimizer.js',
  '/assets/js/mobile-navigation.js',
  '/assets/js/mobile-accessibility.js',
  '/assets/js/mobile-css-optimizer.js',
  '/assets/js/advanced-gestures.js',
  '/assets/js/mobile-performance.js',
  '/assets/js/pwa-manager.js',
  '/assets/js/mobile-performance-monitor.js',
  '/assets/js/mobile-ui-components.js',
  '/assets/images/avatar.png',
  '/assets/images/my-avatar.png',
  '/favicon.ico',
  // Add more critical assets
];

// Routes that should always be served from network first
const NETWORK_FIRST_ROUTES = [
  '/api/',
  '/contact/',
  '/analytics/'
];

// Routes that can be served from cache first
const CACHE_FIRST_ROUTES = [
  '/assets/images/',
  '/assets/css/',
  '/assets/js/',
  '/assets/fonts/'
];

// Install event - cache static files
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log('Service Worker: Caching static files');
      return cache.addAll(STATIC_FILES);
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            console.log('Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request).then((response) => {
        // Don't cache non-successful responses
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        // Clone the response
        const responseToCache = response.clone();

        // Cache dynamic content
        caches.open(DYNAMIC_CACHE).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return response;
      }).catch(() => {
        // Return offline page for navigation requests
        if (event.request.mode === 'navigate') {
          return caches.match('/');
        }
      });
    })
  );
});

// Background sync for form submissions
self.addEventListener('sync', (event) => {
  if (event.tag === 'contact-form') {
    event.waitUntil(syncContactForm());
  }
});

// Push notifications
self.addEventListener('push', (event) => {
  const options = {
    body: 'Thanks for visiting my portfolio!',
    icon: '/assets/images/icons/icon-192x192.png',
    badge: '/assets/images/icons/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Explore Portfolio',
        icon: '/assets/images/icons/icon-72x72.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/assets/images/icons/icon-72x72.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Portfolio Update', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Helper function for background sync
async function syncContactForm() {
  // Implementation for syncing contact form data when online
  console.log('Background sync: Contact form data');
}
