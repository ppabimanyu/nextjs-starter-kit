import Logo from "../_component/logo";
import Legal from "../_component/legal";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SocialSignOn from "../_component/social-sign-on";
import {
  FieldDescription,
  FieldGroup,
  FieldSeparator,
} from "@/components/ui/field";
import { SignInForm } from "./_components/sign-in-form";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Logo />
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Welcome back</CardTitle>
              <CardDescription>
                Enter your email below to sign-in to your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                <SignInForm />
                <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                  Or continue with
                </FieldSeparator>
                <SocialSignOn />
                <FieldDescription className="text-center">
                  Don&apos;t have an account?{" "}
                  <Link href="/auth/sign-up">Sign up</Link>
                </FieldDescription>
              </FieldGroup>
            </CardContent>
          </Card>
          <Legal />
        </div>
      </div>
    </div>
  );
}
