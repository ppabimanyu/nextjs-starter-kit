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
import { ResetPasswordForm } from "./_components/reset-password-form";
import { ResetPasswordSuccess } from "./_components/reset-password-success";
import { ResetPasswordError } from "./_components/reset-password-error";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [isSuccess, setIsSuccess] = useState(false);

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        {!token ? (
          <ResetPasswordError />
        ) : isSuccess ? (
          <ResetPasswordSuccess />
        ) : (
          <>
            <Logo />
            <div className="flex flex-col gap-6">
              <Card>
                <CardHeader className="text-center">
                  <CardTitle className="text-xl">Reset Password</CardTitle>
                  <CardDescription>
                    Enter your new password below
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FieldGroup>
                    <ResetPasswordForm
                      onChangeSuccess={setIsSuccess}
                      token={token}
                    />
                  </FieldGroup>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
