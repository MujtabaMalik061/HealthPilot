import React, { useEffect, useState } from "react";
import { Calendar, DollarSign, CheckCircle, Clock } from "lucide-react";
import {
  Header,
  DashBoardStatesCard,
  ProfileImage,
} from "../../components/CustomComponents";
import {
  getDoctorCountesStatesHelper,
  getDoctorMonthlyRevenueHelper,
  getDoctorWeeklyAppointmentsHelper,
  getDoctorlatestAppointmentsHelper,
} from "../../services/DashBoardServices";
import {
  ChartSectionCard,
  SingleAreaChart,
  DoubleBarChart,
} from "../../components/Charts";
import { useAuth } from "../../context/AuthContext";
import { IMAGES } from "../../utils/constants";
import { useNavigate } from "react-router";
import Loader from "../../components/Loader";

const Dashboard = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const userId = currentUser?._id || null;
  const [loading, setLoading] = useState(true);
  const [stateCounts, setStateCounts] = useState([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [weeklyAppointments, setWeeklyAppointments] = useState([]);
  const [latestBookings, setLatestBookings] = useState([]);

  useEffect(() => {
    getAllData();
  }, []);

  const getAllData = async () => {
    try {
      setLoading(true);

      const [
        stateCountsRes,
        monthlyRevenueRes,
        weeklyAppointmentsRes,
        latestBookingsRes,
      ] = await Promise.all([
        getDoctorCountesStatesHelper(userId),
        getDoctorMonthlyRevenueHelper(userId),
        getDoctorWeeklyAppointmentsHelper(userId),
        getDoctorlatestAppointmentsHelper({
          userId,
          limit: 5,
        }),
      ]);

      setStateCounts(stateCountsRes);
      setMonthlyRevenue(monthlyRevenueRes);
      setWeeklyAppointments(weeklyAppointmentsRes);
      setLatestBookings(latestBookingsRes);
    } catch (error) {
      console.error("Failed to load dashboard data:", error.response);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <Header
        title={`Welcome, ${currentUser?.name || "Back"}!`}
        desc="Here's your practice overview for today"
      />
      <div className="custom-stats-row">
        <DashBoardStatesCard
          iconBg="var(--primary-hover)"
          iconColor="var(--primary)"
          title="Total Revenue"
          value={stateCounts?.Revenue?.total || 0}
          subvalue={`${
            stateCounts?.Revenue?.thisMonth > 0
              ? `+${stateCounts.Revenue.thisMonth}`
              : 0
          } this month`}
          icon={DollarSign}
          loading={loading}
        />
        <DashBoardStatesCard
          iconBg="#e6f5fc"
          iconColor="#0da2e7"
          title="Appointment Requests"
          value={stateCounts?.AppointmentRequests?.total || 0}
          subvalue={`${
            stateCounts?.AppointmentRequests?.today > 0
              ? `+${stateCounts.AppointmentRequests.today}`
              : 0
          } new today`}
          icon={Calendar}
          loading={loading}
        />
        <DashBoardStatesCard
          iconBg="var(--primary-hover)"
          iconColor="var(--primary)"
          title="Treatments Completed"
          value={stateCounts?.TreatmentsCompleted?.total || 0}
          subvalue={`${
            stateCounts?.TreatmentsCompleted?.thisMonth > 0
              ? `+${stateCounts.TreatmentsCompleted.thisMonth}`
              : 0
          } this month`}
          icon={CheckCircle}
          loading={loading}
        />
        <DashBoardStatesCard
          iconBg="#fcf7e6"
          iconColor="#e7b008"
          title="Pending Requests"
          value={stateCounts?.PendingRequests?.total || 0}
          icon={Clock}
          loading={loading}
        />
      </div>
      <div className="dashboard-charts-wrapper">
        <ChartSectionCard
          title="Monthly Revenue"
          margin="0px 0px 20px 0px"
          chartType={SingleAreaChart}
          ChartData={monthlyRevenue}
          loading={loading}
        />
        <ChartSectionCard
          title="Weekly Appointments"
          margin="0px 0px 20px 0px"
          chartType={DoubleBarChart}
          ChartData={weeklyAppointments}
          loading={loading}
        />
      </div>
      <SectionCard title="Latest Appointments">
        {loading ? (
          <Loader  style={{minHeight:"450px"}}/>
        ) : latestBookings?.length > 0 ? (
          <div className="doctor-dashboard-latest-appointments-container">
            {latestBookings?.map((booking, index) => {
              return (
                <div
                  className="doctor-dashboard-latest-appointments-card"
                  key={index}
                >
                  <div className="doctor-dashboard-latest-appointments-card-left">
                    <ProfileImage
                      Image={booking?.patient?.profilImg || IMAGES.PlaceHolder}
                      className="doctor-dashboard-latest-appointments-profile-image"
                    />

                    <div className="doctor-dashboard-latest-appointments-info">
                      <div className="doctor-dashboard-latest-appointments-header">
                        <h2 className="doctor-dashboard-latest-appointments-patient-name">
                          {booking?.patient?.name || "N/A"}
                        </h2>

                        <span
                          className={`doctor-dashboard-latest-appointments-status ${booking?.status || "N/A"}`}
                        >
                          {booking?.status || "N/A"}
                        </span>
                      </div>

                      <p className="doctor-dashboard-latest-appointments-type-fee">
                        {booking?.appointmentType || "N/A"} • Rs{" "}
                        {booking?.fee || 0}
                      </p>

                      <p className="doctor-dashboard-latest-appointments-date-time">
                        {booking?.appointmentPeriod?.date || "N/A"} •{" "}
                        {booking?.appointmentPeriod?.startTime || "N/A"}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      navigate(`/appointment-details/${booking?._id}`)
                    }
                    className="custom-table-action-btn active"
                  >
                    View Details
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="no-data-cell">No appointments found.</p>
        )}
      </SectionCard>
    </div>
  );
};

export default Dashboard;

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
