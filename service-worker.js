const CACHE='funatabi-v3-2-2-20260928';
const DATA_PATH='/data/船旅印帖_Phase1_70張母資料_v2.json';
const ASSETS=['./','./index.html','./manifest.webmanifest','./ship-tabijirushi-v3-192.png','./ship-tabijirushi-v3-512.png','./data/船旅印帖_Phase1_70張母資料_v2.json'];

self.addEventListener('install',e=>{
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));
});

self.addEventListener('activate',e=>{
  e.waitUntil(
    caches.keys()
      .then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k))))
      .then(()=>self.clients.claim())
  );
});

self.addEventListener('fetch',e=>{
  const url=new URL(e.request.url);
  if(url.pathname.endsWith(DATA_PATH)){
    e.respondWith(
      fetch(e.request,{cache:'no-store'})
        .then(r=>{
          if(r&&r.ok){
            const copy=r.clone();
            caches.open(CACHE).then(c=>c.put(e.request,copy));
          }
          return r;
        })
        .catch(()=>caches.match(e.request))
    );
    return;
  }
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));
});
