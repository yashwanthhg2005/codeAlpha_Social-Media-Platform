// Connectly - Authentication & Session Management Logic

const auth = {
  // Check if a user is logged in, redirect to login if not
  checkAuth: () => {
    const db = window.ConnectlyDB;
    const currentUser = db.getCurrentUser();
    if (!currentUser) {
      window.location.href = "./login.html";
      return null;
    }
    return currentUser;
  },

  // Check if user is logged in, redirect to feed (for Login / Register pages)
  checkGuest: () => {
    const db = window.ConnectlyDB;
    const currentUser = db.getCurrentUser();
    if (currentUser) {
      window.location.href = "./index.html";
    }
  },

  // Perform login check
  login: (email, password) => {
    const db = window.ConnectlyDB;
    const users = db.getUsers() || [];
    
    // Find matching user
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    
    if (user) {
      db.setCurrentUser(user);
      window.Connectly.showToast(`Welcome back, ${user.name}!`, "success");
      return true;
    } else {
      window.Connectly.showToast("Invalid email or password", "error");
      return false;
    }
  },

  // Perform registration
  register: (name, username, email, password, confirmPassword, avatarUrl) => {
    const db = window.ConnectlyDB;
    const users = db.getUsers() || [];
    
    // Validation checks
    if (!name || !username || !email || !password || !confirmPassword) {
      window.Connectly.showToast("All fields except avatar are required", "error");
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      window.Connectly.showToast("Please enter a valid email address", "error");
      return false;
    }

    if (username.length < 3) {
      window.Connectly.showToast("Username must be at least 3 characters", "error");
      return false;
    }

    if (password.length < 6) {
      window.Connectly.showToast("Password must be at least 6 characters", "error");
      return false;
    }

    if (password !== confirmPassword) {
      window.Connectly.showToast("Passwords do not match", "error");
      return false;
    }

    // Check unique username
    const usernameExists = users.some(u => u.username.toLowerCase() === username.toLowerCase());
    if (usernameExists) {
      window.Connectly.showToast("Username is already taken", "error");
      return false;
    }

    // Check unique email
    const emailExists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
    if (emailExists) {
      window.Connectly.showToast("Email is already registered", "error");
      return false;
    }

    // Set default avatar if blank
    const avatar = avatarUrl.trim() || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80`;
    
    // Create new user object
    const newUser = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      username: username.trim().toLowerCase(),
      email: email.trim().toLowerCase(),
      password: password,
      bio: "Hello, I am new here on Connectly!",
      location: "",
      website: "",
      avatar: avatar,
      cover: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80"
    };

    // Save user to simulated DB
    users.push(newUser);
    db.saveUsers(users);
    
    // Automatically log in the user
    db.setCurrentUser(newUser);
    window.Connectly.showToast("Account created successfully!", "success");
    return true;
  }
};

window.ConnectlyAuth = auth;
