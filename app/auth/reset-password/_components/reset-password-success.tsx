import { CheckCircle2 } from "lucide-react";
import { FieldDescription, FieldGroup } from "@/components/ui/field";
import { BackToSignInButton } from "../../_component/back-to-sign-in-button";

export function ResetPasswordSuccess() {
  return (
    <FieldGroup>
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
          <CheckCircle2 className="size-8" />
        </div>
        <h1 className="text-xl font-bold capitalize">
          Password Reset Complete
        </h1>
        <FieldDescription className="text-center">
          Your password has been successfully reset. You can now sign in with
          your new password.
        </FieldDescription>
      </div>
      <BackToSignInButton />
    </FieldGroup>
  );
}
