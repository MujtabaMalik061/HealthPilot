import React, { useState } from "react";
import "../assets/style/Reports.css";
import { Input, ProfileImage } from "./CustomComponents";
import { timeAgo } from "../utils/Helper";
import { IMAGES } from "../utils/constants";
import { useNavigate } from "react-router";
import { resolveReportHelper } from "../services/ReportsHelper";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

const ReportDetailModel = ({ data, onClose }) => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [modelType, setModelType] = useState("details");
  const [adminResponse, setAdminResponse] = useState("");

  const handleUpdateReport = async () => {
    if (adminResponse.trim() === "") return toast.error("Detail note is required.");
    try {
      await resolveReportHelper({
        reportId: data?._id,
        status: "resolved",
        adminResponse,
      });
      toast.success("report resolved successfully")
    } catch (err) {
      console.error("Failed to update report",err);
      toast.error("Failed to resolve report")
    } finally {
    }
  };

  const getActionRoute = () => {
    if (data?.reported?.role === "doctor") {
      return `/admin/doctor-details/${data?.reported?._id}`;
    } else if (data?.reported?.role === "patient") {
      return `/admin/user-details/${data?.reported?._id}`;
    } else {
      return null;
    }
  };

  const actionRoute = getActionRoute();

  return (
    <div onClick={onClose} className="model-overlay">
      <div onClick={(e) => e.stopPropagation()} className="model-content">
        <div className="model-header">
          <h3 className="model-header-title">
            {modelType === "resolve" ? "Resolve Report" : "Report Details"}
          </h3>
          <button onClick={onClose} className="model-header-close-btn">
            ×
          </button>
        </div>
        {modelType === "resolve" ? (
          <div className="model-content-container">
            <Input
              label="Notes"
              value={adminResponse}
              setValue={setAdminResponse}
              placeholder="Enter resolution details..."
              type="textArea"
            />
            <div className="report-details-actions">
              <button
                onClick={() => setModelType("details")}
                className="report-details-action btn-primary"
              >
                Back
              </button>
              <button
                onClick={handleUpdateReport}
                className="report-details-action btn-secondary"
              >
                Confirm
              </button>
            </div>
          </div>
        ) : (
          <div className="model-content-container">
            <div className="report-details-user">
              <div>
                <ProfileImage
                  Image={data?.sender?.profilImg || IMAGES.PlaceHolder}
                  className="report-details-image"
                />
              </div>
              <div>
                <strong className="report-details-role">Sender</strong>
                <p className="report-details-name">
                  {data?.sender?.name || "N/A"}
                </p>
                <p className="report-details-email">
                  {data?.sender?.email || "N/A"}
                </p>
              </div>
            </div>
            {data?.reported && (
              <div className="report-details-user">
                <div>
                  <ProfileImage
                    Image={data?.reported?.profilImg || IMAGES.PlaceHolder}
                    className="report-details-image"
                  />
                </div>
                <div>
                  <strong className="report-details-role">Reported</strong>
                  <p className="report-details-name">
                    {data?.reported?.name || "N/A"}
                  </p>
                  <p className="report-details-email">
                    {data?.reported?.email || "N/A"}
                  </p>
                </div>
              </div>
            )}
            <div className="report-details-box">
              <p>
                <strong>ReportType: </strong>
                {data?.reportType || "N/A"}
              </p>
              <p style={{ paddingTop: "5px" }}>
                <strong>Title: </strong>
                {data?.title || "N/A"}
              </p>
              <p style={{ paddingTop: "5px" }}>
                <strong>Description: </strong>
                {data?.description || "N/A"}
              </p>
            </div>
            <div className="report-details-box">
              <p>
                <strong>Time: </strong>
                {timeAgo(data?.createdAt) || "N/A"}
              </p>
            </div>
            {currentUser?.role === "admin" && data?.status === "pending" && (
              <div className="report-details-actions">
                {(data?.reportType === "feedback" ||
                  data?.reportType === "complaint") && (
                  <button
                    onClick={actionRoute ? () => navigate(actionRoute) : null}
                    className="report-details-action btn-primary"
                  >
                    Take Action
                  </button>
                )}
                <button
                  onClick={() => setModelType("resolve")}
                  className="report-details-action btn-secondary"
                >
                  Resolved Report
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportDetailModel;
