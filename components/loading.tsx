import { Spinner } from "./ui/spinner";

export function LoadingContent() {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <Spinner className="size-8" />
    </div>
  );
}

export function Loading() {
  return (
    <div className="w-full min-h-screen flex items-center justify-center">
      <LoadingContent />
    </div>
  );
}
