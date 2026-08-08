// Connectly - LocalStorage Data Layer & Mock Database

// Initial Demo Data Setup
const DEFAULT_USERS = [
  {
    id: "user-1",
    name: "Alex Johnson",
    username: "alexjohnson",
    email: "demo@connectly.com",
    password: "123456",
    bio: "Frontend Developer | Tech Enthusiast 💻 | Built with Connectly",
    location: "Bangalore, India",
    website: "https://alexjohnson.dev",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
    cover: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "user-2",
    name: "Sarah Williams",
    username: "sarahw",
    email: "sarah@connectly.com",
    password: "123456",
    bio: "Nature Photographer & Travel Blogger 📸. Exploring the world one step at a time.",
    location: "Vancouver, Canada",
    website: "https://sarahwtravels.com",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    cover: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "user-3",
    name: "Mike Smith",
    username: "mikesmith",
    email: "mike@connectly.com",
    password: "123456",
    bio: "Fitness Coach & Nutritionist 🥑. Helping you achieve your healthy lifestyle goals.",
    location: "Austin, Texas",
    website: "https://mikesmithfit.com",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    cover: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "user-4",
    name: "Emma Davis",
    username: "emmadavis",
    email: "emma@connectly.com",
    password: "123456",
    bio: "UI/UX Designer | Art Lover | Coffee Addict ☕🎨. Creating digital experiences.",
    location: "London, UK",
    website: "https://emmadavis.design",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80",
    cover: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "user-5",
    name: "John Wilson",
    username: "johnwilson",
    email: "john@connectly.com",
    password: "123456",
    bio: "Software Architect & Gamer 🎮. Interested in cloud computing and decentralized web.",
    location: "Seattle, Washington",
    website: "https://johnwilson.io",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80",
    cover: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "user-6",
    name: "Priya Sharma",
    username: "priyasharma",
    email: "priya@connectly.com",
    password: "123456",
    bio: "Writer, Poet, and Avid Reader 📚. Sharing thoughts on life, philosophy, and books.",
    location: "Mumbai, India",
    website: "https://priyawrites.com",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    cover: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "user-7",
    name: "David Brown",
    username: "davidbrown",
    email: "david@connectly.com",
    password: "123456",
    bio: "Musician & Coffee Enthusiast ☕🎸. Writing songs, performing gigs, and brewing espresso.",
    location: "Nashville, Tennessee",
    website: "https://davidbrownmusic.com",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    cover: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "user-8",
    name: "Sophia Martin",
    username: "sophiam",
    email: "sophia@connectly.com",
    password: "123456",
    bio: "Startup Founder & Angel Investor 💡. Passionate about sustainability, AI, and future tech.",
    location: "San Francisco, California",
    website: "https://sophiamartin.co",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
    cover: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80"
  }
];

const DEFAULT_POSTS = [
  {
    id: "post-1",
    userId: "user-1",
    text: "Just launched Connectly! 🚀 It's a lightweight, completely client-side social media platform using HTML, CSS, and Vanilla JS. Powered entirely by localStorage, rendering UI dynamically, and fully responsive! Let me know what you think!",
    image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80",
    date: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hours ago
    category: "Technology"
  },
  {
    id: "post-2",
    userId: "user-2",
    text: "Caught the sunrise this morning above the clouds. Absolutely breathtaking! Nature never ceases to amaze me. ⛰️🌅 #wanderlust #photography",
    image: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=800&q=80",
    date: new Date(Date.now() - 3600000 * 5).toISOString(), // 5 hours ago
    category: "Travel"
  },
  {
    id: "post-3",
    userId: "user-3",
    text: "Sunday morning meal prep done! 🥗 Prepped high-protein salads, roasted veggies, and healthy snacks for the busy week ahead. Planning is key to staying on track!",
    image: "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=800&q=80",
    date: new Date(Date.now() - 3600000 * 10).toISOString(), // 10 hours ago
    category: "Health & Fitness"
  },
  {
    id: "post-4",
    userId: "user-4",
    text: "Redesigning a landing page dashboard. Here's a sneak peek at the dark mode UI design. Focusing on micro-animations and typography. Feedbacks are welcome! 💻✨",
    image: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&w=800&q=80",
    date: new Date(Date.now() - 3600000 * 18).toISOString(),
    category: "Design"
  },
  {
    id: "post-5",
    userId: "user-5",
    text: "Just published an in-depth article on microservices architecture and service discovery mechanisms. Perfect read for your Sunday evening! Link in bio. 📚💻",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80",
    date: new Date(Date.now() - 3600000 * 24).toISOString(), // 1 day ago
    category: "Technology"
  },
  {
    id: "post-6",
    userId: "user-6",
    text: "\"Books are a uniquely portable magic.\" Currently re-reading classics and feeling inspired. What books are on your nightstand right now?",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80",
    date: new Date(Date.now() - 3600000 * 30).toISOString(),
    category: "Lifestyle"
  },
  {
    id: "post-7",
    userId: "user-7",
    text: "Spent the afternoon tracking acoustic guitars for the new EP. The studio vibe was just right. Can't wait to share this music with you all. 🎙️🎸",
    image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80",
    date: new Date(Date.now() - 3600000 * 36).toISOString(),
    category: "Music"
  },
  {
    id: "post-8",
    userId: "user-8",
    text: "Honored to speak at the Future of Food & AgTech conference today. Discussing clean meat, indoor farming, and sustainable investments. The energy was electric!",
    image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=80",
    date: new Date(Date.now() - 3600000 * 42).toISOString(),
    category: "Business"
  },
  {
    id: "post-9",
    userId: "user-2",
    text: "Wandering through the colorful, historic streets of Kyoto. Every corner tells a story. 🏮⛩️",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80",
    date: new Date(Date.now() - 3600000 * 48).toISOString(), // 2 days ago
    category: "Travel"
  },
  {
    id: "post-10",
    userId: "user-3",
    text: "Consistency over perfection. It doesn't matter how slow you go, as long as you do not stop. Hit a new personal best on squats today! 🏋️‍♂️💪",
    image: "",
    date: new Date(Date.now() - 3600000 * 52).toISOString(),
    category: "Health & Fitness"
  },
  {
    id: "post-11",
    userId: "user-4",
    text: "Quick abstract wireframe exploration for a new meditation app. Minimalist designs, warm tones, and plenty of white space. 🧘‍♀️✨",
    image: "https://images.unsplash.com/photo-1518655061766-48f23af0a6a6?auto=format&fit=crop&w=800&q=80",
    date: new Date(Date.now() - 3600000 * 60).toISOString(),
    category: "Design"
  },
  {
    id: "post-12",
    userId: "user-1",
    text: "JavaScript Tip of the Day: Use Optional Chaining (?.) to avoid \"Cannot read properties of undefined\" errors. It makes your code so much cleaner!",
    image: "",
    date: new Date(Date.now() - 3600000 * 70).toISOString(),
    category: "Technology"
  },
  {
    id: "post-13",
    userId: "user-6",
    text: "Drafting the first chapter of my upcoming novel. Writing is a process of discovery. Staring at a blank page is intimidating but thrilling.",
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80",
    date: new Date(Date.now() - 3600000 * 80).toISOString(), // 3 days ago
    category: "Lifestyle"
  },
  {
    id: "post-14",
    userId: "user-7",
    text: "Early morning coffee run. There is nothing like a fresh pour-over on a rainy Tuesday morning to get the creative juices flowing. ☕✨",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80",
    date: new Date(Date.now() - 3600000 * 90).toISOString(),
    category: "Lifestyle"
  },
  {
    id: "post-15",
    userId: "user-8",
    text: "Building a company is about building the right team. Surround yourself with people who challenge you, inspire you, and share your vision. 🚀💡",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
    date: new Date(Date.now() - 3600000 * 100).toISOString(),
    category: "Business"
  }
];

const DEFAULT_COMMENTS = [
  {
    id: "comment-1",
    postId: "post-1",
    userId: "user-4",
    text: "Wow, this looks really clean and fast! Love the UI design.",
    date: new Date(Date.now() - 3600000 * 1.5).toISOString()
  },
  {
    id: "comment-2",
    postId: "post-1",
    userId: "user-5",
    text: "Great job on utilizing localStorage database queries inside a client-side app. Super smart!",
    date: new Date(Date.now() - 3600000 * 1.2).toISOString()
  },
  {
    id: "comment-3",
    postId: "post-2",
    userId: "user-6",
    text: "This is stunning, Sarah! Which trail did you hike to get this shot?",
    date: new Date(Date.now() - 3600000 * 4.5).toISOString()
  },
  {
    id: "comment-4",
    postId: "post-2",
    userId: "user-2",
    text: "@priyasharma Thanks Priya! This is the Grouse Grind trail in Vancouver.",
    date: new Date(Date.now() - 3600000 * 4).toISOString()
  },
  {
    id: "comment-5",
    postId: "post-3",
    userId: "user-1",
    text: "Need this recipe! That quinoa salad looks amazing.",
    date: new Date(Date.now() - 3600000 * 8).toISOString()
  }
];

const DEFAULT_LIKES = [
  { userId: "user-2", postId: "post-1" },
  { userId: "user-3", postId: "post-1" },
  { userId: "user-4", postId: "post-1" },
  { userId: "user-5", postId: "post-1" },
  { userId: "user-1", postId: "post-2" },
  { userId: "user-6", postId: "post-2" },
  { userId: "user-1", postId: "post-3" },
  { userId: "user-2", postId: "post-3" },
  { userId: "user-1", postId: "post-4" },
  { userId: "user-4", postId: "post-5" },
  { userId: "user-8", postId: "post-5" }
];

const DEFAULT_FOLLOWERS = [
  { followerId: "user-2", followingId: "user-1" }, // Sarah follows Alex
  { followerId: "user-3", followingId: "user-1" }, // Mike follows Alex
  { followerId: "user-4", followingId: "user-1" }, // Emma follows Alex
  { followerId: "user-1", followingId: "user-2" }, // Alex follows Sarah
  { followerId: "user-6", followingId: "user-2" }, // Priya follows Sarah
  { followerId: "user-1", followingId: "user-4" }, // Alex follows Emma
  { followerId: "user-5", followingId: "user-4" }  // John follows Emma
];

const DEFAULT_NOTIFICATIONS = [
  {
    id: "notif-1",
    recipientId: "user-1",
    senderId: "user-2",
    type: "like",
    postId: "post-1",
    date: new Date(Date.now() - 3600000 * 1.9).toISOString(),
    isRead: false
  },
  {
    id: "notif-2",
    recipientId: "user-1",
    senderId: "user-4",
    type: "comment",
    postId: "post-1",
    commentText: "Wow, this looks really clean and fast! Love the UI design.",
    date: new Date(Date.now() - 3600000 * 1.5).toISOString(),
    isRead: false
  },
  {
    id: "notif-3",
    recipientId: "user-1",
    senderId: "user-3",
    type: "follow",
    date: new Date(Date.now() - 3600000 * 3).toISOString(),
    isRead: false
  }
];

// Helper database functions

// Core getter/setter abstractions
function getFromStorage(key, defaultData) {
  const data = localStorage.getItem(key);
  if (!data) {
    localStorage.setItem(key, JSON.stringify(defaultData));
    return defaultData;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    console.error(`Error parsing localStorage key: ${key}`, e);
    return defaultData;
  }
}

function saveToStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// Database APIs
const db = {
  getUsers: () => getFromStorage("connectly_users", DEFAULT_USERS),
  saveUsers: (users) => saveToStorage("connectly_users", users),

  getPosts: () => getFromStorage("connectly_posts", DEFAULT_POSTS),
  savePosts: (posts) => saveToStorage("connectly_posts", posts),

  getComments: () => getFromStorage("connectly_comments", DEFAULT_COMMENTS),
  saveComments: (comments) => saveToStorage("connectly_comments", comments),

  getLikes: () => getFromStorage("connectly_likes", DEFAULT_LIKES),
  saveLikes: (likes) => saveToStorage("connectly_likes", likes),

  getFollowers: () => getFromStorage("connectly_followers", DEFAULT_FOLLOWERS),
  saveFollowers: (followers) => saveToStorage("connectly_followers", followers),

  getNotifications: () => getFromStorage("connectly_notifications", DEFAULT_NOTIFICATIONS),
  saveNotifications: (notifications) => saveToStorage("connectly_notifications", notifications),

  getCurrentUser: () => {
    const user = localStorage.getItem("connectly_currentUser");
    if (!user) return null;
    try {
      return JSON.parse(user);
    } catch (e) {
      return null;
    }
  },
  setCurrentUser: (user) => {
    if (user) {
      localStorage.setItem("connectly_currentUser", JSON.stringify(user));
    } else {
      localStorage.removeItem("connectly_currentUser");
    }
  },

  // Initialize DB and ensure demo users are seeded
  init: () => {
    db.getUsers();
    db.getPosts();
    db.getComments();
    db.getLikes();
    db.getFollowers();
    db.getNotifications();
    // Default logged-in user if none is set
    if (!db.getCurrentUser()) {
      const users = db.getUsers();
      // Auto log in Alex Johnson (the first user) for a seamless demo experience!
      db.setCurrentUser(users[0]);
    }
  }
};

// Auto-run database seed initialization
db.init();

// Export to global scope for easy access from other script files
window.ConnectlyDB = db;
