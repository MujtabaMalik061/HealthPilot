import React, { useEffect, useState } from "react";
import {
  Activity,
  Stethoscope,
  Users,
  Calendar,
  TrendingUp,
} from "lucide-react";
import "../assets/style/Dashboard.css";
import {
  Header,
  DashBoardStatesCard,
} from "../components/CustomComponents";
import {
  getAdminCountesStatesHelper,
  getUserGrowthTrendsHelper,
  getWeeklyAppointmentsHelper,
  getLatestBookingsHelper,
  getTopDoctorsHelper,
} from "../services/DashBoardServices";
import {
  ChartSectionCard,
  DoubleAreaChart,
  DoubleBarChart,
} from "../components/Charts";
import Loader from "../components/Loader";
import CustomTable from "../components/CustomTable";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stateCounts, setStateCounts] = useState([]);
  const [userGrowth, setUserGrowth] = useState([]);
  const [weeklyAppointments, setWeeklyAppointments] = useState([]);
  const [latestBookings, setLatestBookings] = useState([]);
  const [topDoctors, setTopDoctors] = useState([]);

  useEffect(() => {
    getAllData();
  }, []);

  const getAllData = async () => {
    try {
      setLoading(true);

      const [
        stateCountsRes,
        userGrowthRes,
        weeklyAppointmentsRes,
        latestBookingsRes,
        topDoctorsRes,
      ] = await Promise.all([
        getAdminCountesStatesHelper(),
        getUserGrowthTrendsHelper(),
        getWeeklyAppointmentsHelper(),
        getLatestBookingsHelper(5),
        getTopDoctorsHelper(5),
      ]);

      setStateCounts(stateCountsRes);
      setUserGrowth(userGrowthRes);
      setWeeklyAppointments(weeklyAppointmentsRes);
      setLatestBookings(latestBookingsRes);
      setTopDoctors(topDoctorsRes);
    } catch (error) {
      console.error("Failed to load dashboard data:", error.response);
    } finally {
      setLoading(false);
    }
  };

  const bookingsColumns = [
    {
      name: "Patient",
      row: (c) => (
        <strong className="capital">{c?.patient?.name || "N/A"}</strong>
      ),
    },
    {
      name: "Doctor",
      row: (c) => (
        <>
          <strong className="capital">{c?.doctor?.name || "N/A"}</strong>
        </>
      ),
    },
    {
      name: "Date & Time",
      row: (c) => (
        <span>
          {c?.appointmentPeriod?.date || "N/A"} at{" "}
          {c?.appointmentPeriod?.startTime || "N/A"}
        </span>
      ),
    },
    {
      name: "Status",
      width: "150px",
      row: (c) => (
        <span
          className={`custom-status custom-status-${c?.status === "pending" ? "pending" : c?.status === "rejected" ? "suspended" : "active"}`}
        >
          {c?.status || "N/A"}
        </span>
      ),
    },
  ];


  return (
    <div className="page-container">
      <Header title="Admin Dashboard" desc="System overview and analytics" />
      <div className="custom-stats-row">
        <DashBoardStatesCard
          iconBg="var(--primary-hover)"
          iconColor="var(--primary)"
          title="Total Doctors"
          value={stateCounts?.Doctors?.total || 0}
          subvalue={`${stateCounts?.Doctors?.thisMonth > 0 ? `+${stateCounts.Doctors.thisMonth}` : 0} this month`}
          icon={Stethoscope}
          loading={loading}
        />
        <DashBoardStatesCard
          iconBg="#e6f5fc"
          iconColor="#0da2e7"
          title="Total Patients"
          value={stateCounts?.Patients?.total || 0}
          subvalue={`${
            stateCounts?.Patients?.thisMonth > 0
              ? `+${stateCounts.Patients.thisMonth}`
              : 0
          } this month`}
          icon={Users}
          loading={loading}
        />
        <DashBoardStatesCard
          iconBg="var(--primary-hover)"
          iconColor="var(--primary)"
          title="Total Appointments"
          value={stateCounts?.Appointments?.total || 0}
          subvalue={`${stateCounts?.Appointments?.thisMonth > 0 ? `+${stateCounts.Appointments.thisMonth}` : 0} this month`}
          icon={Calendar}
          loading={loading}
        />
        <DashBoardStatesCard
          iconBg="#fcf7e6"
          iconColor="#e7b008"
          title="Total Doctors"
          value={stateCounts?.Services?.total || 0}
          icon={Activity}
          loading={loading}
        />
      </div>
      <div className="dashboard-charts-wrapper">
        <ChartSectionCard
          title="User Growth Trends"
          margin="0px 0px 20px 0px"
          chartType={DoubleAreaChart}
          ChartData={userGrowth}
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
      <div className="dashboard-charts-wrapper">
        <SectionCard style={{ width: "100%" }} title="Latest Appointments">
          <CustomTable
            data={latestBookings}
            columns={bookingsColumns}
            loading={loading}
            loadingHeight="100px"
            minWidth="700px"
            pagination={false}
            style={{ marginTop: "15px" }}
          />
        </SectionCard>
        <SectionCard
          icon={TrendingUp}
          style={{ width: "100%", minHeight: "395px" }}
          title="Top Doctors"
        >
          {loading ? (
            <Loader style={{ minHeight: "330px" }} />
          ) : topDoctors?.length > 0 ? (
            <div className="doctor-dashboard-latest-appointments-container">
              {topDoctors?.map((doctor, index) => {
                return (
                  <div className="dashboard-top-doctor-card" key={index}>
                    {/* Rank */}
                    <div className="dashboard-top-doctor-rank">{index + 1}</div>

                    {/* Info Section */}
                    <div className="dashboard-top-doctor-info">
                      {/* Top Row */}
                      <div className="dashboard-top-doctor-row">
                        <span className="dashboard-top-doctor-name">
                          {doctor?.doctor?.name || "N/A"}
                        </span>

                        <span className="dashboard-top-doctor-count">
                          {doctor?.completedAppointments || 0}
                        </span>
                      </div>

                      {/* Bottom Row */}
                      <div className="dashboard-top-doctor-row">
                        <span className="dashboard-top-doctor-speciality">
                          {doctor?.doctor?.specialist?.[0] || "N/A"}
                        </span>

                        <span className="dashboard-top-doctor-label">
                          appointments
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="no-data-cell">No doctors found.</p>
          )}
        </SectionCard>
      </div>
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
