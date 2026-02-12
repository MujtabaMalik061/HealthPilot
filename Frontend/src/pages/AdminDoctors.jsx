import React, { useEffect, useState } from "react";
import {
  DoctorCard,
  Header,
  LoadMore,
  EllipsisSelector,
  SearchInput,
  SelectorWithLoad,
  StatesCard,
  Tab,
  ImageViewModel,
} from "../components/CustomComponents";
import CustomTable from "../components/CustomTable";
import { limit } from "../utils/constants";
import {
  getUsersByTypeHelper,
  updateUserStatusHelper,
  userCountStatesHelper,
} from "../services/UsersHelper";
import { getServicesHelper } from "../services/AdminServices";
import { getDoctorExperince, timeAgo } from "../utils/Helper";
import Loader from "../components/Loader";
import { CircleCheckBig, CircleX, Eye, Image, UserCheck } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';

const AdminDoctors = () => {
  const navigate =useNavigate();
  // counts
  const [countLoading, setCountLoading] = useState(true);
  const [countsStates, setCountStates] = useState([]);

  const [search, setSearch] = useState("");
  const [specialtiesFilter, setSpecialtiesFilter] = useState("All Specialties");
  const [tab, setTab] = useState("all");
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  const [imageLink, setImageLink] = useState(null);

  // Specialties filter
  const [specialties, setSpecialties] = useState([]);
  const [loadMoreSpecialtiesLoading, setLoadMoreSpecialtiesLoading] =
    useState(false);
  const [specialtiesPage, setSpecialtiesPage] = useState(1);
  const [specialtiesTotal, setSpecialtiesTotal] = useState(0);

  //  get doctors
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [lastPage, setLastPage] = useState(0);

  // status change
  const [statusLoading, setStatusLoading] = useState(null);
  const [aprroveLoading, setApproveLoading] = useState(null);
  const [rejectLoading, setRejectLoading] = useState(null);

  useEffect(() => {
    getSpecialties();
    getCountStates();
  }, []);

  useEffect(() => {
    setLoading(true);
    setSearch("");
    setSpecialtiesFilter("All Specialties");
    setDoctors([]);
    setPage(1);
    setTotal(0);
  }, [tab]);

  useEffect(() => {
    const delay = setTimeout(() => {
      getDoctors(page);
    }, 400);
    return () => clearTimeout(delay);
  }, [tab, search, specialtiesFilter]);

  useEffect(() => {
    getDoctors(page);
  }, [page]);

  const getDoctors = async (nextPage = 1) => {
    try {
      if(!loading){
        setLoading(true);
      }
      const specialist =
        specialtiesFilter === "All Specialties" ? "" : specialtiesFilter;

      const res = await getUsersByTypeHelper(
        nextPage,
        limit,
        search,
        "doctor",
        specialist,
        tab === "all" ? "viewed" : "pending",
      );
      setDoctors(res.data);
      setTotal(res?.meta?.total);
      setLastPage(res?.meta?.totalPages);
    } catch (err) {
      console.error("Failed to get doctors:", err);
    } finally {
      setLoading(false);
    }
  };

  const getCountStates = async () => {
    try {
      const res = await userCountStatesHelper("doctor");
      setCountStates(res);
    } catch (err) {
      console.error("Failed to load counts:", err);
    } finally {
      setCountLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
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

  const handleStatusChange = async (userId, newStatus) => {
    try {
      if (newStatus === "approved") {
        setStatusLoading(userId);
        setApproveLoading(userId);
      } else if (newStatus === "rejected") {
        setStatusLoading(userId);
        setRejectLoading(userId);
      } else {
        setStatusLoading(userId);
      }
      const specialist =
        specialtiesFilter === "All Specialties" ? "" : specialtiesFilter;
      await updateUserStatusHelper(userId, newStatus);
      const usersRes = await getUsersByTypeHelper(
        page,
        limit,
        search,
        "doctor",
        specialist,
        tab === "all" ? "viewed" : "pending",
      );
      setDoctors(usersRes.data);
      setTotal(usersRes?.meta?.total);
      setLastPage(usersRes?.meta?.totalPages);
      toast.success("Status change successfuly");
    } catch (err) {
      console.error("Failed to change status:", err);
      toast.error("Failed to change status");
    } finally {
      setApproveLoading(null);
      setRejectLoading(null);
      setStatusLoading(null);
    }
  };

  const doctorsColumns = [
    {
      name: "Doctor",
      width: "15%",
      row: (c) => (
        <>
          <strong className="capital">{c?.name || "N/A"}</strong>
          <p>{c?.email || "N/A"}</p>
        </>
      ),
    },
    {
      name: "Experince",
      row: (c) => (
        <span>{getDoctorExperince(c?.doctorStartDate) || "N/A"} yrs</span>
      ),
    },
    {
      name: "Status",
      width: "110px",
      row: (c) => (
        <span
          className={`custom-status custom-status-${
            c?.status === "approved" ? "active" : "suspended"
          }`}
        >
          {c?.status || "N/A"}
        </span>
      ),
    },
    {
      name: "Join At",
      row: (c) => timeAgo(c?.createdAt) || "N/A",
    },
    {
      name: "specialist",
      width: "15%",
      row: (c) =>
        c?.specialist && c.specialist.length > 0
          ? c.specialist.join(", ")
          : "N/A",
    },
    {
      name: "Location",
      width: "30%",
      row: (c) => c?.location || "N/A",
    },
    {
      name: "Actions",
      bothClass: "custom-table-action",
      row: (c) =>
        statusLoading === c?._id ? (
          <div className="ellipsisSelector-filter-container">
            <Loader
              size="12"
              stroke="2"
              style={{ width: "20px", height: "20px" }}
            />
          </div>
        ) : (
          <EllipsisSelector
            options={[
              {
                label: "View Details",
                icon: Eye,
                action: () =>
                  navigate(
                    `/admin/doctor-details/${c._id}`,
                  ),
              },
              c?.status === "approved"
                ? {
                    label: "Reject",
                    icon: CircleX,
                    action: () => handleStatusChange(c?._id, "rejected"),
                  }
                : {
                    label: "Approve",
                    icon: CircleCheckBig,
                    action: () => handleStatusChange(c?._id, "approved"),
                  },
            ]}
          />
        ),
    },
  ];

  const pendingColumns = [
    {
      name: "Doctor",
      width: "15%",
      row: (c) => (
        <>
          <strong className="capital">{c?.name || "N/A"}</strong>
          <p>{c?.email || "N/A"}</p>
        </>
      ),
    },
    {
      name: "Experince",
      row: (c) => (
        <span>{getDoctorExperince(c?.doctorStartDate) || "N/A"} yrs</span>
      ),
    },
    {
      name: "Status",
      row: (c) => (
        <span className="custom-status custom-status-pending">
          {c?.status || "N/A"}
        </span>
      ),
    },
    {
      name: "Join At",
      row: (c) => timeAgo(c?.createdAt) || "N/A",
    },
    {
      name: "Certificate",
      width: "15%",
      row: (c) => (
        <div
          className="custom-table-action-container"
          style={{ textDecoration: "underline", cursor: "pointer" }}
          onClick={() => setImageLink(c?.certificate)}
        >
          <Image /> <span>Certificate</span>
        </div>
      ),
    },
    {
      name: "Location",
      width: "30%",
      row: (c) => c?.location || "N/A",
    },
    {
      name: "Actions",
      bothClass: "custom-table-action",
      row: (c) => (
        <div className="custom-table-action-container">
          <button
            className="custom-table-action-btn active"
            onClick={() => handleStatusChange(c?._id, "approved")}
          >
            {aprroveLoading === c?._id ? (
              <Loader
                size="12"
                stroke="2"
                style={{ width: "20px", height: "20px" }}
              />
            ) : (
              "Approve"
            )}
          </button>
          <button
            className="custom-table-action-btn inactive"
            onClick={() => handleStatusChange(c?._id, "rejected")}
          >
            {rejectLoading === c?._id ? (
              <Loader
                size="12"
                stroke="2"
                style={{ width: "20px", height: "20px" }}
              />
            ) : (
              "Reject"
            )}
          </button>
        </div>
      ),
    },
  ];


  return (
    <div className="page-container">
      <Header
        title="All Doctors"
        desc="Manage and oversee all registered doctors and their profiles"
      />
      <div className="custom-stats-row">
        <StatesCard
          iconBg="#00c29b"
          title="Total Doctors"
          value={countsStates?.totalUsers || 0}
          icon={UserCheck}
          loading={countLoading}
        />
        <StatesCard
          iconBg="rgb(193 198 17)"
          title="Pending Doctors"
          value={countsStates?.pendingUsers || 0}
          icon={UserCheck}
          loading={countLoading}
        />
        <StatesCard
          iconBg="rgb(0, 201, 80)"
          title="Approved Doctors"
          value={countsStates?.approvedUsers || 0}
          icon={UserCheck}
          loading={countLoading}
        />
        <StatesCard
          iconBg="rgb(255, 0, 0)"
          title="Rejected Doctors"
          value={countsStates?.rejectedUsers || 0}
          icon={UserCheck}
          loading={countLoading}
        />
      </div>
      <div className="custom-multi-filter">
        <SearchInput
          value={search}
          setValue={setSearch}
          placeholder="Search doctors..."
          margin="8px 0"
        />
        {tab === "all" && (
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
        )}
      </div>
      <Tab
        activeTab={tab}
        setActiveTab={setTab}
        tabs={[
          { label: "All Doctors", filter: "all" },
          { label: "Pending Requests", filter: "pending" },
        ]}
      />
      <div className="custom-table-card">
        <h3 className="custom-section-title">
          {tab === "all" ? "All Doctors" : "Pending Requests"}
          {tab === "all" ? "" : ""}
        </h3>
        <CustomTable
          data={doctors}
          columns={tab === "all" ? doctorsColumns : pendingColumns}
          show={`${
            doctors?.length > 0
              ? `Showing ${(page - 1) * limit + 1}–${Math.min(
                  page * limit,
                  total,
                )} of ${total} ${tab === "all" ? "Doctors" : "Requests"}`
              : `Showing 0–0 of 0 ${tab === "all" ? "Doctors" : "Requests"}`
          }`}
          page={page}
          lastPage={lastPage}
          handlePageChange={handlePageChange}
          loading={loading}
          loadingHeight="500px"
        />
      </div>
      {imageLink && (
        <ImageViewModel Image={imageLink} onClose={() => setImageLink(null)} />
      )}
    </div>
  );
};

export default AdminDoctors;
