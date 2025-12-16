import React from "react";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Sparkles, Zap, Crown, LucideIcon } from "lucide-react";

interface Plan {
  name: string;
  price: string;
  period: string;
  icon: LucideIcon;
  current: boolean;
  popular?: boolean;
  features: string[];
}

const plans: Plan[] = [
  {
    name: "Free",
    price: "$0",
    period: "month",
    icon: Zap,
    current: false,
    features: ["3 projects", "Basic analytics", "Community support"],
  },
  {
    name: "Pro",
    price: "$19",
    period: "month",
    icon: Sparkles,
    current: true,
    popular: true,
    features: [
      "Unlimited projects",
      "Advanced analytics",
      "Priority support",
      "Custom integrations",
    ],
  },
  {
    name: "Enterprise",
    price: "$99",
    period: "month",
    icon: Crown,
    current: false,
    features: [
      "Everything in Pro",
      "Dedicated support",
      "SLA guarantee",
      "Custom contracts",
    ],
  },
];

export default function BillingPlan() {
  return (
    <div className="flex flex-col md:flex-row gap-2 md:gap-4 w-full">
      <Field className="md:flex-1/3">
        <FieldLabel>Current Plan</FieldLabel>
        <FieldDescription>
          View your current subscription plan and explore available upgrades.
          You can change your plan at any time.
        </FieldDescription>
      </Field>
      <Card className="md:flex-2/3">
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-lg border p-4 ${
                  plan.current ? "border-primary bg-primary/5" : "border-border"
                }`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-2 right-2 text-xs">
                    Popular
                  </Badge>
                )}
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                      plan.current ? "bg-primary/10" : "bg-muted"
                    }`}
                  >
                    <plan.icon
                      className={`h-4 w-4 ${
                        plan.current ? "text-primary" : "text-muted-foreground"
                      }`}
                    />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">{plan.name}</h3>
                  </div>
                </div>
                <div className="mb-3">
                  <span className="text-2xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground text-sm">
                    /{plan.period}
                  </span>
                </div>
                <ul className="space-y-1.5 mb-4">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-2 text-xs text-muted-foreground"
                    >
                      <CheckCircle2 className="h-3 w-3 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  variant={plan.current ? "outline" : "default"}
                  size="sm"
                  className="w-full"
                  disabled={plan.current}
                >
                  {plan.current ? "Current Plan" : "Upgrade"}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
