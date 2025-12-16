"use client";

import LoadingButton from "@/components/loading-button";
import { PasswordInput } from "@/components/password-input";
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

export function ResetPasswordForm({
  token,
  onChangeSuccess,
}: {
  token: string;
  onChangeSuccess: (success: boolean) => void;
}) {
  const form = useForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    validators: {
      onSubmit: z
        .object({
          password: z
            .string()
            .min(8, "Password must be at least 8 characters long")
            .regex(
              /[A-Z]/,
              "Password must contain at least one uppercase letter"
            )
            .regex(
              /[a-z]/,
              "Password must contain at least one lowercase letter"
            )
            .regex(/[0-9]/, "Password must contain at least one number")
            .regex(
              /[^A-Za-z0-9]/,
              "Password must contain at least one special character"
            ),
          confirmPassword: z.string(),
        })
        .refine((data) => data.password === data.confirmPassword, {
          message: "Passwords do not match",
          path: ["confirmPassword"],
        }),
    },
    onSubmit: async ({ value }) => {
      const { error } = await authClient.resetPassword({
        newPassword: value.password,
        token,
      });
      if (error) {
        toast.error(`Failed to reset password, ${error.message}`);
      } else {
        onChangeSuccess(true);
      }
    },
  });

  return (
    <FieldGroup>
      <form.Field name="password">
        {(field) => (
          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <PasswordInput
              showStrength
              id="password"
              placeholder="Password"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
            />
            <FieldError errors={field.state.meta.errors} />
          </Field>
        )}
      </form.Field>
      <form.Field name="confirmPassword">
        {(field) => (
          <Field>
            <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
            <PasswordInput
              id="confirmPassword"
              placeholder="Confirm Password"
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
              Reset
            </LoadingButton>
          </Field>
        )}
      </form.Subscribe>
    </FieldGroup>
  );
}
