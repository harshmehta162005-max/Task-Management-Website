"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useSignIn } from "@clerk/nextjs/legacy";

export default function LoginPage() {
  const router = useRouter();
  const { signIn, isLoaded, setActive } = useSignIn();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const GoogleIcon = () => (
    <svg height="20" width="20" viewBox="0 0 24 24" aria-hidden focusable="false">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );

  const handleGoogleSignIn = async () => {
    if (!isLoaded || !signIn) return;
    try {
      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/api/auth/callback",
        redirectUrlComplete: "/workspace-selector",
      });
    } catch (err: any) {
      setError(err.errors?.[0]?.longMessage || "Google sign-in failed. Please try again.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded || !signIn) return;
    setLoading(true);
    setError(null);
    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/workspace-selector");
      } else {
        // Handle other statuses (e.g., needs_second_factor)
        setError("Additional verification required. Please check your email.");
      }
    } catch (err: any) {
      const msg = err.errors?.[0]?.longMessage || err.errors?.[0]?.message || "Invalid email or password.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-background-light px-4 py-10 text-slate-900 dark:bg-background-dark">
      <div className="mx-auto flex max-w-[480px] flex-col items-center">
        <div className="mb-8 flex flex-col items-center">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <span className="material-symbols-outlined text-2xl text-white">grid_view</span>
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">TeamOS</span>
          </div>
        </div>

        <div className="w-full rounded-2xl border border-slate-200 bg-white p-8 shadow-xl dark:border-white/10 dark:bg-[#111827] md:p-10">
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-2xl font-bold text-slate-900 dark:text-slate-100">Welcome back</h1>
            <p className="text-slate-500 dark:text-slate-400">Sign in to your workspace</p>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-900 transition-colors duration-200 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700/50"
          >
            <GoogleIcon />
            <span>Continue with Google</span>
          </button>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-800" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-4 text-xs uppercase tracking-widest text-slate-500 dark:bg-[#111827] dark:text-slate-500">
                or
              </span>
            </div>
          </div>

          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-400">
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="email">
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-200"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary dark:border-slate-700 dark:bg-slate-900"
                />
                Remember me
              </label>
              <a className="text-sm font-medium text-primary hover:text-primary/80" href="/forgot-password">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading || !isLoaded}
              className="flex w-full items-center justify-center rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all duration-200 hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Sign in
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
            Don&apos;t have an account?{" "}
            <a className="font-bold text-primary hover:text-primary/80" href="/signup">
              Create one
            </a>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-600">
            By signing in, you agree to our{" "}
            <a className="underline hover:text-slate-400" href="#">
              Terms of Service
            </a>
            <br className="hidden sm:block" /> and{" "}
            <a className="underline hover:text-slate-400" href="#">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
