import React from "react";
import {
  Stethoscope,
  Calendar,
  Users,
  Shield,
  Clock,
  Heart,
  Star,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../assets/style/LandingPage.css";

export const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page-container">
      <section className="landing-page-hero">
        <div className="landing-page-hero-inner">
          <div className="landing-page-hero-badge">
            <Heart color="var(--primary)" className="landing-page-icon-small" />
            Trusted by 15,000+ patients
          </div>

          <h1 className="landing-page-hero-title">
            Find & Book the{" "}
            <span className="landing-page-text-primary">Best Doctors</span> for
            Your Health
          </h1>
          <p className="landing-page-hero-subtitle">
            Access top healthcare professionals, book appointments instantly,
            and manage your health journey all in one place.
          </p>

          <div className="landing-page-hero-cta">
            <button
              onClick={() => navigate("/landing-services")}
              className="landing-page-btn landing-page-btn-primary"
            >
              <ShieldCheck className="landing-page-icon-small icon" />
              View Services
            </button>
            <button
              onClick={() => navigate("/landing-doctors")}
              className="landing-page-btn landing-page-btn-outline"
            >
              <Stethoscope className="landing-page-icon-small icon" />
              View Doctors
            </button>
          </div>
        </div>
      </section>

      <section className="landing-page-stats">
        <div className="landing-page-section-header">
          <h2 className="landing-page-section-title">
            Trusted Healthcare at a Glance
          </h2>
          <p className="landing-page-section-subtitle">
            Numbers that reflect our commitment to quality care and patient
            satisfaction.
          </p>
        </div>
        <div className="landing-page-stats-inner">
          <div className="landing-page-stat">
            <div className="landing-page-stat-icon-wrapper">
              <Stethoscope className="landing-page-icon-stat icon" />
            </div>
            <div>
              <p className="landing-page-stat-value">200+</p>
              <p className="landing-page-stat-label">Expert Doctors</p>
            </div>
          </div>

          <div className="landing-page-stat">
            <div className="landing-page-stat-icon-wrapper">
              <Users className="landing-page-icon-stat icon" />
            </div>
            <div>
              <p className="landing-page-stat-value">15K+</p>
              <p className="landing-page-stat-label">Happy Patients</p>
            </div>
          </div>

          <div className="landing-page-stat">
            <div className="landing-page-stat-icon-wrapper">
              <Calendar className="landing-page-icon-stat icon" />
            </div>
            <div>
              <p className="landing-page-stat-value">50K+</p>
              <p className="landing-page-stat-label">Appointments</p>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-page-features">
        <div className="landing-page-features-inner">
          <div className="landing-page-section-header">
            <h2 className="landing-page-section-title">
              Why Choose HealthPilot?
            </h2>
            <p className="landing-page-section-subtitle">
              Experience healthcare management that puts your needs first.
            </p>
          </div>

          <div className="landing-page-features-grid">
            <div className="landing-page-feature-card">
              <div className="landing-page-feature-icon-wrapper">
                <Stethoscope className="landing-page-icon-feature icon" />
              </div>
              <h3 className="landing-page-feature-title">Expert Doctors</h3>
              <p className="landing-page-feature-desc">
                Access to highly qualified healthcare professionals across all
                specializations.
              </p>
            </div>

            <div className="landing-page-feature-card">
              <div className="landing-page-feature-icon-wrapper">
                <Calendar className="landing-page-icon-feature icon" />
              </div>
              <h3 className="landing-page-feature-title">Easy Scheduling</h3>
              <p className="landing-page-feature-desc">
                Book appointments online in seconds, 24/7 availability.
              </p>
            </div>

            <div className="landing-page-feature-card">
              <div className="landing-page-feature-icon-wrapper">
                <Shield className="landing-page-icon-feature icon" />
              </div>
              <h3 className="landing-page-feature-title">Secure Records</h3>
              <p className="landing-page-feature-desc">
                Your health records are encrypted and securely stored.
              </p>
            </div>

            <div className="landing-page-feature-card">
              <div className="landing-page-feature-icon-wrapper">
                <Clock className="landing-page-icon-feature icon" />
              </div>
              <h3 className="landing-page-feature-title">Quick Response</h3>
              <p className="landing-page-feature-desc">
                Fast appointment confirmations and minimal waiting times.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-page-testimonials">
        <div className="landing-page-testimonials-inner">
          <div className="landing-page-section-header">
            <h2 className="landing-page-section-title">What Our Users Say</h2>
            <p className="landing-page-section-subtitle">
              Trusted by thousands of patients and healthcare professionals.
            </p>
          </div>

          <div className="landing-page-testimonials-grid">
            <div className="landing-page-testimonial-card">
              <div className="landing-page-testimonial-rating">
                <Star className="landing-page-icon-star icon" />
                <Star className="landing-page-icon-star icon" />
                <Star className="landing-page-icon-star icon" />
                <Star className="landing-page-icon-star icon" />
                <Star className="landing-page-icon-star icon" />
              </div>
              <p className="landing-page-testimonial-content">
                "HealthPilot made finding a specialist so easy. The booking
                process was seamless!"
              </p>
              <p className="landing-page-testimonial-name">Sarah Johnson</p>
              <p className="landing-page-testimonial-role">Patient</p>
            </div>

            <div className="landing-page-testimonial-card">
              <div className="landing-page-testimonial-rating">
                <Star className="landing-page-icon-star icon" />
                <Star className="landing-page-icon-star icon" />
                <Star className="landing-page-icon-star icon" />
                <Star className="landing-page-icon-star icon" />
                <Star className="landing-page-icon-star icon" />
              </div>
              <p className="landing-page-testimonial-content">
                "As a doctor, this platform has streamlined my practice
                management significantly."
              </p>
              <p className="landing-page-testimonial-name">Dr. Michael Chen</p>
              <p className="landing-page-testimonial-role">Cardiologist</p>
            </div>

            <div className="landing-page-testimonial-card">
              <div className="landing-page-testimonial-rating">
                <Star className="landing-page-icon-star icon" />
                <Star className="landing-page-icon-star icon" />
                <Star className="landing-page-icon-star icon" />
                <Star className="landing-page-icon-star icon" />
                <Star className="landing-page-icon-star icon" />
              </div>
              <p className="landing-page-testimonial-content">
                "I love how I can track all my appointments and medical history
                in one place."
              </p>
              <p className="landing-page-testimonial-name">Emily Davis</p>
              <p className="landing-page-testimonial-role">Patient</p>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-page-cta">
        <div className="landing-page-cta-inner">
          <h2 className="landing-page-cta-title">
            Ready to Take Control of Your Health?
          </h2>
          <p className="landing-page-cta-subtitle">
            Join thousands of patients who trust HealthPilot for their
            healthcare needs.
          </p>
          <button
            onClick={() => navigate("/signUp")}
            className="landing-page-btn landing-page-btn-secondary landing-page-cta-btn"
          >
            Get Started Free
            <ArrowRight className="landing-page-icon-small icon" />
          </button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
