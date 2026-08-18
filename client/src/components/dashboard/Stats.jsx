import { AlertCircle, CheckCircle2, CreditCard, Wallet } from "lucide-react";
import { formatMoney } from "@/lib/utils";

export function StatCard({ stat, baseCurrency }) {
  const cards = [
    {
      id: "total-spending",
      title: "Total Spending",
      value: formatMoney(stat?.totalAmount || 0, baseCurrency),
      subtext: "Across active subscriptions",
      icon: Wallet,
      iconBg: "bg-[#bbdefb] text-[#1565c0]",
      dotBg: "bg-[#1565c0]",
    },
    {
      id: "total-subs",
      title: "Total Subscriptions",
      value: stat?.totalSubs ?? 0,
      subtext: "All tracked subscriptions",
      icon: CreditCard,
      iconBg: "bg-purple-100 text-purple-700",
      dotBg: "bg-purple-600",
    },
    {
      id: "active-subs",
      title: "Active Subscriptions",
      value: stat?.totalActiveSub ?? 0,
      subtext: "Currently active",
      icon: CheckCircle2,
      iconBg: "bg-emerald-100 text-emerald-700",
      dotBg: "bg-emerald-600",
    },
    {
      id: "expired-subs",
      title: "Expired Subscriptions",
      value: stat?.totalExpiredSub ?? 0,
      subtext: "Requires renewal attention",
      icon: AlertCircle,
      iconBg: "bg-red-100 text-[#e31b23]",
      dotBg: "bg-[#e31b23]",
    },
  ];

  return (
    <>
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {card.title}
                </p>

                <h3 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  {card.value}
                </h3>

                <p className="flex items-center gap-1.5 pt-1 text-xs font-medium text-slate-500">
                  <span className={`h-2 w-2 rounded-full ${card.dotBg}`} />
                  {card.subtext}
                </p>
              </div>

              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-transform ${card.iconBg}`}
              >
                <Icon size={20} />
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}
