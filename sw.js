/*
 * Copied from https://glitch.com/@PaulKinlan, Glitch PWA
 */

const name = location.host == "localhost" ? "debug-localhost" : "rimueirnarn-github-io"

// Specify what we want added to the cache for offline use
self.addEventListener("install", e => {
  e.waitUntil(
    // Give the cache a name
    caches.open(name).then(cache => {
      // Cache the homepage and stylesheets - add any assets you want to cache!
      return cache.addAll([
        "/", 
        "/favicon.ico",
        "/main.html",
        "/static/main.js",
        "/static/utils.js",
        "/static/seamless.js",
        "/static/alerts.js",
        "/components/main.html",
        "/static/rimu-enhanced-reduced.png",
        "/static/color.css",
        "/.well-known/discord"
      ]);
    })
  );
});

// Network falling back to cache approach
self.addEventListener('fetch', function(event) {
  event.respondWith(
    fetch(event.request).catch(function() {
      return caches.match(event.request);
    })
  );
});

