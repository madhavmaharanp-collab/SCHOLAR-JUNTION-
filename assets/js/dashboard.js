// ============================================
// SCHOLAR JUNCTION - DASHBOARD
// Complete with Verification System
// ============================================

document.addEventListener('DOMContentLoaded', function() {
  console.log('📊 Dashboard Loading...');
  
  if (typeof UserDB === 'undefined') {
    console.error('❌ UserDB not loaded!');
    showToast('System error. Please refresh.', 'error');
    return;
  }
  
  if (!UserDB.isLoggedIn()) {
    console.warn('⚠️ Not logged in, redirecting to login...');
    showToast('Please login to access dashboard', 'warning');
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 1500);
    return;
  }
  
  // Load user data
  loadDashboard();
  
  // Setup burger menu
  setupBurgerMenu();
  
  // Setup live data refresh
  setupLiveRefresh();
  
  // Listen for profile image updates
  setupImageUpdateListener();
});

// ============================================
// LOAD DASHBOARD - FIXED WITH IMAGE SYNC
// ============================================

function loadDashboard() {
  console.log('🔄 Loading dashboard data...');
  
  const user = UserDB.getCurrentUser();
  if (!user) {
    console.error('❌ No user session found');
    return;
  }
  
  const fullUser = UserDB.getCurrentUserFull();
  console.log('👤 User data:', fullUser);
  
  // ===== FIX: CHECK FOR PROFILE IMAGE IN LOCALSTORAGE =====
  // If user doesn't have profileImage in DB but it exists in localStorage
  if (fullUser && !fullUser.profileImage) {
    const localImage = localStorage.getItem('profileImage');
    if (localImage && localImage !== 'null' && localImage !== 'undefined') {
      console.log('🖼️ Found profile image in localStorage, updating user...');
      // Update user with the image
      const result = UserDB.updateUser(fullUser.id, { profileImage: localImage });
      if (result.success) {
        console.log('✅ Profile image synced to database');
        // Update session
        const updatedUser = UserDB.getCurrentUserFull();
        if (updatedUser) {
          UserDB.setCurrentUser(updatedUser);
        }
      }
    }
  }
  
  // Update all UI elements
  updateTopBar(user);
  updateWelcome(user);
  updateStats(user);
  updateRecentActivity(user);
  
  // Load verification status - IMPORTANT: Call this after data is loaded
  setTimeout(function() {
    loadVerificationStatus();
  }, 300);
  
  console.log('✅ Dashboard loaded successfully');
}

// ============================================
// UPDATE TOP BAR - WITH PROFILE IMAGE FIX
// ============================================

function updateTopBar(user) {
  const avatarEl = document.getElementById('headerAvatar');
  if (!avatarEl) {
    console.warn('⚠️ Header avatar element not found');
    return;
  }
  
  console.log('🖼️ Updating avatar with user data...');
  
  // Get the full user data to access profileImage
  const fullUser = UserDB.getCurrentUserFull();
  console.log('👤 Full user data:', fullUser);
  
  // Check multiple sources for profile image
  let profileImage = null;
  
  // 1. Check from fullUser
  if (fullUser && fullUser.profileImage) {
    profileImage = fullUser.profileImage;
    console.log('🖼️ Found profile image in fullUser');
  }
  // 2. Check from passed user
  else if (user && user.profileImage) {
    profileImage = user.profileImage;
    console.log('🖼️ Found profile image in user object');
  }
  // 3. Check from localStorage
  else {
    const localImage = localStorage.getItem('profileImage');
    if (localImage && localImage !== 'null' && localImage !== 'undefined') {
      profileImage = localImage;
      console.log('🖼️ Found profile image in localStorage');
    }
  }
  
  console.log('🖼️ Final profile image:', profileImage ? 'Exists (length: ' + profileImage.length + ')' : 'Not found');
  
  if (profileImage && profileImage !== 'null' && profileImage !== 'undefined') {
    // If profile image exists, show it
    avatarEl.innerHTML = `<img src="${profileImage}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;border:2px solid #2563EB;">`;
    avatarEl.style.background = 'none';
    avatarEl.style.display = 'flex';
    avatarEl.style.alignItems = 'center';
    avatarEl.style.justifyContent = 'center';
    console.log('✅ Profile image displayed in avatar');
  } else {
    // If no profile image, show initials
    const initial = user.fullName ? user.fullName.charAt(0).toUpperCase() : '?';
    avatarEl.innerHTML = initial;
    avatarEl.style.background = 'linear-gradient(135deg, #2563EB, #7C3AED)';
    avatarEl.style.display = 'flex';
    avatarEl.style.alignItems = 'center';
    avatarEl.style.justifyContent = 'center';
    avatarEl.style.color = 'white';
    avatarEl.style.fontWeight = '600';
    avatarEl.style.fontSize = '16px';
    console.log('ℹ️ No profile image, showing initials:', initial);
  }
}

// ============================================
// UPDATE WELCOME
// ============================================

function updateWelcome(user) {
  const greeting = document.getElementById('welcomeGreeting');
  const title = document.getElementById('welcomeTitle');
  const desc = document.getElementById('welcomeDesc');
  
  if (greeting) {
    const name = user.fullName || 'Scholar';
    greeting.textContent = `Welcome back, ${name} 👋`;
  }
  
  if (title) {
    const role = user.role || 'scholar';
    title.textContent = `Your ${role} week at a glance`;
  }
  
  if (desc) {
    const interests = user.interests || [];
    let interestText = '';
    if (interests.length > 0) {
      interestText = `• ${interests.slice(0, 3).join(', ')}`;
    }
    desc.textContent = `2 events today • 1 project PR due • Scholar AI saved you 3.4 hrs this week ${interestText}`;
  }
}

// ============================================
// UPDATE STATS
// ============================================

function updateStats(user) {
  const interests = user.interests || [];
  const progress = Math.min(interests.length * 15 + 40, 95);
  
  const progressEl = document.getElementById('learningProgress');
  const progressFill = document.getElementById('progressFill');
  const progressLabel = document.getElementById('learningLabel');
  
  if (progressEl) {
    progressEl.textContent = progress + '%';
  }
  
  if (progressFill) {
    progressFill.style.width = progress + '%';
  }
  
  if (progressLabel) {
    const role = user.role || 'Scholar';
    const interestsCount = interests.length;
    let label = `${role} Journey`;
    if (interestsCount > 0) {
      label += ` • ${interestsCount} interests explored`;
    }
    progressLabel.textContent = label;
  }
  
  // Update community stats
  const stats = UserDB.getStats();
  const communityEl = document.getElementById('statCommunity');
  if (communityEl) {
    communityEl.textContent = stats.total || 0;
  }
  
  // Update verification stats
  const pendingEl = document.getElementById('statPending');
  if (pendingEl) {
    pendingEl.textContent = stats.pending || 0;
  }
  
  const verifiedEl = document.getElementById('statVerified');
  if (verifiedEl) {
    verifiedEl.textContent = stats.verified || 0;
  }
}

// ============================================
// UPDATE RECENT ACTIVITY
// ============================================

function updateRecentActivity(user) {
  const activityEl = document.getElementById('recentActivity');
  if (!activityEl) return;
  
  const name = user.fullName || 'You';
  const interests = user.interests || [];
  const role = user.role || 'scholar';
  
  let activities = [];
  
  activities.push(`✅ ${name} completed profile setup`);
  
  if (interests.length > 0) {
    activities.push(`🎯 ${name} is interested in ${interests.slice(0, 3).join(', ')}`);
  }
  
  if (user.bio) {
    activities.push(`📝 ${name} updated bio: "${user.bio.substring(0, 50)}..."`);
  }
  
  if (user.country) {
    activities.push(`📍 ${name} is based in ${user.country}`);
  }
  
  // Add verification activity
  if (user.isVerified && user.verificationStatus === 'approved') {
    activities.push(`✅ ${name}'s profile is verified!`);
  } else if (user.verificationStatus === 'pending') {
    activities.push(`⏳ ${name}'s verification is pending...`);
  } else if (user.verificationStatus === 'rejected') {
    activities.push(`❌ ${name}'s verification was rejected`);
  }
  
  activities.push(`💬 Joined the ${role} community`);
  activities.push(`📅 ${name} RSVP'd to upcoming events`);
  
  if (activities.length === 0) {
    activities = [
      `✅ Welcome to Scholar Junction, ${name}!`,
      `💬 Join a community to get started`,
      `📚 Explore the Knowledge Hub`
    ];
  }
  
  const displayActivities = activities.slice(0, 5);
  activityEl.innerHTML = displayActivities.map(activity => 
    `<div>${activity}</div>`
  ).join('');
}

// ============================================
// PROFILE VERIFICATION
// ============================================

function loadVerificationStatus() {
  console.log('🔄 Loading verification status...');
  
  const statusBadge = document.getElementById('verificationStatusBadge');
  const content = document.getElementById('verificationContent');

  if (!statusBadge || !content) {
    console.warn('⚠️ Verification elements not found');
    setTimeout(function() {
      const retryBadge = document.getElementById('verificationStatusBadge');
      const retryContent = document.getElementById('verificationContent');
      if (retryBadge && retryContent) {
        loadVerificationStatus();
      }
    }, 500);
    return;
  }

  const user = UserDB.getCurrentUserFull();
  if (!user) {
    console.warn('⚠️ No user found');
    statusBadge.innerHTML = '<span class="verification-status badge-none">Not Verified</span>';
    content.innerHTML = `
      <div style="display:flex;align-items:center;gap:16px;padding:16px;background:#f8fafc;border-radius:12px;border:1px solid #e2e8f0;">
        <div style="font-size:32px;">🔐</div>
        <div style="flex:1;">
          <div style="font-weight:600;color:#0f172a;">Complete Your Profile</div>
          <div class="text-sm text-muted">Fill your profile to get verified</div>
          <button class="btn btn-primary mt-2" onclick="goToProfileSetup()">Go to Profile Setup</button>
        </div>
      </div>
    `;
    return;
  }

  // ===== PROFILE COMPLETION CHECK =====
  const hasBio = user.bio && user.bio.length >= 20;
  const hasInterests = user.interests && user.interests.length > 0;
  const hasCountry = user.country && user.country !== '';
  const isProfileComplete = hasBio && hasInterests && hasCountry;

  console.log('📊 Profile Complete:', isProfileComplete);
  console.log('  - Bio:', hasBio, `(${user.bio ? user.bio.length : 0}/20 chars)`);
  console.log('  - Interests:', hasInterests, `(${user.interests ? user.interests.length : 0} selected)`);
  console.log('  - Country:', hasCountry, `(${user.country || 'Not set'})`);

  const status = user.verificationStatus || 'none';
  const isVerified = user.isVerified || false;

  // ===== UPDATE BADGE =====
  let badgeHtml = '';
  let badgeText = '';
  let badgeClass = '';

  if (isVerified && status === 'approved') {
    badgeText = '✅ Verified';
    badgeClass = 'badge-verified';
  } else if (status === 'pending') {
    badgeText = '⏳ Pending';
    badgeClass = 'badge-pending';
  } else if (status === 'rejected') {
    badgeText = '❌ Rejected';
    badgeClass = 'badge-rejected';
  } else if (isProfileComplete) {
    // If profile is complete but not verified, auto-request verification
    badgeText = '⏳ Pending';
    badgeClass = 'badge-pending';
    // Auto-request verification if not already requested
    if (status === 'none' || status === 'rejected') {
      const result = UserDB.requestVerification(user.id);
      if (result.success) {
        console.log('✅ Auto-verification requested');
        setTimeout(function() {
          loadVerificationStatus();
        }, 500);
        return;
      }
    }
  } else {
    badgeText = 'Not Verified';
    badgeClass = 'badge-none';
  }
  
  statusBadge.innerHTML = `<span class="verification-status ${badgeClass}">${badgeText}</span>`;

  // ===== UPDATE CONTENT =====
  let contentHtml = '';

  // CASE 1: VERIFIED ✅
  if (isVerified && status === 'approved') {
    contentHtml = `
      <div style="display:flex;align-items:center;gap:16px;padding:16px;background:#ecfdf5;border-radius:12px;border:1px solid #bbf7d0;">
        <div style="font-size:32px;">🎓</div>
        <div>
          <div style="font-weight:600;color:#059669;">Profile Verified ✅</div>
          <div class="text-sm text-muted">Your profile has been verified. You have access to all features.</div>
          <div class="text-xs text-muted mt-1">Verified on: ${user.verifiedAt ? new Date(user.verifiedAt).toLocaleDateString() : 'N/A'}</div>
          <div class="text-xs text-muted" style="color:#059669;">Profile Status: Complete ✅</div>
        </div>
      </div>
    `;
  }
  // CASE 2: PENDING ⏳
  else if (status === 'pending') {
    const requestedAt = user.verificationRequestedAt ? new Date(user.verificationRequestedAt) : null;
    const timeElapsed = requestedAt ? Math.floor((Date.now() - requestedAt.getTime()) / 60000) : 0;
    const remainingTime = Math.max(0, 30 - timeElapsed);
    
    contentHtml = `
      <div style="display:flex;align-items:center;gap:16px;padding:16px;background:#fef3c7;border-radius:12px;border:1px solid #fde68a;">
        <div style="font-size:32px;">⏳</div>
        <div style="flex:1;">
          <div style="font-weight:600;color:#d97706;">Verification Pending</div>
          <div class="text-sm text-muted">Your verification request is being reviewed by admin.</div>
          <div class="text-xs text-muted mt-1">
            ${remainingTime > 0 ? `Estimated time remaining: ${remainingTime} minutes` : 'Review in progress...'}
          </div>
          <div class="progress-track mt-2" style="width:200px;height:4px;">
            <div class="progress-fill" style="width:${Math.min(100, (30 - remainingTime) / 30 * 100)}%;background:#d97706;"></div>
          </div>
          <div class="text-xs text-muted mt-1" style="color:#d97706;">Profile Status: Pending ⏳</div>
        </div>
        <button class="btn btn-sm btn-outline" onclick="cancelVerificationRequest()">Cancel Request</button>
      </div>
    `;
  }
  // CASE 3: REJECTED ❌
  else if (status === 'rejected') {
    contentHtml = `
      <div style="display:flex;align-items:center;gap:16px;padding:16px;background:#fef2f2;border-radius:12px;border:1px solid #fecaca;">
        <div style="font-size:32px;">❌</div>
        <div>
          <div style="font-weight:600;color:#dc2626;">Verification Rejected</div>
          <div class="text-sm text-muted">Your verification request was rejected. Please update your profile and try again.</div>
          <div class="text-xs text-muted mt-1" style="color:#dc2626;">Profile Status: Rejected ❌</div>
          <button class="btn btn-sm btn-primary mt-2" onclick="goToProfileSetup()">Update Profile</button>
        </div>
      </div>
    `;
  }
  // CASE 4: NOT VERIFIED - Show profile completion status
  else {
    const profileStatus = isProfileComplete ? 'Complete ✅' : 'Incomplete ❌';
    const statusColor = isProfileComplete ? '#22C55E' : '#EF4444';
    
    // Show what's missing if incomplete
    let missingFields = '';
    if (!isProfileComplete) {
      const missing = [];
      if (!hasBio) missing.push('Bio (min 20 chars)');
      if (!hasInterests) missing.push('Interests (min 1)');
      if (!hasCountry) missing.push('Country');
      missingFields = `<div class="text-xs text-muted mt-1">Missing: ${missing.join(', ')}</div>`;
    }
    
    contentHtml = `
      <div style="display:flex;align-items:center;gap:16px;padding:16px;background:#f8fafc;border-radius:12px;border:1px solid #e2e8f0;">
        <div style="font-size:32px;">${isProfileComplete ? '📋' : '📝'}</div>
        <div style="flex:1;">
          <div style="font-weight:600;color:#0f172a;">${isProfileComplete ? 'Profile Complete' : 'Profile Incomplete'}</div>
          <div class="text-sm text-muted">${isProfileComplete ? 'Your profile is ready for verification' : 'Complete your profile to get verified'}</div>
          <div class="mt-2" style="display:flex;gap:16px;flex-wrap:wrap;">
            <div style="display:flex;align-items:center;gap:6px;font-size:13px;">
              ${hasBio ? '✅' : '❌'} Bio ${hasBio ? `(${user.bio.length}/20 chars)` : '(min 20 chars)'}
            </div>
            <div style="display:flex;align-items:center;gap:6px;font-size:13px;">
              ${hasInterests ? '✅' : '❌'} Interests ${hasInterests ? `(${user.interests.length} selected)` : '(min 1)'}
            </div>
            <div style="display:flex;align-items:center;gap:6px;font-size:13px;">
              ${hasCountry ? '✅' : '❌'} Country ${hasCountry ? `(${user.country})` : '(required)'}
            </div>
          </div>
          ${missingFields}
          <div class="text-xs text-muted mt-1">
            Profile Status: <span style="color:${statusColor};font-weight:600;">${profileStatus}</span>
          </div>
        </div>
        <button class="btn ${isProfileComplete ? 'btn-primary' : 'btn-warning'}" 
                onclick="${isProfileComplete ? 'requestVerification()' : 'goToProfileSetup()'}"
                style="cursor:pointer;">
          ${isProfileComplete ? 'Request Verification' : 'Complete Profile'}
        </button>
      </div>
    `;
  }

  content.innerHTML = contentHtml;
  console.log('✅ Verification status loaded');
}

// ============================================
// REQUEST VERIFICATION
// ============================================

function requestVerification() {
  const user = UserDB.getCurrentUser();
  if (!user) {
    showToast('Please login first', 'warning');
    return;
  }

  const fullUser = UserDB.getCurrentUserFull();
  if (!fullUser) {
    showToast('User data not found', 'error');
    return;
  }

  // Check if profile is complete
  const hasBio = fullUser.bio && fullUser.bio.length >= 20;
  const hasInterests = fullUser.interests && fullUser.interests.length > 0;
  const hasCountry = fullUser.country && fullUser.country !== '';
  const isProfileComplete = hasBio && hasInterests && hasCountry;

  if (!isProfileComplete) {
    let missing = [];
    if (!hasBio) missing.push('bio (min 20 chars)');
    if (!hasInterests) missing.push('interests (min 1)');
    if (!hasCountry) missing.push('country');
    showToast(`Please complete your profile first: ${missing.join(', ')}`, 'warning');
    setTimeout(function() {
      window.location.href = 'profile-setup.html';
    }, 1500);
    return;
  }

  // Check if already pending
  if (fullUser.verificationStatus === 'pending') {
    showToast('Verification already requested. Please wait for admin review.', 'info');
    return;
  }

  if (fullUser.verificationStatus === 'approved') {
    showToast('Profile already verified! ✅', 'success');
    return;
  }

  const result = UserDB.requestVerification(user.id);
  
  if (result.success) {
    showToast(result.message, 'success');
    setTimeout(function() {
      loadVerificationStatus();
    }, 500);
  } else {
    showToast(result.message, 'error');
  }
}

// ============================================
// CANCEL VERIFICATION REQUEST
// ============================================

function cancelVerificationRequest() {
  if (!confirm('Are you sure you want to cancel your verification request?')) {
    return;
  }
  
  const user = UserDB.getCurrentUser();
  if (!user) {
    showToast('Please login first', 'warning');
    return;
  }

  const fullUser = UserDB.getCurrentUserFull();
  if (!fullUser) {
    showToast('User data not found', 'error');
    return;
  }

  fullUser.verificationStatus = 'none';
  fullUser.verificationRequestedAt = null;
  UserDB.saveUsers();

  showToast('Verification request cancelled', 'info');
  
  setTimeout(function() {
    loadVerificationStatus();
  }, 300);
}

// ============================================
// GO TO PROFILE SETUP
// ============================================

function goToProfileSetup() {
  console.log('📝 Opening profile setup page...');
  showToast('Opening profile setup...', 'info');
  setTimeout(function() {
    window.location.href = 'profile-setup.html';
  }, 300);
}

// ============================================
// BURGER MENU
// ============================================

function setupBurgerMenu() {
  const burgerBtn = document.querySelector('[data-burger]');
  const sidebar = document.querySelector('.app-sidebar');
  
  if (!burgerBtn || !sidebar) {
    console.warn('Burger menu elements not found');
    return;
  }
  
  let overlay = document.querySelector('.sidebar-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    overlay.style.cssText = `
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.4);
      z-index: 40;
    `;
    document.body.appendChild(overlay);
  }
  
  function toggleSidebar() {
    const isOpen = sidebar.classList.contains('open');
    
    if (isOpen) {
      sidebar.classList.remove('open');
      overlay.style.display = 'none';
      document.body.style.overflow = '';
    } else {
      sidebar.classList.add('open');
      overlay.style.display = 'block';
      document.body.style.overflow = 'hidden';
    }
  }
  
  burgerBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    toggleSidebar();
  });
  
  overlay.addEventListener('click', toggleSidebar);
  
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && sidebar.classList.contains('open')) {
      toggleSidebar();
    }
  });
  
  window.addEventListener('resize', function() {
    if (window.innerWidth > 992 && sidebar.classList.contains('open')) {
      toggleSidebar();
    }
  });
  
  console.log('🍔 Burger menu initialized');
}

// ============================================
// IMAGE UPDATE LISTENER
// ============================================

function setupImageUpdateListener() {
  // Listen for profile image updates from profile-setup page
  document.addEventListener('profileImageUpdated', function(e) {
    console.log('🔄 Profile image updated, refreshing avatar...');
    const user = UserDB.getCurrentUser();
    if (user) {
      // Reload user data
      const fullUser = UserDB.getCurrentUserFull();
      if (fullUser) {
        // Update the user with the new image
        if (e.detail && e.detail.imageData) {
          UserDB.updateUser(fullUser.id, { profileImage: e.detail.imageData });
          const updatedUser = UserDB.getCurrentUserFull();
          if (updatedUser) {
            UserDB.setCurrentUser(updatedUser);
            updateTopBar(updatedUser);
          }
        } else {
          updateTopBar(fullUser);
        }
      }
    }
  });

  // Listen for storage changes (when localStorage changes from another tab)
  window.addEventListener('storage', function(e) {
    if (e.key === 'profileImage') {
      console.log('🔄 Profile image changed in localStorage from another tab');
      const user = UserDB.getCurrentUser();
      if (user && e.newValue && e.newValue !== 'null' && e.newValue !== 'undefined') {
        // Update user with new image
        const result = UserDB.updateUser(user.id, { profileImage: e.newValue });
        if (result.success) {
          const updatedUser = UserDB.getCurrentUserFull();
          if (updatedUser) {
            UserDB.setCurrentUser(updatedUser);
            updateTopBar(updatedUser);
          }
        }
      }
    }
  });
  
  console.log('🖼️ Image update listener set up');
}

// ============================================
// LIVE REFRESH
// ============================================

function setupLiveRefresh() {
  setInterval(() => {
    const user = UserDB.getCurrentUser();
    if (user) {
      updateStats(user);
    }
  }, 30000);
  
  setInterval(() => {
    document.querySelectorAll('[data-live]').forEach(el => {
      el.textContent = Math.floor(Math.random() * 99);
    });
  }, 8000);
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
// REFRESH & LOGOUT
// ============================================

function refreshWidgets() {
  console.log('🔄 Refreshing dashboard widgets...');
  const user = UserDB.getCurrentUser();
  if (user) {
    loadDashboard();
    showToast('🔄 Dashboard refreshed!', 'success');
  }
}

function handleLogout() {
  if (!confirm('Are you sure you want to logout?')) return;
  
  const result = UserDB.logoutUser();
  if (result.success) {
    showToast('👋 Logged out successfully', 'success');
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 1000);
  }
}

// Make functions globally available
window.showToast = showToast;
window.refreshWidgets = refreshWidgets;
window.handleLogout = handleLogout;
window.requestVerification = requestVerification;
window.cancelVerificationRequest = cancelVerificationRequest;
window.loadVerificationStatus = loadVerificationStatus;
window.goToProfileSetup = goToProfileSetup;

console.log('📊 Dashboard Ready!');