import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background space-y-4">
      {/* 404 Large Text */}
      <div className="select-none text-9xl font-semibold text-primary/50">
        404
      </div>

      {/* Content */}
      <div className="flex max-w-md flex-col items-center text-center space-y-2">
        <h1 className="text-2xl font-semibold">Page not found</h1>
        <p className="text-muted-foreground">
          Oops! The page you&apos;re looking for doesn&apos;t exist or has been
          moved. Let&apos;s get you back on track.
        </p>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col md:flex-row gap-3">
        <Button asChild variant={"outline"} className="gap-2">
          <Link href="/">
            <Home className="size-4" />
            Go to Home
          </Link>
        </Button>
      </div>

      {/* Footer hint */}
      <p className="absolute bottom-8 text-xs text-muted-foreground/60">
        Error Code: 404 — Not Found
      </p>
    </div>
  );
}
