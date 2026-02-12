import Appointment from "../models/appointment.model.js";
import User from "../models/user.model.js";

export const getAllAppointments = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const search = req.query.search || "";
    const status = req.query.status || "";
    const skip = (page - 1) * limit;

    let query = {};
    if (status && status !== "all") {
      query.status = status;
    }

    if (search) {
      const users = await User.find({
        name: { $regex: search, $options: "i" },
      }).select("_id");

      const userIds = users.map((u) => u._id);

      query.$or = [{ doctor: { $in: userIds } }, { patient: { $in: userIds } }];
    }

    const appointments = await Appointment.find(query)
      .populate("doctor", "name email")
      .populate("patient", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Appointment.countDocuments(query);

    res.status(200).json({
      success: true,
      data: appointments,
      meta: {
        total,
        page,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get all appointments error:", error);
    res.status(500).json({ message: "Failed to fetch appointments" });
  }
};

export const getSingleUserAppointments = async (req, res) => {
  try {
    const { userId } = req.params;

    const appointments = await Appointment.find({
      $or: [{ doctor: userId }, { patient: userId }],
    })
      .populate("doctor", "name email")
      .populate("patient", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: appointments,
    });
  } catch (error) {
    console.error("Get single user appointments error:", error);
    res.status(500).json({ message: "Failed to fetch user appointments" });
  }
};

export const getAppointmentById = async (req, res) => {
  try {
    const { Id } = req.params;

    const appointment = await Appointment.findById(Id)
      .populate("doctor", "name email")
      .populate("patient", "name email");

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    console.error("Get appointment by ID error:", error);
    res.status(500).json({ message: "Failed to fetch appointment" });
  }
};

export const addAppointment = async (req, res) => {
  try {
    const {
      doctor,
      patient,
      fee,
      appointmentPeriod,
      appointmentType,
      description,
    } = req.body;

    if (!doctor || !patient || !fee || !appointmentPeriod) {
      return res.status(400).json({
        message: "Doctor, patient, fee and appointment period are required",
      });
    }

    const newAppointment = await Appointment.create({
      doctor,
      patient,
      fee,
      appointmentPeriod,
      appointmentType,
      description,
    });

    res.status(201).json({
      success: true,
      message: "Appointment created successfully",
      data: newAppointment,
    });
  } catch (error) {
    console.error("Add appointment error:", error);
    res.status(500).json({ message: "Failed to create appointment" });
  }
};

export const updateAppointment = async (req, res) => {
  try {
    const { Id } = req.params;

    const appointment = await Appointment.findById(Id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    const { status, rejectReason, cancelledBy } = req.body;

    if (status) appointment.status = status;
    if (rejectReason !== undefined) appointment.rejectReason = rejectReason;
    if (cancelledBy !== undefined) appointment.cancelledBy = cancelledBy;

    await appointment.save();

    res.status(200).json({
      success: true,
      message: "Appointment updated successfully",
      data: appointment,
    });
  } catch (error) {
    console.error("Update appointment error:", error);
    res.status(500).json({ message: "Failed to update appointment" });
  }
};

export const deleteAppointment = async (req, res) => {
  try {
    const { Id } = req.params;

    const deleted = await Appointment.findByIdAndDelete(Id);

    if (!deleted) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json({
      success: true,
      message: "Appointment deleted successfully",
    });
  } catch (error) {
    console.error("Delete appointment error:", error);
    res.status(500).json({ message: "Failed to delete appointment" });
  }
};
