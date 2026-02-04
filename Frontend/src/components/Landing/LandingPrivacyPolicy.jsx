import React from "react";
import "../../assets/style/InfoPages.css";

const LandingPrivacyPolicy = () => {
  return (
    <section className="privacy-page">
      <div className="privacy-page-header">
        <h1 className="privacy-page-title">Privacy Policy</h1>
        <p className="privacy-page-subtitle">
          Your privacy and data security matter to us.
        </p>
      </div>

      <div className="privacy-page-content">
        <p className="privacy-page-text">
          HealthPilot is committed to protecting your personal information. We
          collect only the data necessary to provide quality healthcare services
          and never share your data without consent.
        </p>

        <p className="privacy-page-text">
          All user data is securely stored and processed according to industry
          standards and applicable privacy regulations.
        </p>
      </div>
    </section>
  );
};

export default LandingPrivacyPolicy;
