import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowRight, Lock, Mail } from "lucide-react";

import { useLogin } from "../../hooks/Auth";
import { useAppStore } from "../../store/useAppStore";

import type { AuthResponse } from "../../models/Auth";
import type { ErrorModel } from "../../models/Error";
import type { ApiResponse } from "../../models/ApiResponse";

import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

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

    mutate({
      email,
      password,
    });
  };

  return (
    <div className="login-container">
      <div className="login-header-box">
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
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
        >
          <form className="login-form" onSubmit={handleSubmit}>
            {error && <div className="login-form-error">{error}</div>}

            <div className="login-form-group">
              <label className="login-form-label">Email address</label>

              <div className="login-input-wrapper">
                <Mail size={20} className="login-input-icon-left" />

                <input
                  type="email"
                  required
                  value={email}
                  placeholder="Enter email"
                  className="login-form-input"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="login-form-group">
              <label className="login-form-label">Password</label>

              <div className="login-input-wrapper">
                <Lock size={20} className="login-input-icon-left" />

                <input
                  type="password"
                  required
                  value={password}
                  placeholder="••••••••"
                  className="login-form-input"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="login-form-footer">
              <label className="login-remember-me">
                <input type="checkbox" />
                Remember me
              </label>

              <a href="#" className="login-forgot-pwd">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="login-submit-btn"
            >
              {isPending ? (
                "Logging in..."
              ) : (
                <>
                  Sign In
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

export default Login;
