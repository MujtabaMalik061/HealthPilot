import React, { useEffect, useState } from "react";
import { Header, StatesCard, Tab } from "../../components/CustomComponents";
import {
  ClipboardCheck,
  ClipboardClock,
  ClipboardPlus,
  ClipboardX,
} from "lucide-react";
import {
  deleteAppointmentHelper,
  getAppointmentCountsHelper,
  getSingleUserAppointmentsHelper,
} from "../../services/AppointmentsServices";
import { limit } from "../../utils/constants";
import CustomTable from "../../components/CustomTable";
import { timeAgo } from "../../utils/Helper";
import Loader from "../../components/Loader";
import { useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";

const Appointments = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [status, setStatus] = useState("all");
  const [countLoading, setCountLoading] = useState(true);
  const [countsStates, setCountsStates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);

  const [deleteLoading, setDeleteLoading] = useState(null);

  //  get doctors
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [lastPage, setLastPage] = useState(0);

  useEffect(() => {
    getCounts();
  }, [currentUser]);

  useEffect(() => {
    getAppointments(1);
  }, [status]);

  useEffect(() => {
    getAppointments(page);
  }, [page]);

  const getCounts = async () => {
    try {
      if (!countLoading) setCountLoading(true);
      const res = await getAppointmentCountsHelper(currentUser?._id);
      setCountsStates(res?.data);
    } catch (err) {
    } finally {
      setCountLoading(false);
    }
  };

  const getAppointments = async (nextPage = 1) => {
    if (!currentUser?._id) return console.log("userId is required.");
    try {
      if (!loading) {
        setLoading(true);
      }
      const res = await getSingleUserAppointmentsHelper(
        currentUser?._id,
        nextPage,
        limit,
        status,
      );
      if (page !== nextPage) return setPage(nextPage);
      setAppointments(res.data);
      setTotal(res?.meta?.total);
      setLastPage(res?.meta?.totalPages);
    } catch (err) {
      console.error("Failed to get doctors:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleDelete = async (Id) => {
    try {
      setDeleteLoading(Id);
      await deleteAppointmentHelper(Id);
      const res = await getSingleUserAppointmentsHelper(
        currentUser?._id,
        page,
        limit,
        status,
      );
      setAppointments(res.data);
      setTotal(res?.meta?.total);
      setLastPage(res?.meta?.totalPages);
    } catch (error) {
    } finally {
      setDeleteLoading(null);
    }
  };

  const appointmentsColumns = [
    {
      name: "Doctor",
      width: "15%",
      row: (c) => (
        <>
          <strong className="capital">{c?.doctor?.name || "N/A"}</strong>
          <p>{c?.doctor?.email || "N/A"}</p>
        </>
      ),
    },
    {
      name: "Status",
      width: "110px",
      row: (c) => (
        <span
          className={`custom-status custom-status-${
            c?.status === "pending"
              ? "pending"
              : c?.status === "rejected"
                ? "suspended"
                : "active"
          }`}
        >
          {c?.status || "N/A"}
        </span>
      ),
    },
    {
      name: "Appoint For",
      width: "15%",
      row: (c) => c?.appointmentType || "N/A",
    },
    {
      name: "Description",
      width: "25%",
      row: (c) => c?.description || "N/A",
    },
    {
      name: "fee",
      row: (c) => `Rs ${c?.fee}` || "N/A",
    },
    {
      name: "Actions",
      bothClass: "custom-table-action",
      row: (c) => (
        <div className="custom-table-action-container">
          <button
            className="custom-table-action-btn active"
            onClick={() => navigate(`/appointment-details/${c._id}`)}
          >
            View Details
          </button>
          {c?.status === "pending" &&
            (deleteLoading === c?._id ? (
              <button className="custom-table-action-btn active">
                <Loader
                  size="12"
                  stroke="2"
                  color="#fff"
                  style={{ height: "16px" }}
                />
              </button>
            ) : (
              <button
                className="custom-table-action-btn inactive"
                onClick={() => handleDelete(c?._id)}
              >
                Delete
              </button>
            ))}
        </div>
      ),
    },
  ];

  return (
    <div className="page-container">
      <Header
        title="All Appointments"
        desc="View and manage all appointment history"
      />
      <div className="custom-stats-row">
        {/* <StatesCard
          iconBg="#00c29b"
          title="Total Appointments"
          value={countsStates?.totalAppointments || 0}
          icon={UserCheck}
          loading={countLoading}
        /> */}
        <StatesCard
          iconBg="rgb(193 198 17)"
          title="Pending Appointments"
          value={countsStates?.pendingAppointments || 0}
          icon={ClipboardClock}
          loading={countLoading}
        />
        <StatesCard
          iconBg="rgb(0, 201, 80)"
          title="Approved Appointments"
          value={countsStates?.approvedAppointments || 0}
          icon={ClipboardPlus}
          loading={countLoading}
        />
        <StatesCard
          iconBg="rgb(255, 0, 0)"
          title="Rejected Appointments"
          value={countsStates?.rejectedAppointments || 0}
          icon={ClipboardX}
          loading={countLoading}
        />
        <StatesCard
          iconBg="#00c29b"
          title="Completed Appointments"
          value={countsStates?.completedAppointments || 0}
          icon={ClipboardCheck}
          loading={countLoading}
        />
      </div>
      <Tab
        activeTab={status}
        setActiveTab={setStatus}
        tabs={[
          { label: "All", filter: "all" },
          { label: "Pending", filter: "pending" },
          { label: "Approved", filter: "approved" },
          { label: "Rejected", filter: "rejected" },
          { label: "Completed", filter: "completed" },
        ]}
      />
      <div className="custom-table-card">
        <h3 className="custom-section-title">All Appointments</h3>
        <CustomTable
          data={appointments}
          columns={appointmentsColumns}
          show={`${
            appointments?.length > 0
              ? `Showing ${(page - 1) * limit + 1}–${Math.min(
                  page * limit,
                  total,
                )} of ${total} Appointments`
              : "Showing 0–0 of 0 Appointments"
          }`}
          page={page}
          lastPage={lastPage}
          handlePageChange={handlePageChange}
          loading={loading}
          loadingHeight="500px"
        />
      </div>
    </div>
  );
};

export default Appointments;
