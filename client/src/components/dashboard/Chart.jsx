import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import { formatMoney } from "@/lib/utils";

// const categoryData = [
//   {
//     category: "Entertainment",
//     amount: 24500,
//     fill: "var(--color-subly-brand-blue)",
//   },
//   {
//     category: "Productivity",
//     amount: 12000,
//     fill: "var(--color-subly-brand-purple)",
//   },
//   {
//     category: "AI Tools",
//     amount: 8000,
//     fill: "var(--color-subly-success)",
//   },
//   {
//     category: "Storage",
//     amount: 3750,
//     fill: "var(--color-subly-warning)",
//   },
// ];

const spendingChartConfig = {
  total: {
    label: "Spending",
    color: "var(--color-subly-brand-blue)",
  },
};

const chartConfig = {
  ENTERTAINMENT: {
    label: "Entertainment",
    color: "var(--color-subly-brand-blue)",
  },
  AI_TOOLS: { label: "AI Tools", color: "var(--color-ai)" },
  STORAGE: { label: "Storage", color: "var(--color-storage)" },
  PRODUCTIVITY: {
    label: "Productivity",
    color: "var(--color-subly-brand-purple)",
  },
};

export function SpendingOverviewChart({ chartData, baseCurrency }) {
  return (
    <Card className="rounded-3xl border-subly-border bg-subly-card shadow-sm flex flex-col">
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
        <div>
          <CardTitle className="text-lg font-bold text-subly-text-primary">
            Spending Overview
          </CardTitle>

          <CardDescription className="mt-1 text-sm text-subly-text-secondary">
            Monthly subscription spending trend
          </CardDescription>
        </div>

        <span className="rounded-full bg-subly-soft-blue px-3 py-1 text-xs font-semibold text-subly-brand-blue">
          6 months
        </span>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col items-end justify-center">
        <ChartContainer config={spendingChartConfig} className="h-70 w-full">
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 16,
              right: 12,
              left: 0,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient
                id="sublyAmountGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="var(--color-subly-brand-blue)"
                  stopOpacity={0.25}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-subly-brand-blue)"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>

            <CartesianGrid
              vertical={false}
              stroke="var(--color-subly-border)"
              strokeDasharray="4 4"
            />

            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tick={{
                fill: "var(--color-subly-text-secondary)",
                fontSize: 12,
              }}
            />

            <YAxis
              dataKey="total"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tick={{
                fill: "var(--color-subly-text-secondary)",
                fontSize: 12,
              }}
              tickFormatter={(value) => `${value / 100}k`}
            />

            <ChartTooltip
              cursor={{
                stroke: "var(--color-subly-brand-blue)",
                strokeWidth: 1,
                strokeDasharray: "4 4",
              }}
              content={
                <ChartTooltipContent
                  indicator="dot"
                  formatter={(value) => formatMoney(value, baseCurrency)}
                />
              }
            />

            <Area
              dataKey="total"
              type="monotone"
              stroke="var(--color-subly-brand-blue)"
              strokeWidth={3}
              fill="url(#sublyAmountGradient)"
              dot={{
                r: 4,
                fill: "var(--color-subly-brand-blue)",
                stroke: "#ffffff",
                strokeWidth: 2,
              }}
              activeDot={{
                r: 6,
                fill: "var(--color-subly-brand-purple)",
                stroke: "#ffffff",
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export function SpendingByCategoryChart({ pieChart, baseCurrency }) {
  return (
    <Card className="rounded-3xl border-subly-border bg-subly-card shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-subly-text-primary">
          Spending by Category
        </CardTitle>

        <CardDescription className="mt-1 text-sm text-subly-text-secondary">
          Where your subscription money goes
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="relative">
          <ChartContainer
            config={chartConfig}
            className="mx-auto h-[240px] w-full"
          >
            <PieChart accessibilityLayer>
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    hideLabel
                    formatter={(value) => formatMoney(value, baseCurrency)}
                  />
                }
              />

              <Pie
                data={pieChart.categoryTotal}
                dataKey="amount"
                nameKey="category"
                innerRadius={65}
                outerRadius={92}
                paddingAngle={4}
                strokeWidth={0}
              >
                {pieChart?.categoryTotal.map((item) => (
                  <Cell
                    key={item.category}
                    fill={chartConfig[item.id]?.color || "#888888"}
                  />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>

          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-xs font-medium text-subly-text-secondary">
              Total
            </p>
            <p className="text-lg font-bold text-subly-text-primary">
              {formatMoney(pieChart?.grandTotal, baseCurrency)}
            </p>
          </div>
        </div>

        <div className="mt-5 space-y-3">
          {pieChart &&
            pieChart?.categoryTotal.map((item) => {
              return (
                <div
                  key={item.category}
                  className="flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: chartConfig[item.id]?.color }}
                    />

                    <span className="text-sm font-medium text-subly-text-primary capitalize">
                      {item.category}
                    </span>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-bold text-subly-text-primary">
                      {item.percentage}%
                    </p>
                    <p className="text-xs text-subly-text-secondary">
                      {formatMoney(item.amount, baseCurrency)}
                    </p>
                  </div>
                </div>
              );
            })}
        </div>
      </CardContent>
    </Card>
  );
}
