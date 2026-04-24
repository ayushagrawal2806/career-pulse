import { useLogin } from "../../hooks/Auth";
import type { AuthResponse } from "../../models/Auth";
import type { ErrorModel } from "../../models/Error";
import { useAppStore } from "../../store/useAppStore";
import "./Login.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Briefcase, Mail, Lock, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import type { ApiResponse } from "../../models/ApiResponse";

const Login = () => {
  const [email, setEmail] = useState("ayush@gmail.com");
  const [password, setPassword] = useState("password123");
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

  const { mutate, isPending } = useLogin(onSuccess, onError);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const payload = {
      email: email,
      password: password,
    };
    mutate(payload);
  };
  return (
    <div className="login-container">
      <div className="login-header-box">
        <Link to="/" className="login-logo">
          <div className="login-logo-icon">
            <Briefcase size={32} />
          </div>
          <span className="login-logo-text">CareerPulse</span>
        </Link>
        <h2 className="login-title">Welcome back</h2>
        <p className="login-sub">
          Or{" "}
          <Link to="/signup" className="login-link">
            create a new account
          </Link>
        </p>
      </div>

      <div className="login-form-card">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <form className="login-form" onSubmit={handleSubmit}>
            {error && <div className="form-error">{error}</div>}

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

            <div className="form-footer">
              <label className="remember-me">
                <input type="checkbox" />
                Remember me
              </label>
              <a href="#" className="forgot-pwd">
                Forgot password?
              </a>
            </div>

            <button type="submit" disabled={isPending} className="submit-btn">
              {isPending ? (
                "Logging in..."
              ) : (
                <>
                  Sign In <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
