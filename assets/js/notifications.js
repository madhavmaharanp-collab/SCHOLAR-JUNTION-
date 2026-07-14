// ============================================
// NOTIFICATIONS - Complete JavaScript
// ============================================

// ============================================
// NOTIFICATION DATA
// ============================================

let notifications = [];
let currentFilter = 'all';
let unreadCount = 0;

// ============================================
// GET DEFAULT NOTIFICATIONS
// ============================================

function getDefaultNotifications() {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);

  return [
    {
      id: 1,
      type: 'social',
      title: 'Maya commented on ScholarGraph',
      description: '"Eval numbers look great! The RAG system is performing better than expected. Can we schedule a call to discuss?"',
      time: new Date(now.getTime() - 12 * 60 * 1000).toISOString(),
      read: false,
      icon: '💬',
      action: 'Reply',
      actionLink: 'messages.html',
      category: 'social'
    },
    {
      id: 2,
      type: 'event',
      title: 'AI Research Summit starts in 6 hours',
      description: 'Your calendar reminder: Global AI Research Summit 2026 begins at 9:00 AM. Don\'t forget to join the keynote session.',
      time: new Date(now.getTime() - 4 * 60 * 1000).toISOString(),
      read: false,
      icon: '📅',
      action: 'View Event',
      actionLink: 'events.html',
      category: 'event'
    },
    {
      id: 3,
      type: 'social',
      title: 'New follower: Dr. Anusha B.',
      description: 'Dr. Anusha B. from TU Munich is now following you. She is a ML Researcher specializing in NLP and LLMs.',
      time: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
      read: false,
      icon: '👤',
      action: 'View Profile',
      actionLink: 'profile.html',
      category: 'social'
    },
    {
      id: 4,
      type: 'project',
      title: 'Your article reached 1k reads!',
      description: '"RAG Architectures that actually scale" has reached 1,000 reads. Top 5% of articles this month.',
      time: new Date(yesterday.getTime() + 4 * 60 * 60 * 1000).toISOString(),
      read: true,
      icon: '📄',
      action: 'View Article',
      actionLink: 'knowledge-hub.html',
      category: 'project'
    },
    {
      id: 5,
      type: 'project',
      title: 'PR #42 merged in NepalEdu Cloud',
      description: 'Your pull request for the offline-first PWA feature has been merged. Great work on the serverless architecture!',
      time: new Date(yesterday.getTime() + 2 * 60 * 60 * 1000).toISOString(),
      read: true,
      icon: '✅',
      action: 'View PR',
      actionLink: 'projects.html',
      category: 'project'
    },
    {
      id: 6,
      type: 'social',
      title: '18 new stars on ScholarGraph',
      description: 'Your project ScholarGraph received 18 new stars this week. Total stars now 1,438!',
      time: new Date(weekAgo.getTime() + 3 * 60 * 60 * 1000).toISOString(),
      read: true,
      icon: '⭐',
      action: 'View Project',
      actionLink: 'projects.html',
      category: 'social'
    },
    {
      id: 7,
      type: 'social',
      title: '3 new collaboration invites',
      description: 'You have 3 pending collaboration requests from researchers interested in your work.',
      time: new Date(weekAgo.getTime() + 2 * 60 * 60 * 1000).toISOString(),
      read: true,
      icon: '🤝',
      action: 'View Invites',
      actionLink: 'collaboration.html',
      category: 'social'
    },
    {
      id: 8,
      type: 'event',
      title: 'Paper Review Clinic reminder',
      description: 'Don\'t forget: Paper Review Clinic is happening tomorrow at 2:00 PM. Bring your draft for peer review.',
      time: new Date(weekAgo.getTime() + 1 * 60 * 60 * 1000).toISOString(),
      read: true,
      icon: '📝',
      action: 'View Event',
      actionLink: 'events.html',
      category: 'event'
    },
    {
      id: 9,
      type: 'project',
      title: 'Weekly digest ready',
      description: 'Your weekly activity digest is ready. You had 42 new reads, 12 stars, and 5 new comments this week.',
      time: new Date(weekAgo.getTime() + 30 * 60 * 1000).toISOString(),
      read: true,
      icon: '📊',
      action: 'View Digest',
      actionLink: 'dashboard.html',
      category: 'project'
    }
  ];
}

// ============================================
// LOAD NOTIFICATIONS
// ============================================

function loadNotifications() {
  try {
    const stored = localStorage.getItem('sj_notifications');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed && parsed.length > 0) {
        notifications = parsed;
        console.log('📂 Notifications loaded from localStorage:', notifications.length);
        updateCounts();
        return;
      }
    }
  } catch (e) {
    console.warn('Could not load notifications from localStorage');
  }
  
  notifications = getDefaultNotifications();
  saveNotifications();
  updateCounts();
  console.log('📂 Default notifications loaded:', notifications.length);
}

function saveNotifications() {
  try {
    localStorage.setItem('sj_notifications', JSON.stringify(notifications));
  } catch (e) {
    console.warn('Could not save notifications to localStorage');
  }
}

function updateCounts() {
  unreadCount = notifications.filter(n => !n.read).length;
  const total = notifications.length;
  const readCount = total - unreadCount;
  
  document.getElementById('totalNotifs').textContent = total;
  document.getElementById('unreadNotifs').textContent = unreadCount;
  document.getElementById('readNotifs').textContent = readCount;
  
  // Update favicon badge if possible
  updateFaviconBadge(unreadCount);
}

function updateFaviconBadge(count) {
  // Update title with count
  const title = document.querySelector('title');
  if (title) {
    title.textContent = count > 0 ? `(${count}) Notifications — Scholar Junction` : 'Notifications — Scholar Junction';
  }
}

// ============================================
// RENDER NOTIFICATIONS
// ============================================

function renderNotifications() {
  const container = document.getElementById('notificationsContainer');
  if (!container) return;

  let filtered = [...notifications];

  // Apply filters
  if (currentFilter === 'unread') {
    filtered = filtered.filter(n => !n.read);
  } else if (currentFilter === 'read') {
    filtered = filtered.filter(n => n.read);
  } else if (currentFilter !== 'all') {
    filtered = filtered.filter(n => n.category === currentFilter);
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <span class="icon">🔔</span>
        <h3>No notifications ${currentFilter !== 'all' ? 'in this filter' : ''}</h3>
        <p>${currentFilter === 'unread' ? 'You\'re all caught up! 🎉' : 'Check back later for updates'}</p>
        ${currentFilter !== 'all' ? `<button class="btn btn-outline btn-sm mt-3" onclick="filterNotifications('all')">View All</button>` : ''}
      </div>
    `;
    return;
  }

  // Group notifications by date
  const groups = groupNotificationsByDate(filtered);
  
  let html = '';
  
  groups.forEach(group => {
    html += `<div class="notif-group">`;
    html += `<div class="group-header">${group.label}</div>`;
    
    group.items.forEach(notif => {
      const isUnread = !notif.read;
      const time = new Date(notif.time);
      const timeStr = formatTimeAgo(time);
      
      html += `
        <div class="notif-card ${isUnread ? 'unread' : 'read'}" onclick="viewNotification(${notif.id})">
          <div class="notif-header">
            <div class="notif-icon">${notif.icon || '🔔'}</div>
            <div class="notif-content">
              <div class="notif-title">${notif.title}</div>
              <div class="notif-description">${notif.description}</div>
              <div class="notif-time">
                <span>${timeStr}</span>
                <span class="dot"></span>
                <span>${notif.category.charAt(0).toUpperCase() + notif.category.slice(1)}</span>
              </div>
            </div>
            <span class="notif-badge ${isUnread ? 'unread' : 'read'}">${isUnread ? 'Unread' : 'Read'}</span>
          </div>
          <div class="notif-actions">
            <button class="btn btn-outline btn-sm" onclick="event.stopPropagation(); markAsRead(${notif.id})">
              ${isUnread ? '✅ Mark as read' : 'Mark as unread'}
            </button>
            ${notif.action ? `<button class="btn btn-primary btn-sm" onclick="event.stopPropagation(); window.location.href='${notif.actionLink || '#'}'">${notif.action}</button>` : ''}
            <button class="btn btn-ghost btn-sm" onclick="event.stopPropagation(); deleteNotification(${notif.id})">🗑️</button>
          </div>
        </div>
      `;
    });
    
    html += `</div>`;
  });

  container.innerHTML = html;
}

// ============================================
// GROUP NOTIFICATIONS BY DATE
// ============================================

function groupNotificationsByDate(notifs) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);

  const groups = {
    today: { label: 'Today', items: [] },
    yesterday: { label: 'Yesterday', items: [] },
    thisWeek: { label: 'This Week', items: [] },
    older: { label: 'Older', items: [] }
  };

  notifs.forEach(notif => {
    const date = new Date(notif.time);
    
    if (date >= today) {
      groups.today.items.push(notif);
    } else if (date >= yesterday) {
      groups.yesterday.items.push(notif);
    } else if (date >= weekAgo) {
      groups.thisWeek.items.push(notif);
    } else {
      groups.older.items.push(notif);
    }
  });

  // Remove empty groups
  return Object.values(groups).filter(g => g.items.length > 0);
}

// ============================================
// FORMAT TIME AGO
// ============================================

function formatTimeAgo(date) {
  const now = new Date();
  const diff = (now - date) / 1000; // seconds

  if (diff < 60) {
    return 'Just now';
  } else if (diff < 3600) {
    const mins = Math.floor(diff / 60);
    return `${mins}m ago`;
  } else if (diff < 86400) {
    const hours = Math.floor(diff / 3600);
    return `${hours}h ago`;
  } else if (diff < 604800) {
    const days = Math.floor(diff / 86400);
    return `${days}d ago`;
  } else {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
}

// ============================================
// NOTIFICATION ACTIONS
// ============================================

function viewNotification(id) {
  const notif = notifications.find(n => n.id === id);
  if (!notif) return;

  // Mark as read when viewed
  if (!notif.read) {
    notif.read = true;
    saveNotifications();
    updateCounts();
    renderNotifications();
  }

  // Show detail modal
  const modal = document.getElementById('notifModal');
  const body = document.getElementById('notifDetailBody');
  
  const time = new Date(notif.time);
  const timeStr = time.toLocaleString('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  body.innerHTML = `
    <div style="display:flex; align-items:center; gap:16px; margin-bottom:16px;">
      <div style="font-size:40px;">${notif.icon || '🔔'}</div>
      <div>
        <h3 style="font-family:'Poppins',sans-serif; font-size:20px; margin:0;">${notif.title}</h3>
        <div style="color:#94a3b8; font-size:13px;">${timeStr} • ${notif.category}</div>
      </div>
    </div>
    <div style="padding:16px; background:#f8fafc; border-radius:12px; margin-bottom:16px;">
      <p style="margin:0; color:#475569; line-height:1.6;">${notif.description}</p>
    </div>
    <div style="display:flex; gap:12px; flex-wrap:wrap;">
      ${notif.action ? `<button class="btn btn-primary" onclick="window.location.href='${notif.actionLink || '#'}'">${notif.action}</button>` : ''}
      <button class="btn btn-outline" onclick="closeNotifDetail()">Close</button>
      <button class="btn btn-ghost" onclick="deleteNotification(${notif.id}); closeNotifDetail();">🗑️ Delete</button>
    </div>
  `;

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeNotifDetail() {
  const modal = document.getElementById('notifModal');
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

function markAsRead(id) {
  const notif = notifications.find(n => n.id === id);
  if (notif) {
    notif.read = !notif.read;
    saveNotifications();
    updateCounts();
    renderNotifications();
    showToast(notif.read ? '✅ Marked as read' : '📌 Marked as unread', 'success');
  }
}

function markAllRead() {
  const unread = notifications.filter(n => !n.read);
  if (unread.length === 0) {
    showToast('All notifications already read! 🎉', 'info');
    return;
  }
  
  notifications.forEach(n => n.read = true);
  saveNotifications();
  updateCounts();
  renderNotifications();
  showToast(`✅ Marked ${unread.length} notifications as read`, 'success');
}

function deleteNotification(id) {
  if (!confirm('Delete this notification?')) return;
  
  notifications = notifications.filter(n => n.id !== id);
  saveNotifications();
  updateCounts();
  renderNotifications();
  showToast('🗑️ Notification deleted', 'info');
}

function clearAllNotifications() {
  if (!confirm('Delete all notifications?')) return;
  
  notifications = [];
  saveNotifications();
  updateCounts();
  renderNotifications();
  showToast('🗑️ All notifications cleared', 'info');
}

// ============================================
// FILTER NOTIFICATIONS
// ============================================

function filterNotifications(filter) {
  document.querySelectorAll('.notif-filters .chip').forEach(chip => {
    chip.classList.remove('active');
    if (chip.dataset.filter === filter) {
      chip.classList.add('active');
    }
  });
  
  currentFilter = filter;
  renderNotifications();
  
  const filterNames = {
    'all': '📋 All',
    'unread': '🔴 Unread',
    'read': '✅ Read',
    'event': '📅 Events',
    'social': '👥 Social',
    'project': '🧪 Projects'
  };
  showToast(`Filter: ${filterNames[filter] || filter}`, 'info');
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
  console.log('🔔 Notifications Loading...');
  
  loadNotifications();
  updateHeaderAvatar();
  renderNotifications();
  
  console.log('🔔 Notifications Ready!');
  console.log('📊 ' + notifications.length + ' notifications loaded');
});

// Make functions globally available
window.filterNotifications = filterNotifications;
window.markAsRead = markAsRead;
window.markAllRead = markAllRead;
window.deleteNotification = deleteNotification;
window.clearAllNotifications = clearAllNotifications;
window.viewNotification = viewNotification;
window.closeNotifDetail = closeNotifDetail;
window.showToast = showToast;

console.log('🔔 Notifications Ready!');