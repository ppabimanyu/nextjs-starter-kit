"use client";

import { useState } from "react";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2, AlertTriangle } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { toast } from "sonner";
import LoadingButton from "@/components/loading-button";
import { env } from "@/lib/env";
import { PasswordInput } from "@/components/password-input";
import { useRouter } from "next/navigation";

function DeleteAccountDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const form = useForm({
    defaultValues: {
      password: "",
    },
    validators: {
      onSubmit: z.object({
        password: z.string().min(1, "Password is required"),
      }),
    },
    onSubmit: async ({ value }) => {
      const { error } = await authClient.deleteUser({
        password: value.password.trim(),
        callbackURL: env.NEXT_PUBLIC_DEFAULT_UNAUTHENTICATED_PAGE,
      });
      if (error) {
        toast.error(`Failed to delete account: ${error.message}`);
      } else {
        toast.success("Account deleted successfully");
        setOpen(false);
        router.replace(env.NEXT_PUBLIC_DEFAULT_UNAUTHENTICATED_PAGE);
      }
      form.reset();
    },
  });

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      form.reset();
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="ml-auto">
          <Trash2 />
          Delete Account
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-destructive">
            Delete Account Permanently
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. Your account and all associated data
            will be permanently deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <form.Field name="password">
          {(field) => (
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
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
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
          >
            {([canSubmit, isSubmitting]) => (
              <LoadingButton
                variant="destructive"
                onClick={form.handleSubmit}
                disabled={!canSubmit}
                isLoading={isSubmitting}
              >
                Yes, Delete My Account
              </LoadingButton>
            )}
          </form.Subscribe>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default function SecurityDelete() {
  return (
    <div className="flex flex-col md:flex-row gap-2 md:gap-4 w-full">
      <Field className="md:flex-1/3">
        <FieldLabel className="text-destructive">Delete Account</FieldLabel>
        <FieldDescription>
          Permanently delete your account and all associated data. This action
          cannot be undone.
        </FieldDescription>
      </Field>
      <Card className="md:flex-2/3 border-destructive/50">
        <CardContent>
          <FieldGroup>
            <Field>
              <div className="flex items-start gap-4 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                <div className="space-y-2">
                  <FieldLabel className="text-destructive">
                    Warning: This action is irreversible
                  </FieldLabel>
                  <FieldDescription>
                    Once you delete your account, all of your data will be
                    permanently removed. This includes your profile,
                    preferences, and any content you&apos;ve created. You will
                    not be able to recover this information.
                  </FieldDescription>
                </div>
              </div>
            </Field>
          </FieldGroup>
        </CardContent>
        <CardFooter>
          <DeleteAccountDialog />
        </CardFooter>
      </Card>
    </div>
  );
}
