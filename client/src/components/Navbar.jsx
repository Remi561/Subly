import { NavLink, useRouteLoaderData } from "react-router"
import { navLinks } from "../lib/var"

function BottomNavLink({ item }) {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.path}
      end={item.path === "/dashboard"}
      className={({ isActive }) =>
        `flex flex-1 flex-col items-center justify-center gap-1 rounded-2xl py-2 text-[11px] font-semibold transition-all ${
          isActive
            ? "text-subly-brand-blue"
            : "text-subly-text-secondary hover:text-subly-text-primary"
        }`
      }
    >
      {({ isActive }) => (
        <>
          <span
            className={`flex h-9 w-9 items-center justify-center rounded-2xl transition ${
              isActive
                ? "bg-subly-soft-blue text-subly-brand-blue"
                : "bg-transparent"
            }`}
          >
            <Icon size={20} />
          </span>

          <span>{item.label}</span>
        </>
      )}
    </NavLink>
  );
}

export function Navbar() {
    const data = useRouteLoaderData("dashboard");
    const visibleLinks = navLinks.filter(
      (item) => !item.adminOnly || data?.user?.role === "ADMIN",
    );

    return (
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-subly-border bg-subly-card/95 px-2 py-2 shadow-[0_-8px_30px_rgba(8,17,31,0.08)] backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-md items-center gap-1">
          {visibleLinks.map((item) => (
            <BottomNavLink key={item.path} item={item} />
          ))}
        </div>
      </nav>
    );
}
