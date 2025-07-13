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

export const sendApprovalEmail = async (
  email: string,
  fullName: string
): Promise<boolean> => {
  try {
    const html = wrapEmailTemplate(
      'Your Account Has Been Approved!',
      `
        <p>Hello <strong>${fullName}</strong>,</p>
        <p>Great news! Your account on <strong>Job Hunt</strong> has been successfully approved by our admin team.</p>
        <p>You can now log in and start using our services.</p>
        <p>Thank you for being part of Job Hunt!</p>
      `
    );

    const mailOptions = {
      from: `"Job Hunt" <${process.env.ADMIN_EMAIL}>`,
      to: email,
      subject: 'Account Approved – Job Hunt',
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Approval email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending approval email:', error);
    return false;
  }
};



export const sendRejectionEmail = async (
  email: string,
  fullName: string
): Promise<boolean> => {
  try {
    const html = wrapEmailTemplate(
      'Your Account Has Been Rejected',
      `
        <p>Hello <strong>${fullName}</strong>,</p>
        <p>We regret to inform you that your account on <strong>Job Hunt</strong> has been reviewed and rejected by our admin team.</p>
        <p>If you believe this was a mistake or would like to reapply, feel free to contact us at <a href="mailto:${process.env.ADMIN_EMAIL}">${process.env.ADMIN_EMAIL}</a>.</p>
        <p>Thank you for your interest.</p>
      `
    );

    const mailOptions = {
      from: `"Job Hunt" <${process.env.ADMIN_EMAIL}>`,
      to: email,
      subject: 'Account Rejected – Job Hunt',
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Rejection email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending rejection email:', error);
    return false;
  }
};
