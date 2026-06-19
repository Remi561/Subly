

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCategoryDotClass, getCategoryTextClass, getStatusBadgeClass, formatBillingCycle, formatCategory, formatDate, formatMoney } from '@/lib/utils'


import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";
import { SubscriptionActions } from "./SubscriptionAction";









function SubscriptionLogo({ subscription }) {
  return (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-subly-border bg-subly-background">
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



function DesktopTable({ subscriptions, baseCurrency }) {
  return (
    <div className="hidden overflow-hidden rounded-2xl border border-subly-border lg:block">
      <Table>
        <TableHeader className="bg-subly-background">
          <TableRow className="border-subly-border hover:bg-subly-background">
            <TableHead className="min-w-55 px-6 text-subly-text-secondary">
              Subscription
            </TableHead>

            <TableHead className="min-w-37.5 text-subly-text-secondary">
              Category
            </TableHead>

            <TableHead className="min-w-27.5 text-subly-text-secondary">
              Billing
            </TableHead>

            <TableHead className="min-w-40 text-subly-text-secondary">
              Next Billing
            </TableHead>

            <TableHead className="min-w-35 text-subly-text-secondary">
              Amount
            </TableHead>

            <TableHead className="min-w-27.5 text-subly-text-secondary">
              Status
            </TableHead>

            <TableHead className="min-w-22.5 pr-6 text-right text-subly-text-secondary">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {subscriptions.map((subscription) => (
            <TableRow
              key={subscription.id}
              className="border-subly-border hover:bg-subly-soft-blue/40"
            >
              <TableCell className="px-6 py-5">
                <div className="flex items-center gap-3">
                  <SubscriptionLogo subscription={subscription} />

                  <div>
                    <p className="font-semibold text-subly-text-primary capitalize">
                      {subscription.name}
                    </p>

                    
                  </div>
                </div>
              </TableCell>

              <TableCell>
                <div className="flex items-center gap-2">
                  <span
                    className={`h-2 w-2 rounded-full ${getCategoryDotClass(
                      subscription.category,
                    )}`}
                  />

                  <span
                    className={`text-sm font-medium ${getCategoryTextClass(
                      subscription.category,
                    )}`}
                  >
                    {formatCategory(subscription.category)}
                  </span>
                </div>
              </TableCell>

              <TableCell className="font-medium text-subly-text-primary">
                {formatBillingCycle(subscription.billingCycle)}
              </TableCell>

              <TableCell>
                <p className="font-semibold text-subly-text-primary">
                  {formatDate(subscription.nextBillingDate)}
                </p>

                
              </TableCell>

              <TableCell>
                <p className="font-bold text-subly-text-primary">
                  {formatMoney(
                    subscription.settledAmount,
                    baseCurrency,
                  )}
                </p>

                <p className="mt-1 text-xs font-medium text-subly-text-secondary">
                  {formatMoney(
                    subscription.amount,
                    subscription.currency,
                  )}
                </p>
              </TableCell>

              <TableCell>
                <Badge
                  variant="outline"
                  className={`rounded-full px-3 py-1 font-semibold ${getStatusBadgeClass(
                    subscription.status,
                  )}`}
                >
                  {formatBillingCycle(subscription.status)}
                </Badge>
              </TableCell>

              <TableCell className="pr-6 text-right">
                <SubscriptionActions subscription={subscription} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function MobileList({ subscriptions, baseCurrency }) {
  return (
    <div className="divide-y divide-subly-border rounded-2xl lg:hidden">
      {subscriptions.map((subscription) => (
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
                  className={`h-2 w-2 rounded-full ${getCategoryDotClass(
                    subscription.category,
                  )}`}
                />

                <span
                  className={`text-sm font-medium ${getCategoryTextClass(
                    subscription.category,
                  )}`}
                >
                  {formatCategory(subscription.category)}
                </span>
              </div>

            
            </div>
          </div>

          <div className="flex shrink-0 items-start gap-2">
            <div className="text-right">
              <p className="font-bold text-subly-text-primary">
                {formatMoney(
                  subscription.settledAmount,
                  baseCurrency,
                )}
              </p>

              <p className="mt-1 text-sm font-medium text-subly-text-secondary">
                {formatMoney(
                  subscription.amount,
                  subscription.currency,
                )}
              </p>
            </div>

            <div className="flex flex-col items-center gap-2">
              <SubscriptionActions subscription={subscription} />

          
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}



// function getFilterCount(subscriptions, filterValue) {
//   return getFilteredSubscriptions(subscriptions, filterValue).length;
// }

export function SubscriptionResponsiveTable({ data , baseCurrency}) {
  



 

  return (
    <Card className="rounded-3xl md:border-subly-border bg-subly-card md:shadow-sm mt-6">
      <CardHeader className="border-b border-subly-border">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-xl font-bold text-subly-text-primary">
            Your Subscriptions
          </CardTitle>

          
        </div>

        
      </CardHeader>

      <CardContent className="p-4 sm:p-5">
        {data?.subscriptions && data?.subscriptions?.length > 0 ? (
          <>
            <DesktopTable subscriptions={data.subscriptions} baseCurrency={baseCurrency} />
            <MobileList subscriptions={data.subscriptions} baseCurrency={baseCurrency} />
          </>
        ) : (
          <div className="rounded-2xl border border-dashed border-subly-border bg-subly-background px-4 py-10 text-center">
            <p className="font-semibold text-subly-text-primary">
              No subscriptions found
            </p>
            <p className="mt-1 text-sm text-subly-text-secondary">
              Try changing the filter or add a new subscription.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
