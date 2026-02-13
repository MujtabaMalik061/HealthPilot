import React, { useEffect, useState } from "react";
import * as LucideIcons from "lucide-react";
import Loader from "../Loader";
import { LoadMore, ServiceCard } from "../CustomComponents";
import { getServicesHelper } from "../../services/AdminServices";
import { limit } from "../../utils/constants";

const LandingServicesSection = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadMoreLoading, setLoadMoreLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    getServices();
  }, []);

  const getServices = async (nextPage = 1) => {
    try {
      if (nextPage === 1) setLoading(true);
      else setLoadMoreLoading(true);

      const res = await getServicesHelper(nextPage, limit, "");

      if (nextPage === 1) {
        setServices(res.data);
      } else {
        setServices((prev) => [...prev, ...res.data]);
      }

      setTotal(res.total);
      setPage(nextPage);
    } catch (err) {
      console.error("Failed to get Services:", err);
    } finally {
      setLoading(false);
      setLoadMoreLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (services.length >= total) return;
    getServices(page + 1);
  };

  return (
    <section className="landing-page-services">
      <div className="landing-page-section-header">
        <h2 className="landing-page-section-title">Our Services</h2>
        <p className="landing-page-section-subtitle">
          Browse our comprehensive range of medical services
        </p>
      </div>

      {loading ? (
        <Loader style={{ height: "50vh" }} />
      ) : services?.length > 0 ? (
        <div className="landing-page-services-grid">
          {services.map((service) => {
            const Icon = LucideIcons[service.icon];

            return (
              <ServiceCard
                key={service._id}
                Icon={Icon}
                title={service.title}
                description={service.description}
                doctors={service.doctors.length || 0}
                viewDetails={false}
              />
            );
          })}
        </div>
      ) : (
        <p className="empty-data">No services available.</p>
      )}
      <LoadMore
        loading={loadMoreLoading}
        disabled={loadMoreLoading || loading}
        show={!loading && services.length < total}
        onLoad={handleLoadMore}
      />
    </section>
  );
};

export default LandingServicesSection;
