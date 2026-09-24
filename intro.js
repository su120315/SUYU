// ==================== 开场门页 ====================
// 首屏只加载这个文件：开场动画 + 三个入口 + 动效档位。
// 主程序 script.js 不在这里加载，等用户点选入口后再注入，实现「其余都在选择后加载」。

// ---- 动效档位：页面不知道设备性能，交给用户选 ----
// full = 全部动画 / lite = 只保留必要过渡 / off = 全部关闭
function getAnimLevel() {
  try {
    var saved = localStorage.getItem('suyu_anim_level');
    if (saved === 'full' || saved === 'lite' || saved === 'off') return saved;
  } catch (e) {}
  return (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) ? 'off' : 'full';
}

function applyAnimLevel(level) {
  var root = document.documentElement;
  root.classList.remove('anim-lite', 'anim-off');
  if (level === 'lite' || level === 'off') root.classList.add('anim-' + level);
}

var currentAnimLevel = getAnimLevel();
applyAnimLevel(currentAnimLevel);

// ---- 档位控件（门页与页脚共用） ----
(function initAnimLevelControls() {
  var LEVEL_TEXT = {
    full: '动效已切换：全部动画',
    lite: '动效已切换：只保留必要过渡',
    off: '动效已切换：已关闭全部动画'
  };

  function syncUI(level) {
    document.querySelectorAll('[data-anim-level-group]').forEach(function (group) {
      group.querySelectorAll('[data-anim-level]').forEach(function (btn, i) {
        var active = btn.getAttribute('data-anim-level') === level;
        btn.classList.toggle('is-active', active);
        if (active) group.style.setProperty('--i', i);   // 驱动滑块移动
      });
    });
  }

  // 切换后给个提示，让「选了有反应」看得见
  function toast(text) {
    var el = document.getElementById('animLevelToast');
    if (!el) {
      el = document.createElement('div');
      el.id = 'animLevelToast';
      el.className = 'anim-toast';
      document.body.appendChild(el);
    }
    el.textContent = text;
    el.classList.add('show');
    clearTimeout(el._timer);
    el._timer = setTimeout(function () { el.classList.remove('show'); }, 1800);
  }

  syncUI(currentAnimLevel);

  document.querySelectorAll('[data-anim-level-group]').forEach(function (group) {
    group.querySelectorAll('[data-anim-level]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var picked = btn.getAttribute('data-anim-level');
        try { localStorage.setItem('suyu_anim_level', picked); } catch (e) {}
        currentAnimLevel = picked;
        applyAnimLevel(picked);
        syncUI(picked);
        toast(LEVEL_TEXT[picked] || '动效已切换');
      });
    });
  });
})();

// ---- 门页：开场动画 → 选入口 → 再加载主程序 ----
(function initOpeningIntro() {
  var overlay = document.getElementById('introOverlay');
  if (!overlay) return;

  var appLoaded = false;
  var finished = false;

  // 用户做出选择后，才把主程序加载进来
  function loadApp() {
    if (appLoaded || document.getElementById('suyuAppScript')) return;
    appLoaded = true;
    var s = document.createElement('script');
    s.id = 'suyuAppScript';
    s.src = 'script.js';
    document.body.appendChild(s);
  }

  function dismiss() {
    if (finished) return;
    finished = true;
    overlay.classList.add('is-hidden');
    document.body.classList.remove('intro-lock');
    setTimeout(function () {
      if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
    }, 700);
  }

  // 图标库是 defer 加载的，可能还没就绪，重试几次
  function renderIcons(tries) {
    if (typeof lucide !== 'undefined') {
      try { lucide.createIcons(); } catch (e) {}
      return;
    }
    if ((tries || 0) < 25) setTimeout(function () { renderIcons((tries || 0) + 1); }, 200);
  }

  function showEntry() {
    overlay.classList.add('is-entry');
    renderIcons(0);
  }

  // 只在每台设备「首次打开」时展示门页；之后直接进入主页并立刻加载主程序
  var seen = false;
  try { seen = localStorage.getItem('suyu_intro_seen') === '1'; } catch (e) {}
  if (seen) {
    if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
    loadApp();
    return;
  }
  try { localStorage.setItem('suyu_intro_seen', '1'); } catch (e) {}

  document.body.classList.add('intro-lock');

  overlay.querySelectorAll('[data-intro-go]').forEach(function (el) {
    el.addEventListener('click', function (e) {
      // 选中的卡片先给一下反馈
      el.classList.add('is-chosen');

      if (el.getAttribute('data-intro-go') !== 'home') return;   // 编程区 / 工具区正常跳转

      e.preventDefault();
      setTimeout(function () {
        loadApp();
        dismiss();
      }, 180);
    });
  });

  // 「不加载动画」：不做开场动画，直接显示入口
  if (currentAnimLevel === 'off') {
    showEntry();
    return;
  }

  // 开场动画跑完（进度条走完）→ 显示入口
  var advanced = false;
  function advance() {
    if (advanced) return;
    advanced = true;
    showEntry();
  }

  var bar = overlay.querySelector('.intro-progress > span');
  if (bar) bar.addEventListener('animationend', advance, { once: true });
  // 兜底：动画被禁用或没触发时也能进入入口
  setTimeout(advance, currentAnimLevel === 'lite' ? 1200 : 2800);
})();