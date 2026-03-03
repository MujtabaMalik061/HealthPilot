// src/routes/users.routes.js
import express from "express";
import {
  getAllUsers,
  getUsersByType,
  updateUserStatus,
  userCountStates,
  updatePush,
} from "../controllers/users.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/getAllUsers", verifyToken, getAllUsers);
router.get("/getUsersByType/:status", getUsersByType);
router.get("/userCountStates/:role", verifyToken, userCountStates);
router.patch("/:userId", verifyToken, updateUserStatus);
router.patch("/update-push/:userId", verifyToken, updatePush);

export default router;
