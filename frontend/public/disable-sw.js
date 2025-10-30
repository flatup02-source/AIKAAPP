self.addEventListener('install', function(event) {
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    self.registration.unregister().then(function() {
      return self.clients.matchAll().then(function(clients) {
        clients.forEach(client => client.navigate(client.url));
      });
    })
  );
});