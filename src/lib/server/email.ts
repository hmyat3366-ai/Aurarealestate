/**
 * AURA Real Estate — Transactional Email Service via Resend
 * Dispatches branded passwordless authentication OTP emails.
 */

export interface SendEmailResult {
  success: boolean;
  id?: string;
  error?: string;
  trialRestricted?: boolean;
}

/**
 * Send 6-digit OTP verification email via Resend REST API
 */
export async function sendOtpEmail(
  toEmail: string,
  code: string
): Promise<SendEmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail =
    process.env.RESEND_FROM_EMAIL || 'AURA Real Estate <onboarding@resend.dev>';

  if (!apiKey) {
    console.warn('[AURA Email Service] RESEND_API_KEY is not configured. Email dispatch skipped.');
    return {
      success: false,
      error: 'RESEND_API_KEY is not configured.',
    };
  }

  const subject = `Your AURA Verification Code: ${code}`;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FBFBF9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #121312;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #FBFBF9; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 560px; background-color: #FFFFFF; border: 1px solid #E6E4DE; border-radius: 2px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
          <!-- Header Branding -->
          <tr>
            <td style="background-color: #121312; padding: 32px 40px; text-align: center;">
              <span style="font-family: 'Playfair Display', Georgia, serif; font-size: 26px; letter-spacing: 0.22em; color: #FBFBF9; text-transform: uppercase; font-weight: normal; display: inline-block;">
                AURA
              </span>
              <div style="font-family: -apple-system, sans-serif; font-size: 9px; letter-spacing: 0.3em; color: #C5A880; text-transform: uppercase; margin-top: 6px;">
                REAL ESTATE • PRIVATE CLIENT
              </div>
            </td>
          </tr>

          <!-- Email Content Body -->
          <tr>
            <td style="padding: 40px 40px 32px 40px;">
              <div style="font-family: -apple-system, sans-serif; font-size: 11px; text-transform: uppercase; letter-spacing: 0.16em; color: #78542E; font-weight: 600; margin-bottom: 12px;">
                Passwordless Authentication
              </div>
              <h1 style="font-family: 'Playfair Display', Georgia, serif; font-size: 24px; font-weight: normal; color: #121312; margin: 0 0 16px 0; line-height: 1.3;">
                Your Verification Code
              </h1>
              <p style="font-size: 14px; line-height: 1.6; color: #4A4C48; margin: 0 0 28px 0;">
                Please enter the following 6-digit one-time code to authenticate your private viewing portfolio and account sessions.
              </p>

              <!-- OTP Code Display Box -->
              <div style="background-color: #F4EDE2; border: 1px solid #D5C2A5; border-radius: 2px; padding: 24px; text-align: center; margin-bottom: 28px;">
                <div style="font-family: 'SF Mono', Consolas, Menlo, monospace; font-size: 34px; font-weight: 700; letter-spacing: 0.28em; color: #121312; text-indent: 0.28em;">
                  ${code}
                </div>
                <div style="font-size: 11px; font-family: 'SF Mono', Consolas, monospace; color: #78542E; margin-top: 8px; text-transform: uppercase; letter-spacing: 0.08em;">
                  Valid for 5 minutes
                </div>
              </div>

              <p style="font-size: 12px; line-height: 1.6; color: #63655E; margin: 0 0 12px 0;">
                If you did not request this verification code, please disregard this email. Your account remains completely secure. Never share this code with anyone.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #FBFBF9; border-top: 1px solid #E6E4DE; padding: 24px 40px; text-align: center;">
              <div style="font-size: 11px; font-family: 'SF Mono', Consolas, monospace; color: #8E8A80; margin-bottom: 6px;">
                London • New York • Zürich
              </div>
              <div style="font-size: 10px; color: #A8A49A; line-height: 1.5;">
                © ${new Date().getFullYear()} AURA Real Estate Agency. All rights reserved.<br>
                Discreet international prime & super-prime property representation.
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  const text = `
AURA REAL ESTATE — PRIVATE CLIENT PORTAL

Your 6-digit verification code is: ${code}

This code will expire in 5 minutes.

If you did not request this code, please disregard this message. Never share this code with anyone.

London • New York • Zürich
© ${new Date().getFullYear()} AURA Real Estate Agency
  `.trim();

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [toEmail],
        subject,
        html,
        text,
      }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const isTrialRestriction =
        res.status === 403 &&
        typeof data.message === 'string' &&
        data.message.includes('only send testing emails to your own email address');

      console.warn(
        `[AURA Resend Error] Status: ${res.status} | Details:`,
        data.message || data
      );

      return {
        success: false,
        error: data.message || 'Resend email dispatch error',
        trialRestricted: isTrialRestriction,
      };
    }

    console.log(`[AURA Resend Success] Email delivered to ${toEmail} | ID: ${data.id}`);
    return {
      success: true,
      id: data.id,
    };
  } catch (error) {
    console.error('[AURA Resend Exception]', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown email dispatch error',
    };
  }
}
