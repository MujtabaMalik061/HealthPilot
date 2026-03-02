// src/routes/auth.routes.js
import express from "express";
import {
  getAllReviews,
  getSingleUserReviews,
  getAppointmentReviews,
  getReviewById,
  addReview,
  updateReview,
  deleteReview,
} from "../controllers/reviews.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/getAllReviews", verifyToken, getAllReviews);
router.get("/getSingleUserReviews", verifyToken, getSingleUserReviews);
router.get("/getAppointmentReviews", verifyToken, getAppointmentReviews);
router.get("/getReviewById/:Id", verifyToken, getReviewById);
router.post("/addReview", verifyToken, addReview);
router.patch("/updateReview/:Id", verifyToken, updateReview);
router.delete("/deleteReview/:Id", verifyToken, deleteReview);

export default router;