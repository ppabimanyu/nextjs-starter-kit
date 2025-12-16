import React from "react";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard } from "lucide-react";

const paymentMethod = {
  type: "Visa",
  last4: "4242",
  expiry: "12/25",
};

export default function BillingPayment() {
  return (
    <div className="flex flex-col md:flex-row gap-2 md:gap-4 w-full">
      <Field className="md:flex-1/3">
        <FieldLabel>Payment Method</FieldLabel>
        <FieldDescription>
          Manage your payment method for automatic billing. We support all major
          credit cards and debit cards.
        </FieldDescription>
      </Field>
      <Card className="md:flex-2/3">
        <CardContent>
          <FieldGroup>
            <Field>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-16 items-center justify-center rounded-lg border bg-muted">
                    <CreditCard className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div className="space-y-1">
                    <FieldLabel className="mb-0">
                      {paymentMethod.type} ending in {paymentMethod.last4}
                    </FieldLabel>
                    <FieldDescription>
                      Expires {paymentMethod.expiry}
                    </FieldDescription>
                  </div>
                </div>
                <Badge variant="secondary">Default</Badge>
              </div>
            </Field>
          </FieldGroup>
        </CardContent>
        <CardFooter className="flex gap-2 justify-end">
          <Button variant="outline">Add Payment Method</Button>
          <Button variant="ghost">Update</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
