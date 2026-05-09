/* ============================================================
   MAHESH T – PORTFOLIO  |  script.js
   Vanilla JavaScript – All interactions & animations
   ============================================================ */
 
'use strict';
 
// =================== LOADER ===================
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    loader.classList.add('hidden');
    // Start reveal animations after loader fades
    initReveal();
    animateSkillBars();
  }, 2200);
});
 
// =================== CUSTOM CURSOR ===================
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursor-follower');
 
let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;
 
document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top = mouseY + 'px';
});
 
function animateFollower() {
  followerX += (mouseX - followerX) * 0.12;
  followerY += (mouseY - followerY) * 0.12;
  follower.style.left = followerX + 'px';
  follower.style.top = followerY + 'px';
  requestAnimationFrame(animateFollower);
}
animateFollower();
 
// Scale cursor on hover
document.querySelectorAll('a, button, .skill-card, .project-card, .cert-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.transform = 'translate(-50%, -50%) scale(2)';
    follower.style.transform = 'translate(-50%, -50%) scale(1.5)';
    follower.style.borderColor = 'rgba(255,255,255,0.6)';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.transform = 'translate(-50%, -50%) scale(1)';
    follower.style.transform = 'translate(-50%, -50%) scale(1)';
    follower.style.borderColor = 'rgba(255,255,255,0.4)';
  });
});
 
// =================== NAVBAR ===================
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const allNavLinks = document.querySelectorAll('.nav-link');
 
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  updateActiveNav();
});
 
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});
 
// Close menu when link clicked
allNavLinks.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});
 
// Active section highlight
function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 150;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });
  allNavLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('active');
    }
  });
}
 
// =================== PARTICLE CANVAS ===================
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
 
let particles = [];
const PARTICLE_COUNT = 70;
 
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);
 
class Particle {
  constructor() { this.reset(); }
 
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 1.5 + 0.3;
    this.speedX = (Math.random() - 0.5) * 0.4;
    this.speedY = (Math.random() - 0.5) * 0.4;
    this.opacity = Math.random() * 0.4 + 0.05;
    this.life = 0;
    this.maxLife = Math.random() * 300 + 200;
  }
 
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.life++;
    if (this.life > this.maxLife || this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
      this.reset();
    }
  }
 
  draw() {
    const fade = this.life < 60 ? this.life / 60 : this.life > this.maxLife - 60 ? (this.maxLife - this.life) / 60 : 1;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${this.opacity * fade})`;
    ctx.fill();
  }
}
 
for (let i = 0; i < PARTICLE_COUNT; i++) {
  particles.push(new Particle());
}
 
// Connect nearby particles with lines
function connectParticles() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        const alpha = (1 - dist / 120) * 0.06;
        ctx.beginPath();
        ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
        ctx.lineWidth = 0.5;
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
}
 
function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  connectParticles();
  requestAnimationFrame(animateParticles);
}
animateParticles();
 
// =================== TYPING EFFECT ===================
const typingTexts = [
  'Frontend Developer',
  'JavaScript Developer',
  'UI Focused Developer',
  'React.js Developer',
];
 
let textIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 80;
 
function typeText() {
  const el = document.getElementById('typingText');
  if (!el) return;
 
  const currentText = typingTexts[textIndex];
 
  if (isDeleting) {
    el.textContent = currentText.substring(0, charIndex - 1);
    charIndex--;
    typingSpeed = 40;
  } else {
    el.textContent = currentText.substring(0, charIndex + 1);
    charIndex++;
    typingSpeed = 80;
  }
 
  if (!isDeleting && charIndex === currentText.length) {
    typingSpeed = 1800;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    textIndex = (textIndex + 1) % typingTexts.length;
    typingSpeed = 400;
  }
 
  setTimeout(typeText, typingSpeed);
}
 
setTimeout(typeText, 2500);
 
// =================== SCROLL REVEAL ===================
function initReveal() {
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
 
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = parseFloat(getComputedStyle(el).getPropertyValue('--delay')) || 0;
        setTimeout(() => {
          el.classList.add('visible');
        }, delay * 1000);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.12 });
 
  revealEls.forEach(el => observer.observe(el));
}
 
// =================== SKILL BARS ===================
function animateSkillBars() {
  const bars = document.querySelectorAll('.skill-fill');
 
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const width = bar.getAttribute('data-width');
        setTimeout(() => {
          bar.style.width = width + '%';
        }, 200);
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.4 });
 
  bars.forEach(bar => observer.observe(bar));
}
 
// =================== CONTACT FORM ===================
document.getElementById('sendBtn').addEventListener('click', () => {
  const name = document.getElementById('fname').value.trim();
  const email = document.getElementById('femail').value.trim();
  const message = document.getElementById('fmessage').value.trim();
 
  if (!name || !email || !message) {
    shakeForm();
    return;
  }
 
  if (!isValidEmail(email)) {
    document.getElementById('femail').style.borderColor = 'rgba(255,80,80,0.7)';
    setTimeout(() => {
      document.getElementById('femail').style.borderColor = '';
    }, 2000);
    return;
  }
 
  // Simulate sending (no backend)
  const btn = document.getElementById('sendBtn');
  btn.querySelector('span').textContent = 'Sending...';
  btn.style.opacity = '0.7';
 
  setTimeout(() => {
    document.getElementById('contactForm').classList.add('hidden');
    document.getElementById('formSuccess').classList.remove('hidden');
  }, 1200);
});
 
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
 
function shakeForm() {
  const card = document.querySelector('.contact-form-card');
  card.style.animation = 'shake 0.4s ease';
  setTimeout(() => { card.style.animation = ''; }, 400);
}
 
// Add shake keyframes dynamically
const style = document.createElement('style');
style.textContent = `
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-8px); }
  40% { transform: translateX(8px); }
  60% { transform: translateX(-5px); }
  80% { transform: translateX(5px); }
}
`;
document.head.appendChild(style);
 
// =================== RESUME DOWNLOAD ===================
document.getElementById('resumeDownloadBtn').addEventListener('click', (e) => {
  e.preventDefault();
  // In production, replace href with actual resume file path
  const btn = document.getElementById('resumeDownloadBtn');
  const icon = btn.querySelector('i');
  icon.className = 'fas fa-spinner fa-spin';
  btn.querySelector('span') ? null : null;
 
  setTimeout(() => {
    icon.className = 'fas fa-check';
    btn.querySelector('span') ? null : null;
    setTimeout(() => { icon.className = 'fas fa-download'; }, 2000);
  }, 800);
 
  // Uncomment when resume PDF is available:
  // const link = document.createElement('a');
  // link.href = 'assets/Mahesh_T_Resume.pdf';
  // link.download = 'Mahesh_T_Resume.pdf';
  // link.click();
});
 
// =================== BUTTON RIPPLE ===================
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const ripple = document.createElement('span');
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.cssText = `
      position:absolute;
      border-radius:50%;
      width:${size}px;
      height:${size}px;
      left:${e.clientX - rect.left - size/2}px;
      top:${e.clientY - rect.top - size/2}px;
      background:rgba(255,255,255,0.15);
      transform:scale(0);
      animation:ripple 0.5s ease;
      pointer-events:none;
      z-index:0;
    `;
 
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `@keyframes ripple { to { transform:scale(2); opacity:0; } }`;
    document.head.appendChild(rippleStyle);
 
    this.style.position = 'relative';
    this.style.overflow = 'hidden';
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 500);
  });
});
 
// =================== SMOOTH SCROLL OFFSET ===================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});
 
// =================== PROJECT CARD TILT ===================
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;
    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
  });
 
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});
 
// =================== COUNTER ANIMATION ===================
function animateCounters() {
  const stats = document.querySelectorAll('.stat-num');
  stats.forEach(stat => {
    const text = stat.textContent;
    const num = parseInt(text);
    if (isNaN(num)) return;
    const suffix = text.replace(/[0-9]/g, '');
    let current = 0;
    const increment = num / 30;
    const timer = setInterval(() => {
      current += increment;
      if (current >= num) {
        clearInterval(timer);
        stat.textContent = num + suffix;
      } else {
        stat.textContent = Math.floor(current) + suffix;
      }
    }, 40);
  });
}
 
const aboutSection = document.getElementById('about');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounters();
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });
 
counterObserver.observe(aboutSection);