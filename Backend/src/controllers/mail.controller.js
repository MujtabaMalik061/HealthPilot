// mail.controller.js
import Mail from "../models/mail.model.js";

export const addMail = async (req, res) => {
  try {
    const { sendAt, rawData, receivedBy } = req.body;
    if (!sendAt || !rawData || !receivedBy) {
      return res.status(400).json({
        success: false,
        message: "sendAt, rawData and receivedBy are required",
      });
    }
    if (!Array.isArray(receivedBy) || receivedBy.length === 0) {
      return res.status(400).json({
        success: false,
        message: "receivedBy must be a non-empty array of emails",
      });
    }

    const newMail = await Mail.create({
      sendAt: new Date(sendAt),
      rawData,
      receivedBy,
    });

    return res.status(201).json({
      success: true,
      message: "Mail scheduled successfully",
      data: newMail,
    });
  } catch (error) {
    console.error("Add Mail Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to schedule mail",
    });
  }
};