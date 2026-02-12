// src/routes/auth.routes.js
import express from "express";
import {
  signUp,
  login,
  getUserData,
  getAdminId,
  getUserDetailsById,
  updateUser,
  updatePassword,
  updateDoctorDetails,
} from "../controllers/auth.controller.js";
import upload from "../middlewares/upload.middleware.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/signup", upload.none(), signUp);
router.post("/login", login);
router.get("/user", verifyToken, getUserData);
router.get("/getUserDetailsById/:userId", verifyToken, getUserDetailsById);
router.get("/getAdminId", verifyToken, getAdminId)
router.patch("/:userId", verifyToken, updateUser);
router.patch("/updatePassword/:userId", verifyToken, updatePassword);
router.patch("/updateDoctorDetails/:userId", verifyToken, updateDoctorDetails);

export default router;
