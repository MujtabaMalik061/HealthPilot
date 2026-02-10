// src/routes/admin.routes.js
import express from "express";
import {
  getServiceById,
  getAllServices,
  addService,
  updateService,
  deleteService
} from "../controllers/service.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/getServiceById/:id", verifyToken, getServiceById);
router.get("/getAllServices", verifyToken, getAllServices);
router.post("/addService", verifyToken, addService);
router.patch("/updateService/:id", verifyToken, updateService);
router.delete("/deleteService/:id", verifyToken, deleteService);

export default router;
