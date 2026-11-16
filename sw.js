const V="muscu-v1",IMG="muscu-img";
self.addEventListener("install",e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(["./","index.html","data.js","manifest.webmanifest","icon-192.png"])).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V&&k!==IMG).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
  const r=e.request;if(r.method!=="GET")return;
  const u=new URL(r.url),own=u.origin===location.origin;
  const isImg=own&&/\/i\/[^/]+\.webp$/.test(u.pathname),isFont=/(^|\.)fonts\.(googleapis|gstatic)\.com$/.test(u.hostname);
  if(isImg||isFont){e.respondWith(caches.open(IMG).then(c=>c.match(r).then(h=>h||fetch(r).then(res=>{if(res.ok||res.type==="opaque")c.put(r,res.clone());return res}))));return}
  if(own)e.respondWith(fetch(r).then(res=>{if(res.ok){const cp=res.clone();caches.open(V).then(c=>c.put(r,cp))}return res}).catch(()=>caches.match(r,{ignoreSearch:true}).then(h=>h||caches.match("index.html"))));
});
