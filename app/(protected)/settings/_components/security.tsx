"use client";

import SecurityPassword from "./security-password";
import Security2FA from "./security-2fa";
import SecuritySessions from "./security-sessions";
import SecurityDelete from "./security-delete";

export default function SecurityPage() {
  return (
    <div className="space-y-6 md:space-y-4 h-full">
      <SecurityPassword />
      <Security2FA />
      <SecuritySessions />
      <SecurityDelete />
    </div>
  );
}
