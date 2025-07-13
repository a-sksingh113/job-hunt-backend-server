import { transporter } from "../../config/nodemailerConfig.js";


const wrapEmailTemplate = (title: string, content: string): string => {
  return `
  <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #eee; border-radius: 10px; background: #fff;">
    <div style="text-align: center;">
      <h1 style="color: #d93025; margin-bottom: 10px;">Job Hunt</h1>
      <p style="color: #888;">Your trusted job discovery platform</p>
    </div>
    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
    <h2 style="color: #333;">${title}</h2>
    <div style="font-size: 15px; color: #444; line-height: 1.6;">
      ${content}
    </div>
    <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
    <p style="font-size: 13px; color: #999; text-align: center;">
      This is an automated email from <strong>Job Hunt</strong>. Please do not reply.
    </p>
  </div>
  `;
};

export const sendForgetPasswordOtp = async (
  toEmail: string,
  name: string,
  otp: string,
): Promise<boolean> => {
  try {
    const html = wrapEmailTemplate(
      'Reset Your Password',
      `
        <p>Hello <strong>${name}</strong>,</p>
        <p>We received a request to reset your password. Use the OTP below to continue:</p>
        <p style="font-size: 22px; font-weight: bold; color: #d93025;">${otp}</p>
        <p>This OTP is valid for <strong>10 minutes</strong>.</p>
        <p>If you didn’t request this, please ignore this email.</p>
      `
    );

    const mailOptions = {
      from: `"Job Hunt" <${process.env.ADMIN_EMAIL}>`,
      to: toEmail,
      subject: "Reset Your Password - OTP",
      html,
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
  fullName: string,
  otp: string,
): Promise<boolean> => {
  try {
    const html = wrapEmailTemplate(
      'Verify Your Email',
      `
        <p>Hello <strong>${fullName}</strong>,</p>
        <p>Thank you for signing up for <strong>Job Hunt</strong>.</p>
        <p>Your email verification OTP is:</p>
        <p style="font-size: 22px; font-weight: bold; color: #d93025;">${otp}</p>
        <p>This OTP is valid for <strong>10 minutes</strong>. Please do not share it with anyone.</p>
      `
    );

    const mailOptions = {
      from: `"Job Hunt" <${process.env.ADMIN_EMAIL}>`,
      to: email,
      subject: 'Verify Your Email - Job Hunt',
      html,
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
  fullName: string,
  verificationUrl: string,
): Promise<boolean> => {
  try {
    const html = wrapEmailTemplate(
      'Activate Your Account',
      `
        <p>Hello <strong>${fullName}</strong>,</p>
        <p>Thanks for joining <strong>Job Hunt</strong>! Please verify your email by clicking the button below:</p>
        <div style="text-align: center; margin: 20px 0;">
          <a href="${verificationUrl}" 
             style="
                padding: 12px 25px;
                background-color: #d93025;
                color: white;
                text-decoration: none;
                border-radius: 5px;
                font-weight: bold;
             ">
             Verify Email
          </a>
        </div>
        <p>This link is valid for <strong>1 hour</strong>.</p>
      `
    );

    const mailOptions = {
      from: `"Job Hunt" <${process.env.ADMIN_EMAIL}>`,
      to: email,
      subject: 'Verify Your Email - Job Hunt',
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Verification email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending verification email:', error);
    return false;
  }
};

export const sendSignupNotificationToAdmin = async (
  fullName: string,
  email: string
): Promise<boolean> => {
  try {
    

    const html = wrapEmailTemplate(
      'New User Signup – Action Required',
      `
        <p>Hello Admin,</p>
        <p>A new user has just signed up on <strong>Job Hunt</strong>.</p>
        <ul>
          <li><strong>Name:</strong> ${fullName}</li>
          <li><strong>Email:</strong> ${email}</li>
        </ul>
        <p>Please review and approve the account from the admin dashboard</p>
       
       
      `
    );

    const mailOptions = {
      from: `"Job Hunt" <${process.env.ADMIN_EMAIL}>`,
      to: process.env.ADMIN_EMAIL,
      subject: 'New Signup – Approval Needed',
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Admin notification email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending admin signup notification:', error);
    return false;
  }
};


