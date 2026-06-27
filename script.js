// Initialize Lucide Icons
lucide.createIcons();

// ==================== Progress Bar ====================
const progressFill = document.querySelector('.progress-fill');

function updateProgressBar() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = (scrollTop / docHeight) * 100;
  progressFill.style.width = `${progress}%`;
}

window.addEventListener('scroll', updateProgressBar);

// ==================== Navbar Scroll Effect ====================
const navbar = document.querySelector('.navbar');

function updateNavbar() {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', updateNavbar);

// ==================== Typewriter Effect ====================
const typewriterElement = document.querySelector('.typewriter');
const fullText = typewriterElement.getAttribute('data-text');
let charIndex = 0;

function typeWriter() {
  if (charIndex < fullText.length) {
    typewriterElement.textContent += fullText.charAt(charIndex);
    charIndex++;
    setTimeout(typeWriter, 100);
  }
}

// Start typewriter after a short delay
setTimeout(typeWriter, 500);

// ==================== Intersection Observer for Animations ====================
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const fadeInObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
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

// ==================== Parallax Effect for Orbs ====================
const orbs = document.querySelectorAll('.orb');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  orbs.forEach((orb, index) => {
    const speed = (index + 1) * 0.05;
    orb.style.transform = `translateY(${scrollY * speed}px)`;
  });
});

// ==================== Initialize on Load ====================
document.addEventListener('DOMContentLoaded', () => {
  updateProgressBar();
  updateNavbar();
  initQuickNav();
});

// ==================== Quick Navigation ====================
function initQuickNav() {
  const toBottomBtn = document.getElementById('toBottomBtn');
  const sections = ['hero', 'about', 'skills', 'hobbies', 'sites', 'contact'];
  const navBtns = document.querySelectorAll('.quick-nav-btn');

  toBottomBtn.addEventListener('click', () => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth'
    });
  });

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navBtns.forEach(btn => {
          btn.classList.remove('active');
          const href = btn.getAttribute('href');
          if (href && href === `#${id}`) {
            btn.classList.add('active');
          }
        });
      }
    });
  }, { threshold: 0.3 });

  sections.forEach(id => {
    const section = document.getElementById(id);
    if (section) {
      sectionObserver.observe(section);
    }
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
        <img src="${photoData}" alt="照片 ${index + 1}">
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
