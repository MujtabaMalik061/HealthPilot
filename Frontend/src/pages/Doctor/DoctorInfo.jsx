import React, { useEffect, useState } from "react";
import {
  Header,
  Input,
  LoadMore,
  SearchInput,
} from "../../components/CustomComponents";
import { useAuth } from "../../context/AuthContext";
import { toast } from "sonner";
import Loader from "../../components/Loader";
import { updateDoctorDetailsHelper } from "../../services/DoctorInfoHelper";
import { Plus, X } from "lucide-react";
import { useDebounce } from "../../utils/hooks/useDebounce";
import { getServicesHelper } from "../../services/AdminServices";
import { limit } from "../../utils/constants";
import { getAdminId, getUserById } from "../../utils/Helper";
import { addReportHelper } from "../../services/ReportsHelper";

const DoctorInfo = () => {
  const { currentUser } = useAuth();
  const [loadingType, setLoadingType] = useState("");

  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [timeCycle, setTimeCycle] = useState("");
  const [available, setAvailable] = useState(true);
  const [specialist, setSpecialist] = useState([]);
  const [educationInput, setEducationInput] = useState("");
  const [educationAndTraining, setEducationAndTraining] = useState([]);
  const [availableDayInput, setAvailableDayInput] = useState({
    day: "",
    start: "",
    end: "",
  });
  const [availableDays, setAvailableDays] = useState([]);

  // get Services
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchServices, setSearchServices] = useState("");
  const [loadMoreLoading, setLoadMoreLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const debouncedSearch = useDebounce(searchServices, 500);

  // useEffect(() => {
  //   fetchAdmin();
  // }, []);

  // const fetchAdmin = async () => {
  //   try {
  //     const res = await getAdminId();
  //     console.log("Admin ID:", res?.adminId);
  //     const adminData = await getUserById(res?.adminId);
  //     console.log("adminData--->", adminData);
  //   } catch (err) {
  //     console.error("Failed to get admin ID:", err);
  //   }
  // };

  useEffect(() => {
    if (currentUser) {
      setLocation(currentUser.location || "");
      setDescription(currentUser.description || "");
      setPrice(currentUser.price || "");
      setTimeCycle(currentUser.timeCycle || "");
      setAvailable(currentUser.available ?? true);
      setSpecialist(currentUser.specialist || []);
      setEducationAndTraining(currentUser.educationAndTraining || []);
      setAvailableDays(currentUser.availableDays || []);
    }
  }, [currentUser]);

  useEffect(() => {
    if (!debouncedSearch.trim()) return setServices([]);
    getServices(1, debouncedSearch);
  }, [debouncedSearch]);

  const getServices = async (nextPage = 1, searchValue = searchServices) => {
    if (!debouncedSearch.trim()) return setServices([]);
    try {
      if (nextPage === 1) setLoading(true);
      else setLoadMoreLoading(true);

      const res = await getServicesHelper(nextPage, limit, searchValue);

      if (nextPage === 1) {
        setServices(res.data);
      } else {
        setServices((prev) => [...prev, ...res.data]);
      }

      setTotal(res.total);
      setPage(nextPage);
    } catch (err) {
      console.error("Failed to get Services:", err);
    } finally {
      setLoading(false);
      setLoadMoreLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (services.length >= total) return;
    getServices(page + 1);
  };

  const handleUpdateDetails = async () => {
    try {
      setLoadingType("updateDoctor");
      const payload = {
        specialist,
        location,
        description,
        price,
        timeCycle,
        available,
        educationAndTraining,
        availableDays,
      };
      await updateDoctorDetailsHelper(currentUser._id, payload);
      toast.success("Doctor info updated successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update doctor info");
    } finally {
      setLoadingType("");
    }
  };

  const handleAddSpecialist = (speciality) => {
    const trimmed = speciality.trim();
    if (!trimmed) return;
    setSpecialist([...specialist, trimmed]);
    setSearchServices("");
  };

  const handleRemoveSpecialist = (index) => {
    const arr = [...specialist];
    arr.splice(index, 1);
    setSpecialist(arr);
  };

  const handleAddEducation = () => {
    const trimmed = educationInput.trim();
    if (!trimmed) return;
    setEducationAndTraining([...educationAndTraining, trimmed]);
    setEducationInput("");
  };

  const handleRemoveEducation = (index) => {
    const arr = [...educationAndTraining];
    arr.splice(index, 1);
    setEducationAndTraining(arr);
  };

  const handleAddDay = () => {
    const { day, start, end } = availableDayInput;
    if (!day || !start || !end) return; // ignore incomplete input
    setAvailableDays([...availableDays, { day, start, end }]);
    setAvailableDayInput({ day: "", start: "", end: "" });
  };

  const handleRemoveDay = (index) => {
    const arr = [...availableDays];
    arr.splice(index, 1);
    setAvailableDays(arr);
  };

  const handleApplyService = async () => {
    const trimmed = searchServices.trim();
    if (!trimmed) return;

    try {
      const adminRes = await getAdminId();
      const adminId = adminRes?.adminId;

      await addReportHelper({
        sender: currentUser?._id,
        receiver: adminId,
        reportType: "application",
        title: "Add a more service",
        description: `Hey, admin am requested to you for add a more service with name "${trimmed}".`,
      });
      toast.success("Request sent to admin for approval");
      setSearchServices("");
    } catch (err) {
      toast.error("Failed to send request");
    }
  };

  return (
    <div className="page-container">
      <Header title="Doctor Info" desc="Manage your profile details" />

      <section className="settings-section">
        <h2 className="settings-section-title">Basic Info</h2>
        <Input
          label="Location"
          value={location}
          setValue={setLocation}
          placeholder="New York Medical Center"
        />
        <Input
          label="Description"
          type="textArea"
          value={description}
          setValue={setDescription}
          placeholder="About yourself..."
        />
        <Input
          label="Price per session"
          value={price}
          setValue={setPrice}
          placeholder="150"
          InputType="number"
        />
        <Input
          label="Session time cycle"
          value={timeCycle}
          setValue={setTimeCycle}
          placeholder="30min or 1h..."
        />
      </section>

      <section className="settings-section">
        <h2 className="settings-section-title">Specialist</h2>

        <div className="auth-multi-input">
          <SearchInput
            value={searchServices}
            setValue={setSearchServices}
            placeholder="Search specialties..."
            margin="20px 0px 9px"
          />
          {searchServices.trim() && (
            <div className="icon-suggestion-container">
              {loading ? (
                <div style={{ padding: "10px", width: "100%" }}>
                  <Loader size={15} stroke="2" />
                </div>
              ) : services.length > 0 ? (
                <>
                  {services.map((service, index) => (
                    <button
                      onClick={() => handleAddSpecialist(service?.title)}
                      key={index}
                      className="icon-suggestion-item"
                    >
                      <span>{service?.title}</span>
                    </button>
                  ))}

                  <LoadMore
                    loading={loadMoreLoading}
                    disabled={loadMoreLoading}
                    show={services.length < total}
                    onLoad={handleLoadMore}
                    style={{ margin: "8px 0px" }}
                  />
                </>
              ) : (
                <div
                  style={{
                    padding: "10px",
                    textAlign: "center",
                    width: "100%",
                    opacity: 0.6,
                  }}
                >
                  No service found.
                  <span
                    onClick={handleApplyService}
                    style={{
                      color: "var(--primary)",
                      textDecoration: "underline",
                      cursor: "pointer",
                    }}
                  >
                    Request to add this specialty.
                  </span>
                </div>
              )}
            </div>
          )}
          {specialist?.length > 0 && (
            <div className="multi-items">
              {specialist.map((item, idx) => (
                <span key={idx} className="multi-item">
                  {item}{" "}
                  <span className="icon">
                    <X size={8} onClick={() => handleRemoveSpecialist(idx)} />
                  </span>
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="settings-section">
        <h2 className="settings-section-title">Education & Training</h2>

        <div className="auth-multi-input">
          <div className="auth-multi-input-wrapper">
            <div>
              <Input
                label="Education & Training"
                value={educationInput}
                setValue={setEducationInput}
                placeholder="Add education/training"
                margin="6px 0px 0px 0px"
              />
            </div>

            <button
              type="button"
              className="auth-multi-input-add-btn"
              onClick={handleAddEducation}
            >
              <Plus size={16} />
            </button>
          </div>

          {educationAndTraining?.length > 0 && (
            <div className="multi-items">
              {educationAndTraining.map((item, idx) => (
                <span key={idx} className="multi-item">
                  {item}{" "}
                  <span className="icon">
                    <X size={8} onClick={() => handleRemoveEducation(idx)} />
                  </span>
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="settings-section">
        <h2 className="settings-section-title">Available Days</h2>

        <div className="auth-multi-input">
          <div className="auth-multi-input-wrapper">
            <div className="settings-grid-three">
              <div>
                <Input
                  label="Day"
                  value={availableDayInput.day}
                  placeholder="Monday..."
                  setValue={(val) =>
                    setAvailableDayInput((p) => ({ ...p, day: val }))
                  }
                  margin="6px 0px 0px"
                />
              </div>
              <div>
                <Input
                  label="Start"
                  value={availableDayInput.start}
                  setValue={(val) =>
                    setAvailableDayInput((p) => ({ ...p, start: val }))
                  }
                  InputType="time"
                  margin="6px 0px 0px"
                />
              </div>
              <div>
                <Input
                  label="End"
                  value={availableDayInput.end}
                  setValue={(val) =>
                    setAvailableDayInput((p) => ({ ...p, end: val }))
                  }
                  InputType="time"
                  margin="6px 0px 0px"
                />
              </div>
            </div>

            <button
              type="button"
              className="auth-multi-input-add-btn"
              onClick={handleAddDay}
            >
              <Plus size={16} />
            </button>
          </div>

          {availableDays?.length > 0 && (
            <div className="multi-items">
              {availableDays.map((item, idx) => (
                <span key={idx} className="multi-item">
                  {item.day} ({item.start} - {item.end}){" "}
                  <span className="icon">
                    <X size={8} onClick={() => handleRemoveDay(idx)} />
                  </span>
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      <button
        className="settings-primary-button"
        onClick={handleUpdateDetails}
        disabled={loadingType !== ""}
      >
        {loadingType === "updateDoctor" ? <Loader size={15} /> : "Save Changes"}
      </button>
    </div>
  );
};

export default DoctorInfo;
