# Connectly

**"Connect. Share. Discover."**

Connectly is a lightweight, modern, and fully responsive mini social media platform built using **pure client-side HTML, CSS, and Vanilla JavaScript**.

This platform is completely serverless and runs entirely inside the web browser by storing and retrieving data from `localStorage`. It simulates active profiles, posts, likes, comment threads, follow systems, and interactive notification events. It is perfectly optimized for **GitHub Pages** deployment or local execution.

---

## 🚀 Features

*   **Authentication & Session Guards:** Custom register and login page validations with auto-login support. Fully simulated user sessions.
*   **Sticky Navbar & Mobile Menu:** Sticky desktop header bar with mobile-friendly hamburger slides.
*   **Dynamic Social Feed:** Home feed rendering story rings, posts with categories, cover attachments, and interactive buttons.
*   **Interactive Like System:** Real-time toggling of likes with database state preservation and pop scale heart animations.
*   **Nested Comment Threads:** Complete comments view on single posts, allowing comment writing and owners to delete their own commentary.
*   **Follow / Unfollow System:** Dynamic social graphs allowing follow linkages. View count statistics updates immediately on user profiles.
*   **Search Engine:** Input filtering matches search queries across users, handles, and posts content with direct click dropdowns.
*   **Explore Page:** Filtering feed posts by categories (Technology, Design, Travel, etc.) alongside recommended popular creators lists.
*   **Notifications Hub:** Logs actions (likes, comments, follows) and shows unread badges on the navigation bar.
*   **Custom Profiles Editor:** Display cover banners, avatars, bios, links, and locations. Includes a modal form for live edits.
*   **Toast Notifications:** Reusable, animated screen-toast alerts with sliding timers for success or error logs.

---

## 🛠️ Technologies

*   **HTML5:** Structured semantic markup.
*   **CSS3:** Cohesive responsive design system using CSS custom properties, grid layouts, and smooth animations.
*   **Vanilla JavaScript (ES6+):** Component rendering, routing, search querying, and event bindings.
*   **Browser LocalStorage:** Local databases serialization representing users, posts, comments, likes, followers, and notifications tables.
*   **FontAwesome CDN:** Premium icons rendering.

---

## 💻 How to Run Locally

Since the application requires no backend server or Node modules, you can run it directly:

1.  **Download or Clone** this repository workspace to your local system.
2.  Open the root directory in your file explorer.
3.  Double-click the **`index.html`** file, or right-click and select **Open with browser** (Chrome, Firefox, Edge, Safari).
4.  The application will automatically initialize the `localStorage` database with **8 demo users** and **15 default posts** and log you in as `Alex Johnson` to showcase the active features immediately.

### Demo Credentials
To test registration and login, you can log out and use:
*   **Email:** `demo@connectly.com`
*   **Password:** `123456`

---

## 🌐 GitHub Pages Deployment

To deploy this project to the web for free using GitHub Pages, follow these steps:

1.  **Create a GitHub Repository:**
    *   Go to [github.com](https://github.com) and create a new public repository named `connectly` (or any name).
2.  **Upload Project Files:**
    *   Upload all project files directly to the root of the repository (including `index.html`, `/css`, `/js`, and this `README.md`). Ensure files are not inside a subfolder.
3.  **Enable GitHub Pages:**
    *   In your GitHub repository web page, go to the **Settings** tab.
    *   Under the left-hand menu, click **Pages**.
    *   Under **Build and deployment → Branch**, select the `main` (or `master`) branch and directory `/ (root)`.
    *   Click **Save**.
4.  **View Live Application:**
    *   After a few minutes, refresh the Pages settings menu.
    *   You will see your live URL: `https://<your-username>.github.io/connectly/`. Click the link to open your live web application!

---

## 🔒 Security & Educational Notice

> [!WARNING]
> This project is designed strictly for educational and demonstration purposes.
> 
> *   **Simulated Security:** All user credentials, passwords, and sessions are saved inside browser `localStorage` as unencrypted text.
> *   **No Backend Security:** This platform does not provide real server-side authentication, database encryption, hash salting, or web safety features.
> *   **Production Warning:** Never input real passwords or production-sensitive personal information into this application.
