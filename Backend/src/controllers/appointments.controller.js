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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const status = req.query.status || "all";
    const skip = (page - 1) * limit;

    const query = {
      $or: [{ doctor: userId }, { patient: userId }],
    };

    if (status && status !== "all") {
      query.status = status;
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
    console.error("Get single user appointments error:", error);
    res.status(500).json({ message: "Failed to fetch user appointments" });
  }
};

export const getAppointmentCounts = async (req, res) => {
  try {
    const { id } = req.query;
    let filter = {};

    if (id) {
      filter = {
        $or: [{ doctor: id }, { patient: id }],
      };
    }

    const totalAppointments = await Appointment.countDocuments(filter);

    const pendingAppointments = await Appointment.countDocuments({
      ...filter,
      status: "pending",
    });

    const approvedAppointments = await Appointment.countDocuments({
      ...filter,
      status: "approved",
    });

    const rejectedAppointments = await Appointment.countDocuments({
      ...filter,
      status: "rejected",
    });

    const completedAppointments = await Appointment.countDocuments({
      ...filter,
      status: "completed",
    });

    res.status(200).json({
      success: true,
      data: {
        totalAppointments,
        pendingAppointments,
        approvedAppointments,
        rejectedAppointments,
        completedAppointments,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch appointment counts",
    });
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

export const getDoctorAvaility = async (req, res) => {
  try {
    const { doctorId, date } = req.params;

    const doctor = await User.findById(doctorId);
    if (!doctor || doctor.role !== "doctor") {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const selectedDate = new Date(date);
    if (isNaN(selectedDate)) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    const dayName = selectedDate.toLocaleDateString("en-US", {
      weekday: "long",
    });

    const dayAvailability = doctor.availableDays.find((d) => d.day === dayName);

    if (!dayAvailability) {
      return res.status(200).json({
        available: false,
        message: "Doctor not available on this day",
        slots: [],
      });
    }

    const formatTo12Hour = (dateObj) => {
      let hours = dateObj.getHours();
      const minutes = dateObj.getMinutes();
      const ampm = hours >= 12 ? "PM" : "AM";

      hours = hours % 12;
      hours = hours ? hours : 12;

      return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
        2,
        "0",
      )} ${ampm}`;
    };

    const convertTo24 = (time12) => {
      const [time, modifier] = time12.split(" ");
      let [hours, minutes] = time.split(":");

      if (modifier === "PM" && hours !== "12") {
        hours = parseInt(hours, 10) + 12;
      }

      if (modifier === "AM" && hours === "12") {
        hours = "00";
      }

      return `${hours.toString().padStart(2, "0")}:${minutes}`;
    };

    const generateSlots = (start, end, interval) => {
      const slots = [];

      const [startHour, startMin] = start.split(":").map(Number);
      const [endHour, endMin] = end.split(":").map(Number);

      let current = new Date(selectedDate);
      current.setHours(startHour, startMin, 0, 0);

      const endTime = new Date(selectedDate);
      endTime.setHours(endHour, endMin, 0, 0);

      while (current < endTime) {
        const slotStart = new Date(current);
        current.setMinutes(current.getMinutes() + interval);
        const slotEnd = new Date(current);

        slots.push({
          start24: slotStart.toTimeString().slice(0, 5),
          end24: slotEnd.toTimeString().slice(0, 5),
          start: formatTo12Hour(slotStart),
          end: formatTo12Hour(slotEnd),
          startDateObj: new Date(slotStart),
        });
      }

      return slots;
    };

    const interval =
      doctor.timeCycle === "1hr" || doctor.timeCycle === "60min" ? 60 : 30;

    let allSlots = generateSlots(
      dayAvailability.start,
      dayAvailability.end,
      interval,
    );

    const now = new Date();
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

    const isToday = selectedDate.toDateString() === now.toDateString();

    if (isToday) {
      allSlots = allSlots.filter((slot) => slot.startDateObj > oneHourLater);
    }

    const appointments = await Appointment.find({
      doctor: doctorId,
      "appointmentPeriod.date": date,
      status: "approved",
    });

    const bookedSlots = appointments.map((a) => ({
      start: convertTo24(a.appointmentPeriod.startTime),
      end: convertTo24(a.appointmentPeriod.endTime),
    }));

    const availableSlots = allSlots
      .filter(
        (slot) =>
          !bookedSlots.some(
            (b) => b.start === slot.start24 && b.end === slot.end24,
          ),
      )
      .map((slot) => ({
        start: slot.start,
        end: slot.end,
      }));

    return res.status(200).json({
      available: true,
      message: "Doctor available",
      slots: availableSlots,
    });
  } catch (error) {
    console.error("Availability error:", error);
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
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
    const { id } = req.params;

    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    if (appointment.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending appointments can be deleted",
      });
    }

    await Appointment.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Appointment deleted successfully",
    });
  } catch (error) {
    console.error("Delete appointment error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete appointment",
    });
  }
};

