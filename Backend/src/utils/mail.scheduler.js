import cron from "node-cron";
import Mail from "../models/mail.model.js";
import Appointment from "../models/appointment.model.js";
import User from "../models/user.model.js";
import { sendMail } from "./mail.utils.js";

export const startMailScheduler = () => {
  cron.schedule("*/1 * * * *", async () => {
    console.log("Checking scheduled mails...");

    try {
      const now = new Date();
      const pendingMails = await Mail.find({
        sendAt: { $lte: now },
        status: "pending",
      });
      for (const mail of pendingMails) {
        try {
          const appointment = await Appointment.findById(mail.appointmentId);
          if (!appointment) continue;
          const doctor = await User.findById(appointment.doctor._id).select(
            "name email appointmentReminder",
          );
          const patient = await User.findById(appointment.patient._id).select(
            "name email appointmentReminder",
          );
          if (!appointment) continue;

          const recipients = [];

          if (
            doctor?.appointmentReminder &&
            mail.receivedBy.includes(doctor.email)
          ) {
            recipients.push(doctor.email);
          }

          if (
            patient?.appointmentReminder &&
            mail.receivedBy.includes(patient.email)
          ) {
            recipients.push(patient.email);
          }

          if (recipients.length > 0) {
            for (const email of recipients) {
              try {
                await sendMail({
                  to: email,
                  subject: "Appointment Reminder",
                  html: mail.rawData,
                });
                console.log(`Reminder sent to: ${email}`);
              } catch (err) {
                console.error(`Failed to send to ${email}:`, err);
              }
            }
          }

          mail.status = "sent";
          await mail.save();
        } catch (error) {
          console.error("Mail send failed:", error);
          mail.status = "failed";
          await mail.save();
        }
      }
    } catch (error) {
      console.error("Scheduler error:", error);
    }
  });
};
