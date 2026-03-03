import React, { useState } from "react";
import OTP from "./OTP";
import NewPassword from "./NewPassword";
import ResetPasswordModel from "./ResetPasswordModel";
import { CheckCircle2 } from "lucide-react";

const ForgetPasswordParent = ({ onClose }) => {
  const [modelType, setModelType] = useState("forget");
  const [email, setEmail] = useState("");

  const titles = {
    otp: "Enter Otp",
    newPassword: "New Password",
    success: "Password Changed",
  };

  return (
    <div
      onClick={() => {
        if (modelType === "success") {
          onClose();
        }
      }}
      className="model-overlay"
    >
      <div style={{ width: "500px" }} className="model-content">
        <div className="model-header">
          <h3 className="model-header-title">
            {titles[modelType] || "Reset Password"}
          </h3>
          <button onClick={onClose} className="model-header-close-btn">
            ×
          </button>
        </div>
        <div className="model-content-container">
          {modelType === "otp" ? (
            <OTP email={email} setModelType={setModelType} />
          ) : modelType === "newPassword" ? (
            <NewPassword email={email} setModelType={setModelType} />
          ) : modelType === "success" ? (
            <SuccessModel email={email} setModelType={setModelType} />
          ) : (
            <ResetPasswordModel
              email={email}
              setEmail={setEmail}
              setModelType={setModelType}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgetPasswordParent;

const SuccessModel = () => {
  return (
    <>
      <div>
        <div style={{ width: "100%", textAlign: "center " }}>
          <CheckCircle2
            size={80}
            color="var(--primary)"
            fill="var(--primary-hover)"
          />
        </div>
        <h2
          style={{
            textAlign: "center",
            width: "100%",
            fontSize: "20px",
            padding: "8px 0",
          }}
        >
          Try to login with new password.
        </h2>
      </div>
    </>
  );
};
