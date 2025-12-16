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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  KeyRound,
  RotateCw,
  Shield,
  ShieldCheck,
  Copy,
  Check,
  ArrowRight,
  ArrowLeft,
  Eye,
  EyeClosed,
  ShieldAlert,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PasswordInput } from "@/components/password-input";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import LoadingButton from "@/components/loading-button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import QRCode from "react-qr-code";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { Session } from "@/lib/auth";
import { env } from "@/lib/env";
import { LoadingContent } from "@/components/loading";
import {
  invalidateRecoveryCodes,
  useGetRecoveryCodes,
} from "@/lib/api/auth/2fa/get-recovery-code";

type Step = "password" | "setup-totp" | "verify";

function Enable2FADialog() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [step, setStep] = useState<Step>("password");
  const [totpUri, setTotpUri] = useState<string>("");
  const [totpSecret, setTotpSecret] = useState<string>("");

  // Password verification form
  const passwordForm = useForm({
    defaultValues: {
      password: "",
    },
    validators: {
      onSubmit: z.object({
        password: z.string().min(1, "Password is required"),
      }),
    },
    onSubmit: async ({ value }) => {
      const { error, data } = await authClient.twoFactor.enable({
        password: value.password.trim(),
        issuer: env.NEXT_PUBLIC_APP_NAME,
      });
      if (error) {
        toast.error(`Failed to enable 2FA: ${error.message}`);
      } else {
        const urlParams = new URLSearchParams(data.totpURI.split("?")[1]);
        const secret = urlParams.get("secret") ?? "";

        setTotpUri(data.totpURI);
        setTotpSecret(secret);
        setStep("setup-totp");
      }
    },
  });

  // TOTP verification form
  const verifyForm = useForm({
    defaultValues: {
      code: "",
    },
    validators: {
      onSubmit: z.object({
        code: z.string().length(6, "Code must be exactly 6 digits"),
      }),
    },
    onSubmit: async ({ value }) => {
      const { error } = await authClient.twoFactor.verifyTotp({
        code: value.code,
        trustDevice: false,
      });
      if (error) {
        toast.error(`Failed to verify 2FA: ${error.message}`);
      } else {
        toast.success("2FA enabled successfully");
        handleOpenChange(false);
      }
    },
  });

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      passwordForm.reset();
      verifyForm.reset();
      setCopied(false);
      setStep("password");
      setTotpUri("");
      setTotpSecret("");
    }
  };

  const handleCopySecret = async () => {
    await navigator.clipboard.writeText(totpSecret);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="ml-auto">
          <ShieldCheck />
          Enable 2FA
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        {/* Step 1: Password Verification */}
        {step === "password" && (
          <>
            <DialogHeader>
              <DialogTitle>Verify Your Identity</DialogTitle>
              <DialogDescription>
                Enter your password to continue setting up two-factor
                authentication.
              </DialogDescription>
            </DialogHeader>
            <FieldGroup>
              <passwordForm.Field name="password">
                {(field) => (
                  <Field>
                    <FieldLabel htmlFor="2fa-password">Password</FieldLabel>
                    <PasswordInput
                      id="2fa-password"
                      placeholder="Enter your password"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      autoComplete="current-password"
                    />
                    <FieldError errors={field.state.meta.errors} />
                  </Field>
                )}
              </passwordForm.Field>
            </FieldGroup>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <passwordForm.Subscribe
                selector={(state) => [state.isSubmitting, state.canSubmit]}
              >
                {([isSubmitting, canSubmit]) => (
                  <LoadingButton
                    type="button"
                    onClick={() => passwordForm.handleSubmit()}
                    isLoading={isSubmitting}
                    disabled={!canSubmit}
                  >
                    Continue
                    <ArrowRight />
                  </LoadingButton>
                )}
              </passwordForm.Subscribe>
            </DialogFooter>
          </>
        )}

        {/* Step 2: QR Code Display */}
        {step === "setup-totp" && (
          <>
            <DialogHeader>
              <DialogTitle>Set Up Authenticator</DialogTitle>
              <DialogDescription>
                Scan this QR code with your authenticator app (Google
                Authenticator, Authy, etc.) or enter the secret key manually.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col items-center gap-4">
              {/* QR Code */}
              <div className="bg-white p-4 rounded-lg">
                <QRCode value={totpUri} size={180} />
              </div>

              {/* Secret Key */}
              <Field className="w-full">
                <FieldLabel>Secret Key</FieldLabel>
                <div className="flex gap-2">
                  <InputGroup>
                    <InputGroupInput placeholder={totpSecret} readOnly />
                    <InputGroupAddon align="inline-end">
                      <InputGroupButton
                        aria-readonly
                        aria-label="Copy"
                        title="Copy"
                        size="icon-xs"
                        onClick={handleCopySecret}
                        value={totpSecret}
                      >
                        {copied ? <Check /> : <Copy />}
                      </InputGroupButton>
                    </InputGroupAddon>
                  </InputGroup>
                </div>
                <FieldDescription>
                  If you can&apos;t scan the QR code, enter this key manually in
                  your authenticator app.
                </FieldDescription>
              </Field>
            </div>
            <DialogFooter>
              <Button onClick={() => setStep("verify")}>
                Continue
                <ArrowRight />
              </Button>
            </DialogFooter>
          </>
        )}

        {/* Step 3: Code Verification */}
        {step === "verify" && (
          <>
            <DialogHeader>
              <DialogTitle>Verify Authentication Code</DialogTitle>
              <DialogDescription>
                Enter the 6-digit code from your authenticator app to complete
                the setup.
              </DialogDescription>
            </DialogHeader>
            <FieldGroup>
              <verifyForm.Field name="code">
                {(field) => (
                  <Field>
                    <InputOTP
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
              </verifyForm.Field>
            </FieldGroup>
            <DialogFooter>
              <Button variant="outline" onClick={() => setStep("setup-totp")}>
                <ArrowLeft />
                Back
              </Button>
              <verifyForm.Subscribe
                selector={(state) => [state.isSubmitting, state.canSubmit]}
              >
                {([isSubmitting, canSubmit]) => (
                  <LoadingButton
                    type="button"
                    onClick={() => verifyForm.handleSubmit()}
                    isLoading={isSubmitting}
                    disabled={!canSubmit}
                  >
                    <ShieldCheck />
                    Verify
                  </LoadingButton>
                )}
              </verifyForm.Subscribe>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Disable2FADialog() {
  const [open, setOpen] = useState(false);

  // Password verification form
  const passwordForm = useForm({
    defaultValues: {
      password: "",
    },
    validators: {
      onSubmit: z.object({
        password: z.string().min(1, "Password is required"),
      }),
    },
    onSubmit: async ({ value }) => {
      const { error } = await authClient.twoFactor.disable({
        password: value.password.trim(),
      });
      if (error) {
        toast.error(`Failed to disable 2FA: ${error.message}`);
      } else {
        toast.success("2FA disabled successfully");
        handleOpenChange(false);
      }
    },
  });

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      passwordForm.reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="ml-auto" variant="destructive">
          <ShieldAlert />
          Disable 2FA
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Verify Your Identity</DialogTitle>
          <DialogDescription>
            Enter your password to disable two-factor authentication.
          </DialogDescription>
        </DialogHeader>
        <FieldGroup>
          <passwordForm.Field name="password">
            {(field) => (
              <Field>
                <FieldLabel htmlFor="2fa-password">Password</FieldLabel>
                <PasswordInput
                  id="2fa-password"
                  placeholder="Enter your password"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  autoComplete="current-password"
                />
                <FieldError errors={field.state.meta.errors} />
              </Field>
            )}
          </passwordForm.Field>
        </FieldGroup>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <passwordForm.Subscribe
            selector={(state) => [state.isSubmitting, state.canSubmit]}
          >
            {([isSubmitting, canSubmit]) => (
              <LoadingButton
                type="button"
                variant="destructive"
                onClick={() => passwordForm.handleSubmit()}
                isLoading={isSubmitting}
                disabled={!canSubmit}
              >
                <ShieldAlert />
                Disable 2FA
              </LoadingButton>
            )}
          </passwordForm.Subscribe>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function GenerateRecoveryCodesDialog() {
  const [open, setOpen] = useState(false);

  // Password verification form
  const passwordForm = useForm({
    defaultValues: {
      password: "",
    },
    validators: {
      onSubmit: z.object({
        password: z.string().min(1, "Password is required"),
      }),
    },
    onSubmit: async ({ value }) => {
      const { error } = await authClient.twoFactor.generateBackupCodes({
        password: value.password.trim(),
      });
      if (error) {
        toast.error(`Failed to generate recovery codes: ${error.message}`);
      } else {
        toast.success("Recovery codes generated successfully");
        await invalidateRecoveryCodes();
        handleOpenChange(false);
      }
    },
  });

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      passwordForm.reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="ml-auto" variant={"outline"}>
          <RotateCw />
          Generate Recovery Codes
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Verify Your Identity</DialogTitle>
          <DialogDescription>
            Enter your password to generate recovery codes.
          </DialogDescription>
        </DialogHeader>
        <FieldGroup>
          <passwordForm.Field name="password">
            {(field) => (
              <Field>
                <FieldLabel htmlFor="2fa-password">Password</FieldLabel>
                <PasswordInput
                  id="2fa-password"
                  placeholder="Enter your password"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  autoComplete="current-password"
                />
                <FieldError errors={field.state.meta.errors} />
              </Field>
            )}
          </passwordForm.Field>
        </FieldGroup>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <passwordForm.Subscribe
            selector={(state) => [state.isSubmitting, state.canSubmit]}
          >
            {([isSubmitting, canSubmit]) => (
              <LoadingButton
                type="button"
                onClick={() => passwordForm.handleSubmit()}
                isLoading={isSubmitting}
                disabled={!canSubmit}
              >
                <RotateCw />
                Generate
              </LoadingButton>
            )}
          </passwordForm.Subscribe>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function RecoveryCodes() {
  const [copied, setCopied] = useState(false);
  const recoveryCodes = useGetRecoveryCodes();
  if (recoveryCodes.isPending) {
    return <LoadingContent />;
  }

  const handleCopyCodes = async () => {
    const codesText = recoveryCodes.data?.join("\n");
    await navigator.clipboard.writeText(codesText ?? "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadCodes = () => {
    const codesText = `Recovery Codes for MyApp\n${"=".repeat(
      30
    )}\n\nKeep these codes in a safe place. Each code can only be used once.\n\n${recoveryCodes?.data
      ?.map((code, i) => `${i + 1}. ${code}`)
      .join("\n")}\n\nGenerated: ${new Date().toLocaleString()}`;
    const blob = new Blob([codesText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "recovery-codes.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="rounded-lg border bg-muted/50 p-4 w-full space-y-4">
      <div className="flex justify-end">
        <GenerateRecoveryCodesDialog />
      </div>
      <div className="grid grid-cols-2 gap-2 font-mono text-sm">
        {recoveryCodes.data?.map((code, index) => (
          <div
            key={index}
            className="bg-background rounded px-3 py-2 text-center"
          >
            {code}
          </div>
        ))}
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={handleCopyCodes}>
          {copied ? <Check className="text-green-500" /> : <Copy />}
          {copied ? "Copied!" : "Copy All"}
        </Button>
        <Button variant="outline" size="sm" onClick={handleDownloadCodes}>
          Download
        </Button>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        Each code can only be used once. Store them securely and don&apos;t
        share them with anyone.
      </p>
    </div>
  );
}

type Security2FAProps = {
  user: Session["user"];
};

export default function Security2FA({ user }: Security2FAProps) {
  const [showCodes, setShowCodes] = useState(false);

  return (
    <div className="flex flex-col md:flex-row gap-2 md:gap-4 w-full">
      <Field className="md:flex-1/3">
        <FieldLabel>Two-Factor Authentication</FieldLabel>
        <FieldDescription>
          Add an extra layer of security to your account by requiring a
          verification code in addition to your password when signing in.
        </FieldDescription>
      </Field>
      <Card className="md:flex-2/3">
        <CardContent>
          <FieldGroup>
            <Field>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <FieldLabel className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Authenticator App
                  </FieldLabel>
                  <FieldDescription>
                    Use an authenticator app like Google Authenticator or Authy
                    to generate verification codes.
                  </FieldDescription>
                </div>
                {user.twoFactorEnabled ? (
                  <Badge variant="default">Enabled</Badge>
                ) : (
                  <Badge variant="destructive">Disabled</Badge>
                )}
              </div>
            </Field>
            {user.twoFactorEnabled && (
              <Field>
                <div className="flex flex-col gap-3">
                  <div className="flex md:flex-row flex-col md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <FieldLabel className="flex items-center gap-2">
                        <KeyRound className="h-4 w-4" />
                        Recovery Codes
                      </FieldLabel>
                      <FieldDescription>
                        Generate backup codes to access your account if you lose
                        your 2FA device. Store these codes securely.
                      </FieldDescription>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowCodes(!showCodes)}
                    >
                      {showCodes ? <Eye /> : <EyeClosed />}
                      {showCodes ? "Hide" : "Show"}
                    </Button>
                  </div>
                  {showCodes && <RecoveryCodes />}
                </div>
              </Field>
            )}
          </FieldGroup>
        </CardContent>
        <CardFooter>
          {user.twoFactorEnabled ? <Disable2FADialog /> : <Enable2FADialog />}
        </CardFooter>
      </Card>
    </div>
  );
}
