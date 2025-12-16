import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { SidebarApp } from "./_components/sidebar-app";
import { Separator } from "@/components/ui/separator";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect, RedirectType } from "next/navigation";
import { env } from "@/lib/env";

export default async function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return redirect(
      env.NEXT_PUBLIC_DEFAULT_UNAUTHENTICATED_PAGE,
      RedirectType.replace
    );
  }

  return (
    <SidebarProvider>
      <SidebarApp />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 md:hidden">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" />
            <h1>NextJS Starter Kit</h1>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 h-full p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
