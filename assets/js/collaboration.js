// ============================================
// COLLABORATION - Complete JavaScript
// ============================================

// ============================================
// DATA
// ============================================

let opportunities = [];
let applications = JSON.parse(localStorage.getItem('sj_applications') || '[]');
let currentFilter = 'all';
let searchQuery = '';
let skillFilter = 'all';
let currentUser = null;

// ============================================
// GET DEFAULT OPPORTUNITIES
// ============================================

function getDefaultOpportunities() {
  return [
    {
      id: 1,
      title: 'Need Frontend Developer',
      type: 'hiring',
      description: 'Looking for a skilled frontend developer to join the ScholarGraph team. Work on cutting-edge knowledge graph visualization.',
      skills: ['React', 'TypeScript', 'Next.js'],
      project: 'ScholarGraph',
      location: 'Remote',
      applicants: 12,
      createdAt: new Date().toISOString(),
      createdBy: 'admin'
    },
    {
      id: 2,
      title: 'Need UI/UX Designer',
      type: 'hiring',
      description: 'Seeking a UI/UX designer to help redesign NepalEdu Cloud platform. Experience with design systems and Figma required.',
      skills: ['Figma', 'UI/UX', 'Design System'],
      project: 'NepalEdu Cloud',
      location: 'Remote',
      applicants: 8,
      createdAt: new Date().toISOString(),
      createdBy: 'admin'
    },
    {
      id: 3,
      title: 'Research Partner for RAG Evaluation',
      type: 'research',
      description: 'Looking for a research partner to work on RAG evaluation metrics and publish an IEEE paper together.',
      skills: ['ML', 'NLP', 'Research'],
      project: 'RAG Evaluation',
      location: 'Remote',
      applicants: 6,
      createdAt: new Date().toISOString(),
      createdBy: 'admin'
    },
    {
      id: 4,
      title: 'Cloud Engineer Intern',
      type: 'internship',
      description: 'Internship opportunity for cloud engineers. Work on EKS, FinOps, and cloud architecture with the team.',
      skills: ['AWS', 'Kubernetes', 'Terraform'],
      project: 'Cloud Platform',
      location: 'Kathmandu',
      applicants: 15,
      createdAt: new Date().toISOString(),
      createdBy: 'admin'
    },
    {
      id: 5,
      title: 'Data Annotator Needed',
      type: 'hiring',
      description: 'Need data annotators for Nepali NLP dataset. Attention to detail and language skills required.',
      skills: ['NLP', 'Data Annotation', 'Nepali'],
      project: 'Nepali NLP Corpus',
      location: 'Remote',
      applicants: 9,
      createdAt: new Date().toISOString(),
      createdBy: 'admin'
    },
    {
      id: 6,
      title: 'ML Research Collaboration',
      type: 'research',
      description: 'Looking for ML researchers interested in Topological Data Analysis and Graph Neural Networks.',
      skills: ['ML', 'GNN', 'TDA'],
      project: 'ML Research',
      location: 'Remote',
      applicants: 4,
      createdAt: new Date().toISOString(),
      createdBy: 'admin'
    }
  ];
}

// ============================================
// GET DEMO MEMBERS
// ============================================

function getDemoMembers() {
  return [
    { id: 'mem_1', name: 'Maya Rana', role: 'ML Researcher', skills: ['ML', 'Python', 'NLP'], status: 'available', match: 94 },
    { id: 'mem_2', name: 'Bibek Thapa', role: 'Cloud Engineer', skills: ['Cloud', 'AWS', 'Kubernetes'], status: 'available', match: 88 },
    { id: 'mem_3', name: 'Anusha B.', role: 'UI/UX Designer', skills: ['UI/UX', 'Figma', 'Design'], status: 'available', match: 82 },
    { id: 'mem_4', name: 'Sujit R.', role: 'Full Stack Developer', skills: ['React', 'Node.js', 'Python'], status: 'busy', match: 76 }
  ];
}

// ============================================
// LOAD & SAVE OPPORTUNITIES
// ============================================

function loadOpportunities() {
  try {
    const stored = localStorage.getItem('sj_opportunities');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed && parsed.length > 0) {
        opportunities = parsed;
        console.log('📂 Opportunities loaded from localStorage:', opportunities.length);
        return;
      }
    }
  } catch (e) {
    console.warn('Could not load opportunities from localStorage');
  }
  
  opportunities = getDefaultOpportunities();
  saveOpportunities(opportunities);
  console.log('📂 Default opportunities loaded:', opportunities.length);
}

function saveOpportunities(oppData) {
  try {
    localStorage.setItem('sj_opportunities', JSON.stringify(oppData));
  } catch (e) {
    console.warn('Could not save opportunities to localStorage');
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
// RENDER OPPORTUNITIES
// ============================================

function renderOpportunities() {
  const grid = document.getElementById('opportunityGrid');
  if (!grid) return;

  if (!opportunities || opportunities.length === 0) {
    loadOpportunities();
  }

  currentUser = getCurrentUser();
  let filtered = [...opportunities];

  // Status filter
  if (currentFilter === 'my') {
    if (currentUser) {
      filtered = filtered.filter(o => o.createdBy === currentUser.id || o.createdBy === currentUser.email);
    } else {
      filtered = [];
    }
  } else if (currentFilter !== 'all') {
    filtered = filtered.filter(o => o.type === currentFilter);
  }

  // Search filter
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter(o => 
      o.title.toLowerCase().includes(query) ||
      o.description.toLowerCase().includes(query) ||
      o.project.toLowerCase().includes(query) ||
      o.skills.some(s => s.toLowerCase().includes(query))
    );
  }

  // Skill filter
  if (skillFilter !== 'all') {
    filtered = filtered.filter(o => o.skills.includes(skillFilter));
  }

  // Update stats
  document.getElementById('opportunityCount').textContent = opportunities.length;
  document.getElementById('totalMembers').textContent = '248';
  document.getElementById('totalMatches').textContent = '1,342';
  document.getElementById('totalApplications').textContent = applications.length;

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1; text-align:center; padding:60px 20px;">
        <span style="font-size:48px;display:block;margin-bottom:16px;">🔍</span>
        <h3 style="font-size:20px;color:#0f172a;">No opportunities found</h3>
        <p style="color:#94a3b8;">Try adjusting your filters or post a new opportunity</p>
      </div>
    `;
    return;
  }

  const typeIcons = { 'hiring': '💼', 'research': '🔬', 'internship': '🎓' };
  const typeLabels = { 'hiring': 'Hiring', 'research': 'Research', 'internship': 'Internship' };

  grid.innerHTML = filtered.map(opp => {
    const hasApplied = applications.some(a => a.opportunityId === opp.id);
    
    return `
      <div class="opportunity-card" onclick="viewOpportunityDetail(${opp.id})" data-id="${opp.id}">
        <span class="opp-badge ${opp.type}">${typeIcons[opp.type] || '📌'} ${typeLabels[opp.type] || opp.type}</span>
        <div class="opp-title">${opp.title}</div>
        <div class="opp-description">${opp.description}</div>
        <div class="opp-skills">
          ${opp.skills.map(s => `<span class="skill-tag">${s}</span>`).join('')}
        </div>
        <div class="opp-meta">
          <span>🏷️ ${opp.project}</span>
          <span>📍 ${opp.location}</span>
          <span>👥 ${opp.applicants || 0} applicants</span>
        </div>
        <div class="opp-footer">
          <div class="opp-applicants">
            <div class="mini-avatar">👤</div>
            <span>${opp.applicants || 0} applied</span>
          </div>
          <button class="btn ${hasApplied ? 'btn-success' : 'btn-primary'} btn-sm" 
                  onclick="event.stopPropagation(); applyForOpportunity(${opp.id})">
            ${hasApplied ? '✅ Applied' : 'Apply Now'}
          </button>
        </div>
      </div>
    `;
  }).join('');

  // Render members and skill match
  renderMembers();
  renderSkillMatch();
}

// ============================================
// RENDER MEMBERS
// ============================================

function renderMembers() {
  const grid = document.getElementById('membersGrid');
  if (!grid) return;

  const members = getDemoMembers();

  grid.innerHTML = members.map(member => {
    const initial = member.name.charAt(0).toUpperCase();
    return `
      <div class="member-card">
        <div class="member-avatar">${initial}</div>
        <div class="member-name">${member.name}</div>
        <div class="member-role">${member.role}</div>
        <div class="member-skills">
          ${member.skills.map(s => `<span class="skill-tag">${s}</span>`).join('')}
        </div>
        <div class="member-status">
          <span class="dot"></span>
          ${member.status === 'available' ? 'Available this week' : 'Currently busy'}
        </div>
        <button class="btn btn-outline btn-sm mt-2" onclick="connectWithMember('${member.id}')">Connect</button>
      </div>
    `;
  }).join('');
}

// ============================================
// RENDER SKILL MATCH
// ============================================

function renderSkillMatch() {
  const container = document.getElementById('skillMatchList');
  if (!container) return;

  const members = getDemoMembers();
  const matchPercentage = document.getElementById('matchPercentage');
  if (matchPercentage) {
    const avgMatch = Math.round(members.reduce((sum, m) => sum + m.match, 0) / members.length);
    matchPercentage.textContent = `${avgMatch}% Match`;
  }

  container.innerHTML = members.slice(0, 3).map(member => `
    <div class="skill-match-item">
      <span class="match-name">${member.name}</span>
      <div class="match-skills">
        ${member.skills.map(s => `<span class="skill-tag">${s}</span>`).join('')}
      </div>
      <span class="match-percentage">${member.match}%</span>
    </div>
  `).join('');
}

// ============================================
// VIEW OPPORTUNITY DETAIL
// ============================================

function viewOpportunityDetail(oppId) {
  const opp = opportunities.find(o => o.id === oppId);
  if (!opp) {
    showToast('Opportunity not found', 'error');
    return;
  }

  const modal = document.getElementById('opportunityDetailModal');
  const body = document.getElementById('opportunityDetailBody');

  const typeIcons = { 'hiring': '💼', 'research': '🔬', 'internship': '🎓' };
  const typeLabels = { 'hiring': 'Hiring', 'research': 'Research', 'internship': 'Internship' };
  const hasApplied = applications.some(a => a.opportunityId === opp.id);

  body.innerHTML = `
    <div style="padding:30px;">
      <div style="display:flex; justify-content:space-between; align-items:start; margin-bottom:12px;">
        <div>
          <span style="display:inline-block;padding:4px 16px;border-radius:999px;font-size:12px;font-weight:600;background:#f1f5f9;color:#475569;margin-bottom:8px;">
            ${typeIcons[opp.type] || '📌'} ${typeLabels[opp.type] || opp.type}
          </span>
          <h2 style="font-family:'Poppins',sans-serif; font-size:24px; margin:0;">${opp.title}</h2>
        </div>
      </div>
      
      <p style="font-size:15px; color:#475569; line-height:1.7; margin:12px 0 16px;">${opp.description}</p>
      
      <div style="display:flex; flex-wrap:wrap; gap:8px; margin:12px 0;">
        ${opp.skills.map(s => `<span style="padding:4px 14px;border-radius:999px;font-size:12px;background:#f1f5f9;color:#475569;">${s}</span>`).join('')}
      </div>
      
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin:16px 0; padding:16px; background:#f8fafc; border-radius:12px;">
        <div style="display:flex; align-items:center; gap:8px; font-size:14px; color:#475569;">
          <span>🏷️</span> ${opp.project}
        </div>
        <div style="display:flex; align-items:center; gap:8px; font-size:14px; color:#475569;">
          <span>📍</span> ${opp.location}
        </div>
        <div style="display:flex; align-items:center; gap:8px; font-size:14px; color:#475569;">
          <span>👥</span> ${opp.applicants || 0} applicants
        </div>
        <div style="display:flex; align-items:center; gap:8px; font-size:14px; color:#475569;">
          <span>📅</span> ${new Date(opp.createdAt).toLocaleDateString()}
        </div>
      </div>
      
      <div style="display:flex; gap:12px; margin-top:20px; flex-wrap:wrap;">
        <button class="btn ${hasApplied ? 'btn-success' : 'btn-primary'}" 
                onclick="applyForOpportunity(${opp.id}); closeOpportunityDetail()">
          ${hasApplied ? '✅ Applied' : '📩 Apply Now'}
        </button>
        <button class="btn btn-outline" onclick="closeOpportunityDetail()">Close</button>
      </div>
    </div>
  `;

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeOpportunityDetail() {
  const modal = document.getElementById('opportunityDetailModal');
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

// ============================================
// APPLY FOR OPPORTUNITY
// ============================================

function applyForOpportunity(oppId) {
  const opp = opportunities.find(o => o.id === oppId);
  if (!opp) {
    showToast('Opportunity not found', 'error');
    return;
  }

  const user = getCurrentUser();
  if (!user) {
    showToast('Please login to apply', 'warning');
    return;
  }

  // Check if already applied
  if (applications.some(a => a.opportunityId === oppId && a.userId === user.id)) {
    showToast('You have already applied for this opportunity', 'info');
    return;
  }

  // Add application
  applications.push({
    id: Date.now(),
    opportunityId: oppId,
    userId: user.id,
    userName: user.fullName || 'User',
    userEmail: user.email,
    appliedAt: new Date().toISOString()
  });

  opp.applicants = (opp.applicants || 0) + 1;

  localStorage.setItem('sj_applications', JSON.stringify(applications));
  saveOpportunities(opportunities);

  showToast(`✅ Application sent for "${opp.title}"!`, 'success');
  renderOpportunities();
}

// ============================================
// CONNECT WITH MEMBER
// ============================================

function connectWithMember(memberId) {
  const members = getDemoMembers();
  const member = members.find(m => m.id === memberId);
  if (!member) return;

  const user = getCurrentUser();
  if (!user) {
    showToast('Please login to connect', 'warning');
    return;
  }

  showToast(`✅ Connection request sent to ${member.name}!`, 'success');
}

// ============================================
// FILTER FUNCTIONS
// ============================================

function filterOpportunities(filter) {
  document.querySelectorAll('.chip[data-filter]').forEach(chip => {
    chip.classList.remove('active');
    if (chip.dataset.filter === filter) {
      chip.classList.add('active');
    }
  });
  
  currentFilter = filter;
  renderOpportunities();
  
  const filterNames = {
    'all': '📋 All',
    'hiring': '💼 Hiring',
    'research': '🔬 Research',
    'internship': '🎓 Internship',
    'my': '📌 My Posts'
  };
  showToast(`Filter: ${filterNames[filter] || filter}`, 'info');
}

function searchOpportunities(query) {
  searchQuery = query;
  renderOpportunities();
}

function filterBySkill(skill) {
  skillFilter = skill;
  renderOpportunities();
}

// ============================================
// CREATE OPPORTUNITY
// ============================================

function openCreateOpportunity() {
  const modal = document.getElementById('createOpportunityModal');
  if (!modal) {
    showToast('Create opportunity modal not found', 'error');
    return;
  }
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeCreateOpportunity() {
  const modal = document.getElementById('createOpportunityModal');
  modal.classList.remove('active');
  document.body.style.overflow = '';
  document.getElementById('createOppForm').reset();
}

function publishOpportunity(e) {
  e.preventDefault();
  
  const user = getCurrentUser();
  if (!user) {
    showToast('Please login to post opportunities', 'warning');
    return;
  }

  const title = document.getElementById('oppTitle').value.trim();
  const type = document.getElementById('oppType').value;
  const description = document.getElementById('oppDescription').value.trim();
  const skills = document.getElementById('oppSkills').value.trim();
  const project = document.getElementById('oppProject').value.trim() || 'General';
  const location = document.getElementById('oppLocation').value.trim() || 'Remote';

  if (!title || !type || !description) {
    showToast('Please fill all required fields', 'warning');
    return;
  }

  const skillsArray = skills ? skills.split(',').map(s => s.trim()).filter(s => s) : [];

  const newOpp = {
    id: Date.now(),
    title: title,
    type: type,
    description: description,
    skills: skillsArray,
    project: project,
    location: location,
    applicants: 0,
    createdAt: new Date().toISOString(),
    createdBy: user.id || user.email
  };

  opportunities.push(newOpp);
  saveOpportunities(opportunities);
  
  closeCreateOpportunity();
  renderOpportunities();
  
  showToast(`✅ "${title}" posted successfully!`, 'success');
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
  console.log('🤝 Collaboration Hub Loading...');
  
  loadOpportunities();
  updateHeaderAvatar();
  renderOpportunities();
  
  console.log('🤝 Collaboration Hub Ready!');
  console.log('📊 ' + opportunities.length + ' opportunities loaded');
});

// Make functions globally available
window.filterOpportunities = filterOpportunities;
window.searchOpportunities = searchOpportunities;
window.filterBySkill = filterBySkill;
window.renderOpportunities = renderOpportunities;
window.applyForOpportunity = applyForOpportunity;
window.connectWithMember = connectWithMember;
window.viewOpportunityDetail = viewOpportunityDetail;
window.closeOpportunityDetail = closeOpportunityDetail;
window.openCreateOpportunity = openCreateOpportunity;
window.closeCreateOpportunity = closeCreateOpportunity;
window.publishOpportunity = publishOpportunity;
window.showToast = showToast;