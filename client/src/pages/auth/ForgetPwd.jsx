import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, KeyRound, Ban, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import LoginHero from "@/assets/login-hero.jpg";
import Logo from "@/assets/logo.png";
import VerifyEmail from "@/components/dashboard/VerifyEmail";
import {useSignIn}from '@clerk/react'
import ResetPwd from "@/components/ResetPwd";

const ForgotPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

export default function ForgetPwd() {
    const {signIn, fetchStatus} = useSignIn()
  const [serverError, setServerError] = useState("");

  const [showVerify, setShowVerify] = useState(false)
  const [showResetPassword, setShowResetPassword] = useState(false)
  const routerNavigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(ForgotPasswordSchema),
  });

  const onSubmit = async (data) => {


    try {
      const {error: clerkErr} = await signIn.create({
        identifier: data.email
      })
      if(clerkErr){
        setServerError(clerkErr.message)
        return;
      } 

      const {error: verifyErr} = await signIn.resetPasswordEmailCode.sendCode()

      if(verifyErr){
        setServerError(verifyErr.message)
        return
      }else{
        setShowVerify(true)
      }
    
    } catch (err) {
      console.error(err);
      setServerError("Something went wrong. Please try again.");
    }
  };

  // verify the code

  const handleVerify = async(data)=> {
    try{
        const {error: codeErr} = await signIn.resetPasswordEmailCode.verifyCode({code: data.code})

        if(codeErr){
            setServerError(codeErr.message)
            return; 
        } else{
            setShowResetPassword(true);
            return;
        }
    
    } catch(err){
        console.error(err)
        setServerError('Something went wrong')
    }

  }

  const handleReset = async(data) => {
    try{
        const { error: resetErr } = await signIn.resetPasswordEmailCode.submitPassword({
            password: data.password,
            // Optional: sign the user out of all other authenticated sessions
            signOutOfOtherSessions: true,
          })
          if (resetErr) {
            setServerError(resetErr.message)
            return
          }
      
          if (signIn.status === 'complete') {
            const { error: finalErr } = await signIn.finalize({
              navigate: async ({ session, decorateUrl }) => {
      
                if (session?.currentTask) {
                  console.log(session.currentTask)
                  return
                }
      
                // If no session tasks, navigate the signed-in user to the home page
                const url = decorateUrl('/dashboard')
                if (url.startsWith('http')) {
                  window.location.href = url
                } else {
                  routerNavigate(url, {replace: true})
                }
              },
            })
      
            if (finalErr) {
             setServerError(finalErr.message)
              return
            }
        }
    }catch(err){
        console.error(err);
        setServerError('Something went wrong');
        return
    }
  }
  
  if(showResetPassword){
    return <ResetPwd onSubmit={handleReset} isLoading={fetchStatus === 'fetching'}/>
  }

  if(showVerify){
    return <VerifyEmail onVerify={handleVerify} isVerifying={fetchStatus === 'fetching'}/>
  }

  return (
    <main className="flex min-h-screen bg-white">
      {/* Left Panel — Image / Branding */}
      <div className="relative hidden w-[48%] overflow-hidden lg:block">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1565c0] via-[#1976d2] to-[#0d47a1]" />

        <img
          src={LoginHero}
          alt="Subscription management illustration"
          className="absolute inset-0 h-full w-full object-cover mix-blend-soft-light opacity-60"
        />

        <div className="relative z-20 flex h-full flex-col p-10">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/50 backdrop-blur-2xl">
              <img src={Logo} alt="Subly" className="h-7 w-7 object-contain" />
            </div>
            <span className="text-xl font-bold text-white">Subly</span>
          </div>

          {/* Middle content */}
          <div className="max-w-sm translate-y-45">
            <h2 className="text-3xl font-bold leading-tight text-white">
              Forgot your password? No worries.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-white/80">
              It happens to the best of us. Enter the email address linked to
              your account and we&apos;ll send you a code to reset your
              password.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              <span className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
                Quick Recovery
              </span>
              <span className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
                Secure Reset
              </span>
              <span className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
                Email Verified
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel — Forgot Password Form */}
      <div className="flex w-full flex-col items-center justify-center px-6 py-12 lg:w-[52%] lg:px-16">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#bbdefb]">
              <img src={Logo} alt="Subly" className="h-7 w-7 object-contain" />
            </div>
            <span className="text-xl font-bold text-slate-900">Subly</span>
          </div>

          {/* Icon */}
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#bbdefb]">
            <KeyRound size={28} className="text-[#1565c0]" />
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Reset your password
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              Enter the email address associated with your account and
              we&apos;ll send you a verification code to reset your password.
            </p>
          </div>

          {/* Messages */}
          {serverError && (
            <div className="mb-5 flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-[#e31b23]">
              <Ban size={14} className="shrink-0" />
              <span>{serverError}</span>
            </div>
          )}
         

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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

            <Button
              type="submit"
              disabled={isSubmitting}
              className="group h-11 w-full rounded-xl bg-[#1565c0] text-sm font-semibold text-white shadow-md shadow-[#1565c0]/20 transition-all hover:bg-[#0d47a1] hover:shadow-lg hover:shadow-[#1565c0]/30 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? (
                "Sending..."
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Send Code
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
              Remember your password?
            </span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          {/* Back to login */}
          <Link
            to="/auth/login"
            className="flex h-11 w-full items-center justify-center rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 shadow-xs transition-all hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
          >
            Back to Sign In
          </Link>
        </div>
      </div>
    </main>
  );
}
