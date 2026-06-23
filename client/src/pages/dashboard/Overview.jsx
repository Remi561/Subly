





import { StatCard } from "../../components/dashboard/Stats";
import { SpendingByCategoryChart, SpendingOverviewChart } from "@/components/dashboard/Chart";
import { OverviewTable } from "@/components/dashboard/Overview";
import { useRouteLoaderData } from "react-router";
import {
  StatCardsSkeleton,
  ChartSkeleton,
} from "@/components/dashboard/Skeleton";
import { useQuery } from "@tanstack/react-query";
import { fetchWithAuth } from "@/lib/utils";
import { SubscriptionTableSkeleton } from "@/components/dashboard/Skeleton";
const Overview = () => {
  const data = useRouteLoaderData("dashboard");

  const { data: stats, isLoading } = useQuery({
    queryKey: ["subscriptions", "info"],
    queryFn: () =>
      fetchWithAuth("/api/subscription/info").then((res) => res.json()),
  });

  const { data: rawData, isLoading: subsLoading } = useQuery({
    queryKey: ["subscription"],
    queryFn: () => fetchWithAuth("/api/subscription").then((res) => res.json()),
  });

  const { data: chartData, isLoading: chartDataLoading } = useQuery({
    queryKey: ["chart", "line chart"],
    queryFn: () =>
      fetchWithAuth("/api/subscription/expenses").then((res) => res.json()),
  });

  const { data: pieChart, isLoading: pieChartLoading } = useQuery({
    queryKey: ["chart", "piechart"],
    queryFn: () =>
      fetchWithAuth("/api/subscription/categories").then((res) => res.json()),
  });

  return (
    <section>
      <header className="mb-6">
        {/* <p className="text-sm font-semibold text-subly-brand-blue">Overview</p> */}

        <h1 className="mt-1 text-3xl font-bold tracking-tight text-subly-text-primary">
          Dashboard
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-subly-text-secondary">
          Monitor your subscriptions, spending, active plans, and expired
          renewals from one place.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {isLoading ? (
          <StatCardsSkeleton />
        ) : (
          <StatCard stat={stats} baseCurrency={data?.user?.baseCurrency} />
        )}
      </div>

      {/* Charts */}

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        {chartDataLoading ? (
          <ChartSkeleton />
        ) : (
          <SpendingOverviewChart
            chartData={chartData}
            baseCurrency={data?.user?.baseCurrency}
          />
        )}
        {pieChartLoading ? (
          <ChartSkeleton />
        ) : (
          <SpendingByCategoryChart
            pieChart={pieChart}
            baseCurrency={data?.user?.baseCurrency}
          />
        )}
      </div>

      {subsLoading ? (
        <SubscriptionTableSkeleton />
      ) : (
        <OverviewTable
          subscriptions={rawData?.data}
          baseCurrency={data?.user?.baseCurrency}
        />
      )}
    </section>
  );
}

export default Overview