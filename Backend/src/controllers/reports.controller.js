import User from "../models/user.model.js";
import Report from "../models/reports.model.js";

export const getReports = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const search = req.query.search || "";
    const status = req.query.status; 

    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { reportType: { $regex: search, $options: "i" } },
      ];
    }

    if (status) {
      query.status = status;
    }

    const reports = await Report.find(query)
      .populate("sender", "name profilImg email role")
      .populate("receiver", "name profilImg email role")
      .populate("reported", "name profilImg email role")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Report.countDocuments(query);

    res.status(200).json({
      success: true,
      data: reports,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("Error fetching reports:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const addReport = async (req, res) => {
  try {
    const { sender, receiver, reportType, title, description, reported } =
      req.body;

    const newReport = new Report({
      sender,
      receiver,
      reportType,
      title,
      description,
      reported,
      status: "pending",
    });

    const savedReport = await newReport.save();
    res.status(201).json({ success: true, data: savedReport });
  } catch (err) {
    console.error("Error adding report:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateReport = async (req, res) => {
  try {
    const reportId = req.params.id;
    const updates = req.body;
    if (
      updates.status &&
      !["pending", "resolved", "rejected"].includes(updates.status)
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status value" });
    }

    const updatedReport = await Report.findByIdAndUpdate(reportId, updates, {
      new: true,
    });

    if (!updatedReport) {
      return res
        .status(404)
        .json({ success: false, message: "Report not found" });
    }

    res.status(200).json({ success: true, data: updatedReport });
  } catch (err) {
    console.error("Error updating report:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteReport = async (req, res) => {
  try {
    const reportId = req.params.id;
    const deletedReport = await Report.findByIdAndDelete(reportId);

    if (!deletedReport) {
      return res
        .status(404)
        .json({ success: false, message: "Report not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Report deleted successfully" });
  } catch (err) {
    console.error("Error deleting report:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getReportById = async (req, res) => {
  try {
    const reportId = req.params.id;

    const report = await Report.findById(reportId)
      .populate("sender", "name profilImg email role")
      .populate("receiver", "name profilImg email role")
      .populate("reported", "name profilImg email role");

    if (!report) {
      return res
        .status(404)
        .json({ success: false, message: "Report not found" });
    }

    res.status(200).json({ success: true, data: report });
  } catch (err) {
    console.error("Error fetching report:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getReportsSingleUser = async (req, res) => {
  try {
    const { userId, type } = req.body;
    if (!userId || !type) {
      return res
        .status(400)
        .json({ success: false, message: "userId and type are required" });
    }

    let query;

    if (type === "all") {
      query = {
        $or: [
          { sender: userId },
          { reported: userId },
          { receiver: { $in: [userId] } },
        ],
      };
    } else if (type === "sender" || type === "reported") {
      query = { [type]: userId };
    } else if (type === "receiver") {
      query = { receiver: { $in: [userId] } };
    } else {
      return res.status(400).json({
        success: false,
        message:
          "Invalid type. Must be 'sender', 'receiver', 'reported', or 'all'",
      });
    }

    const reports = await Report.find(query)
      .populate("sender", "name profilImg email role")
      .populate("receiver", "name profilImg email role")
      .populate("reported", "name profilImg email role")
      .sort({ createdAt: -1 });

    res
      .status(200)
      .json({ success: true, count: reports.length, data: reports });
  } catch (err) {
    console.error("Error fetching single user reports:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
