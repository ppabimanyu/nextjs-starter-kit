import { FieldDescription } from "@/components/ui/field";
import React from "react";

export default function Legal() {
  return (
    <FieldDescription className="px-6 text-center">
      By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
      and <a href="#">Privacy Policy</a>.
    </FieldDescription>
  );
}
