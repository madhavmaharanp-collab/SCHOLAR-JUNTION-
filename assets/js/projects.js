// ============================================
// PROJECTS - Complete JavaScript
// ============================================

// ============================================
// PROJECT DATA
// ============================================

let projects = [];
let currentFilter = 'all';
let searchQuery = '';
let categoryFilter = 'all';
let currentUser = null;
let starredProjects = JSON.parse(localStorage.getItem('sj_starred') || '[]');

// ============================================
// GET DEFAULT PROJECTS
// ============================================

function getDefaultProjects() {
  return [
    {
      id: 1,
      name: 'ScholarGraph',
      description: 'Open academic knowledge graph with hybrid search capabilities. Built for researchers and students to explore academic connections.',
      category: 'AI',
      tech: ['TypeScript', 'Python', 'GraphQL'],
      stars: 1420,
      views: 3200,
      teams: 12,
      github: 'https://github.com/scholarjunction/scholargraph',
      demo: 'https://scholargraph.scholarjunction.app',
      createdAt: new Date().toISOString(),
      createdBy: 'admin',
      images: ['https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=300&fit=crop']
    },
    {
      id: 2,
      name: 'NepalEdu Cloud',
      description: 'Serverless LMS platform designed for rural colleges in Nepal. Offline-first architecture with PWA support.',
      category: 'Cloud',
      tech: ['Next.js', 'SST', 'AWS', 'DynamoDB'],
      stars: 642,
      views: 1800,
      teams: 8,
      github: 'https://github.com/scholarjunction/nepaledu',
      demo: 'https://nepaledu.scholarjunction.app',
      createdAt: new Date().toISOString(),
      createdBy: 'admin',
      images: ['https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=600&h=300&fit=crop']
    },
    {
      id: 3,
      name: 'ProofPilot',
      description: 'AI co-pilot that checks LaTeX mathematical proofs step-by-step. Helps students and researchers verify their work.',
      category: 'AI',
      tech: ['Rust', 'LLM', 'LaTeX'],
      stars: 889,
      views: 2100,
      teams: 6,
      github: 'https://github.com/scholarjunction/proofpilot',
      demo: 'https://proofpilot.scholarjunction.app',
      createdAt: new Date().toISOString(),
      createdBy: 'admin',
      images: ['https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&h=300&fit=crop']
    },
    {
      id: 4,
      name: 'CTF Arena',
      description: 'Open-source cybersecurity training platform with real-world challenges. Learn penetration testing and security concepts.',
      category: 'Security',
      tech: ['Go', 'React', 'Docker', 'PostgreSQL'],
      stars: 312,
      views: 950,
      teams: 5,
      github: 'https://github.com/scholarjunction/ctf-arena',
      demo: 'https://ctf.scholarjunction.app',
      createdAt: new Date().toISOString(),
      createdBy: 'admin',
      images: ['https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&h=300&fit=crop']
    },
    {
      id: 5,
      name: 'MediRAG Nepal',
      description: 'Clinical RAG (Retrieval-Augmented Generation) system supporting both Nepali and English languages for medical information.',
      category: 'AI',
      tech: ['Python', 'RAG', 'LangChain', 'FAISS'],
      stars: 204,
      views: 670,
      teams: 4,
      github: 'https://github.com/scholarjunction/medirag',
      demo: 'https://medirag.scholarjunction.app',
      createdAt: new Date().toISOString(),
      createdBy: 'admin',
      images: ['https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&h=300&fit=crop']
    },
    {
      id: 6,
      name: 'CampusOS',
      description: 'Open-source university ERP system with modules for student management, grading, attendance, and communication.',
      category: 'Web',
      tech: ['Laravel', 'Vue.js', 'MySQL', 'Redis'],
      stars: 578,
      views: 1500,
      teams: 10,
      github: 'https://github.com/scholarjunction/campusos',
      demo: 'https://campusos.scholarjunction.app',
      createdAt: new Date().toISOString(),
      createdBy: 'admin',
      images: ['https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=600&h=300&fit=crop']
    }
  ];
}

// ============================================
// LOAD & SAVE PROJECTS
// ============================================

function loadProjects() {
  try {
    const stored = localStorage.getItem('sj_projects');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed && parsed.length > 0) {
        projects = parsed;
        console.log('📂 Projects loaded from localStorage:', projects.length);
        return;
      }
    }
  } catch (e) {
    console.warn('Could not load projects from localStorage');
  }
  
  projects = getDefaultProjects();
  saveProjects(projects);
  console.log('📂 Default projects loaded:', projects.length);
}

function saveProjects(projectsData) {
  try {
    localStorage.setItem('sj_projects', JSON.stringify(projectsData));
  } catch (e) {
    console.warn('Could not save projects to localStorage');
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
// RENDER PROJECTS
// ============================================

function renderProjects() {
  const grid = document.getElementById('projectGrid');
  if (!grid) {
    console.warn('Project grid not found');
    return;
  }

  if (!projects || projects.length === 0) {
    loadProjects();
  }

  currentUser = getCurrentUser();
  let filtered = [...projects];

  // Status filter
  if (currentFilter === 'trending') {
    filtered = filtered.sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 6);
  } else if (currentFilter === 'most-starred') {
    filtered = filtered.sort((a, b) => (b.stars || 0) - (a.stars || 0));
  } else if (currentFilter === 'my') {
    if (currentUser) {
      filtered = filtered.filter(p => p.createdBy === currentUser.id || p.createdBy === currentUser.email);
    } else {
      filtered = [];
    }
  }

  // Search filter
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query) ||
      p.tech.some(t => t.toLowerCase().includes(query))
    );
  }

  // Category filter
  if (categoryFilter !== 'all') {
    filtered = filtered.filter(p => p.category === categoryFilter);
  }

  // Update stats
  const totalStars = projects.reduce((sum, p) => sum + (p.stars || 0), 0);
  const totalTeams = projects.reduce((sum, p) => sum + (p.teams || 0), 0);
  const totalViews = projects.reduce((sum, p) => sum + (p.views || 0), 0);
  
  document.getElementById('projectCount').textContent = projects.length;
  document.getElementById('totalStars').textContent = totalStars.toLocaleString();
  document.getElementById('totalTeams').textContent = totalTeams;
  document.getElementById('totalViews').textContent = totalViews.toLocaleString();

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1; text-align:center; padding:60px 20px;">
        <span style="font-size:48px;display:block;margin-bottom:16px;">🔍</span>
        <h3 style="font-size:20px;color:#0f172a;">No projects found</h3>
        <p style="color:#94a3b8;">Try adjusting your filters or create a new project</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map(project => {
    const isStarred = starredProjects.includes(project.id);
    
    return `
      <div class="project-card" onclick="viewProjectDetail(${project.id})" data-id="${project.id}">
        <span class="project-category">${getCategoryIcon(project.category)} ${project.category}</span>
        <div class="project-name">${project.name}</div>
        <div class="project-description">${project.description}</div>
        <div class="project-tech">
          ${project.tech.map(t => `<span class="tech-tag">${t}</span>`).join('')}
        </div>
        <div class="project-meta">
          <span>⭐ ${(project.stars || 0).toLocaleString()}</span>
          <span>👁️ ${(project.views || 0).toLocaleString()}/wk</span>
          <span>👥 ${project.teams || 0} teams</span>
        </div>
        <div class="project-footer">
          <button class="star-btn ${isStarred ? 'starred' : ''}" 
                  onclick="event.stopPropagation(); toggleStar(${project.id})">
            ${isStarred ? '⭐' : '☆'} Star
          </button>
          <div style="display:flex; gap:6px;">
            ${project.demo ? `<button class="btn btn-outline btn-sm" onclick="event.stopPropagation(); window.open('${project.demo}', '_blank')">Demo</button>` : ''}
            ${project.github ? `<button class="btn btn-outline btn-sm" onclick="event.stopPropagation(); window.open('${project.github}', '_blank')">GitHub</button>` : ''}
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// ============================================
// GET CATEGORY ICON
// ============================================

function getCategoryIcon(category) {
  const icons = {
    'AI': '🤖',
    'Cloud': '☁️',
    'Web': '🌐',
    'Security': '🔐',
    'DevOps': '🚀',
    'Data': '📊',
    'Mobile': '📱'
  };
  return icons[category] || '📁';
}

// ============================================
// STAR PROJECT
// ============================================

function toggleStar(projectId) {
  const project = projects.find(p => p.id === projectId);
  if (!project) return;

  const index = starredProjects.indexOf(projectId);
  if (index > -1) {
    starredProjects.splice(index, 1);
    project.stars = (project.stars || 1) - 1;
    showToast(`⭐ Unstarred "${project.name}"`, 'info');
  } else {
    starredProjects.push(projectId);
    project.stars = (project.stars || 0) + 1;
    showToast(`⭐ Starred "${project.name}"!`, 'success');
  }

  localStorage.setItem('sj_starred', JSON.stringify(starredProjects));
  saveProjects(projects);
  renderProjects();
}

// ============================================
// VIEW PROJECT DETAIL
// ============================================

function viewProjectDetail(projectId) {
  const project = projects.find(p => p.id === projectId);
  if (!project) {
    showToast('Project not found', 'error');
    return;
  }

  // Increment views
  project.views = (project.views || 0) + 1;
  saveProjects(projects);

  const modal = document.getElementById('projectDetailModal');
  const body = document.getElementById('projectDetailBody');

  const isStarred = starredProjects.includes(project.id);

  body.innerHTML = `
    <div style="padding:30px;">
      <div style="display:flex; justify-content:space-between; align-items:start; margin-bottom:12px;">
        <div>
          <span style="display:inline-block;padding:4px 16px;border-radius:999px;font-size:12px;font-weight:600;background:#eff6ff;color:#2563EB;margin-bottom:8px;">
            ${getCategoryIcon(project.category)} ${project.category}
          </span>
          <h2 style="font-family:'Poppins',sans-serif; font-size:26px; margin:0;">${project.name}</h2>
        </div>
        <button class="star-btn ${isStarred ? 'starred' : ''}" onclick="toggleStar(${project.id}); renderProjects(); viewProjectDetail(${project.id})">
          ${isStarred ? '⭐' : '☆'} ${project.stars || 0}
        </button>
      </div>
      
      <p style="font-size:15px; color:#475569; line-height:1.7; margin:12px 0 16px;">${project.description}</p>
      
      <div style="display:flex; flex-wrap:wrap; gap:8px; margin:12px 0;">
        ${project.tech.map(t => `<span style="padding:4px 14px;border-radius:999px;font-size:12px;background:#f1f5f9;color:#475569;">${t}</span>`).join('')}
      </div>
      
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin:16px 0; padding:16px; background:#f8fafc; border-radius:12px;">
        <div style="display:flex; align-items:center; gap:8px; font-size:14px; color:#475569;">
          <span>⭐</span> ${(project.stars || 0).toLocaleString()} stars
        </div>
        <div style="display:flex; align-items:center; gap:8px; font-size:14px; color:#475569;">
          <span>👁️</span> ${(project.views || 0).toLocaleString()} views
        </div>
        <div style="display:flex; align-items:center; gap:8px; font-size:14px; color:#475569;">
          <span>👥</span> ${project.teams || 0} teams
        </div>
        <div style="display:flex; align-items:center; gap:8px; font-size:14px; color:#475569;">
          <span>📅</span> ${new Date(project.createdAt).toLocaleDateString()}
        </div>
      </div>
      
      <div style="display:flex; gap:12px; margin-top:20px; flex-wrap:wrap;">
        ${project.demo ? `<button class="btn btn-primary" onclick="window.open('${project.demo}', '_blank')">🚀 View Demo</button>` : ''}
        ${project.github ? `<button class="btn btn-outline" onclick="window.open('${project.github}', '_blank')">🐙 View GitHub</button>` : ''}
        <button class="btn btn-outline" onclick="closeProjectDetail()">Close</button>
      </div>
    </div>
  `;

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeProjectDetail() {
  const modal = document.getElementById('projectDetailModal');
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

// ============================================
// FILTER FUNCTIONS
// ============================================

function filterProjects(filter) {
  document.querySelectorAll('.chip[data-filter]').forEach(chip => {
    chip.classList.remove('active');
    if (chip.dataset.filter === filter) {
      chip.classList.add('active');
    }
  });
  
  currentFilter = filter;
  renderProjects();
  
  const filterNames = {
    'all': '📋 All',
    'trending': '🔥 Trending',
    'most-starred': '⭐ Most Starred',
    'my': '📌 My Projects'
  };
  showToast(`Filter: ${filterNames[filter] || filter}`, 'info');
}

function searchProjects(query) {
  searchQuery = query;
  renderProjects();
}

function filterByCategory(category) {
  categoryFilter = category;
  renderProjects();
}

// ============================================
// CREATE PROJECT
// ============================================

function openCreateProject() {
  const modal = document.getElementById('createProjectModal');
  if (!modal) {
    showToast('Create project modal not found', 'error');
    return;
  }
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeCreateProject() {
  const modal = document.getElementById('createProjectModal');
  modal.classList.remove('active');
  document.body.style.overflow = '';
  document.getElementById('createProjectForm').reset();
}

function publishProject(e) {
  e.preventDefault();
  
  const user = getCurrentUser();
  if (!user) {
    showToast('Please login to create projects', 'warning');
    return;
  }

  const name = document.getElementById('projectName').value.trim();
  const category = document.getElementById('projectCategory').value;
  const description = document.getElementById('projectDescription').value.trim();
  const tech = document.getElementById('projectTech').value.trim();
  const github = document.getElementById('projectGithub').value.trim();
  const demo = document.getElementById('projectDemo').value.trim();

  if (!name || !category || !description) {
    showToast('Please fill all required fields', 'warning');
    return;
  }

  const techArray = tech ? tech.split(',').map(t => t.trim()).filter(t => t) : [];

  const newProject = {
    id: Date.now(),
    name: name,
    category: category,
    description: description,
    tech: techArray,
    stars: 0,
    views: 0,
    teams: 0,
    github: github || null,
    demo: demo || null,
    createdAt: new Date().toISOString(),
    createdBy: user.id || user.email,
    images: ['https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600&h=300&fit=crop']
  };

  projects.push(newProject);
  saveProjects(projects);
  
  closeCreateProject();
  renderProjects();
  
  showToast(`✅ Project "${name}" published successfully!`, 'success');
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
  console.log('🚀 Projects Page Loading...');
  
  loadProjects();
  updateHeaderAvatar();
  renderProjects();
  
  console.log('🚀 Projects Page Ready!');
  console.log('📊 ' + projects.length + ' projects loaded');
});

// Make functions globally available
window.filterProjects = filterProjects;
window.searchProjects = searchProjects;
window.filterByCategory = filterByCategory;
window.renderProjects = renderProjects;
window.toggleStar = toggleStar;
window.viewProjectDetail = viewProjectDetail;
window.closeProjectDetail = closeProjectDetail;
window.openCreateProject = openCreateProject;
window.closeCreateProject = closeCreateProject;
window.publishProject = publishProject;
window.showToast = showToast;