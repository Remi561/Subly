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
        `group relative flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-all ${
          isActive
            ? "bg-subly-soft-blue text-subly-brand-blue"
            : "text-subly-text-secondary hover:bg-subly-background hover:text-subly-text-primary"
        }`
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <span className="absolute left-0 top-1/2 h-7 w-1 -translate-y-1/2 rounded-r-full bg-gradient-to-b from-subly-brand-blue to-subly-brand-purple" />
          )}

          <span
            className={`flex h-9 w-9 items-center justify-center rounded-xl transition ${
              isActive
                ? "bg-white text-subly-brand-blue shadow-sm"
                : "bg-transparent text-subly-text-secondary group-hover:text-subly-brand-blue"
            }`}
          >
            <Icon size={19} />
          </span>

          <span>{item.label}</span>
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
    <aside className="fixed left-0 top-0 hidden h-screen w-72 border-r border-subly-border bg-subly-card px-5 py-6 lg:block">
      <div className="mb-10">
        <SublyLogo />
      </div>

      <nav className="space-y-2">
        {visibleLinks.map((item) => (
          <SidebarLink key={item.path} item={item} />
        ))}
      </nav>

      <div className="absolute bottom-6 left-5 right-5 overflow-hidden rounded-3xl border border-subly-border bg-subly-background p-4">
        <div className="mb-3 h-1 w-16 rounded-full bg-linear-to-r from-subly-brand-blue to-subly-brand-purple" />

        <p className="text-sm font-bold text-subly-text-primary">Free Plan</p>

        <p className="mt-1 text-xs leading-5 text-subly-text-secondary">
          Track subscriptions, renewals, and reminders for free.
        </p>
      </div>
    </aside>
  );
}
