import React from "react";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download } from "lucide-react";

interface Invoice {
  id: string;
  date: string;
  amount: string;
  status: string;
}

const invoices: Invoice[] = [
  {
    id: "INV-001",
    date: "Dec 1, 2024",
    amount: "$19.00",
    status: "Paid",
  },
  {
    id: "INV-002",
    date: "Nov 1, 2024",
    amount: "$19.00",
    status: "Paid",
  },
  {
    id: "INV-003",
    date: "Oct 1, 2024",
    amount: "$19.00",
    status: "Paid",
  },
];

export default function BillingHistory() {
  return (
    <div className="flex flex-col md:flex-row gap-2 md:gap-4 w-full">
      <Field className="md:flex-1/3">
        <FieldLabel>Billing History</FieldLabel>
        <FieldDescription>
          View and download your past invoices. All invoices are available for
          the past 12 months.
        </FieldDescription>
      </Field>
      <Card className="md:flex-2/3">
        <CardContent>
          <div className="rounded-lg border">
            <div className="grid grid-cols-4 gap-4 p-3 border-b bg-muted/50 text-xs font-medium text-muted-foreground">
              <div>Invoice</div>
              <div>Date</div>
              <div>Amount</div>
              <div className="text-right">Action</div>
            </div>
            {invoices.map((invoice) => (
              <div
                key={invoice.id}
                className="grid grid-cols-4 gap-4 p-3 border-b last:border-b-0 text-sm items-center"
              >
                <div className="font-medium">{invoice.id}</div>
                <div className="text-muted-foreground">{invoice.date}</div>
                <div className="flex items-center gap-2">
                  {invoice.amount}
                  <Badge
                    variant="secondary"
                    className="text-xs text-green-600 bg-green-50"
                  >
                    {invoice.status}
                  </Badge>
                </div>
                <div className="text-right">
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="ml-auto">
            View All Invoices
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
