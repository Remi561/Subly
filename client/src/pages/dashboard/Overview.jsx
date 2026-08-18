import Breadcrumbs from "@/components/Breadcrumb";
import { StatCard } from "@/components/dashboard/Stats";
import { SpendingByCategoryChart, SpendingOverviewChart } from "@/components/dashboard/Chart";

import { AlmostExpiredTable } from "@/components/dashboard/AlmostExpiredTable";

import {
  StatCardsSkeleton,
  ChartSkeleton,
  SubscriptionTableSkeleton,
} from "@/components/dashboard/Skeleton";
import { useQuery } from "@tanstack/react-query";
import {apiFetch} from '@/lib/action'

import { useCurrentUser } from "@/hooks/useCurrentUser";

const Overview = () => {
  
  
  const crumbs = [
    { name: "Dashboard", href: '' },
    { name: "Overview", href: "/dashboard" },
  ];
  // data fetching 
  
  const {data: me} = useCurrentUser()
  const { data: stats, isLoading } = useQuery({
    queryKey: ["subscriptions", "info"],
    queryFn: () => apiFetch("/api/subscription/info"),
  });

  const { data: almostExpiredRes, isLoading: almostExpiredLoading } = useQuery({
    queryKey: ["subscriptions", "almostExpired"],
    queryFn: () => apiFetch("/api/subscription/almostExpired"),
  });

  const { data: chartData, isLoading: chartDataLoading } = useQuery({
    queryKey: ["chart", "line chart"],
    queryFn: () => apiFetch("/api/subscription/expenses"),
  });

  const { data: pieChart, isLoading: pieChartLoading } = useQuery({
    queryKey: ["chart", "piechart"],
    queryFn: () => apiFetch("/api/subscription/categories"),
  });

  const baseCurrency = me?.user?.baseCurrency 

  return (
    <section className="space-y-6">
      {/* Breadcrumb Section */}
      <div className="mb-2">
        <Breadcrumbs crumbs={crumbs} />
      </div>

      {/* Header Section */}
      <header className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Overview
        </h1>

        <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
          Monitor your subscriptions, spending, active plans, and expired renewals from one place.
        </p>
      </header>

      {/* Top Section: 4 White Shadowed Subscription Stat Cards */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {isLoading ? (
          <StatCardsSkeleton />
        ) : (
          <StatCard stat={stats} baseCurrency={baseCurrency} />
        )}
      </div>

      {/* Spending Charts Grid */}
      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        {chartDataLoading ? (
          <ChartSkeleton />
        ) : (
          <SpendingOverviewChart
            chartData={chartData}
            baseCurrency={baseCurrency}
          />
        )}
        {pieChartLoading ? (
          <ChartSkeleton />
        ) : (
          <SpendingByCategoryChart
            pieChart={pieChart}
            baseCurrency={baseCurrency}
          />
        )}
      </div>

      {/* Almost Expired Subscriptions Table */}
      {almostExpiredLoading ? (
        <SubscriptionTableSkeleton />
      ) : (
        <AlmostExpiredTable
          subscriptions={almostExpiredRes?.data}
          baseCurrency={baseCurrency}
        />
      )}

      
  
    </section>
  );
};

export default Overview;