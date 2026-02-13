import React, { useEffect, useState } from "react";
import * as LucideIcons from "lucide-react";
import Loader from "../Loader";
import { DoctorCard, LoadMore } from "../CustomComponents";
import { getDoctorExperince } from "../../utils/Helper";
import { getUsersByTypeHelper } from "../../services/UsersHelper";
import { limit } from "../../utils/constants";

const LandingDoctorsSections = () => {
  const [doctors, setDoctors] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [lastPage, setLastPage] = useState(0);

  const [loading, setLoading] = useState(true);
  const [loadMoreLoading, setLoadMoreLoading] = useState(false);

  useEffect(() => {
    getDoctors(page);
  }, [page]);

  const getDoctors = async (nextPage = 1) => {
    try {
      if (!loading && nextPage === 1) {
        setLoading(true);
      } else {
        setLoadMoreLoading(true);
      }
      const res = await getUsersByTypeHelper(
        nextPage,
        limit,
        "",
        "doctor",
        "",
        "viewed",
      );
      if (nextPage === 1) {
        setDoctors(res?.data ?? []);
      } else {
        setDoctors((prev) => [...(prev ?? []), ...(res?.data ?? [])]);
      }
      setTotal(res?.meta?.total);
      setLastPage(res?.meta?.totalPages);
    } catch (err) {
      console.error("Failed to get doctors:", err);
    } finally {
      setLoading(false);
      setLoadMoreLoading(false);
    }
  };

  const handlePageChange = () => {
    if (page === lastPage) return;
    setPage(page + 1);
  };

  return (
    <section className="landing-page-services">
      <div className="landing-page-section-header">
        <h2 className="landing-page-section-title">Our Doctors</h2>
        <p className="landing-page-section-subtitle">
          Book appointments with top healthcare professionals
        </p>
      </div>
      {loading ? (
        <Loader style={{height:"50vh"}}/>
      ) : doctors?.length > 0 ? (
        <div className="landing-page-doctor-grid">
          {doctors.map((doctor, index) => {
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
                available={doctor?.availabe || false}
                isDetails={false}
              />
            );
          })}
        </div>
      ) : (
        <p className="empty-data">No doctors available.</p>
      )}
      <LoadMore
        loading={loadMoreLoading}
        disabled={loadMoreLoading}
        show={!loading && doctors?.length < total}
        onLoad={handlePageChange}
      />
    </section>
  );
};

export default LandingDoctorsSections;
