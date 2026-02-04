import React, { useState } from "react";
import "../assets/style/Auth.css";
import { Input } from "../components/CustomComponents";
import { ArrowRight, Lock, Mail } from "lucide-react";
import { IMAGES } from "../utils/constants";
import { useNavigate } from "react-router-dom";
import ResetPasswordModel from "./ResetPasswordModel";

const SignIn = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isForget, setIsForget] = useState(false);

  const handleSignIn = () => {};

  return (
    <div className="auth-container">
      <div className="auth-left">
        <div className="auth-card">
          <div className="auth-logo">
            <div className="landing-page-logo-icon icon">
              <img src={IMAGES.SiteLogo} alt="" />
            </div>
            <span className="auth-logo-text">HealthPilot</span>
          </div>

          <h2 className="auth-title">Welcome back</h2>
          <p className="auth-subtitle">
            Don&apos;t have an account?{" "}
            <span onClick={() => navigate("/signUp")} className="auth-link">
              Sign up for free
            </span>
          </p>

          <div className="auth-form">
            <Input
              label="Email address"
              value={email}
              setValue={setEmail}
              placeholder="you@example.com"
              type="inputIcon"
              Icon={Mail}
              InputType="email"
            />

            <Input
              label="Password"
              value={password}
              setValue={setPassword}
              placeholder="••••••••"
              type="inputIcon"
              Icon={Lock}
              InputType="password"
            />

            <div className="auth-options">
              <label className="auth-remember">
                <input type="checkbox" />
                Remember me
              </label>
              <span onClick={() => setIsForget(true)} className="auth-link">
                Forgot password?
              </span>
            </div>

            <button onClick={handleSignIn} className="auth-btn-primary">
              Sign in{" "}
              <span className="icon">
                <ArrowRight size={16} />
              </span>
            </button>

            <p className="auth-demo">
              Demo: Use <b>doctor@</b> for Doctor role, <b>admin@</b> for Admin
              role, or any other email for Patient role.
            </p>
          </div>
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-right-content">
          <h1>Your Health, Our Priority</h1>
          <p>
            Access world-class healthcare services at your fingertips. Book
            appointments, manage records, and connect with specialists.
          </p>
        </div>
      </div>
      {isForget && <ResetPasswordModel onClose={() => setIsForget(false)} />}
    </div>
  );
};

export default SignIn;
