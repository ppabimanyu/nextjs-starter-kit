"use client";

import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import {
  Smartphone,
  Monitor,
  Laptop,
  LogOut,
  Tablet,
  Tv,
  Watch,
  Gamepad2,
} from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { UAParser } from "ua-parser-js";
import LoadingButton from "@/components/loading-button";
import { useState } from "react";
import { Session } from "@/lib/auth";

function RevokeSessionDialog({
  session,
  osName,
  onSuccess,
}: {
  session: Session["session"];
  osName: string;
  onSuccess?: () => void;
}) {
  const [open, setOpen] = useState(false);

  const revokeSessionMutation = useMutation({
    mutationFn: async (token: string) => {
      const session = await authClient.revokeSession({
        token,
      });
      if (session.error) {
        throw session.error;
      }
    },
    onError: (error) => {
      toast.error(`Failed to revoke session: ${error.message}`);
    },
  });

  const handleRevokeSession = async () => {
    await revokeSessionMutation.mutateAsync(session.token);
    onSuccess?.();
    setOpen(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm">
          Revoke
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Revoke Session</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to revoke access for{" "}
            <span className="font-medium text-foreground">{osName}</span>? This
            will sign out the device from your account.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <LoadingButton
            onClick={handleRevokeSession}
            isLoading={revokeSessionMutation.isPending}
          >
            Revoke Session
          </LoadingButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function RevokeAllSessionsDialog({ onSuccess }: { onSuccess?: () => void }) {
  const [open, setOpen] = useState(false);

  const revokeOtherSessionsMutation = useMutation({
    mutationFn: async () => {
      const session = await authClient.revokeOtherSessions();
      if (session.error) {
        throw session.error;
      }
    },
    onError: (error) => {
      toast.error(`Failed to revoke other sessions: ${error.message}`);
    },
  });

  const handleRevokeAllSessions = async () => {
    await revokeOtherSessionsMutation.mutateAsync();
    onSuccess?.();
    setOpen(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="ml-auto">
          <LogOut />
          Revoke All Other Sessions
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Revoke All Other Sessions</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to revoke access for all other devices? This
            will sign out all devices except this one from your account.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <LoadingButton
            onClick={handleRevokeAllSessions}
            isLoading={revokeOtherSessionsMutation.isPending}
          >
            Revoke All Sessions
          </LoadingButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function getDeviceIcon(deviceType: string | undefined) {
  switch (deviceType) {
    case "mobile":
      return <Smartphone className="size-5" />;
    case "tablet":
      return <Tablet className="size-5" />;
    case "smarttv":
      return <Tv className="size-5" />;
    case "wearable":
      return <Watch className="size-5" />;
    case "console":
      return <Gamepad2 className="size-5" />;
    case "embedded":
      return <Monitor className="size-5" />;
    default:
      return <Laptop className="size-5" />;
  }
}

type SecuritySessionsProps = {
  session?: Session["session"];
};

export default function SecuritySessions({ session }: SecuritySessionsProps) {
  const listSessions = useQuery({
    queryKey: ["list-sessions"],
    queryFn: async () => {
      const sessions = await authClient.listSessions();
      if (sessions.error) {
        throw sessions.error;
      }
      return sessions.data;
    },
  });
  if (listSessions.error) {
    toast.error(`Failed to get sessions: ${listSessions.error.message}`);
  }

  return (
    <div className="flex flex-col md:flex-row gap-2 md:gap-4 w-full">
      <Field className="md:flex-1/3">
        <FieldLabel>Active Sessions</FieldLabel>
        <FieldDescription>
          View and manage all devices currently signed in to your account. You
          can revoke access to any session you don&apos;t recognize.
        </FieldDescription>
      </Field>
      <Card className="md:flex-2/3">
        <CardContent>
          <FieldGroup>
            {listSessions.data?.map((sess) => {
              const isCurrent = sess.id === session?.id;
              const parser = new UAParser(sess.userAgent || "");
              const browser = parser.getBrowser();
              const os = parser.getOS();
              const device = parser.getDevice();

              console.log(browser, os, device, sess);
              return (
                <Field key={sess.id}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                        {getDeviceIcon(device.type)}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <FieldLabel className="mb-0">{os.name}</FieldLabel>
                          {isCurrent && (
                            <Badge variant="secondary" className="text-xs">
                              Current
                            </Badge>
                          )}
                        </div>
                        <FieldDescription className="text-xs">
                          {browser.name} • {browser.version} •{" "}
                          {sess.createdAt.toDateString()}
                        </FieldDescription>
                      </div>
                    </div>
                    {!isCurrent && (
                      <RevokeSessionDialog
                        session={sess}
                        osName={os.name ?? "Unknown"}
                        onSuccess={() => {
                          listSessions.refetch();
                        }}
                      />
                    )}
                  </div>
                </Field>
              );
            })}
          </FieldGroup>
        </CardContent>
        <CardFooter>
          <RevokeAllSessionsDialog
            onSuccess={() => {
              listSessions.refetch();
            }}
          />
        </CardFooter>
      </Card>
    </div>
  );
}
