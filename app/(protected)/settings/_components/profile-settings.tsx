"use client";

import React from "react";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import LoadingButton from "@/components/loading-button";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { Session } from "@/lib/auth";

type ProfileSettingsProps = {
  user?: Session["user"];
};

export default function ProfileSettings({ user }: ProfileSettingsProps) {
  const profileForm = useForm({
    defaultValues: {
      fullName: user?.name ?? "",
    },
    validators: {
      onSubmit: z.object({
        fullName: z
          .string()
          .min(3, "Name must be at least 3 characters")
          .max(50, "Name must be at most 50 characters"),
      }),
    },
    onSubmit: async ({ value }) => {
      if (value.fullName.trim() === user?.name) {
        return;
      }
      const { error } = await authClient.updateUser({
        name: value.fullName.trim(),
      });
      if (error) {
        toast.error(`Failed to update profile: ${error.message}`);
      } else {
        toast.success("Profile updated successfully");
      }
    },
  });

  return (
    <div className="flex flex-col md:flex-row gap-2 md:gap-4 w-full">
      <Field className="md:flex-1/3">
        <FieldLabel>Profile Settings</FieldLabel>
        <FieldDescription>
          Manage your public profile information. This includes your photo and
          display name that others will see across the platform.
        </FieldDescription>
      </Field>
      <Card className="md:flex-2/3">
        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel>Profile Picture</FieldLabel>
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={user?.image ?? ""} alt={user?.name} />
                  <AvatarFallback>
                    {user?.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Button type="button">Upload</Button>
                    <Button type="button" variant="ghost">
                      Remove
                    </Button>
                  </div>
                  <FieldDescription>
                    Accepted formats: JPG, GIF, PNG, or WebP. Maximum file size
                    is 800KB. A square image works best.
                  </FieldDescription>
                </div>
              </div>
            </Field>
            <profileForm.Field name="fullName">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor="fullName">Full name</FieldLabel>
                  <Input
                    id="fullName"
                    placeholder="Enter your full name"
                    className="max-w-sm"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                  />
                  <FieldError errors={field.state.meta.errors} />
                  <FieldDescription>
                    Your display name appears on your profile and in comments.
                    You can use your real name or a nickname.
                  </FieldDescription>
                </Field>
              )}
            </profileForm.Field>
          </FieldGroup>
        </CardContent>
        <CardFooter>
          <profileForm.Subscribe
            selector={(state) => [state.isSubmitting, state.canSubmit]}
          >
            {([isSubmitting, canSubmit]) => (
              <LoadingButton
                type="button"
                className="ml-auto"
                onClick={() => profileForm.handleSubmit()}
                isLoading={isSubmitting}
                disabled={!canSubmit}
              >
                Update Profile
              </LoadingButton>
            )}
          </profileForm.Subscribe>
        </CardFooter>
      </Card>
    </div>
  );
}
