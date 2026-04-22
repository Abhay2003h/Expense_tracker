import React, { useState, useEffect } from "react";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { isAuthenticated, getCurrentUser, logout } from "./services/authService";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

/**
 * Root component — handles auth state, dark mode, and navigation.
 * Shows Login/Signup if not authenticated, Dashboard if logged in.
 */
function App() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });
  const [user, setUser] = useState(null);
  const [authPage, setAuthPage] = useState("login"); // "login" or "signup"

  // check if user is already logged in on mount
  useEffect(() => {
    if (isAuthenticated()) {
      setUser(getCurrentUser());
    }
  }, []);

  // persist dark mode preference
  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleSignup = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    setAuthPage("login");
  };

  // not logged in — show auth pages
  if (!user) {
    return (
      <div className={`app ${darkMode ? "dark" : ""}`}>
        <div className="auth-dark-toggle-wrap">
          <button
            className="btn btn-ghost btn-sm dark-toggle-floating"
            onClick={() => setDarkMode((prev) => !prev)}
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>

        {authPage === "login" ? (
          <Login
            onLogin={handleLogin}
            onSwitchToSignup={() => setAuthPage("signup")}
          />
        ) : (
          <Signup
            onSignup={handleSignup}
            onSwitchToLogin={() => setAuthPage("login")}
          />
        )}

        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          theme={darkMode ? "dark" : "light"}
        />
      </div>
    );
  }

  // logged in — show dashboard
  return (
    <div className={`app ${darkMode ? "dark" : ""}`}>
      <header className="app-header">
        <div className="header-content">
          <div className="header-left">
            <h1 className="app-title">Expense Tracker</h1>
          </div>
          <div className="header-right">
            <span className="user-greeting">Hi, {user.name}</span>
            <button
              className="btn btn-ghost btn-sm dark-toggle"
              onClick={() => setDarkMode((prev) => !prev)}
            >
              {darkMode ? "Light" : "Dark"}
            </button>
            <button className="btn btn-logout btn-sm" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="app-main">
        <Dashboard />
      </main>

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        theme={darkMode ? "dark" : "light"}
      />
    </div>
  );
}

export default App;
