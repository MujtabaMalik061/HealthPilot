import React, { useState } from "react";
import "../assets/style/CustomComponents.css";
import { ArrowRight, Calendar, Clock, Star } from "lucide-react";
import { IMAGES } from "../utils/constants";
import { getInitialsByName } from "../utils/Helper";

export const Input = ({
  label = "",
  value = "",
  setValue = "",
  placeholder = "",
  type = "input",
  InputType = "text",
  margin = "6px 0px 8px 0px",
  style = {},
  Icon = "",
}) => {
  return (
    <>
      {label && <label className="custom-input-label">{label}</label>}
      {type === "textArea" ? (
        <textarea
          className="custom-textarea"
          style={{ margin, ...style }}
          type={InputType}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
        />
      ) : type === "inputIcon" ? (
        <div className="custom-input-icon">
          {Icon && <Icon size={16} />}
          <input
            style={{ margin, ...style }}
            className="custom-input"
            type={InputType}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder}
          />
        </div>
      ) : (
        <input
          className="custom-input"
          style={{ margin, ...style }}
          type={InputType}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
        />
      )}
    </>
  );
};

export const ProfileImage = ({
  Image = "",
  value = "",
  bg = "var(--primary-hover)",
  borderC = "var(--primary)",
  className = "",
  style = {},
}) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      style={{ border: `2px solid ${borderC}`, ...style }}
      className={`profile-image-container ${className}`}
    >
      <div
        className="profile-image-inner"
        style={{ background: Image ? "" : bg }}
      >
        {Image && !loaded && <div className="profile-image-loader" />}
        {Image ? (
          <img
            src={Image || IMAGES.PlaceHolder}
            alt=""
            onLoad={() => setLoaded(true)}
            onError={() => setLoaded(true)}
            className={loaded ? "loaded" : ""}
          />
        ) : (
          <span className="profile-image-fallback">{value || "N/A"}</span>
        )}
      </div>
    </div>
  );
};

export const ServiceCard = ({
  viewDoctor = false,
  Icon = "",
  title = "",
  description = "",
  doctors = 0,
}) => {
  return (
    <div className="customer-service-card">
      <div className="customer-service-icon">
        <Icon size={26} />
      </div>

      <h3 className="customer-service-title">{title}</h3>

      <p className="customer-service-description">{description}</p>

      <div className="customer-service-footer">
        <span className="customer-service-doctors">{doctors} Doctors</span>
        {viewDoctor && (
          <button className="customer-service-link">
            View Doctors <ArrowRight size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export const DoctorCard = ({
  profileImage = "N/A",
  name = "N/A",
  specialty = "N/A",
  rating = 0,
  reviews = 0,
  experience = 0,
  treatments = 0,
  price = 0,
  available = false,
  isDetails = true,
}) => {
  return (
    <div className="custom-doctor-card">
      <ProfileImage
        Image={profileImage}
        value={getInitialsByName(name || "N/A")}
        className="custom-doctor-avatar"
      />
      <h3 className="custom-doctor-name">{name}</h3>
      <p className="custom-doctor-specialty">{specialty}</p>
      <div className="custom-doctor-rating">
        <Star size={16} color="#f4b400" fill="#f4b400" />
        <span>
          {rating} <small>({reviews} reviews)</small>
        </span>
      </div>
      <div className="custom-doctor-meta">
        <div className="custom-doctor-meta-item">
          <Clock size={16} />
          <span>{experience} yrs exp</span>
        </div>
        <div className="custom-doctor-meta-item">
          <Calendar size={16} />
          <span>{treatments} treatments</span>
        </div>
      </div>
      {isDetails && (
        <>
          <div className="custom-doctor-divider"></div>
          <div className="custom-doctor-footer">
            <div className="custom-doctor-price">
              <strong>${price}</strong>
              <span>/visit</span>
            </div>

            <span
              className={`custom-doctor-status ${available ? "available" : "Unavailable"}`}
            >
              {available ? "Available" : "Unavailable"}
            </span>
          </div>
          <div className="custom-doctor-actions">
            <button className="custom-doctor-btn-outline">View Profile</button>
            <button className="custom-doctor-btn-primary">Book Now</button>
          </div>
        </>
      )}
    </div>
  );
};
