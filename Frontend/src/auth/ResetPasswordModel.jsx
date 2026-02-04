import React, { useState } from "react";
import { Input } from "../components/CustomComponents";
import { ArrowRight } from "lucide-react";

const ResetPasswordModel = ({ onClose }) => {
  const [modelType, setModelType] = useState("email");
  const [email, setEmail] = useState("");
  //   const []=useState("");

  return (
    <div className="model-overlay">
      <div className="model-content">
        <div className="model-header">
          <h3 className="model-header-title">Add Service</h3>
          <button onClick={onClose} className="model-header-close-btn">
            ×
          </button>
        </div>
        <div className="model-content-container">
          <Input
            label="Title"
            value={email}
            setValue={setEmail}
            placeholder="you@example.com"
          />
          <button
            style={{ marginTop: "0px", padding: "9px", borderRadius: "5px" }}
            className="auth-btn-primary"
          >
            Reset Email
            <span className="icon">
              <ArrowRight size={16} />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordModel;
