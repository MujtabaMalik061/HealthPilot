import React, { useEffect, useState } from "react";
import { Activity, Stethoscope, Users, Calendar } from "lucide-react";
import "../assets/style/Dashboard.css";
import { Header, DashBoardStatesCard } from "../components/CustomComponents";
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

  console.log("stateCounts----->", stateCounts);
  console.log("userGrowth----->", userGrowth);
  console.log("weeklyAppointments----->", weeklyAppointments);
  console.log("latestBookings----->", latestBookings);
  console.log("topDoctors----->", topDoctors);

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
    </div>
  );
};

export default Dashboard;
