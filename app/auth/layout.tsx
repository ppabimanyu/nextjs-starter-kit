import { auth } from "@/lib/auth";
import { env } from "@/lib/env";
import { headers } from "next/headers";
import { redirect, RedirectType } from "next/navigation";

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (session?.user) {
    redirect(env.NEXT_PUBLIC_DEFAULT_AUTHENTICATED_PAGE, RedirectType.replace);
  }
  return <>{children}</>;
}
