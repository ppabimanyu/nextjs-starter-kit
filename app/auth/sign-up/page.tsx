"use client";

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
import { SignUpForm } from "./_components/sign-up-form";
import { SignUpSuccess } from "./_components/sign-up-success";
import Link from "next/link";
import { useState } from "react";

export default function SignUpPage() {
  const [success, setSuccess] = useState(false);

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        {success ? (
          <SignUpSuccess />
        ) : (
          <>
            <Logo />
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-xl">Create an account</CardTitle>
                <CardDescription>
                  Enter your information below to create your account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FieldGroup>
                  <SignUpForm onChangeSuccess={setSuccess} />
                  <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                    Or continue with
                  </FieldSeparator>
                  <SocialSignOn />
                  <FieldDescription className="text-center">
                    Already have an account?{" "}
                    <Link href="/auth/sign-in">Sign in</Link>
                  </FieldDescription>
                </FieldGroup>
              </CardContent>
            </Card>
            <Legal />
          </>
        )}
      </div>
    </div>
  );
}
