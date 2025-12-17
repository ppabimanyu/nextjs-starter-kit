"use client";

import ProfileSettings from "./profile-settings";
import ProfileEmail from "./profile-email";
import { LoadingContent } from "@/components/loading";
import { useRequireAuth } from "@/hooks/use-auth-redirect";

export default function ProfilePage() {
  const session = useRequireAuth();
  if (session.isLoading) {
    return <LoadingContent />;
  }

  return (
    <div className="space-y-6 md:space-y-4 h-full">
      <ProfileSettings user={session.user} />
      <ProfileEmail user={session.user} />
    </div>
  );
}
