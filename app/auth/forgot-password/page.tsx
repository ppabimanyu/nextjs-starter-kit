"use client";

import Logo from "../_component/logo";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";
import { ForgotPasswordForm } from "./_components/forgot-password-form";
import { ForgotPasswordSuccess } from "./_components/forgot-password-success";
import { BackToSignInButton } from "../_component/back-to-sign-in-button";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [success, setSuccess] = useState(false);

  return (
    <div className="bg-linear-to-br from-primary/20 via-background to-pink-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        {success ? (
          <ForgotPasswordSuccess />
        ) : (
          <>
            <Logo />
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-xl">Forgot Password</CardTitle>
                <CardDescription>
                  Enter your email below to reset your password
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FieldGroup>
                  <ForgotPasswordForm onChangeSuccess={setSuccess} />
                </FieldGroup>
              </CardContent>
            </Card>
            <BackToSignInButton />
          </>
        )}
      </div>
    </div>
  );
}
