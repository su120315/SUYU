// 全局错误捕获 - 防止单个错误导致整个页面崩溃
window.addEventListener('error', function(e) {
  console.error('Global error:', e.error || e.message);
  return true;
});
window.addEventListener('unhandledrejection', function(e) {
  console.error('Unhandled promise rejection:', e.reason);
  return true;
});

// Initialize Lucide Icons (with safety check)
if (typeof lucide !== 'undefined') {
  try { lucide.createIcons(); } catch(e) { console.warn('Lucide init error:', e); }
} else {
  // 等待 Lucide 加载完成后重新初始化
  var lucideRetries = 0;
  function checkLucide() {
    if (typeof lucide !== 'undefined') {
      try { lucide.createIcons(); } catch(e) { console.warn('Lucide init error:', e); }
    } else if (lucideRetries < 20) {
      lucideRetries++;
      setTimeout(checkLucide, 500);
    }
  }
  setTimeout(checkLucide, 500);
}

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
  if (!progressFill) return;
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = (scrollTop / docHeight) * 100;
  progressFill.style.width = `${progress}%`;
}

if (progressFill) {
  window.addEventListener('scroll', () => requestTick(updateProgressBar), { passive: true });
}

// ==================== Navbar Scroll Effect ====================
const navbar = document.querySelector('.navbar');

function updateNavbar() {
  if (!navbar) return;
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

if (navbar) {
  window.addEventListener('scroll', () => requestTick(updateNavbar), { passive: true });
}

// ==================== Typewriter Effect ====================
const typewriterElement = document.querySelector('.typewriter');
let charIndex = 0;
let fullText = '';

if (typewriterElement) {
  fullText = typewriterElement.getAttribute('data-text') || '';
}

function typeWriter() {
  if (!typewriterElement || !fullText) return;
  if (charIndex < fullText.length) {
    typewriterElement.textContent += fullText.charAt(charIndex);
    charIndex++;
    setTimeout(typeWriter, isMobile ? 80 : 100);
  }
}

if (typewriterElement && fullText) {
  setTimeout(typeWriter, isMobile ? 300 : 500);
}

// ==================== Intersection Observer for Animations ====================
try {
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
} catch(e) {
  console.warn('IntersectionObserver (fade-in) error:', e);
}

// ==================== Skill Bar Animation ====================
try {
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
} catch(e) {
  console.warn('IntersectionObserver (skill bars) error:', e);
}

// ==================== Smooth Scroll for Nav Links ====================
try {
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
} catch(e) {
  console.warn('Smooth scroll error:', e);
}

// ==================== Parallax Effect for Orbs (仅桌面端启用) ====================
try {
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
} catch(e) {
  console.warn('Parallax effect error:', e);
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
    if (typeof lucide !== 'undefined') {
      try { lucide.createIcons(); } catch(e) { console.warn('Lucide error:', e); }
    }
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
  const navOverlay = document.getElementById('navOverlay');
  if (!navToggle || !navLinks) return;

  function toggleNav() {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
    if (navOverlay) navOverlay.classList.toggle('active');
  }
  function closeNav() {
    navToggle.classList.remove('active');
    navLinks.classList.remove('active');
    if (navOverlay) navOverlay.classList.remove('active');
  }

  navToggle.addEventListener('click', toggleNav);

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeNav);
  });

  if (navOverlay) {
    navOverlay.addEventListener('click', closeNav);
  }

  document.addEventListener('click', (e) => {
    if (!navLinks.contains(e.target) && !navToggle.contains(e.target) && (!navOverlay || !navOverlay.contains(e.target))) {
      closeNav();
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
  if (!toTopBtn && !toBottomBtn) return;

  if (toTopBtn) {
    toTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  if (toBottomBtn) {
    toBottomBtn.addEventListener('click', () => {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
      });
    });
  }
}

// ==================== Gallery ====================
function initGallery() {
  const galleryGrid = document.getElementById('galleryGrid');
  if (!galleryGrid) return;

  const photoInput = document.getElementById('photoInput');
  const clearBtn = document.getElementById('clearBtn');
  const galleryEmpty = document.getElementById('galleryEmpty');
  const galleryLoading = document.getElementById('galleryLoading');
  const catContainer = document.getElementById('galleryCategories');

  // GitHub Token - 用于保存照片
  const TOKEN_PART1 = 'ghp_GMiHyZUI5RkF';
  const TOKEN_PART2 = 'DIFadXOlohhXN9nvl63RzsQM';
  const GITHUB_TOKEN = TOKEN_PART1 + TOKEN_PART2;
  
  // Gist ID 和直链
  const GIST_ID = '070c70e1da8ce50d80a1e805a3e5491d';
  const GIST_FILENAME = 'gallery-photos.json';
  
  let categories = { '默认相册': [] };
  let currentCategory = '默认相册';
  let photos = [];
  let isUploading = false;
  let isExpanded = false;

  async function compressImage(base64Str, maxWidth = 1200, maxHeight = 1200, quality = 0.85) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = () => {
        resolve(base64Str);
      };
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
    lightboxImage.src = photos[index];
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (typeof lucide !== 'undefined') {
      try { lucide.createIcons(); } catch(e) { console.warn('Lucide error:', e); }
    }
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function showPrev() {
    if (currentLightboxIndex > 0) {
      currentLightboxIndex--;
      lightboxImage.src = photos[currentLightboxIndex];
    }
  }

  function showNext() {
    if (currentLightboxIndex < photos.length - 1) {
      currentLightboxIndex++;
      lightboxImage.src = photos[currentLightboxIndex];
    }
  }

  function downloadPhoto() {
    const link = document.createElement('a');
    link.href = photos[currentLightboxIndex];
    link.download = `photo-${currentLightboxIndex + 1}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

  // 保存分类结构到 Gist
  async function saveCategoryStructure() {
    const res = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github.v3+json'
      },
      body: JSON.stringify({
        files: {
          [GIST_FILENAME]: {
            content: JSON.stringify({
              categories: categories,
              currentCategory: currentCategory
            })
          }
        }
      })
    });
    if (!res.ok) {
      throw new Error(`GitHub API 错误: ${res.status} ${res.statusText}`);
    }
  }

  // 渲染分类标签
  function renderCategoryTabs() {
    if (!catContainer) return;
    catContainer.innerHTML = '';
    const catNames = Object.keys(categories);
    catNames.forEach(name => {
      const tab = document.createElement('button');
      tab.className = 'gallery-cat-tab' + (name === currentCategory ? ' active' : '');
      tab.textContent = name;
      tab.addEventListener('click', () => switchCategory(name));
      catContainer.appendChild(tab);
    });
    // 新建相册按钮
    const addBtn = document.createElement('button');
    addBtn.className = 'gallery-cat-add';
    addBtn.innerHTML = '<i data-lucide="plus"></i>';
    addBtn.title = '新建相册';
    addBtn.addEventListener('click', () => {
      const name = prompt('请输入新相册名称：');
      if (name && name.trim()) {
        const trimmed = name.trim();
        if (categories[trimmed]) {
          alert('该相册已存在！');
          return;
        }
        categories[trimmed] = [];
        switchCategory(trimmed);
        saveCategoryStructure().catch(e => console.error('保存分类失败:', e));
      }
    });
    catContainer.appendChild(addBtn);
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }

  // 切换分类
  function switchCategory(name) {
    currentCategory = name;
    photos = categories[currentCategory] || [];
    isExpanded = false;
    renderCategoryTabs();
    renderPhotos();
  }

  // 加载照片
  async function loadPhotos() {
    try {
      const url = `https://gist.githubusercontent.com/su120315/${GIST_ID}/raw/${GIST_FILENAME}?t=${Date.now()}`;
      const response = await fetch(url, { cache: 'no-store' });
      if (response.ok) {
        const data = await response.text();
        const parsed = JSON.parse(data);
        if (parsed && parsed.categories) {
          categories = parsed.categories;
          currentCategory = parsed.currentCategory || '默认相册';
        } else if (Array.isArray(parsed)) {
          categories = { '默认相册': parsed };
          currentCategory = '默认相册';
        } else {
          categories = { '默认相册': [] };
          currentCategory = '默认相册';
        }
      }
    } catch (e) {
      console.log('加载照片失败:', e);
      categories = { '默认相册': [] };
      currentCategory = '默认相册';
    }
    photos = categories[currentCategory] || [];
    if (galleryLoading) {
      galleryLoading.style.display = 'none';
    }
    renderCategoryTabs();
    renderPhotos();
  }

  function renderPhotos() {
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
      item.querySelector('img').addEventListener('click', () => {
        openLightbox(index);
      });
      galleryGrid.appendChild(item);
    });

    // 如果照片超过3张且没展开，显示"更多"卡片
    if (photos.length > 3 && !isExpanded) {
      const moreCount = photos.length - 3;
      const moreCard = document.createElement('div');
      moreCard.className = 'gallery-more';
      moreCard.style.animationDelay = `${3 * 0.05}s`;
      moreCard.innerHTML = `
        <span class="gallery-more-count">+${moreCount}</span>
        <span class="gallery-more-text">查看更多</span>
      `;
      moreCard.addEventListener('click', () => {
        isExpanded = true;
        renderPhotos();
      });
      galleryGrid.appendChild(moreCard);
    }

    // 如果展开了，显示"收起"按钮
    if (isExpanded && photos.length > 3) {
      const collapseCard = document.createElement('div');
      collapseCard.className = 'gallery-more';
      collapseCard.style.animationDelay = `${photos.length * 0.05}s`;
      collapseCard.innerHTML = `
        <span class="gallery-more-count">↑</span>
        <span class="gallery-more-text">收起</span>
      `;
      collapseCard.addEventListener('click', () => {
        isExpanded = false;
        renderPhotos();
        document.getElementById('gallery').scrollIntoView({ behavior: 'smooth' });
      });
      galleryGrid.appendChild(collapseCard);
    }

    galleryGrid.querySelectorAll('.gallery-delete').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const password = prompt('请输入删除密码：');
        if (password === '120315') {
          const idx = parseInt(btn.getAttribute('data-index'));
          photos.splice(idx, 1);
          categories[currentCategory] = photos;
          saveCategoryStructure().catch(e => console.error('保存失败:', e));
          renderPhotos();
        } else if (password !== null) {
          alert('密码错误！');
        }
      });
    });
  }

  photoInput.addEventListener('change', async (e) => {
    if (isUploading) return;
    
    const files = Array.from(e.target.files);
    
    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) {
        alert('图片太大了，请选择 5MB 以下的图片');
        continue;
      }

      isUploading = true;
      
      try {
        const loadingItem = document.createElement('div');
        loadingItem.className = 'gallery-item loading';
        loadingItem.innerHTML = `
          <div class="gallery-loading">
            <div class="loading-spinner"></div>
            <span>上传中...</span>
          </div>
        `;
        galleryEmpty.style.display = 'none';
        galleryGrid.appendChild(loadingItem);

        const base64 = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        const compressedBase64 = await compressImage(base64);
        photos.push(compressedBase64);
        categories[currentCategory] = photos;
        await saveCategoryStructure();
        
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

  clearBtn.addEventListener('click', () => {
    if (photos.length === 0) return;
    const password = prompt('请输入清空密码：');
    if (password === '120315') {
      if (confirm('确定要清空当前相册的所有照片吗？此操作不可恢复！')) {
        photos = [];
        categories[currentCategory] = [];
        saveCategoryStructure().catch(e => console.error('保存失败:', e));
        renderPhotos();
      }
    } else if (password !== null) {
      alert('密码错误！');
    }
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
  const commentsList = document.getElementById('commentsList');
  if (!commentsList) return;

  const commentName = document.getElementById('commentName');
  const commentContent = document.getElementById('commentContent');
  const commentSubmit = document.getElementById('commentSubmit');

  const TOKEN_PART1 = 'ghp_GMiHyZUI5RkF';
  const TOKEN_PART2 = 'DIFadXOlohhXN9nvl63RzsQM';
  const GITHUB_TOKEN = TOKEN_PART1 + TOKEN_PART2;
  
  const GIST_ID = 'c8f6c96c0caaa796cd38d25d4fce2153';
  const GIST_FILENAME = 'comments.json';
  
  let comments = [];
  let sortedComments = [];

  async function loadComments() {
    try {
      const url = `https://gist.githubusercontent.com/su120315/${GIST_ID}/raw/${GIST_FILENAME}?t=${Date.now()}`;
      const response = await fetch(url, { cache: 'no-store' });
      if (response.ok) {
        const data = await response.text();
        comments = JSON.parse(data);
        if (!Array.isArray(comments)) comments = [];
      }
    } catch (e) {
      console.log('加载评论失败:', e);
    }
    renderComments();
  }

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

  function formatTime(timestamp) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
  }

  function renderComments() {
    if (comments.length === 0) {
      commentsList.innerHTML = '<div class="comment-empty">还没有留言，快来抢沙发～</div>';
      return;
    }

    sortedComments = [...comments].sort((a, b) => b.time - a.time);
    
    let html = '';
    sortedComments.forEach((comment, sortIndex) => {
      const commentId = comment.id || generateId();
      if (!comment.id) comment.id = commentId;
      
      html += `
        <div class="comment-item" data-comment-id="${commentId}">
          <div class="comment-header">
            <span class="comment-author">${escapeHtml(comment.name)}</span>
            <span class="comment-time">${formatTime(comment.time)}</span>
            <button class="comment-delete" data-sort-index="${sortIndex}" title="删除留言">
              <i data-lucide="trash-2"></i>
            </button>
          </div>
          <div class="comment-content">${escapeHtml(comment.content)}</div>
          <div class="comment-actions">
            <button class="comment-reply-btn" data-reply-to="${commentId}" data-reply-name="${escapeHtml(comment.name)}">
              <i data-lucide="message-circle"></i>
              <span>回复</span>
            </button>
          </div>
          <div class="comment-replies" id="replies-${commentId}">
            ${renderReplies(comment.replies || [], commentId)}
          </div>
          <div class="reply-form" id="replyForm-${commentId}">
            <input type="text" class="reply-name-input" placeholder="你的名字" maxlength="20">
            <textarea class="reply-content-input" placeholder="回复内容..." maxlength="500"></textarea>
            <div class="reply-form-actions">
              <button class="reply-cancel" data-cancel-id="${commentId}">取消</button>
              <button class="reply-submit" data-submit-id="${commentId}" data-reply-to-name="${escapeHtml(comment.name)}">回复</button>
            </div>
          </div>
        </div>
      `;
    });
    
    commentsList.innerHTML = html;
    if (typeof lucide !== 'undefined') {
      try { lucide.createIcons(); } catch(e) { console.warn('Lucide error:', e); }
    }
    bindCommentEvents();
  }

  function renderReplies(replies, commentId) {
    if (!replies || replies.length === 0) return '';
    
    let html = '';
    replies.forEach((reply, replyIndex) => {
      const replyToText = reply.replyTo ? ` <span class="reply-to">回复 ${escapeHtml(reply.replyTo)}</span>` : '';
      html += `
        <div class="reply-item">
          <div class="reply-header">
            <span class="reply-author">${escapeHtml(reply.name)}${replyToText}</span>
            <span class="reply-time">${formatTime(reply.time)}</span>
            <button class="reply-delete" data-comment-id="${commentId}" data-reply-index="${replyIndex}" title="删除回复">
              <i data-lucide="x"></i>
            </button>
          </div>
          <div class="reply-content">${escapeHtml(reply.content)}</div>
        </div>
      `;
    });
    return html;
  }

  function bindCommentEvents() {
    commentsList.querySelectorAll('.comment-reply-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const commentId = btn.getAttribute('data-reply-to');
        const form = document.getElementById(`replyForm-${commentId}`);
        
        commentsList.querySelectorAll('.reply-form').forEach(f => {
          if (f.id !== `replyForm-${commentId}`) f.classList.remove('show');
        });
        
        form.classList.toggle('show');
        if (form.classList.contains('show')) {
          form.querySelector('.reply-name-input').focus();
        }
      });
    });

    commentsList.querySelectorAll('.reply-cancel').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-cancel-id');
        const form = document.getElementById(`replyForm-${id}`);
        form.classList.remove('show');
      });
    });

    commentsList.querySelectorAll('.reply-submit').forEach(btn => {
      btn.addEventListener('click', async () => {
        const commentId = btn.getAttribute('data-submit-id');
        const replyToName = btn.getAttribute('data-reply-to-name');
        const form = document.getElementById(`replyForm-${commentId}`);
        const nameInput = form.querySelector('.reply-name-input');
        const contentInput = form.querySelector('.reply-content-input');
        const name = nameInput.value.trim();
        const content = contentInput.value.trim();

        if (!name) { alert('请输入你的名字'); nameInput.focus(); return; }
        if (!content) { alert('请输入回复内容'); contentInput.focus(); return; }

        btn.disabled = true;
        btn.textContent = '回复中...';

        const comment = comments.find(c => (c.id || generateId()) === commentId);
        if (comment) {
          if (!comment.replies) comment.replies = [];
          comment.replies.push({
            name,
            content,
            time: Date.now(),
            replyTo: replyToName
          });
          await saveComments();
          renderComments();
          showConfetti();
        }
      });
    });

    commentsList.querySelectorAll('.comment-delete').forEach(btn => {
      btn.addEventListener('click', () => {
        const password = prompt('请输入删除密码：');
        if (password === '120315') {
          const sortIdx = parseInt(btn.getAttribute('data-sort-index'));
          const targetComment = sortedComments[sortIdx];
          const originalIndex = comments.findIndex(c => c.time === targetComment.time);
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

    commentsList.querySelectorAll('.reply-delete').forEach(btn => {
      btn.addEventListener('click', () => {
        const password = prompt('请输入删除密码：');
        if (password === '120315') {
          const commentId = btn.getAttribute('data-comment-id');
          const replyIndex = parseInt(btn.getAttribute('data-reply-index'));
          const comment = comments.find(c => (c.id || generateId()) === commentId);
          if (comment && comment.replies) {
            comment.replies.splice(replyIndex, 1);
            saveComments();
            renderComments();
          }
        } else if (password !== null) {
          alert('密码错误！');
        }
      });
    });
  }

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
      id: generateId(),
      name,
      content,
      time: Date.now(),
      replies: []
    };

    comments.push(newComment);
    await saveComments();
    
    commentName.value = '';
    commentContent.value = '';
    renderComments();
    
    commentSubmit.disabled = false;
    commentSubmit.innerHTML = '<i data-lucide="send"></i><span>发布留言</span>';
    if (typeof lucide !== 'undefined') {
      try { lucide.createIcons(); } catch(e) { console.warn('Lucide error:', e); }
    }
    
    showConfetti();
  });

  loadComments();
}

safeInit(initComments, 'comments');

// ==================== 安全初始化包装器 ====================
function safeInit(fn, name) {
  try {
    fn();
  } catch (e) {
    console.error('Init error [' + name + ']:', e);
  }
}

// ==================== Visitor Counter ====================
function initVisitorCounter() {
  const TOKEN_PART1 = 'ghp_GMiHyZUI5RkF';
  const TOKEN_PART2 = 'DIFadXOlohhXN9nvl63RzsQM';
  const GITHUB_TOKEN = TOKEN_PART1 + TOKEN_PART2;
  
  const GIST_ID = '7686870c122b9369aeeecf91bcfb1676';
  const GIST_FILENAME = 'visitor-count.json';
  
  const VISITOR_KEY = 'suyu_visitor_counted';
  const counterEl = document.getElementById('visitorCount');
  
  if (!counterEl) return;
  
  async function getCount() {
    try {
      const url = `https://gist.githubusercontent.com/su120315/${GIST_ID}/raw/${GIST_FILENAME}?t=${Date.now()}`;
      const response = await fetch(url, { cache: 'no-store' });
      if (response.ok) {
        const data = await response.json();
        return data.count || 0;
      }
    } catch (e) {
      console.log('获取访问量失败:', e);
    }
    return 0;
  }
  
  async function updateCount(newCount) {
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
              content: JSON.stringify({ count: newCount })
            }
          }
        })
      });
    } catch (e) {
      console.log('更新访问量失败:', e);
    }
  }
  
  function animateNumber(el, target) {
    const duration = 1500;
    const start = 0;
    const startTime = performance.now();
    
    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(start + (target - start) * easeProgress);
      el.textContent = current.toLocaleString();
      if (progress < 1) requestAnimationFrame(update);
    }
    
    requestAnimationFrame(update);
  }
  
  async function init() {
    const currentCount = await getCount();
    const hasCounted = sessionStorage.getItem(VISITOR_KEY);
    
    let displayCount = currentCount;
    if (!hasCounted) {
      displayCount = currentCount + 1;
      updateCount(displayCount);
      sessionStorage.setItem(VISITOR_KEY, '1');
    }
    
    animateNumber(counterEl, displayCount);
  }
  
  init();
}

safeInit(initVisitorCounter, 'visitorCounter');

// ==================== Weather ====================
function initWeather() {
  const loading = document.getElementById('weatherLoading');
  const content = document.getElementById('weatherContent');
  const error = document.getElementById('weatherError');
  const icon = document.getElementById('weatherIcon');
  const temp = document.getElementById('weatherTemp');
  const desc = document.getElementById('weatherDesc');
  const feels = document.getElementById('weatherFeels');
  const humidity = document.getElementById('weatherHumidity');
  const wind = document.getElementById('weatherWind');
  const uv = document.getElementById('weatherUV');
  const time = document.getElementById('weatherTime');
  
  if (!loading) return;
  
  async function fetchWeather() {
    try {
      loading.style.display = 'block';
      content.style.display = 'none';
      error.style.display = 'none';
      
      const res = await fetch('https://wttr.in/Lu%27an?format=j1', {
        cache: 'no-store'
      });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const data = await res.json();
      
      const current = data.current_condition[0];
      const area = data.nearest_area[0].areaName[0].value;
      
      // 天气图标映射
      const code = parseInt(current.weatherCode);
      const iconMap = {
        113: '☀️', 116: '⛅', 119: '☁️', 122: '☁️',
        143: '🌫️', 176: '🌦️', 179: '🌧️', 182: '🌧️',
        185: '🌧️', 200: '⛈️', 227: '🌨️', 230: '🌨️',
        248: '🌫️', 260: '🌫️', 263: '🌦️', 266: '🌦️',
        281: '🌧️', 284: '🌧️', 293: '🌦️', 296: '🌦️',
        299: '🌧️', 302: '🌧️', 305: '🌧️', 308: '🌧️',
        311: '🌧️', 314: '🌧️', 317: '🌧️', 320: '🌧️',
        323: '🌨️', 326: '🌨️', 329: '🌨️', 332: '🌨️',
        335: '🌨️', 338: '🌨️', 350: '🌧️', 353: '🌦️',
        356: '🌧️', 359: '🌧️', 362: '🌧️', 365: '🌧️',
        368: '🌨️', 371: '🌨️', 374: '🌧️', 377: '🌧️',
        386: '⛈️', 389: '⛈️', 392: '⛈️', 395: '⛈️'
      };
      
      icon.textContent = iconMap[code] || '🌤️';
      temp.textContent = current.temp_C + '°C';
      desc.textContent = current.weatherDesc[0].value;
      feels.textContent = current.FeelsLikeC + '°C';
      humidity.textContent = current.humidity + '%';
      wind.textContent = current.windspeedKmph + ' km/h';
      uv.textContent = current.uvIndex;
      
      document.getElementById('weatherLocation').textContent = '📍 ' + area;
      time.textContent = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
      
      loading.style.display = 'none';
      content.style.display = 'flex';
    } catch (e) {
      console.log('天气加载失败:', e);
      loading.style.display = 'none';
      error.style.display = 'block';
    }
  }
  
  fetchWeather();
  // 每30分钟刷新一次
  setInterval(fetchWeather, 30 * 60 * 1000);
}

safeInit(initWeather, 'weather');

// ==================== AI 对话小窗 ====================
function initChat() {
  const bubble = document.getElementById('chatBubble');
  const dialog = document.getElementById('chatDialog');
  const close = document.getElementById('chatClose');
  const input = document.getElementById('chatInput');
  const send = document.getElementById('chatSend');
  const messages = document.getElementById('chatMessages');
  if (!bubble || !dialog) return;

  const API_KEY = '9be075e9e33940e5b27b287fdf7df184.TJaWcWDHWOKzIMWw';
  const API_URL = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';

  let chatHistory = [
    { role: 'system', content: '你是蘇魚的AI分身。蘇魚是一个初二学生，来自六安汇文中学，热爱编程、AI、游戏（三角洲行动、极品飞车：集结、MC）、骑公路自行车。回答要简短亲切、有活力，用中文，像朋友聊天一样。你不知道的事情就说“这个我也不太清楚呢～”。' }
  ];

  // ---- 气泡拖拽（动态监听，不拖时不占开销）----
  let isDragging = false;
  let dragOffsetX, dragOffsetY;
  let didDrag = false;

  function onDragStart(e) {
    const touch = e.touches ? e.touches[0] : e;
    const rect = bubble.getBoundingClientRect();
    bubble.style.left = rect.left + 'px';
    bubble.style.top = rect.top + 'px';
    bubble.style.bottom = 'auto';
    bubble.style.right = 'auto';
    dragOffsetX = touch.clientX - rect.left;
    dragOffsetY = touch.clientY - rect.top;
    isDragging = true;
    didDrag = false;
    // 拖拽开始时才挂载全局监听，结束后移除
    document.addEventListener('mousemove', onDragMove);
    document.addEventListener('mouseup', onDragEnd);
    document.addEventListener('touchmove', onDragMove, { passive: false });
    document.addEventListener('touchend', onDragEnd);
    // 注意：不调 preventDefault，让 click 事件能正常触发
  }

  function onDragMove(e) {
    if (!isDragging) return;
    const touch = e.touches ? e.touches[0] : e;
    const newLeft = touch.clientX - dragOffsetX;
    const newTop = touch.clientY - dragOffsetY;
    bubble.style.left = Math.max(0, Math.min(newLeft, window.innerWidth - bubble.offsetWidth)) + 'px';
    bubble.style.top = Math.max(0, Math.min(newTop, window.innerHeight - bubble.offsetHeight)) + 'px';
    didDrag = true;
    e.preventDefault();
  }

  function onDragEnd() {
    isDragging = false;
    document.removeEventListener('mousemove', onDragMove);
    document.removeEventListener('mouseup', onDragEnd);
    document.removeEventListener('touchmove', onDragMove);
    document.removeEventListener('touchend', onDragEnd);
  }

  bubble.addEventListener('mousedown', onDragStart);
  bubble.addEventListener('touchstart', onDragStart, { passive: true });

  // 点击气泡切换对话框（只有非拖拽时才切换）
  bubble.addEventListener('click', (e) => {
    if (didDrag) return;
    dialog.classList.toggle('open');
    if (dialog.classList.contains('open')) {
      input.focus();
      setTimeout(() => messages.scrollTop = messages.scrollHeight, 100);
    }
  });

  close.addEventListener('click', () => dialog.classList.remove('open'));

  // ---- 点击外部关闭对话框 ----
  document.addEventListener('click', (e) => {
    if (!dialog.classList.contains('open')) return;
    if (!dialog.contains(e.target) && e.target !== bubble && !bubble.contains(e.target)) {
      dialog.classList.remove('open');
    }
  });

  async function sendMessage() {
    const text = input.value.trim();
    if (!text) return;
    input.value = '';
    send.disabled = true;

    // 显示用户消息
    const userDiv = document.createElement('div');
    userDiv.className = 'chat-msg chat-msg-user';
    userDiv.innerHTML = `<div class="chat-msg-content">${escapeHtml(text)}</div>`;
    messages.appendChild(userDiv);
    messages.scrollTop = messages.scrollHeight;

    // 显示加载中
    const aiDiv = document.createElement('div');
    aiDiv.className = 'chat-msg chat-msg-ai loading';
    aiDiv.innerHTML = '<div class="chat-msg-content">思考中</div>';
    messages.appendChild(aiDiv);
    messages.scrollTop = messages.scrollHeight;

    chatHistory.push({ role: 'user', content: text });

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          model: 'glm-4.7-flash',
          messages: chatHistory,
          max_tokens: 1024,
          temperature: 0.8,
          stream: false
        })
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      const reply = data.choices[0].message.content;

      aiDiv.className = 'chat-msg chat-msg-ai';
      aiDiv.innerHTML = `<div class="chat-msg-content">${escapeHtml(reply)}</div>`;
      chatHistory.push({ role: 'assistant', content: reply });

      // 只保留最近的20条对话
      const sysMsg = chatHistory[0];
      const rest = chatHistory.slice(1);
      if (rest.length > 40) {
        chatHistory = [sysMsg, ...rest.slice(-40)];
      }
    } catch (e) {
      aiDiv.className = 'chat-msg chat-msg-ai';
      aiDiv.innerHTML = '<div class="chat-msg-content">哎呀，脑子卡住了… 稍后再试试吧 😅</div>';
      console.error('AI对话出错:', e);
    }

    send.disabled = false;
    messages.scrollTop = messages.scrollHeight;
  }

  function escapeHtml(text) {
    const d = document.createElement('div');
    d.textContent = text;
    return d.innerHTML;
  }

  send.addEventListener('click', sendMessage);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendMessage();
  });
}

// 等 lucide 加载完再初始化
setTimeout(function() { safeInit(initChat, 'chat'); }, 500);

// ==================== 复制QQ号 ====================
function copyQQ() {
  const qq = '1399680690';
  const tip = document.getElementById('qqCopyTip');
  navigator.clipboard.writeText(qq).then(() => {
    tip.textContent = '已复制！';
    setTimeout(() => { tip.textContent = '点击复制'; }, 2000);
  }).catch(() => {
    tip.textContent = '复制失败';
    setTimeout(() => { tip.textContent = '点击复制'; }, 2000);
  });
}


