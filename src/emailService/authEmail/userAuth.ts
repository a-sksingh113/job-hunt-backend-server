import { transporter } from "../../config/nodemailerConfig";

export const sendForgetPasswordOtp = async (
  toEmail: string,
  otp: string,
  name: string
): Promise<boolean> => {
  try {
    const mailOptions = {
      from: `"OpportunityHub" <${process.env.ADMIN_EMAIL}>`,
      to: toEmail,
      subject: "Your OTP for Email Verification",
      html: `
        <p>Hello, ${name},</p>
        <p>Your OTP for email verification is: <b>${otp}</b></p>
        <p>This OTP is valid for 10 minutes.</p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending OTP email:", error);
    return false;
  }
};

export const sendVerificationEmail = async (
  email: string,
  otp: string,
  fullName: string
): Promise<boolean> => {
  try {
    const mailOptions = {
      from: `"OpportunityHub" <${process.env.ADMIN_EMAIL}>`,
      to: email,
      subject: 'Verify your email - OpportunityHub',
      html: `
        <p>Hello <strong>${fullName}</strong>,</p>
        <p>Thank you for registering on <strong>OpportunityHub</strong>.</p>
        <p>Your email verification OTP is:</p>
        <h2>${otp}</h2>
        <p>This OTP is valid for 10 minutes. Please do not share it with anyone.</p>
        <p>Best regards,<br/>OpportunityHub Team</p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Verification email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending verification email:', error);
    return false;
  }
};
