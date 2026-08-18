
import { ShieldCheck, ArrowRight } from "lucide-react";
import { Link} from "react-router";
import { Button } from "@/components/ui/button";

import Logo from "@/assets/logo.png";

import { Input } from "../ui/input";

import { Field, FieldLabel, FieldError } from "../ui/field";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CodeSchemas } from "@/lib/zodType";
import { number } from "zod";



export default function VerifyEmail({onVerify, isVerifying, showError}) {

  //verify Input

  const {register, handleSubmit, formState: {errors: inputError, isSubmitting}} = useForm({
    resolver: zodResolver(CodeSchemas)
  })
 








   
  

  // Resend verification code
 



  return (
    <main className="flex min-h-screen bg-white">

      

      {/* Right Panel — Verification Form */}
      <form onSubmit={handleSubmit(onVerify)} className="flex w-full flex-col items-center justify-center px-6 py-12 lg:w-[52%] lg:px-16">

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
                    <ShieldCheck size={28} className="text-[#1565c0]" />
                </div>

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                    Verify your email
                    </h1>
                    <p className="mt-2 text-sm leading-relaxed text-slate-500">
                    We sent a 6-digit verification code to your email address. Enter
                    the code below to verify your account.
                    </p>
                </div>

                {showError && <p className="text-xs border border-subly-danger p-2 rounded-md mb-3 bg-red-300 text-subly-danger ">{showError}</p>}

                {/* 6-digit code inputs */}
                <Field className="mb-8">
                    <FieldLabel htmlFor={'code'} className="mb-3 block text-sm font-medium text-slate-700">
                      Verification code
                    </FieldLabel>
                

                   <Input placeholder={'Enter your code'} id={'code'} name={'code'} type={'number'} {...register('code')} />
                   {inputError.code && (
                      <FieldError>{inputError.code.message}</FieldError>)}
                </Field>

                {/* Buttons */}
                <div className="space-y-3">
                    {/* Verify button */}
                    <Button
                    type="submit"
                    
                    
                    className="group h-11 w-full rounded-xl bg-[#1565c0] text-sm font-semibold text-white shadow-md shadow-[#1565c0]/20 transition-all hover:bg-[#0d47a1] hover:shadow-lg hover:shadow-[#1565c0]/30 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                    {isVerifying || isSubmitting? (
                        "Verifying..."
                    ) : (
                        <span className="flex items-center justify-center gap-2">
                        Verify Code
                        <ArrowRight
                            size={16}
                            className="transition-transform group-hover:translate-x-0.5"
                        />
                        </span>
                    )}
                    </Button>

                    {/* Resend button */}
                    
                </div>

                {/* Divider */}
                <div className="my-6 flex items-center gap-3">
                    <div className="h-px flex-1 bg-slate-200" />
                    <span className="text-xs font-medium text-slate-400">
                    Need help?
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

                {/* Footer */}
                {/* <p className="mt-8 text-center text-xs text-slate-400">
                    {/* Didn&apos;t receive the email? Check your spam folder or{" "}
                    <button
                    type="button"
                    onClick={handleResend}
                    disabled={resendCooldown > 0}
                    className="cursor-pointer text-[#1565c0] hover:underline disabled:cursor-not-allowed disabled:text-slate-400"
                    >
                    request a new code
                    </button>
                </p> */} 
            </div>
      </form>
    </main>
  );
}
