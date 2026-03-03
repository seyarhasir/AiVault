import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export interface EmailData {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail(data: EmailData) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not set, email not sent');
    return { success: false, error: 'RESEND_API_KEY not configured' };
  }

  try {
    const result = await resend.emails.send({
      from: process.env.FROM_EMAIL || 'Ai Vault <onboarding@resend.dev>',
      to: data.to,
      subject: data.subject,
      html: data.html,
    });

    if (result.error) {
      console.error('Resend API Error:', result.error);
      return { success: false, error: result.error };
    }

    console.log('Email sent successfully:', result.data?.id);
    return { success: true, data: result.data };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, error };
  }
}

// Email Templates
export function submissionConfirmationEmail(toolName: string) {
  return {
    subject: `Tool Submission Received - ${toolName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333; border-bottom: 2px solid #6366f1; padding-bottom: 10px;">
          Thank you for submitting to Ai Vault!
        </h2>
        <p style="color: #666; line-height: 1.6;">
          We've received your submission for <strong>${toolName}</strong>. Our team will review it and get back to you soon.
        </p>
        <p style="color: #666; line-height: 1.6;">
          You can track the status of your submission in your dashboard.
        </p>
        <div style="margin-top: 30px; padding: 15px; background: #f3f4f6; border-radius: 8px;">
          <p style="color: #666; margin: 0; font-size: 14px;">
            <strong>What happens next?</strong><br>
            • Our team reviews your submission (1-3 business days)<br>
            • You'll receive an email when approved or if changes are needed<br>
            • Once approved, your tool will be visible to thousands of users
          </p>
        </div>
        <p style="color: #999; font-size: 12px; margin-top: 30px;">
          This is an automated message from Ai Vault. Please do not reply to this email.
        </p>
      </div>
    `,
  };
}

export function approvalEmail(toolName: string, toolUrl: string) {
  return {
    subject: `🎉 Your Tool is Now Live - ${toolName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #22c55e; border-bottom: 2px solid #22c55e; padding-bottom: 10px;">
          Congratulations! Your tool has been approved!
        </h2>
        <p style="color: #666; line-height: 1.6;">
          Great news! <strong>${toolName}</strong> has been approved and is now live on Ai Vault.
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${toolUrl}" 
             style="background: #6366f1; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
            View Your Tool
          </a>
        </div>
        <p style="color: #666; line-height: 1.6;">
          Share your tool with the community and start collecting upvotes. The more engagement your tool receives, the higher it will rank in our directory.
        </p>
        <div style="margin-top: 30px; padding: 15px; background: #f0fdf4; border-radius: 8px; border-left: 4px solid #22c55e;">
          <p style="color: #166534; margin: 0; font-size: 14px;">
            <strong>Tip:</strong> Share your tool on social media to get more visibility and upvotes!
          </p>
        </div>
        <p style="color: #999; font-size: 12px; margin-top: 30px;">
          This is an automated message from Ai Vault. Please do not reply to this email.
        </p>
      </div>
    `,
  };
}

export function rejectionEmail(toolName: string, reason: string) {
  return {
    subject: `Tool Submission Update - ${toolName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #ef4444; border-bottom: 2px solid #ef4444; padding-bottom: 10px;">
          Tool Submission Update
        </h2>
        <p style="color: #666; line-height: 1.6;">
          Thank you for submitting <strong>${toolName}</strong> to Ai Vault. After review, we were unable to approve your submission at this time.
        </p>
        <div style="margin: 20px 0; padding: 15px; background: #fef2f2; border-radius: 8px; border-left: 4px solid #ef4444;">
          <p style="color: #991b1b; margin: 0; font-size: 14px;">
            <strong>Reason:</strong><br>
            ${reason}
          </p>
        </div>
        <p style="color: #666; line-height: 1.6;">
          You're welcome to resubmit after addressing the feedback above. If you have any questions, feel free to reach out to our support team.
        </p>
        <p style="color: #999; font-size: 12px; margin-top: 30px;">
          This is an automated message from Ai Vault. Please do not reply to this email.
        </p>
      </div>
    `,
  };
}

export function adminNotificationEmail(toolName: string, submittedBy: string, adminUrl: string) {
  return {
    subject: `New Tool Submission - ${toolName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #6366f1; border-bottom: 2px solid #6366f1; padding-bottom: 10px;">
          New Tool Submission
        </h2>
        <p style="color: #666; line-height: 1.6;">
          A new tool has been submitted and is awaiting your review.
        </p>
        <div style="margin: 20px 0; padding: 15px; background: #f3f4f6; border-radius: 8px;">
          <p style="color: #333; margin: 5px 0;"><strong>Tool:</strong> ${toolName}</p>
          <p style="color: #333; margin: 5px 0;"><strong>Submitted by:</strong> ${submittedBy}</p>
        </div>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${adminUrl}" 
             style="background: #6366f1; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Review Submission
          </a>
        </div>
        <p style="color: #999; font-size: 12px; margin-top: 30px;">
          This is an automated message from Ai Vault Admin.
        </p>
      </div>
    `,
  };
}
