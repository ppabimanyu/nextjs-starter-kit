"use client";

import { authClient } from "@/lib/auth-client";
import { env } from "@/lib/env";
import { error } from "console";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

/**
 * Hook to redirect authenticated users away from guest-only pages (e.g., sign-in, sign-up).
 * Returns session state for conditional rendering.
 */
export function useRequireGuest() {
  const router = useRouter();
  const session = authClient.useSession();

  useEffect(() => {
    if (session.data?.user) {
      router.replace(env.NEXT_PUBLIC_DEFAULT_AUTHENTICATED_PAGE);
    }
  }, [session.data?.user, router, session.error]);

  return {
    isLoading: session.isPending || !!session.data?.user,
    session: session.data?.session,
    error: session.error,
  };
}

/**
 * Hook to redirect unauthenticated users to sign-in page.
 * Returns session state for conditional rendering.
 */
export function useRequireAuth() {
  const router = useRouter();
  const session = authClient.useSession();

  useEffect(() => {
    if (!session.isPending && !session.data?.user) {
      router.replace(env.NEXT_PUBLIC_DEFAULT_UNAUTHENTICATED_PAGE);
    }
  }, [session.isPending, session.data?.user, router, session.error]);

  return {
    isLoading: session.isPending || !session.data?.user,
    session: session.data?.session,
    user: session.data?.user,
    error: session.error,
  };
}
