import React, { useEffect, useMemo, useRef, useState } from "react";
import "../assets/style/CustomComponents.css";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Check,
  ChevronDown,
  ChevronUp,
  Clock,
  EllipsisVertical,
  Eye,
  EyeClosed,
  Search,
  Star,
  X,
} from "lucide-react";
import { IMAGES } from "../utils/constants";
import Loader from "./Loader";
import { useNavigate } from "react-router";
import { formateDate } from "../utils/Helper";

export const Input = ({
  label = "",
  value = "",
  readOnly = false,
  setValue = "",
  placeholder = "",
  type = "input",
  InputType = "text",
  margin = "6px 0px 8px 0px",
  style = {},
  Icon = "",
  onClick = () => {},
}) => {
  const [show, setShow] = useState(false);
  const isPassword = InputType === "password";
  return (
    <>
      {label && <label className="custom-input-label">{label}</label>}
      {type === "textArea" ? (
        <textarea
          className="custom-textarea"
          style={{ margin, ...style }}
          type={InputType}
          value={value}
          readOnly={readOnly}
          onClick={onClick}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
        />
      ) : type === "inputIcon" ? (
        <div className="custom-input-icon">
          {Icon && <Icon size={16} />}
          <input
            style={{ margin, ...style, paddingRight: isPassword ? "30px" : "" }}
            className="custom-input"
            type={isPassword ? (show ? "text" : "password") : InputType}
            value={value}
            readOnly={readOnly}
            onClick={onClick}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder}
          />
          {isPassword && (
            <button
              onClick={() => setShow(!show)}
              className="icon custom-password-toggel"
            >
              {show ? <Eye size={16} /> : <EyeClosed size={16} />}
            </button>
          )}
        </div>
      ) : (
        <input
          className="custom-input"
          style={{ margin, ...style }}
          type={InputType}
          value={value}
          onClick={onClick}
          readOnly={readOnly}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
        />
      )}
    </>
  );
};

export const DateInput = ({
  label = "",
  value = "",
  setValue = () => {},
  placeholder = "",
  margin = "6px 0px 8px 0px",
  style = { cursor: "pointer", fontSize: "14px", fontWeight: "100" },
  Icon = null,
  min,
  max,
}) => {
  const inputRef = useRef(null);

  return (
    <>
      {label && <label className="custom-input-label">{label}</label>}

      <div className="custom-input-icon">
        {Icon && <Icon size={16} />}
        <div
          style={{ margin, ...style }}
          className="custom-input"
          onClick={() => inputRef.current?.showPicker()}
        >
          {value || placeholder}
        </div>
        <input
          ref={inputRef}
          type="date"
          value={value}
          min={min}
          max={max}
          onChange={(e) => setValue(e.target.value)}
          style={{
            position: "absolute",
            opacity: 0,
            pointerEvents: "none",
            height: 0,
            width: 0,
          }}
        />
      </div>
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
  style = {},
  width = "",
  margin = "",
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
      style={{ width, margin, ...style }}
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
          style={{ width }}
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

export const EllipsisSelector = ({ options, position = "right" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectorRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (selectorRef.current && !selectorRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={selectorRef}
      onClick={(e) => {
        e.stopPropagation();
        setIsOpen((prev) => !prev);
      }}
      className="ellipsisSelector-filter-container"
    >
      <div className="ellipsisSelector-filter-selector">
        <EllipsisVertical size={17} />
      </div>

      {isOpen && (
        <div
          className={`ellipsisSelector-filter-selection-container ${
            position === "left" ? "custom-filter-selection-container-left" : ""
          }`}
        >
          {options?.map((option, index) => {
            const Icon = option.icon;
            return (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  option?.action();
                  setIsOpen(false);
                }}
                className="ellipsisSelector-filter-item"
              >
                {Icon && <Icon size={13} />}
                {option.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export const SelectorWithLoad = ({
  disabled = false,
  filter,
  setFilter,
  options = [],
  position = "right",
  showLoadMore = false,
  onLoadMore,
  loadMoreLoading = false,
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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options?.find((o) => o.filter === filter);

  return (
    <div
      ref={selectorRef}
      onClick={() => !disabled && setIsFilterOpen((p) => !p)}
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
          {options.map((option, index) => {
            const isActive = option?.filter === filter;

            return (
              <button
                key={index}
                disabled={isActive}
                onClick={(e) => {
                  e.stopPropagation();
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
                {option.label}
              </button>
            );
          })}
          <div
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <LoadMore
              loading={loadMoreLoading}
              disabled={loadMoreLoading}
              show={showLoadMore}
              onLoad={onLoadMore}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export const ProfileImage = ({
  Image = "",
  bg = "var(--primary-hover)",
  borderC = "var(--primary)",
  className = "",
  style = {},
}) => {
  const [loaded, setLoaded] = useState(false);
  const [imageModel, setImageModel] = useState(null);

  return (
    <>
      <div
        style={{ border: `2px solid ${borderC}`, ...style }}
        className={`profile-image-container ${className}`}
        onClick={() => Image && setImageModel(Image)}
      >
        <div
          className="profile-image-inner"
          style={{ background: Image ? "" : bg }}
        >
          {Image && !loaded && <div className="profile-image-loader" />}
          {Image && (
            <img
              src={Image}
              alt=""
              onLoad={() => setLoaded(true)}
              onError={() => setLoaded(true)}
              className={loaded ? "loaded" : ""}
            />
          )}
        </div>
      </div>

      {imageModel && (
        <ImageViewModel
          Image={imageModel}
          onClose={() => setImageModel(null)}
        />
      )}
    </>
  );
};

export const ServiceCard = ({
  serviceId = "",
  viewDetails = false,
  Icon = "",
  title = "",
  description = "",
  doctors = 0,
  longPress = false,
  longPressOptions = [],
}) => {
  const navigate = useNavigate();
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
        {viewDetails && (
          <button
            onClick={() => navigate(`/service-details/${serviceId}`)}
            className="custom-service-link"
          >
            View Details
            <span className="icon">
              <ArrowRight size={16} />
            </span>
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
  doctorId = "",
  name = "N/A",
  specialty = "N/A",
  rating = 0,
  reviews = 0,
  experience = 0,
  treatments = 0,
  price = 0,
  available = false,
  adminDoctorDetails = false,
  isDetails = true,
  isBookNow = true,
}) => {
  const navigate = useNavigate();
  const plusSpecialty = specialty?.length > 0 ? specialty?.length - 1 : 0;

  const handleViewDetails = () => {
    if (adminDoctorDetails) {
      navigate(`/admin/doctor-details/${doctorId}`);
    } else {
      navigate(`/doctor-details/${doctorId}`);
    }
  };
  return (
    <div className="custom-doctor-card">
      <ProfileImage
        Image={profileImage || IMAGES.PlaceHolder}
        className="custom-doctor-avatar"
      />
      <h3 className="custom-doctor-name">{name}</h3>
      <p className="custom-doctor-specialty">
        {specialty?.[0] || "N/A"}
        {plusSpecialty !== 0 && (
          <span
            style={{ padding: "4px", marginLeft: "4px" }}
            className="doctor-details-status active"
          >
            +{plusSpecialty}
          </span>
        )}
      </p>
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
      <div className="custom-doctor-divider"></div>
      <div
        style={{ marginBottom: isDetails ? "" : "0px" }}
        className="custom-doctor-footer"
      >
        <div className="custom-doctor-price">
          <strong>Rs.{price}</strong>
          <span>/visit</span>
        </div>

        <span
          className={`custom-doctor-status ${available ? "available" : "Unavailable"}`}
        >
          {available ? "Available" : "Unavailable"}
        </span>
      </div>
      {isDetails && (
        <>
          <div className="custom-doctor-actions">
            <button
              onClick={handleViewDetails}
              className="custom-doctor-btn-outline"
            >
              View Profile
            </button>
            {isBookNow && (
              <button
                onClick={() => navigate(`/appoint-booking/${doctorId}`)}
                className="custom-doctor-btn-primary"
              >
                Book Now
              </button>
            )}
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
  style = {},
}) => {
  return (
    show && (
      <div style={style} className="custom-loadMore-container">
        {loading ? (
          <Loader stroke="3" size="30" />
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

export const StatesCard = ({
  iconBg = "",
  iconColor = "#fff",
  title = "",
  value = "",
  stringValue = "",
  icon: Icon,
  loading = false,
}) => {
  return (
    <div className="custom-stat-card">
      <div className="custom-stat-card-content">
        <p className="custom-stat-title">{title}</p>
        <h3 className="custom-stat-value">
          {loading ? (
            <Loader size="25" stroke="2" />
          ) : (
            <>
              {value.toLocaleString()}
              {stringValue}
            </>
          )}
        </h3>
      </div>
      <div style={{ background: iconBg }} className="custom-stat-icon">
        <Icon color={iconColor} />
      </div>
    </div>
  );
};

export const DashBoardStatesCard = ({
  iconBg = "",
  iconColor = "#fff",
  title = "",
  value = "",
  subvalue = "",
  stringValue = "",
  icon: Icon,
  loading = false,
}) => {
  return (
    <div className="custom-stat-card">
      <div className="custom-stat-card-content">
        <p
          className="custom-stat-title"
          style={{ color: "var(--muted-foreground)", fontWeight: "400" }}
        >
          {title}
        </p>
        {loading ? (
          <Loader
            size="25"
            stroke="2"
            style={{ justifyContent: "start", alignItems: "end" }}
          />
        ) : (
          <>
            <h3 className="custom-stat-value">
              {value.toLocaleString()}
              {stringValue}
            </h3>
            {subvalue && <p style={{ color: "var(--primary)" }}>{subvalue}</p>}
          </>
        )}
      </div>
      <div style={{ background: iconBg }} className="custom-stat-icon">
        <Icon color={iconColor} />
      </div>
    </div>
  );
};

export const Tab = ({ activeTab, setActiveTab, tabs }) => {
  return (
    <div className="custom-tab-container">
      {tabs?.map((tab, index) => (
        <button
          key={index}
          onClick={() => setActiveTab(tab.filter)}
          className={`elepsis custom-tab ${
            activeTab === tab.filter ? "active" : ""
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export const ImageViewModel = ({ Image = "", onClose }) => {
  const [loaded, setLoaded] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const [transformOrigin, setTransformOrigin] = useState("center center");

  const handleDoubleClick = () => {
    setZoomed((prev) => !prev);
  };

  const handleMouseMove = (e) => {
    if (!zoomed) return;

    const { left, top, width, height } = e.target.getBoundingClientRect();

    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    setTransformOrigin(`${x}% ${y}%`);
  };

  return (
    <div onClick={onClose} className="model-overlay">
      <div
        onClick={(e) => e.stopPropagation()}
        className="model-img-preview-content"
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="image-model-close"
        >
          <X size={18} />
        </button>

        <div
          style={
            Image && !loaded
              ? {
                  height: "90vh",
                  width: "600px",
                  alignItems: "start",
                  justifyContent: "start",
                }
              : {}
          }
          className="profile-image-inner"
        >
          {Image && !loaded && <div className="profile-image-loader" />}
          {Image && (
            <img
              src={Image}
              alt=""
              onLoad={() => setLoaded(true)}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = IMAGES.NotFound;
                setLoaded(true);
              }}
              onDoubleClick={handleDoubleClick}
              onMouseMove={handleMouseMove}
              style={{
                cursor: zoomed ? "zoom-out" : "zoom-in",
                transformOrigin: transformOrigin,
              }}
              className={`${loaded ? "loaded" : ""} ${zoomed ? "zoomed" : ""}`}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export const GoBackBtn = () => {
  const navigate = useNavigate();

  return (
    <div className="custom-details-page-back-btn">
      <button onClick={() => navigate(-1)}>
        <span className="icon">
          <ArrowLeft />
        </span>
        Go Back
      </button>
    </div>
  );
};

export const RatingStars = ({
  size = 16,
  value = null,
  setValue = null,
  isChngeAble = false,
  style = {},
}) => {
  const handleValueChange = (ratingValue = 0) => {
    if (!ratingValue || !isChngeAble) return;
    setValue(ratingValue);
  };

  return (
    <span style={{ display: "inline-flex", gap: 2, fontSize: "0px", ...style }}>
      {Array.from({ length: 5 }, (_, index) => {
        const starValue = index + 1;

        if (value >= starValue) {
          return (
            <Star
              onClick={() => {
                handleValueChange(starValue);
              }}
              style={{ cursor: isChngeAble ? "pointer" : "default" }}
              key={index}
              size={size}
              color="#FDC700"
              fill="#FDC700"
            />
          );
        }

        if (value >= starValue - 0.5) {
          return (
            <span
              key={index}
              style={{
                position: "relative",
                display: "inline-block",
                width: size,
                height: size,
              }}
            >
              <Star
                size={size}
                onClick={() => {
                  handleValueChange(starValue);
                }}
                color="#FDC700"
                fill="#8f8f8f12"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  cursor: isChngeAble ? "pointer" : "default",
                }}
              />
              <span
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "50%",
                  height: "100%",
                  overflow: "hidden",
                }}
              >
                <Star
                  onClick={() => {
                    handleValueChange(starValue);
                  }}
                  style={{ cursor: isChngeAble ? "pointer" : "default" }}
                  size={size}
                  color="#FDC700"
                  fill="#FDC700"
                />
              </span>
            </span>
          );
        }

        return (
          <Star
            key={index}
            onClick={() => {
              handleValueChange(starValue);
            }}
            style={{ cursor: isChngeAble ? "pointer" : "default" }}
            size={size}
            color="#FDC700"
            fill="#00000012"
          />
        );
      })}
    </span>
  );
};

export const ReviewCard = ({
  profile_Image,
  name,
  description,
  rating,
  date,
}) => (
  <div className="custom-review-card">
    <div>
      <div>
        <ProfileImage
          Image={profile_Image || IMAGES.PlaceHolder}
          className="custom-review-profileImage"
        />
        <div className="custom-review-card-info">
          <strong>{name}</strong>
          <RatingStars value={rating} size={"clamp(12px, 2vw, 16px)"} />
        </div>
      </div>
      <p>{description}</p>
    </div>
    <div className="custom-review-card-meta">
      <small>{date}</small>
    </div>
  </div>
);

export const ReviewSection = ({
  reviews = [],
  global = {},
  meta = {},
  loading = false,
  loadMoreLoading = false,
  handleChange = () => {},
}) => {
  const [allReviews, setAllReviews] = useState([]);

  useEffect(() => {
    if (!reviews) return;

    setAllReviews((prev) => {
      if (meta?.page === 1) {
        if (JSON.stringify(prev) === JSON.stringify(reviews)) {
          return prev;
        }
        return reviews;
      }

      const newIds = new Set(prev.map((r) => r._id));
      const filtered = reviews.filter((r) => !newIds.has(r._id));

      if (filtered.length === 0) return prev;

      return [...prev, ...filtered];
    });
  }, [reviews, meta?.page]);

  const handlePageChange = () => {
    handleChange(meta?.page + 1 || 1);
  };

  return (
    <div className="custom-review-container">
      <div className="custom-review-container-header">
        <h4>
          <span className="icon">
            <Star size={18} color="#EDBA1D" />
          </span>
          Reviews & Ratings
        </h4>
        <span>
          <Star size={14} color="#EDBA1D" fill="#EDBA1D" />{" "}
          {global?.totalRating || 0}{" "}
          <small>({global?.totalReviews || 0} reviews)</small>
        </span>
      </div>
      <div className="custom-review-container-body">
        {loading ? (
          <Loader />
        ) : allReviews.length > 0 ? (
          <>
            {allReviews?.map((review) => (
              <ReviewCard
                key={review?._id}
                profile_Image={review?.sender?.profilImg}
                name={review?.sender?.name || "N/A"}
                description={review?.review || "N/A"}
                rating={review?.rating || 0}
                date={formateDate(review?.createdAt) || "N/A"}
              />
            ))}
            <LoadMore
              loading={loadMoreLoading}
              disabled={loadMoreLoading}
              show={meta?.page < meta?.totalPages}
              onLoad={handlePageChange}
            />
          </>
        ) : (
          <div className="empty-data">Review not found.</div>
        )}
      </div>
    </div>
  );
};
