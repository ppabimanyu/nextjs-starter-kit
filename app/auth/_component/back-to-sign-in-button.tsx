import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export function BackToSignInButton() {
  return (
    <div className="text-center">
      <Link
        href="/auth/sign-in"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="size-4" />
        Back to Sign In
      </Link>
    </div>
  );
}
