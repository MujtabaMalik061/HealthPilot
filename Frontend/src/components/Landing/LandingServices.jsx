import React from "react";
import * as LucideIcons from "lucide-react";
import Loader from "../Loader";
import { LandingServices } from "../../services/LandingServices";
import { ServiceCard } from "../CustomComponents";

const LandingServicesSection = () => {
  return (
    <section className="landing-page-services">
      <div className="landing-page-section-header">
        <h2 className="landing-page-section-title">Our Services</h2>
        <p className="landing-page-section-subtitle">
          Browse our comprehensive range of medical services
        </p>
      </div>

      {/* <Loader /> */}
      {LandingServices?.length > 0 ? (
        <div className="landing-page-services-grid">
          {LandingServices.map((service) => {
            const Icon = LucideIcons[service.icon];

            return (
              <ServiceCard
                key={service._id}
                Icon={Icon}
                title={service.title}
                description={service.description}
                doctors={service.doctors || 0}
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

export default LandingServicesSection;
