"use client";

import { authClient } from "@/lib/auth-client";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export const SESSIONS_QUERY_KEY = ["sessions"] as const;

/**
 * Hook to fetch and manage user sessions.
 * Provides session list query and invalidation utility.
 */
export function useSessions() {
  const queryClient = useQueryClient();

  const sessionsQuery = useQuery({
    queryKey: SESSIONS_QUERY_KEY,
    queryFn: async () => {
      const sessions = await authClient.listSessions();
      if (sessions.error) {
        throw sessions.error;
      }
      return sessions.data;
    },
  });

  const invalidateSessions = () => {
    return queryClient.invalidateQueries({ queryKey: SESSIONS_QUERY_KEY });
  };

  return {
    sessions: sessionsQuery.data,
    isLoading: sessionsQuery.isLoading,
    isError: sessionsQuery.isError,
    error: sessionsQuery.error,
    refetch: sessionsQuery.refetch,
    invalidateSessions,
  };
}
