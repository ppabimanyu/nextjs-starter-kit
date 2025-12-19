import BillingPlan from "./billing-plan";
import BillingPayment from "./billing-payment";
import BillingHistory from "./billing-history";
import { Separator } from "@/components/ui/separator";

export default function BillingPage() {
  return (
    <div className="space-y-6 md:space-y-4">
      <BillingPlan />
      <Separator />
      <BillingPayment />
      <Separator />
      <BillingHistory />
    </div>
  );
}
