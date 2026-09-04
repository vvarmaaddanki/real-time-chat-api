import { useEffect, useState } from "react";
import axios from "axios";

import Sidebar from "./components/Sidebar.jsx";
import ChatWindow from "./components/ChatWindow.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Contact from "./pages/Contact.jsx";

// The main App component, which acts as the root of the application.
// It manages authentication state, user data, and the overall layout.
export default function App() {
  // State to track if a user is logged in. Initializes by checking for an access token in localStorage.
  const [loggedIn, setLoggedIn] = useState(
    !!localStorage.getItem("access")
  );
  // State to store the currently logged-in user's data.
  const [currentUser, setCurrentUser] = useState(null);
  // State to show a loading indicator while fetching the current user's data.
  const [loadingUser, setLoadingUser] = useState(true);
  // State to keep track of which user is selected for chatting.
  const [selectedUser, setSelectedUser] = useState(null);

  // State to control which authentication screen is shown: 'login', 'register', or 'contact'.
  const [authView, setAuthView] = useState("login"); // 'login' | 'register' | 'contact'

  // State to determine if the layout should be for mobile devices.
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  // State to toggle the visibility of the sidebar on mobile view.
  const [showSidebar, setShowSidebar] = useState(true);

  // Effect to fetch the current user's data when the `loggedIn` state changes.
  useEffect(() => {
    const fetchCurrentUser = async () => {
      // If not logged in, clear user data and stop loading.
      if (!loggedIn) {
        setCurrentUser(null);
        setLoadingUser(false);
        return;
      }

      try {
        // Fetch user data from the '/api/me/' endpoint using the stored token.
        const token = localStorage.getItem("access");
        const res = await axios.get("https://yashgarje31.pythonanywhere.com/api/me/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCurrentUser(res.data);
      } catch (err) {
        console.error("Error loading current user", err);
        // If the token is invalid or expired, log the user out.
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        setLoggedIn(false);
        setCurrentUser(null);
      } finally {
        // Always set loading to false after the attempt.
        setLoadingUser(false);
      }
    };

    fetchCurrentUser();
  }, [loggedIn]);

  // Handles the user logout process.
  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setLoggedIn(false);
    setCurrentUser(null);
    setSelectedUser(null);
    setAuthView("login");
  };

  // Effect to handle window resizing for responsive mobile/desktop layouts.
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setShowSidebar(true);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // === AUTHENTICATION SCREENS ===
  // If the user is not logged in, render the appropriate auth screen based on `authView` state.
  if (!loggedIn) {
    if (authView === "register") {
      return (
        <Register
          onRegistered={() => setAuthView("login")}
          onShowLogin={() => setAuthView("login")}
          onShowContact={() => setAuthView("contact")}
        />
      );
    }

    if (authView === "contact") {
      return (
        <Contact onBackToLogin={() => setAuthView("login")} />
      );
    }

    return (
      <Login
        onLogin={() => setLoggedIn(true)}
        onShowRegister={() => setAuthView("register")}
        onShowContact={() => setAuthView("contact")}
      />
    );
  }

  // Show a loading message while the user's data is being fetched.
  if (loadingUser || !currentUser) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <span>Loading...</span>
      </div>
    );
  }

  // === MAIN APPLICATION LAYOUT ===
  return (
    <div className="app-container d-flex flex-column">
      {/* Top navigation bar displaying user info and logout button. */}
      <nav className="navbar navbar-light bg-white border-bottom px-3">
        <span className="navbar-brand mb-0 h5">Realtime Chat</span>
        <div className="d-flex align-items-center gap-3">
          <span className="text-muted small">
            Logged in as <strong>{currentUser.username}</strong>
          </span>
          <button
            className="btn btn-sm btn-outline-danger"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main content area, which adapts based on screen size. */}
      {isMobile ? (
        // --- MOBILE LAYOUT: Toggles between Sidebar and ChatWindow. ---
        <div className="flex-grow-1">
          {showSidebar ? (
            <Sidebar
              currentUser={currentUser}
              selectedUser={selectedUser}
              onSelectUser={(user) => {
                setSelectedUser(user);
                setShowSidebar(false);
              }}
              isMobile={isMobile}
            />
          ) : (
            <ChatWindow
              currentUser={currentUser}
              otherUser={selectedUser}
              isMobile={isMobile}
              onBack={() => setShowSidebar(true)}
            />
          )}
        </div>
      ) : (
        // --- DESKTOP LAYOUT: Shows Sidebar and ChatWindow side-by-side. ---
        <div className="container-fluid flex-grow-1">
          <div className="row h-100">
            <div className="col-12 col-md-4 col-lg-3 p-0 border-end">
              <Sidebar
                currentUser={currentUser}
                selectedUser={selectedUser}
                onSelectUser={setSelectedUser}
                isMobile={false}
              />
            </div>
            <div className="col-12 col-md-8 col-lg-9 p-0 bg-light">
              <ChatWindow
                currentUser={currentUser}
                otherUser={selectedUser}
                isMobile={false}
                onBack={() => {}}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
