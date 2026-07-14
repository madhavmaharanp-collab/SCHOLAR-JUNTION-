// ============================================
// PROFILE SETUP WIZARD - COMPLETE WORKING VERSION
// WITH DATABASE INTEGRATION & VERIFICATION
// ============================================

document.addEventListener('DOMContentLoaded', function() {
  console.log('🚀 Profile Setup Wizard Initializing...');
  
  // ===== CHECK USERDB AND LOGIN STATUS =====
  if (typeof UserDB === 'undefined') {
    console.error('❌ UserDB not loaded!');
    showToast('Please fill the form.', 'error');
    // Still allow the wizard to work, but show warning
  }
  
  if (typeof UserDB !== 'undefined' && !UserDB.isLoggedIn()) {
    console.warn('⚠️ Not logged in, redirecting to login...');
    showToast('Please login first', 'warning');
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 1500);
    return;
  }
  
  // ===== STATE =====
  let currentStep = 1;
  const totalSteps = 4;
  
  // ===== DOM ELEMENTS =====
  const stepCards = document.querySelectorAll('.step-card');
  const stepNumDisplay = document.getElementById('stepNum');
  const progressBar = document.getElementById('prog');
  
  // Step 1 Elements
  const profileName = document.getElementById('profileName');
  const profileCountry = document.getElementById('profileCountry');
  const avatarUpload = document.getElementById('avatarUpload');
  const avatarInput = document.getElementById('avatarInput');
  const avatarImage = document.getElementById('avatarImage');
  const avatarPlaceholder = document.querySelector('.avatar-placeholder');
  const uploadStatus = document.getElementById('uploadStatus');
  const uploadStatusText = document.getElementById('uploadStatusText');
  
  // Step 2 Elements
  const roleCards = document.querySelectorAll('.role-card');
  const studentFields = document.getElementById('studentFields');
  const teacherFields = document.getElementById('teacherFields');
  
  // Step 4 Elements
  const bioTextarea = document.getElementById('bioTextarea');
  const charCount = document.getElementById('charCount');
  const linkedinInput = document.getElementById('linkedin');
  const githubInput = document.getElementById('github');
  const websiteInput = document.getElementById('website');
  const twitterInput = document.getElementById('twitter');
  
  // Navigation Buttons
  const nextButtons = document.querySelectorAll('.next');
  const prevButtons = document.querySelectorAll('.prev');
  
  // ============================================
  // STEP 1 VALIDATION
  // ============================================
  
  function validateStep1() {
    const name = profileName?.value?.trim() || '';
    const country = profileCountry?.value || '';
    const nextBtn = document.querySelector('[data-step="1"] .next');
    
    let isValid = false;
    
    if (name.length >= 2 && country !== '') {
      isValid = true;
      if (nextBtn) {
        nextBtn.disabled = false;
        nextBtn.style.opacity = '1';
        nextBtn.style.cursor = 'pointer';
        nextBtn.style.pointerEvents = 'auto';
      }
      updateStepStatus(1, '✅ Complete');
    } else {
      if (nextBtn) {
        nextBtn.disabled = true;
        nextBtn.style.opacity = '0.5';
        nextBtn.style.cursor = 'not-allowed';
        nextBtn.style.pointerEvents = 'none';
      }
      let msg = '';
      if (name.length < 2) msg = 'Name required (min 2 chars)';
      if (country === '') msg = msg ? msg + ' • Select country' : 'Select your country';
      updateStepStatus(1, '⚠️ ' + msg);
    }
    
    return isValid;
  }
  
  // ============================================
  // STEP 2 VALIDATION (Role Cards)
  // ============================================
  
  function validateStep2() {
    const activeRole = document.querySelector('.role-card.active');
    const nextBtn = document.querySelector('[data-step="2"] .next');
    
    if (activeRole) {
      if (nextBtn) {
        nextBtn.disabled = false;
        nextBtn.style.opacity = '1';
        nextBtn.style.cursor = 'pointer';
        nextBtn.style.pointerEvents = 'auto';
      }
      const roleName = activeRole.dataset.role || 'selected';
      updateStepStatus(2, '✅ Selected: ' + roleName.charAt(0).toUpperCase() + roleName.slice(1));
      return true;
    } else {
      if (nextBtn) {
        nextBtn.disabled = true;
        nextBtn.style.opacity = '0.5';
        nextBtn.style.cursor = 'not-allowed';
        nextBtn.style.pointerEvents = 'none';
      }
      updateStepStatus(2, '⚠️ Please select your role');
      return false;
    }
  }
  
  // ============================================
  // STEP 3 VALIDATION
  // ============================================
  
  function validateStep3() {
    const nextBtn = document.querySelector('[data-step="3"] .next');
    const isStudent = !studentFields?.hidden;
    const isTeacher = !teacherFields?.hidden;
    
    const allChips = document.querySelectorAll('.chip');
    const activeChips = document.querySelectorAll('.chip.active');
    
    console.log('🔍 Step 3 Validation:');
    console.log('  Total chips found:', allChips.length);
    console.log('  Active chips:', activeChips.length);
    
    let isValid = false;
    let allFilled = true;
    
    if (isStudent) {
      const eduLevel = document.getElementById('educationLevel')?.value;
      const university = document.getElementById('university')?.value?.trim();
      const semester = document.getElementById('semester')?.value?.trim();
      const skills = document.getElementById('skills')?.value?.trim();
      
      console.log('  Student fields:', { eduLevel, university, semester, skills });
      
      if (!eduLevel || eduLevel === '') allFilled = false;
      if (!university || university.length < 2) allFilled = false;
      if (!semester || semester.length < 1) allFilled = false;
      if (!skills || skills.length < 2) allFilled = false;
      if (activeChips.length < 1) allFilled = false;
      
      isValid = allFilled;
    } else if (isTeacher) {
      const dept = document.getElementById('department')?.value?.trim();
      const subject = document.getElementById('subject')?.value?.trim();
      const experience = document.getElementById('experience')?.value?.trim();
      const research = document.getElementById('research')?.value?.trim();
      
      console.log('  Teacher fields:', { dept, subject, experience, research });
      
      if (!dept || dept.length < 2) allFilled = false;
      if (!subject || subject.length < 2) allFilled = false;
      if (!experience || parseInt(experience) < 1) allFilled = false;
      if (!research || research.length < 2) allFilled = false;
      
      isValid = allFilled;
    }
    
    if (isValid) {
      if (nextBtn) {
        nextBtn.disabled = false;
        nextBtn.style.opacity = '1';
        nextBtn.style.cursor = 'pointer';
        nextBtn.style.pointerEvents = 'auto';
      }
      updateStepStatus(3, '✅ All fields filled');
    } else {
      if (nextBtn) {
        nextBtn.disabled = true;
        nextBtn.style.opacity = '0.5';
        nextBtn.style.cursor = 'not-allowed';
        nextBtn.style.pointerEvents = 'none';
      }
      let msg = '';
      if (activeChips.length < 1) {
        msg = 'Please select at least 1 interest';
      } else {
        msg = 'Please fill all fields';
      }
      updateStepStatus(3, '⚠️ ' + msg);
    }
    
    return isValid;
  }
  
  // ============================================
  // STEP 4 VALIDATION
  // ============================================
  
  function validateStep4() {
    const bio = bioTextarea?.value?.trim() || '';
    const minLength = 20;
    const finishBtn = document.querySelector('[data-step="4"] .next');
    
    console.log('🔍 Step 4 Validation:');
    console.log('  Bio length:', bio.length);
    
    // Update character counter
    if (charCount) {
      charCount.textContent = bio.length;
      charCount.style.color = bio.length >= minLength ? '#22C55E' : '#94a3b8';
    }
    
    // Check if bio meets minimum requirement
    const isBioValid = bio.length >= minLength;
    
    // Social links are optional - get their values for saving
    const linkedin = linkedinInput?.value?.trim() || '';
    const github = githubInput?.value?.trim() || '';
    const website = websiteInput?.value?.trim() || '';
    const twitter = twitterInput?.value?.trim() || '';
    
    console.log('  Social links:', { linkedin, github, website, twitter });
    
    if (finishBtn) {
      if (isBioValid) {
        finishBtn.disabled = false;
        finishBtn.style.opacity = '1';
        finishBtn.style.cursor = 'pointer';
        finishBtn.style.pointerEvents = 'auto';
        finishBtn.textContent = 'Finish → Go to Dashboard';
      } else {
        finishBtn.disabled = true;
        finishBtn.style.opacity = '0.5';
        finishBtn.style.cursor = 'not-allowed';
        finishBtn.style.pointerEvents = 'none';
        finishBtn.textContent = 'Finish → Go to Dashboard';
      }
    }
    
    if (isBioValid) {
      updateStepStatus(4, '✅ ' + bio.length + ' characters');
    } else {
      const remaining = minLength - bio.length;
      updateStepStatus(4, '⚠️ ' + remaining + ' more characters needed (min ' + minLength + ')');
    }
    
    return isBioValid;
  }
  
  // ============================================
  // UPDATE STEP STATUS
  // ============================================
  
  function updateStepStatus(step, message) {
    let statusEl = document.querySelector(`.step-status[data-step="${step}"]`);
    
    if (!statusEl) {
      const stepCard = document.querySelector(`[data-step="${step}"]`);
      if (stepCard) {
        statusEl = document.createElement('div');
        statusEl.className = 'step-status';
        statusEl.setAttribute('data-step', step);
        statusEl.style.cssText = `
          font-size: 13px;
          padding: 8px 16px;
          border-radius: 8px;
          background: #f8fafc;
          margin-top: 12px;
          display: inline-block;
          color: #64748b;
          transition: all 0.3s ease;
          font-weight: 500;
        `;
        const navButtons = stepCard.querySelector('.flex.justify-between');
        if (navButtons) {
          stepCard.insertBefore(statusEl, navButtons);
        } else {
          stepCard.appendChild(statusEl);
        }
      }
    }
    
    if (statusEl) {
      statusEl.textContent = message;
      statusEl.style.color = message.includes('✅') ? '#22C55E' : message.includes('⚠️') ? '#F59E0B' : '#64748b';
    }
  }
  
  // ============================================
  // NAVIGATION
  // ============================================
  
  function goToStep(step) {
    if (step < 1 || step > totalSteps) return;
    currentStep = step;
    
    stepCards.forEach(card => {
      const cardStep = parseInt(card.dataset.step);
      card.hidden = cardStep !== step;
    });
    
    if (stepNumDisplay) {
      stepNumDisplay.textContent = step;
    }
    
    if (progressBar) {
      progressBar.style.width = (step / totalSteps * 100) + '%';
    }
    
    // Show/hide prev button
    const prevBtns = document.querySelectorAll('.prev');
    prevBtns.forEach(btn => {
      btn.style.display = step > 1 ? 'inline-flex' : 'none';
    });
    
    setTimeout(() => {
      switch(step) {
        case 1: validateStep1(); break;
        case 2: validateStep2(); break;
        case 3: validateStep3(); break;
        case 4: validateStep4(); break;
      }
    }, 100);
  }
  
  // ============================================
  // EVENT LISTENERS
  // ============================================
  
  // ---- STEP 1: Name & Country ----
  if (profileName) {
    profileName.addEventListener('input', validateStep1);
    profileName.addEventListener('change', validateStep1);
  }
  if (profileCountry) {
    profileCountry.addEventListener('change', validateStep1);
  }
  
  // ---- STEP 2: Role Cards ----
  roleCards.forEach(card => {
    card.addEventListener('click', function() {
      roleCards.forEach(c => c.classList.remove('active'));
      this.classList.add('active');
      
      const role = this.dataset.role;
      if (studentFields) {
        studentFields.hidden = role !== 'student';
      }
      if (teacherFields) {
        teacherFields.hidden = role === 'student';
      }
      
      validateStep2();
      setTimeout(validateStep3, 100);
    });
  });
  
  // ---- STEP 3: CHIPS ----
  console.log('🔍 Setting up chip click handlers...');
  
  // Clear any existing listeners by cloning and replacing
  document.querySelectorAll('.chip').forEach(chip => {
    const newChip = chip.cloneNode(true);
    chip.parentNode.replaceChild(newChip, chip);
  });
  
  // Add fresh click listeners to all chips
  document.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', function(e) {
      e.stopPropagation();
      e.preventDefault();
      
      console.log('🖱️ Chip clicked:', this.textContent.trim());
      this.classList.toggle('active');
      console.log('  Now active:', this.classList.contains('active'));
      
      validateStep3();
    });
  });
  
  // ---- STEP 3: Input fields ----
  const studentFieldIds = ['educationLevel', 'university', 'semester', 'skills'];
  studentFieldIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', function() {
        console.log('📝 Student field changed:', id, '=', this.value);
        validateStep3();
      });
      el.addEventListener('change', validateStep3);
    }
  });
  
  const teacherFieldIds = ['department', 'subject', 'experience', 'research'];
  teacherFieldIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', function() {
        console.log('📝 Teacher field changed:', id, '=', this.value);
        validateStep3();
      });
      el.addEventListener('change', validateStep3);
    }
  });
  
  // ---- STEP 4: Bio ----
  if (bioTextarea) {
    bioTextarea.addEventListener('input', validateStep4);
  }
  
  // ---- STEP 4: Social links (optional, but save their values) ----
  const socialInputs = [linkedinInput, githubInput, websiteInput, twitterInput];
  socialInputs.forEach(input => {
    if (input) {
      input.addEventListener('input', function() {
        saveFormData();
      });
      input.addEventListener('change', function() {
        saveFormData();
      });
    }
  });
  
  // ---- Previous Buttons ----
  prevButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      const stepCard = this.closest('.step-card');
      const step = parseInt(stepCard?.dataset.step);
      if (step > 1) {
        goToStep(step - 1);
      }
    });
  });
  
  // ============================================
  // NAVIGATION BUTTONS
  // ============================================
  
  nextButtons.forEach(btn => {
    if (btn.hasAttribute('disabled')) {
      btn.style.opacity = '0.5';
      btn.style.cursor = 'not-allowed';
      btn.style.pointerEvents = 'none';
    }
    
    btn.addEventListener('click', function(e) {
      const stepCard = this.closest('.step-card');
      const step = parseInt(stepCard?.dataset.step);
      
      console.log('➡️ Next button clicked, step:', step);
      
      if (this.disabled) {
        e.preventDefault();
        showToast('Please complete all required fields first', 'warning');
        return;
      }
      
      let isValid = false;
      switch(step) {
        case 1: isValid = validateStep1(); break;
        case 2: isValid = validateStep2(); break;
        case 3: isValid = validateStep3(); break;
        case 4: isValid = validateStep4(); break;
      }
      
      if (!isValid) {
        e.preventDefault();
        showToast('Please complete this step before continuing', 'warning');
        return;
      }
      
      if (step < totalSteps) {
        goToStep(step + 1);
      } else {
        // Save all data and redirect
        saveAllData();
      }
    });
  });
  
  // ============================================
  // IMAGE UPLOAD
  // ============================================
  
  if (avatarUpload && avatarInput) {
    avatarUpload.addEventListener('click', function(e) {
      if (e.target.closest('#avatarImage')) return;
      avatarInput.click();
    });
    
    avatarInput.addEventListener('change', function(e) {
      const file = this.files[0];
      if (!file) return;
      
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        showUploadStatus('Please upload a JPG, PNG, GIF, or WEBP image.', 'error');
        this.value = '';
        return;
      }
      
      const maxSize = 2 * 1024 * 1024;
      if (file.size > maxSize) {
        showUploadStatus('Image must be less than 2MB.', 'error');
        this.value = '';
        return;
      }
      
      uploadImage(file);
    });
    
    avatarUpload.addEventListener('dragover', function(e) {
      e.preventDefault();
      this.style.borderColor = '#2563EB';
      this.style.background = '#eff6ff';
    });
    
    avatarUpload.addEventListener('dragleave', function(e) {
      e.preventDefault();
      this.style.borderColor = '';
      this.style.background = '';
    });
    
    avatarUpload.addEventListener('drop', function(e) {
      e.preventDefault();
      this.style.borderColor = '';
      this.style.background = '';
      const file = e.dataTransfer.files[0];
      if (file) {
        avatarInput.files = e.dataTransfer.files;
        avatarInput.dispatchEvent(new Event('change'));
      }
    });
    
    function uploadImage(file) {
  showUploadStatus('Uploading image...', 'loading');
  avatarUpload.style.borderColor = '#2563EB';
  
  const reader = new FileReader();
  reader.onload = function(e) {
    const imageData = e.target.result;
    
    // 1. Display the image
    avatarImage.src = imageData;
    avatarImage.style.display = 'block';
    avatarPlaceholder.style.display = 'none';
    
    // 2. Save to localStorage
    localStorage.setItem('profileImage', imageData);
    console.log('🖼️ Image saved to localStorage');
    
    // 3. Save to UserDB if logged in
    try {
      if (typeof UserDB !== 'undefined') {
        const currentUser = UserDB.getCurrentUser();
        if (currentUser) {
          UserDB.updateUser(currentUser.id, { profileImage: imageData });
          console.log('🖼️ Image saved to UserDB');
          // Update session
          const updatedUser = UserDB.getCurrentUserFull();
          if (updatedUser) {
            UserDB.setCurrentUser(updatedUser);
          }
        }
      }
    } catch (e) {
      console.warn('Could not save image to UserDB:', e);
    }
    
    // 4. Show progress
    let progress = 0;
    const progressBar = document.createElement('div');
    progressBar.className = 'upload-progress';
    progressBar.style.cssText = `
      width: 100%;
      height: 4px;
      background: #e2e8f0;
      border-radius: 2px;
      overflow: hidden;
      margin-top: 8px;
    `;
    const progressFill = document.createElement('div');
    progressFill.className = 'upload-progress-bar';
    progressFill.style.cssText = `
      height: 100%;
      width: 0%;
      background: linear-gradient(90deg, #2563EB, #7C3AED);
      border-radius: 2px;
      transition: width 0.3s ease;
    `;
    progressBar.appendChild(progressFill);
    uploadStatus.appendChild(progressBar);
    
    const interval = setInterval(() => {
      progress += Math.random() * 15 + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        setTimeout(() => {
          avatarUpload.style.borderColor = '#22C55E';
          showUploadStatus('✅ Profile photo uploaded successfully!', 'success');
          setTimeout(() => progressBar.remove(), 2000);
          validateStep1();
          
          // 5. Notify other pages (like dashboard)
          document.dispatchEvent(new CustomEvent('profileImageUpdated', {
            detail: { imageData: imageData }
          }));
        }, 500);
      }
      progressFill.style.width = progress + '%';
    }, 150);
  };
  reader.readAsDataURL(file);
}
    
    function showUploadStatus(message, type) {
      if (!uploadStatus || !uploadStatusText) return;
      uploadStatus.style.display = 'block';
      uploadStatus.className = 'upload-status ' + type;
      uploadStatusText.textContent = message;
      if (type === 'success' || type === 'error') {
        setTimeout(() => {
          uploadStatus.style.display = 'none';
        }, 5000);
      }
    }
  }
  
  // ============================================
  // SAVE ALL DATA
  // ============================================
  
  function saveFormData() {
    try {
      const data = {
        name: document.getElementById('profileName')?.value || '',
        country: document.getElementById('profileCountry')?.value || '',
        role: document.querySelector('.role-card.active')?.dataset.role || '',
        interests: Array.from(document.querySelectorAll('.chip.active')).map(chip => chip.textContent.trim()),
        bio: document.getElementById('bioTextarea')?.value || '',
        linkedin: document.getElementById('linkedin')?.value || '',
        github: document.getElementById('github')?.value || '',
        website: document.getElementById('website')?.value || '',
        twitter: document.getElementById('twitter')?.value || ''
      };
      
      const isStudent = !studentFields?.hidden;
      if (isStudent) {
        data.educationLevel = document.getElementById('educationLevel')?.value || '';
        data.university = document.getElementById('university')?.value || '';
        data.semester = document.getElementById('semester')?.value || '';
        data.skills = document.getElementById('skills')?.value || '';
      } else {
        data.department = document.getElementById('department')?.value || '';
        data.subject = document.getElementById('subject')?.value || '';
        data.experience = document.getElementById('experience')?.value || '';
        data.research = document.getElementById('research')?.value || '';
      }
      
      localStorage.setItem('profileData', JSON.stringify(data));
      console.log('✅ Form data saved to localStorage');
    } catch (e) {
      console.warn('Could not save form data:', e);
    }
  }
  
  function saveAllData() {
    console.log('💾 Saving all profile data...');
    
    // First save to localStorage
    saveFormData();
    
    // Then save to UserDB if user is logged in
    const result = saveCompleteProfile();
    
    if (result) {
      showToast('🎉 Profile setup complete! Redirecting to dashboard...', 'success');
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 1500);
    } else {
      // Even if DB save fails, we still have localStorage
      showToast('⚠️ Profile saved locally. Redirecting...', 'warning');
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 2000);
    }
  }
  
  // ============================================
// SAVE COMPLETE PROFILE TO DATABASE - FIXED
// ============================================

function saveCompleteProfile() {
  try {
    console.log('💾 Saving profile to database...');
    
    // Check if UserDB exists
    if (typeof UserDB === 'undefined') {
      console.warn('⚠️ UserDB not available. Saving locally only.');
      return false;
    }
    
    // Get current user
    const currentUser = UserDB.getCurrentUser();
    if (!currentUser) {
      console.warn('⚠️ No user logged in. Saving locally only.');
      return false;
    }
    
    console.log('👤 Current user:', currentUser.email);
    
    // Check if student fields are available
    const isStudent = document.getElementById('studentFields') && !document.getElementById('studentFields').hidden;
    
    // Get profile image from localStorage (saved during upload)
    let profileImage = localStorage.getItem('profileImage');
    
    // Also check if there's an image in the avatar element
    const avatarImage = document.getElementById('avatarImage');
    if (avatarImage && avatarImage.src && avatarImage.src !== '' && avatarImage.style.display !== 'none') {
      profileImage = avatarImage.src;
      // Save to localStorage for backup
      localStorage.setItem('profileImage', profileImage);
    }
    
    console.log('🖼️ Profile image:', profileImage ? 'Exists (length: ' + profileImage.length + ')' : 'Not found');
    
    // Collect all data
    const profileData = {
      fullName: document.getElementById('profileName')?.value || '',
      country: document.getElementById('profileCountry')?.value || '',
      role: document.querySelector('.role-card.active')?.dataset.role || 'student',
      interests: Array.from(document.querySelectorAll('.chip.active')).map(chip => chip.textContent.trim()),
      bio: document.getElementById('bioTextarea')?.value || '',
      linkedin: document.getElementById('linkedin')?.value || '',
      github: document.getElementById('github')?.value || '',
      website: document.getElementById('website')?.value || '',
      twitter: document.getElementById('twitter')?.value || '',
      profileImage: profileImage || null  // Save the image
    };

    // Add academic details based on role
    if (isStudent) {
      profileData.educationLevel = document.getElementById('educationLevel')?.value || '';
      profileData.university = document.getElementById('university')?.value || '';
      profileData.semester = document.getElementById('semester')?.value || '';
      profileData.skills = document.getElementById('skills')?.value || '';
    } else {
      profileData.department = document.getElementById('department')?.value || '';
      profileData.subject = document.getElementById('subject')?.value || '';
      profileData.experience = document.getElementById('experience')?.value || '';
      profileData.research = document.getElementById('research')?.value || '';
    }

    console.log('📝 Profile data collected:', {
      ...profileData,
      profileImage: profileData.profileImage ? 'Exists (length: ' + profileData.profileImage.length + ')' : 'Not found'
    });

    // Update user in database
    const result = UserDB.updateUser(currentUser.id, profileData);
    
    if (result.success) {
      console.log('✅ Profile saved to database:', result.user);
      console.log('🖼️ Profile image saved:', result.user.profileImage ? 'Yes' : 'No');
      
      // Also save to localStorage for backup
      localStorage.setItem('profileData', JSON.stringify(profileData));
      localStorage.setItem(`profile_${currentUser.id}`, JSON.stringify(profileData));
      
      // Update session with new data
      const updatedUser = UserDB.getCurrentUserFull();
      if (updatedUser) {
        UserDB.setCurrentUser(updatedUser);
        console.log('🖼️ Session updated with profile image:', updatedUser.profileImage ? 'Yes' : 'No');
      }
      
      // Auto-request verification if profile is complete
      const fullUser = UserDB.getCurrentUserFull();
      if (fullUser && UserDB.isProfileComplete(fullUser)) {
        const verificationResult = UserDB.requestVerification(currentUser.id);
        if (verificationResult.success) {
          console.log('✅ Auto-verification requested');
        } else {
          console.log('⚠️ Auto-verification skipped:', verificationResult.message);
        }
      }
      
      return true;
    } else {
      console.error('❌ Failed to save profile:', result.message);
      return false;
    }
  } catch (e) {
    console.error('❌ Error saving profile:', e);
    return false;
  }
}

  // ============================================
  // TOAST SYSTEM
  // ============================================
  
  function showToast(message, type = 'info') {
    const existing = document.querySelector('.sj-toast-container');
    if (existing) existing.remove();
    
    const container = document.createElement('div');
    container.className = 'sj-toast-container';
    container.style.cssText = `
      position: fixed;
      bottom: 30px;
      right: 30px;
      z-index: 10000;
      max-width: 420px;
    `;
    
    const toast = document.createElement('div');
    toast.className = 'sj-toast';
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
      border-left: 4px solid ${type === 'success' ? '#22C55E' : type === 'warning' ? '#F59E0B' : '#2563EB'};
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
      <button style="background:none;border:none;color:rgba(255,255,255,0.5);font-size:20px;cursor:pointer;padding:0 4px;margin-left:auto;" onclick="this.closest('.sj-toast').style.transform='translateX(80%) scale(0.8)'; this.closest('.sj-toast').style.opacity='0'; setTimeout(() => this.closest('.sj-toast-container').remove(), 400);">×</button>
    `;
    
    container.appendChild(toast);
    document.body.appendChild(container);
    
    setTimeout(() => {
      toast.style.transform = 'translateX(0) scale(1)';
      toast.style.opacity = '1';
    }, 10);
    
    setTimeout(() => {
      if (container.parentElement) {
        toast.style.transform = 'translateX(80%) scale(0.8)';
        toast.style.opacity = '0';
        setTimeout(() => container.remove(), 400);
      }
    }, 4000);
  }
  
  // ============================================
  // LOAD SAVED DATA
  // ============================================
  
  function loadSavedData() {
    try {
      // Try to load from localStorage first
      const saved = localStorage.getItem('profileData');
      if (saved) {
        const data = JSON.parse(saved);
        console.log('📂 Loading saved data from localStorage');
        
        if (data.name) document.getElementById('profileName').value = data.name;
        if (data.country) document.getElementById('profileCountry').value = data.country;
        if (data.role) {
          const roleCard = document.querySelector(`.role-card[data-role="${data.role}"]`);
          if (roleCard) roleCard.click();
        }
        if (data.interests) {
          document.querySelectorAll('.chip').forEach(chip => {
            const chipText = chip.textContent.trim();
            if (data.interests.includes(chipText)) {
              chip.classList.add('active');
            }
          });
        }
        if (data.bio) {
          const bioEl = document.getElementById('bioTextarea');
          if (bioEl) bioEl.value = data.bio;
        }
        if (data.linkedin) {
          const el = document.getElementById('linkedin');
          if (el) el.value = data.linkedin;
        }
        if (data.github) {
          const el = document.getElementById('github');
          if (el) el.value = data.github;
        }
        if (data.website) {
          const el = document.getElementById('website');
          if (el) el.value = data.website;
        }
        if (data.twitter) {
          const el = document.getElementById('twitter');
          if (el) el.value = data.twitter;
        }
        if (data.educationLevel) {
          const el = document.getElementById('educationLevel');
          if (el) el.value = data.educationLevel;
        }
        if (data.university) {
          const el = document.getElementById('university');
          if (el) el.value = data.university;
        }
        if (data.semester) {
          const el = document.getElementById('semester');
          if (el) el.value = data.semester;
        }
        if (data.skills) {
          const el = document.getElementById('skills');
          if (el) el.value = data.skills;
        }
      }
      
      // If UserDB is available, try to load from there too
      if (typeof UserDB !== 'undefined') {
        const currentUser = UserDB.getCurrentUserFull();
        if (currentUser && currentUser.fullName) {
          console.log('📂 Loading user data from database');
          // Only override if fields are empty
          if (!document.getElementById('profileName').value) {
            document.getElementById('profileName').value = currentUser.fullName || '';
          }
          if (!document.getElementById('profileCountry').value && currentUser.country) {
            document.getElementById('profileCountry').value = currentUser.country;
          }
        }
      }
    } catch (e) {
      console.warn('Could not load saved data:', e);
    }
  }
  
  // ============================================
  // INITIALIZE
  // ============================================
  
  loadSavedData();
  goToStep(1);
  
  setTimeout(validateStep1, 300);
  setTimeout(() => {
    validateStep2();
    validateStep3();
  }, 500);
  
  console.log('✅ Profile Setup Wizard Ready!');
  console.log('📝 Instructions:');
  console.log('  1. Fill in your name and country in Step 1');
  console.log('  2. Select a role in Step 2');
  console.log('  3. In Step 3, fill ALL fields and click chips to select interests');
  console.log('  4. In Step 4, write a bio (minimum 20 characters) - social links are optional');
  console.log('  5. Click "Finish" when complete');
});

console.log('🔐 Profile Setup Wizard Loaded!');