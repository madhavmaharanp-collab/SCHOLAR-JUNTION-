// ============================================
// EVENTS - Complete JavaScript
// ============================================

// ============================================
// EVENT DATA
// ============================================

let events = [];
let currentFilter = 'upcoming';
let searchQuery = '';
let typeFilter = 'all';
let currentUser = null;
let following = JSON.parse(localStorage.getItem('sj_following') || '[]');

// ============================================
// GET DEMO USERS
// ============================================

function getDemoUsers() {
  let users = [];
  
  if (typeof UserDB !== 'undefined') {
    try {
      const allUsers = UserDB.getAllUsers ? UserDB.getAllUsers() : [];
      if (allUsers && allUsers.length > 0) {
        users = allUsers.map(u => ({
          id: u.id || 'user_' + Math.random().toString(36).substr(2, 5),
          name: u.fullName || 'User',
          email: u.email || 'unknown@example.com',
          avatar: u.profileImage || null,
          role: u.role || 'student',
          country: u.country || 'Nepal',
          bio: u.bio || '',
          interests: u.interests || [],
          isVerified: u.isVerified || false
        }));
      }
    } catch (e) {
      console.warn('Could not get users from UserDB');
    }
  }
  
  if (users.length === 0) {
    users = [
      { id: 'user_001', name: 'Aarav Sharma', email: 'aarav@university.edu', avatar: null, role: 'Student', country: 'Nepal', bio: 'CS student passionate about AI', interests: ['AI', 'Python', 'ML'], isVerified: true },
      { id: 'user_002', name: 'Sarah Johnson', email: 'sarah@mit.edu', avatar: null, role: 'Researcher', country: 'USA', bio: 'PhD researcher in distributed systems', interests: ['Cloud', 'Distributed Systems'], isVerified: true },
      { id: 'user_003', name: 'Bibek Thapa', email: 'bibek@pulchowk.edu.np', avatar: null, role: 'Student', country: 'Nepal', bio: 'Web developer and UI/UX enthusiast', interests: ['Web Dev', 'React'], isVerified: false },
      { id: 'user_004', name: 'Maya Rana', email: 'maya@ku.edu.np', avatar: null, role: 'Teacher', country: 'Nepal', bio: 'Mathematics professor', interests: ['Math', 'Education'], isVerified: true },
      { id: 'user_005', name: 'John Doe', email: 'john@stanford.edu', avatar: null, role: 'Researcher', country: 'USA', bio: 'AI researcher at Stanford', interests: ['AI', 'NLP'], isVerified: false }
    ];
  }
  
  return users;
}

// ============================================
// GET DEFAULT EVENTS
// ============================================

function getDefaultEvents() {
  const users = getDemoUsers();
  
  return [
    {
      id: 1,
      title: "Global AI Research Summit 2026",
      description: "Join the world's leading AI researchers for a 3-day summit covering breakthroughs in machine learning, natural language processing, and AI ethics.",
      category: "AI & Machine Learning",
      type: "Online",
      status: "upcoming",
      date: "2026-07-24",
      time: "9:00 AM",
      location: "Virtual (Zoom)",
      participants: 1482,
      maxParticipants: 2000,
      image: "https://images.unsplash.com/photo-1507146153580-1f9e9d2c2b9c?w=600&h=400&fit=crop",
      badge: "Featured",
      price: "Free",
      speakers: ["Dr. A. Sharma", "Dr. M. Joshi", "Prof. K. Adhikari"],
      agenda: ["Day 1: Keynotes & Panels", "Day 2: Paper Presentations", "Day 3: Workshops & Networking"],
      createdAt: new Date().toISOString(),
      createdBy: "admin",
      registeredUsers: users.slice(0, 5).map(u => u.id),
      participantDetails: users.slice(0, 5)
    },
    {
      id: 2,
      title: "Cloud Native Study Jam",
      description: "Hands-on workshop covering Kubernetes, FinOps, and cloud-native architecture.",
      category: "Cloud Computing",
      type: "In-Person",
      status: "upcoming",
      date: "2026-07-14",
      time: "10:00 AM",
      location: "Kathmandu, Nepal",
      participants: 244,
      maxParticipants: 300,
      image: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=600&h=400&fit=crop",
      badge: "Popular",
      price: "Free",
      speakers: ["N. Rana", "S. Thapa"],
      agenda: ["Kubernetes 101", "FinOps Strategies", "Hands-on Labs"],
      createdAt: new Date().toISOString(),
      createdBy: "admin",
      registeredUsers: users.slice(0, 3).map(u => u.id),
      participantDetails: users.slice(0, 3)
    },
    {
      id: 3,
      title: "Publish your first IEEE paper",
      description: "A comprehensive workshop on academic writing, paper submission, and peer-review process.",
      category: "Academic Writing",
      type: "Hybrid",
      status: "upcoming",
      date: "2026-07-18",
      time: "2:00 PM",
      location: "Hybrid (In-person + Zoom)",
      participants: 97,
      maxParticipants: 150,
      image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&h=400&fit=crop",
      badge: "New",
      price: "$29.99",
      speakers: ["Dr. P. Karki", "Prof. S. Thapa"],
      agenda: ["Writing Tips", "Submission Process", "Q&A Session"],
      createdAt: new Date().toISOString(),
      createdBy: "admin",
      registeredUsers: users.slice(0, 4).map(u => u.id),
      participantDetails: users.slice(0, 4)
    },
    {
      id: 4,
      title: "Cybersecurity CTF Night",
      description: "Join the ultimate Capture The Flag competition. Test your hacking skills, compete with teams, and win exciting prizes.",
      category: "Cybersecurity",
      type: "Online",
      status: "upcoming",
      date: "2026-07-30",
      time: "7:00 PM",
      location: "Virtual (Discord + CTF Platform)",
      participants: 512,
      maxParticipants: 1000,
      image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&h=400&fit=crop",
      badge: "Competition",
      price: "Free",
      speakers: ["S. Thapa", "A. Gurung"],
      agenda: ["CTF Briefing", "Competition", "Awards Ceremony"],
      createdAt: new Date().toISOString(),
      createdBy: "admin",
      registeredUsers: users.slice(0, 6).map(u => u.id),
      participantDetails: users.slice(0, 6)
    },
    {
      id: 5,
      title: "Research Poster Expo",
      description: "Showcase your undergraduate research to peers and faculty. Win awards and get feedback on your work.",
      category: "Research",
      type: "In-Person",
      status: "past",
      date: "2026-07-02",
      time: "10:00 AM",
      location: "Pokhara, Nepal",
      participants: 168,
      maxParticipants: 200,
      image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&h=400&fit=crop",
      badge: "Past Event",
      price: "Free",
      speakers: ["Prof. M. Adhikari", "Dr. S. Sharma"],
      agenda: ["Poster Presentations", "Judging", "Awards"],
      createdAt: new Date().toISOString(),
      createdBy: "admin",
      registeredUsers: users.slice(0, 3).map(u => u.id),
      participantDetails: users.slice(0, 3)
    },
    {
      id: 6,
      title: "Scholar AI Office Hours",
      description: "Live Q&A session with the Scholar Junction product team. Get help with AI features, provide feedback, and learn about upcoming features.",
      category: "AI & Machine Learning",
      type: "Online",
      status: "upcoming",
      date: "2026-08-09",
      time: "5:00 PM",
      location: "Virtual (Google Meet)",
      participants: 89,
      maxParticipants: 500,
      image: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=600&h=400&fit=crop",
      badge: "Free",
      price: "Free",
      speakers: ["Scholar Junction Team"],
      agenda: ["Product Updates", "Live Q&A", "Feature Demo"],
      createdAt: new Date().toISOString(),
      createdBy: "admin",
      registeredUsers: users.slice(0, 2).map(u => u.id),
      participantDetails: users.slice(0, 2)
    }
  ];
}

// ============================================
// LOAD & SAVE EVENTS
// ============================================

function loadEvents() {
  try {
    const stored = localStorage.getItem('sj_events');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed && parsed.length > 0) {
        events = parsed;
        console.log('📂 Events loaded from localStorage:', events.length);
        return;
      }
    }
  } catch (e) {
    console.warn('Could not load events from localStorage');
  }
  
  events = getDefaultEvents();
  saveEvents(events);
  console.log('📂 Default events loaded:', events.length);
}

function saveEvents(eventsData) {
  try {
    localStorage.setItem('sj_events', JSON.stringify(eventsData));
  } catch (e) {
    console.warn('Could not save events to localStorage');
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
// GET PARTICIPANT DETAILS
// ============================================

function getParticipantDetails(userId) {
  if (typeof UserDB !== 'undefined') {
    try {
      const user = UserDB.findById(userId);
      if (user) {
        return {
          id: user.id,
          name: user.fullName || 'User',
          email: user.email || 'unknown@example.com',
          avatar: user.profileImage || null,
          role: user.role || 'student',
          country: user.country || 'Nepal',
          bio: user.bio || '',
          interests: user.interests || [],
          isVerified: user.isVerified || false
        };
      }
    } catch (e) {}
  }

  for (const event of events) {
    if (event.participantDetails) {
      const found = event.participantDetails.find(p => p.id === userId);
      if (found) return found;
    }
  }

  return {
    id: userId,
    name: 'Unknown User',
    email: 'unknown@example.com',
    avatar: null,
    role: 'Student',
    country: 'Nepal',
    bio: 'No bio available',
    interests: [],
    isVerified: false
  };
}

// ============================================
// FILTER FUNCTIONS
// ============================================

function filterEvents(filter) {
  console.log('🔍 Filter events called with:', filter);
  
  document.querySelectorAll('.chip[data-filter]').forEach(chip => {
    chip.classList.remove('active');
    if (chip.dataset.filter === filter) {
      chip.classList.add('active');
    }
  });
  
  currentFilter = filter;
  renderEvents();
  
  const filterNames = {
    'upcoming': '🟢 Upcoming',
    'past': '🔴 Past',
    'my': '📌 My Events',
    'all': '📋 All'
  };
  showToast(`Filter: ${filterNames[filter] || filter}`, 'info');
}

function searchEvents(query) {
  searchQuery = query;
  renderEvents();
}

function filterByType(type) {
  typeFilter = type;
  renderEvents();
}

// ============================================
// RENDER EVENTS - COMPLETE FIXED
// ============================================

function renderEvents() {
  const grid = document.getElementById('eventGrid');
  if (!grid) {
    console.warn('Event grid not found');
    return;
  }

  if (!events || events.length === 0) {
    loadEvents();
  }

  currentUser = getCurrentUser();
  let filtered = [...events];

  if (currentFilter === 'upcoming') {
    filtered = filtered.filter(e => e.status === 'upcoming');
  } else if (currentFilter === 'past') {
    filtered = filtered.filter(e => e.status === 'past');
  } else if (currentFilter === 'my') {
    if (currentUser) {
      filtered = filtered.filter(e => e.createdBy === currentUser.id || e.createdBy === currentUser.email);
    } else {
      filtered = [];
    }
  }

  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter(e => 
      e.title.toLowerCase().includes(query) ||
      e.description.toLowerCase().includes(query) ||
      e.category.toLowerCase().includes(query) ||
      e.location.toLowerCase().includes(query)
    );
  }

  if (typeFilter !== 'all') {
    const typeMap = {
      'online': 'Online',
      'in-person': 'In-Person',
      'hybrid': 'Hybrid'
    };
    filtered = filtered.filter(e => e.type === typeMap[typeFilter]);
  }

  // Update stats
  const upcomingCount = events.filter(e => e.status === 'upcoming').length;
  const pastCount = events.filter(e => e.status === 'past').length;
  const totalParticipants = events.reduce((sum, e) => sum + (e.participants || 0), 0);
  
  document.getElementById('upcomingCount').textContent = upcomingCount;
  document.getElementById('pastCount').textContent = pastCount;
  document.getElementById('totalParticipants').textContent = totalParticipants;

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1; text-align:center; padding:60px 20px;">
        <span style="font-size:48px;display:block;margin-bottom:16px;">🔍</span>
        <h3 style="font-size:20px;color:#0f172a;">No events found</h3>
        <p style="color:#94a3b8;">Try adjusting your filters or <button class="btn btn-primary btn-sm" onclick="openCreateEvent()">Create an Event</button></p>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map(event => {
    const statusClass = event.status === 'upcoming' ? 'upcoming' : 'past';
    const statusLabel = event.status === 'upcoming' ? '🟢 Upcoming' : '🔴 Past';
    const dateObj = new Date(event.date);
    const dateStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    
    let participantAvatars = '';
    const displayParticipants = event.participantDetails || [];
    const showCount = Math.min(displayParticipants.length, 4);
    
    for (let i = 0; i < showCount; i++) {
      const p = displayParticipants[i];
      const initial = p.name ? p.name.charAt(0).toUpperCase() : '?';
      const avatarHtml = p.avatar 
        ? `<img src="${p.avatar}" alt="${p.name}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">` 
        : initial;
      participantAvatars += `<div class="mini-avatar" title="Click to view ${p.name}'s profile" onclick="event.stopPropagation(); viewParticipantProfile('${p.id}')">${avatarHtml}</div>`;
    }
    
    if (event.participants > 4) {
      participantAvatars += `<div class="mini-avatar" style="background:#64748b;cursor:pointer;" onclick="event.stopPropagation(); showAllParticipants(${event.id})">+${event.participants - 4}</div>`;
    }

    const isRegistered = event.registeredUsers && event.registeredUsers.includes(currentUser?.id);

    return `
      <div class="event-card" onclick="viewEventDetail(${event.id})" data-id="${event.id}">
        <div class="event-image">
          <img src="${event.image}" alt="${event.title}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600&h=400&fit=crop'">
          <span class="event-badge">${event.badge || 'Event'}</span>
          <span class="event-type">${event.type}</span>
          <span class="event-status ${statusClass}">${statusLabel}</span>
          ${isRegistered ? '<span class="event-status" style="background:#22C55E;bottom:50px;right:12px;">✅ Registered</span>' : ''}
        </div>
        <div class="event-body">
          <div class="event-category">${event.category}</div>
          <h3>${event.title}</h3>
          <p class="event-description">${event.description.substring(0, 100)}${event.description.length > 100 ? '...' : ''}</p>
          <div class="event-meta">
            <span>📅 ${dateStr}</span>
            <span>⏱️ ${event.time}</span>
            <span>📍 ${event.type === 'Online' ? '🌐 Online' : event.location}</span>
          </div>
          <div class="event-footer">
            <!-- ===== PARTICIPANTS CLICKABLE BUTTON ===== -->
            <div class="event-participants" 
                 onclick="showAllParticipants(${event.id})" 
                 style="cursor:pointer; display:flex; align-items:center; gap:8px; padding:6px 16px 6px 8px; border-radius:999px; transition:all 0.2s ease; background:transparent; border:2px solid transparent;">
              <div class="avatar-group" style="display:flex; pointer-events:none;">
                ${participantAvatars}
              </div>
              <span style="font-weight:600; color:#2563EB; font-size:14px; pointer-events:none;">
                ${event.participants} joined ▶
              </span>
            </div>
            <!-- ======================================== -->
            <button class="btn ${event.status === 'past' ? 'btn-outline' : isRegistered ? 'btn-success' : 'btn-primary'} btn-sm" 
                    onclick="event.stopPropagation(); handleRSVP(${event.id})">
              ${event.status === 'past' ? 'View Details' : isRegistered ? '✅ Registered' : 'Join Event'}
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// ============================================
// SHOW ALL PARTICIPANTS
// ============================================

function showAllParticipants(eventId) {
  console.log('👥 Showing all participants for event:', eventId);
  
  const event = events.find(e => e.id === eventId);
  if (!event) {
    showToast('Event not found', 'error');
    return;
  }

  let participants = event.participantDetails || [];
  
  if (participants.length === 0) {
    participants = getDemoUsers().slice(0, 5);
    event.participantDetails = participants;
    event.registeredUsers = participants.map(p => p.id);
    event.participants = participants.length;
    saveEvents(events);
  }
  
  if (participants.length === 0) {
    showToast('No participants yet. Be the first to join!', 'info');
    return;
  }

  // Create modal
  const modal = document.createElement('div');
  modal.className = 'participants-modal';
  modal.style.cssText = `
    position: fixed;
    inset: 0;
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    animation: modalFadeIn 0.3s ease;
  `;

  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position: absolute;
    inset: 0;
    background: rgba(0,0,0,0.5);
    backdrop-filter: blur(4px);
  `;
  overlay.onclick = () => modal.remove();

  const content = document.createElement('div');
  content.style.cssText = `
    position: relative;
    max-width: 600px;
    width: 100%;
    max-height: 80vh;
    background: white;
    border-radius: 20px;
    padding: 30px;
    overflow-y: auto;
    box-shadow: 0 30px 80px rgba(0,0,0,0.2);
    animation: modalSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  `;

  let participantsHtml = participants.map(p => {
    const initial = p.name ? p.name.charAt(0).toUpperCase() : '?';
    const avatarHtml = p.avatar 
      ? `<img src="${p.avatar}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">` 
      : initial;
    
    const isFollowing = following && following.includes(p.id);
    const currentUser = getCurrentUser();
    const isCurrentUser = currentUser && p.id === currentUser.id;
    
    return `
      <div style="display:flex; align-items:center; gap:12px; padding:12px; border-radius:12px; background:#f8fafc; cursor:pointer; transition:all 0.2s ease; border:1px solid transparent;" 
           onmouseover="this.style.background='#eff6ff'; this.style.borderColor='#2563EB';" 
           onmouseout="this.style.background='#f8fafc'; this.style.borderColor='transparent';"
           onclick="this.closest('.participants-modal').remove(); viewParticipantProfile('${p.id}')">
        <div style="width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,#2563EB,#7C3AED);display:flex;align-items:center;justify-content:center;color:white;font-weight:600;font-size:18px;flex-shrink:0;overflow:hidden;">
          ${avatarHtml}
        </div>
        <div style="flex:1;">
          <div style="font-weight:600;color:#0f172a;display:flex;align-items:center;gap:8px;">
            ${p.name || 'Unknown User'}
            ${p.isVerified ? '<span style="font-size:12px;color:#059669;">✅</span>' : ''}
            ${isCurrentUser ? '<span style="font-size:11px;background:#dbeafe;color:#2563EB;padding:2px 8px;border-radius:999px;">You</span>' : ''}
          </div>
          <div style="font-size:13px;color:#64748b;display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
            <span>${p.role || 'Student'}</span>
            <span>•</span>
            <span>${p.country || 'Nepal'}</span>
          </div>
        </div>
        <div style="display:flex; gap:6px;">
          <button class="btn btn-outline btn-sm" onclick="event.stopPropagation(); this.closest('.participants-modal').remove(); viewParticipantProfile('${p.id}')" style="font-size:12px;padding:4px 12px;">👤 View</button>
          ${!isCurrentUser ? `
            <button class="btn ${isFollowing ? 'btn-success' : 'btn-primary'} btn-sm" 
                    onclick="event.stopPropagation(); followParticipant('${p.id}'); this.innerHTML = '✅ Following'; this.className = 'btn btn-success btn-sm';"
                    style="font-size:12px;padding:4px 12px;">
              ${isFollowing ? '✅ Following' : '➕ Follow'}
            </button>
          ` : ''}
        </div>
      </div>
    `;
  }).join('');

  content.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; padding-bottom:12px; border-bottom:2px solid #f1f5f9;">
      <div>
        <h3 style="font-family:'Poppins',sans-serif; font-size:20px; margin:0;">👥 Participants</h3>
        <p style="font-size:14px; color:#64748b; margin:2px 0 0;">${participants.length} people joined this event</p>
      </div>
      <button onclick="this.closest('.participants-modal').remove()" style="background:none;border:none;font-size:24px;cursor:pointer;color:#64748b;padding:4px 8px;border-radius:8px;" onmouseover="this.style.background='#f1f5f9'" onmouseout="this.style.background='none'">✕</button>
    </div>
    <div style="display:grid; gap:10px;">
      ${participantsHtml}
    </div>
    <div style="margin-top:16px; padding-top:12px; border-top:1px solid #f1f5f9; text-align:center; font-size:13px; color:#94a3b8;">
      👆 Click on any participant to view their full profile
    </div>
  `;

  modal.appendChild(overlay);
  modal.appendChild(content);
  document.body.appendChild(modal);
}

// ============================================
// VIEW PARTICIPANT PROFILE
// ============================================

function viewParticipantProfile(userId) {
  console.log('👤 Viewing participant profile:', userId);
  
  let user = getParticipantDetails(userId);
  
  const modal = document.createElement('div');
  modal.className = 'profile-modal';
  modal.style.cssText = `
    position: fixed;
    inset: 0;
    z-index: 10001;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    animation: modalFadeIn 0.3s ease;
  `;

  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position: absolute;
    inset: 0;
    background: rgba(0,0,0,0.5);
    backdrop-filter: blur(4px);
  `;
  overlay.onclick = () => modal.remove();

  const content = document.createElement('div');
  content.style.cssText = `
    position: relative;
    max-width: 500px;
    width: 100%;
    background: white;
    border-radius: 20px;
    padding: 30px;
    box-shadow: 0 30px 80px rgba(0,0,0,0.2);
    animation: modalSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  `;

  const initial = user.name ? user.name.charAt(0).toUpperCase() : '?';
  const avatarHtml = user.avatar 
    ? `<img src="${user.avatar}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">` 
    : initial;

  const interestsHtml = user.interests && user.interests.length > 0
    ? user.interests.map(i => `<span class="tag">${i}</span>`).join('')
    : 'No interests listed';

  const isFollowing = following && following.includes(user.id);

  content.innerHTML = `
    <button onclick="this.closest('.profile-modal').remove()" style="position:absolute;top:16px;right:20px;background:none;border:none;font-size:24px;cursor:pointer;color:#64748b;padding:4px 8px;border-radius:8px;" onmouseover="this.style.background='#f1f5f9'" onmouseout="this.style.background='none'">✕</button>
    <div style="text-align:center; padding:10px 0;">
      <div style="width:80px;height:80px;border-radius:50%;background:linear-gradient(135deg,#2563EB,#7C3AED);display:flex;align-items:center;justify-content:center;color:white;font-weight:700;font-size:32px;margin:0 auto 12px;overflow:hidden;border:3px solid #e2e8f0;">
        ${avatarHtml}
      </div>
      <h2 style="font-family:'Poppins',sans-serif; font-size:22px; margin:0;">${user.name}</h2>
      <div style="color:#64748b; font-size:14px; margin-top:4px;">${user.role || 'Student'} • ${user.country || 'Nepal'}</div>
      ${user.isVerified ? '<div style="color:#059669; font-size:13px; margin-top:4px;">✅ Verified Profile</div>' : ''}
      <div style="display:flex; gap:8px; justify-content:center; margin-top:12px;">
        <button class="btn ${isFollowing ? 'btn-success' : 'btn-primary'} btn-sm" onclick="event.stopPropagation(); followParticipant('${user.id}'); this.innerHTML = '✅ Following'; this.className = 'btn btn-success btn-sm';">
          ${isFollowing ? '✅ Following' : '➕ Follow'}
        </button>
        <button class="btn btn-outline btn-sm" onclick="event.stopPropagation(); sendMessage('${user.id}'); this.closest('.profile-modal').remove();">
          💬 Message
        </button>
        <button class="btn btn-outline btn-sm" onclick="event.stopPropagation(); this.closest('.profile-modal').remove();">
          ✕ Close
        </button>
      </div>
    </div>
    <div style="margin-top:16px; padding-top:16px; border-top:1px solid #f1f5f9;">
      <div style="font-weight:600; margin-bottom:8px;">📝 Bio</div>
      <p style="color:#475569; font-size:14px; line-height:1.6;">${user.bio || 'No bio available'}</p>
    </div>
    <div style="margin-top:12px; padding-top:12px; border-top:1px solid #f1f5f9;">
      <div style="font-weight:600; margin-bottom:8px;">🎯 Interests</div>
      <div style="display:flex; flex-wrap:wrap; gap:6px;">${interestsHtml}</div>
    </div>
    <div style="margin-top:12px; padding-top:12px; border-top:1px solid #f1f5f9; display:flex; gap:16px; justify-content:center; font-size:14px; color:#64748b;">
      <span>📧 ${user.email}</span>
    </div>
  `;

  modal.appendChild(overlay);
  modal.appendChild(content);
  document.body.appendChild(modal);
}

// ============================================
// FOLLOW PARTICIPANT
// ============================================

function followParticipant(userId) {
  const user = getParticipantDetails(userId);
  if (!user) {
    showToast('User not found', 'error');
    return;
  }

  const currentUser = getCurrentUser();
  if (!currentUser) {
    showToast('Please login to follow users', 'warning');
    return;
  }

  if (userId === currentUser.id) {
    showToast('You cannot follow yourself', 'warning');
    return;
  }

  const index = following.indexOf(userId);
  if (index > -1) {
    following.splice(index, 1);
    showToast(`Unfollowed ${user.name}`, 'info');
  } else {
    following.push(userId);
    showToast(`✅ Following ${user.name}`, 'success');
  }

  localStorage.setItem('sj_following', JSON.stringify(following));
}

// ============================================
// SEND MESSAGE
// ============================================

function sendMessage(userId) {
  const user = getParticipantDetails(userId);
  if (!user) {
    showToast('User not found', 'error');
    return;
  }

  const currentUser = getCurrentUser();
  if (!currentUser) {
    showToast('Please login to send messages', 'warning');
    return;
  }

  showToast(`💬 Message sent to ${user.name}!`, 'success');
}

// ============================================
// RSVP / JOIN EVENT
// ============================================

function handleRSVP(eventId) {
  const event = events.find(e => e.id === eventId);
  if (!event) {
    showToast('Event not found', 'error');
    return;
  }

  const user = getCurrentUser();
  if (!user) {
    showToast('Please login to join events', 'warning');
    return;
  }

  if (event.status === 'past') {
    viewEventDetail(eventId);
    return;
  }

  if (event.registeredUsers && event.registeredUsers.includes(user.id)) {
    showToast('You are already registered for this event ✅', 'info');
    return;
  }

  if (event.participants >= event.maxParticipants) {
    showToast('⚠️ Event is full! Please join waitlist.', 'warning');
    return;
  }

  if (!event.registeredUsers) {
    event.registeredUsers = [];
  }
  event.registeredUsers.push(user.id);
  
  if (!event.participantDetails) {
    event.participantDetails = [];
  }
  
  let userDetails = null;
  if (typeof UserDB !== 'undefined') {
    try {
      const fullUser = UserDB.findById(user.id);
      if (fullUser) {
        userDetails = {
          id: fullUser.id,
          name: fullUser.fullName || 'User',
          email: fullUser.email || 'unknown@example.com',
          avatar: fullUser.profileImage || null,
          role: fullUser.role || 'student',
          country: fullUser.country || 'Nepal',
          bio: fullUser.bio || '',
          interests: fullUser.interests || []
        };
      }
    } catch (e) {}
  }
  
  if (!userDetails) {
    userDetails = {
      id: user.id,
      name: user.fullName || 'User',
      email: user.email || 'unknown@example.com',
      avatar: null,
      role: 'student',
      country: 'Nepal',
      bio: '',
      interests: []
    };
  }
  
  if (!event.participantDetails.find(p => p.id === user.id)) {
    event.participantDetails.push(userDetails);
  }
  
  event.participants += 1;
  
  saveEvents(events);
  renderEvents();
  
  showToast(`✅ Successfully registered for "${event.title}"!`, 'success');
}

// ============================================
// VIEW EVENT DETAIL
// ============================================

function viewEventDetail(eventId) {
  const event = events.find(e => e.id === eventId);
  if (!event) {
    showToast('Event not found', 'error');
    return;
  }

  localStorage.setItem('viewingEvent', JSON.stringify(event));
  window.open('event-detail.html', '_blank');
}

// ============================================
// CREATE EVENT
// ============================================

function openCreateEvent() {
  const modal = document.getElementById('createEventModal');
  if (!modal) {
    showToast('Create event modal not found', 'error');
    return;
  }
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
  
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dateInput = document.getElementById('eventDate');
  if (dateInput) {
    dateInput.value = tomorrow.toISOString().split('T')[0];
  }
}

function closeCreateEvent() {
  const modal = document.getElementById('createEventModal');
  modal.classList.remove('active');
  document.body.style.overflow = '';
  document.getElementById('createEventForm').reset();
}

function publishEvent(e) {
  e.preventDefault();
  
  const user = getCurrentUser();
  if (!user) {
    showToast('Please login to create events', 'warning');
    return;
  }

  const title = document.getElementById('eventTitle').value.trim();
  const category = document.getElementById('eventCategory').value;
  const type = document.getElementById('eventTypeSelect').value;
  const description = document.getElementById('eventDescription').value.trim();
  const date = document.getElementById('eventDate').value;
  const time = document.getElementById('eventTime').value;
  const location = document.getElementById('eventLocation').value.trim();
  const maxParticipants = parseInt(document.getElementById('eventMax').value) || 100;
  const price = document.getElementById('eventPrice').value.trim() || 'Free';
  let image = document.getElementById('eventImage').value.trim();

  if (!title || !category || !type || !description || !date || !time || !location) {
    showToast('Please fill all required fields', 'warning');
    return;
  }

  if (!image) {
    const defaultImages = [
      'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&h=400&fit=crop'
    ];
    image = defaultImages[Math.floor(Math.random() * defaultImages.length)];
  }

  const newEvent = {
    id: Date.now(),
    title: title,
    category: category,
    type: type,
    description: description,
    date: date,
    time: time,
    location: location,
    participants: 0,
    maxParticipants: maxParticipants,
    image: image,
    badge: 'New',
    price: price,
    status: 'upcoming',
    speakers: [],
    agenda: [],
    createdAt: new Date().toISOString(),
    createdBy: user.id || user.email,
    registeredUsers: [],
    participantDetails: []
  };

  events.push(newEvent);
  saveEvents(events);
  
  closeCreateEvent();
  renderEvents();
  
  showToast(`✅ Event "${title}" published successfully!`, 'success');
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
// INITIALIZE
// ============================================

document.addEventListener('DOMContentLoaded', function() {
  console.log('📅 Events Page Loading...');
  
  loadEvents();
  updateHeaderAvatar();
  renderEvents();
  
  console.log('📅 Events Page Ready!');
  console.log('📊 ' + events.length + ' events loaded');
});

// Make functions globally available
window.filterEvents = filterEvents;
window.searchEvents = searchEvents;
window.filterByType = filterByType;
window.renderEvents = renderEvents;
window.showAllParticipants = showAllParticipants;
window.viewParticipantProfile = viewParticipantProfile;
window.followParticipant = followParticipant;
window.sendMessage = sendMessage;
window.handleRSVP = handleRSVP;
window.viewEventDetail = viewEventDetail;
window.openCreateEvent = openCreateEvent;
window.closeCreateEvent = closeCreateEvent;
window.publishEvent = publishEvent;
window.showToast = showToast;