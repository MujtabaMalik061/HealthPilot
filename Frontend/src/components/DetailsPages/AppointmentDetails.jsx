import React, { useEffect, useState } from "react";
import { formateDate } from "../../utils/Helper";
import { useNavigate, useParams } from "react-router-dom";
import { GoBackBtn, ProfileImage } from "../CustomComponents";
import Loader from "../Loader";
import { IMAGES } from "../../utils/constants";
import { getAppointmentByIdHelper } from "../../services/AppointmentsServices";
import { useAuth } from "../../context/AuthContext";

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

const InfoRow = ({ label = "", value = "" }) => (
  <div className="doctor-details-info-row">
    <span>{label ?? "-"}</span>
    <span style={{ color: "var(--muted-foreground)" }}>{value ?? "-"}</span>
  </div>
);

const AppointmentDetails = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { appointmentId } = useParams();
  const [loading, setLoading] = useState(true);
  const [appointment, setAppointment] = useState(null);

  useEffect(() => {
    if (appointmentId) fetchAppointment(appointmentId);
    else setLoading(false);
  }, [appointmentId]);

  const fetchAppointment = async (id) => {
    try {
      const res = await getAppointmentByIdHelper?.(id);
      setAppointment(res?.data ?? null);
    } catch (err) {
      console.error("Failed to fetch appointment:", err?.response);
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

  let rejectedBy = null;
  if (appointment?.cancelledBy === appointment?.patient?._id) {
    rejectedBy = appointment?.patient;
  } else if (appointment?.cancelledBy === appointment?.doctor?._id) {
    rejectedBy = appointment?.doctor;
  }

  return (
    <div className="page-container">
      <GoBackBtn title="Back to All Appointments" onBack={() => navigate(-1)} />

      <div className="doctor-details-wrapper">
        <div className="doctor-details-left">
          <SectionCard title="Appointment Details">
            <InfoRow
              label="Appointment Status"
              value={appointment?.status?.toUpperCase()}
            />
            {appointment?.status === "rejected" && (
              <>
                <InfoRow
                  label="Rejected By"
                  value={rejectedBy?.name || "N/A"}
                />
                <div style={{ padding: "10px 8px" }}>
                  <div className="doctor-details-section-header">
                    <h3 className="doctor-details-section-title">
                      Reject Reason
                    </h3>
                  </div>
                  <p className="appointment-description">
                    {appointment?.rejectReason || "No reason provided."}
                  </p>
                </div>
              </>
            )}
          </SectionCard>
          <SectionCard title="Appointment Information">
            <InfoRow
              label="Appointment Type"
              value={appointment?.appointmentType}
            />
            <InfoRow
              label="Date"
              value={appointment?.appointmentPeriod?.date}
            />
            <InfoRow
              label="Time"
              value={
                appointment?.appointmentPeriod
                  ? `${appointment.appointmentPeriod.startTime} - ${appointment.appointmentPeriod.endTime}`
                  : "-"
              }
            />
            <InfoRow
              label="Consultation Fee"
              value={`Rs. ${appointment?.fee ?? 0}`}
            />
            <InfoRow
              label="Booked On"
              value={
                appointment?.createdAt
                  ? formateDate(appointment.createdAt)
                  : "-"
              }
            />
          </SectionCard>

          <SectionCard title="Patient Description">
            <p className="appointment-description">
              {appointment?.description || "No description provided."}
            </p>
          </SectionCard>

          {appointment?.status === "rejected" && (
            <SectionCard title="Rejection Reason">
              <p className="appointment-description">
                {appointment?.rejectReason || "No reason provided."}
              </p>
            </SectionCard>
          )}
        </div>

        <div className="doctor-details-right">
          <SectionCard title="Doctor Information">
            <div className="appointment-user-card">
              <ProfileImage
                Image={appointment?.doctor?.profilImg || IMAGES.PlaceHolder}
                className="doctor-details-avatar"
              />
              <div>
                <strong>{appointment?.doctor?.name || "N/A"}</strong>
                <p>{appointment?.doctor?.email || "N/A"}</p>
              </div>
              {appointment?.doctor?._id && currentUser?.role !== "doctor" && (
                <button
                  className="appoint-book-submit-btn"
                  onClick={() => {
                    if (currentUser?.role === "admin") {
                      navigate(
                        `/admin/doctor-details/${appointment?.doctor?._id}`,
                      );
                    } else {
                      navigate(`/doctor-details/${appointment?.doctor?._id}`);
                    }
                  }}
                >
                  View Details
                </button>
              )}
            </div>
          </SectionCard>

          <SectionCard title="Patient Information">
            <div className="appointment-user-card">
              <ProfileImage
                Image={appointment?.patient?.profilImg || IMAGES.PlaceHolder}
                className="doctor-details-avatar"
              />
              <div>
                <strong>{appointment?.patient?.name || "N/A"}</strong>
                <p>{appointment?.patient?.email || "N/A"}</p>
              </div>
              {appointment?.patient?._id && currentUser?.role === "admin" && (
                <button
                  className="appoint-book-submit-btn"
                  onClick={() =>
                    navigate(
                      `/admin/user-details/${appointment?.patient?._id}`,
                    )
                  }
                >
                  View Details
                </button>
              )}
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
};

export default AppointmentDetails;
