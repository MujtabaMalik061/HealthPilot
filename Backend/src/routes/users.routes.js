// src/routes/users.routes.js
import express from "express";
import {
  getAllUsers,
  getUsersByType,
  updateUserStatus,
  userCountStates,
} from "../controllers/users.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/getAllUsers", verifyToken, getAllUsers);
router.get("/getUsersByType/:status", verifyToken, getUsersByType);
router.get("/userCountStates/:role", verifyToken, userCountStates);
router.patch("/:userId", verifyToken, updateUserStatus);

export default router;
