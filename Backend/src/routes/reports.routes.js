// src/routes/reports.routes.js
import express from "express";
import {
  getReports,
  addReport,
  updateReport,
  resolveReport,
  deleteReport,
  getReportById,
  getReportsSingleUser,
} from "../controllers/reports.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/getReports", verifyToken, getReports);
router.post("/addReport", verifyToken, addReport);
router.patch("/updateReport/:id", verifyToken, updateReport);
router.patch("/resolve-report/:id", verifyToken, resolveReport);
router.delete("/deleteReport/:id", verifyToken, deleteReport);
router.get("/getReportById/:id", verifyToken, getReportById);
router.get("/getReportsSingleUser", verifyToken, getReportsSingleUser);

export default router;
