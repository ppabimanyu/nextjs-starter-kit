"use client";

import SecurityPassword from "./security-password";
import Security2FA from "./security-2fa";
import SecuritySessions from "./security-sessions";
import SecurityDelete from "./security-delete";
import { useRequireAuth } from "@/hooks/use-auth-redirect";
import { LoadingContent } from "@/components/loading";

export default function SecurityPage() {
  const session = useRequireAuth();
  if (session.isLoading) {
    return <LoadingContent />;
  }

  return (
    <div className="space-y-6 md:space-y-4 h-full">
      <SecurityPassword />
      <Security2FA user={session.user} />
      <SecuritySessions session={session.session} />
      <SecurityDelete />
    </div>
  );
}
