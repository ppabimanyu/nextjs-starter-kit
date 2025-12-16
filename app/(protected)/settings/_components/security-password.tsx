"use client";

import React from "react";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { KeyRound } from "lucide-react";
import { PasswordInput } from "@/components/password-input";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import LoadingButton from "@/components/loading-button";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

export default function SecurityPassword() {
  const passwordForm = useForm({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validators: {
      onSubmit: z
        .object({
          currentPassword: z.string().min(1, "Current password is required"),
          newPassword: z
            .string()
            .min(8, "Password must be at least 8 characters")
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
        .refine((data) => data.newPassword === data.confirmPassword, {
          message: "Passwords do not match",
          path: ["confirmPassword"],
        })
        .refine((data) => data.currentPassword !== data.newPassword, {
          message: "New password must be different from current password",
          path: ["newPassword"],
        }),
    },
    onSubmit: async ({ value }) => {
      const { error } = await authClient.changePassword({
        newPassword: value.newPassword,
        currentPassword: value.currentPassword,
        revokeOtherSessions: true,
      });
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Password changed successfully");
        passwordForm.reset();
      }
    },
  });

  return (
    <div className="flex flex-col md:flex-row gap-2 md:gap-4 w-full">
      <Field className="md:flex-1/3">
        <FieldLabel>Password</FieldLabel>
        <FieldDescription>
          Keep your account secure by using a strong, unique password. We
          recommend changing it periodically for enhanced security.
        </FieldDescription>
      </Field>
      <Card className="md:flex-2/3">
        <CardContent>
          <FieldGroup>
            <passwordForm.Field name="currentPassword">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor="currentPassword">
                    Current Password
                  </FieldLabel>
                  <PasswordInput
                    id="currentPassword"
                    placeholder="Enter your current password"
                    className="max-w-sm"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                  />
                  <FieldError errors={field.state.meta.errors} />
                  <FieldDescription>
                    Enter your existing password to verify your identity before
                    making changes.
                  </FieldDescription>
                </Field>
              )}
            </passwordForm.Field>
            <passwordForm.Field name="newPassword">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor="newPassword">New Password</FieldLabel>
                  <PasswordInput
                    id="newPassword"
                    placeholder="Enter your new password"
                    className="max-w-sm"
                    showStrength
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                  />
                  <FieldError errors={field.state.meta.errors} />
                  <FieldDescription>
                    Create a strong password with at least 8 characters,
                    including uppercase, lowercase, numbers, and special
                    characters.
                  </FieldDescription>
                </Field>
              )}
            </passwordForm.Field>
            <passwordForm.Field name="confirmPassword">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor="confirmPassword">
                    Confirm New Password
                  </FieldLabel>
                  <PasswordInput
                    id="confirmPassword"
                    placeholder="Confirm your new password"
                    className="max-w-sm"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                  />
                  <FieldError errors={field.state.meta.errors} />
                  <FieldDescription>
                    Re-enter your new password to ensure it matches.
                  </FieldDescription>
                </Field>
              )}
            </passwordForm.Field>
          </FieldGroup>
        </CardContent>
        <CardFooter>
          <passwordForm.Subscribe
            selector={(state) => [state.isSubmitting, state.canSubmit]}
          >
            {([isSubmitting, canSubmit]) => (
              <LoadingButton
                type="button"
                className="ml-auto"
                onClick={() => passwordForm.handleSubmit()}
                isLoading={isSubmitting}
                disabled={!canSubmit}
              >
                <KeyRound />
                Update Password
              </LoadingButton>
            )}
          </passwordForm.Subscribe>
        </CardFooter>
      </Card>
    </div>
  );
}
