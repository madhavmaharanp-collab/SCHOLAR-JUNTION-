// ============================================
// MESSAGES - Complete JavaScript
// ============================================

// ============================================
// STATE
// ============================================

let conversations = [];
let currentConversationId = null;
let messages = {};
let currentUser = null;
let allUsers = [];

// ============================================
// INITIALIZE
// ============================================

document.addEventListener('DOMContentLoaded', function() {
  console.log('💬 Messages Loading...');
  
  updateHeaderAvatar();
  loadConversations();
  loadMessages();
  renderConversations();
  setupMobileSidebar();
  
  // Auto-select first conversation
  if (conversations.length > 0) {
    selectConversation(conversations[0].id);
  }
  
  console.log('💬 Messages Ready!');
  console.log('📊 ' + conversations.length + ' conversations loaded');
});

// ============================================
// LOAD DATA
// ============================================

function loadConversations() {
  const stored = localStorage.getItem('sj_conversations');
  if (stored) {
    conversations = JSON.parse(stored);
  } else {
    // Create default conversations
    conversations = getDefaultConversations();
    saveConversations();
  }
}

function saveConversations() {
  localStorage.setItem('sj_conversations', JSON.stringify(conversations));
}

function loadMessages() {
  const stored = localStorage.getItem('sj_messages');
  if (stored) {
    messages = JSON.parse(stored);
  } else {
    messages = getDefaultMessages();
    saveMessages();
  }
}

function saveMessages() {
  localStorage.setItem('sj_messages', JSON.stringify(messages));
}

// ============================================
// GET DEFAULT DATA
// ============================================

function getDefaultConversations() {
  return [
    {
      id: 1,
      name: 'Maya Research Group',
      type: 'group',
      participants: ['Maya Rana', 'Anita P.', 'You'],
      online: ['Maya Rana', 'Anita P.'],
      lastMessage: 'PR merged ✅',
      lastMessageTime: new Date(Date.now() - 300000).toISOString(),
      unread: 2,
      avatar: '👥'
    },
    {
      id: 2,
      name: 'Dr. Karki',
      type: 'direct',
      participants: ['Dr. Karki', 'You'],
      online: [],
      lastMessage: 'See you at expo…',
      lastMessageTime: new Date(Date.now() - 3600000).toISOString(),
      unread: 0,
      avatar: '👨‍🏫'
    },
    {
      id: 3,
      name: 'Cloud Study Jam',
      type: 'group',
      participants: ['Anita S.', 'Bibek T.', 'You'],
      online: ['Anita S.'],
      lastMessage: 'Anita: slides uploaded',
      lastMessageTime: new Date(Date.now() - 7200000).toISOString(),
      unread: 1,
      avatar: '☁️'
    },
    {
      id: 4,
      name: 'Bibek S.',
      type: 'direct',
      participants: ['Bibek S.', 'You'],
      online: [],
      lastMessage: 'Can you review…',
      lastMessageTime: new Date(Date.now() - 86400000).toISOString(),
      unread: 0,
      avatar: '👤'
    }
  ];
}

function getDefaultMessages() {
  return {
    1: [
      { id: 1, sender: 'Maya Rana', text: 'Final RAG eval numbers are in — 0.81 nDCG 🎉', time: new Date(Date.now() - 600000).toISOString(), type: 'received' },
      { id: 2, sender: 'You', text: 'Merged PR #42. ScholarGraph search latency −34%.', time: new Date(Date.now() - 300000).toISOString(), type: 'sent' },
      { id: 3, sender: 'Anita P.', text: 'Uploaded IEEE slides to Resources → Paper Clinic.', time: new Date(Date.now() - 180000).toISOString(), type: 'received' }
    ],
    2: [
      { id: 1, sender: 'Dr. Karki', text: 'Are you coming to the research expo tomorrow?', time: new Date(Date.now() - 7200000).toISOString(), type: 'received' },
      { id: 2, sender: 'You', text: 'Yes, I\'ll be there! Looking forward to it.', time: new Date(Date.now() - 7000000).toISOString(), type: 'sent' },
      { id: 3, sender: 'Dr. Karki', text: 'Great! See you at expo…', time: new Date(Date.now() - 6800000).toISOString(), type: 'received' }
    ],
    3: [
      { id: 1, sender: 'Anita S.', text: 'Who\'s joining the study jam tomorrow?', time: new Date(Date.now() - 14400000).toISOString(), type: 'received' },
      { id: 2, sender: 'You', text: 'I\'ll be there!', time: new Date(Date.now() - 14000000).toISOString(), type: 'sent' },
      { id: 3, sender: 'Bibek T.', text: 'Count me in too!', time: new Date(Date.now() - 13800000).toISOString(), type: 'received' },
      { id: 4, sender: 'Anita S.', text: 'slides uploaded to the drive', time: new Date(Date.now() - 7200000).toISOString(), type: 'received' }
    ],
    4: [
      { id: 1, sender: 'Bibek S.', text: 'Can you review my PR for NepalEdu Cloud?', time: new Date(Date.now() - 172800000).toISOString(), type: 'received' },
      { id: 2, sender: 'You', text: 'Sure, I\'ll take a look today.', time: new Date(Date.now() - 170000000).toISOString(), type: 'sent' }
    ]
  };
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
// GET ALL USERS
// ============================================

function getAllUsers() {
  let users = [];
  
  if (typeof UserDB !== 'undefined') {
    try {
      const allUsers = UserDB.getAllUsers ? UserDB.getAllUsers() : [];
      if (allUsers && allUsers.length > 0) {
        users = allUsers.map(u => ({
          id: u.id,
          name: u.fullName || 'User',
          email: u.email,
          avatar: u.profileImage || null,
          role: u.role || 'student',
          isVerified: u.isVerified || false
        }));
      }
    } catch (e) {}
  }
  
  // Add default users if none found
  if (users.length === 0) {
    users = [
      { id: 'user_001', name: 'Aarav Sharma', email: 'aarav@university.edu', avatar: null, role: 'student', isVerified: true },
      { id: 'user_002', name: 'Sarah Johnson', email: 'sarah@mit.edu', avatar: null, role: 'researcher', isVerified: true },
      { id: 'user_003', name: 'Bibek Thapa', email: 'bibek@pulchowk.edu.np', avatar: null, role: 'student', isVerified: false },
      { id: 'user_004', name: 'Maya Rana', email: 'maya@ku.edu.np', avatar: null, role: 'teacher', isVerified: true },
      { id: 'user_005', name: 'John Doe', email: 'john@stanford.edu', avatar: null, role: 'researcher', isVerified: false }
    ];
  }
  
  return users;
}

// ============================================
// RENDER CONVERSATIONS
// ============================================

function renderConversations() {
  const container = document.getElementById('conversationItems');
  if (!container) return;
  
  if (conversations.length === 0) {
    container.innerHTML = `
      <div style="padding:40px 20px; text-align:center; color:#94a3b8;">
        <span style="font-size:32px;display:block;margin-bottom:12px;">💬</span>
        <p>No conversations yet</p>
        <p style="font-size:12px;">Start a new conversation</p>
      </div>
    `;
    return;
  }
  
  container.innerHTML = conversations.map(conv => {
    const isActive = conv.id === currentConversationId;
    const time = new Date(conv.lastMessageTime);
    const timeStr = time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const isOnline = conv.online && conv.online.length > 0;
    const initial = conv.name.charAt(0).toUpperCase();
    
    return `
      <div class="conv-item ${isActive ? 'active' : ''}" onclick="selectConversation(${conv.id})">
        <div style="display:flex; gap:12px; align-items:center;">
          <div class="conv-avatar">
            ${conv.avatar || initial}
          </div>
          <div style="flex:1; min-width:0;">
            <div class="conv-header">
              <span class="conv-name">${conv.name}</span>
              <span class="conv-time">${timeStr}</span>
            </div>
            <div class="conv-preview">${conv.lastMessage}</div>
          </div>
        </div>
        <div style="display:flex; align-items:center; gap:8px; margin-top:4px; padding-left:48px;">
          ${isOnline ? `<span class="dot online"></span>` : ''}
          ${conv.unread > 0 ? `<span class="conv-badge">${conv.unread}</span>` : ''}
        </div>
      </div>
    `;
  }).join('');
}

// ============================================
// SELECT CONVERSATION
// ============================================

function selectConversation(convId) {
  currentConversationId = convId;
  const conv = conversations.find(c => c.id === convId);
  if (!conv) return;
  
  // Mark as read
  conv.unread = 0;
  saveConversations();
  renderConversations();
  
  // Update header
  const avatarEl = document.getElementById('chatAvatar');
  const nameEl = document.getElementById('chatName');
  const statusEl = document.getElementById('chatStatus');
  const typeEl = document.getElementById('chatType');
  
  const initial = conv.name.charAt(0).toUpperCase();
  avatarEl.textContent = conv.avatar || initial;
  nameEl.textContent = conv.name;
  
  const onlineCount = conv.online ? conv.online.length : 0;
  statusEl.textContent = onlineCount > 0 
    ? `${onlineCount} online • ${conv.type === 'group' ? 'Group' : 'Direct'} chat` 
    : 'Offline • Encrypted';
  typeEl.textContent = conv.type === 'group' ? 'Group Chat • Encrypted' : 'Direct Message • Encrypted';
  
  // Show composer
  document.getElementById('chatComposer').style.display = 'block';
  document.getElementById('emptyChat').style.display = 'none';
  
  // Render messages
  renderMessages(convId);
  
  // Close mobile sidebar
  closeMobileSidebar();
}

// ============================================
// RENDER MESSAGES
// ============================================

function renderMessages(convId) {
  const log = document.getElementById('chatLog');
  const conv = conversations.find(c => c.id === convId);
  if (!conv) return;
  
  const msgList = messages[convId] || [];
  
  if (msgList.length === 0) {
    log.innerHTML = `
      <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; color:#94a3b8; text-align:center;">
        <span style="font-size:32px;display:block;margin-bottom:12px;">💬</span>
        <p>No messages yet</p>
        <p style="font-size:12px;">Start the conversation</p>
      </div>
    `;
    return;
  }
  
  log.innerHTML = msgList.map(msg => {
    const time = new Date(msg.time);
    const timeStr = time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const isSent = msg.type === 'sent';
    const sender = isSent ? 'You' : msg.sender;
    
    return `
      <div class="msg ${isSent ? 'msg-user' : 'msg-ai'}">
        ${!isSent ? `<div class="msg-sender">${sender}</div>` : ''}
        ${msg.text}
        <span class="msg-time">${timeStr}</span>
      </div>
    `;
  }).join('');
  
  log.scrollTop = log.scrollHeight;
}

// ============================================
// SEND MESSAGE
// ============================================

function sendMessage() {
  const input = document.getElementById('messageInput');
  const text = input.value.trim();
  
  if (!text || currentConversationId === null) {
    if (!currentConversationId) {
      showToast('Please select a conversation first', 'warning');
    }
    return;
  }
  
  // Add message
  const newMsg = {
    id: Date.now(),
    sender: 'You',
    text: text,
    time: new Date().toISOString(),
    type: 'sent'
  };
  
  if (!messages[currentConversationId]) {
    messages[currentConversationId] = [];
  }
  messages[currentConversationId].push(newMsg);
  saveMessages();
  
  // Update conversation
  const conv = conversations.find(c => c.id === currentConversationId);
  if (conv) {
    conv.lastMessage = text;
    conv.lastMessageTime = new Date().toISOString();
    saveConversations();
    renderConversations();
  }
  
  input.value = '';
  renderMessages(currentConversationId);
  
  // Simulate reply
  simulateReply(currentConversationId);
}

function handleMessageKey(event) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    sendMessage();
  }
}

// ============================================
// SIMULATE REPLY
// ============================================

function simulateReply(convId) {
  const conv = conversations.find(c => c.id === convId);
  if (!conv) return;
  
  // Show typing indicator
  const statusEl = document.getElementById('typingStatus');
  statusEl.innerHTML = `
    <span class="typing-dots">
      <span></span><span></span><span></span>
    </span>
    Someone is typing...
  `;
  
  setTimeout(() => {
    statusEl.textContent = '';
    
    const replies = [
      'That\'s great! Let me check.',
      'I agree with that!',
      'Thanks for sharing!',
      'Interesting point. Let me think about it.',
      'Got it! Will work on it.',
      'Sounds good to me!',
      'Can you elaborate on that?',
      'Perfect, I\'ll get back to you.',
      'Thanks for the update!',
      'Let\'s discuss this further.',
      'I\'ll review and get back to you.',
      'Great work everyone!'
    ];
    
    const randomReply = replies[Math.floor(Math.random() * replies.length)];
    const sender = conv.participants.find(p => p !== 'You') || 'Someone';
    
    const replyMsg = {
      id: Date.now() + 1,
      sender: sender,
      text: randomReply,
      time: new Date().toISOString(),
      type: 'received'
    };
    
    if (!messages[convId]) {
      messages[convId] = [];
    }
    messages[convId].push(replyMsg);
    saveMessages();
    
    conv.lastMessage = randomReply;
    conv.lastMessageTime = new Date().toISOString();
    saveConversations();
    
    renderMessages(convId);
    renderConversations();
  }, 1500 + Math.random() * 1500);
}

// ============================================
// SEARCH CONVERSATIONS
// ============================================

function searchConversations(query) {
  const items = document.querySelectorAll('.conv-item');
  const lowerQuery = query.toLowerCase();
  
  items.forEach(item => {
    const name = item.querySelector('.conv-name')?.textContent?.toLowerCase() || '';
    const preview = item.querySelector('.conv-preview')?.textContent?.toLowerCase() || '';
    const match = name.includes(lowerQuery) || preview.includes(lowerQuery);
    item.style.display = match ? '' : 'none';
  });
}

// ============================================
// NEW MESSAGE
// ============================================

function openNewMessage() {
  const modal = document.getElementById('newMessageModal');
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
  document.getElementById('userSearch').value = '';
  document.getElementById('userSearchResults').innerHTML = '';
  document.getElementById('userSearch').focus();
}

function closeNewMessage() {
  const modal = document.getElementById('newMessageModal');
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

function searchUsers(query) {
  const container = document.getElementById('userSearchResults');
  const lowerQuery = query.toLowerCase().trim();
  
  if (!lowerQuery) {
    container.innerHTML = `<div style="padding:20px;text-align:center;color:#94a3b8;">Search for users to message</div>`;
    return;
  }
  
  const users = getAllUsers();
  const currentUser = getCurrentUser();
  
  const filtered = users.filter(u => {
    if (currentUser && u.id === currentUser.id) return false;
    return u.name.toLowerCase().includes(lowerQuery) || 
           u.email.toLowerCase().includes(lowerQuery);
  });
  
  if (filtered.length === 0) {
    container.innerHTML = `<div style="padding:20px;text-align:center;color:#94a3b8;">No users found</div>`;
    return;
  }
  
  container.innerHTML = filtered.map(user => {
    const initial = user.name.charAt(0).toUpperCase();
    const avatarHtml = user.avatar 
      ? `<img src="${user.avatar}" alt="${user.name}">` 
      : initial;
    
    return `
      <div class="user-result" onclick="startNewConversation('${user.id}')">
        <div class="user-avatar">${avatarHtml}</div>
        <div class="user-info">
          <div class="user-name">${user.name}</div>
          <div class="user-email">${user.email}</div>
          <div class="user-status">${user.role || 'Student'} ${user.isVerified ? '✅' : ''}</div>
        </div>
        <button class="btn btn-primary btn-sm">Message</button>
      </div>
    `;
  }).join('');
}

function startNewConversation(userId) {
  const users = getAllUsers();
  const user = users.find(u => u.id === userId);
  if (!user) return;
  
  // Check if conversation already exists
  const existing = conversations.find(c => 
    c.type === 'direct' && c.participants.includes(user.name)
  );
  
  if (existing) {
    selectConversation(existing.id);
    closeNewMessage();
    return;
  }
  
  // Create new conversation
  const newConv = {
    id: Date.now(),
    name: user.name,
    type: 'direct',
    participants: [user.name, 'You'],
    online: [],
    lastMessage: 'Start your conversation...',
    lastMessageTime: new Date().toISOString(),
    unread: 0,
    avatar: user.name.charAt(0).toUpperCase()
  };
  
  conversations.unshift(newConv);
  messages[newConv.id] = [];
  saveConversations();
  saveMessages();
  
  renderConversations();
  selectConversation(newConv.id);
  closeNewMessage();
  
  showToast(`💬 Started conversation with ${user.name}`, 'success');
}

// ============================================
// MOBILE SIDEBAR
// ============================================

function setupMobileSidebar() {
  // Add overlay for mobile
  const overlay = document.createElement('div');
  overlay.className = 'conv-overlay';
  overlay.id = 'convOverlay';
  overlay.onclick = closeMobileSidebar;
  document.body.appendChild(overlay);
  
  // Add toggle button for mobile
  const topbar = document.querySelector('.app-topbar');
  const toggleBtn = document.createElement('button');
  toggleBtn.className = 'btn btn-ghost btn-sm';
  toggleBtn.textContent = '☰';
  toggleBtn.style.display = 'none';
  toggleBtn.onclick = toggleMobileSidebar;
  
  if (window.innerWidth <= 900) {
    toggleBtn.style.display = 'inline-flex';
  }
  topbar.prepend(toggleBtn);
  
  window.addEventListener('resize', function() {
    if (window.innerWidth <= 900) {
      toggleBtn.style.display = 'inline-flex';
    } else {
      toggleBtn.style.display = 'none';
      closeMobileSidebar();
    }
  });
}

function toggleMobileSidebar() {
  const sidebar = document.querySelector('.conv-list');
  const overlay = document.getElementById('convOverlay');
  
  sidebar.classList.toggle('open');
  overlay.classList.toggle('active');
}

function closeMobileSidebar() {
  const sidebar = document.querySelector('.conv-list');
  const overlay = document.getElementById('convOverlay');
  
  sidebar.classList.remove('open');
  overlay.classList.remove('active');
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

// Make functions globally available
window.selectConversation = selectConversation;
window.sendMessage = sendMessage;
window.handleMessageKey = handleMessageKey;
window.searchConversations = searchConversations;
window.openNewMessage = openNewMessage;
window.closeNewMessage = closeNewMessage;
window.searchUsers = searchUsers;
window.startNewConversation = startNewConversation;
window.toggleMobileSidebar = toggleMobileSidebar;
window.closeMobileSidebar = closeMobileSidebar;
window.showToast = showToast;

console.log('💬 Messages Ready!');