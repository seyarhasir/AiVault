import { NextRequest, NextResponse } from 'next/server';
import { clerkClient } from '@clerk/nextjs/server';
import { sendEmail, submissionConfirmationEmail, approvalEmail, rejectionEmail, adminNotificationEmail } from '@/lib/email';

type PreferenceKey = 'submissionUpdates' | 'reviewStatusUpdates' | 'marketingUpdates';

type EmailPreferences = {
  submissionUpdates?: boolean;
  reviewStatusUpdates?: boolean;
  marketingUpdates?: boolean;
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, to, data, recipientUserId, preferenceKey } = body as {
      type: string;
      to?: string;
      data: Record<string, string>;
      recipientUserId?: string;
      preferenceKey?: PreferenceKey;
    };

    let emailContent;

    switch (type) {
      case 'submission':
        emailContent = submissionConfirmationEmail(data.toolName);
        break;
      case 'approval':
        emailContent = approvalEmail(data.toolName, data.toolUrl);
        break;
      case 'rejection':
        emailContent = rejectionEmail(data.toolName, data.reason);
        break;
      case 'admin-notification':
        emailContent = adminNotificationEmail(data.toolName, data.submittedBy, data.adminUrl);
        break;
      default:
        return NextResponse.json({ error: 'Invalid email type' }, { status: 400 });
    }

    let resolvedTo = to;

    if (!resolvedTo && recipientUserId) {
      const client = await clerkClient();
      const user = await client.users.getUser(recipientUserId);
      resolvedTo = user.primaryEmailAddress?.emailAddress || user.emailAddresses[0]?.emailAddress;

      if (preferenceKey) {
        const prefs = (user.unsafeMetadata?.emailPreferences ?? {}) as EmailPreferences;
        const isEnabled = prefs[preferenceKey] ?? true;

        if (!isEnabled) {
          return NextResponse.json({ success: true, skipped: true, reason: 'Email preference disabled' });
        }
      }
    }

    if (!resolvedTo) {
      return NextResponse.json({ success: false, error: 'Recipient email not found' }, { status: 400 });
    }

    const result = await sendEmail({
      to: resolvedTo,
      subject: emailContent.subject,
      html: emailContent.html,
    });

    if (result.success) {
      return NextResponse.json({ success: true, data: result.data });
    } else {
      return NextResponse.json({ success: false, error: result.error }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in send-email API:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
