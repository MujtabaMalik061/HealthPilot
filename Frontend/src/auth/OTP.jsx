import React, { useState, useRef, useEffect } from "react";
import "../assets/style/OTP.css";
import { toast } from "sonner";
import { forgetPasswordHelper, otpCheckHelper } from "../services/SettingHelper";

const OTP = ({ email, setModelType }) => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [resendTimer, setResendTimer] = useState(30);
  const [loading, setLoading] = useState(false);
  const inputsRef = useRef([]);

  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendTimer]);

  const handleChange = (value, index) => {
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 3) {
        inputsRef.current[index + 1].focus();
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").trim();
    if (!/^\d+$/.test(paste)) return;

    const digits = paste.split("").slice(0, 4);
    const newOtp = [...otp];
    digits.forEach((d, i) => {
      newOtp[i] = d;
    });
    setOtp(newOtp);

    const nextIndex = Math.min(digits.length, 3);
    inputsRef.current[nextIndex]?.focus();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handleVerify = async () => {
    const otpValue =  otp.join("");
    if (otpValue.length < 4) {
      toast.error("Please enter all 4 digits");
      return;
    }

    try {
      setLoading(true);
      await otpCheckHelper({ email, otpCode: otpValue });
      toast.success("Otp match successfuly");
      setModelType("newPassword");
    } catch (err) {
      console.error("Error to checkOtp:", err);
      toast.error("Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
       await forgetPasswordHelper({ email });
      toast.success("A new OTP has been sent to your email!");
    } catch (err) {
      toast.error(err?.message || "Failed to resend Otp.");
    } finally {
      setOtp(["", "", "", ""]);
      setResendTimer(30);
    }
  };

  return (
    <>
      <div className="otp-inputs">
        {otp.map((digit, index) => (
          <input
            key={index}
            type="text"
            maxLength="1"
            value={digit}
            ref={(el) => (inputsRef.current[index] = el)}
            onChange={(e) => handleChange(e.target.value, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={handlePaste}
          />
        ))}
      </div>
      <button
        disabled={loading}
        onClick={handleVerify}
        className="auth-btn-primary"
      >
        {loading ? "Verifing..." : "Verify OTP"}
      </button>

      <div className="resend-section">
        {resendTimer > 0 ? (
          <p>Resend OTP in {resendTimer}s</p>
        ) : (
          <button onClick={handleResend} className="resend-btn">
            Resend OTP
          </button>
        )}
      </div>
    </>
  );
};

export default OTP;
