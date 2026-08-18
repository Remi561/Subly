import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getCategoryStyle,
  getStatusBadgeClass,
  formatBillingCycle,
  formatCategory,
  formatDate,
  formatMoney,
  formatSiteUrl
} from "@/lib/utils";

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
import {ExternalLink} from 'lucide-react'

function DesktopTable({ subscriptions, baseCurrency }) {
  return (
    <div className="hidden rounded-2xl border border-subly-border md:block overflow-hidden">
      <Table>
        <TableHeader className="bg-subly-background">
          <TableRow className="border-subly-border hover:bg-subly-background">
            <TableHead className="min-w-40 px-6 font-semibold text-subly-text-secondary">
              Name
            </TableHead>

            <TableHead className="min-w-35 font-semibold text-subly-text-secondary">
              Category
            </TableHead>

            <TableHead className="min-w-35 font-semibold text-subly-text-secondary">
              Amount
            </TableHead>

            <TableHead className="min-w-28 font-semibold text-subly-text-secondary">
              Status
            </TableHead>

            <TableHead className="min-w-40 font-semibold text-subly-text-secondary">
              Next Billing Date
            </TableHead>

            <TableHead className="min-w-24 pr-6 text-right font-semibold text-subly-text-secondary">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody className={'h-20'}>
          {subscriptions.map((subscription) => {
            const categoryStyle = getCategoryStyle(subscription.category);
            const siteUrl = formatSiteUrl(subscription.linkToSite)
            return (
              <TableRow
                key={subscription.id}
                className="border-subly-border hover:bg-subly-soft-blue/40 h-19"
              >
                {/* 1. Name */}
                <TableCell className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                  <p className="font-semibold text-subly-text-primary capitalize">
                    {subscription.name}
                  </p>
                  {siteUrl && (
                              <a
                                href={siteUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="mt-0.5 inline-flex items-center gap-1 text-xs text-[#1565c0] hover:underline font-light"
                              >
                                {subscription.linkToSite}
                                <ExternalLink size={12} />
                                
                              </a>
                            )}
                  </div>
                  
                </TableCell>

                {/* 2. Category */}
                <TableCell>
                  <div className="flex items-center gap-1">
                    <span
                      className={`h-1 w-1 rounded-full ${categoryStyle.dot}`}
                    />
                    <span
                      className={`text-xs font-medium ${categoryStyle.text}`}
                    >
                      {formatCategory(subscription.category)}
                    </span>
                  </div>
                </TableCell>

                {/* 3. Amount */}
                <TableCell>
                  <p className="font-bold text-subly-text-primary">
                    {formatMoney(subscription.settledAmount, baseCurrency)}
                  </p>
                  <p className="mt-0.5 text-xs font-medium text-subly-text-secondary">
                    {formatMoney(subscription.amount, subscription.currency)}
                  </p>
                </TableCell>

                {/* 4. Status */}
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

                {/* 5. Next Billing Date */}
                <TableCell>
                  <p className="font-semibold text-subly-text-primary text-xs">
                    {formatDate(subscription.nextBillingDate)}
                  </p>
                </TableCell>

                {/* 6. Actions */}
                <TableCell className="pr-6 text-right">
                  <SubscriptionActions subscription={subscription} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

function MobileList({ subscriptions, baseCurrency }) {
  return (
    <div className="divide-y divide-subly-border rounded-2xl md:hidden">
      {subscriptions.map((subscription) => {
        const categoryStyle = getCategoryStyle(subscription.category);
        return (
          <div
            key={subscription.id}
            className="flex items-start justify-between gap-3 bg-subly-card p-4"
          >
            <div className="flex min-w-0 flex-1 gap-3">
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-subly-text-primary capitalize">
                  {subscription.name}
                </p>

                <div className="mt-1 flex items-center gap-2">
                  <span
                    className={`h-2 w-2 rounded-full ${categoryStyle.dot}`}
                  />
                  <span className={`text-sm font-medium ${categoryStyle.text}`}>
                    {formatCategory(subscription.category)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex shrink-0 items-start gap-3">
              <div className="text-right">
                <p className="font-bold text-subly-text-primary">
                  {formatMoney(subscription.settledAmount, baseCurrency)}
                </p>

                <p className="mt-1 text-sm font-medium text-subly-text-secondary">
                  {formatMoney(subscription.amount, subscription.currency)}
                </p>
              </div>

              <div className="flex flex-col items-center gap-2">
                <SubscriptionActions subscription={subscription} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function SubscriptionResponsiveTable({ data, baseCurrency }) {
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
            <DesktopTable
              subscriptions={data.subscriptions}
              baseCurrency={baseCurrency}
            />
            <MobileList
              subscriptions={data.subscriptions}
              baseCurrency={baseCurrency}
            />
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
