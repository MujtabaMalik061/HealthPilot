import mongoose from "mongoose";

const { Schema, model } = mongoose;

const reportSchema = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    receiver: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    reportType: {
      type: String,
    },
    title: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    reported: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["pending", "resolved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true },
);

const Report = model("Report", reportSchema);

export default Report;
