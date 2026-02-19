import API from "../utils/api";

// Admin Apis

export const getAdminCountesStatesHelper = async () => {
  try {
    const res = await API.get("/api/dashboard/getAdminCountesStates");
    return res.data;
  } catch (err) {
    throw err;
  }
};

export const getUserGrowthTrendsHelper = async () => {
  try {
    const res = await API.get("/api/dashboard/getUserGrowthTrends");
    return res.data;
  } catch (err) {
    throw err;
  }
};

export const getWeeklyAppointmentsHelper = async () => {
  try {
    const res = await API.get("/api/dashboard/getWeeklyAppointments");
    return res.data;
  } catch (err) {
    throw err;
  }
};

export const getLatestBookingsHelper = async (limit = 5) => {
  try {
    const res = await API.get("/api/dashboard/getLatestBookings",{
      params: { limit },
    });
    return res.data;
  } catch (err) {
    throw err;
  }
};

export const getTopDoctorsHelper = async (limit = 5) => {
  try {
    const res = await API.get("/api/dashboard/getTopDoctors", {
      params: { limit },
    });
    return res.data;
  } catch (err) {
    throw err;
  }
};

// Doctor Apis
export const getDoctorCountesStatesHelper = async (userId) => {
  try {
    const res = await API.get("/api/dashboard/getDoctorCountesStates", {
      params: { userId },
    });
    return res.data;
  } catch (err) {
    throw err;
  }
};

export const getDoctorMonthlyRevenueHelper = async (userId) => {
  try {
    const res = await API.get("/api/dashboard/getDoctorMonthlyRevenue", {
      params: { userId },
    });
    return res.data;
  } catch (err) {
    throw err;
  }
};

export const getDoctorWeeklyAppointmentsHelper = async (userId) => {
  try {
    const res = await API.get("/api/dashboard/getDoctorWeeklyAppointments", {
      params: { userId },
    });
    return res.data;
  } catch (err) {
    throw err;
  }
};

export const getDoctorlatestAppointmentsHelper = async ({
  userId,
  limit = 5,
}) => {
  if (!userId) {
    throw new Error("userId is required");
  }

  try {
    const res = await API.get("/api/dashboard/getDoctorlatestAppointments", {
      params: { userId, limit },
    });

    return res.data;
  } catch (err) {
    console.error("Error fetching latest appointments:", err);
    throw err;
  }
};
