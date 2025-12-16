"use client";

import LoadingButton from "@/components/loading-button";
import { PasswordInput } from "@/components/password-input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { env } from "@/lib/env";
import { useForm } from "@tanstack/react-form";
import Link from "next/link";
import { toast } from "sonner";
import { z } from "zod";

export function SignInForm() {
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    validators: {
      onSubmit: z.object({
        email: z.email("Invalid email address"),
        password: z.string().min(1, "Password is required"),
        rememberMe: z.boolean(),
      }),
    },
    onSubmit: async ({ value }) => {
      const { error } = await authClient.signIn.email({
        email: value.email.trim(),
        password: value.password.trim(),
        callbackURL: env.NEXT_PUBLIC_DEFAULT_AUTHENTICATED_PAGE,
        rememberMe: value.rememberMe,
      });
      if (error) {
        toast.error(`Failed to sign in: ${error.message}`);
      }
    },
  });

  return (
    <FieldGroup>
      <form.Field name="email">
        {(field) => (
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
            />
            <FieldError errors={field.state.meta.errors} />
          </Field>
        )}
      </form.Field>
      <form.Field name="password">
        {(field) => (
          <Field>
            <div className="flex items-center">
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Link
                href="/auth/forgot-password"
                className="ml-auto text-sm underline-offset-4 hover:underline"
              >
                Forgot your password?
              </Link>
            </div>
            <PasswordInput
              id="password"
              placeholder="Password"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
            />
            <FieldError errors={field.state.meta.errors} />
          </Field>
        )}
      </form.Field>
      <form.Field name="rememberMe">
        {(field) => (
          <Field orientation={"horizontal"}>
            <Checkbox
              id="rememberMe"
              checked={field.state.value}
              onCheckedChange={(checked) => field.handleChange(!!checked)}
            />
            <FieldLabel htmlFor="rememberMe">Remember me</FieldLabel>
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
              Sign In
            </LoadingButton>
          </Field>
        )}
      </form.Subscribe>
    </FieldGroup>
  );
}
