// ============================================
// KNOWLEDGE HUB - Complete JavaScript
// ============================================

document.addEventListener('DOMContentLoaded', function() {
  console.log('📚 Knowledge Hub Loading...');
  
  // Update header avatar
  updateHeaderAvatar();
  
  // Setup tab switching
  setupTabs();
  
  // Setup category filters
  setupCategories();
  
  // Setup chip filters
  setupChips();
  
  console.log('📚 Knowledge Hub Ready!');
});

// ============================================
// UPDATE HEADER AVATAR
// ============================================

function updateHeaderAvatar() {
  const headerAvatar = document.getElementById('headerAvatar');
  if (!headerAvatar) return;
  
  if (typeof UserDB === 'undefined') {
    headerAvatar.textContent = 'AS';
    return;
  }
  
  const user = UserDB.getCurrentUserFull();
  if (!user) {
    headerAvatar.textContent = 'AS';
    return;
  }
  
  let profileImage = null;
  if (user.profileImage) {
    profileImage = user.profileImage;
  } else {
    const localImage = localStorage.getItem('profileImage');
    if (localImage && localImage !== 'null' && localImage !== 'undefined') {
      profileImage = localImage;
    }
  }
  
  if (profileImage && profileImage !== 'null' && profileImage !== 'undefined') {
    headerAvatar.innerHTML = `<img src="${profileImage}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;border:2px solid #2563EB;">`;
    headerAvatar.style.background = 'none';
  } else {
    const initial = user.fullName ? user.fullName.charAt(0).toUpperCase() : '?';
    headerAvatar.textContent = initial;
    headerAvatar.style.background = 'linear-gradient(135deg, #2563EB, #7C3AED)';
    headerAvatar.style.display = 'flex';
    headerAvatar.style.alignItems = 'center';
    headerAvatar.style.justifyContent = 'center';
    headerAvatar.style.color = 'white';
    headerAvatar.style.fontWeight = '600';
    headerAvatar.style.fontSize = '16px';
  }
}

// ============================================
// OPEN COURSE - Opens in new tab
// ============================================

function openCourse(url) {
  if (!url) {
    showToast('Course link not available', 'warning');
    return;
  }
  showToast('Opening course...', 'info');
  setTimeout(() => {
    window.open(url, '_blank');
  }, 500);
}

// ============================================
// OPEN BOOK - Opens in new tab
// ============================================

function openBook(url) {
  if (!url) {
    showToast('Book link not available', 'warning');
    return;
  }
  showToast('Opening book details...', 'info');
  setTimeout(() => {
    window.open(url, '_blank');
  }, 500);
}

// ============================================
// OPEN RESOURCE - Opens in new tab
// ============================================

function openResource(url) {
  if (!url) {
    showToast('Resource link not available', 'warning');
    return;
  }
  showToast('Opening resource...', 'info');
  setTimeout(() => {
    window.open(url, '_blank');
  }, 500);
}

// ============================================
// SETUP TABS
// ============================================

function setupTabs() {
  const tabs = document.querySelectorAll('.kh-tab');
  const panels = {
    articles: document.getElementById('articlesPanel'),
    courses: document.getElementById('coursesPanel'),
    books: document.getElementById('booksPanel'),
    resources: document.getElementById('resourcesPanel')
  };
  
  tabs.forEach(tab => {
    tab.addEventListener('click', function() {
      const tabName = this.getAttribute('data-tab');
      
      // Update active tab
      tabs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      
      // Hide all panels
      Object.values(panels).forEach(panel => {
        if (panel) panel.style.display = 'none';
      });
      
      // Show selected panel
      if (panels[tabName]) {
        panels[tabName].style.display = 'block';
        panels[tabName].style.animation = 'fadeIn 0.3s ease';
      }
    });
  });
}

// ============================================
// SETUP CATEGORIES
// ============================================

function setupCategories() {
  const categories = document.querySelectorAll('.cat-list a');
  
  categories.forEach(cat => {
    cat.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Update active category
      categories.forEach(c => c.classList.remove('active'));
      this.classList.add('active');
      
      const category = this.textContent.trim();
      showToast(`Filtering by: ${category}`, 'info');
      
      // Filter articles (demo)
      const articles = document.querySelectorAll('.article-row');
      articles.forEach((article, index) => {
        if (category === 'All' || category === 'all') {
          article.style.display = 'grid';
        } else {
          // Random filter for demo
          article.style.display = index % 2 === 0 ? 'grid' : 'none';
        }
      });
    });
  });
}

// ============================================
// SETUP CHIPS
// ============================================

function setupChips() {
  const chips = document.querySelectorAll('.chip');
  
  chips.forEach(chip => {
    chip.addEventListener('click', function() {
      // Toggle active class
      this.classList.toggle('active');
      
      const filter = this.textContent.trim();
      if (this.classList.contains('active')) {
        showToast(`Filter: ${filter}`, 'info');
      } else {
        showToast(`Removed filter: ${filter}`, 'info');
      }
      
      // Demo: filter articles
      const articles = document.querySelectorAll('.article-row');
      const activeChips = document.querySelectorAll('.chip.active');
      
      if (activeChips.length === 0) {
        articles.forEach(a => a.style.display = 'grid');
      } else {
        articles.forEach((article, index) => {
          article.style.display = index % activeChips.length === 0 ? 'grid' : 'none';
        });
      }
    });
  });
}

// ============================================
// TOAST SYSTEM
// ============================================

function showToast(message, type = 'info', duration = 3000) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    container.style.cssText = `
      position: fixed;
      bottom: 30px;
      right: 30px;
      z-index: 10000;
      max-width: 420px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    `;
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  const colors = {
    success: '#22C55E',
    error: '#EF4444',
    warning: '#F59E0B',
    info: '#2563EB'
  };
  
  toast.style.cssText = `
    background: #1e293b;
    color: white;
    padding: 14px 18px;
    border-radius: 12px;
    box-shadow: 0 12px 40px rgba(0,0,0,0.2);
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 14px;
    border-left: 4px solid ${colors[type] || '#2563EB'};
    transform: translateX(120%) scale(0.9);
    opacity: 0;
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  `;

  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  };

  toast.innerHTML = `
    <span style="font-size:18px;flex-shrink:0;">${icons[type] || icons.info}</span>
    <span>${message}</span>
    <button style="background:none;border:none;color:rgba(255,255,255,0.5);font-size:18px;cursor:pointer;padding:0 4px;margin-left:auto;" onclick="this.closest('.toast').style.transform='translateX(80%) scale(0.8)'; this.closest('.toast').style.opacity='0'; setTimeout(() => this.closest('.toast').remove(), 400);">×</button>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.transform = 'translateX(0) scale(1)';
    toast.style.opacity = '1';
  }, 10);

  setTimeout(() => {
    if (toast.parentElement) {
      toast.style.transform = 'translateX(80%) scale(0.8)';
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 400);
    }
  }, duration);
}

// ============================================
// FOLLOW BUTTON
// ============================================

document.addEventListener('click', function(e) {
  if (e.target.closest('.follow-btn')) {
    showToast('Followed!', 'success');
  }
});

// Make functions globally available
window.showToast = showToast;
window.openCourse = openCourse;
window.openBook = openBook;
window.openResource = openResource;

console.log('📚 Knowledge Hub Ready!');