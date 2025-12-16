import { Button, buttonVariants } from "./ui/button";
import { VariantProps } from "class-variance-authority";
import { Spinner } from "./ui/spinner";

type LoadingButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  } & {
    isLoading?: boolean;
  };

export default function LoadingButton({
  children,
  isLoading,
  ...props
}: LoadingButtonProps) {
  return (
    <Button disabled={isLoading || props.disabled} {...props}>
      {children} {isLoading && <Spinner />}
    </Button>
  );
}
