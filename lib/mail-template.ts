import { env } from "./env";

type EmailTemplateReturn = {
  subject: string;
  html: string;
};

// Base email template with consistent styling
// Uses a modern, clean design matching the project's aesthetic
const baseTemplate = (content: string, title: string): string => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${title}</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f5; -webkit-font-smoothing: antialiased;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f4f4f5;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 560px; margin: 0 auto;">
          
          <!-- Logo/Header -->
          <tr>
            <td style="padding-bottom: 24px; text-align: center;">
              <span style="font-size: 24px; font-weight: 700; color: #6d28d9;">${
                env.NEXT_PUBLIC_APP_NAME
              }</span>
            </td>
          </tr>
          
          <!-- Main Content Card -->
          <tr>
            <td style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1); overflow: hidden;">
              <!-- Purple gradient header bar -->
              <div style="height: 4px; background: linear-gradient(90deg, #7c3aed 0%, #a78bfa 100%);"></div>
              
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="padding: 40px 32px;">
                    ${content}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding-top: 24px; text-align: center;">
              <p style="margin: 0 0 8px 0; font-size: 13px; color: #71717a;">
                This email was sent by ${env.NEXT_PUBLIC_APP_NAME}
              </p>
              <p style="margin: 0; font-size: 13px; color: #a1a1aa;">
                © ${new Date().getFullYear()} ${
  env.NEXT_PUBLIC_APP_NAME
}. All rights reserved.
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

// Primary action button style
const primaryButton = (url: string, text: string): string => `
<table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 0 auto;">
  <tr>
    <td style="border-radius: 8px; background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);">
      <a href="${url}" target="_blank" style="display: inline-block; padding: 14px 32px; font-size: 15px; font-weight: 600; color: #ffffff; text-decoration: none; border-radius: 8px;">
        ${text}
      </a>
    </td>
  </tr>
</table>
`;

// Secondary link style
const secondaryLink = (url: string): string => `
<p style="margin: 16px 0 0 0; font-size: 13px; color: #71717a; word-break: break-all;">
  Or copy this link: <a href="${url}" style="color: #7c3aed; text-decoration: underline;">${url}</a>
</p>
`;

// Warning/info box style
const infoBox = (
  message: string,
  type: "warning" | "info" = "info"
): string => {
  const bgColor = type === "warning" ? "#fef3c7" : "#f3e8ff";
  const borderColor = type === "warning" ? "#f59e0b" : "#7c3aed";
  const textColor = type === "warning" ? "#92400e" : "#6d28d9";

  return `
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 24px 0;">
      <tr>
        <td style="padding: 16px; background-color: ${bgColor}; border-radius: 8px; border-left: 4px solid ${borderColor};">
          <p style="margin: 0; font-size: 14px; color: ${textColor};">${message}</p>
        </td>
      </tr>
    </table>
  `;
};

export const emailVerificationTemplate = (url: string): EmailTemplateReturn => {
  const content = `
    <!-- Icon -->
    <div style="text-align: center; margin-bottom: 24px;">
      <div style="display: inline-block; width: 64px; height: 64px; background: linear-gradient(135deg, #f3e8ff 0%, #ede9fe 100%); border-radius: 50%; line-height: 64px; font-size: 28px;">
        ✉️
      </div>
    </div>
    
    <!-- Title -->
    <h1 style="margin: 0 0 16px 0; font-size: 24px; font-weight: 700; color: #18181b; text-align: center;">
      Verify your email address
    </h1>
    
    <!-- Description -->
    <p style="margin: 0 0 32px 0; font-size: 15px; line-height: 1.6; color: #52525b; text-align: center;">
      Thanks for signing up! Please click the button below to verify your email address and activate your account.
    </p>
    
    <!-- CTA Button -->
    <div style="text-align: center;">
      ${primaryButton(url, "Verify Email Address")}
      ${secondaryLink(url)}
    </div>
    
    ${infoBox(
      "This link will expire in 24 hours. If you didn't create an account, you can safely ignore this email."
    )}
  `;

  return {
    subject: "Verify your email address",
    html: baseTemplate(content, "Verify your email address"),
  };
};

export const resetPasswordTemplate = (url: string): EmailTemplateReturn => {
  const content = `
    <!-- Icon -->
    <div style="text-align: center; margin-bottom: 24px;">
      <div style="display: inline-block; width: 64px; height: 64px; background: linear-gradient(135deg, #f3e8ff 0%, #ede9fe 100%); border-radius: 50%; line-height: 64px; font-size: 28px;">
        🔐
      </div>
    </div>
    
    <!-- Title -->
    <h1 style="margin: 0 0 16px 0; font-size: 24px; font-weight: 700; color: #18181b; text-align: center;">
      Reset your password
    </h1>
    
    <!-- Description -->
    <p style="margin: 0 0 32px 0; font-size: 15px; line-height: 1.6; color: #52525b; text-align: center;">
      We received a request to reset your password. Click the button below to choose a new password.
    </p>
    
    <!-- CTA Button -->
    <div style="text-align: center;">
      ${primaryButton(url, "Reset Password")}
      ${secondaryLink(url)}
    </div>
    
    ${infoBox(
      "This link will expire in 1 hour. If you didn't request a password reset, please ignore this email or contact support if you have concerns.",
      "warning"
    )}
  `;

  return {
    subject: "Reset your password",
    html: baseTemplate(content, "Reset your password"),
  };
};

export const successResetPasswordTemplate = (): EmailTemplateReturn => {
  const content = `
    <!-- Icon -->
    <div style="text-align: center; margin-bottom: 24px;">
      <div style="display: inline-block; width: 64px; height: 64px; background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%); border-radius: 50%; line-height: 64px; font-size: 28px;">
        ✅
      </div>
    </div>
    
    <!-- Title -->
    <h1 style="margin: 0 0 16px 0; font-size: 24px; font-weight: 700; color: #18181b; text-align: center;">
      Password reset successful
    </h1>
    
    <!-- Description -->
    <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.6; color: #52525b; text-align: center;">
      Your password has been successfully reset. You can now sign in with your new password.
    </p>
    
    <!-- Success Box -->
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
      <tr>
        <td style="padding: 20px; background-color: #f0fdf4; border-radius: 8px; border-left: 4px solid #22c55e; text-align: center;">
          <p style="margin: 0; font-size: 14px; color: #166534;">
            🎉 Your account is now secured with your new password.
          </p>
        </td>
      </tr>
    </table>
    
    ${infoBox(
      "If you didn't make this change, please contact our support team immediately.",
      "warning"
    )}
  `;

  return {
    subject: "Your password has been reset",
    html: baseTemplate(content, "Password reset successful"),
  };
};

export const deleteAccountTemplate = (url: string): EmailTemplateReturn => {
  const content = `
    <!-- Icon -->
    <div style="text-align: center; margin-bottom: 24px;">
      <div style="display: inline-block; width: 64px; height: 64px; background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%); border-radius: 50%; line-height: 64px; font-size: 28px;">
        ⚠️
      </div>
    </div>
    
    <!-- Title -->
    <h1 style="margin: 0 0 16px 0; font-size: 24px; font-weight: 700; color: #18181b; text-align: center;">
      Delete your account
    </h1>
    
    <!-- Description -->
    <p style="margin: 0 0 32px 0; font-size: 15px; line-height: 1.6; color: #52525b; text-align: center;">
      You've requested to delete your account. This action is permanent and cannot be undone.
    </p>
    
    <!-- CTA Button (Danger style) -->
    <div style="text-align: center;">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 0 auto;">
        <tr>
          <td style="border-radius: 8px; background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);">
            <a href="${url}" target="_blank" style="display: inline-block; padding: 14px 32px; font-size: 15px; font-weight: 600; color: #ffffff; text-decoration: none; border-radius: 8px;">
              Confirm Account Deletion
            </a>
          </td>
        </tr>
      </table>
      ${secondaryLink(url)}
    </div>
    
    ${infoBox(
      "This link will expire in 24 hours. If you didn't request this, please secure your account immediately by changing your password.",
      "warning"
    )}
    
    <!-- What will be deleted -->
    <div style="margin-top: 24px;">
      <h3 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #18181b;">
        What will be deleted:
      </h3>
      <ul style="margin: 0; padding: 0 0 0 20px; font-size: 14px; line-height: 1.8; color: #52525b;">
        <li>Your profile and account information</li>
        <li>All your data and settings</li>
        <li>Access to all connected services</li>
      </ul>
    </div>
  `;

  return {
    subject: "Confirm account deletion",
    html: baseTemplate(content, "Delete your account"),
  };
};

// Welcome email template for new users
export const welcomeEmailTemplate = (name: string): EmailTemplateReturn => {
  const content = `
    <!-- Icon -->
    <div style="text-align: center; margin-bottom: 24px;">
      <div style="display: inline-block; width: 64px; height: 64px; background: linear-gradient(135deg, #f3e8ff 0%, #ede9fe 100%); border-radius: 50%; line-height: 64px; font-size: 28px;">
        🎉
      </div>
    </div>
    
    <!-- Title -->
    <h1 style="margin: 0 0 16px 0; font-size: 24px; font-weight: 700; color: #18181b; text-align: center;">
      Welcome to {{APP_NAME}}!
    </h1>
    
    <!-- Description -->
    <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.6; color: #52525b; text-align: center;">
      Hi ${name}, we're thrilled to have you on board! Your account has been successfully created.
    </p>
    
    <!-- Feature highlights -->
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 32px;">
      <tr>
        <td style="padding: 16px; background-color: #faf5ff; border-radius: 8px;">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
            <tr>
              <td style="padding-bottom: 12px; border-bottom: 1px solid #e9d5ff;">
                <span style="font-size: 16px; margin-right: 8px;">🚀</span>
                <span style="font-size: 14px; color: #18181b; font-weight: 500;">Quick Start</span>
                <p style="margin: 4px 0 0 28px; font-size: 13px; color: #71717a;">Get up and running in minutes</p>
              </td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #e9d5ff;">
                <span style="font-size: 16px; margin-right: 8px;">🔒</span>
                <span style="font-size: 14px; color: #18181b; font-weight: 500;">Secure by Default</span>
                <p style="margin: 4px 0 0 28px; font-size: 13px; color: #71717a;">Your data is protected with industry-standard security</p>
              </td>
            </tr>
            <tr>
              <td style="padding-top: 12px;">
                <span style="font-size: 16px; margin-right: 8px;">💡</span>
                <span style="font-size: 14px; color: #18181b; font-weight: 500;">Need Help?</span>
                <p style="margin: 4px 0 0 28px; font-size: 13px; color: #71717a;">Our support team is always here for you</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
    
    <p style="margin: 0; font-size: 15px; line-height: 1.6; color: #52525b; text-align: center;">
      We can't wait to see what you'll build! 🎊
    </p>
  `;

  return {
    subject: `Welcome to {{APP_NAME}}, ${name}!`,
    html: baseTemplate(content, "Welcome!"),
  };
};

// Two-factor authentication enabled template
export const twoFactorEnabledTemplate = (): EmailTemplateReturn => {
  const content = `
    <!-- Icon -->
    <div style="text-align: center; margin-bottom: 24px;">
      <div style="display: inline-block; width: 64px; height: 64px; background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%); border-radius: 50%; line-height: 64px; font-size: 28px;">
        🛡️
      </div>
    </div>
    
    <!-- Title -->
    <h1 style="margin: 0 0 16px 0; font-size: 24px; font-weight: 700; color: #18181b; text-align: center;">
      Two-factor authentication enabled
    </h1>
    
    <!-- Description -->
    <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.6; color: #52525b; text-align: center;">
      Great news! Two-factor authentication has been successfully enabled for your account. Your account is now more secure.
    </p>
    
    <!-- Success Box -->
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
      <tr>
        <td style="padding: 20px; background-color: #f0fdf4; border-radius: 8px; border-left: 4px solid #22c55e;">
          <p style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600; color: #166534;">
            ✓ 2FA is now active
          </p>
          <p style="margin: 0; font-size: 13px; color: #166534;">
            You'll need to enter a verification code each time you sign in.
          </p>
        </td>
      </tr>
    </table>
    
    ${infoBox(
      "Make sure to keep your recovery codes in a safe place. You'll need them if you lose access to your authenticator app.",
      "warning"
    )}
  `;

  return {
    subject: "Two-factor authentication enabled",
    html: baseTemplate(content, "2FA Enabled"),
  };
};

// Two-factor authentication disabled template
export const twoFactorDisabledTemplate = (): EmailTemplateReturn => {
  const content = `
    <!-- Icon -->
    <div style="text-align: center; margin-bottom: 24px;">
      <div style="display: inline-block; width: 64px; height: 64px; background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%); border-radius: 50%; line-height: 64px; font-size: 28px;">
        🔓
      </div>
    </div>
    
    <!-- Title -->
    <h1 style="margin: 0 0 16px 0; font-size: 24px; font-weight: 700; color: #18181b; text-align: center;">
      Two-factor authentication disabled
    </h1>
    
    <!-- Description -->
    <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.6; color: #52525b; text-align: center;">
      Two-factor authentication has been disabled for your account.
    </p>
    
    <!-- Warning Box -->
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
      <tr>
        <td style="padding: 20px; background-color: #fef3c7; border-radius: 8px; border-left: 4px solid #f59e0b;">
          <p style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600; color: #92400e;">
            ⚠️ Your account is less secure
          </p>
          <p style="margin: 0; font-size: 13px; color: #92400e;">
            We recommend enabling 2FA to protect your account from unauthorized access.
          </p>
        </td>
      </tr>
    </table>
    
    ${infoBox(
      "If you didn't make this change, please secure your account immediately by changing your password and re-enabling 2FA.",
      "warning"
    )}
  `;

  return {
    subject: "Two-factor authentication disabled",
    html: baseTemplate(content, "2FA Disabled"),
  };
};
