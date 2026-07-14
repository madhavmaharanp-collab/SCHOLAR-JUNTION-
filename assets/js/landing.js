// ============================================
// SCHOLAR JUNCTION - Landing Page Animations
// ============================================

// ===== TOAST SYSTEM =====
document.querySelectorAll('[data-toast]').forEach(el => {
  el.addEventListener('click', (e) => {
    e.preventDefault();
    const message = el.getAttribute('data-toast');
    showToast(message);
  });
});

function showToast(message, type = 'info') {
  // Remove existing toasts
  const existing = document.querySelector('.sj-toast-container');
  if (existing) existing.remove();
  
  const container = document.createElement('div');
  container.className = 'sj-toast-container';
  container.innerHTML = `
    <div class="sj-toast sj-toast-${type}">
      <span>${message}</span>
      <button class="sj-toast-close" aria-label="Dismiss">×</button>
    </div>
  `;
  document.body.appendChild(container);
  
  // Trigger entrance animation
  const toast = container.querySelector('.sj-toast');
  requestAnimationFrame(() => {
    toast.classList.add('sj-toast-enter');
  });
  
  const close = container.querySelector('.sj-toast-close');
  close?.addEventListener('click', () => {
    toast.classList.remove('sj-toast-enter');
    toast.classList.add('sj-toast-exit');
    setTimeout(() => container.remove(), 300);
  });
  
  // Auto-dismiss after 4 seconds
  setTimeout(() => {
    if (container.parentElement) {
      toast.classList.remove('sj-toast-enter');
      toast.classList.add('sj-toast-exit');
      setTimeout(() => container.remove(), 300);
    }
  }, 4000);
}

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const href = a.getAttribute('href');
    if (href === '#') return;
    
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const headerOffset = 80;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      
      history.pushState(null, '', href);
    }
  });
});

// ===== MOBILE NAV =====
const burger = document.querySelector('[data-burger]');
const mobileNav = document.querySelector('[data-mobile-nav]');

if (burger && mobileNav) {
  burger.addEventListener('click', () => {
    const isOpen = mobileNav.style.display !== 'none';
    toggleMobileNav(!isOpen);
  });
}

function toggleMobileNav(show) {
  const mobileNav = document.querySelector('[data-mobile-nav]');
  const burger = document.querySelector('[data-burger]');
  
  if (!mobileNav || !burger) return;
  
  mobileNav.style.display = show ? 'block' : 'none';
  burger.setAttribute('aria-expanded', show);
  burger.classList.toggle('active', show);
  
  if (show && mobileNav.innerHTML.trim() === '') {
    const nav = document.querySelector('.sj-nav');
    if (nav) {
      const clone = nav.cloneNode(true);
      const actions = document.querySelector('.sj-header-actions')?.cloneNode(true);
      
      mobileNav.innerHTML = '';
      mobileNav.appendChild(clone);
      if (actions) {
        const burgerClone = actions.querySelector('[data-burger]');
        if (burgerClone) burgerClone.remove();
        mobileNav.appendChild(actions);
      }
      
      mobileNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => toggleMobileNav(false));
      });
    }
  }
}

// ===== SCROLL NAVBAR EFFECT =====
let lastScroll = 0;
const header = document.querySelector('.sj-header');

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  if (currentScroll > 80) {
    header?.classList.add('sj-header-scrolled');
  } else {
    header?.classList.remove('sj-header-scrolled');
  }
  lastScroll = currentScroll;
}, { passive: true });

// ===== PARALLAX EFFECT ON HERO =====
const hero = document.querySelector('.hero');
const heroBlob = document.querySelector('.hero-blob');

if (hero && heroBlob) {
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const rate = scrolled * 0.3;
    heroBlob.style.transform = `translateY(${rate * 0.05}px)`;
    
    // Parallax for hero content
    const heroContent = hero.querySelector('.hero-grid > div:first-child');
    if (heroContent) {
      heroContent.style.transform = `translateY(${scrolled * 0.02}px)`;
      heroContent.style.opacity = Math.max(0, 1 - scrolled / 800);
    }
  }, { passive: true });
}

// ===== INTERSECTION OBSERVER (Scroll Animations) =====
if ('IntersectionObserver' in window) {
  // Elements to animate
  const animateElements = [
    '.feature-card',
    '.community-card', 
    '.event-card',
    '.article-card',
    '.project-card',
    '.stat-card',
    '.testimonial',
    '.faq-item',
    '.ai-chatmock',
    '.hero-glass',
    '.hero-stat'
  ];
  
  const elements = document.querySelectorAll(animateElements.join(','));
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Add delay based on index for stagger effect
        const delay = Array.from(elements).indexOf(entry.target) * 50;
        setTimeout(() => {
          entry.target.classList.add('fade-in-up');
        }, delay % 300); // Max delay 300ms
        observer.unobserve(entry.target);
      }
    });
  }, { 
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });
  
  elements.forEach(el => observer.observe(el));
}

// ===== COUNTER ANIMATION FOR STATS =====
document.querySelectorAll('.stat-num').forEach(stat => {
  const originalText = stat.textContent;
  const numericValue = parseFloat(originalText.replace(/[^0-9.]/g, ''));
  const suffix = originalText.replace(/[0-9.]/g, '');
  
  if (!isNaN(numericValue)) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(stat, numericValue, suffix);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    
    observer.observe(stat);
  }
});

function animateCounter(element, target, suffix) {
  let current = 0;
  const increment = target / 60;
  const duration = 2000;
  const steps = 60;
  const stepDuration = duration / steps;
  
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    // Format number
    let displayValue = Math.floor(current);
    if (target % 1 !== 0) {
      displayValue = current.toFixed(1);
    }
    element.textContent = displayValue + suffix;
  }, stepDuration);
}

// ===== TYPING EFFECT FOR HERO =====
const heroHeading = document.querySelector('.hero h1');
if (heroHeading && !window.innerWidth < 768) {
  const originalText = heroHeading.innerHTML;
  const words = originalText.split('<br>');
  // Only apply if not on mobile
  if (window.innerWidth > 768) {
    // We'll use a simpler approach - just add a cursor blink
    const span = document.createElement('span');
    span.className = 'typing-cursor';
    heroHeading.appendChild(span);
  }
}

// ===== HOVER 3D TILT EFFECT FOR CARDS =====
document.querySelectorAll('.feature-card, .community-card, .project-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-3px)`;
    card.style.transition = 'transform 0.1s ease-out';
  });
  
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
    card.style.transition = 'transform 0.3s ease-out';
  });
});

// ===== PARTICLES / SPARKLE EFFECT =====
function createSparkles() {
  const heroVisual = document.querySelector('.hero-visual');
  if (!heroVisual) return;
  
  for (let i = 0; i < 15; i++) {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    sparkle.style.cssText = `
      position: absolute;
      width: ${Math.random() * 6 + 2}px;
      height: ${Math.random() * 6 + 2}px;
      background: radial-gradient(circle, rgba(124,58,237,0.6), rgba(37,99,235,0.2));
      border-radius: 50%;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      animation: sparkleFloat ${Math.random() * 10 + 10}s linear infinite;
      animation-delay: ${Math.random() * 10}s;
      pointer-events: none;
      opacity: 0;
    `;
    heroVisual.appendChild(sparkle);
  }
}
createSparkles();

// ===== PROGRESSIVE IMAGE LOADING =====
document.querySelectorAll('.event-card .thumb, .article-card .thumb, .project-card .thumb').forEach(thumb => {
  thumb.style.opacity = '0';
  thumb.style.transition = 'opacity 0.6s ease';
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        thumb.style.opacity = '1';
        observer.unobserve(thumb);
      }
    });
  }, { threshold: 0.2 });
  
  observer.observe(thumb);
});

console.log('🚀 Scholar Junction v2.4.1 — Animations & Effects Loaded');// ============================================
// SCHOLAR JUNCTION - Landing Page Animations
// ============================================

// ===== TOAST SYSTEM =====
document.querySelectorAll('[data-toast]').forEach(el => {
  el.addEventListener('click', (e) => {
    e.preventDefault();
    const message = el.getAttribute('data-toast');
    showToast(message);
  });
});

function showToast(message, type = 'info') {
  // Remove existing toasts
  const existing = document.querySelector('.sj-toast-container');
  if (existing) existing.remove();
  
  const container = document.createElement('div');
  container.className = 'sj-toast-container';
  container.innerHTML = `
    <div class="sj-toast sj-toast-${type}">
      <span>${message}</span>
      <button class="sj-toast-close" aria-label="Dismiss">×</button>
    </div>
  `;
  document.body.appendChild(container);
  
  // Trigger entrance animation
  const toast = container.querySelector('.sj-toast');
  requestAnimationFrame(() => {
    toast.classList.add('sj-toast-enter');
  });
  
  const close = container.querySelector('.sj-toast-close');
  close?.addEventListener('click', () => {
    toast.classList.remove('sj-toast-enter');
    toast.classList.add('sj-toast-exit');
    setTimeout(() => container.remove(), 300);
  });
  
  // Auto-dismiss after 4 seconds
  setTimeout(() => {
    if (container.parentElement) {
      toast.classList.remove('sj-toast-enter');
      toast.classList.add('sj-toast-exit');
      setTimeout(() => container.remove(), 300);
    }
  }, 4000);
}

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const href = a.getAttribute('href');
    if (href === '#') return;
    
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const headerOffset = 80;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      
      history.pushState(null, '', href);
    }
  });
});

// ===== MOBILE NAV =====
const burger = document.querySelector('[data-burger]');
const mobileNav = document.querySelector('[data-mobile-nav]');

if (burger && mobileNav) {
  burger.addEventListener('click', () => {
    const isOpen = mobileNav.style.display !== 'none';
    toggleMobileNav(!isOpen);
  });
}

function toggleMobileNav(show) {
  const mobileNav = document.querySelector('[data-mobile-nav]');
  const burger = document.querySelector('[data-burger]');
  
  if (!mobileNav || !burger) return;
  
  mobileNav.style.display = show ? 'block' : 'none';
  burger.setAttribute('aria-expanded', show);
  burger.classList.toggle('active', show);
  
  if (show && mobileNav.innerHTML.trim() === '') {
    const nav = document.querySelector('.sj-nav');
    if (nav) {
      const clone = nav.cloneNode(true);
      const actions = document.querySelector('.sj-header-actions')?.cloneNode(true);
      
      mobileNav.innerHTML = '';
      mobileNav.appendChild(clone);
      if (actions) {
        const burgerClone = actions.querySelector('[data-burger]');
        if (burgerClone) burgerClone.remove();
        mobileNav.appendChild(actions);
      }
      
      mobileNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => toggleMobileNav(false));
      });
    }
  }
}

// ===== SCROLL NAVBAR EFFECT =====
let lastScroll = 0;
const header = document.querySelector('.sj-header');

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  if (currentScroll > 80) {
    header?.classList.add('sj-header-scrolled');
  } else {
    header?.classList.remove('sj-header-scrolled');
  }
  lastScroll = currentScroll;
}, { passive: true });

// ===== PARALLAX EFFECT ON HERO =====
const hero = document.querySelector('.hero');
const heroBlob = document.querySelector('.hero-blob');

if (hero && heroBlob) {
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const rate = scrolled * 0.3;
    heroBlob.style.transform = `translateY(${rate * 0.05}px)`;
    
    // Parallax for hero content
    const heroContent = hero.querySelector('.hero-grid > div:first-child');
    if (heroContent) {
      heroContent.style.transform = `translateY(${scrolled * 0.02}px)`;
      heroContent.style.opacity = Math.max(0, 1 - scrolled / 800);
    }
  }, { passive: true });
}

// ===== INTERSECTION OBSERVER (Scroll Animations) =====
if ('IntersectionObserver' in window) {
  // Elements to animate
  const animateElements = [
    '.feature-card',
    '.community-card', 
    '.event-card',
    '.article-card',
    '.project-card',
    '.stat-card',
    '.testimonial',
    '.faq-item',
    '.ai-chatmock',
    '.hero-glass',
    '.hero-stat'
  ];
  
  const elements = document.querySelectorAll(animateElements.join(','));
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Add delay based on index for stagger effect
        const delay = Array.from(elements).indexOf(entry.target) * 50;
        setTimeout(() => {
          entry.target.classList.add('fade-in-up');
        }, delay % 300); // Max delay 300ms
        observer.unobserve(entry.target);
      }
    });
  }, { 
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });
  
  elements.forEach(el => observer.observe(el));
}

// ===== COUNTER ANIMATION FOR STATS =====
document.querySelectorAll('.stat-num').forEach(stat => {
  const originalText = stat.textContent;
  const numericValue = parseFloat(originalText.replace(/[^0-9.]/g, ''));
  const suffix = originalText.replace(/[0-9.]/g, '');
  
  if (!isNaN(numericValue)) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(stat, numericValue, suffix);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    
    observer.observe(stat);
  }
});

function animateCounter(element, target, suffix) {
  let current = 0;
  const increment = target / 60;
  const duration = 2000;
  const steps = 60;
  const stepDuration = duration / steps;
  
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    // Format number
    let displayValue = Math.floor(current);
    if (target % 1 !== 0) {
      displayValue = current.toFixed(1);
    }
    element.textContent = displayValue + suffix;
  }, stepDuration);
}

// ===== TYPING EFFECT FOR HERO =====
const heroHeading = document.querySelector('.hero h1');
if (heroHeading && !window.innerWidth < 768) {
  const originalText = heroHeading.innerHTML;
  const words = originalText.split('<br>');
  // Only apply if not on mobile
  if (window.innerWidth > 768) {
    // We'll use a simpler approach - just add a cursor blink
    const span = document.createElement('span');
    span.className = 'typing-cursor';
    heroHeading.appendChild(span);
  }
}

// ===== HOVER 3D TILT EFFECT FOR CARDS =====
document.querySelectorAll('.feature-card, .community-card, .project-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-3px)`;
    card.style.transition = 'transform 0.1s ease-out';
  });
  
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
    card.style.transition = 'transform 0.3s ease-out';
  });
});
// ============================================
// ADDITIONAL ANIMATIONS - ADD TO EXISTING FILE
// ============================================

// ===== 3D TILT ON FLOATING CARDS =====
document.querySelectorAll('.floating-card').forEach(card => {
  card.addEventListener('mousemove', function(e) {
    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;
    
    this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px) scale(1.05)`;
  });
  
  card.addEventListener('mouseleave', function() {
    this.style.transform = '';
    this.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
  });
});

// ===== PARALLAX ON HERO =====
const heroBlob3d = document.querySelector('.hero-blob-3d');
const globeWrapper = document.querySelector('.globe-wrapper');

if (heroBlob3d && globeWrapper) {
  document.addEventListener('mousemove', function(e) {
    const x = (e.clientX / window.innerWidth - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;
    
    heroBlob3d.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px) scale(1.02)`;
    globeWrapper.style.transform = `translate(-50%, -50%) rotateX(${y * 0.5}deg) rotateY(${x * 0.5}deg)`;
  });
}

console.log('🎨 Additional animations loaded!');

// ===== PARTICLES / SPARKLE EFFECT =====
function createSparkles() {
  const heroVisual = document.querySelector('.hero-visual');
  if (!heroVisual) return;
  
  for (let i = 0; i < 15; i++) {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    sparkle.style.cssText = `
      position: absolute;
      width: ${Math.random() * 6 + 2}px;
      height: ${Math.random() * 6 + 2}px;
      background: radial-gradient(circle, rgba(124,58,237,0.6), rgba(37,99,235,0.2));
      border-radius: 50%;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      animation: sparkleFloat ${Math.random() * 10 + 10}s linear infinite;
      animation-delay: ${Math.random() * 10}s;
      pointer-events: none;
      opacity: 0;
    `;
    heroVisual.appendChild(sparkle);
  }
}
createSparkles();

// ===== PROGRESSIVE IMAGE LOADING =====
document.querySelectorAll('.event-card .thumb, .article-card .thumb, .project-card .thumb').forEach(thumb => {
  thumb.style.opacity = '0';
  thumb.style.transition = 'opacity 0.6s ease';
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        thumb.style.opacity = '1';
        observer.unobserve(thumb);
      }
    });
  }, { threshold: 0.2 });
  
  observer.observe(thumb);
});

console.log('🚀 Scholar Junction v2.4.1 — Animations & Effects Loaded');