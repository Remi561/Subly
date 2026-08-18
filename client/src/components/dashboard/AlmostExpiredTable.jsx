import { ExternalLink, AlertTriangle, Calendar } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  formatMoney,
  formatSiteUrl,
  formatDate,
  getStatusStyle,
  formatCategory,
  formatBillingCycle,
  getCategoryStyle,
} from "@/lib/utils";





export function AlmostExpiredTable({ subscriptions, baseCurrency }) {
  const displaySubs = Array.isArray(subscriptions) ? subscriptions : [];

  return (
    <Card className="rounded-2xl border border-slate-200/80 bg-white shadow-md">
      <CardHeader className="flex flex-row items-center justify-between gap-4 pb-4">
        <div>
          <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-[#e31b23]" />
            Almost Expired Subscriptions
          </CardTitle>

          <CardDescription className="mt-1 text-sm text-slate-500">
            Subscriptions that are expired or renewing soon requiring attention
          </CardDescription>
        </div>

        <Badge variant="outline" className="border-[#e31b23]/30 bg-red-50 text-[#e31b23] font-semibold">
          {displaySubs.length} Expiring / Due
        </Badge>
      </CardHeader>

      <CardContent className="p-0">
        {displaySubs.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-200 bg-slate-50 hover:bg-slate-50">
                  <TableHead className="min-w-[100px] px-6 py-4 font-semibold text-slate-700">
                    Name
                  </TableHead>
                  <TableHead className="min-w-[140px] font-semibold text-slate-700">
                    Category
                  </TableHead>
                  <TableHead className="min-w-[120px] font-semibold text-slate-700">
                    Amount
                  </TableHead>
                  
                  <TableHead className="min-w-[110px] font-semibold text-slate-700">
                    Status
                  </TableHead>
                  <TableHead className="min-w-[150px] font-semibold text-slate-700">
                    Next Billing Date
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {displaySubs.map((subscription) => {
                  const categoryStyle = getCategoryStyle(subscription.category);
                  const siteUrl = formatSiteUrl(subscription.linkToSite);

                  return (
                    <TableRow
                      key={subscription.id}
                      className="border-slate-200 hover:bg-slate-50/70 h-16"
                    >
                      {/* Name + linkToSite */}
                      <TableCell className="px-6 py-4">
                      
                          
                          <div className="flex flex-col gap-1">
                            <p className=" text-slate-900 capitalize font-bold">
                              {subscription.name}
                            </p>
                           
                            {siteUrl && (
                              <a
                                href={siteUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="mt-0.5 inline-flex items-center gap-1 text-xs text-[#1565c0] hover:underline font-medium"
                              >
                                <ExternalLink size={12} />
                                {siteUrl}
                              </a>
                            )}
                          </div>
                        
                      </TableCell>

                      {/* Category */}
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span
                            className={`h-2 w-2 rounded-full ${categoryStyle.dot}`}
                          />
                          <span className={`text-sm font-medium ${categoryStyle.text}`}>
                            {formatCategory(subscription.category)}
                          </span>
                        </div>
                      </TableCell>

                      {/* Amount */}
                      <TableCell className="font-semibold text-slate-900">
                        <div className="">
                          <p className="text-sm font-semibold">{formatMoney(subscription.settledAmount, baseCurrency)}</p>
                          <span className="text-xs text-gray-400">{formatMoney(subscription.amount, subscription.currency)}</span>
                        </div>

                      </TableCell>

                    

                      {/* Status */}
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`rounded-full px-3 py-1 font-semibold ${getStatusStyle(
                            subscription.status
                          )}`}
                        >
                          {formatBillingCycle(subscription.status)}
                        </Badge>
                      </TableCell>

                      {/* Next Billing Date */}
                      <TableCell>
                        <div className="flex items-center gap-1.5 font-medium text-slate-900">
                          <Calendar size={14} className="text-slate-400" />
                          {formatDate(subscription.nextBillingDate)}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="p-8 text-center text-sm font-medium text-slate-500">
            No expired or upcoming subscriptions requiring immediate attention.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
