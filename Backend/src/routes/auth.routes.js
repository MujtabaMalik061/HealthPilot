// src/routes/auth.routes.js
import express from "express";
import {
  signUp,
  login,
  getUserData,
  updateUser,
} from "../controllers/auth.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/signup", signUp);
router.post("/login", login);
router.get("/user", verifyToken, getUserData);
router.put("/:userId", updateUser);

export default router;
