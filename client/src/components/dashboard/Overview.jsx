
import { ChevronRight } from "lucide-react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { formatMoney, formatDate, getStatusStyle, formatCategory, formatBillingCycle, getCategoryStyle } from "@/lib/utils";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";


import { Badge } from "@/components/ui/badge";



















function SubscriptionLogo({ subscription }) {
  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-subly-border bg-subly-background">
      {subscription.logoUrl ? (
        <img
          src={subscription.logoUrl}
          alt={subscription.name}
          className="h-full w-full object-cover"
        />
      ) : (
        <span className="text-sm font-bold text-subly-brand-blue">
          {subscription.name.charAt(0)}
        </span>
      )}
    </div>
  );
}

function Desktop({subscriptions, baseCurrency}) {
    return (
      <div className="hidden overflow-hidden rounded-2xl border border-subly-border md:block">
        {subscriptions?.length > 0 ? (<Table>
          <TableHeader>
            <TableRow className="border-subly-border bg-subly-card hover:bg-subly-card">
              <TableHead className="min-w-[220px] px-7 py-5 text-subly-text-secondary">
                Subscription
              </TableHead>
              <TableHead className="min-w-[160px] text-subly-text-secondary">
                Category
              </TableHead>
              <TableHead className="min-w-[120px] text-subly-text-secondary">
                Billing
              </TableHead>

              <TableHead className="min-w-32.5 text-subly-text-secondary">
                Amount
              </TableHead>
              <TableHead className="min-w-[120px] text-subly-text-secondary">
                Status
              </TableHead>
              <TableHead className="min-w-42.5 text-subly-text-secondary">
                Next Billing
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {subscriptions.map((subscription) => {
              const categoryStyle = getCategoryStyle(subscription.category);

              return (
                <TableRow
                  key={subscription.id}
                  className="border-subly-border hover:bg-subly-background/70"
                >
                  <TableCell className="px-7 py-5">
                    <div className="flex items-center gap-4">
                      <SubscriptionLogo subscription={subscription} />

                      <div>
                        <p className="font-semibold text-subly-text-primary capitalize">
                          {subscription.name}
                        </p>

                        <p className="mt-1 text-xs text-subly-text-secondary lg:hidden">
                          {formatCategory(subscription.category)}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span
                        className={`h-2 w-2 rounded-full ${categoryStyle.dot}`}
                      />

                      <span
                        className={`text-sm font-medium ${categoryStyle.text}`}
                      >
                        {formatCategory(subscription.category)}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="font-medium text-subly-text-primary">
                    {formatBillingCycle(subscription.billingCycle)}
                  </TableCell>

                  <TableCell>
                    <p className="font-bold text-subly-text-primary">
                      {formatMoney(
                        subscription.settledAmount,
                        baseCurrency
                      )}
                    </p>

                    <p className="mt-1 text-xs font-medium text-subly-text-secondary">
                      {formatMoney(subscription.amount, subscription.currency)}
                    </p>
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`rounded-full px-3 py-1 font-semibold ${getStatusStyle(
                        subscription.status,
                      )}`}
                    >
                      {formatBillingCycle(subscription.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <p className="font-semibold text-subly-text-primary">
                      {formatDate(subscription.nextBillingDate)}
                    </p>

                    
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      ) : (
        <p className="p-4 text-center text-sm font-medium text-subly-text-secondary"> No subscriptions found</p>
      )}
    </div>
  );
}

function Mobile({subscriptions, baseCurrency}) {
    return (
      <div className="divide-y divide-subly-border rounded-2xl border border-subly-border md:hidden">
        {subscriptions && subscriptions.length > 0 ? (
          subscriptions.map((subscription) => {
                const categoryColor = getCategoryStyle(subscription.category)
                return (
                  <div
                    key={subscription.id}
                    className="flex items-start justify-between gap-3 bg-subly-card p-4"
                  >
                    <div className="flex min-w-0 flex-1 gap-3">
                      <SubscriptionLogo subscription={subscription} />

                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold text-subly-text-primary capitalize">
                          {subscription.name}
                        </p>

                        <div className="mt-1 flex items-center gap-2">
                          <span
                            className={`h-2 w-2 rounded-full ${categoryColor.dot}`}
                          />
                          <span className={`text-sm font-medium  ${categoryColor.text}`}>
                            {formatCategory(subscription.category)}
                          </span>
                        </div>

                        
                      </div>
                    </div>

                    <div className="flex shrink-0 items-start gap-3">
                      <div className="text-right">
                        <p className="font-bold text-subly-text-primary">
                          {formatMoney(
                            subscription.settledAmount,
                            baseCurrency
                          )}
                        </p>

                        <p className="mt-1 text-sm font-medium text-subly-text-secondary">
                          {formatMoney(
                            subscription.amount,
                            subscription.currency,
                          )}
                        </p>
                      </div>

                      <ChevronRight
                        size={18}
                        className="mt-1 text-subly-text-secondary"
                      />
                    </div>
                  </div>
                );
            })
        ) : (
            <p className="p-4 text-center text-sm font-medium text-subly-text-secondary"> No subscriptions found</p>
            )}
      </div>
    );
}

export function OverviewTable({ subscriptions, baseCurrency }) {
  // ensure we always have an array to pass down to Desktop/Mobile



  return (
    <Card className="rounded-3xl border-subly-border bg-subly-card shadow-sm mt-6">
     
      <CardTitle className="text-xl font-bold text-subly-text-primary pl-3">
        Your Subscriptions
      </CardTitle>

      <CardContent className="p-0">
        <Desktop subscriptions={subscriptions} baseCurrency={baseCurrency} />
        <Mobile subscriptions={subscriptions} baseCurrency={baseCurrency} />
      </CardContent>
    </Card>
  );
}
