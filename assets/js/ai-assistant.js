// ============================================
// AI ASSISTANT - Complete JavaScript
// ============================================

// ============================================
// STATE
// ============================================

let chatHistory = JSON.parse(localStorage.getItem('sj_ai_chats') || '[]');
let currentChatId = null;
let chatMessages = [];
let isProcessing = false;
let features = {
  citations: true,
  code: false,
  explain: false
};

// ============================================
// INITIALIZE
// ============================================

document.addEventListener('DOMContentLoaded', function() {
  console.log('🤖 AI Assistant Loading...');
  
  updateHeaderAvatar();
  loadChatHistory();
  renderChatHistory();
  setupMobileSidebar();
  
  console.log('🤖 AI Assistant Ready!');
});

// ============================================
// CHAT FUNCTIONS
// ============================================

function newChat() {
  currentChatId = Date.now();
  chatMessages = [];
  document.getElementById('welcomeScreen').style.display = 'block';
  document.getElementById('chatMessages').style.display = 'none';
  document.getElementById('chatInput').value = '';
  document.getElementById('chatInput').focus();
  closeMobileSidebar();
}

function sendMessage() {
  const input = document.getElementById('chatInput');
  const message = input.value.trim();
  
  if (!message || isProcessing) return;
  
  // Hide welcome screen
  document.getElementById('welcomeScreen').style.display = 'none';
  document.getElementById('chatMessages').style.display = 'block';
  
  // Add user message
  addMessage('user', message);
  input.value = '';
  
  // Process AI response
  processAIResponse(message);
}

function sendPrompt(prompt) {
  document.getElementById('chatInput').value = prompt;
  sendMessage();
}

function useTemplate(template) {
  const prompts = {
    'Summarize': 'Summarize this content with proper citations',
    'Study Plan': 'Create a comprehensive study plan for me',
    'Career Advice': 'Give me career advice for my field',
    'Project Ideas': 'Suggest 5 project ideas for me',
    'Explain Concepts': 'Explain this concept in simple terms',
    'Research Questions': 'Generate research questions for my topic',
    'Flashcards': 'Create flashcards from this content'
  };
  
  document.getElementById('chatInput').value = prompts[template] || template;
  document.getElementById('chatInput').focus();
  closeMobileSidebar();
}

function handleKeyDown(event) {
  if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
    event.preventDefault();
    sendMessage();
  }
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    sendMessage();
  }
}

// ============================================
// MESSAGE HANDLING
// ============================================

function addMessage(role, content) {
  const messagesContainer = document.getElementById('chatMessages');
  
  const messageDiv = document.createElement('div');
  messageDiv.className = `message message-${role}`;
  
  const contentDiv = document.createElement('div');
  contentDiv.className = 'message-content';
  
  // Format content with markdown-like support
  let formattedContent = content;
  
  // Handle code blocks
  formattedContent = formattedContent.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
  
  // Handle bold
  formattedContent = formattedContent.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Handle citations (looks like (Author, Year))
  if (features.citations) {
    formattedContent = formattedContent.replace(/\(([A-Z][a-z]+,\s\d{4})\)/g, '<span class="citation">($1)</span>');
  }
  
  contentDiv.innerHTML = formattedContent;
  
  // Add citations section for AI messages
  if (role === 'ai' && features.citations) {
    const citations = extractCitations(content);
    if (citations.length > 0) {
      const citationDiv = document.createElement('div');
      citationDiv.className = 'message-citations';
      citationDiv.innerHTML = '📚 Citations: ' + citations.join(', ');
      contentDiv.appendChild(citationDiv);
    }
    
    // Add action buttons for AI messages
    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'message-actions';
    actionsDiv.innerHTML = `
      <button class="btn btn-outline btn-sm" onclick="copyMessage(this)">📋 Copy</button>
      <button class="btn btn-outline btn-sm" onclick="regenerateMessage()">🔄 Regenerate</button>
      <button class="btn btn-outline btn-sm" onclick="exportMessage(this)">📤 Export</button>
    `;
    contentDiv.appendChild(actionsDiv);
  }
  
  messageDiv.appendChild(contentDiv);
  messagesContainer.appendChild(messageDiv);
  
  // Scroll to bottom
  const chatArea = document.getElementById('chatArea');
  chatArea.scrollTop = chatArea.scrollHeight;
  
  // Save to chat history
  chatMessages.push({ role, content, timestamp: new Date().toISOString() });
  saveChat();
}

function showTypingIndicator() {
  document.getElementById('typingIndicator').style.display = 'flex';
  const chatArea = document.getElementById('chatArea');
  chatArea.scrollTop = chatArea.scrollHeight;
}

function hideTypingIndicator() {
  document.getElementById('typingIndicator').style.display = 'none';
}

// ============================================
// AI RESPONSE GENERATION
// ============================================

function processAIResponse(message) {
  isProcessing = true;
  showTypingIndicator();
  
  // Simulate API call - Replace this with your actual AI API
  setTimeout(() => {
    hideTypingIndicator();
    const response = generateAIResponse(message);
    addMessage('ai', response);
    isProcessing = false;
  }, 1500 + Math.random() * 1000);
}

function generateAIResponse(message) {
  // Simulated AI responses - Replace with actual API call
  const responses = {
    'summarize': `Here's a concise summary of the content:

**Key Points:**
1. The Transformer architecture revolutionized NLP by introducing self-attention mechanisms
2. Multi-head attention allows the model to focus on different parts of the input simultaneously
3. Positional encoding provides sequence order information
4. The model achieves state-of-the-art performance on translation tasks
5. This architecture became the foundation for models like BERT and GPT

**Citation:** Vaswani, A., et al. (2017). Attention is all you need. Advances in Neural Information Processing Systems, 30.`,

    'study plan': `**12-Week Machine Learning Study Plan**

**Week 1-2: Foundations**
- Python programming (NumPy, Pandas, Matplotlib)
- Linear algebra and calculus basics
- Introduction to ML concepts

**Week 3-4: Supervised Learning**
- Linear and logistic regression
- Decision trees and random forests
- SVM and KNN

**Week 5-6: Advanced Topics**
- Neural networks and backpropagation
- Deep learning with TensorFlow/PyTorch
- CNN architectures

**Week 7-8: NLP & Transformers**
- Word embeddings and attention
- Transformer architecture
- Fine-tuning BERT/GPT

**Week 9-10: MLOps**
- Model deployment
- Monitoring and versioning
- CI/CD for ML

**Week 11-12: Capstone Project**
- End-to-end ML project
- Documentation and presentation

📚 Resources: Fast.ai, Coursera ML Course, Hands-on ML Book`,

    'career': `**Career Roadmap: ML Engineer in Nepal**

**Current Market Overview:**
- Growing AI ecosystem in Nepal
- Remote opportunities available
- Demand for ML Engineers: ↑ 45% YoY

**Skills to Build:**
1. Core: Python, PyTorch/TensorFlow, SQL
2. MLOps: Docker, Kubernetes, AWS/GCP
3. Domain: NLP, Computer Vision, or Recommendation Systems
4. Soft Skills: Communication, Problem-solving, Teamwork

**Certifications:**
- TensorFlow Developer Certificate
- AWS Machine Learning Specialty
- Deep Learning Specialization (Coursera)

**Job Opportunities:**
- 🏢 Leapfrog Technology
- 🏢 Cotiviti Nepal
- 🏢 Fusemachines
- 🌐 Remote: Upwork, Toptal, ML-focused startups

**Salary Range:**
- Entry: $8,000 - $12,000/year
- Mid: $15,000 - $25,000/year
- Senior: $30,000+/year`,

    'project': `**5 Research Project Ideas**

**1. RAG System for Nepali Legal Documents**
- Build a retrieval-augmented generation system for Nepali legal texts
- Tech: LangChain, FAISS, Llama2
- Impact: Legal research assistance

**2. Crop Disease Detection using CNNs**
- Real-time crop disease detection from smartphone images
- Tech: EfficientNet, TensorFlow Lite
- Impact: Agricultural support in Nepal

**3. Sentiment Analysis for Nepali Tweets**
- Fine-tune multilingual BERT on Nepali Twitter data
- Tech: Transformers, Scikit-learn
- Impact: Opinion mining and social analysis

**4. Blockchain-based Academic Credential Verification**
- Decentralized system for diploma verification
- Tech: Ethereum, Solidity, IPFS
- Impact: Reduce academic fraud

**5. AI-powered Nepali-English Translation**
- Neural machine translation for Nepali-English
- Tech: Transformer, MarianMT
- Impact: Bridging language barriers`,

    'explain': `**Backpropagation Explained (High School Level)**

**What is Backpropagation?**
Backpropagation is like teaching a student by correcting their mistakes. When you get an answer wrong, you trace back to find where you made the error.

**How it works:**

**Step 1: Forward Pass**
Your input goes through the network, and you get a prediction.

**Step 2: Calculate Error**
Compare your prediction with the correct answer. The difference is the error.

**Step 3: Backward Pass**
The error travels backwards through the network. Each layer adjusts to reduce the error.

**Step 4: Repeat**
You do this many times until the network learns to make accurate predictions.

**Simple Analogy:** Think of it like playing darts - you adjust your aim based on where your last dart hit. Each throw helps you get closer to the target.

**Why It Matters:** This is how all modern AI learns - from your phone's face recognition to ChatGPT!
`
  };

  // Check for keywords in the message
  const lowerMsg = message.toLowerCase();
  let response = responses['summarize']; // Default

  if (lowerMsg.includes('study plan') || lowerMsg.includes('plan')) {
    response = responses['study plan'];
  } else if (lowerMsg.includes('career') || lowerMsg.includes('job') || lowerMsg.includes('salary')) {
    response = responses['career'];
  } else if (lowerMsg.includes('project') || lowerMsg.includes('idea')) {
    response = responses['project'];
  } else if (lowerMsg.includes('explain') || lowerMsg.includes('backpropagation')) {
    response = responses['explain'];
  } else if (lowerMsg.includes('paper') || lowerMsg.includes('summarize') || lowerMsg.includes('attention')) {
    response = responses['summarize'];
  } else {
    // Generic response
    response = `I understand you're asking about "${message}". Here's what I can help with:

**Key Points:**
1. This topic is related to academic research and learning
2. I can provide detailed explanations, study plans, or project ideas
3. Would you like me to elaborate on any specific aspect?

**Suggested Topics:**
- 📄 Summarize a paper
- 📚 Create a study plan  
- 💼 Get career advice
- 💡 Generate project ideas
- 🧠 Explain a concept

Let me know what you'd like to explore further!`;
  }

  return response;
}

// ============================================
// MESSAGE ACTIONS
// ============================================

function copyMessage(button) {
  const messageDiv = button.closest('.message-content');
  const text = messageDiv.textContent.replace('CopyRegenerateExport', '').trim();
  
  navigator.clipboard.writeText(text).then(() => {
    showToast('📋 Copied to clipboard!', 'success');
  }).catch(() => {
    // Fallback
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    showToast('📋 Copied to clipboard!', 'success');
  });
}

function regenerateMessage() {
  // Remove last AI message
  const messages = document.querySelectorAll('.message-ai');
  if (messages.length > 0) {
    const lastMessage = messages[messages.length - 1];
    const lastUserMessage = document.querySelectorAll('.message-user');
    const userMessage = lastUserMessage[lastUserMessage.length - 1];
    
    // Remove last AI message
    lastMessage.remove();
    chatMessages.pop();
    
    // Re-process the last user message
    if (userMessage) {
      const text = userMessage.querySelector('.message-content').textContent;
      processAIResponse(text);
    }
  }
}

function exportMessage(button) {
  const messageDiv = button.closest('.message-content');
  const text = messageDiv.textContent.replace('CopyRegenerateExport', '').trim();
  
  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `ai-response-${Date.now()}.txt`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('📤 Exported successfully!', 'success');
}

function clearChat() {
  if (!confirm('Clear all chat messages?')) return;
  
  const messagesContainer = document.getElementById('chatMessages');
  messagesContainer.innerHTML = '';
  chatMessages = [];
  document.getElementById('welcomeScreen').style.display = 'block';
  document.getElementById('chatMessages').style.display = 'none';
  showToast('🗑️ Chat cleared', 'info');
}

// ============================================
// FEATURES
// ============================================

function toggleFeature(feature) {
  features[feature] = !features[feature];
  
  const badges = document.querySelectorAll('.tool-badge');
  badges.forEach(badge => {
    if (badge.textContent.includes(feature) || badge.textContent.includes('Citations')) {
      badge.classList.toggle('active');
    }
  });
  
  showToast(`${feature} ${features[feature] ? 'enabled' : 'disabled'}`, 'info');
}

// ============================================
// EXTRACT CITATIONS
// ============================================

function extractCitations(text) {
  const citations = [];
  const regex = /\(([A-Z][a-z]+,\s\d{4})\)/g;
  let match;
  while ((match = regex.exec(text)) !== null) {
    citations.push(match[1]);
  }
  return citations;
}

// ============================================
// CHAT HISTORY
// ============================================

function saveChat() {
  const chats = JSON.parse(localStorage.getItem('sj_ai_chats') || '[]');
  const existingIndex = chats.findIndex(c => c.id === currentChatId);
  
  if (existingIndex > -1) {
    chats[existingIndex] = {
      id: currentChatId,
      messages: chatMessages,
      updatedAt: new Date().toISOString()
    };
  } else {
    chats.unshift({
      id: currentChatId,
      messages: chatMessages,
      updatedAt: new Date().toISOString()
    });
  }
  
  localStorage.setItem('sj_ai_chats', JSON.stringify(chats));
  renderChatHistory();
}

function loadChatHistory() {
  const chats = JSON.parse(localStorage.getItem('sj_ai_chats') || '[]');
  return chats;
}

function renderChatHistory() {
  const container = document.getElementById('chatHistory');
  const chats = loadChatHistory();
  
  if (chats.length === 0) {
    container.innerHTML = `
      <div class="text-xs text-muted" style="padding:12px 0; text-align:center;">
        No chat history yet
      </div>
    `;
    return;
  }
  
  container.innerHTML = chats.map(chat => {
    const firstMessage = chat.messages[0]?.content || 'New Chat';
    const preview = firstMessage.substring(0, 40) + (firstMessage.length > 40 ? '...' : '');
    const isActive = chat.id === currentChatId;
    
    return `
      <div class="chat-history-item ${isActive ? 'active' : ''}" onclick="loadChat(${chat.id})">
        <span class="chat-icon">💬</span>
        <span>${preview}</span>
      </div>
    `;
  }).join('');
}

function loadChat(chatId) {
  const chats = loadChatHistory();
  const chat = chats.find(c => c.id === chatId);
  
  if (!chat) return;
  
  currentChatId = chatId;
  chatMessages = chat.messages;
  
  // Hide welcome screen
  document.getElementById('welcomeScreen').style.display = 'none';
  document.getElementById('chatMessages').style.display = 'block';
  
  // Render messages
  const container = document.getElementById('chatMessages');
  container.innerHTML = '';
  
  chatMessages.forEach(msg => {
    addMessage(msg.role, msg.content);
  });
  
  renderChatHistory();
  closeMobileSidebar();
}

// ============================================
// MOBILE SIDEBAR
// ============================================

function setupMobileSidebar() {
  // Add overlay for mobile
  const overlay = document.createElement('div');
  overlay.className = 'ai-side-overlay';
  overlay.id = 'aiSideOverlay';
  overlay.onclick = closeMobileSidebar;
  document.body.appendChild(overlay);
  
  // Add toggle button for mobile
  const header = document.querySelector('.sj-header-actions');
  const toggleBtn = document.createElement('button');
  toggleBtn.className = 'btn btn-ghost btn-sm';
  toggleBtn.textContent = '☰';
  toggleBtn.style.display = 'none';
  toggleBtn.onclick = toggleMobileSidebar;
  
  // Only show on mobile
  if (window.innerWidth <= 980) {
    toggleBtn.style.display = 'inline-flex';
  }
  header.prepend(toggleBtn);
  
  window.addEventListener('resize', function() {
    if (window.innerWidth <= 980) {
      toggleBtn.style.display = 'inline-flex';
    } else {
      toggleBtn.style.display = 'none';
      closeMobileSidebar();
    }
  });
}

function toggleMobileSidebar() {
  const sidebar = document.querySelector('.ai-side');
  const overlay = document.getElementById('aiSideOverlay');
  
  sidebar.classList.toggle('open');
  overlay.classList.toggle('active');
}

function closeMobileSidebar() {
  const sidebar = document.querySelector('.ai-side');
  const overlay = document.getElementById('aiSideOverlay');
  
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

// ============================================
// API INTEGRATION READY
// ============================================

// This section is ready for your AI API integration
// Replace the generateAIResponse function with your actual API call

/*
async function callAIAPI(message) {
  try {
    const response = await fetch('https://api.your-ai-provider.com/v1/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_API_KEY'
      },
      body: JSON.stringify({
        model: 'your-model',
        messages: [
          { role: 'system', content: 'You are Scholar AI, an academic assistant...' },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    });
    
    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('API Error:', error);
    return 'Sorry, I encountered an error. Please try again.';
  }
}
*/

// Make functions globally available
window.newChat = newChat;
window.sendMessage = sendMessage;
window.sendPrompt = sendPrompt;
window.useTemplate = useTemplate;
window.handleKeyDown = handleKeyDown;
window.copyMessage = copyMessage;
window.regenerateMessage = regenerateMessage;
window.exportMessage = exportMessage;
window.clearChat = clearChat;
window.toggleFeature = toggleFeature;
window.loadChat = loadChat;
window.toggleMobileSidebar = toggleMobileSidebar;
window.closeMobileSidebar = closeMobileSidebar;
window.showToast = showToast;

console.log('🤖 AI Assistant Ready!');