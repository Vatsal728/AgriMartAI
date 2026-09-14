"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Leaf, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PASSWORD_SPECIAL_CHAR_PATTERN = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/;
const PASSWORD_MIN_LENGTH = 8;

function getEmailError(email: string): string | undefined {
  if (!email.trim()) {
    return "Email is required";
  }
  if (!EMAIL_PATTERN.test(email)) {
    return "Enter a valid email address (e.g. farmer@gmail.com)";
  }
  return undefined;
}

function getPasswordError(password: string): string | undefined {
  if (!password) {
    return "Password is required";
  }
  if (password.length < PASSWORD_MIN_LENGTH) {
    return `Password must be at least ${PASSWORD_MIN_LENGTH} characters`;
  }
  if (!PASSWORD_SPECIAL_CHAR_PATTERN.test(password)) {
    return "Password must include at least one special character";
  }
  return undefined;
}

interface FormErrors {
  email?: string;
  password?: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-surface-muted px-4 py-16">
      <div className="pointer-events-none absolute -left-24 -top-24 size-96 rounded-full bg-brand/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-32 right-0 size-80 rounded-full bg-accent/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-64 w-[500px] rounded-full bg-brand/5 blur-3xl" />

      <div className="relative z-10 flex w-full max-w-[480px] flex-col gap-10 rounded-[32px] border border-slate-100 bg-white p-8 shadow-xl sm:p-10">
        <div className="flex flex-col items-center gap-2">
          <div className="flex size-10 items-center justify-center rounded-xl bg-brand">
            <Leaf className="size-5 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-heading text-xl font-bold text-brand">AgriSmart AI</span>
        </div>

        <div className="flex rounded-2xl bg-surface-muted p-1">
          <button
            type="button"
            onClick={() => setMode("login")}
            className={cn(
              "flex-1 rounded-xl py-3 text-sm font-bold",
              mode === "login" ? "bg-white text-slate-900 shadow-sm" : "text-slate-400"
            )}
          >
            Log in
          </button>
          <button
            type="button"
            onClick={() => setMode("signup")}
            className={cn(
              "flex-1 rounded-xl py-3 text-sm font-bold",
              mode === "signup" ? "bg-white text-slate-900 shadow-sm" : "text-slate-400"
            )}
          >
            Sign up
          </button>
        </div>

        <div className="flex flex-col gap-2 text-center">
          <h1 className="font-heading text-2xl font-bold text-slate-900">
            {mode === "login" ? "Welcome Back" : "Create your account"}
          </h1>
          <p className="text-sm text-text-muted">
            {mode === "login" ? "Please enter your farm credentials" : "Set up your AgriSmart AI account"}
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            const emailError = getEmailError(email);
            const passwordError = getPasswordError(password);
            if (emailError || passwordError) {
              setErrors({ email: emailError, password: passwordError });
              return;
            }
            setErrors({});
            router.push(mode === "login" ? "/dashboard" : "/onboarding/language");
          }}
          className="flex flex-col gap-6"
          noValidate
        >
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm font-semibold text-slate-700">
              Email
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-4 top-1/2 size-3.5 -translate-y-1/2 text-slate-400" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) {
                    setErrors((prev) => ({ ...prev, email: undefined }));
                  }
                }}
                onBlur={() => setErrors((prev) => ({ ...prev, email: getEmailError(email) }))}
                placeholder="e.g. farmer@gmail.com"
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "email-error" : undefined}
                className={cn(
                  "w-full rounded-2xl border bg-surface-muted py-4 pl-11 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2",
                  errors.email
                    ? "border-red-400 focus:ring-red-200"
                    : "border-slate-200 focus:ring-brand/30"
                )}
              />
            </div>
            {errors.email && (
              <p id="email-error" className="text-xs font-medium text-red-500">
                {errors.email}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-sm font-semibold text-slate-700">
                Password
              </label>
              {mode === "login" && (
                <button type="button" className="text-sm font-semibold text-brand">
                  Forgot password?
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-4 top-1/2 size-3.5 -translate-y-1/2 text-slate-400" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) {
                    setErrors((prev) => ({ ...prev, password: undefined }));
                  }
                }}
                onBlur={() => setErrors((prev) => ({ ...prev, password: getPasswordError(password) }))}
                placeholder="Enter your password"
                aria-invalid={Boolean(errors.password)}
                aria-describedby={errors.password ? "password-error" : undefined}
                className={cn(
                  "w-full rounded-2xl border bg-surface-muted py-4 pl-11 pr-11 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2",
                  errors.password
                    ? "border-red-400 focus:ring-red-200"
                    : "border-slate-200 focus:ring-brand/30"
                )}
              />
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
              >
                {showPassword ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
              </button>
            </div>
            {errors.password ? (
              <p id="password-error" className="text-xs font-medium text-red-500">
                {errors.password}
              </p>
            ) : (
              mode === "signup" && (
                <p className="text-xs text-text-muted">
                  Min. 8 characters with at least one special character
                </p>
              )
            )}
          </div>

          <button
            type="submit"
            className="rounded-2xl bg-brand py-4 text-base font-bold text-white shadow-lg"
          >
            Continue
          </button>

          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-xs font-medium text-text-muted">or</span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <button
            type="button"
            className="rounded-2xl border border-slate-200 py-4 text-base font-bold text-slate-700"
          >
            Continue with OTP
          </button>
        </form>

        <div className="flex flex-col gap-4">
          <p className="text-center text-sm text-text-muted">Or log in with</p>
          <div className="grid grid-cols-2 gap-4">
            <button type="button" className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 py-3 text-sm font-bold text-slate-700">
              Google
            </button>
            <button type="button" className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 py-3 text-sm font-bold text-slate-700">
              Apple
            </button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-0 right-0 z-10 flex flex-col items-center gap-2 text-xs text-text-faint">
        <p>© 2024 AgriSmart AI Solutions. All rights reserved.</p>
        <div className="flex gap-6 font-medium">
          <Link href="/">Privacy Policy</Link>
          <Link href="/">Terms of Service</Link>
          <Link href="/help-center">Contact Support</Link>
        </div>
      </div>
    </div>
  );
}
