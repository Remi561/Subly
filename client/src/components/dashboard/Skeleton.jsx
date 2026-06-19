import { Skeleton } from "@/components/ui/skeleton";
import { CardContent, Card,CardHeader } from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";


export function StatCardsSkeleton() {
  return (
    <>
      {Array.from({ length: 4 }).map((_, index) => (
     
        
            
                
                <CardContent key={index} >
                  <Skeleton className="h-30 w-full" />
                </CardContent>
        
      ))}
    </>
  );
}


export function SubscriptionTableSkeleton() {
  // Generate 5 empty rows for the loading state
  const skeletonRows = Array.from({ length: 5 });

  return (
    <Card className="mt-6 rounded-3xl bg-subly-card md:border-subly-border md:shadow-sm">
      <CardHeader className="border-b border-subly-border">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          {/* Card Title Skeleton */}
          <Skeleton className="h-7 w-48 bg-subly-border/50" />
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-5">
        {/* --- DESKTOP VIEW SKELETON (Hidden on Mobile) --- */}
        <div className="hidden overflow-hidden rounded-2xl border border-subly-border lg:block">
          <Table>
            <TableHeader className="bg-subly-background">
              <TableRow className="border-subly-border">
                <TableHead className="px-6 py-4">
                  <Skeleton className="h-4 w-24 bg-subly-border/50" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-4 w-20 bg-subly-border/50" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-4 w-16 bg-subly-border/50" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-4 w-24 bg-subly-border/50" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-4 w-16 bg-subly-border/50" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-4 w-16 bg-subly-border/50" />
                </TableHead>
                <TableHead className="pr-6">
                  <Skeleton className="ml-auto h-4 w-12 bg-subly-border/50" />
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {skeletonRows.map((_, index) => (
                <TableRow key={index} className="border-subly-border">
                  {/* Subscription (Logo + Name) */}
                  <TableCell className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-11 w-11 shrink-0 rounded-xl bg-subly-border/50" />
                      <Skeleton className="h-4 w-32 bg-subly-border/50" />
                    </div>
                  </TableCell>

                  {/* Category (Dot + Text) */}
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-2 w-2 shrink-0 rounded-full bg-subly-border/50" />
                      <Skeleton className="h-4 w-20 bg-subly-border/50" />
                    </div>
                  </TableCell>

                  {/* Billing Cycle */}
                  <TableCell>
                    <Skeleton className="h-4 w-16 bg-subly-border/50" />
                  </TableCell>

                  {/* Next Billing Date */}
                  <TableCell>
                    <Skeleton className="h-4 w-24 bg-subly-border/50" />
                  </TableCell>

                  {/* Amount (Big number + Small currency) */}
                  <TableCell>
                    <Skeleton className="mb-2 h-4 w-20 bg-subly-border/50" />
                    <Skeleton className="h-3 w-12 bg-subly-border/50" />
                  </TableCell>

                  {/* Status Badge */}
                  <TableCell>
                    <Skeleton className="h-6 w-20 rounded-full bg-subly-border/50" />
                  </TableCell>

                  {/* Actions Button */}
                  <TableCell className="pr-6 text-right">
                    <Skeleton className="ml-auto h-9 w-10 shrink-0 rounded-full bg-subly-border/50" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* --- MOBILE VIEW SKELETON (Hidden on Desktop) --- */}
        <div className="divide-y divide-subly-border rounded-2xl lg:hidden">
          {skeletonRows.map((_, index) => (
            <div
              key={index}
              className="flex items-start justify-between gap-3 bg-subly-card p-4"
            >
              {/* Left Side: Logo, Name, Category */}
              <div className="flex min-w-0 flex-1 gap-3">
                <Skeleton className="h-11 w-11 shrink-0 rounded-xl bg-subly-border/50" />
                <div className="flex-1 space-y-3 py-1">
                  <Skeleton className="h-4 w-3/4 bg-subly-border/50" />
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-2 w-2 shrink-0 rounded-full bg-subly-border/50" />
                    <Skeleton className="h-3 w-1/2 bg-subly-border/50" />
                  </div>
                </div>
              </div>

              {/* Right Side: Amounts & Actions */}
              <div className="flex shrink-0 items-start gap-3">
                <div className="space-y-3 py-1 text-right">
                  <Skeleton className="ml-auto h-4 w-16 bg-subly-border/50" />
                  <Skeleton className="ml-auto h-3 w-12 bg-subly-border/50" />
                </div>
                <Skeleton className="h-9 w-10 shrink-0 rounded-full bg-subly-border/50" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
