import React, { useEffect, useMemo, useRef, useState } from "react";
import "../assets/style/CustomComponents.css";
import {
  ArrowRight,
  Calendar,
  Check,
  ChevronDown,
  ChevronUp,
  Clock,
  Search,
  Star,
} from "lucide-react";
import { IMAGES } from "../utils/constants";
import { getInitialsByName } from "../utils/Helper";
import Loader from "./Loader";

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

export const SearchInput = ({
  disabled = false,
  value,
  setValue,
  placeholder = "Search...",
  margin = "",
}) => {
  return (
    <div className="customs-search-box" style={{ margin }}>
      <Search className="customs-search-icon" />
      <input
        disabled={disabled}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
        placeholder={placeholder}
        className="customs-search-input"
      />
    </div>
  );
};

export const Selector = ({
  disabled = false,
  filter,
  setFilter,
  options,
  position = "right",
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const selectorRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectorRef.current && !selectorRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const sortedOptions = useMemo(() => {
    if (!options || !filter) return options;

    const selected = options.find((opt) => opt.filter === filter);
    const others = options.filter((opt) => opt.filter !== filter);

    return selected ? [selected, ...others] : options;
  }, [options, filter]);

  const selectedOption = options?.find((option) => option.filter === filter);

  return (
    <div
      ref={selectorRef}
      onClick={() => setIsFilterOpen(!isFilterOpen)}
      disabled={disabled}
      className={`customs-filter-container ${disabled ? "disabled" : ""}`}
    >
      <div className="customs-filter-selector">
        <span className="elepsis">{selectedOption?.label || filter}</span>
        <span className="icon">
          {isFilterOpen ? <ChevronUp size={17} /> : <ChevronDown size={17} />}
        </span>
      </div>
      {isFilterOpen && (
        <div
          className={`customs-filter-selection-container ${
            position === "left" ? "customs-filter-selection-container-left" : ""
          }`}
        >
          {sortedOptions &&
            sortedOptions.map((option, index) => {
              const isActive = option?.filter === filter;
              return (
                <button
                  key={index}
                  disabled={isActive}
                  onClick={() => {
                    setFilter(option?.filter);
                    setIsFilterOpen(false);
                  }}
                  className={`customs-filter-item ${isActive ? "active" : ""}`}
                >
                  {isActive && (
                    <span>
                      <Check size={13} />
                    </span>
                  )}
                  {option?.label}
                </button>
              );
            })}
        </div>
      )}
    </div>
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
  longPress = false,
  longPressOptions = [],
}) => {
  const [menu, setMenu] = useState(false);

  const menuRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenu(false);
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [menu]);

  const handleContextMenu = (e) => {
    if (!longPress) return;
    e.preventDefault();
    setMenu(true);
  };

  return (
    <div className="custom-service-card" onContextMenu={handleContextMenu}>
      <div className="custom-service-icon">
        <Icon size={26} />
      </div>

      <h3 className="custom-service-title">{title}</h3>

      <p className="custom-service-description">{description}</p>

      <div className="custom-service-footer">
        <span className="custom-service-doctors">{doctors} Doctors</span>

        {viewDoctor && (
          <button className="custom-service-link">
            View Doctors <ArrowRight size={16} />
          </button>
        )}
      </div>
      {menu && (
        <div ref={menuRef} className="custom-context-menu">
          {longPressOptions.map((opt, index) => (
            <div
              key={index}
              className="custom-context-menu-item"
              onClick={() => {
                opt.action();
                setMenu(false);
              }}
            >
              {opt.Icon && (
                <span className="icon">
                  <opt.Icon size={18} />
                </span>
              )}
              {opt.text}
            </div>
          ))}
        </div>
      )}
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

export const Header = ({ title = "", desc = "" }) => {
  return (
    <div className="custom-header-container">
      <h1 className="custom-header-title">{title}</h1>
      <p className="custom-header-desc">{desc}</p>
    </div>
  );
};

export const LoadMore = ({
  loading = false,
  disabled = false,
  show = false,
  onLoad,
}) => {
  return (
    show && (
      <div className="custom-loadMore-container">
        {loading ? (
          <Loader stroke="3" size="30"/>
        ) : (
          <button
            disabled={disabled}
            onClick={onLoad}
            className="custom-load-more-btn"
          >
            Load More
          </button>
        )}
      </div>
    )
  );
};
