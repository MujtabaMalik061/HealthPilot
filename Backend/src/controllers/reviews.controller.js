import Appointment from "../models/appointment.model.js";
import User from "../models/user.model.js";
import Review from "../models/reviews.model.js";
import mongoose from "mongoose";

export const getAllReviews = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const search = req.query.search || "";
    const skip = (page - 1) * limit;

    let query = {};

    if (search) {
      const users = await User.find({
        name: { $regex: search, $options: "i" },
      }).select("_id");

      const userIds = users.map((u) => u._id);

      query.$or = [{ reciver: { $in: userIds } }, { sender: { $in: userIds } }];
    }

    const reviews = await Review.find(query)
      .populate("reciver", "profilImg name email")
      .populate("sender", "profilImg name email")
      .populate("appointment")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Review.countDocuments(query);

    res.status(200).json({
      success: true,
      data: reviews,
      meta: {
        total,
        page,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get all reviews error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch reviews",
    });
  }
};

export const getSingleUserReviews = async (req, res) => {
  try {
    const { userId, from } = req.query;

    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "userId required" });
    }

    const objectUserId = new mongoose.Types.ObjectId(userId);

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    let query = {};

    if (from === "sender") {
      query.sender = objectUserId;
    } else if (from === "reciver") {
      query.reciver = objectUserId;
    } else {
      query.$or = [{ sender: objectUserId }, { reciver: objectUserId }];
    }

    const reviews = await Review.find(query)
      .populate("sender", "profilImg name email")
      .populate("reciver", "profilImg name email")
      .populate("appointment")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Review.countDocuments(query);

    const ratingStats = await Review.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalReviews: { $sum: 1 },
          totalRating: { $avg: "$rating" },
        },
      },
    ]);
    const global = {
      totalReviews: ratingStats[0]?.totalReviews || 0,
      totalRating: ratingStats[0]?.totalRating
        ? Number(ratingStats[0].totalRating.toFixed(1))
        : 0,
    };

    res.status(200).json({
      success: true,
      data: reviews,
      meta: {
        total,
        page,
        totalPages: Math.ceil(total / limit),
      },
      global,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user reviews",
    });
  }
};

export const getSingleUserReviewCount = async (req, res) => {
  try {
    const { userId, from } = req.query;

    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "userId required" });
    }

    const objectUserId = new mongoose.Types.ObjectId(userId);

    let query = {};
    if (from === "sender") {
      query.sender = objectUserId;
    } else if (from === "reciver") {
      query.reciver = objectUserId;
    } else {
      query.$or = [{ sender: objectUserId }, { reciver: objectUserId }];
    }

    const ratingStats = await Review.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalReviews: { $sum: 1 },
          totalRating: { $avg: "$rating" },
        },
      },
    ]);

    const global = {
      totalReviews: ratingStats[0]?.totalReviews || 0,
      totalRating: ratingStats[0]?.totalRating
        ? Number(ratingStats[0].totalRating.toFixed(1))
        : 0,
    };

    res.status(200).json({
      success: true,
      global,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user review stats",
    });
  }
};

export const getAppointmentReviews = async (req, res) => {
  try {
    const { appointmentId } = req.query;

    if (!appointmentId) {
      return res.status(400).json({
        success: false,
        message: "appointmentId required",
      });
    }

    const objectAppointmentId = new mongoose.Types.ObjectId(appointmentId);

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const query = { appointment: objectAppointmentId };
    const reviews = await Review.find(query)
      .populate("sender", "profilImg name email")
      .populate("reciver", "profilImg name email")
      .populate("appointment")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const total = await Review.countDocuments(query);
    const ratingStats = await Review.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalReviews: { $sum: 1 },
          averageRating: { $avg: "$rating" },
        },
      },
    ]);

    const global = {
      totalReviews: ratingStats[0]?.totalReviews || 0,
      totalRating: ratingStats[0]?.averageRating
        ? Number(ratingStats[0].averageRating.toFixed(1))
        : 0,
    };

    res.status(200).json({
      success: true,
      data: reviews,
      meta: {
        total,
        page,
        totalPages: Math.ceil(total / limit),
      },
      global,
    });
  } catch (error) {
    console.error("Get appointment reviews error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch appointment reviews",
    });
  }
};

export const getReviewById = async (req, res) => {
  try {
    const { Id } = req.params;
    const review = await Review.findById(Id)
      .populate("reciver", "profilImg name email")
      .populate("sender", "profilImg name email")
      .populate("appointment");

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    res.status(200).json({
      success: true,
      data: review,
      global: {
        totalReviews: 1,
        totalRating: review?.rating || 0,
      },
    });
  } catch (error) {
    console.error("Get review by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch review",
    });
  }
};

export const addReview = async (req, res) => {
  try {
    const { reciver, sender, appointment, review, rating } = req.body;
    if (!reciver || !sender || !appointment || rating === undefined) {
      return res.status(400).json({
        success: false,
        message: "Receiver, sender, appointment and rating are required",
      });
    }

    if (rating < 0 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 0 and 5",
      });
    }

    const existingAppointment = await Appointment.findById(appointment);
    if (!existingAppointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    if (existingAppointment.status !== "completed") {
      return res.status(400).json({
        success: false,
        message: "You can only review a completed appointment",
      });
    }

    if (existingAppointment.review) {
      return res.status(400).json({
        success: false,
        message: "This appointment already has a review",
      });
    }

    const newReview = await Review.create({
      reciver,
      sender,
      appointment,
      review,
      rating,
    });

    existingAppointment.review = newReview._id;
    await existingAppointment.save();

    res.status(201).json({
      success: true,
      message: "Review added successfully",
      data: newReview,
    });
  } catch (error) {
    console.error("Add review error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add review",
    });
  }
};

export const updateReview = async (req, res) => {
  try {
    const { Id } = req.params;
    const { review, rating } = req.body;

    const existingReview = await Review.findById(Id);

    if (!existingReview) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    if (review !== undefined) existingReview.review = review;
    if (rating !== undefined) existingReview.rating = rating;

    await existingReview.save();

    res.status(200).json({
      success: true,
      message: "Review updated successfully",
      data: existingReview,
    });
  } catch (error) {
    console.error("Update review error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update review",
    });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const { Id } = req.params;

    const review = await Review.findById(Id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    if (review.appointment) {
      await Appointment.findByIdAndUpdate(review.appointment, {
        $unset: { review: "" },
      });
    }

    await Review.findByIdAndDelete(Id);

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.error("Delete review error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete review",
    });
  }
};
