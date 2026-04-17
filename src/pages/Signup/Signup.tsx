import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Briefcase,
  Mail,
  Lock,
  User,
  UserCheck,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { motion } from "motion/react";
import "./Singup.css";
import { useSignup } from "../../hooks/Auth";
import type { AuthResponse, SignupRequest } from "../../models/Auth";
import { useAppStore } from "../../store/useAppStore";
import type { ErrorModel } from "../../models/Error";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<"SEEKER" | "RECRUITER">("SEEKER");
  const setAuth = useAppStore((s) => s.setAuth);

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const onSuccess = ({ data }: AuthResponse) => {
    setAuth(data.user, {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    });
    navigate("/");
  };

  const onError = (error: ErrorModel) => {
    setError(error.message);
  };

  const { mutate, isPending } = useSignup(onSuccess, onError);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: SignupRequest = {
      name: name,
      email: email,
      password: password,
      role: role,
    };
    mutate(payload);
  };

  return (
    <div className="signup-container">
      <div className="signup-header-box">
        <Link to="/" className="signup-logo">
          <div className="signup-logo-icon">
            <Briefcase size={32} />
          </div>
          <span className="signup-logo-text">CareerPulse</span>
        </Link>
        <h2 className="signup-title">Create your account</h2>
        <p className="signup-sub">
          Already have an account?{" "}
          <Link to="/login" className="signup-link">
            Sign in
          </Link>
        </p>
      </div>

      <div className="signup-form-card">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <form className="signup-form" onSubmit={handleSubmit}>
            {error && <div className="form-error">{error}</div>}

            <div className="role-selector">
              <button
                type="button"
                onClick={() => setRole("SEEKER")}
                className={`role-btn ${role === "SEEKER" ? "active" : ""}`}
              >
                <UserCheck className="role-icon" size={32} />
                <span className="role-name">Job Seeker</span>
                <span className="role-desc">Find your dream job</span>
              </button>
              <button
                type="button"
                onClick={() => setRole("RECRUITER")}
                className={`role-btn ${role === "RECRUITER" ? "active" : ""}`}
              >
                <ShieldCheck className="role-icon" size={32} />
                <span className="role-name">Recruiter</span>
                <span className="role-desc">Hire top talent</span>
              </button>
            </div>

            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div className="input-wrapper">
                <User className="input-icon-left" size={20} />
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="Enter name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email address</label>
              <div className="input-wrapper">
                <Mail className="input-icon-left" size={20} />
                <input
                  type="email"
                  required
                  className="form-input"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-wrapper">
                <Lock className="input-icon-left" size={20} />
                <input
                  type="password"
                  required
                  className="form-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" disabled={isPending} className="submit-btn">
              {isPending ? (
                "Creating account..."
              ) : (
                <>
                  Join CareerPulse <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;
