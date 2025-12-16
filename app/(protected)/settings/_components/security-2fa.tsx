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
import { Input } from "@/components/ui/input";
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

type Step = "password" | "qrcode" | "verify";

// Simulated secret key for demo purposes
const DEMO_SECRET = "JBSWY3DPEHPK3PXP";
const DEMO_OTP_URI = `otpauth://totp/MyApp:user@example.com?secret=${DEMO_SECRET}&issuer=MyApp`;

function Enable2FADialog({ onSuccess }: { onSuccess?: () => void }) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("password");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

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
    onSubmit: async () => {
      setIsLoading(true);
      // Simulate password verification API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsLoading(false);
      setStep("qrcode");
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
    onSubmit: async () => {
      setIsLoading(true);
      // Simulate TOTP verification API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsLoading(false);
      setOpen(false);
      resetDialog();
      onSuccess?.();
    },
  });

  const resetDialog = () => {
    setStep("password");
    passwordForm.reset();
    verifyForm.reset();
    setCopied(false);
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      resetDialog();
    }
  };

  const handleCopySecret = async () => {
    await navigator.clipboard.writeText(DEMO_SECRET);
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
                    isLoading={isSubmitting || isLoading}
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
        {step === "qrcode" && (
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
                <QRCode value={DEMO_OTP_URI} size={180} />
              </div>

              {/* Secret Key */}
              <Field className="w-full">
                <FieldLabel>Secret Key</FieldLabel>
                <div className="flex gap-2">
                  <InputGroup>
                    <InputGroupInput
                      placeholder="https://x.com/shadcn"
                      readOnly
                    />
                    <InputGroupAddon align="inline-end">
                      <InputGroupButton
                        aria-readonly
                        aria-label="Copy"
                        title="Copy"
                        size="icon-xs"
                        onClick={handleCopySecret}
                        value={DEMO_SECRET}
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
              <Button variant="outline" onClick={() => setStep("qrcode")}>
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
                    isLoading={isSubmitting || isLoading}
                    disabled={!canSubmit}
                  >
                    <ShieldCheck />
                    Enable 2FA
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

// Generate random recovery codes
function generateRecoveryCodes(): string[] {
  const codes: string[] = [];
  for (let i = 0; i < 10; i++) {
    const code = Array.from({ length: 10 }, () =>
      "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".charAt(
        Math.floor(Math.random() * 36)
      )
    ).join("");
    // Format as XXXXX-XXXXX
    codes.push(`${code.slice(0, 5)}-${code.slice(5)}`);
  }
  return codes;
}

export default function Security2FA() {
  const [showCodes, setShowCodes] = useState(false);
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateCodes = async () => {
    setIsGenerating(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    const newCodes = generateRecoveryCodes();
    setRecoveryCodes(newCodes);
    setShowCodes(true);
    setIsGenerating(false);
  };

  const handleCopyCodes = async () => {
    const codesText = recoveryCodes.join("\n");
    await navigator.clipboard.writeText(codesText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadCodes = () => {
    const codesText = `Recovery Codes for MyApp\n${"=".repeat(
      30
    )}\n\nKeep these codes in a safe place. Each code can only be used once.\n\n${recoveryCodes
      .map((code, i) => `${i + 1}. ${code}`)
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
                <Badge variant="destructive">Disabled</Badge>
              </div>
            </Field>
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
                  <div className="flex gap-2">
                    {recoveryCodes.length > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowCodes(!showCodes)}
                      >
                        {showCodes ? <Eye /> : <EyeClosed />}
                        {showCodes ? "Hide" : "Show"}
                      </Button>
                    )}
                    <LoadingButton
                      variant="outline"
                      size="sm"
                      onClick={handleGenerateCodes}
                      isLoading={isGenerating}
                    >
                      <RotateCw />
                      {recoveryCodes.length > 0 ? "Regenerate" : "Generate"}
                    </LoadingButton>
                  </div>
                </div>

                {/* Recovery Codes Display */}
                {showCodes && recoveryCodes.length > 0 && (
                  <div className="rounded-lg border bg-muted/50 p-4">
                    <div className="grid grid-cols-2 gap-2 font-mono text-sm">
                      {recoveryCodes.map((code, index) => (
                        <div
                          key={index}
                          className="bg-background rounded px-3 py-2 text-center"
                        >
                          {code}
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCopyCodes}
                      >
                        {copied ? (
                          <Check className="text-green-500" />
                        ) : (
                          <Copy />
                        )}
                        {copied ? "Copied!" : "Copy All"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDownloadCodes}
                      >
                        Download
                      </Button>
                    </div>
                    <p className="mt-3 text-xs text-muted-foreground">
                      Each code can only be used once. Store them securely and
                      don&apos;t share them with anyone.
                    </p>
                  </div>
                )}
              </div>
            </Field>
          </FieldGroup>
        </CardContent>
        <CardFooter>
          <Enable2FADialog />
        </CardFooter>
      </Card>
    </div>
  );
}
