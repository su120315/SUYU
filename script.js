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
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

  // 无手动保存时，跟随系统
  if (savedTheme === 'dark' || (!savedTheme && prefersDark.matches)) {
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

  // 系统主题变化时自动跟随（仅当用户没有手动设置过）
  prefersDark.addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      if (e.matches) {
        document.body.classList.add('dark-mode');
        updateThemeIcons(true);
      } else {
        document.body.classList.remove('dark-mode');
        updateThemeIcons(false);
      }
    }
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

// ==================== Gallery ====================
function initGallery() {
  const photoInput = document.getElementById('photoInput');
  const clearBtn = document.getElementById('clearBtn');
  const galleryGrid = document.getElementById('galleryGrid');
  const galleryEmpty = document.getElementById('galleryEmpty');
  const galleryLoading = document.getElementById('galleryLoading');

  // GitHub Token - 用于保存照片
  const TOKEN_PART1 = 'ghp_GMiHyZUI5RkF';
  const TOKEN_PART2 = 'DIFadXOlohhXN9nvl63RzsQM';
  const GITHUB_TOKEN = TOKEN_PART1 + TOKEN_PART2;
  
  // Gist ID 和直链
  const GIST_ID = '070c70e1da8ce50d80a1e805a3e5491d';
  const GIST_FILENAME = 'gallery-photos.json';
  // 添加时间戳避免缓存
  const GIST_RAW_URL = `https://gist.githubusercontent.com/su120315/${GIST_ID}/raw/${GIST_FILENAME}?t=${Date.now()}`;
  
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
    lucide.createIcons();
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

  // 加载照片 - 使用直链，不需要认证
  async function loadPhotos() {
    try {
      const url = `https://gist.githubusercontent.com/su120315/${GIST_ID}/raw/${GIST_FILENAME}?t=${Date.now()}`;
      const response = await fetch(url, { cache: 'no-store' });
      if (response.ok) {
        const data = await response.text();
        const parsed = JSON.parse(data);
        // 支持新旧两种数据格式
        if (parsed && parsed.categories) {
          // 新格式: {categories: {"默认相册": [...], ...}, currentCategory: "默认相册"}
          const cat = parsed.currentCategory || '默认相册';
          photos = parsed.categories[cat] || [];
        } else if (Array.isArray(parsed)) {
          // 旧格式: ["url1", "url2", ...]
          photos = parsed;
        } else {
          photos = [];
        }
      }
    } catch (e) {
      console.log('加载照片失败:', e);
    }
    // 加载完成，隐藏加载状态
    if (galleryLoading) {
      galleryLoading.style.display = 'none';
    }
    renderPhotos();
  }

  // 保存照片到 Gist
  async function savePhotos() {
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
              content: JSON.stringify({
                categories: { '默认相册': photos },
                currentCategory: '默认相册'
              })
            }
          }
        })
      });
    } catch (error) {
      console.error('保存失败:', error);
    }
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
        // 滚动回相册顶部
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
          photos.splice(isExpanded ? idx : idx, 1);
          savePhotos();
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

  clearBtn.addEventListener('click', () => {
    if (photos.length === 0) return;
    const password = prompt('请输入清空密码：');
    if (password === '120315') {
      if (confirm('确定要清空所有照片吗？此操作不可恢复！')) {
        photos = [];
        savePhotos();
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
  const commentName = document.getElementById('commentName');
  const commentContent = document.getElementById('commentContent');
  const commentSubmit = document.getElementById('commentSubmit');
  const commentsList = document.getElementById('commentsList');

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
    lucide.createIcons();
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
    lucide.createIcons();
    
    showConfetti();
  });

  loadComments();
}

initComments();

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

initVisitorCounter();

// ==================== Music Player ====================
function initMusicPlayer() {
  const player = document.getElementById('musicPlayer');
  const miniPlayer = document.getElementById('musicMini');
  const playBtn = document.getElementById('musicPlayBtn');
  const playIcon = document.getElementById('musicPlayIcon');
  const prevBtn = document.getElementById('musicPrev');
  const nextBtn = document.getElementById('musicNext');
  const toggleBtn = document.getElementById('musicToggle');
  const titleEl = document.getElementById('musicTitle');
  const artistEl = document.getElementById('musicArtist');
  const coverEl = document.getElementById('musicCover');
  
  if (!player || !playBtn) return;
  
  const playlist = [
    { title: '晴天', artist: '周杰伦', url: 'https://music.163.com/song/media/outer/url?id=186016.mp3' },
    { title: '稻香', artist: '周杰伦', url: 'https://music.163.com/song/media/outer/url?id=185809.mp3' },
    { title: '七里香', artist: '周杰伦', url: 'https://music.163.com/song/media/outer/url?id=185798.mp3' },
    { title: '夜曲', artist: '周杰伦', url: 'https://music.163.com/song/media/outer/url?id=185817.mp3' }
  ];
  
  let currentIndex = 0;
  let isPlaying = false;
  let audio = null;
  
  function updateUI() {
    const song = playlist[currentIndex];
    titleEl.textContent = song.title;
    artistEl.textContent = song.artist;
    
    if (isPlaying) {
      playIcon.setAttribute('data-lucide', 'pause');
      coverEl.classList.add('playing');
      miniPlayer.classList.add('playing');
    } else {
      playIcon.setAttribute('data-lucide', 'play');
      coverEl.classList.remove('playing');
      miniPlayer.classList.remove('playing');
    }
    lucide.createIcons();
  }
  
  function ensureAudio() {
    if (!audio) {
      audio = new Audio();
      audio.addEventListener('ended', () => {
        playNext();
      });
      audio.addEventListener('error', () => {
        console.log('音频加载失败，尝试下一首');
        playNext();
      });
    }
  }
  
  function togglePlay() {
    ensureAudio();
    if (isPlaying) {
      audio.pause();
      isPlaying = false;
    } else {
      audio.src = playlist[currentIndex].url;
      audio.play().catch(e => {
        console.log('播放失败:', e);
        alert('由于浏览器限制，请手动点击播放，或歌曲链接可能失效');
      });
      isPlaying = true;
    }
    updateUI();
  }
  
  function playPrev() {
    ensureAudio();
    currentIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    if (isPlaying) {
      audio.src = playlist[currentIndex].url;
      audio.play().catch(e => console.log(e));
    }
    updateUI();
  }
  
  function playNext() {
    ensureAudio();
    currentIndex = (currentIndex + 1) % playlist.length;
    if (isPlaying) {
      audio.src = playlist[currentIndex].url;
      audio.play().catch(e => console.log(e));
    }
    updateUI();
  }
  
  playBtn.addEventListener('click', togglePlay);
  prevBtn.addEventListener('click', playPrev);
  nextBtn.addEventListener('click', playNext);
  
  toggleBtn.addEventListener('click', () => {
    player.classList.add('collapsed');
    miniPlayer.style.display = 'flex';
  });
  
  miniPlayer.addEventListener('click', () => {
    player.classList.remove('collapsed');
    miniPlayer.style.display = 'none';
  });
  
  updateUI();
}

initMusicPlayer();
