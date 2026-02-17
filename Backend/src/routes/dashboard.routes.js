// src/routes/auth.routes.js
import express from "express";
import {
  getAdminCountesStates,
  getUserGrowthTrends,
  getWeeklyAppointments,
  getLatestBookings,
  getTopDoctors,
  getDoctorCountesStates,
  getDoctorMonthlyRevenue,
  getDoctorWeeklyAppointments,
  getDoctorlatestAppointments,
} from "../controllers/dashboard.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
const router = express.Router();

// admin Dashboard
router.get("/getAdminCountesStates", verifyToken, getAdminCountesStates);
router.get("/getUserGrowthTrends", verifyToken, getUserGrowthTrends);
router.get("/getWeeklyAppointments", verifyToken, getWeeklyAppointments);
router.get("/getLatestBookings", verifyToken, getLatestBookings);
router.get("/getTopDoctors", verifyToken, getTopDoctors);

// doctor dashboard
router.get("/getDoctorCountesStates", verifyToken, getDoctorCountesStates);
router.get("/getDoctorMonthlyRevenue", verifyToken, getDoctorMonthlyRevenue);
router.get("/getDoctorWeeklyAppointments",verifyToken,getDoctorWeeklyAppointments);
router.get("/getDoctorlatestAppointments",verifyToken,getDoctorlatestAppointments);

export default router;
