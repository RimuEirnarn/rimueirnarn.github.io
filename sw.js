const sameDomain = (url) => location.hostname === url.hostname

/*
 * Copied from https://glitch.com/@PaulKinlan, Glitch PWA
 */

const name = ['localhost', 'local.rimueirnarn.net'].includes(location.host) ? "debug-localhost" : "rimueirnarn-github-io"

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

const putInCache = async (cname, request, response) => {
  const cache = await caches.open(cname);
  await cache.put(request, response);
};

const cacheFirst = async (request) => {
  // First try to get the resource from the cache
  const responseFromCache = await caches.match(request);
  if (responseFromCache && name !== "debug-localhost") {
    // disable cache on local
    return responseFromCache;
  }

  // Next try to get the resource from the network
  try {
    let externalConsent = 'no' // no cookie, this is hardcoded
    const responseFromNetwork = await fetch(request);
    // response may be used only once
    // we need to save clone to put one copy in cache
    // and serve second one
    if (sameDomain(new URL(request.url)))
      putInCache(name, request, responseFromNetwork.clone());

    if (externalConsent === 'yes' && !sameDomain(new URL(request.url)))
      putInCache("external", request, responseFromNetwork.clone());

    return responseFromNetwork;
  } catch (error) {
    
    // when even the fallback response is not available,
    // there is nothing we can do, but we must always
    // return a Response object
    return new Response(`${error}`, {
      status: 408,
      headers: { "Content-Type": "text/plain" },
    });
  }
};

self.addEventListener("fetch", (event) => {
  event.respondWith(
    cacheFirst(event.request),
  );
});

