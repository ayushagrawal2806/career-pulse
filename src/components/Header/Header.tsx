import { Link } from "react-router-dom";

import { Briefcase, User, LogOut } from "lucide-react";
import "./Header.css";
import { useAppStore } from "../../store/useAppStore";

export default function Header() {
  const user = useAppStore((state) => state.user);
  const logout = useAppStore((state) => state.logout);

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo-link">
          <div className="logo-icon">
            <Briefcase size={24} />
          </div>
          <span className="logo-text">CareerPulse</span>
        </Link>

        <nav className="nav-links">
          <Link to="/" className="nav-link">
            Browse Jobs
          </Link>
          {user?.role === "RECRUITER" && (
            <Link to="/post-job" className="nav-link">
              Post a Job
            </Link>
          )}
          {user && (
            <Link to="/dashboard" className="nav-link">
              {user.role === "RECRUITER" ? "Dashboard" : "My Applications"}
            </Link>
          )}
        </nav>

        <div className="header-actions">
          {user ? (
            <div className="auth-user-container">
              <Link to="/profile" className="user-profile-link">
                <User size={20} />
                <span className="user-name">{user.name || user.email}</span>
              </Link>
              <button onClick={logout} className="logout-btn" title="Logout">
                <LogOut size={20} />
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
        </div>
      </div>
    </header>
  );
}
