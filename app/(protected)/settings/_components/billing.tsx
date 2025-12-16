import BillingPlan from "./billing-plan";
import BillingUsage from "./billing-usage";
import BillingPayment from "./billing-payment";
import BillingHistory from "./billing-history";

export default function BillingPage() {
  return (
    <div className="space-y-6 md:space-y-4">
      <BillingPlan />
      <BillingUsage />
      <BillingPayment />
      <BillingHistory />
    </div>
  );
}
