// Orbital Command service worker: offline play. Bump CACHE on each release so updates arrive.
const CACHE='oc-v4',CORE=['./','./index.html','./defence.html','./solar-sandbox.html','./js/sim.js','./js/globe.js','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>Promise.all(CORE.map(u=>c.add(u).catch(()=>{})))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
const put=(r,res)=>{if(res&&(res.ok||res.type==='opaque')){const cp=res.clone();caches.open(CACHE).then(c=>c.put(r,cp))}return res};
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;
 if(new URL(r.url).origin===location.origin){
  // same site: network first so updates arrive, cache when offline
  e.respondWith(fetch(r).then(res=>put(r,res)).catch(()=>caches.match(r,{ignoreSearch:true}).then(m=>m||(r.mode==='navigate'?caches.match('./index.html'):Response.error()))));
 }else{
  // CDN scripts, fonts and Earth textures: cache first, so the real globe works offline after one visit
  e.respondWith(caches.match(r).then(m=>m||fetch(r).then(res=>put(r,res))));
 }});