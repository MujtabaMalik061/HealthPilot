import Appointment from "../models/appointment.model.js";
import User from "../models/user.model.js";
import Service from "../models/service.model.js";
import mongoose from "mongoose";

// admin Dashboard

export const getAdminCountesStates = async (req, res) => {
  try {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const totalDoctors = await User.countDocuments({ role: "doctor" });
    const totalPatients = await User.countDocuments({ role: "patient" });
    const totalAppointments = await Appointment.countDocuments();
    const totalServices = await Service.countDocuments();

    const thisMonthDoctors = await User.countDocuments({
      role: "doctor",
      createdAt: { $gte: startOfMonth },
    });

    const thisMonthPatients = await User.countDocuments({
      role: "patient",
      createdAt: { $gte: startOfMonth },
    });

    const thisMonthAppointments = await Appointment.countDocuments({
      createdAt: { $gte: startOfMonth },
    });

    res.status(200).json({
      Doctors: { total: totalDoctors, thisMonth: thisMonthDoctors },
      Patients: { total: totalPatients, thisMonth: thisMonthPatients },
      Appointments: {
        total: totalAppointments,
        thisMonth: thisMonthAppointments,
      },
      Services: { total: totalServices },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserGrowthTrends = async (req, res) => {
  try {
    const monthsData = [];
    const now = new Date();

    for (let i = 11; i >= 0; i--) {
      const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);

      const patients = await User.countDocuments({
        role: "patient",
        createdAt: { $gte: start, $lt: end },
      });

      const doctors = await User.countDocuments({
        role: "doctor",
        createdAt: { $gte: start, $lt: end },
      });

      monthsData.push({
        month: start.toLocaleString("default", { month: "short" }),
        Patients: patients,
        Doctors: doctors,
      });
    }

    res.status(200).json(monthsData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getWeeklyAppointments = async (req, res) => {
  try {
    const data = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const start = new Date();
      start.setDate(today.getDate() - i);
      start.setHours(0, 0, 0, 0);

      const end = new Date(start);
      end.setHours(23, 59, 59, 999);

      const total = await Appointment.countDocuments({
        createdAt: { $gte: start, $lte: end },
      });

      const completed = await Appointment.countDocuments({
        createdAt: { $gte: start, $lte: end },
        status: "completed",
      });

      data.push({
        day: start.toLocaleString("default", { weekday: "short" }),
        appointments: total,
        completed,
      });
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getLatestBookings = async (req, res) => {
  try {
    const { limit } = req.query;
    const latest = await Appointment.find()
      .populate("doctor", "profilImg name email")
      .populate("patient", "profilImg name email")
      .sort({ createdAt: -1 })
      .limit(limit);

    res.status(200).json(latest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTopDoctors = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const topDoctors = await Appointment.aggregate([
      { $match: { status: "completed" } },
      {
        $group: {
          _id: "$doctor",
          completedAppointments: { $sum: 1 },
        },
      },
      { $sort: { completedAppointments: -1 } },
      { $limit: limit },
    ]);

    const doctorIds = topDoctors.map((doc) => doc._id);

    const doctors = await User.find({
      _id: { $in: doctorIds },
    }).select("profilImg name email");

    const result = topDoctors.map((item) => {
      const doctor = doctors.find(
        (doc) => doc._id.toString() === item._id.toString(),
      );
      return {
        doctor,
        completedAppointments: item.completedAppointments,
      };
    });

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// doctor dashboard
export const getDoctorCountesStates = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const doctorId = new mongoose.Types.ObjectId(userId);

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    // 🔹 Total Revenue
    const totalRevenueAgg = await Appointment.aggregate([
      { $match: { doctor: doctorId, status: "completed" } },
      { $group: { _id: null, total: { $sum: "$fee" } } },
    ]);

    // 🔹 This Month Revenue
    const thisMonthRevenueAgg = await Appointment.aggregate([
      {
        $match: {
          doctor: doctorId,
          status: "completed",
          createdAt: { $gte: startOfMonth },
        },
      },
      { $group: { _id: null, total: { $sum: "$fee" } } },
    ]);

    // 🔹 Counts
    const totalRequests = await Appointment.countDocuments({
      doctor: doctorId,
    });

    const todayRequests = await Appointment.countDocuments({
      doctor: doctorId,
      createdAt: { $gte: startOfToday },
    });

    const totalCompleted = await Appointment.countDocuments({
      doctor: doctorId,
      status: "completed",
    });

    const thisMonthCompleted = await Appointment.countDocuments({
      doctor: doctorId,
      status: "completed",
      createdAt: { $gte: startOfMonth },
    });

    const totalPending = await Appointment.countDocuments({
      doctor: doctorId,
      status: "pending",
    });

    res.status(200).json({
      Revenue: {
        total: totalRevenueAgg[0]?.total || 0,
        thisMonth: thisMonthRevenueAgg[0]?.total || 0,
      },
      AppointmentRequests: {
        total: totalRequests,
        today: todayRequests,
      },
      TreatmentsCompleted: {
        total: totalCompleted,
        thisMonth: thisMonthCompleted,
      },
      PendingRequests: {
        total: totalPending,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDoctorMonthlyRevenue = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const doctorId = new mongoose.Types.ObjectId(userId);
    const now = new Date();
    const data = [];

    for (let i = 11; i >= 0; i--) {
      const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);

      const revenueAgg = await Appointment.aggregate([
        {
          $match: {
            doctor: doctorId, // ✅ fixed
            status: "completed",
            createdAt: { $gte: start, $lt: end },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$fee" },
          },
        },
      ]);

      data.push({
        month: start.toLocaleString("default", { month: "short" }),
        revenue: revenueAgg[0]?.total || 0,
      });
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDoctorWeeklyAppointments = async (req, res) => {
  try {
    const { userId } = req.query;
    const today = new Date();
    const data = [];

    for (let i = 6; i >= 0; i--) {
      const start = new Date();
      start.setDate(today.getDate() - i);
      start.setHours(0, 0, 0, 0);

      const end = new Date(start);
      end.setHours(23, 59, 59, 999);

      const total = await Appointment.countDocuments({
        doctor: userId,
        createdAt: { $gte: start, $lte: end },
      });

      const completed = await Appointment.countDocuments({
        doctor: userId,
        status: "completed",
        createdAt: { $gte: start, $lte: end },
      });

      data.push({
        day: start.toLocaleString("default", { weekday: "short" }),
        appointments: total,
        completed,
      });
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDoctorlatestAppointments = async (req, res) => {
  try {
    const { userId, limit } = req.query;

    const latest = await Appointment.find({ doctor: userId })
      .populate("patient", "name email profilImg")
      .sort({ createdAt: -1 })
      .limit(limit);

    res.status(200).json(latest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
