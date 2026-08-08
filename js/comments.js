// Connectly - Comment Rendering & Management Controller

const CommentService = {
  // Render comments list for a specific post ID
  renderComments: (postId, containerId) => {
    const container = document.getElementById(containerId);
    if (!container) return;

    const db = window.ConnectlyDB;
    const currentUser = db.getCurrentUser();
    const users = db.getUsers() || [];
    const comments = db.getComments() || [];
    
    // Filter comments for this post
    const postComments = comments
      .filter(c => c.postId === postId)
      .sort((a, b) => new Date(a.date) - new Date(b.date)); // Oldest first (chronological order)

    if (postComments.length === 0) {
      container.innerHTML = `
        <div class="empty-state" style="padding: 24px; border: none;">
          <i class="far fa-comments empty-state-icon" style="font-size: 2rem;"></i>
          <h4 class="empty-state-title" style="font-size: 1rem;">No comments yet</h4>
          <p class="empty-state-text" style="font-size: 0.8rem;">Be the first to share your thoughts!</p>
        </div>
      `;
      return;
    }

    container.innerHTML = postComments.map(comment => {
      const commenter = users.find(u => u.id === comment.userId) || { name: "Deleted User", username: "deleted", avatar: "" };
      const isOwner = currentUser ? currentUser.id === comment.userId : false;
      
      const deleteBtnHtml = isOwner ? `
        <button class="btn-delete-comment" data-comment-id="${comment.id}" title="Delete comment">
          <i class="fas fa-trash-alt"></i>
        </button>
      ` : '';

      return `
        <div class="comment-item" id="comment-item-${comment.id}">
          <a href="./profile.html?username=${commenter.username}">
            <img src="${commenter.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}" alt="${commenter.name}">
          </a>
          <div class="comment-content">
            <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
              <span class="comment-author-name">
                <a href="./profile.html?username=${commenter.username}">${commenter.name}</a>
                <span style="font-weight: normal; color: var(--text-secondary); font-size: 0.75rem; margin-left: 4px;">@${commenter.username}</span>
              </span>
              ${deleteBtnHtml}
            </div>
            <p class="comment-text">${window.Connectly.escapeHTML(comment.text)}</p>
            <div class="comment-meta">
              <span>${window.Connectly.formatRelativeTime(comment.date)}</span>
            </div>
          </div>
        </div>
      `;
    }).join("");

    // Bind delete actions
    container.querySelectorAll(".btn-delete-comment").forEach(btn => {
      btn.addEventListener("click", () => {
        const commentId = btn.getAttribute("data-comment-id");
        CommentService.deleteComment(commentId, postId, containerId);
      });
    });
  },

  // Submit and save a new comment
  addComment: (postId, text, renderContainerId) => {
    const db = window.ConnectlyDB;
    const currentUser = db.getCurrentUser();
    
    if (!currentUser) {
      window.Connectly.showToast("Please log in to comment", "error");
      return false;
    }
    
    if (!text.trim()) {
      window.Connectly.showToast("Comment cannot be empty", "error");
      return false;
    }

    const comments = db.getComments() || [];
    const posts = db.getPosts() || [];
    
    const newComment = {
      id: `comment-${Date.now()}`,
      postId: postId,
      userId: currentUser.id,
      text: text.trim(),
      date: new Date().toISOString()
    };

    comments.push(newComment);
    db.saveComments(comments);

    window.Connectly.showToast("Comment added!", "success");
    
    // Create notification for post owner
    const post = posts.find(p => p.id === postId);
    if (post && post.userId !== currentUser.id) {
      const notifications = db.getNotifications() || [];
      notifications.push({
        id: `notif-${Date.now()}`,
        recipientId: post.userId,
        senderId: currentUser.id,
        type: "comment",
        postId: postId,
        commentText: text.trim(),
        date: new Date().toISOString(),
        isRead: false
      });
      db.saveNotifications(notifications);
    }

    // Refresh display
    CommentService.renderComments(postId, renderContainerId);
    
    // Update comment counter in details card if exists
    const counterElement = document.getElementById("details-comment-count");
    if (counterElement) {
      const currentCommentsCount = comments.filter(c => c.postId === postId).length;
      counterElement.textContent = currentCommentsCount;
    }
    
    return true;
  },

  // Delete comment from database and view
  deleteComment: (commentId, postId, renderContainerId) => {
    const db = window.ConnectlyDB;
    const currentUser = db.getCurrentUser();
    if (!currentUser) return;

    let comments = db.getComments() || [];
    const comment = comments.find(c => c.id === commentId);
    
    if (!comment) return;

    // Security check: Only author can delete comment
    if (comment.userId !== currentUser.id) {
      window.Connectly.showToast("Unauthorized to delete this comment", "error");
      return;
    }

    comments = comments.filter(c => c.id !== commentId);
    db.saveComments(comments);
    
    window.Connectly.showToast("Comment deleted", "success");
    
    // Refresh display
    CommentService.renderComments(postId, renderContainerId);
    
    // Update comment counter in details card if exists
    const counterElement = document.getElementById("details-comment-count");
    if (counterElement) {
      const currentCommentsCount = comments.filter(c => c.postId === postId).length;
      counterElement.textContent = currentCommentsCount;
    }
  }
};

window.ConnectlyComments = CommentService;
