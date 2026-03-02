import React, { useEffect, useState } from "react";
import { formateDate, getUserById } from "../../utils/Helper";
import { useNavigate, useParams } from "react-router-dom";
import { GoBackBtn, ProfileImage } from "../CustomComponents";
import "../../assets/style/DoctorDetails.css";
import Loader from "../Loader";
import { IMAGES, limit } from "../../utils/constants";
import { updateUserStatusHelper } from "../../services/UsersHelper";
import { toast } from "sonner";
import { CalendarClockIcon, LucideCalendarRange, Mail } from "lucide-react";
import { getSingleUserAppointmentsHelper } from "../../services/AppointmentsServices";
import CustomTable from "../CustomTable";

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

const DoctorDetails = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [loading, setLoading] = useState(true);
  const [statusLoading, setStatusLoading] = useState(false);
  const [user, setUser] = useState(null);

  // Appointments
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [lastPage, setLastPage] = useState(0);
  const [appointments, setAppointments] = useState([]);
  const [appointmentLoading, setAppointmentLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      fetchUser(userId);
      getAppointments(1);
    } else setLoading(false);
  }, [userId]);

  useEffect(() => {
    getAppointments(page);
  }, [page]);

  const fetchUser = async (id) => {
    try {
      const res = await getUserById?.(id);
      setUser(res ?? null);
    } catch (err) {
      console.error("Failed to fetch user:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      setStatusLoading(true);
      await updateUserStatusHelper(userId, newStatus);
      setUser((prev) => ({ ...prev, status: newStatus }));
      toast.success("Status change successfuly");
    } catch (err) {
      console.error("Failed to change status:", err);
      toast.error("Failed to change status");
    } finally {
      setStatusLoading(false);
    }
  };

  const getAppointments = async (nextPage = 1) => {
    if (!userId) {
      setAppointmentLoading(false);
      return console.log("userId is required.");
    }
    try {
      if (!loading) {
        setAppointmentLoading(true);
      }
      const res = await getSingleUserAppointmentsHelper(
        userId,
        nextPage,
        limit,
      );
      if (page !== nextPage) return setPage(nextPage);
      setAppointments(res.data);
      setTotal(res?.meta?.total);
      setLastPage(res?.meta?.totalPages);
    } catch (err) {
      console.error("Failed to get doctors:", err);
    } finally {
      setAppointmentLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  if (loading) {
    return (
      <>
        <Loader />
      </>
    );
  }

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
        </div>
      ),
    },
  ];

  return (
    <div className="page-container">
      <GoBackBtn title="Back to All Users" onBack="/admin/users" />
      {user ? (
        <div>
          <SectionCard>
            <div className="doctor-details-header">
              <ProfileImage
                Image={user?.profilImg || IMAGES.PlaceHolder}
                className="doctor-details-avatar"
              />

              <div className="doctor-details-main-info">
                <div className="doctor-details-name">
                  <h2>{user?.name ?? "No Name"}</h2>{" "}
                  <span
                    className={`doctor-details-status ${
                      user?.status === "approved" ? "active" : "inactive"
                    }`}
                  >
                    {user?.status === "approved" ? "Approved" : "Rejected"}
                  </span>
                </div>
                <div
                  style={{ marginTop: "10px" }}
                  className="doctor-consultation-content"
                >
                  <span style={{ width: "24px" }} className="icon">
                    <Mail size={16} />
                  </span>
                  <span>{user?.email || "N/A"}</span>
                </div>
                <div
                  style={{ marginTop: "10px" }}
                  className="doctor-consultation-content"
                >
                  <span style={{ width: "24px" }} className="icon">
                    <CalendarClockIcon size={16} />
                  </span>
                  <span>{formateDate(user?.createdAt) || "N/A"}</span>
                </div>
              </div>
              <button
                style={{ marginLeft: "auto" }}
                className={`custom-table-action-btn ${user?.status === "approved" ? "inactive" : "active"}`}
                disabled={statusLoading}
                onClick={() =>
                  handleStatusChange(
                    user?.status === "approved" ? "rejected" : "approved",
                  )
                }
              >
                {statusLoading ? (
                  <Loader
                    size="12"
                    stroke="2"
                    color="#fff"
                    style={{ height: "16px" }}
                  />
                ) : user?.status === "approved" ? (
                  "Reject"
                ) : (
                  "Approve"
                )}
              </button>
            </div>
          </SectionCard>
          <SectionCard
            margin="0px"
            icon={LucideCalendarRange}
            title="All appointments"
          >
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
              loading={appointmentLoading}
              loadingHeight="500px"
              style={{marginTop:"25px"}}
            />
          </SectionCard>
        </div>
      ) : (
        <div className="no-data-cell">No user found.</div>
      )}
    </div>
  );
};

export default DoctorDetails;
