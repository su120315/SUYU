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
document.querySelectorAll('.skill-card, .project-card, .hobby-card').forEach(el => {
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
});
