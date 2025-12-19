import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.url(),
    BETTER_AUTH_SECRET: z.string().min(1),
    BETTER_AUTH_URL: z.url().min(1),
    AUTH_REQUIRED_EMAIL_VERIFICATION: z.boolean(),
    AUTH_GITHUB_CLIENT_ID: z.string().min(1),
    AUTH_GITHUB_CLIENT_SECRET: z.string().min(1),
    AUTH_GOOGLE_CLIENT_ID: z.string().min(1),
    AUTH_GOOGLE_CLIENT_SECRET: z.string().min(1),
    STORAGE_PROVIDER: z.enum(["local", "vercel-blob", "s3"]).default("local"),
    BLOB_READ_WRITE_TOKEN: z.string().optional(),
  },
  client: {
    NEXT_PUBLIC_SITE_URL: z.string().min(1),
    NEXT_PUBLIC_APP_NAME: z.string().min(1),
    NEXT_PUBLIC_DEFAULT_AUTHENTICATED_PAGE: z.string().min(1),
    NEXT_PUBLIC_DEFAULT_UNAUTHENTICATED_PAGE: z.string().min(1),
    NEXT_PUBLIC_AUTH_ENABLE_2FA: z.boolean(),
  },
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,

    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    AUTH_REQUIRED_EMAIL_VERIFICATION:
      process.env.AUTH_REQUIRED_EMAIL_VERIFICATION == "true",
    AUTH_GITHUB_CLIENT_ID: process.env.AUTH_GITHUB_CLIENT_ID,
    AUTH_GITHUB_CLIENT_SECRET: process.env.AUTH_GITHUB_CLIENT_SECRET,
    AUTH_GOOGLE_CLIENT_ID: process.env.AUTH_GOOGLE_CLIENT_ID,
    AUTH_GOOGLE_CLIENT_SECRET: process.env.AUTH_GOOGLE_CLIENT_SECRET,

    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_DEFAULT_AUTHENTICATED_PAGE:
      process.env.NEXT_PUBLIC_DEFAULT_AUTHENTICATED_PAGE,
    NEXT_PUBLIC_DEFAULT_UNAUTHENTICATED_PAGE:
      process.env.NEXT_PUBLIC_DEFAULT_UNAUTHENTICATED_PAGE,
    NEXT_PUBLIC_AUTH_ENABLE_2FA:
      process.env.NEXT_PUBLIC_AUTH_ENABLE_2FA == "true",

    STORAGE_PROVIDER: process.env.STORAGE_PROVIDER,
    BLOB_READ_WRITE_TOKEN: process.env.BLOB_READ_WRITE_TOKEN,
  },
});
