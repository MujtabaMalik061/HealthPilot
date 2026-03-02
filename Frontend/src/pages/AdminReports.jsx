import React, { useEffect, useState } from "react";
import { Header, SearchInput, Tab } from "../components/CustomComponents";
import CustomTable from "../components/CustomTable";
import {
  getReportsHelper,
  updateReportHelper,
} from "../services/ReportsHelper";
import Loader from "../components/Loader";
import { toast } from "sonner";
import { timeAgo } from "../utils/Helper";
import ReportDetailModel from "../components/ReportDetailModel";
import { limit } from "../utils/constants";

const AdminReports = () => {
  // State
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [lastPage, setLastPage] = useState(0);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("pending");
  const [statusLoading, setStatusLoading] = useState(null);
  const [reportDetails, setReportDetails] = useState(null);

  const fetchReports = async (nextPage = 1) => {
    try {
      if (!loading) setLoading(true);

      const res = await getReportsHelper(nextPage, limit, search, status);

      setReports(res.data || []);
      setTotal(res.meta?.total || 0);
      setLastPage(res.meta?.totalPages || 1);
    } catch (err) {
      console.error("Failed to fetch reports:", err);
      toast.error(err?.message || "Failed to fetch reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    setReports([]);
  }, [status, search]);

  useEffect(() => {
    fetchReports(page);
  }, [page, status, search]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleStatusChange = async (reportId, newStatus) => {
    try {
      setStatusLoading(reportId);
      await updateReportHelper(reportId, { status: newStatus });
      toast.success("Report status updated successfully");
      fetchReports(page);
    } catch (err) {
      console.error("Failed to update report status:", err);
      toast.error("Failed to update report status");
    } finally {
      setStatusLoading(null);
    }
  };

  const reportsColumns = [
    {
      name: "Sender",
      row: (r) => r.sender?.name || "N/A",
    },
    {
      name: "Receiver(s)",
      row: (r) =>
        r.receiver?.length > 0
          ? r.receiver.map((rec) => rec.name).join(", ")
          : "N/A",
    },
    {
      name: "Type",
      row: (r) => r.reportType || "N/A",
    },
    {
      name: "Status",
      row: (r) => (
        <span className={`report-status ${r?.status}`}>
          {r.status || "pending"}
        </span>
      ),
    },
    {
      name: "Created At",
      row: (r) => timeAgo(r.createdAt) || "N/A",
    },
    {
      name: "Actions",
      bothClass: "custom-table-action",
      row: (r) => (
        <div className="custom-table-action-container">
          <button
            style={{
              background: "transparent",
              border: "1px solid var(--primary)",
              color: "var(--primary)",
            }}
            className="custom-table-action-btn inactive"
            onClick={() => setReportDetails(r)}
          >
            Review
          </button>
          <button
            className="custom-table-action-btn inactive"
            onClick={() => handleStatusChange(r._id, "rejected")}
          >
            {statusLoading === r._id ? "Rejecting..." : "Reject"}
          </button>
        </div>
      ),
    },
  ];

  const reportsNonActionColumns = [
    {
      name: "Sender",
      row: (r) => r.sender?.name || "N/A",
    },
    {
      name: "Receiver(s)",
      row: (r) =>
        r.receiver?.length > 0
          ? r.receiver.map((rec) => rec.name).join(", ")
          : "N/A",
    },
    {
      name: "Type",
      row: (r) => r.reportType || "N/A",
    },
    {
      name: "Status",
      row: (r) => (
        <span
          className={`report-status ${r?.status}`}
        >
          {r?.status || "N/A"}
        </span>
      ),
    },
    {
      name: "Created At",
      row: (r) => timeAgo(r.createdAt) || "N/A",
    },
  ];

  return (
    <div className="page-container">
      <Header
        title="All Reports"
        desc="Browse all reports of users and doctors and take actions."
      />

      <div className="custom-multi-filter">
        <SearchInput
          value={search}
          setValue={setSearch}
          placeholder="Search reports..."
          margin="8px 0px"
        />
      </div>
      <Tab
        activeTab={status}
        setActiveTab={setStatus}
        tabs={[
          { label: "Pending reports", filter: "pending" },
          { label: "Resolved requests", filter: "resolved" },
          { label: "Rejected requests", filter: "rejected" },
        ]}
      />
      <div className="custom-table-card">
        <h3 className="custom-section-title">Pending reports</h3>
        <CustomTable
          data={reports}
          columns={
            status === "pending" ? reportsColumns : reportsNonActionColumns
          }
          show={`${
            reports?.length > 0
              ? `Showing ${(page - 1) * limit + 1}–${Math.min(
                  page * limit,
                  total,
                )} of ${total} reports`
              : `Showing 0–0 of 0 reports`
          }`}
          page={page}
          lastPage={lastPage}
          handlePageChange={handlePageChange}
          loading={loading}
          loadingHeight="500px"
          rowClickable={status === "pending" ? false : true}
          onRowClick={(report) => {
            if (status !== "pending") {
              setReportDetails(report);
            }
          }}
        />
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

export default AdminReports;
