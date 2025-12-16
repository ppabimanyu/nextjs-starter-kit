"use client";

import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Card, CardContent } from "@/components/ui/card";
import { Sun, Moon, Monitor, Check } from "lucide-react";
import { useTheme } from "next-themes";

export default function AppearancePage() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="space-y-6 md:space-y-4">
      {/* Theme */}
      <div className="flex flex-col md:flex-row gap-2 md:gap-4 w-full">
        <Field className="md:flex-1/3">
          <FieldLabel>Theme</FieldLabel>
          <FieldDescription>
            Choose your preferred color scheme. System theme will automatically
            match your device settings.
          </FieldDescription>
        </Field>
        <Card className="md:flex-2/3">
          <CardContent>
            <FieldGroup>
              <Field>
                <div className="grid grid-cols-3 gap-4">
                  <button
                    type="button"
                    onClick={() => setTheme("light")}
                    className={`relative flex flex-col items-center gap-2 rounded-lg border p-4 transition-colors hover:bg-muted/50 ${
                      theme === "light"
                        ? "border-primary bg-primary/5"
                        : "border-border"
                    }`}
                  >
                    {theme === "light" && (
                      <div className="absolute top-2 right-2">
                        <Check className="h-4 w-4 text-primary" />
                      </div>
                    )}
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-100">
                      <Sun className="h-6 w-6 text-amber-600" />
                    </div>
                    <span className="text-sm font-medium">Light</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTheme("dark")}
                    className={`relative flex flex-col items-center gap-2 rounded-lg border p-4 transition-colors hover:bg-muted/50 ${
                      theme === "dark"
                        ? "border-primary bg-primary/5"
                        : "border-border"
                    }`}
                  >
                    {theme === "dark" && (
                      <div className="absolute top-2 right-2">
                        <Check className="h-4 w-4 text-primary" />
                      </div>
                    )}
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-800">
                      <Moon className="h-6 w-6 text-slate-200" />
                    </div>
                    <span className="text-sm font-medium">Dark</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTheme("system")}
                    className={`relative flex flex-col items-center gap-2 rounded-lg border p-4 transition-colors hover:bg-muted/50 ${
                      theme === "system"
                        ? "border-primary bg-primary/5"
                        : "border-border"
                    }`}
                  >
                    {theme === "system" && (
                      <div className="absolute top-2 right-2">
                        <Check className="h-4 w-4 text-primary" />
                      </div>
                    )}
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-linear-to-br from-amber-100 to-slate-800">
                      <Monitor className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-sm font-medium">System</span>
                  </button>
                </div>
              </Field>
            </FieldGroup>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
