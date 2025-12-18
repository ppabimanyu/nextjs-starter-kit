"use client";

import { ThemeProvider } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { RotateCcw, Home, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [showDetails, setShowDetails] = useState(false);
  return (
    <html>
      <body className="flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background space-y-4">
        {/* Error Code */}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="select-none text-9xl font-semibold text-destructive/50">
            500
          </div>

          {/* Content */}
          <div className="flex max-w-md flex-col items-center text-center space-y-2">
            <h1 className="text-2xl font-semibold">Something went wrong!</h1>
            <p className="text-muted-foreground">
              Oops! An unexpected error occurred. Don&apos;t worry, you can try
              again or go back to the home page.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col md:flex-row gap-3">
            <Button onClick={reset} variant={"outline"}>
              <RotateCcw className="size-4" />
              Try Again
            </Button>
            <Button variant="outline" asChild className="gap-2">
              <Link href="/">
                <Home className="size-4" />
                Go to Home
              </Link>
            </Button>
          </div>

          {(error.message || error.digest) && (
            <div className="pt-6">
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    showDetails ? "rotate-180" : ""
                  }`}
                />
                {showDetails ? "Hide" : "Show"} error details
              </button>
              {showDetails && (
                <div className="mt-4 rounded-lg border bg-muted/50 p-4 text-left">
                  {error.digest && (
                    <p className="text-sm mb-2">
                      <span className="font-medium text-foreground">
                        Error ID:{" "}
                      </span>
                      <code className="text-xs bg-muted px-1.5 py-0.5 rounded text-destructive">
                        {error.digest}
                      </code>
                    </p>
                  )}
                  {error.message && (
                    <p className="text-sm">
                      <span className="font-medium text-foreground">
                        Message:{" "}
                      </span>
                      <span className="text-muted-foreground">
                        {error.message}
                      </span>
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Footer hint */}
          <p className="absolute bottom-8 text-xs text-muted-foreground/60">
            Error Code: 500 — Internal Server Error
          </p>
        </ThemeProvider>
      </body>
    </html>
  );
}
