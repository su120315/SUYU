// SUYU Service Worker - 离线缓存
const CACHE_NAME = 'suyu-comic-v18';
const CORE_ASSETS = [
  './',
  './index.html',
  './tools.html',
  './style.css?v=18',
  './intro.js?v=18',
  './script.js?v=18',
  './tools.js',
  './qrcode.min.js',
  './sw.js',
  'https://unpkg.com/lucide@0.460.0/dist/umd/lucide.min.js'
];

// 安装时缓存核心资源
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      // 逐个缓存，失败的资源不影响其他资源
      return Promise.all(
        CORE_ASSETS.map(function(url) {
          return cache.add(url).catch(function(err) {
            console.log('SW: 缓存失败 ' + url);
          });
        })
      );
    }).then(function() {
      return self.skipWaiting();
    })
  );
});

// 激活时清理旧缓存
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(names) {
      return Promise.all(
        names.map(function(name) {
          if (name !== CACHE_NAME) {
            console.log('SW: 删除旧缓存 ' + name);
            return caches.delete(name);
          }
        })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});

// 请求拦截：同源资源网络优先（修复/更新能及时生效），离线回退缓存；跨域资源缓存优先
self.addEventListener('fetch', function(event) {
  var request = event.request;

  // 只处理 GET 请求
  if (request.method !== 'GET') return;

  // 跳过图片代理请求（这些是动态的，不缓存）
  var url = new URL(request.url);
  if (url.hostname.includes('weserv.nl') ||
      url.hostname.includes('allorigins') ||
      url.hostname.includes('corsproxy') ||
      url.hostname.includes('codetabs') ||
      url.hostname.includes('whateverorigin')) {
    return;
  }

  // blob: 和 data: 协议不处理
  if (request.url.indexOf('blob:') === 0 || request.url.indexOf('data:') === 0) {
    return;
  }

  function cachePut(resp) {
    if (resp && resp.ok && (url.origin === self.location.origin || resp.headers.get('access-control-allow-origin'))) {
      var respClone = resp.clone();
      caches.open(CACHE_NAME).then(function(cache) {
        cache.put(request, respClone);
      });
    }
    return resp;
  }

  // 同源（HTML/JS/CSS 等）：网络优先，离线回退缓存，避免旧缓存挡住新版本
  if (url.origin === self.location.origin) {
    event.respondWith(
      fetch(request).then(cachePut).catch(function() {
        return caches.match(request).then(function(cached) {
          if (cached) return cached;
          if (request.mode === 'navigate') return caches.match('./index.html');
          return Response.error();
        });
      })
    );
    return;
  }

  // 跨域：缓存优先，后台更新
  event.respondWith(
    caches.match(request).then(function(cached) {
      if (cached) {
        fetch(request).then(cachePut).catch(function() {});
        return cached;
      }
      return fetch(request).then(cachePut).catch(function() {
        if (request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
