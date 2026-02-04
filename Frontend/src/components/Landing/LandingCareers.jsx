import React from "react";
import "../../assets/style/InfoPages.css";

const LandingCareers = () => {
  return (
    <section className="careers-page">
      <div className="careers-page-header">
        <h1 className="careers-page-title">Careers at HealthPilot</h1>
        <p className="careers-page-subtitle">
          Join us in shaping the future of healthcare.
        </p>
      </div>

      <div className="careers-page-content">
        <p className="careers-page-text">
          At HealthPilot, we believe in innovation, collaboration, and making a
          real impact. We’re always looking for passionate individuals to grow
          with us.
        </p>

        <div className="careers-page-roles">
          <div className="careers-page-role">
            <h4>Frontend Developer</h4>
            <p>Build intuitive and user-friendly healthcare interfaces.</p>
          </div>

          <div className="careers-page-role">
            <h4>Backend Engineer</h4>
            <p>Design scalable and secure healthcare systems.</p>
          </div>

          <div className="careers-page-role">
            <h4>Healthcare Consultant</h4>
            <p>Work with medical professionals to improve patient care.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingCareers;
