// ============================================
// SCHOLAR JUNCTION - USER DATABASE SYSTEM
// Complete with Verification System & Reset Password
// ============================================

class UserDatabase {
  constructor() {
    this.storageKey = 'sj_users_db';
    this.currentUserKey = 'sj_current_user';
    this.users = [];
    this.loadUsers();
  }

  // ============================================
  // DATABASE OPERATIONS
  // ============================================

  loadUsers() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        this.users = JSON.parse(stored);
        console.log('📂 Users loaded:', this.users.length);
        return true;
      }
    } catch (e) {
      console.warn('Could not load users from localStorage');
    }
    return false;
  }

  saveUsers() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.users));
      console.log('💾 Users saved:', this.users.length);
      return true;
    } catch (e) {
      console.warn('Could not save users to localStorage');
      return false;
    }
  }

  // ============================================
  // FIND METHODS
  // ============================================

  findByEmail(email) {
    if (!email) return null;
    const searchEmail = email.toLowerCase().trim();
    return this.users.find(u => u.email.toLowerCase().trim() === searchEmail);
  }

  findById(id) {
    return this.users.find(u => u.id === id);
  }

  // ============================================
  // PROFILE COMPLETE CHECK
  // ============================================

  isProfileComplete(user) {
    if (!user) return false;
    const hasBio = user.bio && user.bio.length >= 20;
    const hasInterests = user.interests && user.interests.length > 0;
    const hasCountry = user.country && user.country !== '';
    return hasBio && hasInterests && hasCountry;
  }

  // ============================================
  // HASHING & VALIDATION
  // ============================================

  hashPassword(password) {
    if (!password) return '';
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return 'hash_' + Math.abs(hash).toString(16) + '_len_' + password.length;
  }

  verifyPassword(password, hashedPassword) {
    if (!password || !hashedPassword) return false;
    return this.hashPassword(password) === hashedPassword;
  }

  generateToken() {
    return 'token_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  validateEmail(email) {
    if (!email) return false;
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email.trim());
  }

  validatePassword(password) {
    return password && password.length >= 6 && /[a-zA-Z]/.test(password) && /\d/.test(password);
  }

  // ============================================
  // CREATE USER - ADDED RESET TOKEN FIELDS
  // ============================================

  createUser(userData) {
    const existing = this.findByEmail(userData.email);
    if (existing) {
      return { 
        success: false, 
        message: 'User with this email already exists',
        code: 'DUPLICATE_EMAIL'
      };
    }

    const newUser = {
      id: 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      fullName: userData.fullName || '',
      email: userData.email.toLowerCase().trim(),
      password: this.hashPassword(userData.password),
      country: userData.country || '',
      role: userData.role || 'student',
      interests: userData.interests || [],
      bio: userData.bio || '',
      profileImage: userData.profileImage || null,
      socialLinks: {
        linkedin: userData.linkedin || '',
        github: userData.github || '',
        website: userData.website || '',
        twitter: userData.twitter || ''
      },
      academicDetails: {
        educationLevel: userData.educationLevel || '',
        university: userData.university || '',
        semester: userData.semester || '',
        skills: userData.skills || '',
        department: userData.department || '',
        subject: userData.subject || '',
        experience: userData.experience || '',
        research: userData.research || ''
      },
      createdAt: new Date().toISOString(),
      lastLogin: null,
      isVerified: false,
      verificationStatus: 'none', // 'none', 'pending', 'approved', 'rejected'
      verificationRequestedAt: null,
      verifiedAt: null,
      verifiedBy: null,
      verificationToken: this.generateToken(),
      status: 'active',
      loginAttempts: 0,
      lockedUntil: null,
      // ===== RESET PASSWORD FIELDS =====
      resetToken: null,
      resetTokenExpiry: null
    };

    this.users.push(newUser);
    this.saveUsers();
    
    return { 
      success: true, 
      user: newUser,
      message: 'User created successfully'
    };
  }

  // ============================================
  // VERIFICATION METHODS
  // ============================================

  requestVerification(userId) {
    const user = this.findById(userId);
    if (!user) {
      return { success: false, message: 'User not found' };
    }

    if (user.verificationStatus === 'approved') {
      return { success: false, message: 'Profile already verified' };
    }

    if (user.verificationStatus === 'pending') {
      return { success: false, message: 'Verification already requested. Please wait for admin review.' };
    }

    // Check if profile is complete using the method
    if (!this.isProfileComplete(user)) {
      return { 
        success: false, 
        message: 'Please complete your profile first (bio min 20 chars, interests, and country)' 
      };
    }

    user.verificationStatus = 'pending';
    user.verificationRequestedAt = new Date().toISOString();
    this.saveUsers();

    console.log('✅ Verification requested for:', user.email);
    return { 
      success: true, 
      message: 'Verification requested successfully. Please wait for admin review (30-60 min).',
      status: 'pending'
    };
  }

  approveVerification(userId, adminId) {
    const user = this.findById(userId);
    if (!user) {
      return { success: false, message: 'User not found' };
    }

    user.isVerified = true;
    user.verificationStatus = 'approved';
    user.verifiedAt = new Date().toISOString();
    user.verifiedBy = adminId;
    this.saveUsers();

    console.log('✅ Verification approved for:', user.email);
    return { 
      success: true, 
      message: 'Profile verified successfully',
      user: user
    };
  }

  rejectVerification(userId, reason = '') {
    const user = this.findById(userId);
    if (!user) {
      return { success: false, message: 'User not found' };
    }

    user.verificationStatus = 'rejected';
    user.verificationRejectionReason = reason;
    this.saveUsers();

    console.log('❌ Verification rejected for:', user.email);
    return { 
      success: true, 
      message: 'Verification rejected',
      user: user
    };
  }

  getVerificationStatus(userId) {
    const user = this.findById(userId);
    if (!user) {
      return { success: false, message: 'User not found' };
    }

    return {
      success: true,
      status: user.verificationStatus || 'none',
      isVerified: user.isVerified || false,
      requestedAt: user.verificationRequestedAt || null,
      verifiedAt: user.verifiedAt || null,
      isProfileComplete: this.isProfileComplete(user)
    };
  }

  // ============================================
  // RESET PASSWORD METHODS - NEW
  // ============================================

  generateResetToken(email) {
    const user = this.findByEmail(email);
    if (!user) {
      return { success: false, message: 'User not found' };
    }
    
    const token = this.generateToken();
    user.resetToken = token;
    user.resetTokenExpiry = new Date(Date.now() + 3600000).toISOString(); // 1 hour expiry
    this.saveUsers();
    
    console.log(`🔑 Reset token generated for ${email}: ${token}`);
    
    return { 
      success: true, 
      token: token,
      message: 'Reset token generated successfully'
    };
  }

  validateResetToken(email, token) {
    const user = this.findByEmail(email);
    if (!user) {
      return { success: false, message: 'User not found' };
    }
    
    if (!user.resetToken || user.resetToken !== token) {
      return { success: false, message: 'Invalid reset token' };
    }
    
    if (user.resetTokenExpiry) {
      const expiry = new Date(user.resetTokenExpiry);
      if (expiry < new Date()) {
        return { success: false, message: 'Reset token has expired' };
      }
    }
    
    return { success: true, message: 'Token is valid' };
  }

  resetPassword(email, token, newPassword) {
    const user = this.findByEmail(email);
    if (!user) {
      return { success: false, message: 'User not found' };
    }
    
    // Validate token
    const validation = this.validateResetToken(email, token);
    if (!validation.success) {
      return validation;
    }
    
    // Update password
    user.password = this.hashPassword(newPassword);
    user.resetToken = null;
    user.resetTokenExpiry = null;
    this.saveUsers();
    
    return { success: true, message: 'Password reset successfully' };
  }

  // ============================================
  // LOGIN & REGISTER
  // ============================================

  loginUser(email, password) {
    const user = this.findByEmail(email);
    
    if (!user) {
      return { 
        success: false, 
        message: 'No account found with this email',
        code: 'USER_NOT_FOUND'
      };
    }

    if (user.lockedUntil && new Date(user.lockedUntil) > new Date()) {
      const remaining = Math.ceil((new Date(user.lockedUntil) - new Date()) / 1000 / 60);
      return {
        success: false,
        message: `Account locked. Try again in ${remaining} minutes`,
        code: 'ACCOUNT_LOCKED'
      };
    }

    if (!this.verifyPassword(password, user.password)) {
      user.loginAttempts = (user.loginAttempts || 0) + 1;
      
      if (user.loginAttempts >= 5) {
        user.lockedUntil = new Date(Date.now() + 30 * 60 * 1000).toISOString();
        this.saveUsers();
        return {
          success: false,
          message: 'Account locked due to multiple failed attempts. Try again in 30 minutes.',
          code: 'ACCOUNT_LOCKED'
        };
      }
      
      this.saveUsers();
      return {
        success: false,
        message: `Incorrect password. ${5 - user.loginAttempts} attempts remaining`,
        code: 'WRONG_PASSWORD'
      };
    }

    user.loginAttempts = 0;
    user.lockedUntil = null;
    user.lastLogin = new Date().toISOString();
    this.saveUsers();

    this.setCurrentUser(user);

    return {
      success: true,
      user: user,
      message: 'Login successful'
    };
  }

  registerUser(userData) {
    if (userData.email) {
      userData.email = userData.email.trim();
    }
    
    if (!this.validateEmail(userData.email)) {
      return {
        success: false,
        message: 'Please enter a valid email address',
        code: 'INVALID_EMAIL'
      };
    }

    if (!this.validatePassword(userData.password)) {
      return {
        success: false,
        message: 'Password must be at least 6 characters and contain letters and numbers',
        code: 'INVALID_PASSWORD'
      };
    }

    const existing = this.findByEmail(userData.email);
    if (existing) {
      return {
        success: false,
        message: 'User with this email already exists',
        code: 'DUPLICATE_EMAIL'
      };
    }

    return this.createUser(userData);
  }

  // ============================================
  // SESSION MANAGEMENT
  // ============================================

  setCurrentUser(user) {
    try {
      const sessionData = {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        country: user.country,
        profileImage: user.profileImage,
        isVerified: user.isVerified,
        verificationStatus: user.verificationStatus || 'none',
        loginTime: new Date().toISOString()
      };
      localStorage.setItem(this.currentUserKey, JSON.stringify(sessionData));
    } catch (e) {
      console.warn('Could not save session');
    }
  }

  getCurrentUser() {
    try {
      const data = localStorage.getItem(this.currentUserKey);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  }

  getCurrentUserFull() {
    const session = this.getCurrentUser();
    if (!session) return null;
    return this.findById(session.id);
  }

  isLoggedIn() {
    return this.getCurrentUser() !== null;
  }

  logoutUser() {
    localStorage.removeItem(this.currentUserKey);
    return { success: true, message: 'Logged out successfully' };
  }

  // ============================================
  // UPDATE USER
  // ============================================

  updateUser(id, updates) {
    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) {
      return { success: false, message: 'User not found' };
    }

    const currentUser = this.users[index];
    
    // Basic fields
    if (updates.fullName !== undefined) currentUser.fullName = updates.fullName;
    if (updates.country !== undefined) currentUser.country = updates.country;
    if (updates.role !== undefined) currentUser.role = updates.role;
    if (updates.interests !== undefined) currentUser.interests = updates.interests;
    if (updates.bio !== undefined) currentUser.bio = updates.bio;
    if (updates.profileImage !== undefined) currentUser.profileImage = updates.profileImage;
    
    // Social links
    if (updates.linkedin !== undefined) currentUser.socialLinks.linkedin = updates.linkedin;
    if (updates.github !== undefined) currentUser.socialLinks.github = updates.github;
    if (updates.website !== undefined) currentUser.socialLinks.website = updates.website;
    if (updates.twitter !== undefined) currentUser.socialLinks.twitter = updates.twitter;
    
    // Academic details
    if (updates.educationLevel !== undefined) currentUser.academicDetails.educationLevel = updates.educationLevel;
    if (updates.university !== undefined) currentUser.academicDetails.university = updates.university;
    if (updates.semester !== undefined) currentUser.academicDetails.semester = updates.semester;
    if (updates.skills !== undefined) currentUser.academicDetails.skills = updates.skills;
    if (updates.department !== undefined) currentUser.academicDetails.department = updates.department;
    if (updates.subject !== undefined) currentUser.academicDetails.subject = updates.subject;
    if (updates.experience !== undefined) currentUser.academicDetails.experience = updates.experience;
    if (updates.research !== undefined) currentUser.academicDetails.research = updates.research;

    this.saveUsers();
    return { success: true, user: currentUser };
  }

  // ============================================
  // DELETE USER
  // ============================================

  deleteUser(id) {
    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) {
      return { success: false, message: 'User not found' };
    }

    const deletedUser = this.users[index];
    this.users.splice(index, 1);
    this.saveUsers();
    
    const currentUser = this.getCurrentUser();
    if (currentUser && currentUser.id === id) {
      this.logoutUser();
    }
    
    return { success: true, message: 'User deleted successfully', user: deletedUser };
  }

  // ============================================
  // ADMIN FUNCTIONS
  // ============================================

  getAllUsers() {
    return this.users.map(u => ({
      id: u.id,
      fullName: u.fullName,
      email: u.email,
      role: u.role,
      country: u.country || 'Not set',
      isVerified: u.isVerified || false,
      verificationStatus: u.verificationStatus || 'none',
      verificationRequestedAt: u.verificationRequestedAt || null,
      verifiedAt: u.verifiedAt || null,
      status: u.status || 'active',
      createdAt: u.createdAt,
      lastLogin: u.lastLogin || 'Never',
      profileImage: u.profileImage || null,
      interests: u.interests || [],
      bio: u.bio || '',
      isProfileComplete: this.isProfileComplete(u)
    }));
  }

  getPendingVerifications() {
    return this.users.filter(u => u.verificationStatus === 'pending');
  }

  getStats() {
    const total = this.users.length;
    const verified = this.users.filter(u => u.isVerified).length;
    const pending = this.users.filter(u => u.verificationStatus === 'pending').length;
    const students = this.users.filter(u => u.role === 'student').length;
    const teachers = this.users.filter(u => u.role === 'teacher').length;
    const active = this.users.filter(u => u.status === 'active').length;
    return { total, verified, pending, students, teachers, active };
  }

  getUserDetails(id) {
    const user = this.findById(id);
    if (!user) return null;
    
    return {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      country: user.country || 'Not set',
      role: user.role || 'student',
      interests: user.interests || [],
      bio: user.bio || '',
      profileImage: user.profileImage || null,
      isVerified: user.isVerified || false,
      verificationStatus: user.verificationStatus || 'none',
      verificationRequestedAt: user.verificationRequestedAt || null,
      verifiedAt: user.verifiedAt || null,
      status: user.status || 'active',
      createdAt: user.createdAt,
      lastLogin: user.lastLogin || 'Never',
      socialLinks: user.socialLinks || { linkedin: '', github: '', website: '', twitter: '' },
      academicDetails: user.academicDetails || {},
      loginAttempts: user.loginAttempts || 0,
      isProfileComplete: this.isProfileComplete(user)
    };
  }

  suspendUser(email) {
    const user = this.findByEmail(email);
    if (!user) {
      return { success: false, message: 'User not found' };
    }
    user.status = 'suspended';
    this.saveUsers();
    return { success: true, message: 'User suspended successfully' };
  }

  activateUser(email) {
    const user = this.findByEmail(email);
    if (!user) {
      return { success: false, message: 'User not found' };
    }
    user.status = 'active';
    this.saveUsers();
    return { success: true, message: 'User activated successfully' };
  }

  // ============================================
  // SYNC PROFILE DATA
  // ============================================

  syncProfileData() {
    try {
      const currentUser = this.getCurrentUser();
      if (!currentUser) return false;

      const profileData = localStorage.getItem('profileData');
      if (!profileData) return false;

      const data = JSON.parse(profileData);
      const result = this.updateUser(currentUser.id, data);
      
      if (result.success) {
        console.log('✅ Profile data synced');
        return true;
      }
      return false;
    } catch (e) {
      console.error('❌ Error syncing profile:', e);
      return false;
    }
  }

  // ============================================
  // INITIALIZE WITH DEMO USERS
  // ============================================

  initialize() {
    if (this.users.length === 0) {
      console.log('📦 Initializing database with demo users...');
      
      const demoUsers = [
        {
          fullName: 'Aarav Sharma',
          email: 'aarav@university.edu',
          password: 'SecurePass123!',
          country: 'Nepal',
          role: 'student',
          interests: ['AI', 'Machine Learning', 'Python'],
          bio: 'CS student passionate about AI and open-source. I love building things that make learning easier.',
          isVerified: true,
          verificationStatus: 'approved'
        },
        {
          fullName: 'Sarah Johnson',
          email: 'sarah@mit.edu',
          password: 'Research2026!',
          country: 'USA',
          role: 'teacher',
          interests: ['Cloud Computing', 'Distributed Systems'],
          bio: 'PhD researcher in distributed systems. Published 10+ papers in top conferences.',
          isVerified: true,
          verificationStatus: 'approved'
        }
      ];

      demoUsers.forEach(user => {
        this.createUser(user);
        const created = this.findByEmail(user.email);
        if (created) {
          created.isVerified = user.isVerified;
          created.verificationStatus = user.verificationStatus;
          this.saveUsers();
        }
      });

      console.log('✅ Demo users created!');
      console.log('📝 Demo Login Credentials:');
      console.log('  👤 aarav@university.edu / SecurePass123!');
      console.log('  👤 sarah@mit.edu / Research2026!');
    }
  }
}

// ============================================
// INITIALIZE
// ============================================

const UserDB = new UserDatabase();
UserDB.initialize();
window.UserDB = UserDB;

console.log(`🗄️ User Database System initialized`);
console.log(`👥 Total users: ${UserDB.users.length}`);
console.log('✅ Ready!');