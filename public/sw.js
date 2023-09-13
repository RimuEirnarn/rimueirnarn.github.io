const sameDomain = (url) => location.hostname === url.hostname
const dummyDomain = (url) => "serviceworker.dummy" === url.hostname
const toBool = (data) => {
    if (data === 'false')
        return false
    if (data === 'true')
        return true
    return data ? true : false
}

const SWCacheControl = (() => {
    let state = true

    return {
        set(value) {
            state = toBool(value)
        },
        get() {
            return state
        }
    }
})()

/*
const deleteCache = async (key) => {
  await caches.delete(key);
};

const deleteOldCaches = async () => {
  const cacheKeepList = ["v2"];
  const keyList = await caches.keys();
  const cachesToDelete = keyList.filter((key) => !cacheKeepList.includes(key));
  await Promise.all(cachesToDelete.map(deleteCache));
};

self.addEventListener("activate", (event) => {
  event.waitUntil(deleteOldCaches());
});
*/

/*
 * Copied from https://glitch.com/@PaulKinlan, Glitch PWA
 */

const name = ['localhost', 'local.rimueirnarn.net'].includes(location.host) ? "debug-localhost" : "rimueirnarn-github-io"

// Specify what we want added to the cache for offline use
self.addEventListener("install", e => {
  console.log("installing...")
  e.waitUntil(
    // Give the cache a name
    caches.open(name).then(cache => {
      // Cache the homepage and stylesheets - add any assets you want to cache!
      return cache.addAll([
        "/favicon.ico",
        "/static/rimu-enhanced-reduced.png",
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
  let requestUrl = new URL(request.url)
  if (dummyDomain(requestUrl)) {
    // disable cache entirely, this is particularly useful when the cache
    // is causing trouble with updated one.
    SWCacheControl.set(request.headers.get('data'))
    return new Response(SWCacheControl.get(), {
        status: 200,
        headers: { "Content-Type": "text/javascript", "data": SWCacheControl.get() }
    })
  }

  // if cache has the response and the cache control is true.
  if (responseFromCache && SWCacheControl.get() === true) {
    console.log('returning from cache')
    return responseFromCache;
  }

  // Next try to get the resource from the network
  try {
    let externalConsent = 'no' // no cookie, this is hardcoded
    const responseFromNetwork = await fetch(request);
    // response may be used only once
    // we need to save clone to put one copy in cache
    // and serve second one
    if (sameDomain(requestUrl))
      putInCache(name, request, responseFromNetwork.clone());

    if (externalConsent === 'yes' && !sameDomain(requestUrl))
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

