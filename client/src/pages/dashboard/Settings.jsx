import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Bell, LogOut, ShieldCheck, UserRound } from "lucide-react";
import { useNavigate, useRouteLoaderData } from "react-router";
import { toast } from "sonner";

import Breadcrumbs from "@/components/Breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { getApiBaseUrl } from "@/lib/utils";

const settingsItems = [
  {
    label: "Account information",
    description: "Review your username, role, and base currency.",
    icon: UserRound,
  },
  {
    label: "Notifications",
    description: "Reminder preferences will be managed here.",
    icon: Bell,
  },
  {
    label: "Security",
    description: "Password and session settings will be managed here.",
    icon: ShieldCheck,
  },
];

export default function Settings() {
  const data = useRouteLoaderData("dashboard");
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`${getApiBaseUrl()}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Logout failed");
      }

      return result;
    },
    onSuccess: () => {
      queryClient.clear();
      toast.success("Logged out successfully");
      navigate("/auth/login", { replace: true });
    },
    onError: (error) => {
      toast.error(error.message || "Unable to logout");
    },
  });

  const breadCrumb = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Settings", href: "/dashboard/settings" },
  ];

  return (
    <section>
      <header className="mb-6">
        <div className="mt-1 text-subly-text-primary">
          <Breadcrumbs crumbs={breadCrumb} />
        </div>

        <h1 className="mt-4 text-3xl font-bold tracking-tight text-subly-text-primary">
          Settings
        </h1>
        <p className="mt-2 text-sm text-subly-text-secondary">
          Manage your account and session preferences.
        </p>
      </header>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <Card className="rounded-xl border-subly-border bg-subly-card shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-subly-text-primary">
              Account
            </CardTitle>
            <CardDescription>Your current Subly account details.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-3">
            <div>
              <p className="text-xs font-medium uppercase text-subly-text-secondary">
                Username
              </p>
              <p className="mt-1 font-semibold text-subly-text-primary">
                {data?.user?.username}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase text-subly-text-secondary">
                Role
              </p>
              <Badge className="mt-1 bg-subly-soft-blue text-subly-brand-blue">
                {data?.user?.role}
              </Badge>
            </div>
            <div>
              <p className="text-xs font-medium uppercase text-subly-text-secondary">
                Base currency
              </p>
              <p className="mt-1 font-semibold text-subly-text-primary">
                {data?.user?.baseCurrency}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl border-subly-border bg-subly-card shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-subly-text-primary">
              Session
            </CardTitle>
            <CardDescription>End your current authenticated session.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="destructive"
              className="w-full"
              disabled={logoutMutation.isPending}
              onClick={() => logoutMutation.mutate()}
            >
              {logoutMutation.isPending ? (
                <>
                  <Spinner className="mr-2" /> Logging out...
                </>
              ) : (
                <>
                  <LogOut size={16} /> Logout
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-4">
        {settingsItems.map((item) => {
          const Icon = item.icon;
          return (
            <Card
              key={item.label}
              className="rounded-xl border-subly-border bg-subly-card shadow-sm"
            >
              <CardContent className="flex items-center gap-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-subly-soft-blue text-subly-brand-blue">
                  <Icon size={18} />
                </span>
                <div>
                  <p className="font-semibold text-subly-text-primary">
                    {item.label}
                  </p>
                  <p className="mt-1 text-sm text-subly-text-secondary">
                    {item.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
