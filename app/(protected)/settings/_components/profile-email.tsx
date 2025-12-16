"use client";

import React, { useState } from "react";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import LoadingButton from "@/components/loading-button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Mail } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { env } from "@/lib/env";

function ChangeEmailDialog({ email }: { email: string }) {
  const [open, setOpen] = useState(false);
  const [success, setSuccess] = useState(false);

  const emailForm = useForm({
    defaultValues: {
      newEmail: "",
    },
    validators: {
      onSubmit: z
        .object({
          newEmail: z.email("Please enter a valid email address"),
        })
        .refine((data) => data.newEmail !== email, {
          message: "New email must be different from current email",
          path: ["newEmail"],
        }),
    },
    onSubmit: async ({ value }) => {
      const { error } = await authClient.changeEmail({
        newEmail: value.newEmail.trim(),
        callbackURL: env.NEXT_PUBLIC_DEFAULT_AUTHENTICATED_PAGE,
      });
      if (error) {
        toast.error(`Failed to update email: ${error.message}`);
        handleOpenChange(false);
      } else {
        setSuccess(true);
      }
    },
  });

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      emailForm.reset();
    }
    setOpen(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="ml-auto">Change Email</Button>
      </DialogTrigger>
      <DialogContent>
        {success && (
          <>
            <DialogHeader>
              <DialogTitle>Verify Your Email</DialogTitle>
              <DialogDescription>
                We&apos;ve sent a verification link to your new email address.
                Please check your inbox and click the link to verify your new
                email address.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => handleOpenChange(false)}>
                Close
              </Button>
            </DialogFooter>
          </>
        )}
        {!success && (
          <>
            <DialogHeader>
              <DialogTitle>Change Email Address</DialogTitle>
              <DialogDescription>
                You&apos;ll need to verify this email address before it can be
                added to your account.
              </DialogDescription>
            </DialogHeader>
            <FieldGroup>
              <emailForm.Field name="newEmail">
                {(field) => (
                  <Field>
                    <FieldLabel htmlFor="newEmailDialog">
                      New Email Address
                    </FieldLabel>
                    <Input
                      id="newEmailDialog"
                      type="email"
                      placeholder="Enter your new email"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      autoComplete="off"
                    />
                    <FieldError errors={field.state.meta.errors} />
                  </Field>
                )}
              </emailForm.Field>
            </FieldGroup>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <emailForm.Subscribe
                selector={(state) => [state.isSubmitting, state.canSubmit]}
              >
                {([isSubmitting, canSubmit]) => (
                  <LoadingButton
                    type="button"
                    onClick={() => emailForm.handleSubmit()}
                    isLoading={isSubmitting}
                    disabled={!canSubmit}
                  >
                    Update Email
                  </LoadingButton>
                )}
              </emailForm.Subscribe>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

type ProfileEmailProps = {
  email: string;
};

export default function ProfileEmail({ email }: ProfileEmailProps) {
  return (
    <div className="flex flex-col md:flex-row gap-2 md:gap-4 w-full">
      <Field className="md:flex-1/3">
        <FieldLabel>Email Address</FieldLabel>
        <FieldDescription>
          Your email is used for account access, notifications, and password
          recovery. Keep it up to date to ensure you don&apos;t lose access.
        </FieldDescription>
      </Field>
      <Card className="md:flex-2/3">
        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel>Current Email Address</FieldLabel>
              <InputGroup className="max-w-sm">
                <InputGroupInput value={email} type="email" disabled />
                <InputGroupAddon>
                  <Mail />
                </InputGroupAddon>
              </InputGroup>
              <FieldDescription>
                This is your current email address associated with your account.
                You use this to sign in and receive important notifications.
              </FieldDescription>
            </Field>
          </FieldGroup>
        </CardContent>
        <CardFooter>
          <ChangeEmailDialog email={email} />
        </CardFooter>
      </Card>
    </div>
  );
}
