import React, { useEffect, useState } from "react";
import {formateDate, getUserById} from "../../utils/Helper";
import { useParams } from "react-router-dom";
import { GoBackBtn, ProfileImage } from "../CustomComponents";
import "../../assets/style/DoctorDetails.css";
import Loader from "../Loader";
import { IMAGES } from "../../utils/constants";
import { updateUserStatusHelper } from "../../services/UsersHelper";
import { toast } from "sonner";
import { Award, CalendarClockIcon, LucideCalendarRange, Mail} from "lucide-react";

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
  const { userId } = useParams();
  const [loading, setLoading] = useState(true);
  const [statusLoading, setStatusLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (userId) fetchUser(userId);
  }, [userId]);

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
      setDoctor((prev) => ({ ...prev, status: newStatus }));
      toast.success("Status change successfuly");
    } catch (err) {
      console.error("Failed to change status:", err);
      toast.error("Failed to change status");
    } finally {
      setStatusLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Loader />
      </>
    );
  }
  

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
                  <span className="icon">
                    <Mail size={16} />
                  </span>
                  <span>{user?.email || "N/A"}</span>
                </div>
                <div
                  style={{ marginTop: "10px" }}
                  className="doctor-consultation-content"
                >
                  <span className="icon">
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
            <p className="no-data-cell">No appointments Data found.</p>
          </SectionCard>
        </div>
      ) : (
        <div className="no-data-cell">No user found.</div>
      )}
    </div>
  );
};

export default DoctorDetails;
