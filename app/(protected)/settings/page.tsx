"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import ProfilePage from "./_components/profile";
import SecurityPage from "./_components/security";
import BillingPage from "./_components/billing";
import AppearancePage from "./_components/appearance";

export default function SettingsPage() {
  const router = useRouter();
  const params = useSearchParams();
  const activeTab = (params.get("tab") as string) || "profile";

  const handleChangeTab = (tab: string) => {
    router.push(`/settings?tab=${tab}`);
  };

  return (
    <div className="space-y-4 h-full">
      <header className="flex items-center gap-2">
        <Settings className="size-5" />
        <h1 className="text-lg font-medium">Settings</h1>
      </header>
      <Tabs
        className="w-full h-full"
        value={activeTab}
        onValueChange={(value) => handleChangeTab(value)}
      >
        <div className="w-full border-b">
          <TabsList
            variant={"line"}
            defaultValue={activeTab}
            className="w-full max-w-fit overflow-x-scroll overflow-y-hidden"
          >
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
          </TabsList>
        </div>

        <div className="py-6 md:px-6 h-full">
          <TabsContent value="profile" className="h-full">
            <ProfilePage />
          </TabsContent>
          <TabsContent value="security" className="h-full">
            <SecurityPage />
          </TabsContent>
          <TabsContent value="billing" className="h-full">
            <BillingPage />
          </TabsContent>
          <TabsContent value="appearance" className="h-full">
            <AppearancePage />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
