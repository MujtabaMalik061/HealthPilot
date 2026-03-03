import React, { useState } from "react";
import { ArrowRight, Lock } from "lucide-react";
import { toast } from "sonner";
import { Input } from "../components/CustomComponents";
import { newPasswordHelper } from "../services/SettingHelper";

const NewPassword = ({ email, setModelType }) => {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }
    if (password !== confirm) {
      toast.error("Passwords do not match.");
      return;
    }
    try {
      setLoading(true);
      await newPasswordHelper({ email, newPassword: password });

      toast.success("Password successfully changed!");
      setModelType("success");
    } catch (err) {
      console.error("Error resetting password:", err);
      toast.error("Failed to reset password. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Input
        label="Password"
        value={password}
        setValue={setPassword}
        placeholder="••••••••"
        type="inputIcon"
        Icon={Lock}
        InputType="password"
      />
      <Input
        label="Confirm Password"
        value={confirm}
        setValue={setConfirm}
        placeholder="••••••••"
        type="inputIcon"
        Icon={Lock}
        InputType="password"
      />
      <button
        style={{ marginTop: "0px", padding: "9px", borderRadius: "5px" }}
        className="auth-btn-primary"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          "Sending..."
        ) : (
          <>
            Set Password
            <span className="icon">
              <ArrowRight size={16} />
            </span>
          </>
        )}
      </button>
    </>
  );
};

export default NewPassword;
