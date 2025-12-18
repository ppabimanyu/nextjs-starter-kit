"use client";

import LoadingButton from "@/components/loading-button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldDescription,
} from "@/components/ui/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { authClient } from "@/lib/auth-client";
import { useForm } from "@tanstack/react-form";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
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
import Link from "next/link";
import { useRouter } from "next/navigation";
import { env } from "@/lib/env";

function TwoFactorAuthForm() {
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      code: "",
      trustDevice: false,
    },
    validators: {
      onSubmit: z.object({
        code: z.string().min(6, "Code must be at least 6 characters long"),
        trustDevice: z.boolean(),
      }),
    },
    onSubmit: async ({ value }) => {
      const { error } = await authClient.twoFactor.verifyTotp({
        code: value.code,
        trustDevice: value.trustDevice,
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
            <FieldLabel className="flex justify-center">
              Enter your 6-digit code
            </FieldLabel>
            <InputOTP
              id="code"
              name="code"
              maxLength={6}
              pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
              value={field.state.value}
              onChange={(value) => {
                field.handleChange(value.toUpperCase());
              }}
              onBlur={field.handleBlur}
            >
              <InputOTPGroup className="mx-auto">
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
            <FieldError errors={field.state.meta.errors} />
          </Field>
        )}
      </form.Field>
      <form.Field name="trustDevice">
        {(field) => (
          <Field orientation={"vertical"}>
            <Field orientation={"horizontal"}>
              <Checkbox
                id="trustDevice"
                checked={field.state.value}
                onCheckedChange={(checked) => field.handleChange(!!checked)}
              />
              <FieldLabel htmlFor="trustDevice">Trust this device</FieldLabel>
            </Field>
            <FieldDescription>
              Opt in to skip 2FA verification for this device for a month.
            </FieldDescription>
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

export function TwoFactorCodePage() {
  return (
    <div className="bg-linear-to-br from-primary/20 via-background to-pink-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Logo />
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">
              Verify Authentication Code
            </CardTitle>
            <CardDescription>
              Open the two-factor authentication app on your device to view your
              authentication code and verify your identity.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <TwoFactorAuthForm />
              <p className="text-center text-muted-foreground">
                Don&apos;t have a 2FA device?{" "}
                <Link
                  replace
                  href="/auth/2fa?tab=recovery-code"
                  className="hover:underline text-primary"
                >
                  Enter a backup code
                </Link>
              </p>
            </FieldGroup>
          </CardContent>
        </Card>
        <BackToSignInButton />
      </div>
    </div>
  );
}
