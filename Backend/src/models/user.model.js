// src/models/user.model.js
import mongoose from "mongoose";

const { Schema, model } = mongoose;
const availableDaySchema = new Schema({
  day: { type: String }, 
  start: { type: String },
  end: { type: String },
});

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ["doctor", "patient"], required: true },
    password: {
      type: String,
      required: true,
      select: false,
    },
    profilImg: { type: String, default: "" },
    specialist: [{ type: String }],
    location: { type: String },
    description: { type: String },
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    doctorStartDate: { type: String },
    treatments: { type: Number, default: 0 },
    price: { type: Number },
    timeCycle: { type: String },
    availabe: { type: Boolean, default: true },
    certificate: { type: String },
    educationAndTraining: [{ type: String }],
    availableDays: [availableDaySchema],
    booked: [{ type: Schema.Types.Mixed }],
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: function () {
        return this.role === "doctor" ? "pending" : "accepted";
      },
    },
  },
  { timestamps: true },
);

const User = model("User", userSchema);

export default User;
