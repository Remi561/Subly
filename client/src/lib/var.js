import {
  LayoutDashboard,
  CreditCard,
  History,
  Bell,
  Settings,
  ShieldCheck,

} from "lucide-react";







export const navLinks = [
  {
    label: "Overview",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Subscriptions",
    path: "/dashboard/subscriptions",
    icon: CreditCard,
  },
  {
    label: "History",
    path: "/dashboard/history",
    icon: History,
  },
  {
    label: "Notifications",
    path: "/dashboard/notifications",
    icon: Bell,
  },
  {
    label: "Settings",
    path: "/dashboard/settings",
    icon: Settings,
  },
  {
    label: "Admin",
    path: "/dashboard/admin",
    icon: ShieldCheck,
    adminOnly: true,
  },
];

export const toneStyles = {
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


