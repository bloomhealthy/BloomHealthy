const CACHE_NAME = 'Bloom-One';

const urlsToCache = [
    '../App/index.html',
     // Add the path to your offline image
    // Add other assets you want to cache
];

let failedRequests = []; // Array to store failed requests for synchronization

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== CACHE_NAME) {
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                return self.clients.claim();
            })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response;
                }

                return fetch(event.request)
                    .then(response => {
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return caches.match('./offline-placeholder-image.png'); // Return offline image
                        }

                        const responseToCache = response.clone();

                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    })
                    .catch(error => {
                        return caches.match('./offline-placeholder-image.png'); // Return offline image
                    });
            })
    );
});

self.addEventListener('sync', event => {
    if (event.tag === 'sync-failed-requests') {
        event.waitUntil(
            Promise.all(
                failedRequests.map(request => {
                    return fetch(request)
                        .then(response => {
                            if (response && response.status === 200 && response.type === 'basic') {
                                const responseToCache = response.clone();
                                caches.open(CACHE_NAME)
                                    .then(cache => {
                                        cache.put(request, responseToCache);
                                    });
                            }
                        });
                })
            )
            .then(() => {
                failedRequests = [];
            })
        );
    }
});

self.addEventListener('message', event => {
    if (event.data) {
        if (event.data.action === 'removeFromCache') {
            caches.open(CACHE_NAME).then(cache => {
                cache.delete(event.data.url)
                    .then(deleted => {
                        console.log('Removed', event.data.url, 'from cache:', deleted);
                    })
                    .catch(error => {
                        console.error('Error removing', event.data.url, 'from cache:', error);
                    });
            });
        } else if (event.data.action === 'coachData') {
            caches.keys()
                .then(cacheNames => {
                    return Promise.all(
                        cacheNames.map(cacheName => {
                            if (cacheName !== CACHE_NAME) {
                                return caches.delete(cacheName);
                            }
                        })
                    );
                })
                .then(() => {
                    return caches.open(CACHE_NAME)
                        .then(cache => {
                            return cache.addAll(urlsToCache);
                        });
                })
                .catch(error => {
                    console.error('Error caching data:', error);
                });
        } else if (event.data.action === 'skipWaiting') {
            self.skipWaiting();
        }
    }
});
