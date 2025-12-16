type emailTemplateReturn = {
  subject: string;
  text: string;
};

export const emailVerificationTemplate = (url: string): emailTemplateReturn => {
  return {
    subject: "Verify your email address",
    text: `Please click the link below to verify your email address: <a href="${url}">${url}</a>`,
  };
};

export const resetPasswordTemplate = (url: string): emailTemplateReturn => {
  return {
    subject: "Reset your password",
    text: `Please click the link below to reset your password: <a href="${url}">${url}</a>`,
  };
};

export const successResetPasswordTemplate = (): emailTemplateReturn => {
  return {
    subject: "Password reset successful",
    text: "Your password has been reset successfully.",
  };
};

export const deleteAccountTemplate = (url: string): emailTemplateReturn => {
  return {
    subject: "Delete your account",
    text: `Please click the link below to delete your account: <a href="${url}">${url}</a>`,
  };
};
