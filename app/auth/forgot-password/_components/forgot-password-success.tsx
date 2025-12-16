import { Mail } from "lucide-react";
import { FieldDescription, FieldGroup } from "@/components/ui/field";
import { BackToSignInButton } from "../../_component/back-to-sign-in-button";

export function ForgotPasswordSuccess() {
  return (
    <FieldGroup>
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Mail className="size-8" />
        </div>
        <h1 className="text-xl font-bold capitalize">Check Your Email</h1>
        <FieldDescription className="text-center">
          We&apos;ve sent a password reset link to your email address. Please
          check your inbox and click the link to reset your password.
        </FieldDescription>
      </div>
      <BackToSignInButton />
    </FieldGroup>
  );
}
