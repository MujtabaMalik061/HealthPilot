import React, { useState } from "react";
import { Input } from "../components/CustomComponents";
import { ArrowRight } from "lucide-react";
import { forgetPasswordHelper } from "../services/SettingHelper";
import { toast } from "sonner";

const ResetPasswordModel = ({ email, setEmail, setModelType }) => {
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!email) return toast.error("Email is required.");
    try {
      setLoading(true);
      await forgetPasswordHelper({ email });
      toast.success("Check your mail.");
      setModelType("otp");
    } catch (err) {
      toast.error(err?.message || "Failed to forget");
      console.error("Failed to reset password:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Input
        label="Email"
        value={email}
        setValue={setEmail}
        placeholder="you@example.com"
      />
      <button
        style={{ marginTop: "0px", padding: "9px", borderRadius: "5px" }}
        className="auth-btn-primary"
        onClick={handleReset}
        disabled={loading}
      >
        {loading ? (
          "Sending..."
        ) : (
          <>
            Reset Email
            <span className="icon">
              <ArrowRight size={16} />
            </span>
          </>
        )}
      </button>
    </>
  );
};

export default ResetPasswordModel;
