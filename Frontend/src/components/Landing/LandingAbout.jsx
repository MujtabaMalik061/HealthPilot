import React from "react";
import "../../assets/style/InfoPages.css";

const LandingAbout = () => {
  return (
    <section className="about-page">
      {/* Header */}
      <div className="about-page-header">
        <h1 className="about-page-title">About HealthPilot</h1>
        <p className="about-page-subtitle">
          Guiding you toward smarter, simpler healthcare.
        </p>
      </div>

      {/* Introduction */}
      <div className="about-page-intro">
        <p className="about-page-text">
          HealthPilot is a modern healthcare management platform designed to
          connect patients with trusted medical professionals. Our mission is to
          simplify healthcare access, improve communication, and ensure quality
          care for everyone.
        </p>
      </div>

      {/* Mission & Vision */}
      <div className="about-page-mission-vision">
        <div className="about-page-card">
          <h3 className="about-page-card-title">Our Mission</h3>
          <p className="about-page-card-text">
            To empower patients and healthcare providers with technology that
            makes healthcare accessible, efficient, and reliable.
          </p>
        </div>

        <div className="about-page-card">
          <h3 className="about-page-card-title">Our Vision</h3>
          <p className="about-page-card-text">
            A future where managing healthcare is effortless, transparent, and
            centered around patient well-being.
          </p>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="about-page-why">
        <h2 className="about-page-section-title">Why Choose HealthPilot?</h2>

        <div className="about-page-features">
          <div className="about-page-feature">
            <h4 className="about-page-feature-title">Trusted Professionals</h4>
            <p className="about-page-feature-text">
              Connect with experienced and verified doctors across multiple
              specialties.
            </p>
          </div>

          <div className="about-page-feature">
            <h4 className="about-page-feature-title">Easy Appointments</h4>
            <p className="about-page-feature-text">
              Book, manage, and track appointments with just a few clicks.
            </p>
          </div>

          <div className="about-page-feature">
            <h4 className="about-page-feature-title">Patient-Centered Care</h4>
            <p className="about-page-feature-text">
              Designed with patients in mind to ensure clarity, comfort, and
              control.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingAbout;
