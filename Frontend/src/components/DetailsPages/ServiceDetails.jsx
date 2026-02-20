import React, { useEffect, useState } from "react";
import { getServiceByIdHelper } from "../../services/AdminServices";
import { CalendarDaysIcon } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { useParams } from "react-router-dom";
import { DoctorCard, GoBackBtn } from "../CustomComponents";
import Loader from "../Loader";
import {
  formateDate,
  getDoctorAvailabilty,
  getDoctorExperince,
} from "../../utils/Helper";
import { useAuth } from "../../context/AuthContext";

const ServiceDetails = () => {
  const { currentUser } = useAuth();
  const { serviceId } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (serviceId) getService(serviceId);
    else setLoading(false);
  }, [serviceId]);

  const getService = async () => {
    try {
      const res = await getServiceByIdHelper(serviceId);
      setService(res?.data);
    } catch (err) {
      console.error("Failed to get service:", err);
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

  const Icon = LucideIcons[service.icon];

  return (
    <div className="page-container">
      <GoBackBtn title="Back to All Services" onBack="/admin/services" />
      {service ? (
        <>
          <SectionCard>
            <div className="doctor-details-header">
              <span className="doctor-details-avatar">
                <Icon />
              </span>
              <div className="doctor-details-main-info">
                <div className="doctor-details-name">
                  <h2>{service?.title ?? "No Title"}</h2>
                </div>
                <div
                  style={{ marginTop: "8px" }}
                  className="doctor-consultation-content"
                >
                  <span style={{ width: "24px" }} className="icon">
                    <CalendarDaysIcon size={16} />
                  </span>
                  <span>{formateDate(service?.createdAt) ?? "N/A"}</span>
                </div>
              </div>
            </div>

            <p className="doctor-details-description">
              {service?.description ?? "No Description Available"}
            </p>
          </SectionCard>
          {service?.doctors?.length > 0 ? (
            <div className="landing-page-doctor-grid">
              {service?.doctors?.map((doctor, index) => {
                const doctorAvailabilty = getDoctorAvailabilty(
                  doctor?.availableDays,
                );
                return (
                  <DoctorCard
                    key={index}
                    profileImage={doctor?.profilImg}
                    doctorId={doctor?._id}
                    name={doctor?.name || "N/A"}
                    specialty={doctor?.specialist || "N/A"}
                    rating={doctor?.rating || 0}
                    reviews={doctor?.reviews || 0}
                    experience={
                      getDoctorExperince(doctor?.doctorStartDate) || "N/A"
                    }
                    treatments={doctor?.treatments || 0}
                    price={doctor?.price || 0}
                    available={doctorAvailabilty}
                    isDetails={currentUser?.role === "admin" ? false : true}
                  />
                );
              })}
            </div>
          ) : (
            <p className="no-data-cell">No Doctors found.</p>
          )}
        </>
      ) : (
        <p className="no-data-cell">No service found.</p>
      )}
    </div>
  );
};

export default ServiceDetails;

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
