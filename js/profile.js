// Connectly - Profile Pages and Details Editor Controller

const ProfileService = {
  // Load and display profile page details
  initProfilePage: () => {
    const db = window.ConnectlyDB;
    const currentUser = db.getCurrentUser();
    
    // Parse username from URL query parameters (e.g. profile.html?username=alexjohnson)
    const params = new URLSearchParams(window.location.search);
    const targetUsername = params.get("username");
    
    const users = db.getUsers() || [];
    let profileUser = null;
    
    if (targetUsername) {
      profileUser = users.find(u => u.username.toLowerCase() === targetUsername.toLowerCase());
    } else if (currentUser) {
      // Default to currentUser profile
      profileUser = currentUser;
      // Redirect to correct URL with params
      window.history.replaceState({}, "", `./profile.html?username=${currentUser.username}`);
    }
    
    if (!profileUser) {
      // User not found layout
      const container = document.getElementById("profile-root");
      if (container) {
        container.innerHTML = `
          <div class="empty-state" style="margin-top: 40px;">
            <i class="fas fa-user-slash empty-state-icon"></i>
            <h3 class="empty-state-title">User Not Found</h3>
            <p class="empty-state-text">The user you are looking for does not exist or has been deleted.</p>
            <a href="./index.html" class="btn-primary" style="margin-top: 16px;">Go to Feed</a>
          </div>
        `;
      }
      return;
    }
    
    ProfileService.renderProfileDetails(profileUser);
    ProfileService.renderProfilePosts(profileUser);
  },

  // Render headers and stats of the user profile card
  renderProfileDetails: (user) => {
    const db = window.ConnectlyDB;
    const currentUser = db.getCurrentUser();
    const followers = db.getFollowers() || [];
    const posts = db.getPosts() || [];
    
    // Calculate stat counts
    const userPostsCount = posts.filter(p => p.userId === user.id).length;
    const userFollowersCount = followers.filter(f => f.followingId === user.id).length;
    const userFollowingCount = followers.filter(f => f.followerId === user.id).length;
    
    const isSelf = currentUser ? currentUser.id === user.id : false;
    const isFollowing = currentUser ? followers.some(f => f.followerId === currentUser.id && f.followingId === user.id) : false;
    
    // Render details elements
    document.getElementById("profile-banner").src = user.cover || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80";
    document.getElementById("profile-avatar").src = user.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80";
    document.getElementById("profile-name").textContent = user.name;
    document.getElementById("profile-username").textContent = `@${user.username}`;
    
    // Bio
    document.getElementById("profile-bio").textContent = user.bio || "No bio description written yet.";
    
    // Location & Website details
    const locIcon = user.location ? `<span id="prof-loc"><i class="fas fa-map-marker-alt"></i> ${window.Connectly.escapeHTML(user.location)}</span>` : '';
    const webIcon = user.website ? `<span id="prof-web"><i class="fas fa-link"></i> <a href="${user.website}" target="_blank">${user.website.replace(/^https?:\/\//, '')}</a></span>` : '';
    document.getElementById("profile-meta-chips").innerHTML = `${locIcon} ${webIcon}`;
    
    // Stats count display
    document.getElementById("profile-stat-posts").textContent = userPostsCount;
    document.getElementById("profile-stat-followers").textContent = userFollowersCount;
    document.getElementById("profile-stat-following").textContent = userFollowingCount;
    
    // Action button (Follow vs Edit)
    const actionBtnContainer = document.getElementById("profile-action-container");
    if (isSelf) {
      actionBtnContainer.innerHTML = `
        <button class="btn-secondary btn-edit-profile" id="btn-trigger-edit">
          <i class="fas fa-pen"></i> Edit Profile
        </button>
      `;
      // Bind Edit Modal opener
      document.getElementById("btn-trigger-edit").addEventListener("click", () => {
        ProfileService.openEditModal(user);
      });
    } else {
      actionBtnContainer.innerHTML = `
        <button class="btn-profile-follow ${isFollowing ? 'following' : ''}" id="btn-profile-follow-action">
          ${isFollowing ? 'Following' : 'Follow'}
        </button>
      `;
      // Bind follow action
      document.getElementById("btn-profile-follow-action").addEventListener("click", () => {
        ProfileService.toggleProfileFollow(user.id);
      });
    }
  },

  // Toggle follow/unfollow on Profile Page
  toggleProfileFollow: (userId) => {
    const db = window.ConnectlyDB;
    const currentUser = db.getCurrentUser();
    if (!currentUser) {
      window.Connectly.showToast("Please log in to follow users", "error");
      return;
    }
    
    let followers = db.getFollowers() || [];
    const isFollowing = followers.some(f => f.followerId === currentUser.id && f.followingId === userId);
    const users = db.getUsers() || [];
    const profileUser = users.find(u => u.id === userId);
    
    if (isFollowing) {
      // Unfollow
      followers = followers.filter(f => !(f.followerId === currentUser.id && f.followingId === userId));
      db.saveFollowers(followers);
      window.Connectly.showToast(`Unfollowed ${profileUser.name}`, "success");
    } else {
      // Follow
      followers.push({ followerId: currentUser.id, followingId: userId });
      db.saveFollowers(followers);
      window.Connectly.showToast(`Following ${profileUser.name}`, "success");
      
      // Send notification
      const notifications = db.getNotifications() || [];
      notifications.push({
        id: `notif-${Date.now()}`,
        recipientId: userId,
        senderId: currentUser.id,
        type: "follow",
        date: new Date().toISOString(),
        isRead: false
      });
      db.saveNotifications(notifications);
    }
    
    // Refresh page details (stats count, buttons)
    ProfileService.renderProfileDetails(profileUser);
  },

  // Render list of posts for this specific user
  renderProfilePosts: (user) => {
    const db = window.ConnectlyDB;
    const allPosts = db.getPosts() || [];
    const userPosts = allPosts.filter(p => p.userId === user.id);
    
    const listContainer = document.getElementById("profile-posts-list");
    const gridContainer = document.getElementById("profile-posts-grid");
    
    if (userPosts.length === 0) {
      const emptyHtml = `
        <div class="empty-state">
          <i class="far fa-folder-open empty-state-icon"></i>
          <h3 class="empty-state-title">No posts yet</h3>
          <p class="empty-state-text">This profile hasn't published any posts yet.</p>
        </div>
      `;
      listContainer.innerHTML = emptyHtml;
      gridContainer.innerHTML = emptyHtml;
      return;
    }
    
    // 1. Render feed (list) format
    window.ConnectlyPosts.renderFeed(userPosts, "profile-posts-list");
    
    // 2. Render grid format
    const comments = db.getComments() || [];
    const likes = db.getLikes() || [];
    
    gridContainer.innerHTML = userPosts.map(post => {
      const postLikesCount = likes.filter(l => l.postId === post.id).length;
      const postCommentsCount = comments.filter(c => c.postId === post.id).length;
      
      return `
        <div class="grid-post-card" onclick="window.location.href='./post.html?id=${post.id}'">
          ${post.image ? `
            <img src="${post.image}" class="grid-post-image" alt="Post preview">
          ` : `
            <div class="grid-post-text-only">
              <span style="display:-webkit-box;-webkit-line-clamp:4;-webkit-box-orient:vertical;overflow:hidden;">
                ${window.Connectly.escapeHTML(post.text)}
              </span>
            </div>
          `}
          <div class="grid-post-overlay">
            <div class="grid-overlay-item">
              <i class="fas fa-heart"></i> ${postLikesCount}
            </div>
            <div class="grid-overlay-item">
              <i class="fas fa-comment"></i> ${postCommentsCount}
            </div>
          </div>
        </div>
      `;
    }).join("");
  },

  // Open Edit Profile modal & populate inputs
  openEditModal: (user) => {
    const modal = document.getElementById("edit-profile-modal");
    if (!modal) return;
    
    document.getElementById("edit-name").value = user.name || "";
    document.getElementById("edit-username").value = user.username || "";
    document.getElementById("edit-bio").value = user.bio || "";
    document.getElementById("edit-location").value = user.location || "";
    document.getElementById("edit-website").value = user.website || "";
    document.getElementById("edit-avatar").value = user.avatar || "";
    
    modal.classList.add("active");
    
    // Cancel action
    const btnCancel = document.getElementById("btn-edit-cancel");
    const closeHandler = () => modal.classList.remove("active");
    btnCancel.addEventListener("click", closeHandler, { once: true });
    
    // Save form action
    const form = document.getElementById("edit-profile-form");
    form.onsubmit = (e) => {
      e.preventDefault();
      
      const newName = document.getElementById("edit-name").value.trim();
      const newUsername = document.getElementById("edit-username").value.trim().toLowerCase();
      const newBio = document.getElementById("edit-bio").value.trim();
      const newLocation = document.getElementById("edit-location").value.trim();
      const newWebsite = document.getElementById("edit-website").value.trim();
      const newAvatar = document.getElementById("edit-avatar").value.trim();
      
      if (!newName || !newUsername) {
        window.Connectly.showToast("Name and Username are required", "error");
        return;
      }
      
      const db = window.ConnectlyDB;
      const users = db.getUsers() || [];
      
      // Check username uniqueness
      const exists = users.some(u => u.username.toLowerCase() === newUsername && u.id !== user.id);
      if (exists) {
        window.Connectly.showToast("Username is already taken", "error");
        return;
      }
      
      // Update values
      user.name = newName;
      user.username = newUsername;
      user.bio = newBio;
      user.location = newLocation;
      user.website = newWebsite;
      if (newAvatar) user.avatar = newAvatar;
      
      // Save users list
      const updatedUsersList = users.map(u => u.id === user.id ? user : u);
      db.saveUsers(updatedUsersList);
      
      // Save current user state
      db.setCurrentUser(user);
      
      window.Connectly.showToast("Profile updated successfully!", "success");
      modal.classList.remove("active");
      
      // Refresh page elements and dynamic layout headers
      ProfileService.renderProfileDetails(user);
      ProfileService.renderProfilePosts(user);
      
      // Force history replace parameters
      window.history.replaceState({}, "", `./profile.html?username=${user.username}`);
      
      // Refresh navbar avatar
      const navAvatar = document.querySelector(".nav-avatar");
      if (navAvatar) navAvatar.src = user.avatar;
      const navName = document.querySelector(".nav-user-name");
      if (navName) navName.textContent = user.name;
      const navHandle = document.querySelector(".nav-user-handle");
      if (navHandle) navHandle.textContent = `@${user.username}`;
    };
  }
};

window.ConnectlyProfile = ProfileService;
