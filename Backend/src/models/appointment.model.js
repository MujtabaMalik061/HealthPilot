// src/models/appointment.model.js
import mongoose from "mongoose";

const { Schema, model } = mongoose;

const appointmentSchema = new Schema(
  {
    doctor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    patient: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fee: {
      type: Number,
      required: true,
    },
    appointmentPeriod: {
      date: { type: String, required: true },
      startTime: { type: String, required: true },
      endTime: { type: String, required: true },
    },
    appointmentType: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "completed"],
      default: "pending",
    },
    rejectReason: {
      type: String,
      default: "",
    },
    cancelledBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true },
);

const Appointment = model("Appointment", appointmentSchema);

export default Appointment;
