import { useOutletContext } from "react-router";
import {
  User,
  Mail,
  Globe,
  Shield,
  Bell,
  Calendar,
  Pencil,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {useState }from 'react'

export default function AccountInfo() {
  const { user } = useOutletContext();

  const [emailNotifEnabled, setEmailNotifEnabled] = useState(
    user?.emailNotificationEnabled ?? true
  );

  const infoItems = [
    {
      icon: User,
      label: "Full Name",
      value:
        [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "—",
      canEdit: false,
    },
    {
      icon: User,
      label: "Username",
      value: user?.username || "—",
      canEdit: true,
    },
    {
      icon: Mail,
      label: "Email",
      value: user?.email || "—",
      canEdit: false,
    },
    {
      icon: Shield,
      label: "Role",
      value: user?.role || "—",
      isBadge: true,
      canEdit: false,
    },
    {
      icon: Globe,
      label: "Base Currency",
      value: user?.baseCurrency || "—",
      canEdit: false,
    },
    {
      icon: Bell,
      label: "Reminder Interval",
      value: user?.reminderDaysBefore
        ? `${user.reminderDaysBefore} day${user.reminderDaysBefore !== 1 ? "s" : ""} before renewal`
        : "—",
      canEdit: true,
    },
    {
      icon: Bell,
      label: "Email Notifications",
      isToggle: true,
      toggleValue: emailNotifEnabled,
      onToggle: () => setEmailNotifEnabled((prev) => !prev),
    },
    {
      icon: Calendar,
      label: "Member Since",
      value: user?.createdAt
        ? new Intl.DateTimeFormat("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          }).format(new Date(user.createdAt))
        : "—",
      canEdit: false,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-subly-text-primary">
          Account Information
        </h2>
        <p className="mt-1 text-sm text-subly-text-secondary">
          Review your personal details and account settings.
        </p>
      </div>

      {/* Profile header card */}
      <Card className="rounded-xl border-subly-border bg-subly-card shadow-sm">
        <CardContent className="flex items-center gap-4 p-6">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#1565c0] text-lg font-bold text-white">
            {user?.firstName?.[0]?.toUpperCase() ||
              user?.username?.[0]?.toUpperCase() ||
              "U"}
          </div>
          <div className="min-w-0">
            <p className="text-lg font-bold text-subly-text-primary">
              {[user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
                user?.username}
            </p>
            <p className="truncate text-sm text-subly-text-secondary">
              {user?.email}
            </p>
          </div>
          <Badge className="ml-auto shrink-0 bg-[#bbdefb]/50 text-[#1565c0] border-[#1565c0]/10">
            {user?.role}
          </Badge>
        </CardContent>
      </Card>

      {/* Details grid */}
      <Card className="rounded-xl border-subly-border bg-subly-card shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-bold text-subly-text-primary">
            Personal Details
          </CardTitle>
          <CardDescription>
            Your Subly profile and preferences at a glance.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-slate-100">
            {infoItems.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="flex items-center gap-4 py-4 first:pt-0 last:pb-0"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                    <Icon size={16} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium uppercase tracking-wider text-subly-text-secondary">
                      {item.label}
                    </p>
                    {item.isBadge ? (
                      <Badge
                        className={`mt-1 ${
                          item.badgeVariant === "success"
                            ? "bg-green-50 text-green-700 border-green-100"
                            : item.badgeVariant === "muted"
                              ? "bg-slate-100 text-slate-500 border-slate-200"
                              : "bg-[#bbdefb]/50 text-[#1565c0] border-[#1565c0]/10"
                        }`}
                      >
                        {item.value}
                      </Badge>
                    ) : (
                      <p className="mt-1 text-sm font-semibold text-subly-text-primary">
                        {item.value}
                      </p>
                    )}
                  </div>
                  {item.isToggle ? (
                    <button
                      type="button"
                      role="switch"
                      aria-checked={item.toggleValue}
                      onClick={item.onToggle}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1565c0] focus-visible:ring-offset-2 ${
                        item.toggleValue ? "bg-[#1565c0]" : "bg-slate-200"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm ring-0 transition-transform duration-200 ease-in-out ${
                          item.toggleValue ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  ) : item.canEdit ? (
                    <button
                      type="button"
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-[#1565c0]"
                      title={`Edit ${item.label}`}
                    >
                      <Pencil size={14} />
                    </button>
                  ) : null}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
