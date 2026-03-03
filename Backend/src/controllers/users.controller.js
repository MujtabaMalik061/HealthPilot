// src/controllers/users.controller.js
import User from "../models/user.model.js";

export const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const search = req.query.search || "";
    const skip = (page - 1) * limit;

    const query = search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("-password");

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      page,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getUsersByType = async (req, res) => {
  try {
    const { status } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const search = req.query.search || "";
    const role = req.query.role;
    const specialist = req.query.specialist;
    const skip = (page - 1) * limit;

    if (!role) {
      return res.status(400).json({
        success: false,
        message: "Role is required",
      });
    }

    const matchQuery = { role };

    if (status && status !== "all") {
      if (status === "viewed") {
        matchQuery.status = { $ne: "pending" };
      } else {
        matchQuery.status = status;
      }
    }

    if (search) {
      matchQuery.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (specialist) {
      matchQuery.specialist = { $in: [new RegExp(specialist, "i")] };
    }

    // 👇 Decide which field to match in appointments
    const appointmentField = role === "doctor" ? "doctor" : "patient";

    const users = await User.aggregate([
      { $match: matchQuery },

      {
        $lookup: {
          from: "appointments", // collection name
          localField: "_id",
          foreignField: appointmentField,
          as: "appointments",
        },
      },

      {
        $addFields: {
          appointmentCount: { $size: "$appointments" },
        },
      },

      {
        $project: {
          password: 0,
          appointments: 0, // remove full appointments array
        },
      },

      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
    ]);

    const total = await User.countDocuments(matchQuery);
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      data: users,
      meta: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { status },
      { new: true, runValidators: true },
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User status updated successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const userCountStates = async (req, res) => {
  try {
    const { role } = req.params;
    if (!role) {
      return res.status(400).json({ message: "Role is required" });
    }

    const filter = { role };

    const totalUsers = await User.countDocuments(filter);
    const pendingUsers = await User.countDocuments({
      ...filter,
      status: "pending",
    });
    const rejectedUsers = await User.countDocuments({
      ...filter,
      status: "rejected",
    });
    const approvedUsers = await User.countDocuments({
      ...filter,
      status: "approved",
    });

    res.status(200).json({
      totalUsers,
      pendingUsers,
      rejectedUsers,
      approvedUsers,
    });
  } catch (err) {
    console.error("Failed to get user counts:", err);
    res.status(500).json({ message: "Failed to get user counts" });
  }
};

export const updatePush = async (req, res) => {
  try {
    const { userId } = req.params;
    const formData = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: formData },
      { new: true, runValidators: true },
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Push settings updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
