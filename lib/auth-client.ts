import { createAuthClient } from "better-auth/react";
import { twoFactorClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  /** The base URL of the server (optional if you're using the same domain) */
  //   baseURL: "http://localhost:3000",
  plugins: [
    twoFactorClient({
      onTwoFactorRedirect: () => {
        window.location.href = "/auth/2fa";
      },
    }),
  ],
});

export type ErrorCodes = keyof typeof authClient.$ERROR_CODES;
export type Provider = "github" | "google" | (string & {});
