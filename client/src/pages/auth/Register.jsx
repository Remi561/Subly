import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchemas } from "@/lib/zodType";

import {
  Ban,
  Mail,
  Lock,
  User,
  Globe,
  ArrowRight,
  KeyRound,
} from "lucide-react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import LoginHero from "@/assets/login-hero.jpg";
import Logo from "@/assets/logo.png";
import {useSignUp} from '@clerk/react'
import { useState } from "react";
import VerifyEmail from "@/components/dashboard/VerifyEmail";
import {useNavigate }from 'react-router'

export default function Register() {



  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(RegisterSchemas),
    defaultValues: {
      baseCurrency: "USD",
    },
  });


  // clerk hook 
  const {signUp, fetchStatus, errors: clerkErr } = useSignUp()

  // react hooks
  const [showVerify, setShowVerify] = useState(false);
  const [showError, setShowError] = useState('');  

  const routerNavigate = useNavigate()


  


const isVerifying = fetchStatus === 'fetching'

  //form submit function 
  const onSubmit = async(data) => {
    try{
       const {error} = await signUp.create({
          firstName: data.firstName,
          lastName: data.lastName,
          username: data.username,
          emailAddress: data.email,
          password: data.password, 
        unsafeMetadata:{
          baseCurrency: data.baseCurrency
        }
       })

       if(error){
          console.error(JSON.stringify(error, null, 2))
          return;
       }

      const {error :codeErr} =  await signUp.verifications.sendEmailCode()

      if(codeErr){
        console.error(JSON.stringify( codeErr, null, 2))
        return;
     }

      setShowVerify(true)
      return;

       
    } catch(err){
        console.error('Login failed', err)
    }
  }

  // verify the email 
  const handleVerify = async (data) => {
    
    try{
     
        const {error} =  await signUp.verifications.verifyEmailCode({code: data.code})

        if(error){
          console.log(error)
          setShowError(error.message)
           return ; 
        }
       
        // Navigate to the dashboard once everything is right 

        if(signUp.status === 'complete'){
            signUp.finalize({
                navigate: ({session, decorateUrl})=> {
                    if(session?.currentTask){
                        console.log(session?.currentTask)
                        return
                    }
                    const url = decorateUrl('/dashboard')

                    if(url.startsWith('http')){
                        window.location.href = url;
                       
                    } else{
                        
                        routerNavigate(url, {replace: true})
                    }
                }
            })
        }
    } catch(err){
        console.error(err)
        return;
    }
  }

  if(showVerify){
    return <VerifyEmail onVerify={handleVerify} isVerifying={isVerifying} showError={showError}/>
  }

  const isLoading = fetchStatus === 'fetching'
  
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
        <div className="relative z-10 flex h-full flex-col  p-10">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
              <img src={Logo} alt="Subly" className="h-7 w-7 object-contain" />
            </div>
            <span className="text-xl font-bold text-white">Subly</span>
          </div>

          {/* Middle content */}
          <div className="max-w-sm translate-y-45">
            <h2 className="text-3xl font-bold leading-tight text-white">
              Start tracking your subscriptions today
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-white/80">
              Join thousands of users who save money by staying on top of their
              recurring payments. Set up your account in seconds and gain full
              visibility over your spending.
            </p>

            {/* Feature pills */}
            <div className="mt-6 flex flex-wrap gap-2">
              <span className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
                Free Forever
              </span>
              <span className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
                No Credit Card
              </span>
              <span className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
                Instant Setup
              </span>
            </div>
          </div>

          
        </div>
      </div>

      {/* Right Panel — Register Form */}
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
              Create your account
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Fill in your details to get started with Subly
            </p>
          </div>

          {/* Server error */}
          {clerkErr?.global?.map((error) => (
            <p key={error.code}>
              {error.message}
            </p>
          ))}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)}  className="space-y-4">
            {/* Name & Username row */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Full Name */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="name"
                  className="text-sm font-medium text-slate-700"
                >
                  First Name 
                </Label>
                <div className="relative">
                  <User
                    size={16}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="John"
                    {...register("firstName")}
                    className="h-11 rounded-xl border-slate-200 bg-white pl-10 text-sm text-slate-900 shadow-xs transition placeholder:text-slate-400 focus:border-[#1565c0] focus:ring-2 focus:ring-[#bbdefb]"
                  />
                </div>
                {errors.firstName && (
                  <div className="flex items-center gap-1.5 text-xs font-medium text-[#e31b23]">
                    <Ban size={12} />
                    <span>{errors.firstName.message}</span>
                  </div>
                )}
              </div>


                {/* Last name */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="lastName"
                  className="text-sm font-medium text-slate-700"
                >
                  Last Name 
                </Label>
                <div className="relative">
                  <User
                    size={16}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Doe"
                    {...register("lastName")}
                    className="h-11 rounded-xl border-slate-200 bg-white pl-10 text-sm text-slate-900 shadow-xs transition placeholder:text-slate-400 focus:border-[#1565c0] focus:ring-2 focus:ring-[#bbdefb]"
                  />
                </div>
                {errors.lastName && (
                  <div className="flex items-center gap-1.5 text-xs font-medium text-[#e31b23]">
                    <Ban size={12} />
                    <span>{errors.lastName.message}</span>
                  </div>
                )}
              </div>
              
            </div>

                {/* Username */}
            <div className="space-y-1.5">
                <Label
                  htmlFor="username"
                  className="text-sm font-medium text-slate-700"
                >
                  Username
                </Label>
                <div className="relative">
                  <KeyRound
                    size={16}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <Input
                    id="username"
                    type="text"
                    placeholder="John@12"
                    {...register("username")}
                    className="h-11 rounded-xl border-slate-200 bg-white pl-10 text-sm text-slate-900 shadow-xs transition placeholder:text-slate-400 focus:border-[#1565c0] focus:ring-2 focus:ring-[#bbdefb]"
                  />
                </div>
                {errors.username && (
                  <div className="flex items-center gap-1.5 text-xs font-medium text-[#e31b23]">
                    <Ban size={12} />
                    <span>{errors.username.message}</span>
                  </div>
                )}
              </div>

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

            {/* Country / Currency */}
            <div className="space-y-1.5">
              <Label
                htmlFor="baseCurrency"
                className="text-sm font-medium text-slate-700"
              >
                Country currency
              </Label>
              <div className="relative">
                <Globe
                  size={16}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <select
                  id="baseCurrency"
                  {...register("baseCurrency")}
                  className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-900 shadow-xs transition focus:border-[#1565c0] focus:ring-2 focus:ring-[#bbdefb] focus:outline-none"
                >
                  <option value="USD">USD — US Dollar</option>
                  <option value="EUR">EUR — Euro</option>
                  <option value="GBP">GBP — British Pound</option>
                  <option value="NGN">NGN — Nigerian Naira</option>
                  <option value="CAD">CAD — Canadian Dollar</option>
                  <option value="AUD">AUD — Australian Dollar</option>
                  <option value="JPY">JPY — Japanese Yen</option>
                  <option value="INR">INR — Indian Rupee</option>
                  <option value="CNY">CNY — Chinese Yuan</option>
                  <option value="BRL">BRL — Brazilian Real</option>
                </select>
              </div>
              <p className="text-xs text-slate-400 pl-1">
                Choose carefully — this cannot be changed later
              </p>
              {errors.baseCurrency && (
                <div className="flex items-center gap-1.5 text-xs font-medium text-[#e31b23]">
                  <Ban size={12} />
                  <span>{errors.baseCurrency.message}</span>
                </div>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-slate-700"
              >
                Password
              </Label>
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
                  type="password"
                  placeholder="••••••••"
                  {...register("confirmPassword")}
                  className="h-11 rounded-xl border-slate-200 bg-white pl-10 text-sm text-slate-900 shadow-xs transition placeholder:text-slate-400 focus:border-[#1565c0] focus:ring-2 focus:ring-[#bbdefb]"
                />
              </div>
              {errors.confirmPassword && (
                <div className="flex items-center gap-1.5 text-xs font-medium text-[#e31b23]">
                  <Ban size={12} />
                  <span>{errors.confirmPassword.message}</span>
                </div>
              )}
            </div>

            <div id="clerk-captcha" />

            {/* Submit */}
            <Button
              type="submit"
          
              className="group mt-2 h-11 w-full rounded-xl bg-subly-brand-blue text-sm font-semibold text-white shadow-md shadow-subly-accent/20 transition-all hover:bg-[#0d47a1] hover:shadow-lg hover:shadow-[#1565c0]/30 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting || isLoading ? (
                "Creating account..."
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Create Account
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
              Already have an account?
            </span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          {/* Login link */}
          <Link
            to="/auth/login"
            className="flex h-11 w-full items-center justify-center rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 shadow-xs transition-all hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
          >
            Sign in instead
          </Link>

          {/* Footer */}
          <p className="mt-8 text-center text-xs text-slate-400">
            By creating an account, you agree to our{" "}
            <span className="cursor-pointer text-[#1565c0] hover:underline">
              Terms of Service
            </span>{" "}
            and{" "}
            <span className="cursor-pointer text-[#1565c0] hover:underline">
              Privacy Policy
            </span>
          </p>
        </div>
      </div>
    </main>
  );
}
