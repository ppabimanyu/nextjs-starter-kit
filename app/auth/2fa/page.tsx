"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { TwoFactorCodePage } from "./_components/2fa-code";
import { RecoveryCodePage } from "./_components/recovery-code";
import { useEffect } from "react";

export default function TwoFactorAuthPage() {
  const router = useRouter();
  const params = useSearchParams();
  const tab = params.get("tab");

  useEffect(() => {
    if (tab !== "recovery-code" && tab !== "2fa-code") {
      router.replace(`/auth/2fa?tab=2fa-code`);
    }
  }, [tab, router]);

  return tab === "recovery-code" ? <RecoveryCodePage /> : <TwoFactorCodePage />;
}
