"use client";

import ProfileSettings from "./profile-settings";
import ProfileEmail from "./profile-email";
import { LoadingContent } from "@/components/loading";
import { useRequireAuth } from "@/hooks/use-auth-redirect";
import { toast } from "sonner";

export default function ProfilePage() {
  const session = useRequireAuth();
  if (session.error) {
    toast.error(`Failed to get session: ${session.error.message}`);
  }
  if (session.isLoading) {
    return <LoadingContent />;
  }

  return (
    <div className="space-y-6 md:space-y-4 h-full">
      <ProfileSettings user={session.user!} />
      <ProfileEmail email={session.user!.email} />
    </div>
  );
}
