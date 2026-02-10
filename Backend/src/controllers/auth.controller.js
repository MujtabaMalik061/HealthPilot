// src/controllers/auth.controller.js
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/jwt.js";

export const signUp = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      // specialist,
      location,
      doctorStartDate,
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
      // userData.specialist = specialist ? JSON.parse(specialist) : [];
      userData.location = location;
      userData.doctorStartDate = doctorStartDate;
      userData.educationAndTraining = educationAndTraining
        ? JSON.parse(educationAndTraining)
        : [];

      if (req.file) {
        userData.certificate = req.file.path;
      }
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
    const updates = { ...req.body };
    // if (updates.specialist) {
    //   updates.specialist = JSON.parse(updates.specialist);
    // }
    if (updates.educationAndTraining) {
      updates.educationAndTraining = JSON.parse(updates.educationAndTraining);
    }
    if (req.file) {
      updates.certificate = req.file.path;
    }

    const user = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    res.status(200).json({
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({ message: "Failed to update user" });
  }
};
