/* =========================================================
   ROJ INSTITUTE – SERVICE WORKER (makes the site installable
   and lets pages the student has opened work offline)

   Site files: network first, so students always get the newest
   version; the saved copy is only used when there is no internet.
   Font Awesome (CDN): saved copy first, it never changes.
========================================================= */

const CACHE = "roj-html-v3";

// The pages and files a student needs first
const CORE = [
  "./",
  "./index.html",
  "./lessons.html",
  "./practice.html",
  "./tutorials.html",
  "./examples.html",
  "./arcade.html",
  "./puzzle.html",
  "./puzzle.css",
  "./puzzle.js",
  "./style.css",
  "./editor.css",
  "./highlight.css",
  "./examples.css",
  "./script.js",
  "./editor.js",
  "./highlight.js",
  "./examples.js",
  "./quiz.js",
  "./confirm-button.js",
  "./lesson-check.js",
  "./progress-report.js",
  "./images/roj-logo.png",
  "./images/icon-192.png",
  "./lessons/basics.html",
  "./lessons/links-media.html",
  "./lessons/tags.html",
  "./lessons/forms.html",
  "./lessons/advanced.html",
  "./lessons/css-js.html",
  "./manifest.webmanifest"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE)
      // One missing file must not break installing, so add them one by one
      .then((cache) => Promise.all(CORE.map((url) => cache.add(url).catch(() => null))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  // Font Awesome and other CDN files: cache first
  if (url.origin !== location.origin) {
    if (/cdnjs\.cloudflare\.com/.test(url.host)) {
      event.respondWith(
        caches.match(req).then((hit) => hit || fetch(req).then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
          return res;
        }))
      );
    }
    return;
  }

  // Our own files: network first, saved copy when offline
  event.respondWith(
    fetch(req)
      .then((res) => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
        }
        return res;
      })
      .catch(() => caches.match(req, { ignoreSearch: true })
        .then((hit) => hit || (req.mode === "navigate" ? caches.match("./index.html") : undefined)))
  );
});
