import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Lock, Ban, Eye, EyeOff, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Logo from "@/assets/logo.png";

const ResetPasswordSchema = z
  .object({
    password: z
      .string({ required_error: "Password is required" })
      .min(8, { message: "Must be at least 8 characters" })
      .regex(/[A-Z]/, { message: "Must contain at least one uppercase letter" })
      .regex(/[0-9]/, { message: "Must contain at least one number" })
      .regex(/[^A-Za-z0-9]/, {
        message: "Must contain at least one special character",
      }),
    confirmPassword: z.string({
      required_error: "Please confirm your password",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const ResetPwd = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(ResetPasswordSchema),
  });

  const onSubmit = (data) => {
    console.log("Form data:", data);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-8 shadow-lg shadow-slate-200/60 sm:px-8 sm:py-10">
          {/* Logo + icon */}
          <div className="mb-6 flex flex-col items-center text-center">
            <div className="mb-4 flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#bbdefb]">
                <img
                  src={Logo}
                  alt="Subly"
                  className="h-6 w-6 object-contain"
                />
              </div>
              <span className="text-lg font-bold text-slate-900">Subly</span>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#bbdefb]">
              <KeyRound size={24} className="text-[#1565c0]" />
            </div>

            <h1 className="mt-4 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              Set a new password
            </h1>
            <p className="mt-1.5 text-sm text-slate-500">
              Choose a strong password to secure your account.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Password */}
            <div className="space-y-1.5">
              <Label
                htmlFor="password"
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
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("password")}
                  className="h-11 rounded-xl border-slate-200 bg-white pl-10 pr-10 text-sm text-slate-900 shadow-xs transition placeholder:text-slate-400 focus:border-[#1565c0] focus:ring-2 focus:ring-[#bbdefb]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <div className="flex items-center gap-1.5 text-xs font-medium text-[#e31b23]">
                  <Ban size={12} />
                  <span>{errors.password.message}</span>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <Label
                htmlFor="confirmPassword"
                className="text-sm font-medium text-slate-700"
              >
                Confirm password
              </Label>
              <div className="relative">
                <Lock
                  size={16}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <Input
                  id="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("confirmPassword")}
                  className="h-11 rounded-xl border-slate-200 bg-white pl-10 pr-10 text-sm text-slate-900 shadow-xs transition placeholder:text-slate-400 focus:border-[#1565c0] focus:ring-2 focus:ring-[#bbdefb]"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600"
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <div className="flex items-center gap-1.5 text-xs font-medium text-[#e31b23]">
                  <Ban size={12} />
                  <span>{errors.confirmPassword.message}</span>
                </div>
              )}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="group h-11 w-full rounded-xl bg-[#1565c0] text-sm font-semibold text-white shadow-md shadow-[#1565c0]/20 transition-all hover:bg-[#0d47a1] hover:shadow-lg hover:shadow-[#1565c0]/30 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Reset Password
            </Button>
          </form>
        </div>

        {/* Footer below card */}
        <p className="mt-6 text-center text-xs text-slate-400">
          Remembered your password?{" "}
          <a
            href="/auth/login"
            className="font-medium text-[#1565c0] hover:underline"
          >
            Sign in
          </a>
        </p>
      </div>
    </main>
  );
};

export default ResetPwd;