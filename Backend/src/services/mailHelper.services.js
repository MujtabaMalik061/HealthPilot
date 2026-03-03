export const forgetPasswordMail = (otpCode) => {
  return `
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f8;padding:20px 0;">
  <tr>
    <td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;font-family:Arial,Helvetica,sans-serif;">

        <!-- Header -->
        <tr>
          <td style="padding:24px 32px;font-size:26px;font-weight:bold;color:#000;">
            HealthPilot
          </td>
        </tr>

        <!-- Title -->
        <tr>
          <td style="padding:0 32px 8px;font-size:22px;font-weight:bold;color:#111;">
            Verify Your Email
          </td>
        </tr>

        <!-- Description -->
        <tr>
          <td style="padding:0 32px 20px;font-size:14px;line-height:22px;color:#555;">
            Thank you for signing up! Please use the verification code below to complete your registration.
            This code will expire in <strong>5 minutes</strong>.
          </td>
        </tr>

        <!-- OTP Box -->
        <tr>
          <td align="center" style="padding:0 32px 24px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f2f8fc;border-radius:10px;">
              <tr>
                <td align="center" style="padding:20px 0 8px;font-size:12px;letter-spacing:2px;color:#666;">
                  YOUR VERIFICATION CODE
                </td>
              </tr>
              <tr>
                <td align="center" style="padding:0 0 20px;">
                  <span style="
                    display:inline-block;
                    background:#ffffff;
                    padding:14px 28px;
                    border-radius:8px;
                    font-size:32px;
                    letter-spacing:6px;
                    font-weight:bold;
                    color:#1d72b8;
                  ">
                    ${otpCode}
                  </span>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Security Tip -->
        <tr>
          <td style="padding:0 32px 20px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f7fbff;border-left:4px solid #1d72b8;">
              <tr>
                <td style="padding:12px 14px;font-size:13px;line-height:20px;color:#444;">
                  <strong>Security Tip:</strong> Never share this code with anyone. HealthPilot will never ask
                  for your verification code via phone or email.
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Footer text -->
        <tr>
          <td style="padding:0 32px 24px;font-size:13px;line-height:20px;color:#777;">
            If you didn’t request this code, you can safely ignore this email. Someone may have entered your email address by mistake.
          </td>
        </tr>

        <!-- Divider -->
        <tr>
          <td style="border-top:1px solid #e5e7eb;"></td>
        </tr>

        <!-- Bottom footer -->
        <tr>
          <td align="center" style="padding:18px 32px;font-size:12px;color:#999;">
            © ${new Date().getFullYear()} HealthPilot. All rights reserved.<br/>
            This is an automated email, please do not reply.
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>
`;
};

export const AppointmentBooked = (appointment, isDoctor = false) => {
  const {
    doctor,
    patient,
    fee,
    appointmentPeriod,
    appointmentType,
    description,
  } = appointment;

  return `
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f8;padding:20px 0;">
  <tr>
    <td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;font-family:Arial,Helvetica,sans-serif;">

        <!-- Header -->
        <tr>
          <td style="padding:24px 32px;font-size:26px;font-weight:bold;color:#1d72b8;">
            HealthPilot
          </td>
        </tr>

        <!-- Title -->
        <tr>
          <td style="padding:0 32px 10px;font-size:22px;font-weight:bold;color:#111;">
            Appointment Confirmed
          </td>
        </tr>

        <!-- Greeting -->
        <tr>
          <td style="padding:0 32px 20px;font-size:14px;line-height:22px;color:#555;">
            Hello <strong>${isDoctor ? doctor.name : patient.name}</strong>,<br/><br/>
            Your appointment has been successfully booked. Below are your appointment details:
          </td>
        </tr>

        <!-- Details Box -->
        <tr>
          <td style="padding:0 32px 24px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f7fbff;border-radius:10px;border:1px solid #e3eef7;">
              
              <tr>
                <td style="padding:14px 18px;font-size:14px;color:#333;">
                  <strong>${isDoctor ? "Patient" : "Doctor"}:</strong> ${isDoctor ? patient.name : doctor.name}
                </td>
              </tr>

              <tr>
                <td style="padding:14px 18px;font-size:14px;color:#333;">
                  <strong>Specialization:</strong> ${appointmentType}
                </td>
              </tr>

              <tr>
                <td style="padding:14px 18px;font-size:14px;color:#333;">
                  <strong>Date:</strong> ${appointmentPeriod.date}
                </td>
              </tr>

              <tr>
                <td style="padding:14px 18px;font-size:14px;color:#333;">
                  <strong>Time:</strong> ${appointmentPeriod.startTime} - ${appointmentPeriod.endTime}
                </td>
              </tr>

              <tr>
                <td style="padding:14px 18px;font-size:14px;color:#333;">
                  <strong>Consultation Fee:</strong> PKR ${fee}
                </td>
              </tr>

              ${
                description
                  ? `
              <tr>
                <td style="padding:14px 18px;font-size:14px;color:#333;">
                  <strong>Notes:</strong> ${description}
                </td>
              </tr>`
                  : ""
              }

            </table>
          </td>
        </tr>

        <!-- Reminder Section -->
        <tr>
          <td style="padding:0 32px 20px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#fff8e6;border-left:4px solid #f4b400;">
              <tr>
                <td style="padding:12px 14px;font-size:13px;line-height:20px;color:#444;">
                  <strong>Reminder:</strong> Please arrive 10–15 minutes before your scheduled time. 
                  If you need to reschedule or cancel, kindly do so in advance.
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Footer Text -->
        <tr>
          <td style="padding:0 32px 24px;font-size:13px;line-height:20px;color:#777;">
            We look forward to assisting you with your healthcare needs.
          </td>
        </tr>

        <!-- CTA Button -->
<tr>
  <td align="center" style="padding:10px 32px 30px;">
    <a 
      href="${process.env.FRONTEND_URL}/appointment-details/${appointment._id}" 
      target="_blank"
      style="
        display:inline-block;
        padding:12px 28px;
        background-color:#1d72b8;
        color:#ffffff;
        text-decoration:none;
        font-size:14px;
        font-weight:bold;
        border-radius:6px;
      "
    >
      View Appointment Details
    </a>
  </td>
</tr>

        <!-- Divider -->
        <tr>
          <td style="border-top:1px solid #e5e7eb;"></td>
        </tr>

        <!-- Bottom Footer -->
        <tr>
          <td align="center" style="padding:18px 32px;font-size:12px;color:#999;">
            © ${new Date().getFullYear()} HealthPilot. All rights reserved.<br/>
            This is an automated email, please do not reply.
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>
`;
};

export const AppointmentReminder = (appointment) => {
  const {
    _id,
    doctor,
    patient,
    fee,
    appointmentPeriod,
    appointmentType,
    description,
  } = appointment;

  return `
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f8;padding:20px 0;">
  <tr>
    <td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;font-family:Arial,Helvetica,sans-serif;">

        <!-- Header -->
        <tr>
          <td style="padding:24px 32px;font-size:26px;font-weight:bold;color:#1d72b8;">
            HealthPilot
          </td>
        </tr>

        <!-- Title -->
        <tr>
          <td style="padding:0 32px 10px;font-size:22px;font-weight:bold;color:#111;">
            Appointment Reminder
          </td>
        </tr>

        <!-- Greeting -->
        <tr>
          <td style="padding:0 32px 20px;font-size:14px;line-height:22px;color:#555;">
            This is a friendly reminder about your upcoming appointment. Please review the details below:
          </td>
        </tr>

        <!-- Details Box -->
        <tr>
          <td style="padding:0 32px 24px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f7fbff;border-radius:10px;border:1px solid #e3eef7;">
              
              <tr>
                <td style="padding:14px 18px;font-size:14px;color:#333;">
                  <strong>Doctor:</strong> ${doctor.name}
                </td>
              </tr>
              
              <tr>
                <td style="padding:14px 18px;font-size:14px;color:#333;">
                  <strong>Patient:</strong> ${patient.name}
                </td>
              </tr>

              <tr>
                <td style="padding:14px 18px;font-size:14px;color:#333;">
                  <strong>Specialization:</strong> ${appointmentType}
                </td>
              </tr>

              <tr>
                <td style="padding:14px 18px;font-size:14px;color:#333;">
                  <strong>Date:</strong> ${appointmentPeriod.date}
                </td>
              </tr>

              <tr>
                <td style="padding:14px 18px;font-size:14px;color:#333;">
                  <strong>Time:</strong> ${appointmentPeriod.startTime} - ${appointmentPeriod.endTime}
                </td>
              </tr>

              <tr>
                <td style="padding:14px 18px;font-size:14px;color:#333;">
                  <strong>Consultation Fee:</strong> PKR ${fee}
                </td>
              </tr>

              ${
                description
                  ? `
              <tr>
                <td style="padding:14px 18px;font-size:14px;color:#333;">
                  <strong>Notes:</strong> ${description}
                </td>
              </tr>`
                  : ""
              }

            </table>
          </td>
        </tr>

        <!-- Reminder Alert Box -->
        <tr>
          <td style="padding:0 32px 20px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#fff4f4;border-left:4px solid #e53935;">
              <tr>
                <td style="padding:12px 14px;font-size:13px;line-height:20px;color:#444;">
                  <strong>Reminder:</strong> Please arrive 10–15 minutes before your scheduled time.
                  If you need to reschedule or cancel, kindly do so as soon as possible.
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- CTA Button -->
        <tr>
          <td align="center" style="padding:10px 32px 30px;">
            <a 
              href="${process.env.FRONTEND_URL}/appointment-details/${_id}" 
              target="_blank"
              style="
                display:inline-block;
                padding:12px 28px;
                background-color:#1d72b8;
                color:#ffffff;
                text-decoration:none;
                font-size:14px;
                font-weight:bold;
                border-radius:6px;
              "
            >
              View Appointment Details
            </a>
          </td>
        </tr>

        <!-- Footer Text -->
        <tr>
          <td style="padding:0 32px 24px;font-size:13px;line-height:20px;color:#777;">
            We look forward to assisting you with your healthcare needs.
          </td>
        </tr>

        <!-- Divider -->
        <tr>
          <td style="border-top:1px solid #e5e7eb;"></td>
        </tr>

        <!-- Bottom Footer -->
        <tr>
          <td align="center" style="padding:18px 32px;font-size:12px;color:#999;">
            © ${new Date().getFullYear()} HealthPilot. All rights reserved.<br/>
            This is an automated email, please do not reply.
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>
`;
};
