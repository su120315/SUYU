// Initialize Lucide Icons
lucide.createIcons();

// ==================== 移动端检测 ====================
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;

// ==================== Loading Animation ====================
(function initLoading() {
  const loadingOverlay = document.getElementById('loadingOverlay');
  const loadingProgressBar = document.getElementById('loadingProgressBar');
  
  if (!loadingOverlay) return;

  // 模拟加载进度
  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 15;
    if (progress > 100) progress = 100;
    if (loadingProgressBar) {
      loadingProgressBar.style.width = progress + '%';
    }
  }, 200);

  // 页面加载完成后隐藏加载动画
  window.addEventListener('load', () => {
    clearInterval(interval);
    if (loadingProgressBar) {
      loadingProgressBar.style.width = '100%';
    }
    setTimeout(() => {
      loadingOverlay.classList.add('hidden');
      // 加载完成后触发入场动画
      setTimeout(initPageEntryAnimations, 100);
    }, 600);
  });

  // 如果加载时间过长，直接隐藏
  setTimeout(() => {
    if (!loadingOverlay.classList.contains('hidden')) {
      loadingOverlay.classList.add('hidden');
      initPageEntryAnimations();
    }
  }, 3000);
})();

// ==================== 页面入场动画 ====================
function initPageEntryAnimations() {
  const elements = document.querySelectorAll('.hero-title, .hero-subtitle, .hero-tags, .btn-primary');
  elements.forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    setTimeout(() => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, index * 150);
  });
}

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
  const themeToggles = document.querySelectorAll('#themeToggle, #themeToggleMobile');
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

// ==================== Gallery ====================
function initGallery() {
  const photoInput = document.getElementById('photoInput');
  const clearBtn = document.getElementById('clearBtn');
  const galleryGrid = document.getElementById('galleryGrid');
  const galleryEmpty = document.getElementById('galleryEmpty');

  let photos = JSON.parse(localStorage.getItem('myGallery') || '[]');

  function renderPhotos() {
    if (photos.length === 0) {
      galleryEmpty.style.display = 'block';
      galleryGrid.querySelectorAll('.gallery-item').forEach(el => el.remove());
      return;
    }

    galleryEmpty.style.display = 'none';
    galleryGrid.querySelectorAll('.gallery-item').forEach(el => el.remove());

    photos.forEach((photoData, index) => {
      const item = document.createElement('div');
      item.className = 'gallery-item';
      item.style.animationDelay = `${index * 0.05}s`;
      item.innerHTML = `
        <img src="${photoData}" alt="照片 ${index + 1}" loading="lazy">
        <button class="gallery-delete" data-index="${index}" title="删除">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
        </button>
      `;
      galleryGrid.appendChild(item);
    });

    galleryGrid.querySelectorAll('.gallery-delete').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const idx = parseInt(btn.getAttribute('data-index'));
        photos.splice(idx, 1);
        savePhotos();
        renderPhotos();
      });
    });
  }

  function savePhotos() {
    try {
      localStorage.setItem('myGallery', JSON.stringify(photos));
    } catch (e) {
      alert('照片太多啦，存不下了，删几张再上传吧～');
    }
  }

  photoInput.addEventListener('change', (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        photos.push(event.target.result);
        savePhotos();
        renderPhotos();
        // 添加成功动画
        showConfetti();
      };
      reader.readAsDataURL(file);
    });
    photoInput.value = '';
  });

  clearBtn.addEventListener('click', () => {
    if (photos.length === 0) return;
    if (confirm('确定要清空所有照片吗？')) {
      photos = [];
      savePhotos();
      renderPhotos();
    }
  });

  renderPhotos();
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
