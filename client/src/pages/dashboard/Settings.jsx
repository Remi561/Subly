
import {
  ChevronRight,
  LogOut,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import {
  NavLink,
  Outlet,

  useRouteLoaderData,
} from "react-router";


import Breadcrumbs from "@/components/Breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
 
} from "@/components/ui/card";

import {useClerk} from "@clerk/react"

const settingsLinks = [
  {
    label: "Account Information",
    description: "Username, email, role, currency & reminders",
    icon: UserRound,
    to: "/dashboard/settings",
    end: true,
  },
  {
    label: "Security",
    description: "Password and connected devices",
    icon: ShieldCheck,
    to: "/dashboard/settings/security",
    end: false,
  },
];

export default function Settings() {
  const data = useRouteLoaderData("dashboard");

  const {signOut } = useClerk()

  

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
          Manage your account, security, and session preferences.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* Left sidebar navigation */}
        <nav className="space-y-2">
          {settingsLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-xl border px-4 py-3.5 transition-all ${
                    isActive
                      ? "border-[#1565c0]/20 bg-[#bbdefb]/20 shadow-sm"
                      : "border-transparent hover:border-slate-200 hover:bg-slate-50"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                        isActive
                          ? "bg-[#1565c0] text-white"
                          : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
                      }`}
                    >
                      <Icon size={16} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p
                        className={`text-sm font-semibold ${
                          isActive
                            ? "text-[#1565c0]"
                            : "text-subly-text-primary"
                        }`}
                      >
                        {link.label}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-subly-text-secondary">
                        {link.description}
                      </p>
                    </div>
                    <ChevronRight
                      size={14}
                      className={`shrink-0 ${
                        isActive
                          ? "text-[#1565c0]"
                          : "text-slate-300 group-hover:text-slate-400"
                      }`}
                    />
                  </>
                )}
              </NavLink>
            );
          })}


        </nav>

        {/* Right content area — routed child pages */}
        <div className="min-w-0">
          <Outlet context={{ user: data?.user }} />
                    {/* Danger zone — Logout */}
                    <div className="pt-4">
            <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-wider text-subly-text-secondary">
              Danger Zone
            </p>
            <Card className="rounded-xl border-red-100 bg-red-50/50 shadow-none">
              <CardContent className="p-3">
                <Button
                  variant="destructive"
                  className="w-full"
           
                  onClick={() => signOut({redirectUrl: '/auth/login'})}
                >
                  <LogOut size={16} className="mr-2" /> Logout
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        
      </div>
    </section>
  );
}
