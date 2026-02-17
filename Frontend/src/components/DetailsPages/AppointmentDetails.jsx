import React, { useEffect, useState } from "react";
import {
  formateDate,
} from "../../utils/Helper";
import { useNavigate, useParams } from "react-router-dom";
import { GoBackBtn, ProfileImage } from "../CustomComponents";
import Loader from "../Loader";
import { IMAGES } from "../../utils/constants";
import { getAppointmentByIdHelper } from "../../services/AppointmentsServices";

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

  console.log("doctor--->", appointment);

  return (
    <div className="page-container">
      <GoBackBtn title="Back to All Appointments" onBack={() => navigate(-1)} />

      <div className="doctor-details-wrapper">
        <div className="doctor-details-left">
          <SectionCard title="Appointment Details">
            <span
              className={`doctor-status-badge ${
                appointment?.status === "approved"
                  ? "approved"
                  : appointment?.status === "pending"
                    ? "pending"
                    : "rejected"
              }`}
            >
              {appointment?.status?.toUpperCase()}
            </span>
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
              {appointment?.patient?._id && (
                <button
                  className="appoint-book-submit-btn"
                  onClick={() =>
                    navigate(`/user-details/${appointment?.patient?._id}`)
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

/*
  <div className="report-details-user">
            <div>
              <ProfileImage
                Image={data?.patient?.profilImg || IMAGES.PlaceHolder}
                className="report-details-image"
              />
            </div>
            <div>
              <strong className="report-details-role">Patient</strong>
              <p className="report-details-name">
                {data?.patient?.name || "N/A"}
              </p>
              <p className="report-details-email">
                {data?.patient?.email || "N/A"}
              </p>
            </div>
          </div>
          <div className="report-details-box">
            <p>
              <strong>Appointment For: </strong>
              {data?.appointmentType || "N/A"}
            </p>
            <p style={{ paddingTop: "5px" }}>
              <strong>Description: </strong>
              {data?.description || "N/A"}
            </p>
            <p style={{ paddingTop: "5px" }}>
              <strong>Fee: </strong>
              {data?.fee || "N/A"}
            </p>
          </div>
          <div className="report-details-box">
            <p>
              <strong>Appointment Date:</strong>{" "}
              {data?.appointmentPeriod?.date || "N/A"}
            </p>
            <p style={{ paddingTop: "5px" }}>
              <strong>Appointment Time:</strong>{" "}
              {data?.appointmentPeriod
                ? `${data.appointmentPeriod.startTime} – ${data.appointmentPeriod.endTime}`
                : "N/A"}
            </p>
          </div>
*/
