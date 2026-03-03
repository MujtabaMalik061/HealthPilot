import React, { useEffect, useRef, useState } from "react";
import { Header, Input, ProfileImage } from "../components/CustomComponents";
import "../assets/style/Setting.css";
import { Bell, Camera, Lock, Mail, Palette, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { IMAGES } from "../utils/constants";
import Loader from "../components/Loader";
import { handleUploadImage } from "../utils/Helper";
import { toast } from "sonner";
import {
  updatePasswordHelper,
  UpdateProfileHelper,
  updatePushHelper,
} from "../services/SettingHelper";

const Setting = () => {
  const { theme, toggleTheme } = useTheme();
  const { currentUser } = useAuth();
  const [loadingType, setLoadingType] = useState("");
  const [name, setName] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const fileInputRef = useRef(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [appointmentNotification, setAppointmentNotification] = useState(false);
  const [appointmentReminder, setAppointmentReminder] = useState(false);
  const [reportNotification, setReportNotification] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser?.name);
      setAppointmentNotification(currentUser?.appointmentNotification);
      setAppointmentReminder(currentUser?.appointmentReminder);
      setReportNotification(currentUser?.reportNotification);
    }
  }, [currentUser]);

  const handleProfileUpdate = async () => {
    try {
      setLoadingType("UpdateProfile");
      let profileImgUrl = currentUser?.profilImg || "";
      if (avatarFile) {
        profileImgUrl = await handleUploadImage(avatarFile);
      }
      const isNameChanged = name !== currentUser?.name;
      const isImageChanged = profileImgUrl !== currentUser?.profilImg;
      if (!isNameChanged && !isImageChanged) {
        console.log("Nothing changed, skipping API call");
        return;
      }
      const payload = {
        name,
        profilImg: profileImgUrl,
      };

      const res = await UpdateProfileHelper(currentUser?._id, payload);
      toast.success("Profile Updated Successfuly.");
      return res;
    } catch (err) {
      console.error("Failed to Update Profile:", err);
      toast.error("Failed to Updated profile");
    } finally {
      setLoadingType("");
    }
  };

  const handlePasswordUpdate = async () => {
    try {
      if (!currentPassword) return toast.error("Current password is required.");
      if (!newPassword) return toast.error("New password is required.");
      if (!confirmPassword) return toast.error("Confirm password is required.");
      if (newPassword !== confirmPassword)
        return toast.error("Confirm password not match with new password.");

      setLoadingType("UpdatePassword");
      const payload = {
        currentPassword,
        newPassword,
      };
      const res = await updatePasswordHelper(currentUser?._id, payload);
      toast.success("Password Updated Successfuly.");
      return res;
    } catch (err) {
      console.error("Failed to update password:", err);
      toast.error("Failed to Updated Password");
    } finally {
      setLoadingType("");
    }
  };

  const handlePushUpdate = async () => {
    try {
      setLoadingType("UpdatePush");
      const payload = {
        appointmentNotification,
        appointmentReminder,
        reportNotification,
      };
      const res = await updatePushHelper(currentUser?._id, payload);
      toast.success("Pushes Updated Successfuly.");
      return res;
    } catch (err) {
      console.error("Failed to update Pushes:", err);
      toast.error("Failed to Updated Pushes");
    } finally {
      setLoadingType("");
    }
  };

  return (
    <div className="page-container">
      <Header title="Settings" desc="Manage your account preferences." />
      <section className="settings-section">
        <div className="settings-section-header">
          <Camera size={20} />
          <div>
            <h2 className="settings-section-title">Profile</h2>
            <p className="settings-section-description">
              Update your personal information
            </p>
          </div>
        </div>

        <div className="settings-avatar-row">
          <ProfileImage
            Image={
              avatarPreview || currentUser?.profilImg || IMAGES.PlaceHolder
            }
            className="settings-avatar"
          />
          <div className="settings-avatar-actions">
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              ref={fileInputRef}
              onChange={(e) => {
                const file = e.target.files[0];
                if (!file) return;
                setAvatarFile(file);
                setAvatarPreview(URL.createObjectURL(file));
              }}
            />

            <button
              onClick={() => fileInputRef.current.click()}
              className="settings-outline-button"
            >
              <Camera size={16} /> Change Avatar
            </button>
            <p className="settings-hint">JPG, PNG or GIF. Max size 2MB.</p>
          </div>
        </div>

        <div className="settings-divider" />
        <Input
          label="Full Name"
          value={name}
          setValue={setName}
          placeholder="John doe"
          type="inputIcon"
          Icon={User}
        />

        <Input
          label="Email"
          value={currentUser?.email || "N/A"}
          readOnly={true}
          placeholder="john@example.com"
          type="inputIcon"
          Icon={Mail}
          InputType="email"
          onClick={() => toast.info("Not allow to change email.")}
        />
        <button
          disabled={loadingType !== ""}
          onClick={handleProfileUpdate}
          className="settings-primary-button"
        >
          {loadingType === "UpdateProfile" ? (
            <Loader color="#fff" size="15" stroke="2" />
          ) : (
            "Save Changes"
          )}
        </button>
      </section>

      <section className="settings-section">
        <div className="settings-section-header">
          <Lock size={20} />
          <div>
            <h2 className="settings-section-title">Security</h2>
            <p className="settings-section-description">
              Manage your password and security settings
            </p>
          </div>
        </div>

        <Input
          label="Current Password"
          value={currentPassword}
          setValue={setCurrentPassword}
          placeholder="••••••••"
          type="inputIcon"
          Icon={Lock}
          InputType="password"
        />
        <div className="settings-grid-two">
          <div>
            <Input
              label="New Password"
              value={newPassword}
              setValue={setNewPassword}
              placeholder="••••••••"
              type="inputIcon"
              Icon={Lock}
              InputType="password"
            />
          </div>
          <div>
            <Input
              label="Confirm Password"
              value={confirmPassword}
              setValue={setConfirmPassword}
              placeholder="••••••••"
              type="inputIcon"
              Icon={Lock}
              InputType="password"
            />
          </div>
        </div>
        <button
          disabled={loadingType !== ""}
          onClick={handlePasswordUpdate}
          className="settings-secondary-button"
        >
          {loadingType === "UpdatePassword" ? (
            <Loader size="15" stroke="2" />
          ) : (
            "Update Password"
          )}
        </button>
      </section>

      <section className="settings-section">
        <div className="settings-section-header">
          <Bell size={20} />
          <div>
            <h2 className="settings-section-title">Notifications</h2>
            <p className="settings-section-description">
              Configure how you receive notifications
            </p>
          </div>
        </div>
        <div
          style={{
            padding: "10px 0px",
            borderBottom: "1px solid var(--border)",
          }}
          className="settings-toggle-row"
        >
          <div>
            <span className="settings-toggle-title">
              Appointment Notifications
            </span>
            <p className="settings-toggle-description">
              Receive email about new appointment
            </p>
          </div>
          <input
            type="checkbox"
            checked={appointmentNotification}
            onChange={(e) => setAppointmentNotification(e.target.checked)}
          />
        </div>
        <div
          style={{
            padding: "10px 0px",
            borderBottom: "1px solid var(--border)",
          }}
          className="settings-toggle-row"
        >
          <div>
            <span className="settings-toggle-title">
              Appointment Reminder Notifications
            </span>
            <p className="settings-toggle-description">
              Receive reminders for your upcoming appointments.
            </p>
          </div>
          <input
            type="checkbox"
            checked={appointmentReminder}
            onChange={(e) => setAppointmentReminder(e.target.checked)}
          />
        </div>
        <div
          style={{
            padding: "10px 0px",
            borderBottom: "1px solid var(--border)",
          }}
          className="settings-toggle-row"
        >
          <div>
            <span className="settings-toggle-title">Report Notifications</span>
            <p className="settings-toggle-description">
              Receive email about any one reported you.
            </p>
          </div>
          <input
            type="checkbox"
            checked={reportNotification}
            onChange={(e) => setReportNotification(e.target.checked)}
          />
        </div>
        <button
          disabled={loadingType !== ""}
          onClick={handlePushUpdate}
          className="settings-secondary-button"
        >
          {loadingType === "UpdatePush" ? (
            <Loader size="15" stroke="2" />
          ) : (
            "Update Push"
          )}
        </button>
      </section>

      <section className="settings-section">
        <div className="settings-section-header">
          <Palette size={20} />
          <div>
            <h2 className="settings-section-title">Appearance</h2>
            <p className="settings-section-description">
              Customize how HealthPilot looks
            </p>
          </div>
        </div>

        <div className="settings-toggle-row">
          <div>
            <span className="settings-toggle-title">Dark Mode</span>
            <p className="settings-toggle-description">
              Switch between light and dark themes
            </p>
          </div>
          <input type="checkbox" value={theme} onChange={toggleTheme} />
        </div>
      </section>
    </div>
  );
};

export default Setting;
