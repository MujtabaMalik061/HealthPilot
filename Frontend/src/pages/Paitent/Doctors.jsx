import React, { useEffect, useState } from "react";
import * as LucideIcons from "lucide-react";
import Loader from "../../components/Loader";
import {
  Header,
  DoctorCard,
  LoadMore,
  SearchInput,
  SelectorWithLoad,
} from "../../components/CustomComponents";
import { getDoctorAvailabilty, getDoctorExperince } from "../../utils/Helper";
import { getUsersByTypeHelper } from "../../services/UsersHelper";
import { limit } from "../../utils/constants";
import { getServicesHelper } from "../../services/AdminServices";

const Doctors = () => {
  const [search, setSearch] = useState("");
  const [specialtiesFilter, setSpecialtiesFilter] = useState("All Specialties");
  const [doctors, setDoctors] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [lastPage, setLastPage] = useState(0);

  // Specialties filter
  const [specialties, setSpecialties] = useState([]);
  const [loadMoreSpecialtiesLoading, setLoadMoreSpecialtiesLoading] =
    useState(false);
  const [specialtiesPage, setSpecialtiesPage] = useState(1);
  const [specialtiesTotal, setSpecialtiesTotal] = useState(0);

  const [loading, setLoading] = useState(true);
  const [loadMoreLoading, setLoadMoreLoading] = useState(false);

  useEffect(() => {
    getSpecialties();
  }, []);

  useEffect(() => {
    getDoctors(page);
  }, [page]);

  useEffect(() => {
    const delay = setTimeout(() => {
      getDoctors(page);
    }, 400);
    return () => clearTimeout(delay);
  }, [search, specialtiesFilter]);

  const getDoctors = async (nextPage = 1) => {
    try {
      if (!loading && nextPage === 1) {
        setLoading(true);
      } else {
        setLoadMoreLoading(true);
      }
      const specialist =
        specialtiesFilter === "All Specialties" ? "" : specialtiesFilter;

      const res = await getUsersByTypeHelper(
        nextPage,
        limit,
        search,
        "doctor",
        specialist,
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

  const getSpecialties = async (nextPage = 1) => {
    try {
      setLoadMoreSpecialtiesLoading(true);

      const res = await getServicesHelper(nextPage, limit);

      if (nextPage === 1) {
        setSpecialties(res.data);
      } else {
        setSpecialties((prev) => [...prev, ...res.data]);
      }

      setSpecialtiesTotal(res.total);
      setSpecialtiesPage(nextPage);
    } catch (err) {
      console.error("Failed to get Services:", err);
    } finally {
      setLoadMoreSpecialtiesLoading(false);
    }
  };

  const handleLoadMoreSpecialties = () => {
    if (specialties.length >= specialtiesTotal) return;
    getSpecialties(specialtiesPage + 1);
  };

  return (
    <div className="page-container">
      <Header
        title="Find Doctors"
        desc="Book appointments with top healthcare professionals"
      />
      <div className="custom-multi-filter">
        <SearchInput
          value={search}
          setValue={setSearch}
          placeholder="Search doctors..."
          margin="8px 0"
        />
        <SelectorWithLoad
          disabled={loading}
          filter={specialtiesFilter}
          setFilter={setSpecialtiesFilter}
          position="left"
          options={[
            { label: "All Specialties", filter: "All Specialties" },
            ...(specialties?.length > 0
              ? specialties.map((item) => ({
                  label: item?.title,
                  filter: item?.title,
                }))
              : [
                  {
                    label: "Specialties not found",
                    filter: "All Specialties",
                  },
                ]),
          ]}
          showLoadMore={specialties.length < specialtiesTotal}
          onLoadMore={handleLoadMoreSpecialties}
          loadMoreLoading={loadMoreSpecialtiesLoading}
        />
      </div>
      {loading ? (
        <Loader style={{ height: "50vh" }} />
      ) : doctors?.length > 0 ? (
        <div className="landing-page-doctor-grid">
          {doctors.map((doctor, index) => {
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
    </div>
  );
};

export default Doctors;
