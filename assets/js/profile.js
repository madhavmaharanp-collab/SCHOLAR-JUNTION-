// ============================================
// SCHOLAR JUNCTION - PROFILE PAGE
// Dynamic profile with data from UserDB
// ============================================

document.addEventListener('DOMContentLoaded', function() {
  console.log('👤 Profile Page Loading...');
  
  // Check if UserDB is available
  if (typeof UserDB === 'undefined') {
    console.error('❌ UserDB not loaded!');
    showToast('System error. Please refresh.', 'error');
    return;
  }
  
  // Check if user is logged in
  if (!UserDB.isLoggedIn()) {
    console.warn('⚠️ Not logged in, redirecting to login...');
    showToast('Please login to view profile', 'warning');
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 1500);
    return;
  }
  
  // Load profile data
  loadProfile();
  
  // Setup tabs
  setupTabs();
  
  // Setup avatar upload
  setupAvatarUpload();
  
  // Setup header avatar
  updateHeaderAvatar();
});

// ============================================
// LOAD PROFILE DATA
// ============================================

function loadProfile() {
  console.log('🔄 Loading profile data...');
  
  const user = UserDB.getCurrentUser();
  if (!user) {
    console.error('❌ No user session found');
    return;
  }
  
  const fullUser = UserDB.getCurrentUserFull();
  console.log('👤 User data:', fullUser);
  
  if (!fullUser) {
    console.warn('⚠️ No full user data found');
    return;
  }
  
  // Update profile with user data
  updateProfile(fullUser);
  
  console.log('✅ Profile loaded successfully');
}

// ============================================
// UPDATE PROFILE
// ============================================

function updateProfile(user) {
  console.log('🔄 Updating profile with user data...');
  
  // ===== PROFILE IMAGE =====
  const avatarImage = document.getElementById('profileAvatarImage');
  const avatarInitial = document.getElementById('profileAvatarInitial');
  const profileAvatar = document.getElementById('profileAvatar');
  
  // Check multiple sources for profile image
  let profileImage = null;
  
  // 1. Check from user data
  if (user.profileImage) {
    profileImage = user.profileImage;
  }
  // 2. Check from localStorage
  else {
    const localImage = localStorage.getItem('profileImage');
    if (localImage && localImage !== 'null' && localImage !== 'undefined') {
      profileImage = localImage;
    }
  }
  
  if (profileImage && profileImage !== 'null' && profileImage !== 'undefined') {
    avatarImage.src = profileImage;
    avatarImage.style.display = 'block';
    avatarInitial.style.display = 'none';
    console.log('🖼️ Profile image displayed');
  } else {
    avatarImage.style.display = 'none';
    avatarInitial.style.display = 'flex';
    const initial = user.fullName ? user.fullName.charAt(0).toUpperCase() : '?';
    avatarInitial.textContent = initial;
    console.log('ℹ️ No profile image, showing initials:', initial);
  }
  
  // ===== NAME =====
  const nameEl = document.getElementById('profileName');
  if (nameEl) {
    nameEl.textContent = user.fullName || 'Unknown User';
  }
  
  // ===== TITLE =====
  const titleEl = document.getElementById('profileTitle');
  if (titleEl) {
    const role = user.role || 'Student';
    const country = user.country || '';
    const academic = user.academicDetails || {};
    const university = academic.university || '';
    const eduLevel = academic.educationLevel || '';
    
    let title = '';
    if (eduLevel) title += eduLevel + ' ';
    if (role) title += role.charAt(0).toUpperCase() + role.slice(1);
    if (university) title += ' • ' + university;
    if (country) title += ' • ' + country;
    
    titleEl.textContent = title || 'Scholar';
  }
  
  // ===== BIO =====
  const bioEl = document.getElementById('profileBio');
  if (bioEl) {
    bioEl.textContent = user.bio || 'No bio provided. Edit your profile to add a bio.';
  }
  
  // ===== INTERESTS =====
  const interestsEl = document.getElementById('profileInterests');
  if (interestsEl) {
    const interests = user.interests || [];
    if (interests.length > 0) {
      interestsEl.innerHTML = interests.map(i => `<span class="tag">${i}</span>`).join('');
    } else {
      interestsEl.innerHTML = '<span class="text-muted">No interests added</span>';
    }
  }
  
  // ===== SKILLS =====
  const skillsEl = document.getElementById('profileSkills');
  if (skillsEl) {
    const academic = user.academicDetails || {};
    const skills = academic.skills || '';
    if (skills) {
      const skillArray = skills.split(',').map(s => s.trim()).filter(s => s);
      skillsEl.innerHTML = skillArray.map(s => `<span class="tag">${s}</span>`).join('');
    } else {
      skillsEl.innerHTML = '<span class="text-muted">No skills added</span>';
    }
  }
  
  // ===== TAGS (Interests as tags) =====
  const tagsEl = document.getElementById('profileTags');
  if (tagsEl) {
    const interests = user.interests || [];
    if (interests.length > 0) {
      tagsEl.innerHTML = interests.slice(0, 5).map(i => `<span class="tag">${i}</span>`).join('');
    } else {
      tagsEl.innerHTML = '<span class="text-muted">No interests</span>';
    }
  }
  
  // ===== CONTACT =====
  const contactEl = document.getElementById('profileContact');
  if (contactEl) {
    const social = user.socialLinks || {};
    let contactHtml = user.email || '';
    if (social.linkedin) contactHtml += `<br>linkedin.com/in/${social.linkedin}`;
    if (social.github) contactHtml += `<br>github.com/${social.github}`;
    if (social.website) contactHtml += `<br>${social.website}`;
    if (social.twitter) contactHtml += `<br>twitter.com/${social.twitter.replace('@', '')}`;
    contactEl.innerHTML = contactHtml || 'No contact info added';
  }
  
  // ===== ACADEMIC DETAILS =====
  const academicEl = document.getElementById('profileAcademic');
  if (academicEl) {
    const academic = user.academicDetails || {};
    const isStudent = user.role === 'student';
    let academicHtml = '';
    
    if (isStudent) {
      if (academic.educationLevel) academicHtml += `Education: ${academic.educationLevel}<br>`;
      if (academic.university) academicHtml += `University: ${academic.university}<br>`;
      if (academic.semester) academicHtml += `Semester: ${academic.semester}`;
    } else {
      if (academic.department) academicHtml += `Department: ${academic.department}<br>`;
      if (academic.subject) academicHtml += `Subject: ${academic.subject}<br>`;
      if (academic.experience) academicHtml += `Experience: ${academic.experience} years`;
      if (academic.research) academicHtml += `<br>Research: ${academic.research}`;
    }
    
    academicEl.innerHTML = academicHtml || 'No academic details added';
  }
  
  // ===== VERIFICATION BADGE =====
  const verificationEl = document.getElementById('verificationBadge');
  if (verificationEl) {
    const isVerified = user.isVerified || false;
    const status = user.verificationStatus || 'none';
    
    if (isVerified && status === 'approved') {
      verificationEl.innerHTML = '<span class="badge-verified" style="padding:6px 16px;border-radius:999px;font-weight:600;">✅ Verified Profile</span>';
    } else if (status === 'pending') {
      verificationEl.innerHTML = '<span class="badge-pending" style="padding:6px 16px;border-radius:999px;font-weight:600;">⏳ Verification Pending</span>';
    } else if (status === 'rejected') {
      verificationEl.innerHTML = '<span class="badge-rejected" style="padding:6px 16px;border-radius:999px;font-weight:600;">❌ Verification Rejected</span>';
    } else {
      verificationEl.innerHTML = '';
    }
  }
  
  // ===== STATS =====
  const statsEl = document.getElementById('profileStats');
  if (statsEl) {
    const interests = user.interests || [];
    const role = user.role || 'Scholar';
    let stats = '';
    if (interests.length > 0) {
      stats += interests.slice(0, 3).join(' • ');
    }
    stats += ` • ${role}`;
    statsEl.textContent = stats || 'Scholar';
  }
  
  // ===== HEADER AVATAR =====
  updateHeaderAvatar();
  
  console.log('✅ Profile updated successfully');
}

// ============================================
// UPDATE HEADER AVATAR
// ============================================

function updateHeaderAvatar() {
  const headerAvatar = document.getElementById('headerAvatar');
  if (!headerAvatar) return;
  
  const user = UserDB.getCurrentUserFull();
  if (!user) return;
  
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
// SETUP TABS
// ============================================

function setupTabs() {
  const tabs = document.querySelectorAll('[data-tab]');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', function() {
      const tabName = this.getAttribute('data-tab');
      
      // Update tab buttons
      tabs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      
      // Update panels
      document.querySelectorAll('[data-tab-panel]').forEach(panel => {
        panel.hidden = true;
      });
      
      const panel = document.querySelector(`[data-tab-panel="${tabName}"]`);
      if (panel) {
        panel.hidden = false;
      }
    });
  });
}

// ============================================
// SETUP AVATAR UPLOAD
// ============================================

function setupAvatarUpload() {
  const uploadBtn = document.getElementById('avatarUploadBtn');
  const avatarInput = document.getElementById('avatarInput');
  const profileAvatar = document.getElementById('profileAvatar');
  const avatarImage = document.getElementById('profileAvatarImage');
  const avatarInitial = document.getElementById('profileAvatarInitial');
  
  if (!uploadBtn || !avatarInput) {
    console.warn('⚠️ Avatar upload elements not found');
    return;
  }
  
  // Click to upload
  uploadBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    avatarInput.click();
  });
  
  // Handle file selection
  avatarInput.addEventListener('change', function(e) {
    const file = this.files[0];
    if (!file) return;
    
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      showToast('Please upload a JPG, PNG, GIF, or WEBP image.', 'error');
      this.value = '';
      return;
    }
    
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      showToast('Image must be less than 2MB.', 'error');
      this.value = '';
      return;
    }
    
    uploadProfileImage(file);
  });
}

// ============================================
// UPLOAD PROFILE IMAGE
// ============================================

function uploadProfileImage(file) {
  showToast('Uploading image...', 'info');
  
  const reader = new FileReader();
  reader.onload = function(e) {
    const imageData = e.target.result;
    
    // Display the image on profile
    const avatarImage = document.getElementById('profileAvatarImage');
    const avatarInitial = document.getElementById('profileAvatarInitial');
    
    avatarImage.src = imageData;
    avatarImage.style.display = 'block';
    avatarInitial.style.display = 'none';
    
    // Save to localStorage
    localStorage.setItem('profileImage', imageData);
    
    // Save to UserDB
    try {
      const currentUser = UserDB.getCurrentUser();
      if (currentUser) {
        const result = UserDB.updateUser(currentUser.id, { profileImage: imageData });
        if (result.success) {
          console.log('🖼️ Profile image saved to database');
          // Update session
          const updatedUser = UserDB.getCurrentUserFull();
          if (updatedUser) {
            UserDB.setCurrentUser(updatedUser);
          }
          // Update header avatar
          updateHeaderAvatar();
          showToast('✅ Profile photo updated successfully!', 'success');
          
          // Dispatch event for other pages
          document.dispatchEvent(new CustomEvent('profileImageUpdated', {
            detail: { imageData: imageData }
          }));
        } else {
          showToast('⚠️ Image saved locally but not synced', 'warning');
        }
      }
    } catch (e) {
      console.warn('Could not save image to UserDB:', e);
      showToast('⚠️ Image saved locally', 'warning');
    }
  };
  reader.readAsDataURL(file);
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
// FOLLOW BUTTON HANDLER
// ============================================

document.addEventListener('click', function(e) {
  if (e.target.closest('.follow-btn')) {
    showToast('Followed!', 'success');
  }
});

console.log('👤 Profile Page Ready!');