"use client";

import { useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { env } from "@/lib/env";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

/**
 * Hook to redirect unauthenticated users to sign-in page.
 * Returns session state for conditional rendering.
 */
export function useRequireAuth() {
  const router = useRouter();
  const session = authClient.useSession();

  useEffect(() => {
    if (session.error) {
      toast.error(`Failed to get session: ${session.error.message}`);
    }

    if (!session.isPending && !session.data?.user) {
      router.replace(env.NEXT_PUBLIC_DEFAULT_UNAUTHENTICATED_PAGE);
    }
  }, [session.isPending, session.data?.user, session.error, router]);

  return {
    isLoading: session.isPending,
    session: session.data?.session,
    user: session.data?.user,
  };
}
