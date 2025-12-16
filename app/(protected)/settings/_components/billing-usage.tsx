import React from "react";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const usage = {
  storage: {
    used: 7.5,
    total: 10,
    unit: "GB",
  },
  apiCalls: {
    used: 8500,
    total: 10000,
    unit: "calls",
  },
};

export default function BillingUsage() {
  return (
    <div className="flex flex-col md:flex-row gap-2 md:gap-4 w-full">
      <Field className="md:flex-1/3">
        <FieldLabel>Usage</FieldLabel>
        <FieldDescription>
          Monitor your resource usage for the current billing period. Usage
          resets at the start of each billing cycle.
        </FieldDescription>
      </Field>
      <Card className="md:flex-2/3">
        <CardContent>
          <FieldGroup>
            <Field>
              <div className="flex items-center justify-between mb-2">
                <FieldLabel className="mb-0">Storage</FieldLabel>
                <span className="text-sm text-muted-foreground">
                  {usage.storage.used} / {usage.storage.total}{" "}
                  {usage.storage.unit}
                </span>
              </div>
              <Progress
                value={(usage.storage.used / usage.storage.total) * 100}
                className="h-2"
              />
              <FieldDescription>
                Storage space used for your files, assets, and backups.
              </FieldDescription>
            </Field>
            <Field>
              <div className="flex items-center justify-between mb-2">
                <FieldLabel className="mb-0">API Calls</FieldLabel>
                <span className="text-sm text-muted-foreground">
                  {usage.apiCalls.used.toLocaleString()} /{" "}
                  {usage.apiCalls.total.toLocaleString()} {usage.apiCalls.unit}
                </span>
              </div>
              <Progress
                value={(usage.apiCalls.used / usage.apiCalls.total) * 100}
                className="h-2"
              />
              <FieldDescription>
                API requests made this billing period. Overage charges may apply
                if exceeded.
              </FieldDescription>
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>
    </div>
  );
}
