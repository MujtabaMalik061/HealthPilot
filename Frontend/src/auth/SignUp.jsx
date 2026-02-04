import React, { useState } from "react";
import "../assets/style/Auth.css";
import { Input } from "../components/CustomComponents";
import {
  ArrowRight,
  CalendarRange,
  Lock,
  Mail,
  MapPin,
  Plus,
  Stethoscope,
  User,
  X,
} from "lucide-react";
import { IMAGES } from "../utils/constants";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { toast } from "sonner";

const SignUp = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [role, setRole] = useState("patient");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [specialist, setSpecialist] = useState([]);
  const [specialistInput, setSpecialistInput] = useState("");
  const [location, setLocation] = useState("");
  const [doctorStartDate, setDoctorStartDate] = useState("");
  const [certificate, setCertificate] = useState(null);
  const [educationInput, setEducationInput] = useState("");
  const [educationAndTraining, setEducationAndTraining] = useState([]);
  const [loading, setLoading] = useState(false);

  const validations = () => {
    const isDoctor = role === "doctor";
    if (!name) {
      toast.error("Full name is required!");
      return false;
    }
    if (!email) {
      toast.error("Email is required!");
      return false;
    }
    if (!password) {
      toast.error("Password is required!");
      return false;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters!");
      return false;
    }
    if (isDoctor && specialist.length < 1) {
      toast.error("specialist must be at least 1!");
      return false;
    }
    if (isDoctor && !location) {
      toast.error("Location is required!");
      return false;
    }
    if (isDoctor && !doctorStartDate) {
      toast.error(
        "Doctor Start Date is required. when you start your journey!",
      );
      return false;
    }
    if (isDoctor && !certificate) {
      toast.error("certificate is required!");
      return false;
    }
    if (isDoctor && !educationAndTraining.length < 1) {
      toast.error("Education And Training must be at least 1!");
      return false;
    }
    return true;
  };

  const handleAddSpecialist = () => {
    if (specialistInput.trim()) {
      setSpecialist([...specialist, specialistInput.trim()]);
      setSpecialistInput("");
    }
  };

  const handleRemoveSpecialist = (index) => {
    setSpecialist(specialist.filter((_, i) => i !== index));
  };

  const handleAddEducation = () => {
    if (educationInput.trim()) {
      setEducationAndTraining([...educationAndTraining, educationInput.trim()]);
      setEducationInput("");
    }
  };

  const handleRemoveEducation = (index) => {
    setEducationAndTraining(educationAndTraining.filter((_, i) => i !== index));
  };

  const handleSignUp = async () => {
    if (!validations()) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("role", role);

      if (role === "doctor") {
        formData.append("specialist", JSON.stringify(specialist));
        formData.append("location", location);
        formData.append("doctorStartDate", doctorStartDate);
        if (certificate) formData.append("certificate", certificate);
        formData.append(
          "educationAndTraining",
          JSON.stringify(educationAndTraining),
        );
      }

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/signup`,
        {
          method: "POST",
          body: formData,
        },
      );

      const data = await response.json();
      if (!response.ok) {
        toast.error(data.message || "Error signing up");
        return;
      }

      toast.success("Account created! Please login.");
      navigate("/signIn");
    } catch (error) {
      console.error("Signup failed:", error);
      toast.error("Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container" style={{ flexDirection: "row-reverse" }}>
      <div className="auth-left">
        <div className="auth-card">
          <div className="auth-logo">
            <div className="landing-page-logo-icon icon">
              <img src={IMAGES.SiteLogo} alt="" />
            </div>
            <span className="auth-logo-text">HealthPilot</span>
          </div>

          <h2 className="auth-title">Create your account</h2>
          <p className="auth-subtitle">
            Already have an account?{" "}
            <span onClick={() => navigate("/signIn")} className="auth-link">
              Sign in
            </span>
          </p>

          <div className="auth-form">
            <Input
              label="Full name"
              value={name}
              setValue={setName}
              placeholder="John Doe"
              type="inputIcon"
              Icon={User}
            />
            <Input
              label="Email address"
              value={email}
              setValue={setEmail}
              placeholder="you@example.com"
              type="inputIcon"
              Icon={Mail}
              InputType="email"
            />
            <Input
              label="Password"
              value={password}
              setValue={setPassword}
              placeholder="••••••••"
              type="inputIcon"
              Icon={Lock}
              InputType="password"
            />

            {role === "doctor" && (
              <>
                <div className="auth-multi-input">
                  <div className="auth-multi-input-wrapper">
                    <div>
                      <Input
                        label="Specialist"
                        value={specialistInput}
                        setValue={setSpecialistInput}
                        placeholder="Add specialty"
                        margin="6px 0px 0px 0px"
                      />
                    </div>
                    <button
                      type="button"
                      className="auth-multi-input-add-btn"
                      onClick={handleAddSpecialist}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <div className="multi-items">
                    {specialist.map((item, idx) => (
                      <span key={idx} className="multi-item">
                        {item}{" "}
                        <span className="icon">
                          <X
                            size={10}
                            onClick={() => handleRemoveSpecialist(idx)}
                          />
                        </span>
                      </span>
                    ))}
                  </div>
                </div>

                <Input
                  label="Location"
                  value={location}
                  setValue={setLocation}
                  placeholder="Hospital/Clinic"
                  type="inputIcon"
                  Icon={MapPin}
                />

                <Input
                  label="Doctor Start Date"
                  value={doctorStartDate}
                  setValue={setDoctorStartDate}
                  placeholder="Select year"
                  type="inputIcon"
                  Icon={CalendarRange}
                  InputType="date"
                  min="1900"
                  max={new Date().getFullYear()}
                />

                <div className="custom-file-input">
                  <label className="custom-input-label">Certificate</label>
                  <input
                    type="file"
                    className="custom-input"
                    onChange={(e) => setCertificate(e.target.files[0])}
                  />

                  {certificate && (
                    <p className="file-name">{certificate.name}</p>
                  )}
                </div>

                <div className="auth-multi-input">
                  <div className="auth-multi-input-wrapper">
                    <div>
                      <Input
                        label="Education & Training"
                        value={educationInput}
                        setValue={setEducationInput}
                        placeholder="Add education/training"
                        margin="6px 0px 0px 0px"
                      />
                    </div>
                    <button
                      type="button"
                      className="auth-multi-input-add-btn"
                      onClick={handleAddEducation}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <div className="multi-items">
                    {educationAndTraining.map((item, idx) => (
                      <span key={idx} className="multi-item">
                        {item}{" "}
                        <span className="icon">
                          <X
                            size={8}
                            onClick={() => handleRemoveEducation(idx)}
                          />
                        </span>
                      </span>
                    ))}
                  </div>
                </div>
              </>
            )}

            <label className="custom-input-label">I am a</label>
            <div className="auth-role-type-container">
              <div
                onClick={() => setRole("patient")}
                className={`auth-role-type ${role === "patient" ? "active" : ""}`}
              >
                <span className="icon">
                  <User />
                </span>
                <p>Patient</p>
              </div>
              <div
                onClick={() => setRole("doctor")}
                className={`auth-role-type ${role === "doctor" ? "active" : ""}`}
              >
                <span className="icon">
                  <Stethoscope />
                </span>
                <p>Doctor</p>
              </div>
            </div>

            <button
              disabled={loading}
              onClick={handleSignUp}
              className="auth-btn-primary"
            >
              {loading ? (
                <Loader color="#fff" size="18" stroke="2" height="17px" />
              ) : (
                <>
                  Create Account{" "}
                  <span className="icon">
                    <ArrowRight size={16} />
                  </span>
                </>
              )}
            </button>

            <p className="auth-demo">
              By signing up, you agree to our{" "}
              <span onClick={() => navigate("/terms")} className="auth-link">
                Terms of Service
              </span>{" "}
              and{" "}
              <span onClick={() => navigate("/privacy")} className="auth-link">
                Privacy Policy
              </span>
              .
            </p>
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-right-content">
          <h1>Join HealthPilot Today</h1>
          <p>
            Whether you're a patient seeking care or a doctor ready to serve,
            we've got you covered with our comprehensive healthcare platform.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
