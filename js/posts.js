// Connectly - Post Service and Card Rendering Controller

const PostService = {
  // Render list of posts to a target container
  renderFeed: (posts, containerId, categoryFilter = null) => {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const db = window.ConnectlyDB;
    const users = db.getUsers() || [];
    const likes = db.getLikes() || [];
    const comments = db.getComments() || [];
    const followers = db.getFollowers() || [];
    const currentUser = db.getCurrentUser();
    
    // Sort posts by date descending
    let filteredPosts = [...posts].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Filter by category if set
    if (categoryFilter) {
      filteredPosts = filteredPosts.filter(p => p.category === categoryFilter);
    }
    
    if (filteredPosts.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <i class="far fa-frown empty-state-icon"></i>
          <h3 class="empty-state-title">No posts found</h3>
          <p class="empty-state-text">Be the first to share something with the community!</p>
        </div>
      `;
      return;
    }
    
    container.innerHTML = filteredPosts.map(post => {
      const author = users.find(u => u.id === post.userId) || { name: "Deleted User", username: "deleted", avatar: "" };
      const isLiked = currentUser ? likes.some(l => l.userId === currentUser.id && l.postId === post.id) : false;
      const postLikesCount = likes.filter(l => l.postId === post.id).length;
      const postCommentsCount = comments.filter(c => c.postId === post.id).length;
      
      // Follow button status
      const isFollowing = currentUser ? followers.some(f => f.followerId === currentUser.id && f.followingId === post.userId) : false;
      const isSelf = currentUser ? currentUser.id === post.userId : true;
      
      const followBtnHtml = isSelf ? '' : `
        <button class="btn-post-follow ${isFollowing ? 'following' : ''}" data-author-id="${post.userId}">
          ${isFollowing ? 'Following' : 'Follow'}
        </button>
      `;

      return `
        <article class="post-card" id="post-card-${post.id}">
          <div class="post-header">
            <div class="post-author-info">
              <a href="./profile.html?username=${author.username}">
                <img src="${author.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}" class="post-author-avatar" alt="${author.name}">
              </a>
              <div class="post-author-details">
                <span class="post-author-name">
                  <a href="./profile.html?username=${author.username}">${author.name}</a>
                </span>
                <div class="post-meta-row">
                  <span class="post-author-handle">@${author.username}</span>
                  <span class="post-time">${window.Connectly.formatRelativeTime(post.date)}</span>
                  ${post.category ? `<span class="post-category-tag">${window.Connectly.escapeHTML(post.category)}</span>` : ''}
                </div>
              </div>
            </div>
            <div class="post-header-right">
              ${followBtnHtml}
            </div>
          </div>
          
          <div class="post-body" onclick="window.location.href='./post.html?id=${post.id}'" style="cursor: pointer;">
            ${window.Connectly.escapeHTML(post.text)}
          </div>
          
          ${post.image ? `
            <div class="post-image-wrapper" onclick="window.location.href='./post.html?id=${post.id}'" style="cursor: pointer;">
              <img src="${post.image}" class="post-image" alt="Post attachment">
            </div>
          ` : ''}
          
          <div class="post-footer">
            <div class="post-stats">
              <button class="post-stat-btn btn-like ${isLiked ? 'liked' : ''}" data-post-id="${post.id}">
                <i class="far fa-heart"></i>
                <span class="like-count">${postLikesCount}</span>
              </button>
              <button class="post-stat-btn btn-comment" onclick="window.location.href='./post.html?id=${post.id}'">
                <i class="far fa-comment"></i>
                <span class="comment-count">${postCommentsCount}</span>
              </button>
            </div>
            
            <button class="post-stat-btn btn-share" data-post-id="${post.id}">
              <i class="far fa-share-square"></i>
              <span>Share</span>
            </button>
          </div>
        </article>
      `;
    }).join("");
    
    // Bind click events for interactive buttons
    PostService.bindFeedActions(container);
  },

  // Bind click handlers to interactive elements inside feed container
  bindFeedActions: (container) => {
    const db = window.ConnectlyDB;
    const currentUser = db.getCurrentUser();
    
    if (!currentUser) return; // Read-only if guest

    // Like buttons
    container.querySelectorAll(".btn-like").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const postId = btn.getAttribute("data-post-id");
        PostService.toggleLike(postId, btn);
      });
    });

    // Follow buttons
    container.querySelectorAll(".btn-post-follow").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const authorId = btn.getAttribute("data-author-id");
        PostService.toggleFollow(authorId, btn);
      });
    });

    // Share buttons
    container.querySelectorAll(".btn-share").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const postId = btn.getAttribute("data-post-id");
        const shareUrl = `${window.location.origin}${window.location.pathname.replace(/\/[^\/]*$/, '')}/post.html?id=${postId}`;
        
        navigator.clipboard.writeText(shareUrl).then(() => {
          window.Connectly.showToast("Link copied to clipboard!", "success");
        }).catch(err => {
          window.Connectly.showToast("Could not copy link", "error");
        });
      });
    });
  },

  // Toggle Like state in LocalStorage and DOM
  toggleLike: (postId, buttonElement) => {
    const db = window.ConnectlyDB;
    const currentUser = db.getCurrentUser();
    if (!currentUser) return;

    let likes = db.getLikes() || [];
    const posts = db.getPosts() || [];
    const isLiked = likes.some(l => l.userId === currentUser.id && l.postId === postId);
    const countSpan = buttonElement.querySelector(".like-count");
    let currentCount = parseInt(countSpan.textContent);

    if (isLiked) {
      // Unlike
      likes = likes.filter(l => !(l.userId === currentUser.id && l.postId === postId));
      db.saveLikes(likes);
      
      buttonElement.classList.remove("liked");
      countSpan.textContent = Math.max(0, currentCount - 1);
      window.Connectly.showToast("Unliked post", "success");
    } else {
      // Like
      likes.push({ userId: currentUser.id, postId: postId });
      db.saveLikes(likes);
      
      buttonElement.classList.add("liked");
      countSpan.textContent = currentCount + 1;
      window.Connectly.showToast("Post liked!", "success");
      
      // Create notification
      const post = posts.find(p => p.id === postId);
      if (post && post.userId !== currentUser.id) {
        const notifications = db.getNotifications() || [];
        notifications.push({
          id: `notif-${Date.now()}`,
          recipientId: post.userId,
          senderId: currentUser.id,
          type: "like",
          postId: postId,
          date: new Date().toISOString(),
          isRead: false
        });
        db.saveNotifications(notifications);
      }
    }
  },

  // Toggle Follow state in LocalStorage and feed DOM
  toggleFollow: (followingId, buttonElement) => {
    const db = window.ConnectlyDB;
    const currentUser = db.getCurrentUser();
    if (!currentUser) return;

    let followers = db.getFollowers() || [];
    const isFollowing = followers.some(f => f.followerId === currentUser.id && f.followingId === followingId);
    
    // Find target user details
    const users = db.getUsers() || [];
    const followingUser = users.find(u => u.id === followingId);

    if (isFollowing) {
      // Unfollow
      followers = followers.filter(f => !(f.followerId === currentUser.id && f.followingId === followingId));
      db.saveFollowers(followers);
      
      // Update all follow buttons for this user on the page
      document.querySelectorAll(`[data-author-id="${followingId}"]`).forEach(btn => {
        btn.textContent = "Follow";
        btn.classList.remove("following");
      });
      window.Connectly.showToast(`Unfollowed ${followingUser ? followingUser.name : 'user'}`, "success");
    } else {
      // Follow
      followers.push({ followerId: currentUser.id, followingId: followingId });
      db.saveFollowers(followers);
      
      // Update all follow buttons for this user on the page
      document.querySelectorAll(`[data-author-id="${followingId}"]`).forEach(btn => {
        btn.textContent = "Following";
        btn.classList.add("following");
      });
      window.Connectly.showToast(`Following ${followingUser ? followingUser.name : 'user'}`, "success");
      
      // Create notification
      const notifications = db.getNotifications() || [];
      notifications.push({
        id: `notif-${Date.now()}`,
        recipientId: followingId,
        senderId: currentUser.id,
        type: "follow",
        date: new Date().toISOString(),
        isRead: false
      });
      db.saveNotifications(notifications);
    }
  },

  // Create & Publish a new post
  createPost: (text, imageUrl, category) => {
    const db = window.ConnectlyDB;
    const currentUser = db.getCurrentUser();
    if (!currentUser) return false;

    if (!text.trim()) {
      window.Connectly.showToast("Post text cannot be empty", "error");
      return false;
    }

    const posts = db.getPosts() || [];
    const newPost = {
      id: `post-${Date.now()}`,
      userId: currentUser.id,
      text: text.trim(),
      image: imageUrl.trim(),
      date: new Date().toISOString(),
      category: category.trim()
    };

    posts.unshift(newPost);
    db.savePosts(posts);
    
    window.Connectly.showToast("Post published successfully!", "success");
    return true;
  }
};

window.ConnectlyPosts = PostService;
