import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/prisma";
import { env } from "@/lib/env";
import { sendEmail } from "./mail-sender";
import { twoFactor } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import {
  emailVerificationTemplate,
  resetPasswordTemplate,
  successResetPasswordTemplate,
} from "./mail-template";

export const auth = betterAuth({
  appName: env.NEXT_PUBLIC_APP_NAME,
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    requireEmailVerification: env.AUTH_REQUIRED_EMAIL_VERIFICATION,
    sendResetPassword: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        ...resetPasswordTemplate(url),
      });
    },
    onPasswordReset: async ({ user }) => {
      await sendEmail({
        to: user.email,
        ...successResetPasswordTemplate(),
      });
    },
  },
  user: {
    changeEmail: {
      enabled: true,
    },
    deleteUser: {
      enabled: true,
    },
  },
  emailVerification: {
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        ...emailVerificationTemplate(url),
      });
    },
  },
  socialProviders: {
    github: {
      clientId: env.AUTH_GITHUB_CLIENT_ID || "",
      clientSecret: env.AUTH_GITHUB_CLIENT_SECRET || "",
    },
    google: {
      clientId: env.AUTH_GOOGLE_CLIENT_ID || "",
      clientSecret: env.AUTH_GOOGLE_CLIENT_SECRET || "",
    },
  },
  plugins: [twoFactor(), nextCookies()],
});

export type Session = typeof auth.$Infer.Session;
