import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Briefcase, LogOut, Menu, User, X } from "lucide-react";

import "./Header.css";
import { useAppStore } from "../../store/useAppStore";

export default function Header() {
  const user = useAppStore((state) => state.user);

  const logout = useAppStore((state) => state.logout);

  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setIsOpen(false);
  };

  const closeMenu = () => setIsOpen(false);

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo-link" onClick={closeMenu}>
          <div className="logo-icon">
            <Briefcase size={22} />
          </div>

          <span className="logo-text">CareerPulse</span>
        </Link>

        <nav className="nav-links">
          <Link to="/" className="nav-link">
            Browse Jobs
          </Link>

          {user?.role === "RECRUITER" && (
            <Link to="/post-job" className="nav-link">
              Post Job
            </Link>
          )}

          {user && (
            <Link to="/dashboard" className="nav-link">
              {user.role === "RECRUITER" ? "Dashboard" : "Applications"}
            </Link>
          )}

          {user?.role === "SEEKER" && (
            <Link to="/saved-jobs" className="nav-link">
              Saved Jobs
            </Link>
          )}
        </nav>

        <div className="header-actions">
          {user ? (
            <div className="auth-user-container">
              <Link to="/profile" className="user-profile-link">
                <User size={18} />

                <span className="user-name">{user.name || user.email}</span>
              </Link>

              <button
                title="Logout"
                onClick={handleLogout}
                className="logout-btn"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div className="auth-links">
              <Link to="/login" className="nav-link">
                Login
              </Link>

              <Link to="/signup" className="signup-btn">
                Sign Up
              </Link>
            </div>
          )}

          <button
            className="mobile-menu-btn"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <div className={`mobile-menu ${isOpen ? "mobile-menu-open" : ""}`}>
        <Link to="/" onClick={closeMenu} className="mobile-nav-link">
          Browse Jobs
        </Link>

        {user?.role === "RECRUITER" && (
          <Link to="/post-job" onClick={closeMenu} className="mobile-nav-link">
            Post Job
          </Link>
        )}

        {user && (
          <Link to="/dashboard" onClick={closeMenu} className="mobile-nav-link">
            {user.role === "RECRUITER" ? "Dashboard" : "My Applications"}
          </Link>
        )}

        {user?.role === "SEEKER" && (
          <Link
            to="/saved-jobs"
            onClick={closeMenu}
            className="mobile-nav-link"
          >
            Saved Jobs
          </Link>
        )}

        {!user && (
          <>
            <Link to="/login" onClick={closeMenu} className="mobile-nav-link">
              Login
            </Link>

            <Link
              to="/signup"
              onClick={closeMenu}
              className="mobile-signup-btn"
            >
              Sign Up
            </Link>
          </>
        )}

        {user && (
          <>
            <Link to="/profile" onClick={closeMenu} className="mobile-nav-link">
              Profile
            </Link>

            <button onClick={handleLogout} className="mobile-logout-btn">
              Logout
            </button>
          </>
        )}
      </div>
    </header>
  );
}
