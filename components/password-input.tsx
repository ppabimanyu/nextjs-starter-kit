"use client";

import React from "react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

const STRENGTH_LEVELS = [
  { label: "Very Weak", color: "bg-red-500", textColor: "text-red-500" },
  { label: "Weak", color: "bg-orange-500", textColor: "text-orange-500" },
  { label: "Fair", color: "bg-yellow-500", textColor: "text-yellow-500" },
  { label: "Strong", color: "bg-lime-500", textColor: "text-lime-500" },
  { label: "Very Strong", color: "bg-green-500", textColor: "text-green-500" },
];

function calculateStrength(password: string): number {
  if (!password) return 0;

  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;

  // Normalize to 0-4 range
  return Math.min(Math.floor((score / 6) * 5), 4);
}

type PasswordInputProps = {
  showStrength?: boolean;
} & React.ComponentProps<"input">;

export function PasswordInput({
  showStrength,
  className,
  ...props
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = React.useState(false);
  const passwordValue = typeof props.value === "string" ? props.value : "";
  const strength = calculateStrength(passwordValue);
  const strengthLevel = STRENGTH_LEVELS[strength] || STRENGTH_LEVELS[0];

  return (
    <div className={cn("w-full space-y-2", className)}>
      <InputGroup>
        <InputGroupInput {...props} type={showPassword ? "text" : "password"} />
        <InputGroupAddon
          align="inline-end"
          className="cursor-pointer"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <Eye /> : <EyeOff />}
        </InputGroupAddon>
      </InputGroup>

      {showStrength && passwordValue && (
        <div className="space-y-1.5">
          <div className="flex gap-1">
            {STRENGTH_LEVELS.map((level, index) => (
              <div
                key={level.label}
                className={cn(
                  "h-1.5 flex-1 rounded-full transition-all duration-300",
                  index <= strength ? strengthLevel.color : "bg-muted"
                )}
              />
            ))}
          </div>
          <p className={cn("text-xs font-medium", strengthLevel.textColor)}>
            {strengthLevel.label}
          </p>
        </div>
      )}
    </div>
  );
}
