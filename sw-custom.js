// Service Worker personalizado para manejo de eventos en segundo plano
const CACHE_NAME = 'echo-wpa-v1'
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/pwa-192x192.png',
  '/pwa-512x512.png'
]

// Instalación del Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Cache abierto')
        return cache.addAll(urlsToCache)
      })
      .then(() => {
        console.log('Service Worker: Instalado correctamente')
        return self.skipWaiting()
      })
  )
})

// Activación del Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Eliminando cache antigua:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    }).then(() => {
      console.log('Service Worker: Activado correctamente')
      return self.clients.claim()
    })
  )
})

// Interceptar requests
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Devolver desde cache si está disponible
        if (response) {
          return response
        }
        
        // Si no está en cache, hacer fetch
        return fetch(event.request).then((response) => {
          // Verificar si es una respuesta válida
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response
          }

          // Clonar la respuesta
          const responseToCache = response.clone()

          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache)
            })

          return response
        })
      })
  )
})

// Manejar mensajes del cliente
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})

// Manejar eventos de notificación (para futuras funcionalidades)
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  
  event.waitUntil(
    clients.openWindow('/')
  )
})

// Mantener el service worker activo para eventos en segundo plano
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('Service Worker: Background sync ejecutado')
  }
})

// Manejar mensajes del cliente para eventos de auricular
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'HEADPHONE_EVENT') {
    console.log('Service Worker: Evento de auricular recibido en segundo plano')
    
    // Notificar a todos los clientes sobre el evento
    event.waitUntil(
      self.clients.matchAll().then(clients => {
        clients.forEach(client => {
          client.postMessage({
            type: 'HEADPHONE_EVENT_BACKGROUND',
            data: event.data.data
          })
        })
      })
    )
  }
})

// Mantener el service worker activo para eventos multimedia
self.addEventListener('backgroundsync', (event) => {
  console.log('Service Worker: Background sync para eventos multimedia')
})

console.log('Service Worker: Cargado correctamente')
