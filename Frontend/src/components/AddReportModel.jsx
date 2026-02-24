import React, { useEffect, useState } from "react";
import { Plus, XCircle } from "lucide-react";
import { Input, LoadMore, Selector } from "./CustomComponents";
import "../assets/style/Services.css";
import { toast } from "sonner";
import { getUsersByTypeHelper } from "../services/UsersHelper";
import { useAuth } from "../context/AuthContext";
import { limit } from "../utils/constants";
import { addReportHelper, updateReportHelper } from "../services/ReportsHelper";

const AddReportModel = ({
  disabled = false,
  data = null,
  setData = () => {},
  afterAction = null,
}) => {
  const { currentUser } = useAuth();
  const [isAdd, setIsAdd] = useState(false);
  const [reportType, setReportType] = useState("feedback");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [reportedUser, setReportedUser] = useState(null);
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(false);

  // get all doctors for reported user selection
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [search, setSearch] = useState("");
  const [reportedUsersList, setReportedUsersList] = useState([]);

  useEffect(() => {
    if (data !== null) {
      setIsAdd(true);
      setReportType(data?.reportType || "feedback");
      setTitle(data?.title || "");
      setDescription(data?.description || "");
      setReportedUser(data?.reported || null);
      setEdit(true);
    } else {
      setEdit(false);
      setData(null);
    }
  }, [data]);

  useEffect(() => {
    handleGetReportedUser(search);
  }, [search, page]);

  const handleGetReportedUser = async (search = "") => {
    if (search.trim() === "") return;
    const role = currentUser?.role === "doctor" ? "patient" : "doctor";
    try {
      setLoadingUsers(true);
      const res = await getUsersByTypeHelper(
        page,
        limit,
        search,
        role,
        null,
        "viewed",
      );
      setLastPage(res.meta.totalPages || 1);
      setReportedUsersList((prevList) => {
        const newList = res.data || [];
        const filteredNewList = newList.filter(
          (newUser) => !prevList.some((user) => user._id === newUser._id),
        );
        return [...prevList, ...filteredNewList];
      });
    } catch (err) {
      console.error("Failed to fetch reported user:", err);
      toast.error(err.message || "Failed to fetch reported user");
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleLoadMore = () => {
    if (page >= lastPage) return;
    setPage((prevPage) => prevPage + 1);
  };

  const handleSelectReportedUser = (user) => {
    setReportedUser(user);
    setSearch("");
    setPage(1);
    setLastPage(1);
    setReportedUsersList([]);
  };

  const validations = () => {
    if (reportType !== "issue" && !reportedUser) {
      toast.error("reported user is required.");
      return false;
    }
    if (!title) {
      toast.error("title is required.");
      return false;
    }
    if (!description) {
      toast.error("description is required.");
      return false;
    }
    return true;
  };

  const handleCreateReport = async () => {
    if (!validations()) return;
    try {
      setLoading(true);
      await addReportHelper({
        sender: currentUser?._id || null,
        receiver: reportedUser?._id || null,
        reportType,
        title,
        description,
        reported: reportedUser?._id || null,
      });
      if (afterAction !== null) {
        afterAction();
      }
      handleClose();
      toast.success("report created successfully");
    } catch (err) {
      console.error("Failed to create report:", err);
      toast.error(err.message || "Failed to create report");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateReport = async () => {
    if (!validations()) return;
    try {
      setLoading(true);
      await updateReportHelper(data._id, {
        sender: currentUser?._id || null,
        receiver: reportedUser?._id || null,
        reportType,
        title,
        description,
        reported: reportedUser?._id || null,
      });
      if (afterAction !== null) {
        afterAction();
      }
      handleClose();
      toast.success("service updated successfully");
    } catch (err) {
      console.error("Failed to update service:", err);
      toast.error(err.message || "Failed to update service");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (loading) return;
    setIsAdd(false);
    setReportType("feedback");
    setReportedUser(null);
    setSearch("");
    setTitle("");
    setDescription("");
    setEdit(false);
    setData(null);
  };

  return (
    <div className="add-services-container">
      <button
        className="add-services-model-open-btn"
        onClick={() => setIsAdd(true)}
        disabled={disabled}
      >
        <span className="icon">
          <Plus size={18} />
        </span>
        Add Report
      </button>
      {isAdd && (
        <div disabled={loading} onClick={handleClose} className="model-overlay">
          <div onClick={(e) => e.stopPropagation()} className="model-content">
            <div className="model-header">
              <h3 className="model-header-title">
                {edit ? "Edit" : "Add"} Report
              </h3>
              <button onClick={handleClose} className="model-header-close-btn">
                ×
              </button>
            </div>
            <div className="model-content-container">
              <label className="custom-input-label">Report Type</label>
              <Selector
                disabled={false}
                filter={reportType}
                setFilter={setReportType}
                options={[
                  { label: "Feedback", filter: "feedback" },
                  { label: "Issue", filter: "issue" },
                  { label: "Complaint", filter: "complaint" },
                ]}
                margin="6px 0 0 0"
                width="100%"
                position="right"
              />
              {reportType !== "issue" &&
                (reportedUser ? (
                  <>
                    <label className="custom-input-label">Reported User</label>
                    <div
                      style={{ width: "100%", margin: "6px 0px 0px" }}
                      className="customs-filter-container"
                    >
                      <div className="customs-filter-selector">
                        <span className="elepsis">{reportedUser.name}</span>
                        <span className="icon">
                          <XCircle
                            size={17}
                            onClick={() => setReportedUser(null)}
                          />
                        </span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="search-report-user">
                    <Input
                      label="Report User"
                      value={search}
                      setValue={setSearch}
                      placeholder="Search for a user"
                      margin=""
                    />
                    {search.trim() !== "" && (
                      <div
                        style={{ width: "100%" }}
                        className="customs-filter-selection-container"
                      >
                        {reportedUsersList.length > 0 ? (
                          <>
                            {reportedUsersList.map((user) => (
                              <div
                                key={user._id}
                                className={`customs-filter-item elepsis  ${
                                  reportedUser?._id === user._id ? "active" : ""
                                }`}
                                onClick={() => handleSelectReportedUser(user)}
                              >
                                {user.name} ({user.email})
                              </div>
                            ))}
                            <LoadMore
                              loading={loadingUsers}
                              disabled={loadingUsers}
                              show={loadingUsers || page < lastPage}
                              onLoad={handleLoadMore}
                            />
                          </>
                        ) : (
                          <div className="customs-filter-item elepsis">
                            No users found.
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              <Input
                label="Title"
                value={title}
                setValue={setTitle}
                placeholder="Add title of report"
              />

              <Input
                label="Description"
                value={description}
                setValue={setDescription}
                placeholder="Add description of report"
                type="textArea"
              />
              <div className="add-services-action-container">
                <button
                  onClick={handleClose}
                  disabled={loading}
                  className="add-services-action-btn cencel"
                >
                  Cencel
                </button>
                <button
                  onClick={edit ? handleUpdateReport : handleCreateReport}
                  className="add-services-action-btn confirm"
                  disabled={loading}
                >
                  {edit && loading
                    ? "Updating..."
                    : !edit && loading
                      ? "Saving..."
                      : edit && !loading
                        ? "Update report"
                        : "Save report"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddReportModel;
