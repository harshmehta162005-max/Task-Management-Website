"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { SVGProps } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { useSignUp } from "@clerk/nextjs/legacy";
import { AuthCard } from "@/components/auth/AuthCard";
import { OAuthButton } from "@/components/auth/OAuthButton";
import { AuthDivider } from "@/components/auth/AuthDivider";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { TermsCheckbox } from "@/components/auth/TermsCheckbox";
import { cn } from "@/lib/utils/cn";

export default function SignupPage() {
  const router = useRouter();
  const { signUp, isLoaded, setActive } = useSignUp();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const errors = useMemo(() => {
    const list: Record<string, string> = {};
    if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) list.email = "Enter a valid email";
    if (password && password.length < 8) list.password = "Password must be at least 8 characters";
    if (confirm && confirm !== password) list.confirm = "Passwords do not match";
    if (agree === false && (fullName || email || password || confirm)) list.terms = "You must accept the terms";
    return list;
  }, [email, password, confirm, agree, fullName]);

  const GoogleIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg height="20" width="20" viewBox="0 0 24 24" aria-hidden focusable="false" {...props}>
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );

  const handleGoogleSignUp = async () => {
    if (!isLoaded || !signUp) return;
    try {
      await signUp.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/create-workspace",
      });
    } catch (err: any) {
      setServerError(err.errors?.[0]?.longMessage || "Google sign-up failed. Please try again.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded || !signUp) return;
    if (Object.keys(errors).length > 0 || !agree) return;

    setLoading(true);
    setServerError(null);
    try {
      await signUp.create({
        firstName: fullName.split(" ")[0] || fullName,
        lastName: fullName.split(" ").slice(1).join(" ") || undefined,
        emailAddress: email,
        password,
      });

      // Prepare email verification
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      // Redirect to verify-email page
      router.push("/verify-email");
    } catch (err: any) {
      const msg = err.errors?.[0]?.longMessage || err.errors?.[0]?.message || "Sign up failed. Please try again.";
      setServerError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mesh-gradient flex min-h-screen items-center justify-center bg-background-light px-6 py-10 text-slate-900 dark:bg-background-dark">
      <div className="w-full max-w-[480px] space-y-8">
        <div className="flex flex-col items-center">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-white">
              <span className="material-symbols-outlined text-2xl">grid_view</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">TeamOS</h2>
          </div>
          <h1 className="text-center text-3xl font-bold leading-tight text-slate-900 dark:text-white">Create your account</h1>
          <p className="mt-2 text-center text-base text-slate-500 dark:text-slate-400">Start organizing work in minutes</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-2xl dark:border-primary/20 dark:bg-[#111827]">
          <OAuthButton label="Continue with Google" Icon={GoogleIcon} onClick={handleGoogleSignUp} />

          <div className="my-6">
            <AuthDivider />
          </div>

          {serverError && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-400">
              {serverError}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-300">Full Name</label>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white"
                type="text"
                required
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-300">Work Email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className={cn(
                  "w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white",
                  errors.email && "border-red-500/60 focus:border-red-500 focus:ring-red-200"
                )}
                type="email"
                required
              />
              {errors.email ? (
                <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-red-500">
                  <AlertCircle className="h-3.5 w-3.5" /> {errors.email}
                </p>
              ) : null}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-300">Password</label>
              <PasswordInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                error={errors.password}
                required
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-300">Confirm Password</label>
              <PasswordInput
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="••••••••"
                error={errors.confirm}
                required
              />
            </div>

            <TermsCheckbox checked={agree} onChange={setAgree} error={errors.terms} />

            <button
              type="submit"
              disabled={loading || !isLoaded}
              className="mt-2 flex w-full items-center justify-center rounded-xl bg-primary px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/25 transition-all duration-150 hover:bg-[#4338CA] disabled:cursor-not-allowed disabled:opacity-70 active:scale-[0.99]"
            >
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Create account
            </button>
          </form>

          <div className="mt-8 border-t border-slate-100 pt-6 text-center dark:border-slate-800">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Already have an account?
              <a className="ml-1 font-bold text-primary hover:underline" href="/login">
                Sign in
              </a>
            </p>
          </div>
        </div>

        <div className="flex justify-center gap-6 text-xs font-medium uppercase tracking-tight text-slate-500 dark:text-slate-500">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">verified_user</span> 256-bit AES Encryption
          </span>
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">cloud_done</span> SOC2 Type II Certified
          </span>
        </div>
      </div>
    </div>
  );
}
