// src/routes/auth.routes.js
import express from "express";
import {
  getAllAppointments,
  getSingleUserAppointments,
  getAppointmentById,
  getAppointmentCounts,
  getDoctorAvaility,
  addAppointment,
  updateAppointment,
  deleteAppointment,
} from "../controllers/appointments.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/getAllAppointments", verifyToken, getAllAppointments);
router.get("/getSingleUserAppointments/:userId",verifyToken,getSingleUserAppointments);
router.get("/getAppointmentById/:Id", verifyToken, getAppointmentById);
router.get("/getAppointmentCounts", verifyToken, getAppointmentCounts);
router.get("/getDoctorAvaility/:doctorId/:date",verifyToken,getDoctorAvaility);
router.post("/addAppointment", verifyToken, addAppointment);
router.patch("/updateAppointment/:Id", verifyToken, updateAppointment);
router.delete("/deleteAppointment/:Id", verifyToken, deleteAppointment);

export default router;
