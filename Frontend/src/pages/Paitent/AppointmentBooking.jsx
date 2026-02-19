import React, { useEffect, useState } from "react";
import {
  GoBackBtn,
  Header,
  Input,
  ProfileImage,
} from "../../components/CustomComponents";
import { useNavigate, useParams } from "react-router";
import { getUserById } from "../../utils/Helper";
import Loader from "../../components/Loader";
import "../../assets/style/Appointment.css";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { IMAGES } from "../../utils/constants";
import { CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../../context/AuthContext";
import {
  addAppointmentHelper,
  getDoctorAvailityTimeByDateHelper,
} from "../../services/AppointmentsServices";

const handleDateChange = (date) => {
  const cleanDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );
  const formatted = cleanDate.toDateString();
  return formatted;
};

const AppointmentBooking = () => {
  const { currentUser } = useAuth();
  const { doctorId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [appointLoading, setAppointLoading] = useState(false);
  const [loadingAvailableTime, setLoadingAvailableTime] = useState(true);

  const [doctor, setDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedStartTime, setSelectedStartTime] = useState("");
  const [selectedEndTime, setSelectedEndTime] = useState("");
  const [description, setDescription] = useState("");
  const [appointFor, setAppointFor] = useState("");

  const formatedDate = selectedDate && handleDateChange(selectedDate);

  useEffect(() => {
    if (doctorId) fetchDoctor(doctorId);
    else setLoading(false);
  }, [doctorId]);

  useEffect(() => {
    getAvailbiltyTimes(doctorId, formatedDate);
  }, [formatedDate]);

  const handleTimeSelect = (startTime, timePeriod) => {
    if (!startTime || !timePeriod) return;

    const convertToDate = (time) => {
      const date = new Date();
      if (/am|pm/i.test(time)) {
        const [timePart, modifier] = time.split(" ");
        let [hours, minutes] = timePart.split(":").map(Number);

        if (modifier.toUpperCase() === "PM" && hours !== 12) {
          hours += 12;
        }
        if (modifier.toUpperCase() === "AM" && hours === 12) {
          hours = 0;
        }

        date.setHours(hours, minutes, 0);
      } else {
        const [hours, minutes] = time.split(":").map(Number);
        date.setHours(hours, minutes, 0);
      }

      return date;
    };

    const formatToAMPM = (date) => {
      let hours = date.getHours();
      const minutes = date.getMinutes();
      const ampm = hours >= 12 ? "PM" : "AM";

      hours = hours % 12;
      if (hours === 0) hours = 12;

      return `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")} ${ampm}`;
    };

    const startDate = convertToDate(startTime);

    const endDate = new Date(startDate);
    if (timePeriod === "30min") {
      endDate.setMinutes(endDate.getMinutes() + 30);
    } else if (timePeriod === "1hr") {
      endDate.setHours(endDate.getHours() + 1);
    }

    setSelectedStartTime(formatToAMPM(startDate));
    setSelectedEndTime(formatToAMPM(endDate));
  };

  const today = new Date();

  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 1);

  const fetchDoctor = async (id) => {
    try {
      const res = await getUserById?.(id);
      setDoctor(res ?? null);
    } catch (err) {
      console.error("Failed to fetch doctor:", err);
    } finally {
      setLoading(false);
    }
  };

  const getAvailbiltyTimes = async (doctorId, date) => {
    if (!doctorId || !date) return;
    try {
      setLoadingAvailableTime(true);
      const res = await getDoctorAvailityTimeByDateHelper(doctorId, date);
      setAvailableTimes(res?.slots);
    } catch (err) {
      console.error("Failed to load Availbility:", err);
      toast.error("Failed to load Availbility");
    } finally {
      setLoadingAvailableTime(false);
    }
  };

  if (loading) {
    return (
      <>
        <Loader />
      </>
    );
  }

  const isDisabled =
    !selectedDate ||
    !selectedStartTime ||
    !selectedEndTime ||
    !description ||
    !appointFor;

  const validation = () => {
    if (!currentUser?._id) {
      toast.error("User not found.Please refresh and try again");
      return false;
    }
    if (!doctor?._id) {
      toast.error("Doctor not found.");
      return false;
    }
    if (!doctor?.price) {
      toast.error("Consultation Fee not found.");
      return false;
    }
    if (!formatedDate) {
      toast.error("Select a date for appointment.");
      return false;
    }
    if (!formatedDate) {
      toast.error("Select a date for appointment.");
      return false;
    }
    if (!selectedStartTime) {
      toast.error("Select a time for appointment.");
      return false;
    }
    if (!appointFor) {
      toast.error("Select a specialty for appointment.");
      return false;
    }
    if (!description) {
      toast.error("Describe you problem in details.");
      return false;
    }
    return true;
  };

  const handleAddAppointment = async () => {
    if (!validation()) return;
    const data = {
      doctor: doctor?._id,
      patient: currentUser?._id,
      fee: doctor?.price,
      appointmentPeriod: {
        date: formatedDate,
        startTime: selectedStartTime,
        endTime: selectedEndTime,
      },
      appointmentType: appointFor,
      description,
    };
    try {
      setAppointLoading(true);
      const res = await addAppointmentHelper(data);
      navigate(`/appointment-details/${res?.data?._id}`);
      toast.success("Appointment request submit.");
    } catch (err) {
      console.error("Failed to add appointment:", err);
      toast.error("Appointment request failed.");
    } finally {
      setAppointLoading(false);
    }
  };

  return (
    <div className="page-container">
      <GoBackBtn title="Back to All doctors" onBack="/admin/doctor" />
      <Header
        title="Book Appointment"
        desc="Select a date and time for your appointment"
      />
      {doctor ? (
        <div className="appoint-book-wrapper">
          <div className="appoint-book-left">
            <SectionCard>
              <div className="appoint-book-schedule">
                <h3 className="appoint-book-heading">Select Date & Time</h3>

                <div className="appoint-book-schedule-grid">
                  <div className="appoint-book-calendar">
                    <p className="appoint-book-subtitle">Select Date</p>

                    <div className="appoint-book-calendar-box">
                      <Calendar
                        onChange={setSelectedDate}
                        value={selectedDate ? new Date(selectedDate) : today}
                        minDate={today}
                        maxDate={maxDate}
                        view="month"
                        minDetail="month"
                        maxDetail="month"
                        prev2Label={null}
                        next2Label={null}
                        className="appoint-book-calendar-ui"
                      />
                    </div>
                  </div>
                  <div className="appoint-book-time">
                    <p className="appoint-book-subtitle">Select Time</p>
                    {loadingAvailableTime ? (
                      <Loader stroke="3" />
                    ) : availableTimes?.length > 0 ? (
                      <div className="appoint-book-time-grid">
                        {availableTimes?.map((time, i) => (
                          <button
                            key={i}
                            className={
                              selectedStartTime === time?.start
                                ? "appoint-book-time-slot active"
                                : "appoint-book-time-slot"
                            }
                            onClick={() =>
                              handleTimeSelect(time?.start, doctor?.timeCycle)
                            }
                          >
                            {time?.start}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="no-data-cell">
                        No appointment time availbale for this day.
                      </p>
                    )}
                  </div>
                  <div className="appoint-book-time">
                    <p className="appoint-book-subtitle">Appoint For</p>

                    {doctor?.specialist?.length > 0 ? (
                      <div className="appoint-book-time-grid">
                        {doctor?.specialist?.map((speciality, i) => (
                          <button
                            key={i}
                            className={
                              appointFor === speciality
                                ? "appoint-book-time-slot active"
                                : "appoint-book-time-slot"
                            }
                            onClick={() => setAppointFor(speciality)}
                          >
                            {speciality}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="no-data-cell">No specialist found.</p>
                    )}
                  </div>
                  <div className="appoint-book-time">
                    <Input
                      label="Describe your problem"
                      type="textArea"
                      placeholder="Please describe your symptoms or health concern in detail..."
                      value={description}
                      setValue={setDescription}
                    />
                  </div>
                </div>
              </div>
            </SectionCard>
          </div>
          <div className="appoint-book-right">
            <SectionCard>
              <div className="appoint-book-doctor-card">
                <div className="appoint-book-doctor-info">
                  <ProfileImage
                    Image={doctor?.profilImg || IMAGES.PlaceHolder}
                    className="appoint-book-avatar"
                  />
                  <div>
                    <h3 className="appoint-book-doctor-name">{doctor?.name}</h3>
                    <p className="appoint-book-doctor-speciality">
                      {doctor?.specialist?.length > 0
                        ? doctor.specialist.join(", ")
                        : ""}
                    </p>
                  </div>
                </div>

                <div
                  style={{ marginBottom: "10px" }}
                  className="doctor-consultation-box"
                >
                  <p className="appoint-book-fee-label">Consultation Fee</p>
                  <h2 className="appoint-book-fee-amount">
                    Rs {doctor?.price || "0"}
                  </h2>
                </div>
                {formatedDate && (
                  <div
                    style={{ marginBottom: "10px" }}
                    className="doctor-consultation-box"
                  >
                    <p className="appoint-book-fee-label">Appointment Date</p>
                    <h2 className="appoint-book-fee-amount">
                      {formatedDate || "N/A"}
                    </h2>
                  </div>
                )}
                {selectedStartTime && selectedEndTime && (
                  <div
                    style={{ marginBottom: "10px" }}
                    className="doctor-consultation-box"
                  >
                    <p className="appoint-book-fee-label">Appointment Time</p>
                    <h2 className="appoint-book-fee-amount">
                      <span style={{ color: "var(--muted-foreground)" }}>
                        At
                      </span>{" "}
                      {selectedStartTime || "N/A"}{" "}
                      <span style={{ color: "var(--muted-foreground)" }}>
                        to
                      </span>{" "}
                      {selectedEndTime || "N/A"}
                    </h2>
                  </div>
                )}
                {(appointFor || description) && (
                  <div
                    style={{ marginBottom: "10px" }}
                    className="doctor-consultation-box"
                  >
                    <p className="appoint-book-fee-label">Appoint For</p>
                    {appointFor && (
                      <div className="doctor-consultation-content">
                        <h2>Appoint:</h2>
                        <span>{appointFor || "N/A"}</span>
                      </div>
                    )}
                    {description && (
                      <div
                        style={{ marginTop: "2px" }}
                        className="doctor-consultation-content"
                      >
                        <h2>Description:</h2>
                        <span>{description || "N/A"}</span>
                      </div>
                    )}
                  </div>
                )}
                <button
                  onClick={handleAddAppointment}
                  disabled={appointLoading}
                  className={
                    appointLoading || isDisabled
                      ? "appoint-book-submit-btn disabled"
                      : "appoint-book-submit-btn"
                  }
                >
                  <span className="icon">
                    <CheckCircle size={18} />
                  </span>{" "}
                  {appointLoading ? "Submiting..." : "Submit Request"}
                </button>
              </div>
            </SectionCard>
          </div>
        </div>
      ) : (
        <div className="no-data-cell">No doctor found.</div>
      )}
    </div>
  );
};

export default AppointmentBooking;

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
