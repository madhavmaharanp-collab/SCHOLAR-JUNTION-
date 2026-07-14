// ============================================
// SCHOLAR JUNCTION - LOGIN SYSTEM (FIXED)
// ALWAYS GO TO DASHBOARD AFTER LOGIN
// ============================================

console.log('🔐 Login System Loading...');
console.log('UserDB available:', typeof UserDB !== 'undefined');

document.addEventListener('DOMContentLoaded', function() {
  console.log('🔐 Login System Initializing...');
  
  // Check if UserDB is available
  if (typeof UserDB === 'undefined') {
    console.error('❌ UserDB is not defined!');
    showToast('System error. Please refresh the page.', 'error');
    return;
  }
  
  // ===== ALWAYS SHOW LOGIN FORM =====
  // Setup all forms
  setupLoginForm();
  setupRegisterForm();
  setupForgotForm();
  setupSocialLogin();
  setupTabSystem();
  setupPasswordToggle();
  setupPasswordStrength();
  
  console.log('✅ Login System Ready!');
});

// ============================================
// LOGIN FORM
// ============================================

function setupLoginForm() {
  const form = document.getElementById('loginForm');
  if (!form) {
    console.warn('Login form not found');
    return;
  }

  // Reset the login button to default state
  const loginBtn = document.getElementById('loginBtn');
  if (loginBtn) {
    loginBtn.innerHTML = `
      <span class="btn-text">Sign in →</span>
      <span class="btn-loader" style="display:none;">
        <span class="spinner"></span>
      </span>
    `;
    loginBtn.style.background = '';
    loginBtn.className = 'btn btn-primary';
    loginBtn.style.width = '100%';
  }

  // Remove any existing listeners
  form.removeEventListener('submit', handleLoginSubmit);
  form.addEventListener('submit', handleLoginSubmit);
}

function handleLoginSubmit(event) {
  event.preventDefault();

  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  const btn = document.getElementById('loginBtn');

  console.log('🔐 Login attempt:', { email, passwordProvided: password ? 'yes' : 'no' });

  // Validate
  if (!email || !password) {
    showToast('Please fill in all fields', 'warning');
    return;
  }

  if (!UserDB.validateEmail(email)) {
    showToast('Please enter a valid email address', 'error');
    return;
  }

  // Show loading
  btn.classList.add('loading');
  btn.disabled = true;

  // Attempt login
  setTimeout(() => {
    const result = UserDB.loginUser(email, password);
    console.log('🔐 Login result:', result);

    btn.classList.remove('loading');
    btn.disabled = false;

    if (result.success) {
      showToast(`Welcome back, ${result.user.fullName}! 🎉`, 'success');
      
      // ===== ALWAYS GO TO DASHBOARD =====
      // No profile check - just go to dashboard
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 1000);
      
    } else {
      showToast(result.message, 'error');
      
      // Shake animation
      const authCard = document.querySelector('.auth-card');
      if (authCard) {
        authCard.style.animation = 'shake 0.5s ease';
        setTimeout(() => {
          authCard.style.animation = '';
        }, 500);
      }

      // Highlight fields
      if (result.code === 'USER_NOT_FOUND') {
        document.getElementById('loginEmail').focus();
        document.getElementById('loginEmail').classList.add('error');
        setTimeout(() => {
          document.getElementById('loginEmail').classList.remove('error');
        }, 3000);
      } else if (result.code === 'WRONG_PASSWORD' || result.code === 'ACCOUNT_LOCKED') {
        document.getElementById('loginPassword').focus();
        document.getElementById('loginPassword').classList.add('error');
        document.getElementById('loginPassword').value = '';
        setTimeout(() => {
          document.getElementById('loginPassword').classList.remove('error');
        }, 3000);
      }
    }
  }, 1000);
}

// ============================================
// REGISTER FORM
// ============================================

function setupRegisterForm() {
  const form = document.getElementById('registerForm');
  if (!form) {
    console.warn('Register form not found');
    return;
  }

  form.removeEventListener('submit', handleRegisterSubmit);
  form.addEventListener('submit', handleRegisterSubmit);
}

function handleRegisterSubmit(event) {
  event.preventDefault();

  const fullName = document.getElementById('registerName').value.trim();
  const email = document.getElementById('registerEmail').value.trim();
  const password = document.getElementById('registerPassword').value;
  const btn = document.getElementById('registerBtn');

  // Validate
  if (!fullName || fullName.length < 2) {
    showToast('Please enter your full name (min 2 characters)', 'warning');
    document.getElementById('registerName').focus();
    return;
  }

  if (!email || !UserDB.validateEmail(email)) {
    showToast('Please enter a valid email address', 'error');
    document.getElementById('registerEmail').focus();
    return;
  }

  if (!password || password.length < 6) {
    showToast('Password must be at least 6 characters', 'warning');
    document.getElementById('registerPassword').focus();
    return;
  }

  if (!/[a-zA-Z]/.test(password) || !/\d/.test(password)) {
    showToast('Password must contain letters and numbers', 'warning');
    document.getElementById('registerPassword').focus();
    return;
  }

  btn.classList.add('loading');
  btn.disabled = true;

  setTimeout(() => {
    const userData = {
      fullName: fullName,
      email: email,
      password: password,
      country: '',
      role: 'student',
      interests: [],
      bio: '',
      profileImage: null
    };

    const result = UserDB.registerUser(userData);

    btn.classList.remove('loading');
    btn.disabled = false;

    if (result.success) {
      UserDB.resendVerification(email);
      showToast('Account created! Please verify your email.', 'success');
      
      // Clear form
      document.getElementById('registerName').value = '';
      document.getElementById('registerEmail').value = '';
      document.getElementById('registerPassword').value = '';
      
      // Reset password strength
      const fill = document.querySelector('.strength-fill');
      const text = document.querySelector('.strength-text');
      if (fill) fill.style.width = '0%';
      if (text) text.textContent = 'Password strength: Weak';
      
      // Switch to login tab
      setTimeout(() => {
        const loginTab = document.querySelector('[data-tab="login"]');
        if (loginTab) {
          loginTab.click();
          document.getElementById('loginEmail').value = email;
          showToast('Please login after verifying your email', 'info');
        }
      }, 2000);
    } else {
      showToast(result.message, 'error');

      if (result.code === 'DUPLICATE_EMAIL') {
        setTimeout(() => {
          const loginTab = document.querySelector('[data-tab="login"]');
          if (loginTab) {
            loginTab.click();
            document.getElementById('loginEmail').value = email;
            showToast('Try logging in with your existing account', 'info');
          }
        }, 500);
      }
    }
  }, 1500);
}

// ============================================
// FORGOT PASSWORD FORM - UPDATED
// ============================================

function setupForgotForm() {
  const form = document.getElementById('forgotForm');
  if (!form) return;

  form.removeEventListener('submit', handleForgotSubmit);
  form.addEventListener('submit', handleForgotSubmit);
  
  // Also handle the forgot link click
  document.querySelector('.forgot-link')?.addEventListener('click', function(e) {
    e.preventDefault();
    const forgotTab = document.querySelector('[data-tab="forgot"]');
    if (forgotTab) {
      forgotTab.click();
      // Pre-fill email if available
      const emailInput = document.getElementById('loginEmail');
      if (emailInput && emailInput.value) {
        document.getElementById('forgotEmail').value = emailInput.value;
      }
    }
  });
}

function handleForgotSubmit(event) {
  event.preventDefault();

  const email = document.getElementById('forgotEmail').value.trim();
  const btn = document.getElementById('forgotBtn');

  if (!email || !UserDB.validateEmail(email)) {
    showToast('Please enter a valid email address', 'error');
    document.getElementById('forgotEmail').focus();
    return;
  }

  btn.classList.add('loading');
  btn.disabled = true;

  setTimeout(() => {
    const user = UserDB.findByEmail(email);

    btn.classList.remove('loading');
    btn.disabled = false;

    if (user) {
      // Generate reset token
      const token = UserDB.generateToken();
      user.resetToken = token;
      user.resetTokenExpiry = new Date(Date.now() + 3600000).toISOString(); // 1 hour expiry
      UserDB.saveUsers();

      // Store email for reset
      localStorage.setItem('resetEmail', email);
      localStorage.setItem('resetToken', token);

      // Build reset link
      const resetLink = `${window.location.origin}/pages/reset-password.html?token=${token}&email=${encodeURIComponent(email)}`;
      
      console.log(`📧 Password reset link sent to ${email}`);
      console.log(`🔑 Reset token: ${token}`);
      console.log(`🔗 Reset link: ${resetLink}`);
      
      // Show success message with the link
      showToastWithLink(
        `✅ Password reset link sent to ${email}`,
        'success',
        resetLink
      );
      
      document.getElementById('forgotEmail').value = '';

      setTimeout(() => {
        const loginTab = document.querySelector('[data-tab="login"]');
        if (loginTab) loginTab.click();
        showToast('📧 Check your email or click the link below to reset your password', 'info');
      }, 2000);
    } else {
      showToast('❌ No account found with this email address', 'error');
      document.getElementById('forgotEmail').focus();
      document.getElementById('forgotEmail').classList.add('error');
      setTimeout(() => {
        document.getElementById('forgotEmail').classList.remove('error');
      }, 3000);
    }
  }, 1500);
}

// ============================================
// TOAST WITH LINK - NEW FUNCTION
// ============================================

function showToastWithLink(message, type = 'info', link = '#') {
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
    flex-direction: column;
    gap: 8px;
    font-size: 14px;
    border-left: 4px solid ${colors[type] || '#2563EB'};
    transform: translateX(120%) scale(0.9);
    opacity: 0;
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    max-width: 420px;
  `;

  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  };

  toast.innerHTML = `
    <div style="display:flex; align-items:center; gap:12px;">
      <span style="font-size:20px;flex-shrink:0;">${icons[type] || icons.info}</span>
      <span>${message}</span>
      <button style="background:none;border:none;color:rgba(255,255,255,0.5);font-size:20px;cursor:pointer;padding:0 4px;margin-left:auto;" onclick="this.closest('.toast').style.transform='translateX(80%) scale(0.8)'; this.closest('.toast').style.opacity='0'; setTimeout(() => this.closest('.toast').remove(), 400);">×</button>
    </div>
    <div style="display:flex; gap:8px; flex-wrap:wrap; margin-top:4px;">
      <a href="${link}" target="_blank" style="color:#60A5FA; text-decoration:underline; font-size:13px; word-break:break-all;">
        🔗 Click here to reset password
      </a>
    </div>
    <div style="font-size:11px; color:#94a3b8; margin-top:4px;">
      ⏰ Link expires in 1 hour
    </div>
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
  }, 8000);
}

// ============================================
// SOCIAL LOGIN
// ============================================

function setupSocialLogin() {
  document.querySelectorAll('.social-btn').forEach(btn => {
    btn.removeEventListener('click', handleSocialClick);
    btn.addEventListener('click', handleSocialClick);
  });
}

function handleSocialClick(e) {
  const provider = this.getAttribute('data-provider');
  handleSocialLogin(provider);
}

function handleSocialLogin(provider) {
  showToast(`Connecting to ${provider}...`, 'info');

  setTimeout(() => {
    const socialEmail = `${provider.toLowerCase()}.user@example.com`;
    let user = UserDB.findByEmail(socialEmail);

    if (!user) {
      const userData = {
        fullName: `${provider} User`,
        email: socialEmail,
        password: 'SocialLogin@' + Math.random().toString(36).substring(2, 8),
        country: 'Global',
        role: 'student',
        interests: ['Technology'],
        bio: `Joined via ${provider}`,
        profileImage: null
      };

      const result = UserDB.createUser(userData);
      if (result.success) {
        user = result.user;
        UserDB.loginUser(socialEmail, userData.password);
        showToast(`Welcome! ${provider} login successful 🎉`, 'success');
        setTimeout(() => {
          window.location.href = 'dashboard.html';
        }, 1500);
      }
    } else {
      const loginResult = UserDB.loginUser(socialEmail, 'SocialLogin@' + user.password.substring(7, 13));
      if (loginResult.success) {
        showToast(`Welcome back, ${user.fullName}! 👋`, 'success');
        setTimeout(() => {
          window.location.href = 'dashboard.html';
        }, 1500);
      }
    }
  }, 1500);
}

// ============================================
// TAB SYSTEM
// ============================================

function setupTabSystem() {
  document.querySelectorAll('[data-tab]').forEach(tab => {
    tab.addEventListener('click', function() {
      const tabName = this.getAttribute('data-tab');

      document.querySelectorAll('[data-tab]').forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });

      this.classList.add('active');
      this.setAttribute('aria-selected', 'true');

      document.querySelectorAll('[data-tab-panel]').forEach(panel => {
        panel.hidden = true;
      });

      const panel = document.querySelector(`[data-tab-panel="${tabName}"]`);
      if (panel) {
        panel.hidden = false;
        panel.style.animation = 'none';
        requestAnimationFrame(() => {
          panel.style.animation = 'fadeInUp 0.5s ease forwards';
        });
      }
    });
  });

  document.querySelector('.forgot-link')?.addEventListener('click', function(e) {
    e.preventDefault();
    const forgotTab = document.querySelector('[data-tab="forgot"]');
    if (forgotTab) forgotTab.click();
  });
}

// ============================================
// PASSWORD TOGGLE
// ============================================

function setupPasswordToggle() {
  console.log('🔑 Setting up password toggles...');
  
  const toggles = document.querySelectorAll('.password-toggle');
  console.log('  Found:', toggles.length);
  
  toggles.forEach(toggle => {
    toggle.removeEventListener('click', handleToggle);
    toggle.addEventListener('click', handleToggle);
  });
}

function handleToggle(e) {
  e.preventDefault();
  e.stopPropagation();
  
  const toggle = e.currentTarget;
  const inputGroup = toggle.closest('.input-group');
  
  if (!inputGroup) {
    console.warn('Input group not found');
    return;
  }
  
  const input = inputGroup.querySelector('.input');
  if (!input) {
    console.warn('Input not found');
    return;
  }
  
  const icon = toggle.querySelector('.eye-icon');
  
  if (input.type === 'password') {
    input.type = 'text';
    if (icon) icon.textContent = '🙈';
    toggle.setAttribute('aria-label', 'Hide password');
  } else {
    input.type = 'password';
    if (icon) icon.textContent = '👁️';
    toggle.setAttribute('aria-label', 'Show password');
  }
}

// ============================================
// PASSWORD STRENGTH
// ============================================

function setupPasswordStrength() {
  const passwordInput = document.getElementById('registerPassword');
  if (!passwordInput) return;

  passwordInput.removeEventListener('input', handleStrengthCheck);
  passwordInput.addEventListener('input', handleStrengthCheck);
}

function handleStrengthCheck() {
  const strength = checkPasswordStrength(this.value);
  const fill = document.querySelector('.strength-fill');
  const text = document.querySelector('.strength-text');

  const colors = ['#EF4444', '#F59E0B', '#22C55E'];
  const labels = ['Weak', 'Medium', 'Strong'];

  if (fill) {
    const width = strength === -1 ? '0%' : `${(strength + 1) * 33.33}%`;
    fill.style.width = width;
    fill.style.background = strength === -1 ? '#e2e8f0' : colors[strength] || '#EF4444';
  }

  if (text) {
    const label = strength === -1 ? 'Enter a password' : labels[strength] || 'Weak';
    text.textContent = `Password strength: ${label}`;
    text.style.color = strength === -1 ? '#94a3b8' : colors[strength] || '#EF4444';
  }
}

function checkPasswordStrength(password) {
  if (password.length === 0) return -1;

  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  if (score <= 2) return 0;
  if (score <= 4) return 1;
  return 2;
}

// ============================================
// TOAST SYSTEM
// ============================================

function showToast(message, type = 'info', duration = 4000) {
  // Remove existing toasts
  const existingToasts = document.querySelectorAll('.toast');
  existingToasts.forEach(t => t.remove());

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
  toast.className = 'toast';
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
// SHAKE ANIMATION
// ============================================

const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    10% { transform: translateX(-10px); }
    20% { transform: translateX(10px); }
    30% { transform: translateX(-10px); }
    40% { transform: translateX(10px); }
    50% { transform: translateX(-5px); }
    60% { transform: translateX(5px); }
    70% { transform: translateX(-5px); }
    80% { transform: translateX(5px); }
    90% { transform: translateX(0); }
  }
`;
document.head.appendChild(shakeStyle);

console.log('🔐 Login System Ready!');
console.log('📝 Demo Accounts:');
console.log('  👤 aarav@university.edu / SecurePass123!');
console.log('  👤 sarah@mit.edu / Research2026!');
console.log('💡 After login, you will go directly to Dashboard');