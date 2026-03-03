import mailer from "../config/mailer.js";

export const sendMail = async (options) => {
  try {
    const mailOptions = {
      from: `"HealthPilot" <${process.env.MAIL_USER}>`,
      to: options.to,
      subject: options.subject || "HealthPilot Notification",
      html: options.html || "",
      text: options.text || "",
    };

    const info = await mailer.sendMail(mailOptions);
    console.log("Email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("Failed to send email:", error);
    throw error;
  }
};
