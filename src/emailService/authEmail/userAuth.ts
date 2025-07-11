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


export const sendVerificationEmailLink = async (
  email: string,
  verificationUrl: string,
  fullName: string
): Promise<boolean> => {
  try {
    const mailOptions = {
      from: `"OpportunityHub" <${process.env.ADMIN_EMAIL}>`,
      to: email,
      subject: 'Verify your email - OpportunityHub',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2>Hello ${fullName},</h2>
          <p>Thank you for registering on <strong>OpportunityHub</strong>.</p>
          <p>Please click the button below to verify your email address:</p>
          <a href="${verificationUrl}" 
             style="
                display: inline-block;
                margin-top: 10px;
                padding: 10px 20px;
                background-color: #4CAF50;
                color: white;
                text-decoration: none;
                border-radius: 5px;
             ">
             Verify Email
          </a>
          <p>If the button above doesn't work, you can copy and paste this URL into your browser:</p>
          <p style="word-wrap: break-word;">${verificationUrl}</p>
          <p>This link is valid for 1 hour.</p>
          <br />
          <p>Best regards,<br />OpportunityHub Team</p>
        </div>
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