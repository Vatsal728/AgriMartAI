"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Leaf, Mail, Lock, Eye, EyeOff, Smartphone, CheckCircle, X, KeyRound } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { TranslationKey } from "@/lib/i18n/LanguageContext";
import { formatNameFromEmail, setUserProfile } from "@/lib/user";
import { AgriSmartAPI } from "@/lib/api";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function getLoginIdError(inputVal: string, t: (key: TranslationKey) => string): string | undefined {
  const clean = inputVal.trim();
  if (!clean) {
    return t("login.error.emailRequired") || "Email or Mobile Number is required";
  }
  const digits = clean.replace(/[^0-9]/g, "");
  const isPhone = digits.length >= 10;
  if (!isPhone && !EMAIL_PATTERN.test(clean)) {
    return "Please enter a valid email address or 10-digit mobile number";
  }
  return undefined;
}

function getPasswordError(password: string, mode: "login" | "signup", t: (key: TranslationKey) => string): string | undefined {
  if (!password) {
    return t("login.error.passwordRequired") || "Password is required";
  }
  if (mode === "signup" && password.length < 6) {
    return "Password must be at least 6 characters";
  }
  if (mode === "login" && password.length < 4) {
    return "Password is too short";
  }
  return undefined;
}

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

export default function LoginPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  // Direct Forgot Password Modal State
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotLoginId, setForgotLoginId] = useState("");
  const [forgotNewPassword, setForgotNewPassword] = useState("");
  const [showForgotNewPassword, setShowForgotNewPassword] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState("");
  const [forgotSuccess, setForgotSuccess] = useState("");

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError("");
    setForgotSuccess("");

    const cleanId = forgotLoginId.trim();
    if (!cleanId) {
      setForgotError("Please enter your registered Email or Mobile Number");
      return;
    }
    if (!forgotNewPassword || forgotNewPassword.length < 4) {
      setForgotError("Password must be at least 4 characters long");
      return;
    }

    setForgotLoading(true);
    try {
      await AgriSmartAPI.resetPassword(cleanId, forgotNewPassword);
      setForgotSuccess("Password updated successfully! You can now log in.");
      setEmail(cleanId);
      setPassword(forgotNewPassword);
      setTimeout(() => {
        setIsForgotModalOpen(false);
        setForgotSuccess("");
        setForgotError("");
      }, 2000);
    } catch (err: any) {
      setForgotError(err?.message || "No account found with this email/mobile number. Please check and try again.");
    } finally {
      setForgotLoading(false);
    }
  };

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
          <span className="font-heading text-xl font-bold text-brand">{t("common.appName")}</span>
        </div>

        <div className="flex rounded-2xl bg-surface-muted p-1">
          <button
            type="button"
            onClick={() => {
              setMode("login");
              setErrors({});
            }}
            className={cn(
              "flex-1 rounded-xl py-3 text-sm font-bold transition",
              mode === "login" ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"
            )}
          >
            {t("login.tab.login")}
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("signup");
              setErrors({});
            }}
            className={cn(
              "flex-1 rounded-xl py-3 text-sm font-bold transition",
              mode === "signup" ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"
            )}
          >
            {t("login.tab.signup")}
          </button>
        </div>

        <div className="flex flex-col gap-2 text-center">
          <h1 className="font-heading text-2xl font-bold text-slate-900">
            {mode === "login" ? t("login.title.login") : t("login.title.signup")}
          </h1>
          <p className="text-sm text-text-muted">
            {mode === "login" ? t("login.subtitle.login") : t("login.subtitle.signup")}
          </p>
        </div>

        {errors.general && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-center text-sm font-semibold text-red-600">
            {errors.general}
          </div>
        )}

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const idError = getLoginIdError(email, t);
            const passwordError = getPasswordError(password, mode, t);
            if (idError || passwordError) {
              setErrors({ email: idError, password: passwordError });
              return;
            }
            setErrors({});
            setIsLoading(true);

            try {
              const cleanInput = email.trim();
              const digits = cleanInput.replace(/[^0-9]/g, "");
              const isPhone = digits.length >= 10;
              const displayName = isPhone ? `Farmer (${digits.slice(-4)})` : formatNameFromEmail(cleanInput);

              if (mode === "signup") {
                const user = await AgriSmartAPI.register(
                  isPhone
                    ? { full_name: displayName, phone_number: cleanInput, password }
                    : { full_name: displayName, email: cleanInput.toLowerCase(), password }
                );
                setUserProfile({ email: user.email || cleanInput, name: user.full_name || displayName });
                router.push("/onboarding/language");
              } else {
                const user = await AgriSmartAPI.login(cleanInput, password);
                setUserProfile({ email: user.email || cleanInput, name: user.full_name || displayName });
                router.push("/dashboard");
              }
            } catch (err: any) {
              const msg = err?.message || (mode === "login" ? "Invalid email/mobile or password. Please check your credentials." : "Registration failed. Account may already exist.");
              setErrors({ general: msg });
            } finally {
              setIsLoading(false);
            }
          }}
          className="flex flex-col gap-6"
          noValidate
        >
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm font-semibold text-slate-700">
              Email or Mobile Number
            </label>
            <div className="relative">
              {email.replace(/[^0-9]/g, "").length >= 10 ? (
                <Smartphone className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              ) : (
                <Mail className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              )}
              <input
                id="email"
                type="text"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) {
                    setErrors((prev) => ({ ...prev, email: undefined }));
                  }
                }}
                onBlur={() => setErrors((prev) => ({ ...prev, email: getLoginIdError(email, t) }))}
                placeholder="e.g. 9876543210 or farmer@gmail.com"
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
                {t("login.label.password")}
              </label>
              {mode === "login" && (
                <button
                  type="button"
                  onClick={() => {
                    setForgotLoginId(email.trim());
                    setForgotNewPassword("");
                    setForgotError("");
                    setForgotSuccess("");
                    setIsForgotModalOpen(true);
                  }}
                  className="text-sm font-semibold text-brand hover:underline"
                >
                  {t("login.forgotPassword")}
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
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
                onBlur={() => setErrors((prev) => ({ ...prev, password: getPasswordError(password, mode, t) }))}
                placeholder={t("login.placeholder.password")}
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
                aria-label={showPassword ? t("login.hidePassword") : t("login.showPassword")}
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            {errors.password ? (
              <p id="password-error" className="text-xs font-medium text-red-500">
                {errors.password}
              </p>
            ) : (
              mode === "signup" && (
                <p className="text-xs text-text-muted">{t("login.passwordHint")}</p>
              )
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={cn(
              "rounded-2xl bg-brand py-4 text-base font-bold text-white shadow-lg transition active:scale-[0.99]",
              isLoading ? "opacity-70 cursor-not-allowed" : "hover:bg-brand/90"
            )}
          >
            {isLoading ? (mode === "signup" ? "Creating Account..." : "Signing In...") : t("common.continue")}
          </button>
        </form>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-xs font-medium text-text-muted">{t("login.or")}</span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => {
                setEmail("farmer@gmail.com");
                setPassword("farm1234");
              }}
              className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 transition"
            >
              Demo Email
            </button>
            <button
              type="button"
              onClick={() => {
                setEmail("9876543210");
                setPassword("farm1234");
              }}
              className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 transition"
            >
              Demo Mobile
            </button>
          </div>
        </div>
      </div>

      {/* Direct Forgot Password Modal */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl border border-slate-100 bg-white p-6 sm:p-8 shadow-2xl">
            <button
              type="button"
              onClick={() => setIsForgotModalOpen(false)}
              className="absolute right-5 top-5 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
            >
              <X className="size-5" />
            </button>

            <div className="flex flex-col gap-2 mb-6">
              <div className="flex size-11 items-center justify-center rounded-2xl bg-brand/10 text-brand">
                <KeyRound className="size-6" />
              </div>
              <h2 className="font-heading text-xl font-bold text-slate-900 mt-2">Reset Password</h2>
              <p className="text-xs text-text-muted">
                Enter your registered Email or Mobile Number and choose a new password. It will update instantly in the database.
              </p>
            </div>

            {forgotError && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-600">
                {forgotError}
              </div>
            )}

            {forgotSuccess && (
              <div className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-700">
                <CheckCircle className="size-4 shrink-0" />
                <span>{forgotSuccess}</span>
              </div>
            )}

            <form onSubmit={handleForgotPasswordSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Registered Email or Mobile Number
                </label>
                <input
                  type="text"
                  value={forgotLoginId}
                  onChange={(e) => setForgotLoginId(e.target.value)}
                  placeholder="e.g. 9876543210 or farmer@gmail.com"
                  className="w-full rounded-xl border border-slate-200 bg-surface-muted px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand/30"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Enter New Password
                </label>
                <div className="relative">
                  <input
                    type={showForgotNewPassword ? "text" : "password"}
                    value={forgotNewPassword}
                    onChange={(e) => setForgotNewPassword(e.target.value)}
                    placeholder="Enter at least 4 characters"
                    className="w-full rounded-xl border border-slate-200 bg-surface-muted px-4 py-3 pr-11 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand/30"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowForgotNewPassword((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showForgotNewPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              <div className="flex gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setIsForgotModalOpen(false)}
                  className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className={cn(
                    "flex-1 rounded-xl bg-brand py-3 text-sm font-bold text-white shadow-md transition",
                    forgotLoading ? "opacity-70 cursor-not-allowed" : "hover:bg-brand/90"
                  )}
                >
                  {forgotLoading ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="absolute bottom-6 left-0 right-0 z-10 flex flex-col items-center gap-2 text-xs text-text-faint">
        <p>{t("login.footer.rights")}</p>
        <div className="flex gap-6 font-medium">
          <Link href="/">{t("common.privacyPolicy")}</Link>
          <Link href="/">{t("login.footer.terms")}</Link>
          <Link href="/help-center">{t("login.footer.contactSupport")}</Link>
        </div>
      </div>
    </div>
  );
}

