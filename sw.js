// SUYU 漫画 Service Worker - 离线缓存
const CACHE_NAME = 'suyu-comic-v5';
const CORE_ASSETS = [
  './',
  './index.html',
  './comic.html',
  './novel.html',
  './tools.html',
  './style.css',
  './script.js',
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

// 请求拦截：缓存优先，网络兜底
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

  event.respondWith(
    caches.match(request).then(function(cached) {
      if (cached) {
        // 有缓存就用缓存，同时后台更新
        fetch(request).then(function(resp) {
          if (resp && resp.ok) {
            caches.open(CACHE_NAME).then(function(cache) {
              cache.put(request, resp.clone());
            });
          }
        }).catch(function() {});
        return cached;
      }

      // 没缓存，尝试网络
      return fetch(request).then(function(resp) {
        // 成功则缓存同源资源
        if (resp && resp.ok && (url.origin === self.location.origin || resp.headers.get('access-control-allow-origin'))) {
          var respClone = resp.clone();
          caches.open(CACHE_NAME).then(function(cache) {
            cache.put(request, respClone);
          });
        }
        return resp;
      }).catch(function() {
        // 网络失败，如果是导航请求返回 comic.html
        if (request.mode === 'navigate') {
          return caches.match('./comic.html');
        }
      });
    })
  );
});
