import {
  LayoutDashboard,
  CreditCard,
  History,
  Bell,
  Settings,
   Wallet, CheckCircle2, AlertCircle
} from "lucide-react";



export const spendingData = [
  { month: "Jan", amount: 22000 },
  { month: "Feb", amount: 28000 },
  { month: "Mar", amount: 25000 },
  { month: "Apr", amount: 36000 },
  { month: "May", amount: 48250 },
  { month: "Jun", amount: 41000 },
];

export const categoryData = [
  { name: "Entertainment", value: 24500, color: "#1677F2" },
  { name: "Productivity", value: 12000, color: "#5B35F5" },
  { name: "AI Tools", value: 8000, color: "#16A34A" },
  { name: "Storage", value: 3750, color: "#F59E0B" },
];




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



