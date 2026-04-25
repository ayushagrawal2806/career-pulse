import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import {
  ArrowRight,
  Lock,
  Mail,
  ShieldCheck,
  User,
  UserCheck,
} from "lucide-react";

import { useSignup } from "../../hooks/Auth";
import { useAppStore } from "../../store/useAppStore";

import type { AuthResponse, SignupRequest } from "../../models/Auth";
import type { ErrorModel } from "../../models/Error";
import type { ApiResponse } from "../../models/ApiResponse";

import "./Signup.css";

const Signup = () => {
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [name, setName] = useState("");

  const [role, setRole] = useState<"SEEKER" | "RECRUITER">("SEEKER");

  const [error, setError] = useState("");

  const navigate = useNavigate();

  const setAuth = useAppStore((state) => state.setAuth);

  const onSuccess = (response: ApiResponse<AuthResponse>) => {
    const { data } = response;

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload: SignupRequest = {
      name,
      email,
      password,
      role,
    };

    mutate(payload);
  };

  return (
    <div className="signup-container">
      <div className="signup-header-box">
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
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
        >
          <form className="signup-form" onSubmit={handleSubmit}>
            {error && <div className="signup-form-error">{error}</div>}

            <div className="signup-role-selector">
              <button
                type="button"
                onClick={() => setRole("SEEKER")}
                className={`signup-role-btn ${
                  role === "SEEKER" ? "active" : ""
                }`}
              >
                <UserCheck size={32} className="signup-role-icon" />

                <span className="signup-role-name">Job Seeker</span>

                <span className="signup-role-desc">Find your dream job</span>
              </button>

              <button
                type="button"
                onClick={() => setRole("RECRUITER")}
                className={`signup-role-btn ${
                  role === "RECRUITER" ? "active" : ""
                }`}
              >
                <ShieldCheck size={32} className="signup-role-icon" />

                <span className="signup-role-name">Recruiter</span>

                <span className="signup-role-desc">Hire top talent</span>
              </button>
            </div>

            <div className="signup-form-group">
              <label className="signup-form-label">Full Name</label>

              <div className="signup-input-wrapper">
                <User size={20} className="signup-input-icon-left" />

                <input
                  type="text"
                  required
                  value={name}
                  placeholder="Enter name"
                  className="signup-form-input"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <div className="signup-form-group">
              <label className="signup-form-label">Email address</label>

              <div className="signup-input-wrapper">
                <Mail size={20} className="signup-input-icon-left" />

                <input
                  type="email"
                  required
                  value={email}
                  placeholder="Enter email"
                  className="signup-form-input"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="signup-form-group">
              <label className="signup-form-label">Password</label>

              <div className="signup-input-wrapper">
                <Lock size={20} className="signup-input-icon-left" />

                <input
                  type="password"
                  required
                  value={password}
                  placeholder="••••••••"
                  className="signup-form-input"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="signup-submit-btn"
            >
              {isPending ? (
                "Creating account..."
              ) : (
                <>
                  Join CareerPulse
                  <ArrowRight size={18} />
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
