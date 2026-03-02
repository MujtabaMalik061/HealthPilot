import React, { useEffect, useState } from "react";
import {
  EllipsisSelector,
  Header,
  LoadMore,
  Tab,
} from "../../components/CustomComponents";
import AddReportModel from "../../components/AddReportModel";
import {
  deleteReportHelper,
  getReportsSingleUserHelper,
} from "../../services/ReportsHelper";
import Loader from "../../components/Loader";
import { useAuth } from "../../context/AuthContext";
import { formateDate } from "../../utils/Helper";
import ReportDetailModel from "../../components/ReportDetailModel";
import { limit } from "../../utils/constants";
import { toast } from "sonner";
import { Edit, Eye, Trash2 } from "lucide-react";

const Reports = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("receiver");
  const [reports, setReports] = useState([]);
  const [reportDetails, setReportDetails] = useState(null);
  const [editReport, setEditReport] = useState(null);

  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loadingLoadMore, setLoadingLoadMore] = useState(false);

  useEffect(() => {
    setPage(1);
    setReports([]);
  }, [tab]);

  useEffect(() => {
    getReports();
  }, [tab, page]);

  const getReports = async () => {
    try {
      if (page === 1) setLoading(true);
      else setLoadingLoadMore(true);
      const res = await getReportsSingleUserHelper(
        currentUser?._id,
        tab,
        page,
        limit,
      );
      setLastPage(res.meta.totalPages || 1);
      setReports((prev) =>
        page === 1 ? res.data || [] : [...prev, ...(res.data || [])],
      );
    } catch (err) {
      console.error("Error fetching reports:", err);
    } finally {
      setLoading(false);
      setLoadingLoadMore(false);
    }
  };

  const afterAction = async () => {
    try {
      const res = await getReportsSingleUserHelper(
        currentUser?._id,
        tab,
        1,
        limit,
      );
      setLastPage(res.meta.totalPages || 1);
      setReports(res.data);
    } catch (err) {
      console.error("Error fetching reports:", err);
    }
  };

  const handleLoadMore = () => {
    if (page >= lastPage) return;
    setPage((prevPage) => prevPage + 1);
  };

  const handleDelete = async (reportId) => {
    try {
      await deleteReportHelper(reportId);
      setReports((prev) => prev.filter((r) => r._id !== reportId));
      toast.success("Report deleted successfully");
    } catch (err) {
      console.error("Error deleting report:", err);
      toast.error(err?.message || "Failed to delete report");
    } finally {
    }
  };

  return (
    <div className="page-container">
      <div className="reports-header-container">
        <Header
          title="All Reports"
          desc="Manage and track all your reports in one place."
        />
        <AddReportModel
          disabled={loading}
          data={editReport}
          setData={setEditReport}
          afterAction={afterAction}
        />
      </div>
      <Tab
        activeTab={tab}
        setActiveTab={setTab}
        tabs={[
          { label: "Received", filter: "receiver" },
          { label: "Sent", filter: "sender" },
        ]}
      />
      <div>
        {loading ? (
          <div
            style={{
              minHeight: "60vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Loader />
          </div>
        ) : reports?.length > 0 ? (
          <div className="reports-list-container">
            {reports?.map((report) => (
              <div key={report._id} className="report-card">
                <div className="report-header">
                  <div className="report-header-left">
                    <span
                      className={`report-type ${report.reportType?.toLowerCase()}`}
                    >
                      {report?.reportType || "N/A"}
                    </span>

                    <span className={`report-status ${report.status}`}>
                      {report?.status || "N/A"}
                    </span>
                  </div>
                  <div className="report-header-right">
                    <EllipsisSelector
                      options={[
                        {
                          label: "View Details",
                          icon: Eye,
                          action: () => setReportDetails(report),
                        },
                        report?.status === "pending" &&
                          report?.sender?._id === currentUser?._id && {
                            label: "Edit Report",
                            icon: Edit,
                            action: () => setEditReport(report),
                          },
                        report?.status === "pending" &&
                          report?.sender?._id === currentUser?._id && {
                            label: "Delete Report",
                            icon: Trash2,
                            action: () => handleDelete(report?._id),
                          },
                      ].filter(Boolean)}
                    />
                  </div>
                </div>

                <h3 className="report-title">{report?.title}</h3>

                <p className="report-description elepsis">
                  {report?.description}
                </p>

                <div className="report-meta">
                  <span className="against">
                    {tab === "receiver" ? (
                      <>Reported by: {report?.sender?.name || "Unknown"}</>
                    ) : (
                      <>
                        Against:{" "}
                        {report?.reported?.name ||
                          report?.receiver?.[0]?.name ||
                          "Unknown"}
                      </>
                    )}
                  </span>
                  <span className="dot">·</span>
                  <span>{formateDate(report?.createdAt)}</span>
                </div>
              </div>
            ))}
            <LoadMore
              loading={loadingLoadMore}
              disabled={loadingLoadMore}
              show={loadingLoadMore || page < lastPage}
              onLoad={handleLoadMore}
            />
          </div>
        ) : (
          <div
            style={{
              minHeight: "60vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            className="no-data-cell"
          >
            No reports available.
          </div>
        )}
      </div>
      {reportDetails && (
        <ReportDetailModel
          data={reportDetails}
          onClose={() => setReportDetails(null)}
        />
      )}
    </div>
  );
};

export default Reports;
