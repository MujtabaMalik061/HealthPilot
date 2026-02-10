// src/models/service.model.js
import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    icon: {
      type: String,
    },

    title: {
      type: String,
      trim: true,
      unique: true,
    },

    description: {
      type: String,
    },

    doctors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  },
);

const Service = mongoose.model("Service", serviceSchema);

export default Service;
