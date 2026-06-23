import { AlertCircle, CheckCircle2, CreditCard, Wallet } from "lucide-react";

import { formatMoney } from "@/lib/utils";

const toneStyles = {
  blue: {
    card: "bg-subly-soft-blue text-subly-brand-blue",
    dot: "bg-subly-brand-blue",
  },
  purple: {
    card: "bg-subly-soft-purple text-subly-brand-purple",
    dot: "bg-subly-brand-purple",
  },
  success: {
    card: "bg-green-50 text-subly-success",
    dot: "bg-subly-success",
  },
  danger: {
    card: "bg-red-50 text-subly-danger",
    dot: "bg-subly-danger",
  },
};

export function StatCard({ stat , baseCurrency }) {
  


  return (
    <>
      <div className="rounded-3xl border border-subly-border bg-subly-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-subly-text-secondary">
              Total Spending
            </p>

            <h3 className="mt-3 text-3xl font-bold tracking-tight text-subly-text-primary">
              {formatMoney(stat?.totalAmount, baseCurrency)}
            </h3>

            <p className="mt-2 flex items-center gap-2 text-xs font-medium text-subly-text-secondary">
              <span
                className={`h-2 w-2 rounded-full ${toneStyles["blue"].dot}`}
              />
              Across all subscriptions
            </p>
          </div>

          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${toneStyles["blue"].card}`}
          >
            <Wallet size={22} />
          </div>
        </div>
      </div>
      <div className="rounded-3xl border border-subly-border bg-subly-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-subly-text-secondary">
              Total Subscriptions
            </p>

            <h3 className="mt-3 text-3xl font-bold tracking-tight text-subly-text-primary">
              {stat?.totalSubs? stat.totalSubs : 0}
            </h3>

            <p className="mt-2 flex items-center gap-2 text-xs font-medium text-subly-text-secondary">
              <span
                className={`h-2 w-2 rounded-full ${toneStyles["purple"].dot}`}
              />
              All tracked subscriptions
            </p>
          </div>

          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${toneStyles["purple"].card}`}
          >
            <CreditCard size={22} />
          </div>
        </div>
      </div>
      <div className="rounded-3xl border border-subly-border bg-subly-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-subly-text-secondary">
              Active Subscriptions
            </p>

            <h3 className="mt-3 text-3xl font-bold tracking-tight text-subly-text-primary">
              {stat?.totalActiveSub || 0}
            </h3>

            <p className="mt-2 flex items-center gap-2 text-xs font-medium text-subly-text-secondary">
              <span
                className={`h-2 w-2 rounded-full ${toneStyles["success"].dot}`}
              />
              Currently active
            </p>
          </div>

          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${toneStyles["success"].card}`}
          >
            <CheckCircle2 size={22} />
          </div>
        </div>
      </div>
      <div className="rounded-3xl border border-subly-border bg-subly-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-subly-text-secondary">
              Expired Subscriptions
            </p>

            <h3 className="mt-3 text-3xl font-bold tracking-tight text-subly-text-primary">
              {stat?.totalExpiredSub || 0}
            </h3>

            <p className="mt-2 flex items-center gap-2 text-xs font-medium text-subly-text-secondary">
              <span
                className={`h-2 w-2 rounded-full ${toneStyles["danger"].dot}`}
              />
              Need attention
            </p>
          </div>

          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${toneStyles["danger"].card}`}
          >
            <AlertCircle size={22} />
          </div>
        </div>
      </div>
    </>
  );
}
