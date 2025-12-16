import { XCircle } from "lucide-react";
import { FieldDescription, FieldGroup } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function ResetPasswordError() {
  return (
    <FieldGroup>
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
          <XCircle className="size-8" />
        </div>
        <h1 className="text-xl font-bold capitalize">
          Invalid or Expired Link
        </h1>
        <FieldDescription className="text-center">
          This password reset link is invalid or has expired. Please request a
          new password reset link.
        </FieldDescription>
      </div>
      <Button asChild className="w-full">
        <Link href="/auth/forgot-password" replace>
          Request New Link
        </Link>
      </Button>
    </FieldGroup>
  );
}
