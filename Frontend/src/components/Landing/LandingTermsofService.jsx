import React from "react";
import "../../assets/style/InfoPages.css";

const LandingTerms = () => {
  return (
    <section className="terms-page">
      <div className="terms-page-header">
        <h1 className="terms-page-title">Terms of Service</h1>
        <p className="terms-page-subtitle">
          Please read these terms carefully before using HealthPilot.
        </p>
      </div>

      <div className="terms-page-content">
        <p className="terms-page-text">
          By accessing or using HealthPilot, you agree to comply with these
          terms. Our platform is intended for informational and appointment
          management purposes only.
        </p>

        <p className="terms-page-text">
          HealthPilot is not responsible for medical outcomes. All medical
          decisions should be made in consultation with licensed professionals.
        </p>
      </div>
    </section>
  );
};

export default LandingTerms;
