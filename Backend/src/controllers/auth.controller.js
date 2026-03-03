// src/controllers/auth.controller.js
import User from "../models/user.model.js";
import Service from "../models/service.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/jwt.js";
import { forgetPasswordMail } from "../services/mailHelper.services.js";
import mailer from "../config/mailer.js";

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

export const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(404)
        .json({ message: "User not found with this email" });

    const otpCode = Math.floor(1000 + Math.random() * 9000).toString();

    user.otpCode = otpCode;
    user.otpExpires = Date.now() + 5 * 60 * 1000;
    user.otpVerified = false;
    await user.save();

    await mailer.sendMail({
      from: `"Health Pilot Otp" <no-reply@health-pilot.com>`,
      to: email,
      subject: "Password Reset OTP",
      html: forgetPasswordMail(otpCode),
      //       html: `
      // <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f8;padding:20px 0;">
      //   <tr>
      //     <td align="center">
      //       <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;font-family:Arial,Helvetica,sans-serif;">

      //         <!-- Header -->
      //         <tr>
      //           <td style="padding:24px 32px;font-size:26px;font-weight:bold;color:#000;">
      //             CartSense
      //           </td>
      //         </tr>

      //         <!-- Title -->
      //         <tr>
      //           <td style="padding:0 32px 8px;font-size:22px;font-weight:bold;color:#111;">
      //             Verify Your Email
      //           </td>
      //         </tr>

      //         <!-- Description -->
      //         <tr>
      //           <td style="padding:0 32px 20px;font-size:14px;line-height:22px;color:#555;">
      //             Thank you for signing up! Please use the verification code below to complete your registration.
      //             This code will expire in <strong>5 minutes</strong>.
      //           </td>
      //         </tr>

      //         <!-- OTP Box -->
      //         <tr>
      //           <td align="center" style="padding:0 32px 24px;">
      //             <table width="100%" cellpadding="0" cellspacing="0" style="background:#f2f8fc;border-radius:10px;">
      //               <tr>
      //                 <td align="center" style="padding:20px 0 8px;font-size:12px;letter-spacing:2px;color:#666;">
      //                   YOUR VERIFICATION CODE
      //                 </td>
      //               </tr>
      //               <tr>
      //                 <td align="center" style="padding:0 0 20px;">
      //                   <span style="
      //                     display:inline-block;
      //                     background:#ffffff;
      //                     padding:14px 28px;
      //                     border-radius:8px;
      //                     font-size:32px;
      //                     letter-spacing:6px;
      //                     font-weight:bold;
      //                     color:#1d72b8;
      //                   ">
      //                     ${otpCode}
      //                   </span>
      //                 </td>
      //               </tr>
      //             </table>
      //           </td>
      //         </tr>

      //         <!-- Security Tip -->
      //         <tr>
      //           <td style="padding:0 32px 20px;">
      //             <table width="100%" cellpadding="0" cellspacing="0" style="background:#f7fbff;border-left:4px solid #1d72b8;">
      //               <tr>
      //                 <td style="padding:12px 14px;font-size:13px;line-height:20px;color:#444;">
      //                   <strong>Security Tip:</strong> Never share this code with anyone. CartSense will never ask
      //                   for your verification code via phone or email.
      //                 </td>
      //               </tr>
      //             </table>
      //           </td>
      //         </tr>

      //         <!-- Footer text -->
      //         <tr>
      //           <td style="padding:0 32px 24px;font-size:13px;line-height:20px;color:#777;">
      //             If you didn’t request this code, you can safely ignore this email. Someone may have entered your email address by mistake.
      //           </td>
      //         </tr>

      //         <!-- Divider -->
      //         <tr>
      //           <td style="border-top:1px solid #e5e7eb;"></td>
      //         </tr>

      //         <!-- Bottom footer -->
      //         <tr>
      //           <td align="center" style="padding:18px 32px;font-size:12px;color:#999;">
      //             © ${new Date().getFullYear()} CartSense. All rights reserved.<br/>
      //             This is an automated email, please do not reply.
      //           </td>
      //         </tr>

      //       </table>
      //     </td>
      //   </tr>
      // </table>
      // `,
    });

    res.status(200).json({
      message: "OTP sent successfully to email",
    });
  } catch (error) {
    console.error("❌ Error in forgetPassword:", error);
    res.status(500).json({ message: "Failed to send OTP email" });
  }
};

export const otpCheck = async (req, res) => {
  try {
    const { email, otpCode } = req.body;
    if (!email || !otpCode)
      return res.status(400).json({ message: "Email and OTP are required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.otpCode !== otpCode)
      return res.status(400).json({ message: "Invalid OTP" });

    if (Date.now() > user.otpExpires)
      return res.status(400).json({ message: "OTP expired" });

    user.otpVerified = true;
    await user.save();

    res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    console.error("❌ Error in otpCheck:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const newPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword)
      return res
        .status(400)
        .json({ message: "Email and new password are required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.otpVerified)
      return res.status(400).json({
        message: "OTP verification required before resetting password",
      });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    user.otpCode = null;
    user.otpExpires = null;
    user.otpVerified = false;

    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("❌ Error in newPassword:", error);
    res.status(500).json({ message: "Server error" });
  }
};
