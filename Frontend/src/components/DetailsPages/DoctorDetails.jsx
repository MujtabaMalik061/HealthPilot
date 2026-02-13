import React, { useEffect, useState } from "react";
import {
  formateTimeInM,
  getDoctorExperince,
  getUserById,
} from "../../utils/Helper";
import { useNavigate, useParams } from "react-router-dom";
import { GoBackBtn, ProfileImage } from "../CustomComponents";
import "../../assets/style/DoctorDetails.css";
import Loader from "../Loader";
import { IMAGES } from "../../utils/constants";
import { Award, Clock, MapPin, Star, Users, UserStar } from "lucide-react";

const SectionCard = ({
  title = "",
  icon: Icon,
  margin = "0px 0px 20px 0px",
  style = {},
  children,
}) => {
  return (
    <div style={{ margin, ...style }} className="doctor-details-section-card">
      <div className="doctor-details-section-header">
        {Icon ? <Icon color="var(--card-foreground)" size={18} /> : null}
        {title && <h3 className="doctor-details-section-title">{title}</h3>}
      </div>
      {children}
    </div>
  );
};

const StatsCard = ({
  value = "",
  label = "",
  icon: Icon,
  color = "var(--primary)",
  bgColor = "var(--primary-hover)",
}) => {
  return (
    <div className="doctor-details-stat-box">
      <span
        style={{ background: bgColor }}
        className="doctor-details-stat-box-icon"
      >
        {Icon ? <Icon color={color} size={30} /> : null}
      </span>
      <div className="doctor-details-stat-box-content">
        <h4>{value ?? "-"}</h4>
        <p>{label}</p>
      </div>
    </div>
  );
};

const InfoRow = ({ left, right }) => (
  <div className="doctor-details-info-row">
    <span>{left ?? "-"}</span>
    <span style={{ color: "var(--muted-foreground)" }}>{right ?? "-"}</span>
  </div>
);

const DoctorDetails = () => {
  const navigate = useNavigate();
  const { doctorId } = useParams();
  const [loading, setLoading] = useState(true);
  const [doctor, setDoctor] = useState(null);

  useEffect(() => {
  if (doctorId) fetchDoctor(doctorId);
  else setLoading(false);
  }, [doctorId]);

  const fetchDoctor = async (id) => {
    try {
      const res = await getUserById?.(id);
      setDoctor(res ?? null);
    } catch (err) {
      console.error("Failed to fetch doctor:", err);
    } finally {
      setLoading(false);
    }
  };


  if (loading) {
    return (
      <>
        <Loader />
      </>
    );
  }

  return (
    <div className="page-container">
      <GoBackBtn title="Back to All Doctors" onBack="/admin/doctors" />
      {doctor ? (
        <div className="doctor-details-wrapper">
          <div className="doctor-details-left">
            <SectionCard>
              <div className="doctor-details-header">
                <ProfileImage
                  Image={doctor?.profilImg || IMAGES.PlaceHolder}
                  className="doctor-details-avatar"
                />

                <div className="doctor-details-main-info">
                  <div className="doctor-details-name">
                    <h2>{doctor?.name ?? "No Name"}</h2>{" "}
                    <span
                      className={`doctor-details-status ${
                        doctor?.status === "approved" ? "active" : "inactive"
                      }`}
                    >
                      {doctor?.status === "approved" ? "Approved" : "Rejected"}
                    </span>
                  </div>
                  <p className="doctor-details-specialist">
                    {doctor?.specialist?.join?.(", ") ?? "No Specialist"}
                  </p>
                  <div className="doctor-details-meta">
                    <span
                      style={{
                        color: "var(--card-foreground)",
                        fontSize: "14px",
                      }}
                    >
                      <span className="icon">
                        <Star size={16} color="#e7b008" fill="#e7b008" />
                      </span>
                      <span>
                        {doctor?.rating ?? 0}
                        <span
                          style={{
                            color: "var(--muted-foreground)",
                            marginLeft: "2px",
                          }}
                        >
                          ({doctor?.reviews ?? 0} reviews)
                        </span>
                      </span>
                    </span>
                    <span>
                      <span className="icon">
                        <MapPin size={14} />
                      </span>
                      {doctor?.location ?? "No Location"}
                    </span>
                  </div>
                </div>
              </div>

              <p className="doctor-details-description">
                {doctor?.description ?? "No Description Available"}
              </p>
            </SectionCard>

            <div className="doctor-details-stats">
              <StatsCard
                value={getDoctorExperince(doctor?.doctorStartDate) ?? 0}
                icon={Clock}
                label="Years Exp"
              />
              <StatsCard
                value={doctor?.treatments ?? 0}
                icon={Users}
                label="Treatments"
              />
              <StatsCard
                value={doctor?.rating ?? 0}
                icon={Star}
                color="#e0c438"
                bgColor="#e0c43822"
                label="Rating"
              />
              <StatsCard
                value={doctor?.reviews ?? 0}
                icon={UserStar}
                color="#29b1e0"
                bgColor="#29b2e02e"
                label="Reviews"
              />
            </div>

            <SectionCard margin="0px" icon={Award} title="Education & Training">
              <ul className="doctor-details-education-list">
                {doctor?.educationAndTraining?.length ? (
                  doctor?.educationAndTraining?.map?.((item, i) => (
                    <li key={i}>{item ?? "-"}</li>
                  ))
                ) : (
                  <p className="no-data-cell">No Education Data</p>
                )}
              </ul>
            </SectionCard>
          </div>

          <div className="doctor-details-right">
            <SectionCard title="Consultation">
              <div className="doctor-consultation-box">
                <div className="doctor-consultation-content">
                  <h2>Consultation Fee:</h2>
                  <span> Rs. {doctor?.price ?? 0}</span>
                </div>
                <div
                  style={{ marginTop: "4px" }}
                  className="doctor-consultation-content"
                >
                  <h2>Time period:</h2>
                  <span>{doctor?.timeCycle ?? "0min"}</span>
                </div>
              </div>

              <button
                onClick={() => navigate(`/appoint-booking/${doctorId}`)}
                className="doctor-details-book-btn"
              >
                Book Appointment
              </button>
            </SectionCard>

            <SectionCard title="Available Days">
              {doctor?.availableDays?.length ? (
                doctor?.availableDays?.map?.((day, i) => (
                  <InfoRow
                    key={i}
                    left={day?.day}
                    right={`${formateTimeInM(day?.start) ?? "N/A"} - ${formateTimeInM(day?.end) ?? "N/A"}`}
                  />
                ))
              ) : (
                <p className="no-data-cell">No Schedule Added</p>
              )}
            </SectionCard>
          </div>
        </div>
      ) : (
        <div className="no-data-cell">No doctor found.</div>
      )}
    </div>
  );
};

export default DoctorDetails;
