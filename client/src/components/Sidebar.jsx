import { NavLink, useRouteLoaderData } from "react-router";
import { navLinks } from "../lib/var";
import SublyLogo from "./SublyLogo";

function SidebarLink({ item }) {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.path}
      end={item.path === "/dashboard"}
      className={({ isActive }) =>
        `group relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-150 ${
          isActive
            ? "bg-subly-soft-blue text-subly-accent font-semibold shadow-xs"
            : "text-slate-700 hover:bg-[#e9ecef] hover:text-slate-900"
        }`
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-subly-brand-blue" />
          )}

          <span
            className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
              isActive
                ? "bg-white text-subly-brand-blue shadow-xs"
                : "bg-transparent text-slate-600 group-hover:text-slate-900"
            }`}
          >
            <Icon size={18} />
          </span>

          <span className="truncate">{item.label}</span>
        </>
      )}
    </NavLink>
  );
}

export function Sidebar() {
  const data = useRouteLoaderData("dashboard");
  const visibleLinks = navLinks.filter(
    (item) => !item.adminOnly || data?.user?.role === "ADMIN",
  );

  return (
    <aside className="fixed left-0 top-0 hidden h-screen w-64  bg-[#edede9] px-4 py-5 lg:block">
      {/* Brand Header */}
      <div className="mb-8 px-2 pt-1">
        <SublyLogo />
      </div>

      {/* Main Navigation */}
      <nav className="space-y-1.5">
        {visibleLinks.map((item) => (
          <SidebarLink key={item.path} item={item} />
        ))}
      </nav>

      {/* Footer Info Card */}
      <div className="absolute bottom-5 left-4 right-4 overflow-hidden rounded-2xl border border-white/60 bg-white p-4 shadow-xs">
        <div className="mb-2 h-1 w-12 rounded-full bg-[#1565c0]" />

        <p className="text-sm font-semibold text-slate-900">Free Plan</p>

        <p className="mt-0.5 text-xs leading-4 text-slate-600">
          Track subscriptions, renewals, and reminders for free.
        </p>
      </div>
    </aside>
  );
}
