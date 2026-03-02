// src/controllers/auth.controller.js
import User from "../models/user.model.js";
import Service from "../models/service.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/jwt.js";
import mongoose from "mongoose";

export const signUp = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    const {
      name,
      email,
      password,
      role,
      location,
      doctorStartDate,
      certificate,
      educationAndTraining,
    } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userData = {
      name,
      email,
      password: hashedPassword,
      role,
    };

    if (role === "doctor") {
      userData.location = location;
      userData.doctorStartDate = doctorStartDate;
      userData.certificate = certificate;
      userData.educationAndTraining = educationAndTraining
        ? JSON.parse(educationAndTraining)
        : [];
    }

    const user = await User.create(userData);

    const token = generateToken(user);

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Signup failed" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (user.status === "pending") {
      return res.status(403).json({
        message: "Your account is still pending approval. Please wait.",
      });
    } else if (user.status === "rejected") {
      return res.status(403).json({
        message: "Your account has been banned. Please contact support.",
      });
    }

    const token = generateToken(user);

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Login failed" });
  }
};

export const getUserData = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ message: "Failed to fetch user data" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const updates = {};
    const { name, profilImg } = req.body;

    if (name) {
      updates.name = name;
    }
    if (profilImg) {
      updates.profilImg = profilImg;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Nothing to update",
      });
    }

    const user = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: user,
    });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update profile",
    });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const { userId } = req.params;
    const { currentPassword, newPassword } = req.body;
    if (!userId || !currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const user = await User.findById(userId).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return res.status(400).json({
        success: false,
        message: "New password must be different from current password",
      });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Update password error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update password",
    });
  }
};

export const updateDoctorDetails = async (req, res) => {
  try {
    const { userId } = req.params;
    const {
      specialist,
      location,
      description,
      price,
      timeCycle,
      available,
      educationAndTraining,
      availableDays,
    } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== "doctor") {
      return res
        .status(403)
        .json({ message: "Only doctors can update these details" });
    }

    const oldSpecialties = user.specialist || [];
    user.specialist = specialist ?? user.specialist;
    user.location = location ?? user.location;
    user.description = description ?? user.description;
    user.price = price ?? user.price;
    user.timeCycle = timeCycle ?? user.timeCycle;
    user.available = available ?? user.available;
    user.educationAndTraining =
      educationAndTraining ?? user.educationAndTraining;
    user.availableDays = availableDays ?? user.availableDays;

    await user.save();
    if (specialist && specialist.length > 0) {
      const specialtiesToRemove = oldSpecialties.filter(
        (s) => !specialist.includes(s),
      );
      if (specialtiesToRemove.length > 0) {
        await Service.updateMany(
          { title: { $in: specialtiesToRemove } },
          { $pull: { doctors: user._id } },
        );
      }

      await Service.updateMany(
        { title: { $in: specialist } },
        { $addToSet: { doctors: user._id } },
      );
    }

    res.status(200).json({
      message: "Doctor details updated successfully",
      user: {
        ...user.toObject(),
        password: undefined,
      },
    });
  } catch (error) {
    console.error("Update doctor details error:", error);
    res.status(500).json({ message: "Failed to update doctor details" });
  }
};

export const getAdminId = async (req, res) => {
  try {
    const admin = await User.findOne({ role: "admin" }).select("_id");
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json({
      adminId: admin._id,
    });
  } catch (error) {
    console.error("Get admin id error:", error);
    res.status(500).json({ message: "Failed to get admin id" });
  }
};

export const getUserDetailsById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ message: "Failed to fetch user data" });
  }
};
