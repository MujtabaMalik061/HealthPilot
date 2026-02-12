import React, { useEffect, useState } from "react";
import {
  Header,
  SearchInput,
  StatesCard,
} from "../components/CustomComponents";
import CustomTable from "../components/CustomTable";
import { limit } from "../utils/constants";
import {
  getUsersByTypeHelper,
  updateUserStatusHelper,
  userCountStatesHelper,
} from "../services/UsersHelper";
import { timeAgo } from "../utils/Helper";
import Loader from "../components/Loader";
import { UserCheck } from "lucide-react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

const AdminUsers = () => {
  const navigate = useNavigate();
  // counts
  const [countLoading, setCountLoading] = useState(true);
  const [countsStates, setCountStates] = useState([]);

  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [statusLoading, setStatusLoading] = useState(null);

  // pagination
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [lastPage, setLastPage] = useState(0);

  useEffect(() => {
    getCountStates();
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => {
      setPage(1);
      getUsers(1);
    }, 400);

    return () => clearTimeout(delay);
  }, [search]);

  useEffect(() => {
    getUsers(page);
  }, [page]);

  const getUsers = async (nextPage = 1) => {
    try {
      if (!loading) {
        setLoading(true);
      }
      const res = await getUsersByTypeHelper(
        nextPage,
        limit,
        search,
        "patient",
        "",
        "all",
      );

      setUsers(res.data);
      setTotal(res?.meta?.total);
      setLastPage(res?.meta?.totalPages);
    } catch (err) {
      console.error("Failed to get users:", err);
    } finally {
      setLoading(false);
    }
  };

  const getCountStates = async () => {
    try {
      const res = await userCountStatesHelper("patient");
      setCountStates(res);
    } catch (err) {
      console.error("Failed to load counts:", err);
    } finally {
      setCountLoading(false);
    }
  };

  const handleStatusChange = async (userId, newStatus) => {
    try {
      setStatusLoading(userId);
      await updateUserStatusHelper(userId, newStatus);
      const usersRes = await getUsersByTypeHelper(
        page,
        limit,
        search,
        "patient",
        "",
        "all",
      );
      setUsers(usersRes.data);
      setTotal(usersRes?.meta?.total);
      setLastPage(usersRes?.meta?.totalPages);
      setCountStates((prev) => {
        const updated = { ...prev };

        if (newStatus === "approved") {
          updated.approvedUsers += 1;
          updated.rejectedUsers -= 1;
        } else if (newStatus === "rejected") {
          updated.rejectedUsers += 1;
          updated.approvedUsers -= 1;
        }

        return updated;
      });
      toast.success("Status change successfuly");
    } catch (err) {
      console.error("Failed to change status:", err);
      toast.error("Failed to change status");
    } finally {
      setStatusLoading(null);
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const usersColumns = [
    {
      name: "User",
      width: "20%",
      row: (c) => (
        <>
          <strong>{c?.name || "N/A"}</strong>
          <p>{c?.email || "N/A"}</p>
        </>
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
      name: "Total bookings",
      bothStyle: { textAlign: "center" },
      row: (c) => c?.booked?.length || 0,
    },
    {
      name: "Joined At",
      row: (c) => (c?.createdAt ? timeAgo(c?.createdAt) : "N/A"),
    },
    {
      name: "Actions",
      bothClass: "custom-table-action",
      row: (c) => (
        <div className="custom-table-action-container">
          <button
            className="custom-table-action-btn active"
            onClick={() => navigate(`/admin/user-details/${c._id}`)}
          >
            View Details
          </button>
          {statusLoading === c?._id ? (
            <button className="custom-table-action-btn active">
              <Loader
                size="12"
                stroke="2"
                color="#fff"
                style={{ height: "16px" }}
              />
            </button>
          ) : c?.status === "approved" ? (
            <button
              className="custom-table-action-btn inactive"
              onClick={() => handleStatusChange(c?._id, "rejected")}
            >
              Reject
            </button>
          ) : (
            <button
              className="custom-table-action-btn active"
              onClick={() => handleStatusChange(c?._id, "approved")}
            >
              Approve
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="page-container">
      <Header
        title="All Users"
        desc="Manage and oversee all registered users"
      />

      <div className="custom-stats-row">
        <StatesCard
          iconBg="#00c29b"
          title="Total Users"
          value={countsStates?.totalUsers || 0}
          icon={UserCheck}
          loading={countLoading}
        />
        <StatesCard
          iconBg="rgb(0, 201, 80)"
          title="Approved Users"
          value={countsStates?.approvedUsers || 0}
          icon={UserCheck}
          loading={countLoading}
        />
        <StatesCard
          iconBg="rgb(255, 0, 0)"
          title="Rejected Users"
          value={countsStates?.rejectedUsers || 0}
          icon={UserCheck}
          loading={countLoading}
        />
      </div>

      <div className="custom-multi-filter">
        <SearchInput
          value={search}
          setValue={setSearch}
          placeholder="Search users..."
          margin="8px 0"
        />
      </div>

      <div className="custom-table-card">
        <h3 className="custom-section-title">All Users</h3>

        <CustomTable
          data={users}
          columns={usersColumns}
          show={`${
            users?.length > 0
              ? `Showing ${(page - 1) * limit + 1}–${Math.min(
                  page * limit,
                  total,
                )} of ${total} Users`
              : `Showing 0–0 of 0 Users`
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

export default AdminUsers;
