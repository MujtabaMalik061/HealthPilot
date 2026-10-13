import React, { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Moon, Sun, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import "../assets/style/LandingPage.css";
import { IMAGES } from "../utils/constants";

const LandingLayout = () => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="landing-page-container">
      <a className="hp-skip-link" href="#main-content">Skip to content</a>
      <header className="landing-page-header">
        <div className="landing-page-header-inner">
          <Link to="/" className="landing-page-logo" aria-label="HealthPilot home">
            <div className="landing-page-logo-icon icon">
              <img src={IMAGES.SiteLogo} alt="" />
            </div>
            <span className="landing-page-logo-text">HealthPilot</span>
          </Link>

          <nav id="public-navigation" aria-label="Main navigation" className={`landing-page-nav ${menuOpen ? "hp-nav-open" : ""}`} onClick={() => setMenuOpen(false)}>
            <Link
              to="/"
              style={{
                color: location.pathname === "/" ? "var(--primary)" : "",
              }}
              className="landing-page-nav-link"
            >
              Home
            </Link>
            <Link
              style={{
                color:
                  location.pathname === "/landing-services"
                    ? "var(--primary)"
                    : "",
              }}
              to="/landing-services"
              className="landing-page-nav-link"
            >
              Services
            </Link>
            <Link
              style={{
                color:
                  location.pathname === "/landing-doctors"
                    ? "var(--primary)"
                    : "",
              }}
              to="/landing-doctors"
              className="landing-page-nav-link"
            >
              Doctors
            </Link>
            <Link
              style={{
                color: location.pathname === "/about" ? "var(--primary)" : "",
              }}
              to="/about"
              className="landing-page-nav-link"
            >
              About
            </Link>
          </nav>

          <div className="landing-page-header-actions">
            <button className="hp-menu-toggle" aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen} aria-controls="public-navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={22} /> : <Menu size={22} />}</button>
            <button
              aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
              onClick={toggleTheme}
              className="landing-page-icon-btn icon"
            >
              {theme === "dark" ? (
                <Sun className="landing-page-icon" />
              ) : (
                <Moon className="landing-page-icon" />
              )}
            </button>
            <button
              onClick={() => navigate("/signIn")}
              className="landing-page-btn landing-page-btn-ghost"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate("/signUp")}
              className="landing-page-btn landing-page-btn-primary"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>
      <div id={location.pathname === "/" ? undefined : "main-content"}><Outlet /></div>
      <footer className="landing-page-footer">
        <div className="landing-page-footer-inner">
          <div className="landing-page-footer-column">
            <div className="landing-page-logo">
              <div className="landing-page-logo-icon">
                <img src={IMAGES.SiteLogo} alt="" />
              </div>
              <span className="landing-page-logo-text">HealthPilot</span>
            </div>
            <p className="landing-page-footer-text">
              Your trusted partner in healthcare management.
            </p>
          </div>

          <div className="landing-page-footer-column">
            <h4 className="landing-page-footer-title">Services</h4>
            <ul className="landing-page-footer-list">
              <li>
                <Link to="/landing-services">All Services</Link>
              </li>
              <li>
                <Link to="/landing-doctors">Find Doctors</Link>
              </li>
              <li>
                <Link to="/about">About Us</Link>
              </li>
            </ul>
          </div>

          <div className="landing-page-footer-column">
            <h4 className="landing-page-footer-title">Company</h4>
            <ul className="landing-page-footer-list">
              <li>
                <Link to="/contact">Contact</Link>
              </li>
              <li>
                <Link to="/careers">Careers</Link>
              </li>
            </ul>
          </div>

          <div className="landing-page-footer-column">
            <h4 className="landing-page-footer-title">Legal</h4>
            <ul className="landing-page-footer-list">
              <li>
                <Link to="/privacy">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms">Terms of Service</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="landing-page-footer-bottom">
          © {new Date().getFullYear()} HealthPilot. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default LandingLayout;
