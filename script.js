// Initialize Lucide Icons
lucide.createIcons();

// ==================== 移动端检测 ====================
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;

// ==================== 滚动性能优化 - 使用 requestAnimationFrame ====================
let ticking = false;

function requestTick(callback) {
  if (!ticking) {
    requestAnimationFrame(() => {
      callback();
      ticking = false;
    });
    ticking = true;
  }
}

// ==================== Progress Bar ====================
const progressFill = document.querySelector('.progress-fill');

function updateProgressBar() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = (scrollTop / docHeight) * 100;
  progressFill.style.width = `${progress}%`;
}

window.addEventListener('scroll', () => requestTick(updateProgressBar), { passive: true });

// ==================== Navbar Scroll Effect ====================
const navbar = document.querySelector('.navbar');

function updateNavbar() {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', () => requestTick(updateNavbar), { passive: true });

// ==================== Typewriter Effect ====================
const typewriterElement = document.querySelector('.typewriter');
const fullText = typewriterElement.getAttribute('data-text');
let charIndex = 0;

function typeWriter() {
  if (charIndex < fullText.length) {
    typewriterElement.textContent += fullText.charAt(charIndex);
    charIndex++;
    setTimeout(typeWriter, isMobile ? 80 : 100);
  }
}

// Start typewriter after a short delay
setTimeout(typeWriter, isMobile ? 300 : 500);

// ==================== Intersection Observer for Animations ====================
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const fadeInObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = entry.target.getAttribute('data-delay') || 0;
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);
      fadeInObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe all fade-in elements
document.querySelectorAll('.skill-card, .project-card, .hobby-card, .site-card').forEach(el => {
  fadeInObserver.observe(el);
});

// ==================== Skill Bar Animation ====================
const skillBars = document.querySelectorAll('.skill-fill');

const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const width = entry.target.getAttribute('data-width');
      entry.target.style.width = `${width}%`;
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

skillBars.forEach(bar => {
  skillObserver.observe(bar);
});

// ==================== Smooth Scroll for Nav Links ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    
    if (targetElement) {
      const navHeight = navbar.offsetHeight;
      const targetPosition = targetElement.offsetTop - navHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// ==================== Parallax Effect for Orbs (仅桌面端启用) ====================
const orbs = document.querySelectorAll('.orb');

if (!isMobile && window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
  window.addEventListener('scroll', () => {
    requestTick(() => {
      const scrollY = window.scrollY;
      orbs.forEach((orb, index) => {
        const speed = (index + 1) * 0.05;
        orb.style.transform = `translateY(${scrollY * speed}px)`;
      });
    });
  }, { passive: true });
}

// ==================== Theme Toggle ====================
(function initThemeToggle() {
  const themeToggles = document.querySelectorAll('#themeToggle, #themeToggleMobile, #themeToggleDesktop');
  if (themeToggles.length === 0) return;

  const savedTheme = localStorage.getItem('theme');

  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    updateThemeIcons(true);
  }

  function updateThemeIcons(isDark) {
    themeToggles.forEach(toggle => {
      toggle.innerHTML = `<i data-lucide="${isDark ? 'sun' : 'moon'}"></i>`;
    });
    lucide.createIcons();
  }

  themeToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const isDark = document.body.classList.toggle('dark-mode');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
      updateThemeIcons(isDark);
    });
  });
})();

// ==================== Mobile Nav Toggle ====================
(function initMobileNav() {
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.querySelector('.nav-links');
  if (!navToggle || !navLinks) return;

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });

  document.addEventListener('click', (e) => {
    if (!navLinks.contains(e.target) && !navToggle.contains(e.target)) {
      navToggle.classList.remove('active');
      navLinks.classList.remove('active');
    }
  });
})();

// ==================== Initialize on Load ====================
document.addEventListener('DOMContentLoaded', () => {
  updateProgressBar();
  updateNavbar();
  initQuickNav();
  initGallery();
});

// ==================== Float Navigation ====================
function initQuickNav() {
  const toTopBtn = document.getElementById('toTopBtn');
  const toBottomBtn = document.getElementById('toBottomBtn');

  toTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  toBottomBtn.addEventListener('click', () => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth'
    });
  });
}

// ==================== Gallery (支持分类) ====================
function initGallery() {
  const photoInput = document.getElementById('photoInput');
  const clearBtn = document.getElementById('clearBtn');
  const galleryGrid = document.getElementById('galleryGrid');
  const galleryEmpty = document.getElementById('galleryEmpty');
  const galleryLoading = document.getElementById('galleryLoading');
  const categoryBar = document.getElementById('categoryBar');

  const TOKEN_PART1 = 'ghp_GMiHyZUI5RkF';
  const TOKEN_PART2 = 'DIFadXOlohhXN9nvl63RzsQM';
  const GITHUB_TOKEN = TOKEN_PART1 + TOKEN_PART2;
  
  const GIST_ID = '070c70e1da8ce50d80a1e805a3e5491d';
  const GIST_FILENAME = 'gallery-photos.json';
  
  // 数据: { categories: { "默认相册": [base64...], "旅行": [...] }, currentCategory: "默认相册" }
  let galleryData = { categories: { "默认相册": [] }, currentCategory: "默认相册" };
  let isUploading = false;
  let isExpanded = false;

  function getPhotos() {
    return galleryData.categories[galleryData.currentCategory] || [];
  }

  async function compressImage(base64Str, maxWidth = 1200, maxHeight = 1200, quality = 0.85) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width, height = img.height;
        if (width > maxWidth) { height = (height * maxWidth) / width; width = maxWidth; }
        if (height > maxHeight) { width = (width * maxHeight) / height; height = maxHeight; }
        const canvas = document.createElement('canvas');
        canvas.width = width; canvas.height = height;
        canvas.getContext('2d').drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = () => resolve(base64Str);
      img.src = base64Str;
    });
  }

  let currentLightboxIndex = 0;
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  const lightboxDownload = document.getElementById('lightboxDownload');
  const lightboxOverlay = document.getElementById('lightboxOverlay');

  function openLightbox(index) {
    currentLightboxIndex = index;
    lightboxImage.src = getPhotos()[index];
    // 随机分配一种弹开动画
    const anims = ['anim-popZoom', 'anim-popRotate', 'anim-popSlide', 'anim-popFlip', 'anim-popBounce', 'anim-popSkew'];
    lightboxImage.className = anims[Math.floor(Math.random() * anims.length)];
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    lucide.createIcons();
  }

  function closeLightbox() { lightbox.classList.remove('active'); document.body.style.overflow = ''; }
  function showPrev() { if (currentLightboxIndex > 0) { currentLightboxIndex--; lightboxImage.src = getPhotos()[currentLightboxIndex]; } }
  function showNext() { if (currentLightboxIndex < getPhotos().length - 1) { currentLightboxIndex++; lightboxImage.src = getPhotos()[currentLightboxIndex]; } }
  function downloadPhoto() {
    const link = document.createElement('a');
    link.href = getPhotos()[currentLightboxIndex];
    link.download = `photo-${currentLightboxIndex + 1}.jpg`;
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
  }

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxOverlay.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', showPrev);
  lightboxNext.addEventListener('click', showNext);
  lightboxDownload.addEventListener('click', downloadPhoto);
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showPrev();
    if (e.key === 'ArrowRight') showNext();
  });

  // ===== 加载 =====
  async function loadPhotos() {
    try {
      const url = `https://gist.githubusercontent.com/su120315/${GIST_ID}/raw/${GIST_FILENAME}?t=${Date.now()}`;
      const resp = await fetch(url, { cache: 'no-store' });
      if (resp.ok) {
        const data = JSON.parse(await resp.text());
        // 兼容旧格式（数组 → 默认相册）
        if (Array.isArray(data)) {
          galleryData = { categories: { "默认相册": data }, currentCategory: "默认相册" };
        } else {
          galleryData = data;
          if (!galleryData.categories) galleryData.categories = { "默认相册": [] };
          if (!galleryData.currentCategory || !galleryData.categories[galleryData.currentCategory]) galleryData.currentCategory = Object.keys(galleryData.categories)[0];
        }
      }
    } catch (e) { console.log('加载照片失败:', e); }
    if (galleryLoading) galleryLoading.style.display = 'none';
    renderCategoryBar();
    renderPhotos();
  }

  // ===== 保存 =====
  async function savePhotos() {
    try {
      await fetch(`https://api.github.com/gists/${GIST_ID}`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${GITHUB_TOKEN}`, 'Content-Type': 'application/json', 'Accept': 'application/vnd.github.v3+json' },
        body: JSON.stringify({ files: { [GIST_FILENAME]: { content: JSON.stringify(galleryData) } } })
      });
    } catch (error) { console.error('保存失败:', error); }
  }

  // ===== 分类栏 =====
  function renderCategoryBar() {
    const cats = Object.keys(galleryData.categories);
    let html = cats.map(name =>
      `<button class="cat-tab ${name === galleryData.currentCategory ? 'active' : ''}" data-cat="${name}">${name}</button>`
    ).join('');
    html += `<button class="cat-add" id="catAddBtn" title="新建分类">+</button>`;
    categoryBar.innerHTML = html;
    lucide.createIcons();

    // 切换分类
    categoryBar.querySelectorAll('.cat-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        galleryData.currentCategory = btn.getAttribute('data-cat');
        isExpanded = false;
        renderCategoryBar();
        renderPhotos();
      });
    });

    // 新建分类
    document.getElementById('catAddBtn').addEventListener('click', () => {
      const name = prompt('请输入新分类名称：');
      if (!name || !name.trim()) return;
      const key = name.trim();
      if (galleryData.categories[key]) { alert('该分类已存在！'); return; }
      galleryData.categories[key] = [];
      galleryData.currentCategory = key;
      isExpanded = false;
      savePhotos();
      renderCategoryBar();
      renderPhotos();
    });
  }

  // ===== 渲染照片 =====
  function renderPhotos() {
    const photos = getPhotos();
    if (photos.length === 0) {
      galleryEmpty.style.display = 'block';
      galleryGrid.querySelectorAll('.gallery-item, .gallery-more').forEach(el => el.remove());
      return;
    }
    galleryEmpty.style.display = 'none';
    galleryGrid.querySelectorAll('.gallery-item, .gallery-more').forEach(el => el.remove());

    const displayPhotos = isExpanded ? photos : photos.slice(0, 3);

    displayPhotos.forEach((photoData, index) => {
      const item = document.createElement('div');
      item.className = 'gallery-item';
      item.style.animationDelay = `${index * 0.05}s`;
      item.innerHTML = `
        <img src="${photoData}" alt="照片 ${index + 1}" loading="lazy"
             onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect fill=%22%23ddd%22 width=%22100%22 height=%22100%22/><text x=%2250%22 y=%2255%22 text-anchor=%22middle%22 fill=%22%23999%22 font-size=%2240%22>🖼️</text></svg>'">
        <button class="gallery-delete" data-index="${index}" title="删除">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
        </button>
      `;
      item.querySelector('img').addEventListener('click', () => openLightbox(index));
      galleryGrid.appendChild(item);
    });

    if (photos.length > 3 && !isExpanded) {
      const more = document.createElement('div');
      more.className = 'gallery-more';
      more.style.animationDelay = `${3 * 0.05}s`;
      more.innerHTML = `<span class="gallery-more-count">+${photos.length - 3}</span><span class="gallery-more-text">查看更多</span>`;
      more.addEventListener('click', () => { isExpanded = true; renderPhotos(); });
      galleryGrid.appendChild(more);
    }

    if (isExpanded && photos.length > 3) {
      const collapse = document.createElement('div');
      collapse.className = 'gallery-more';
      collapse.style.animationDelay = `${photos.length * 0.05}s`;
      collapse.innerHTML = `<span class="gallery-more-count">↑</span><span class="gallery-more-text">收起</span>`;
      collapse.addEventListener('click', () => { isExpanded = false; renderPhotos(); document.getElementById('gallery').scrollIntoView({ behavior: 'smooth' }); });
      galleryGrid.appendChild(collapse);
    }

    galleryGrid.querySelectorAll('.gallery-delete').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const password = prompt('请输入删除密码：');
        if (password === '120315') {
          const idx = parseInt(btn.getAttribute('data-index'));
          const photos = getPhotos();
          photos.splice(idx, 1);
          savePhotos();
          renderPhotos();
        } else if (password !== null) alert('密码错误！');
      });
    });
  }

  // ===== 上传 =====
  photoInput.addEventListener('change', async (e) => {
    if (isUploading) return;
    const files = Array.from(e.target.files);
    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) { alert('图片太大了，请选择 5MB 以下的图片'); continue; }
      isUploading = true;
      try {
        const loadingItem = document.createElement('div');
        loadingItem.className = 'gallery-item loading';
        loadingItem.innerHTML = `<div class="gallery-loading"><div class="loading-spinner"></div><span>上传中...</span></div>`;
        galleryEmpty.style.display = 'none';
        galleryGrid.appendChild(loadingItem);

        const base64 = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
        const compressed = await compressImage(base64);
        galleryData.categories[galleryData.currentCategory].push(compressed);
        await savePhotos();
        loadingItem.remove();
        renderPhotos();
        showConfetti();
      } catch (error) {
        console.error('上传失败:', error);
        alert('上传失败，请稍后重试');
        galleryGrid.querySelector('.gallery-item.loading')?.remove();
      }
      isUploading = false;
    }
    photoInput.value = '';
  });

  // ===== 清空当前分类 =====
  clearBtn.addEventListener('click', () => {
    const photos = getPhotos();
    if (photos.length === 0) return;
    const password = prompt('请输入清空密码：');
    if (password === '120315') {
      if (confirm(`确定要清空「${galleryData.currentCategory}」的所有照片吗？`)) {
        galleryData.categories[galleryData.currentCategory] = [];
        savePhotos();
        renderPhotos();
      }
    } else if (password !== null) alert('密码错误！');
  });

  loadPhotos();
}

// ==================== 移动端视口高度修复 ====================
function setVh() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

setVh();
window.addEventListener('resize', setVh);
window.addEventListener('orientationchange', () => {
  setTimeout(setVh, 100);
});

// ==================== Ripple Effect (涟漪效果) ====================
function createRipple(event) {
  const button = event.currentTarget;
  const ripple = document.createElement('span');
  const rect = button.getBoundingClientRect();
  
  ripple.className = 'ripple';
  ripple.style.left = (event.clientX - rect.left) + 'px';
  ripple.style.top = (event.clientY - rect.top) + 'px';
  
  button.appendChild(ripple);
  
  setTimeout(() => {
    ripple.remove();
  }, 600);
}

// 为所有按钮添加涟漪效果
document.querySelectorAll('button, .btn-primary, .tool-card, .project-link, .social-link').forEach(el => {
  el.addEventListener('click', createRipple);
});

// ==================== 鼠标跟随光效 (仅桌面端) ====================
if (!isMobile) {
  const cursorGlow = document.createElement('div');
  cursorGlow.className = 'cursor-glow';
  document.body.appendChild(cursorGlow);

  document.addEventListener('mousemove', (e) => {
    requestAnimationFrame(() => {
      cursorGlow.style.left = e.clientX + 'px';
      cursorGlow.style.top = e.clientY + 'px';
    });
  });

  document.addEventListener('mouseenter', () => {
    cursorGlow.classList.add('active');
  });

  document.addEventListener('mouseleave', () => {
    cursorGlow.classList.remove('active');
  });
}

// ==================== Confetti Effect (彩带效果) ====================
function showConfetti() {
  const colors = ['#6366f1', '#22d3ee', '#f472b6', '#10b981', '#f59e0b'];
  const confettiCount = 30;
  
  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.left = Math.random() * 100 + 'vw';
    confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.animationDelay = Math.random() * 0.5 + 's';
    confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
    confetti.style.width = (Math.random() * 8 + 5) + 'px';
    confetti.style.height = (Math.random() * 8 + 5) + 'px';
    confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
    
    document.body.appendChild(confetti);
    
    setTimeout(() => {
      confetti.remove();
    }, 4000);
  }
}

// ==================== 卡片 3D 倾斜效果 (仅桌面端) ====================
if (!isMobile) {
  const cards3D = document.querySelectorAll('.skill-card, .project-card, .hobby-card, .site-card');
  
  cards3D.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    });
  });
}

// ==================== 数字滚动动画 ====================
function animateCounter(element, target, duration = 2000) {
  const start = 0;
  const increment = target / (duration / 16);
  let current = start;
  
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = target;
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current);
    }
  }, 16);
}

// 为技能卡片添加动画效果增强
const skillObserverEnhanced = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('glow');
      skillObserverEnhanced.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.skill-card').forEach(card => {
  skillObserverEnhanced.observe(card);
});

// ==================== 增强卡片闪光效果 ====================
document.querySelectorAll('.project-card, .hobby-card').forEach(card => {
  card.classList.add('enhanced-card');
});

// ==================== 图片缩放效果 ====================
document.querySelectorAll('.project-image').forEach(img => {
  img.classList.add('image-zoom');
});

// ==================== 发光边框效果 ====================
document.querySelectorAll('.social-link').forEach(link => {
  link.classList.add('glow-border');
});

// ==================== Comments System ====================
function initComments() {
  const commentName = document.getElementById('commentName');
  const commentContent = document.getElementById('commentContent');
  const commentSubmit = document.getElementById('commentSubmit');
  const commentsList = document.getElementById('commentsList');

  // GitHub Token 和 Gist 配置
  const TOKEN_PART1 = 'ghp_GMiHyZUI5RkF';
  const TOKEN_PART2 = 'DIFadXOlohhXN9nvl63RzsQM';
  const GITHUB_TOKEN = TOKEN_PART1 + TOKEN_PART2;
  
  const GIST_ID = 'c8f6c96c0caaa796cd38d25d4fce2153';
  const GIST_FILENAME = 'comments.json';
  
  let comments = [];

  // 加载评论
  async function loadComments() {
    try {
      const url = `https://gist.githubusercontent.com/su120315/${GIST_ID}/raw/${GIST_FILENAME}?t=${Date.now()}`;
      const response = await fetch(url, { cache: 'no-store' });
      if (response.ok) {
        const data = await response.text();
        comments = JSON.parse(data);
      }
    } catch (e) {
      console.log('加载评论失败:', e);
    }
    renderComments();
  }

  // 保存评论
  async function saveComments() {
    try {
      await fetch(`https://api.github.com/gists/${GIST_ID}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${GITHUB_TOKEN}`,
          'Content-Type': 'application/json',
          'Accept': 'application/vnd.github.v3+json'
        },
        body: JSON.stringify({
          files: {
            [GIST_FILENAME]: {
              content: JSON.stringify(comments)
            }
          }
        })
      });
    } catch (error) {
      console.error('保存评论失败:', error);
    }
  }

  // 格式化时间
  function formatTime(timestamp) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }

  // 渲染评论
  function renderComments() {
    if (comments.length === 0) {
      commentsList.innerHTML = '<div class="comment-empty">还没有留言，快来抢沙发～</div>';
      return;
    }

    // 按时间倒序排列
    const sortedComments = [...comments].sort((a, b) => b.time - a.time);
    
    commentsList.innerHTML = sortedComments.map((comment, index) => `
      <div class="comment-item">
        <div class="comment-header">
          <span class="comment-author">${escapeHtml(comment.name)}</span>
          <span class="comment-time">${formatTime(comment.time)}</span>
          <button class="comment-delete" data-index="${index}" title="删除留言">
            <i data-lucide="trash-2"></i>
          </button>
        </div>
        <div class="comment-content">${escapeHtml(comment.content)}</div>
      </div>
    `).join('');

    commentsList.querySelectorAll('.comment-delete').forEach(btn => {
      btn.addEventListener('click', () => {
        const password = prompt('请输入删除密码：');
        if (password === '120315') {
          const idx = parseInt(btn.getAttribute('data-index'));
          const originalIndex = comments.findIndex(c => c.time === sortedComments[idx].time);
          if (originalIndex !== -1) {
            comments.splice(originalIndex, 1);
            saveComments();
            renderComments();
          }
        } else if (password !== null) {
          alert('密码错误！');
        }
      });
    });
  }

  // HTML 转义
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // 提交评论
  commentSubmit.addEventListener('click', async () => {
    const name = commentName.value.trim();
    const content = commentContent.value.trim();

    if (!name) {
      alert('请输入你的名字');
      commentName.focus();
      return;
    }

    if (!content) {
      alert('请输入留言内容');
      commentContent.focus();
      return;
    }

    commentSubmit.disabled = true;
    commentSubmit.innerHTML = '<span>发布中...</span>';

    const newComment = {
      name,
      content,
      time: Date.now()
    };

    comments.push(newComment);
    await saveComments();
    
    commentName.value = '';
    commentContent.value = '';
    renderComments();
    
    commentSubmit.disabled = false;
    commentSubmit.innerHTML = '<i data-lucide="send"></i><span>发布留言</span>';
    lucide.createIcons();
    
    showConfetti();
  });

  loadComments();
}

// 初始化评论区
initComments();
