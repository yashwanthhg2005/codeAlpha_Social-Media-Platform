// Connectly - Main Shared UI Utilities (Navbar, Search, Toast, Navigation)

document.addEventListener("DOMContentLoaded", () => {
  // 1. Core initialization
  initLayout();
  initSearch();
  initHamburgerMenu();
});

// Relative Time Formatter
function formatRelativeTime(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  
  if (seconds < 0) return "just now";
  if (seconds < 60) return "just now";
  
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  
  const days = Math.floor(hours / 24);
  if (days === 1) return "yesterday";
  if (days < 7) return `${days}d ago`;
  
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

// Toast Notification Manager
function showToast(message, type = 'success') {
  let toastContainer = document.getElementById("toast-container");
  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.id = "toast-container";
    document.body.appendChild(toastContainer);
  }
  
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  
  let icon = "fa-info-circle";
  if (type === 'success') icon = "fa-check-circle";
  if (type === 'error') icon = "fa-exclamation-circle";
  
  toast.innerHTML = `
    <i class="fas ${icon}"></i>
    <span>${message}</span>
  `;
  
  toastContainer.appendChild(toast);
  
  // Auto-remove after animation completes
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

// Generate the Common Header Navbar Dynamically
function initLayout() {
  const header = document.querySelector("header");
  if (!header) return; // Skip if no header element
  
  const db = window.ConnectlyDB;
  const currentUser = db.getCurrentUser();
  
  // Calculate unread notifications count
  let unreadCount = 0;
  if (currentUser) {
    const notifs = db.getNotifications() || [];
    unreadCount = notifs.filter(n => n.recipientId === currentUser.id && !n.isRead).length;
  }
  
  const currentPath = window.location.pathname;
  const isPage = (name) => currentPath.endsWith(name) || (name === 'index.html' && (currentPath === '/' || currentPath.endsWith('/')));
  
  // Create navigation HTML
  header.innerHTML = `
    <div class="container navbar">
      <div class="nav-brand">
        <button class="hamburger" aria-label="Toggle Menu">
          <span></span>
          <span></span>
          <span></span>
        </button>
        <a href="./index.html" class="nav-brand">
          <div class="logo-icon">C</div>
          <span class="logo-text">Connectly</span>
        </a>
      </div>
      
      <!-- Search bar -->
      <div class="nav-search">
        <i class="fas fa-search search-icon"></i>
        <input type="text" placeholder="Search Connectly..." id="global-search-input">
        <div class="search-results-dropdown" id="global-search-results"></div>
      </div>
      
      <!-- Nav items -->
      <nav class="nav-menu" id="nav-menu">
        <a href="./index.html" class="nav-link ${isPage('index.html') ? 'active' : ''}" title="Home">
          <i class="fas fa-home"></i>
          <span class="mobile-only-label">Home</span>
        </a>
        <a href="./explore.html" class="nav-link ${isPage('explore.html') ? 'active' : ''}" title="Explore">
          <i class="fas fa-compass"></i>
          <span class="mobile-only-label">Explore</span>
        </a>
        <a href="./create-post.html" class="nav-link ${isPage('create-post.html') ? 'active' : ''}" title="Create Post">
          <i class="fas fa-plus-square"></i>
          <span class="mobile-only-label">Create Post</span>
        </a>
        <a href="./notifications.html" class="nav-link ${isPage('notifications.html') ? 'active' : ''}" title="Notifications">
          <i class="fas fa-bell"></i>
          ${unreadCount > 0 ? `<span class="badge" id="nav-notif-badge">${unreadCount}</span>` : ''}
          <span class="mobile-only-label">Notifications</span>
        </a>
        
        ${currentUser ? `
          <a href="./profile.html?username=${currentUser.username}" class="nav-user">
            <img src="${currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}" class="nav-avatar" alt="${currentUser.name}">
            <div class="nav-user-info">
              <span class="nav-user-name">${currentUser.name}</span>
              <span class="nav-user-handle">@${currentUser.username}</span>
            </div>
          </a>
          <button id="nav-btn-logout" class="btn-logout" title="Log Out">
            <i class="fas fa-sign-out-alt"></i>
            <span class="mobile-only-label" style="display:none;">Log Out</span>
          </button>
        ` : `
          <a href="./login.html" class="btn-primary" style="padding: 8px 18px; font-size: 0.85rem; border-radius: var(--radius-full);">Login</a>
        `}
      </nav>
    </div>
  `;
  
  // Attach logout handler if button exists
  const logoutBtn = document.getElementById("nav-btn-logout");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      db.setCurrentUser(null);
      showToast("Logged out successfully!", "success");
      setTimeout(() => {
        window.location.href = "./login.html";
      }, 1000);
    });
  }
}

// Centralized Search Functionality
function initSearch() {
  const searchInput = document.getElementById("global-search-input");
  const resultsDropdown = document.getElementById("global-search-results");
  if (!searchInput || !resultsDropdown) return;
  
  const db = window.ConnectlyDB;
  
  searchInput.addEventListener("input", (e) => {
    const query = e.target.value.trim().toLowerCase();
    
    if (query.length < 1) {
      resultsDropdown.classList.remove("active");
      resultsDropdown.innerHTML = "";
      return;
    }
    
    const users = db.getUsers() || [];
    const posts = db.getPosts() || [];
    
    // Filter users
    const matchedUsers = users.filter(user => 
      user.name.toLowerCase().includes(query) || 
      user.username.toLowerCase().includes(query)
    );
    
    // Filter posts
    const matchedPosts = posts.filter(post => 
      post.text.toLowerCase().includes(query) ||
      (post.category && post.category.toLowerCase().includes(query))
    );
    
    if (matchedUsers.length === 0 && matchedPosts.length === 0) {
      resultsDropdown.innerHTML = `
        <div class="search-result-group">
          <div class="search-result-group-title">No results found</div>
          <div style="padding: 12px 16px; font-size: 0.85rem; color: var(--text-secondary);">
            Try searching for another keyword or name.
          </div>
        </div>
      `;
    } else {
      let html = "";
      
      // Render matched users
      if (matchedUsers.length > 0) {
        html += `<div class="search-result-group">
          <div class="search-result-group-title">Users</div>`;
        matchedUsers.slice(0, 5).forEach(user => {
          html += `
            <a href="./profile.html?username=${user.username}" class="search-result-item">
              <img src="${user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}" alt="${user.name}">
              <div class="search-result-info">
                <span class="search-result-name">${user.name}</span>
                <span class="search-result-username">@${user.username}</span>
              </div>
            </a>
          `;
        });
        html += `</div>`;
      }
      
      // Render matched posts
      if (matchedPosts.length > 0) {
        html += `<div class="search-result-group">
          <div class="search-result-group-title">Posts</div>`;
        matchedPosts.slice(0, 5).forEach(post => {
          const author = users.find(u => u.id === post.userId) || { name: "User", username: "user" };
          html += `
            <a href="./post.html?id=${post.id}" class="search-result-item">
              <i class="fas fa-file-alt" style="font-size: 1.1rem; color: var(--accent); padding: 6px; background-color: var(--accent-light); border-radius: var(--radius-sm);"></i>
              <div class="search-result-info">
                <span class="search-result-name">${author.name}</span>
                <span class="search-result-post-text">${escapeHTML(post.text)}</span>
              </div>
            </a>
          `;
        });
        html += `</div>`;
      }
      
      resultsDropdown.innerHTML = html;
    }
    
    resultsDropdown.classList.add("active");
  });
  
  // Close search dropdown on click outside
  document.addEventListener("click", (e) => {
    if (!searchInput.contains(e.target) && !resultsDropdown.contains(e.target)) {
      resultsDropdown.classList.remove("active");
    }
  });
}

// Hamburger menu toggle for mobile
function initHamburgerMenu() {
  const hamburger = document.querySelector(".hamburger");
  const navMenu = document.getElementById("nav-menu");
  
  if (hamburger && navMenu) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active");
      navMenu.classList.toggle("active");
    });
  }
}

// Utility function to escape HTML string
function escapeHTML(str) {
  if (!str) return '';
  return str.replace(/[&<>'"]/g, 
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
}

// Expose utilities globally
window.Connectly = {
  showToast,
  formatRelativeTime,
  escapeHTML
};
