import React from "react";
import * as LucideIcons from "lucide-react";
import Loader from "../Loader";
import { LandingDoctors } from "../../services/LandingDoctors";
import { DoctorCard } from "../CustomComponents";
import { getDoctorExperince } from "../../utils/Helper";

const LandingDoctorsSections = () => {
  return (
    <section className="landing-page-services">
      <div className="landing-page-section-header">
        <h2 className="landing-page-section-title">Our Doctors</h2>
        <p className="landing-page-section-subtitle">
          Book appointments with top healthcare professionals
        </p>
      </div>

      {/* <Loader /> */}
      {LandingDoctors?.length > 0 ? (
        <div className="landing-page-doctor-grid">
          {LandingDoctors.map((doctor, index) => {

            return (
              <DoctorCard
                key={index}
                profileImage={doctor?.profilImg}
                name={doctor?.name || "N/A"}
                specialty={doctor?.specialist?.[0] || "N/A"}
                rating={doctor?.rating || 0}
                reviews={doctor?.reviews || 0}
                experience={getDoctorExperince(doctor?.doctorStartDate) || "N/A"}
                treatments={doctor?.treatments || 0}
                price={doctor?.price || 0}
                available={doctor?.availabe || false}
                isDetails={false}
              />
            );
          })}
        </div>
      ) : (
        <p className="empty-data">No services available.</p>
      )}
    </section>
  );
};

export default LandingDoctorsSections;
