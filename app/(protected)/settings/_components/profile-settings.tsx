"use client";

import React, { useRef, useState } from "react";
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(user?.image ?? "");

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Invalid file type. Allowed: JPG, PNG, GIF, WebP");
      return;
    }

    // Validate file size (800KB)
    if (file.size > 800 * 1024) {
      toast.error("File too large. Maximum size is 800KB");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload/avatar", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to upload avatar");
      }

      setAvatarUrl(data.url);
      toast.success("Avatar uploaded successfully");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to upload avatar"
      );
    } finally {
      setIsUploading(false);
      // Reset input so the same file can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveAvatar = async () => {
    if (!avatarUrl) return;

    setIsRemoving(true);
    try {
      const response = await fetch("/api/upload/avatar", {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to remove avatar");
      }

      setAvatarUrl("");
      toast.success("Avatar removed successfully");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to remove avatar"
      );
    } finally {
      setIsRemoving(false);
    }
  };

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
                  <AvatarImage
                    src={avatarUrl}
                    alt={user?.name}
                    key={avatarUrl}
                  />
                  <AvatarFallback>
                    {user?.name?.slice(0, 2).toUpperCase() ?? "??"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                      className="hidden"
                    />
                    <LoadingButton
                      type="button"
                      onClick={handleUploadClick}
                      disabled={isUploading || isRemoving}
                      isLoading={isUploading}
                    >
                      Upload
                    </LoadingButton>
                    <LoadingButton
                      type="button"
                      variant="ghost"
                      onClick={handleRemoveAvatar}
                      disabled={!avatarUrl || isUploading || isRemoving}
                      isLoading={isRemoving}
                    >
                      Remove
                    </LoadingButton>
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
