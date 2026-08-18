import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchemas } from "@/lib/zodType";
import { Ban, Mail, Lock, ArrowRight } from "lucide-react";

import { Link, useNavigate} from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import LoginHero from "@/assets/login-hero.jpg";
import Logo from "@/assets/logo.png";
import {useSignIn} from '@clerk/react'
import { useState } from "react";



export const Login = () => {

  const [error, setError] = useState('')
  const routerNavigate = useNavigate();

    // react hook form validation
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(LoginSchemas),
  });

  // clerk login hook

  const {signIn, fetchStatus} = useSignIn();


  const isLoading = fetchStatus === 'fetching';

  const onSubmit = async(data) => {
        try { 
          const {error} =  await signIn.password({
                emailAddress: data.email,
                password: data.password 
            })

            if(error){
              if(error.errors[0].code === 'form_identifier_not_found' || error.errors[0].code === 'form_password_incorrect'){
                setError('Invalid Input');
                return
              } else{
                setError('Something went wrong. Please again later')
              }
              console.log(error)
              console.error(JSON.stringify(error, null, 2))
            }
           
            if(signIn.status === 'complete'){
                await signIn.finalize({
                    navigate: ({session, decorateUrl}) => {
                        if(session?.currentTask){
                            console.log(session?.currentTask)
                            return;
                        }
                        
                        const url = decorateUrl('/dashboard')

                        if(url.startsWith('http')){
                            window.location.href = url 
                        } else{
                            return routerNavigate(url)
                        }

                    }
                })
            } else if(signIn.status === 'needs_client_trust'){
                const emailLinkFactor = signIn.supportedSecondFactors.find(factor => factor.strategy === 'email_link')

                console.log(emailLinkFactor)
                return;
            }else{
              console.log('Sign in attempt failed', signIn.status)

                return
            }

        } catch(err){
            console.error(`Login error, ${err}`);
        }
  }


  return (
    <main className="flex min-h-screen bg-white">
      {/* Left Panel — Image / Branding */}
      <div className="relative hidden w-[48%] overflow-hidden lg:block">
        {/* Background gradient layer */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1565c0] via-[#1976d2] to-[#0d47a1]" />

        {/* Hero image with overlay */}
        <img
          src={LoginHero}
          alt="Subscription management illustration"
          className="absolute inset-0 h-full w-full object-cover mix-blend-soft-light opacity-60"
        />

        {/* Content overlay */}
        <div className="relative z-20 flex h-full flex-col  p-10">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl z-20 bg-white/50 backdrop-blur-2xl">
              <img src={Logo} alt="Subly" className="h-7 w-7 object-contain" />
            </div>
            <span className="text-xl font-bold text-white">Subly</span>
          </div>

          {/* Middle content */}
          <div className="max-w-sm translate-y-45">
            <h2 className="text-3xl font-bold leading-tight text-white">
              Take control of your digital subscriptions
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-white/80">
              Stop leaking money on forgotten renewals. Subly tracks all your
              streaming tools, SaaS packages, and utilities in one
              place—complete with automatic currency conversion and spending
              analytics.
            </p>

            {/* Feature pills */}
            <div className="mt-6 flex flex-wrap gap-2">
              <span className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
                Multi-Currency
              </span>
              <span className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
                Smart Reminders
              </span>
              <span className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
                Spending Analytics
              </span>
            </div>
          </div>

          {/* Bottom testimonial / trust */}
          
        </div>
      </div>

      {/* Right Panel — Login Form */}
      <div className="flex w-full flex-col items-center justify-center px-6 py-12 lg:w-[52%] lg:px-16">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#bbdefb]">
              <img src={Logo} alt="Subly" className="h-7 w-7 object-contain" />
            </div>
            <span className="text-xl font-bold text-slate-900">Subly</span>


          </div>

      

          {/* Header */}
          <div className="mb-8">

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Welcome back
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Sign in to your account to manage your subscriptions
            </p>
          </div>

          {error && !isLoading ? <p className="text-sm text-subly-danger bg-red-200 rounded-sm w-full mb-4 border border-subly-danger p-2">{error}</p>: null}
          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <div className="space-y-1.5">
              <Label
                    htmlFor="email"
                className="text-sm font-medium text-slate-700"
                >
                    Email address
              </Label>
              <div className="relative">
                <Mail
                  size={16}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <Input
                  id="email"
                    type="email"
                    placeholder="you@example.com"
                    {...register("email")}
                  className="h-11 rounded-xl border-slate-200 bg-white pl-10 text-sm text-slate-900 shadow-xs transition placeholder:text-slate-400 focus:border-[#1565c0] focus:ring-2 focus:ring-[#bbdefb]"
                />
                </div>
              {errors.email && (
                <div className="flex items-center gap-1.5 text-xs font-medium text-[#e31b23]">
                  <Ban size={12} />
                  <span>{errors.email.message}</span>
                   </div>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label
                htmlFor="password"
                  className="text-sm font-medium text-slate-700"
              >
                Password
                </Label>
                <Link
                  to="/auth/forgot-password"
                  className="text-xs font-medium text-[#1565c0] hover:text-[#0d47a1] transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock
                  size={16}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <Input
                id="password"
                  type="password"
                placeholder="••••••••"
                  {...register("password")}
                  className="h-11 rounded-xl border-slate-200 bg-white pl-10 text-sm text-slate-900 shadow-xs transition placeholder:text-slate-400 focus:border-[#1565c0] focus:ring-2 focus:ring-[#bbdefb]"
                />
              </div>
              {errors.password && (
                <div className="flex items-center gap-1.5 text-xs font-medium text-[#e31b23]">
                  <Ban size={12} />
                  <span>{errors.password.message}</span>
                </div>
              )}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="group h-11 w-full rounded-xl bg-[#1565c0] text-sm font-semibold text-white shadow-md shadow-[#1565c0]/20 transition-all hover:bg-[#0d47a1] hover:shadow-lg hover:shadow-[#1565c0]/30 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting || isLoading ? (
                "Signing in..."
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Sign In
                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </span>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-xs font-medium text-slate-400">
              New to Subly?
            </span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          {/* Register link */}
          <Link
            to="/auth/register"
            className="flex h-11 w-full items-center justify-center rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 shadow-xs transition-all hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
          >
            Create an account
          </Link>

          {/* Footer */}
          <p className="mt-8 text-center text-xs text-slate-400">
            By signing in, you agree to our{" "}
            <span className="text-[#1565c0] hover:underline cursor-pointer">
              Terms of Service
            </span>{" "}
            and{" "}
            <span className="text-[#1565c0] hover:underline cursor-pointer">
              Privacy Policy
            </span>
          </p>
        </div>
      </div>
    </main>
  );
};
