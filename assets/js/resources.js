// ============================================
// RESOURCES - Complete JavaScript
// ============================================

// ============================================
// RESOURCE DATA
// ============================================

let resources = [];
let currentFilter = 'all';
let searchQuery = '';
let categoryFilter = 'all';
let currentUser = null;
let bookmarks = JSON.parse(localStorage.getItem('sj_bookmarks') || '[]');

// ============================================
// GET DEFAULT RESOURCES
// ============================================

function getDefaultResources() {
  return [
    {
      id: 1,
      title: 'Transformer Paper Annotated',
      type: 'pdf',
      category: 'AI',
      description: 'Complete annotation of the "Attention Is All You Need" paper with explanations and code examples.',
      size: '28 pages',
      stats: '4.1k downloads',
      url: '#',
      downloads: 4100,
      views: 5200,
      bookmarks: 340,
      createdAt: new Date().toISOString(),
      createdBy: 'admin'
    },
    {
      id: 2,
      title: 'EKS Karpenter Deep Dive',
      type: 'video',
      category: 'Cloud',
      description: 'Comprehensive video tutorial on Kubernetes Karpenter autoscaling and cost optimization.',
      size: '62 min',
      stats: '1.2k views',
      url: '#',
      downloads: 1200,
      views: 1200,
      bookmarks: 180,
      createdAt: new Date().toISOString(),
      createdBy: 'admin'
    },
    {
      id: 3,
      title: 'IEEE Paper Writing Kit',
      type: 'ppt',
      category: 'Research',
      description: 'Complete presentation template and guide for writing IEEE conference papers.',
      size: '42 slides',
      stats: '812 bookmarks',
      url: '#',
      downloads: 812,
      views: 1500,
      bookmarks: 812,
      createdAt: new Date().toISOString(),
      createdBy: 'admin'
    },
    {
      id: 4,
      title: 'Hands-on ML 3e (notes)',
      type: 'book',
      category: 'AI',
      description: 'Community-generated notes and summaries for Hands-on Machine Learning with Scikit-Learn and TensorFlow.',
      size: 'PDF',
      stats: '2.3k downloads',
      url: '#',
      downloads: 2300,
      views: 2800,
      bookmarks: 450,
      createdAt: new Date().toISOString(),
      createdBy: 'admin'
    },
    {
      id: 5,
      title: 'Awesome RAG 2026',
      type: 'link',
      category: 'AI',
      description: 'Curated list of resources, papers, and tools for Retrieval-Augmented Generation systems.',
      size: 'GitHub repo',
      stats: '1.8k stars',
      url: '#',
      downloads: 1800,
      views: 2200,
      bookmarks: 280,
      createdAt: new Date().toISOString(),
      createdBy: 'admin'
    },
    {
      id: 6,
      title: 'TDA Visual Explainer',
      type: 'video',
      category: 'Math',
      description: 'Visual introduction to Topological Data Analysis with animated explanations and examples.',
      size: '18 min',
      stats: '890 views',
      url: '#',
      downloads: 890,
      views: 890,
      bookmarks: 120,
      createdAt: new Date().toISOString(),
      createdBy: 'admin'
    },
    {
      id: 7,
      title: 'CKAD Cheat Sheet',
      type: 'pdf',
      category: 'DevOps',
      description: 'Quick reference guide for Certified Kubernetes Application Developer exam.',
      size: '12 pages',
      stats: '3.4k downloads',
      url: '#',
      downloads: 3400,
      views: 4100,
      bookmarks: 560,
      createdAt: new Date().toISOString(),
      createdBy: 'admin'
    },
    {
      id: 8,
      title: 'LaTeX IEEE Template',
      type: 'ppt',
      category: 'Research',
      description: 'LaTeX template for IEEE conference papers with all required formatting.',
      size: 'template',
      stats: '2.1k downloads',
      url: '#',
      downloads: 2100,
      views: 2500,
      bookmarks: 380,
      createdAt: new Date().toISOString(),
      createdBy: 'admin'
    },
    {
      id: 9,
      title: 'Nepali NLP Corpus',
      type: 'link',
      category: 'Data',
      description: 'Curated NLP dataset for Nepali language processing and machine learning.',
      size: 'dataset',
      stats: '1.4k downloads',
      url: '#',
      downloads: 1400,
      views: 1700,
      bookmarks: 210,
      createdAt: new Date().toISOString(),
      createdBy: 'admin'
    }
  ];
}

// ============================================
// LOAD & SAVE RESOURCES
// ============================================

function loadResources() {
  try {
    const stored = localStorage.getItem('sj_resources');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed && parsed.length > 0) {
        resources = parsed;
        console.log('📂 Resources loaded from localStorage:', resources.length);
        return;
      }
    }
  } catch (e) {
    console.warn('Could not load resources from localStorage');
  }
  
  resources = getDefaultResources();
  saveResources(resources);
  console.log('📂 Default resources loaded:', resources.length);
}

function saveResources(resourcesData) {
  try {
    localStorage.setItem('sj_resources', JSON.stringify(resourcesData));
  } catch (e) {
    console.warn('Could not save resources to localStorage');
  }
}

// ============================================
// GET CURRENT USER
// ============================================

function getCurrentUser() {
  if (typeof UserDB !== 'undefined') {
    try {
      return UserDB.getCurrentUser();
    } catch (e) {
      return null;
    }
  }
  return null;
}

// ============================================
// RENDER RESOURCES
// ============================================

function renderResources() {
  const grid = document.getElementById('resourceGrid');
  if (!grid) {
    console.warn('Resource grid not found');
    return;
  }

  if (!resources || resources.length === 0) {
    loadResources();
  }

  currentUser = getCurrentUser();
  let filtered = [...resources];

  // Status filter
  if (currentFilter === 'my') {
    if (currentUser) {
      filtered = filtered.filter(r => r.createdBy === currentUser.id || r.createdBy === currentUser.email);
    } else {
      filtered = [];
    }
  } else if (currentFilter !== 'all') {
    filtered = filtered.filter(r => r.type === currentFilter);
  }

  // Search filter
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter(r => 
      r.title.toLowerCase().includes(query) ||
      r.description.toLowerCase().includes(query) ||
      r.category.toLowerCase().includes(query)
    );
  }

  // Category filter
  if (categoryFilter !== 'all') {
    filtered = filtered.filter(r => r.category === categoryFilter);
  }

  // Update stats
  const totalDownloads = resources.reduce((sum, r) => sum + (r.downloads || 0), 0);
  const totalBookmarks = resources.reduce((sum, r) => sum + (r.bookmarks || 0), 0);
  const totalViews = resources.reduce((sum, r) => sum + (r.views || 0), 0);
  
  document.getElementById('resourceCount').textContent = resources.length;
  document.getElementById('totalDownloads').textContent = totalDownloads.toLocaleString();
  document.getElementById('totalBookmarks').textContent = totalBookmarks.toLocaleString();
  document.getElementById('totalViews').textContent = totalViews.toLocaleString();

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1; text-align:center; padding:60px 20px;">
        <span style="font-size:48px;display:block;margin-bottom:16px;">🔍</span>
        <h3 style="font-size:20px;color:#0f172a;">No resources found</h3>
        <p style="color:#94a3b8;">Try adjusting your filters or upload a new resource</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map(resource => {
    const typeIcons = {
      'pdf': '📄',
      'video': '🎥',
      'ppt': '📊',
      'book': '📚',
      'link': '🔗'
    };
    
    const isBookmarked = bookmarks.includes(resource.id);
    const typeIcon = typeIcons[resource.type] || '📄';

    return `
      <div class="resource-card" onclick="viewResourceDetail(${resource.id})" data-id="${resource.id}">
        <div>
          <span class="resource-type ${resource.type}">${typeIcon} ${resource.type.toUpperCase()}</span>
          <span class="resource-category">${resource.category}</span>
        </div>
        <div class="resource-name">${resource.title}</div>
        <div class="resource-description">${resource.description || 'No description available'}</div>
        <div class="resource-meta">
          <span>📏 ${resource.size}</span>
          <span>📥 ${(resource.downloads || 0).toLocaleString()}</span>
          <span>👁️ ${(resource.views || 0).toLocaleString()}</span>
        </div>
        <div class="resource-footer">
          <button class="bookmark-btn ${isBookmarked ? 'bookmarked' : ''}" 
                  onclick="event.stopPropagation(); toggleBookmark(${resource.id})">
            ${isBookmarked ? '📌' : '☆'} Bookmark
          </button>
          <div style="display:flex; gap:6px;">
            <button class="btn btn-primary btn-sm" onclick="event.stopPropagation(); downloadResource(${resource.id})">📥 Download</button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// ============================================
// VIEW RESOURCE DETAIL
// ============================================

function viewResourceDetail(resourceId) {
  const resource = resources.find(r => r.id === resourceId);
  if (!resource) {
    showToast('Resource not found', 'error');
    return;
  }

  // Increment views
  resource.views = (resource.views || 0) + 1;
  saveResources(resources);

  const modal = document.getElementById('resourceDetailModal');
  const body = document.getElementById('resourceDetailBody');

  const typeIcons = {
    'pdf': '📄',
    'video': '🎥',
    'ppt': '📊',
    'book': '📚',
    'link': '🔗'
  };
  
  const isBookmarked = bookmarks.includes(resource.id);

  body.innerHTML = `
    <div style="padding:30px;">
      <div style="display:flex; justify-content:space-between; align-items:start; margin-bottom:12px;">
        <div>
          <span style="display:inline-block;padding:4px 16px;border-radius:999px;font-size:12px;font-weight:600;background:#f1f5f9;color:#475569;margin-bottom:8px;">
            ${typeIcons[resource.type] || '📄'} ${resource.type.toUpperCase()} • ${resource.category}
          </span>
          <h2 style="font-family:'Poppins',sans-serif; font-size:24px; margin:0;">${resource.title}</h2>
        </div>
        <button class="bookmark-btn ${isBookmarked ? 'bookmarked' : ''}" onclick="toggleBookmark(${resource.id}); renderResources(); viewResourceDetail(${resource.id})">
          ${isBookmarked ? '📌' : '☆'} Bookmark
        </button>
      </div>
      
      <p style="font-size:15px; color:#475569; line-height:1.7; margin:12px 0 16px;">${resource.description || 'No description available'}</p>
      
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin:16px 0; padding:16px; background:#f8fafc; border-radius:12px;">
        <div style="display:flex; align-items:center; gap:8px; font-size:14px; color:#475569;">
          <span>📏</span> ${resource.size}
        </div>
        <div style="display:flex; align-items:center; gap:8px; font-size:14px; color:#475569;">
          <span>📥</span> ${(resource.downloads || 0).toLocaleString()} downloads
        </div>
        <div style="display:flex; align-items:center; gap:8px; font-size:14px; color:#475569;">
          <span>👁️</span> ${(resource.views || 0).toLocaleString()} views
        </div>
        <div style="display:flex; align-items:center; gap:8px; font-size:14px; color:#475569;">
          <span>📌</span> ${(resource.bookmarks || 0).toLocaleString()} bookmarks
        </div>
      </div>
      
      <div style="display:flex; gap:12px; margin-top:20px; flex-wrap:wrap;">
        <button class="btn btn-primary" onclick="downloadResource(${resource.id})">📥 Download Resource</button>
        ${resource.url && resource.url !== '#' ? `<button class="btn btn-outline" onclick="window.open('${resource.url}', '_blank')">🔗 Open Link</button>` : ''}
        <button class="btn btn-outline" onclick="closeResourceDetail()">Close</button>
      </div>
    </div>
  `;

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeResourceDetail() {
  const modal = document.getElementById('resourceDetailModal');
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

// ============================================
// DOWNLOAD RESOURCE
// ============================================

function downloadResource(resourceId) {
  const resource = resources.find(r => r.id === resourceId);
  if (!resource) {
    showToast('Resource not found', 'error');
    return;
  }

  // Increment downloads
  resource.downloads = (resource.downloads || 0) + 1;
  saveResources(resources);

  showToast(`📥 Downloading: ${resource.title}`, 'success');
  
  // If it's a link, open in new tab
  if (resource.url && resource.url !== '#') {
    setTimeout(() => {
      window.open(resource.url, '_blank');
    }, 500);
  }
  
  renderResources();
}

// ============================================
// BOOKMARK RESOURCE
// ============================================

function toggleBookmark(resourceId) {
  const resource = resources.find(r => r.id === resourceId);
  if (!resource) return;

  const currentUser = getCurrentUser();
  if (!currentUser) {
    showToast('Please login to bookmark resources', 'warning');
    return;
  }

  const index = bookmarks.indexOf(resourceId);
  if (index > -1) {
    bookmarks.splice(index, 1);
    resource.bookmarks = (resource.bookmarks || 1) - 1;
    showToast(`Removed bookmark for "${resource.title}"`, 'info');
  } else {
    bookmarks.push(resourceId);
    resource.bookmarks = (resource.bookmarks || 0) + 1;
    showToast(`📌 Bookmarked "${resource.title}"!`, 'success');
  }

  localStorage.setItem('sj_bookmarks', JSON.stringify(bookmarks));
  saveResources(resources);
  renderResources();
}

// ============================================
// FILTER FUNCTIONS
// ============================================

function filterResources(filter) {
  document.querySelectorAll('.chip[data-filter]').forEach(chip => {
    chip.classList.remove('active');
    if (chip.dataset.filter === filter) {
      chip.classList.add('active');
    }
  });
  
  currentFilter = filter;
  renderResources();
  
  const filterNames = {
    'all': '📋 All',
    'pdf': '📄 PDF',
    'video': '🎥 Videos',
    'ppt': '📊 PPT',
    'book': '📚 Books',
    'link': '🔗 Links',
    'my': '📌 My Uploads'
  };
  showToast(`Filter: ${filterNames[filter] || filter}`, 'info');
}

function searchResources(query) {
  searchQuery = query;
  renderResources();
}

function filterByCategory(category) {
  categoryFilter = category;
  renderResources();
}

// ============================================
// UPLOAD RESOURCE
// ============================================

function openUploadResource() {
  const modal = document.getElementById('uploadResourceModal');
  if (!modal) {
    showToast('Upload resource modal not found', 'error');
    return;
  }
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeUploadResource() {
  const modal = document.getElementById('uploadResourceModal');
  modal.classList.remove('active');
  document.body.style.overflow = '';
  document.getElementById('uploadResourceForm').reset();
}

function publishResource(e) {
  e.preventDefault();
  
  const user = getCurrentUser();
  if (!user) {
    showToast('Please login to upload resources', 'warning');
    return;
  }

  const title = document.getElementById('resourceTitle').value.trim();
  const type = document.getElementById('resourceType').value;
  const category = document.getElementById('resourceCategory').value;
  const description = document.getElementById('resourceDescription').value.trim();
  const size = document.getElementById('resourceSize').value.trim();
  const stats = document.getElementById('resourceStats').value.trim();
  const url = document.getElementById('resourceUrl').value.trim();

  if (!title || !type || !category) {
    showToast('Please fill all required fields', 'warning');
    return;
  }

  const newResource = {
    id: Date.now(),
    title: title,
    type: type,
    category: category,
    description: description || 'No description available',
    size: size || 'N/A',
    stats: stats || '0',
    url: url || '#',
    downloads: 0,
    views: 0,
    bookmarks: 0,
    createdAt: new Date().toISOString(),
    createdBy: user.id || user.email
  };

  resources.push(newResource);
  saveResources(resources);
  
  closeUploadResource();
  renderResources();
  
  showToast(`✅ "${title}" uploaded successfully!`, 'success');
}

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
  
  try {
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
  } catch (e) {
    headerAvatar.textContent = 'AS';
  }
}

// ============================================
// TOAST SYSTEM
// ============================================

function showToast(message, type = 'info', duration = 4000) {
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
    padding: 16px 20px;
    border-radius: 14px;
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
    <span style="font-size:20px;flex-shrink:0;">${icons[type] || icons.info}</span>
    <span>${message}</span>
    <button style="background:none;border:none;color:rgba(255,255,255,0.5);font-size:20px;cursor:pointer;padding:0 4px;margin-left:auto;" onclick="this.closest('.toast').style.transform='translateX(80%) scale(0.8)'; this.closest('.toast').style.opacity='0'; setTimeout(() => this.closest('.toast').remove(), 400);">×</button>
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
// INITIALIZE
// ============================================

document.addEventListener('DOMContentLoaded', function() {
  console.log('📂 Resources Page Loading...');
  
  loadResources();
  updateHeaderAvatar();
  renderResources();
  
  console.log('📂 Resources Page Ready!');
  console.log('📊 ' + resources.length + ' resources loaded');
});

// Make functions globally available
window.filterResources = filterResources;
window.searchResources = searchResources;
window.filterByCategory = filterByCategory;
window.renderResources = renderResources;
window.downloadResource = downloadResource;
window.toggleBookmark = toggleBookmark;
window.viewResourceDetail = viewResourceDetail;
window.closeResourceDetail = closeResourceDetail;
window.openUploadResource = openUploadResource;
window.closeUploadResource = closeUploadResource;
window.publishResource = publishResource;
window.showToast = showToast;