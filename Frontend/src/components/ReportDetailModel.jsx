import React from "react";
import "../assets/style/Reports.css"
import { ProfileImage } from "./CustomComponents";
import { timeAgo } from "../utils/Helper";
import { IMAGES } from "../utils/constants";

const ReportDetailModel = ({ data, onClose }) => {

  return (
    <div onClick={onClose} className="model-overlay">
      <div onClick={(e) => e.stopPropagation()} className="model-content">
        <div className="model-header">
          <h3 className="model-header-title">Report Details</h3>
          <button onClick={onClose} className="model-header-close-btn">
            ×
          </button>
        </div>
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
        </div>
      </div>
    </div>
  );
};

export default ReportDetailModel;
