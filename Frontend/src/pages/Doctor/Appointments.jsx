import React, { useEffect, useState } from "react";
import {
  Header,
  Input,
  ProfileImage,
  StatesCard,
  Tab,
} from "../../components/CustomComponents";
import {
  ClipboardCheck,
  ClipboardClock,
  ClipboardPlus,
  ClipboardX,
} from "lucide-react";
import {
  getAppointmentCountsHelper,
  getSingleUserAppointmentsHelper,
  updateAppointmentHelper,
} from "../../services/AppointmentsServices";
import { IMAGES, limit } from "../../utils/constants";
import CustomTable from "../../components/CustomTable";
import { timeAgo } from "../../utils/Helper";
import { useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { toast } from "sonner";
import Loader from "../../components/Loader";

const Appointments = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [status, setStatus] = useState("pending");
  const [countLoading, setCountLoading] = useState(true);
  const [countsStates, setCountsStates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);

  const [rejectConfirm, setRejectConfirm] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [loadingStatusChange, setLoadingStatusChange] = useState(null);

  //  get doctors
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [lastPage, setLastPage] = useState(0);

  useEffect(() => {
    getCounts();
  }, [currentUser]);

  useEffect(() => {
    getAppointments(page);
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

  const handleStatusChange = async (id, newStatus) => {
    if (newStatus === "rejected" && !currentUser?._id)
      return toast.error("you're not found.");
    if (newStatus === "rejected" && !rejectReason?.trim())
      return toast.error("Write a reason why you reject this appointment.");
    const submitData = {
      status: newStatus,
      rejectReason: rejectReason,
      cancelledBy: currentUser?._id,
    };
    setLoadingStatusChange({
      loadingType: newStatus,
      loadingFor: id,
    });
    try {
      await updateAppointmentHelper(id, submitData);
      const res = await getSingleUserAppointmentsHelper(
        currentUser?._id,
        page,
        limit,
        status,
      );
      setAppointments(res.data);
      setTotal(res?.meta?.total);
      setLastPage(res?.meta?.totalPages);
      toast.success("Appountment rejected successfully.");
    } catch (err) {
      console.error("Failed to reject Appointment:", err);
      toast.error("Failed to reject appountment.");
    } finally {
      setLoadingStatusChange(null);
      setRejectConfirm(null);
    }
  };

  const appointmentsActionColumns = [
    {
      name: "Patient",
      width: "15%",
      row: (c) => (
        <>
          <strong className="capital">{c?.patient?.name || "N/A"}</strong>
          <p>{c?.patient?.email || "N/A"}</p>
        </>
      ),
    },
    {
      name: "Status",
      width: "135px",
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
      name: "fee",
      row: (c) => `Rs ${c?.fee}` || "N/A",
    },
    {
      name: "Booking At",
      row: (c) => timeAgo(c?.createdAt) || "N/A",
    },
    {
      name: "Actions",
      bothClass: "custom-table-action",
      row: (c) =>
        status === "pending" ? (
          <div className="custom-table-action-container">
            <button
              className="custom-table-action-btn active"
              disabled={loadingStatusChange}
              onClick={(e) => {
                e.stopPropagation();
                handleStatusChange(c?._id, "approved");
              }}
            >
              {loadingStatusChange &&
              loadingStatusChange?.loadingType === "approved" &&
              loadingStatusChange?.loadingFor === c?._id ? (
                <Loader
                  color="#fff"
                  size="20"
                  stroke="2"
                  style={{ height: "17px" }}
                />
              ) : (
                "Approve"
              )}
            </button>
            <button
              className="custom-table-action-btn inactive"
              disabled={loadingStatusChange}
              onClick={(e) => {
                e.stopPropagation();
                setRejectConfirm(c);
              }}
            >
              Reject
            </button>
          </div>
        ) : (
          <div className="custom-table-action-container">
            <button
              className="custom-table-action-btn active"
              disabled={loadingStatusChange}
              onClick={(e) => {
                e.stopPropagation();
                handleStatusChange(c?._id, "completed");
              }}
            >
              {loadingStatusChange &&
              loadingStatusChange?.loadingType === "completed" &&
              loadingStatusChange?.loadingFor === c?._id ? (
                <Loader
                  color="#fff"
                  size="20"
                  stroke="2"
                  style={{ height: "17px" }}
                />
              ) : (
                "Completed"
              )}
            </button>
          </div>
        ),
    },
  ];

  const appointmentsNonActionColumns = [
    {
      name: "Patient",
      width: "15%",
      row: (c) => (
        <>
          <strong className="capital">{c?.patient?.name || "N/A"}</strong>
          <p>{c?.patient?.email || "N/A"}</p>
        </>
      ),
    },
    {
      name: "Status",
      width: "135px",
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
      name: "fee",
      row: (c) => `Rs ${c?.fee}` || "N/A",
    },
    {
      name: "Booking At",
      row: (c) => timeAgo(c?.createdAt) || "N/A",
    },
    // {
    //   name: "Actions",
    //   bothClass: "custom-table-action",
    //   row: (c) => (
    //     <div className="custom-table-action-container">
    //       <button
    //         className="custom-table-action-btn active"
    //         disabled={loadingStatusChange}
    //         onClick={(e) => {
    //           e.stopPropagation();
    //           handleStatusChange(c?._id, "approved");
    //         }}
    //       >
    //         {loadingStatusChange &&
    //         loadingStatusChange?.loadingType === "approved" &&
    //         loadingStatusChange?.loadingFor === c?.id ? (
    //           <Loader
    //             color="#fff"
    //             size="20"
    //             stroke="2"
    //             style={{ height: "17px" }}
    //           />
    //         ) : (
    //           "Approve"
    //         )}
    //       </button>
    //       <button
    //         className="custom-table-action-btn inactive"
    //         disabled={loadingStatusChange}
    //         onClick={(e) => {
    //           e.stopPropagation();
    //           setRejectConfirm(c);
    //         }}
    //       >
    //         Reject
    //       </button>
    //     </div>
    //   ),
    // },
  ];

  return (
    <div className="page-container">
      <Header
        title="All Appointments"
        desc="View and manage all appointment history"
      />
      <div className="custom-stats-row">
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
          // { label: "All", filter: "all" },
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
          columns={
            status === "pending" || status === "approved"
              ? appointmentsActionColumns
              : appointmentsNonActionColumns
          }
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
          rowClickable={true}
          onRowClick={(rowData) =>
            navigate(`/appointment-details/${rowData?._id}`)
          }
        />
      </div>
      {rejectConfirm && (
        <RejectConfirmModel
          onClose={() => {
            setRejectConfirm(null);
          }}
          data={rejectConfirm}
          loadingReject={loadingStatusChange}
          reason={rejectReason}
          setReason={setRejectReason}
          handleReject={() =>
            handleStatusChange(rejectConfirm?._id, "rejected")
          }
        />
      )}
    </div>
  );
};

export default Appointments;

const RejectConfirmModel = ({
  onClose,
  data,
  reason = "",
  setReason = "",
  loadingReject = false,
  handleReject,
}) => {
  const handleClose = (type = "error") => {
    if (loadingReject) return;
    setReason("");
    onClose();
  };

  return (
    <div onClick={handleClose} className="model-overlay">
      <div onClick={(e) => e.stopPropagation()} className="model-content">
        <div className="model-header">
          <h3 className="model-header-title">Appointment Reject</h3>
          <button onClick={handleClose} className="model-header-close-btn">
            ×
          </button>
        </div>
        <div className="model-content-container">
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
          <Input
            label="Reason"
            type="textArea"
            value={reason}
            setValue={setReason}
            placeholder="Reason for reject appointment..."
          />
          <div className="add-services-action-container">
            <button
              onClick={handleClose}
              disabled={loadingReject}
              className="add-services-action-btn cencel"
            >
              Cencel
            </button>
            <button
              onClick={handleReject}
              className="add-services-action-btn confirm"
              disabled={loadingReject}
            >
              {loadingReject ? "Submiting..." : "Submit"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
