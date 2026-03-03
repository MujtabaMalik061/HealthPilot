// src/models/mail.model.js
import mongoose from "mongoose";

const { Schema, model } = mongoose;

const mailSchema = new Schema(
  {
    sendAt: {
      type: Date,
      required: true,
    },
    rawData: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "sent", "failed"],
      default: "pending",
    },
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
    },
    receivedBy: {
      type: [String],
      required: true,
      validate: {
        validator: function (emails) {
          return emails.every((email) => /.+@.+\..+/.test(email));
        },
        message: "One or more email addresses are invalid",
      },
    },
  },
  { timestamps: true },
);

const Mail = model("Mail", mailSchema);

export default Mail;
