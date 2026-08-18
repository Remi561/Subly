import { useState } from "react";

import {
  Lock,
  Monitor,
  Smartphone,
  Tablet,
  Ban,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Password change schema
const ChangePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, { message: "Current password is required" }),
    newPassword: z
      .string()
      .min(8, { message: "Must be at least 8 characters" })
      .regex(/[A-Z]/, { message: "Must contain at least one uppercase letter" })
      .regex(/[0-9]/, { message: "Must contain at least one number" })
      .regex(/[^A-Za-z0-9]/, {
        message: "Must contain at least one special character",
      }),
    confirmPassword: z.string().min(1, { message: "Please confirm your new password" }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Device icon by type
function DeviceIcon({ type, ...props }) {
  if (type === "mobile") return <Smartphone {...props} />;
  if (type === "tablet") return <Tablet {...props} />;
  return <Monitor {...props} />;
}

export default function Security() {

  const [serverError, setServerError] = useState("");
  const [serverSuccess, setServerSuccess] = useState("");
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(ChangePasswordSchema),
  });

  const onSubmit = async (data) => {
    setServerError("");
    setServerSuccess("");

    try {
      const response = await fetch(`/api/auth/change-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        }),
        credentials: "include",
      });

      const result = await response.json();

      if (!response.ok) {
        setServerError(result.message || "Failed to change password");
        return;
      }

      setServerSuccess("Password changed successfully!");
      reset();
    } catch (err) {
      console.error(err);
      setServerError("Something went wrong. Please try again.");
    }
  };

  // Placeholder connected devices — replace with real API data when available
  const connectedDevices = [
    {
      id: 1,
      name: "This device",
      type: "desktop",
      browser: "Chrome",
      lastActive: "Now",
      isCurrent: true,
    },
    {
      id: 2,
      name: "This device",
      type: "desktop",
      browser: "Chrome",
      lastActive: "Now",
      isCurrent: true,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-subly-text-primary">
          Security
        </h2>
        <p className="mt-1 text-sm text-subly-text-secondary">
          Manage your password and view connected devices.
        </p>
      </div>

      {/* Change Password */}
      <Card className="rounded-xl border-subly-border bg-subly-card shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-subly-accent text-white">
              <Lock size={16} />
            </span>
            <div>
              <CardTitle className="text-base font-bold text-subly-text-primary">
                Change Password
              </CardTitle>
              <CardDescription>
                Update your password to keep your account secure.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Messages */}
          {serverError && (
            <div className="mb-4 flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-subly-danger">
              <Ban size={14} className="shrink-0" />
              <span>{serverError}</span>
            </div>
          )}
          {serverSuccess && (
            <div className="mb-4 flex items-center gap-2 rounded-xl bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
              <Lock size={14} className="shrink-0" />
              <span>{serverSuccess}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Current Password */}
            <div className="space-y-1.5">
              <Label
                htmlFor="currentPassword"
                className="text-sm font-medium text-slate-700"
              >
                Current password
              </Label>
              <div className="relative">
                <Lock
                  size={16}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <Input
                  id="currentPassword"
                  type={showCurrentPw ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("currentPassword")}
                  className="h-11 rounded-xl border-slate-20focus:border-subly-accent focus:ring-2 focus:ring-subly-sidebar-active"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPw(!showCurrentPw)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showCurrentPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.currentPassword && (
                <div className="flex items-center gap-1.5 text-xs font-medium text-subly-danger">
                  <Ban size={12} />
                  <span>{errors.currentPassword.message}</span>
                </div>
              )}
            </div>

            {/* New Password */}
            <div className="space-y-1.5">
              <Label
                htmlFor="newPassword"
                className="text-sm font-medium text-slate-700"
              >
                New password
              </Label>
              <div className="relative">
                <Lock
                  size={16}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <Input
                  id="newPassword"
                  type={showNewPw ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("newPassword")}
                  className="h-11 rounded-xl border-slate-200 bg-white pl-10 pr-10 text-sm text-slate-900 shadow-xs transition placeholder:text-slate-400 focus:border-subly-accent focus:ring-2 focus:ring-subly-sidebar-active"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPw(!showNewPw)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showNewPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.newPassword && (
                <div className="flex items-center gap-1.5 text-xs font-medium text-subly-danger">
                  <Ban size={12} />
                  <span>{errors.newPassword.message}</span>
                </div>
              )}
            </div>

            {/* Confirm New Password */}
            <div className="space-y-1.5">
              <Label
                htmlFor="confirmPassword"
                className="text-sm font-medium text-slate-700"
              >
                Confirm new password
              </Label>
              <div className="relative">
                <Lock
                  size={16}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  {...register("confirmPassword")}
                  className="h-11 rounded-xl border-slate-200 bg-white pl-10 text-sm text-slate-900 shadow-xs transition placeholder:text-slate-400 focus:border-subly-accent focus:ring-2 focus:ring-subly-sidebar-active"
                />
              </div>
              {errors.confirmPassword && (
                <div className="flex items-center gap-1.5 text-xs font-medium text-subly-danger">
                  <Ban size={12} />
                  <span>{errors.confirmPassword.message}</span>
                </div>
              )}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="group h-11 w-full rounded-xl bg-subly-accent text-sm font-semibold text-white shadow-md shadow-subly-accent/20 transition-all hover:bg-[#0d47a1] hover:shadow-lg hover:shadow-subly-accent/30 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:px-8"
            >
              {isSubmitting ? (
                "Updating..."
              ) : (
                <span className="flex items-center gap-2">
                  Update Password
                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </span>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Connected Devices */}
      <Card className="rounded-xl border-subly-border bg-subly-card shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
              <Monitor size={16} />
            </span>
            <div>
              <CardTitle className="text-base font-bold text-subly-text-primary">
                Connected Devices
              </CardTitle>
              <CardDescription>
                Devices currently signed into your account.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-slate-100">
            {connectedDevices.map((device) => (
              <div
                key={device.id}
                className="flex items-center gap-4 py-4 first:pt-0 last:pb-0"
              >
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                    device.isCurrent
                      ? "bg-subly-accent text-white"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  <DeviceIcon type={device.type} size={18} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-subly-text-primary">
                      {device.name}
                    </p>
                    {device.isCurrent && (
                      <Badge className="bg-green-50 text-green-700 border-green-100 text-[10px] px-1.5 py-0">
                        Current
                      </Badge>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-subly-text-secondary">
                    {device.browser} · Last active: {device.lastActive}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {connectedDevices.length === 0 && (
            <div className="py-8 text-center">
              <Monitor size={32} className="mx-auto mb-3 text-slate-300" />
              <p className="text-sm text-subly-text-secondary">
                No connected devices found.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
