"use client";

import LoadingButton from "@/components/loading-button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { authClient } from "@/lib/auth-client";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { z } from "zod";
import Logo from "../../_component/logo";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BackToSignInButton } from "../../_component/back-to-sign-in-button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { env } from "@/lib/env";

function RecoveryCodeForm() {
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      code: "",
    },
    validators: {
      onSubmit: z.object({
        code: z.string().min(6, "Code must be at least 6 characters long"),
      }),
    },
    onSubmit: async ({ value }) => {
      const { error } = await authClient.twoFactor.verifyBackupCode({
        code: value.code.trim(),
        disableSession: false,
        trustDevice: false,
      });
      if (error) {
        toast.error(`Failed to verify 2FA: ${error.message}`);
      } else {
        toast.success("2FA verified successfully");
        router.replace(env.NEXT_PUBLIC_DEFAULT_AUTHENTICATED_PAGE);
      }
    },
  });

  return (
    <FieldGroup>
      <form.Field name="code">
        {(field) => (
          <Field>
            <FieldLabel htmlFor="code">Recovery Code</FieldLabel>
            <Input
              id="code"
              name="code"
              type="text"
              placeholder="Enter your code here"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
            />
            <FieldError errors={field.state.meta.errors} />
          </Field>
        )}
      </form.Field>
      <form.Subscribe
        selector={(state) => [state.isSubmitting, state.canSubmit]}
      >
        {([isSubmitting, canSubmit]) => (
          <Field>
            <LoadingButton
              type="button"
              onClick={() => form.handleSubmit()}
              isLoading={isSubmitting}
              disabled={!canSubmit}
            >
              Verify
            </LoadingButton>
          </Field>
        )}
      </form.Subscribe>
    </FieldGroup>
  );
}

export function RecoveryCodePage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Logo />
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Recovery Code</CardTitle>
            <CardDescription>
              Please enter one of your recovery codes if you have lost access to
              your device.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <RecoveryCodeForm />
              <Link
                replace
                href="/auth/2fa?tab=2fa-code"
                className="hover:underline text-primary text-center"
              >
                Verify with 2FA code
              </Link>
            </FieldGroup>
          </CardContent>
        </Card>
        <BackToSignInButton />
      </div>
    </div>
  );
}
