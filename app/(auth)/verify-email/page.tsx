"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSignUp } from "@clerk/nextjs/legacy";
import { ToastContainer } from "@/components/auth/ToastContainer";
import { ChangeEmailModal } from "@/components/auth/ChangeEmailModal";
import { VerifyEmailCard } from "@/components/auth/VerifyEmailCard";

export default function VerifyEmailPage() {
  const router = useRouter();
  const { signUp, isLoaded, setActive } = useSignUp();
  const [resending, setResending] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [verifying, setVerifying] = useState(false);

  // Get the email from the in-progress sign-up, fallback for display
  const email = signUp?.emailAddress || "your email";

  const handleResend = async () => {
    if (resending || !isLoaded || !signUp) return;
    setResending(true);
    setToast(null);
    setError(null);
    try {
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setToast("Verification code resent");
    } catch (err: any) {
      setError(err.errors?.[0]?.longMessage || "Failed to resend. Please try again.");
    } finally {
      setResending(false);
    }
  };

  const handleVerify = async () => {
    if (!isLoaded || !signUp || !code.trim()) return;
    setVerifying(true);
    setError(null);
    try {
      const result = await signUp.attemptEmailAddressVerification({ code });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/create-workspace");
      } else {
        setError("Verification incomplete. Please try again.");
      }
    } catch (err: any) {
      const msg = err.errors?.[0]?.longMessage || err.errors?.[0]?.message || "Invalid verification code.";
      setError(msg);
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#0B0F17] px-4 py-10 text-slate-200">
      <div className="absolute inset-0 -z-10 overflow-hidden opacity-20">
        <div className="absolute -top-[10%] -right-[10%] h-[500px] w-[500px] rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute -bottom-[10%] -left-[10%] h-[500px] w-[500px] rounded-full bg-indigo-900/10 blur-[120px]" />
      </div>

      <div className="w-full max-w-[520px]">
        <VerifyEmailCard
          email={email}
          onContinue={handleVerify}
          onResend={handleResend}
          loadingResend={resending}
        >
          {/* Verification code input */}
          <div className="mt-6 space-y-3">
            <label className="text-sm font-medium text-slate-300">Enter verification code</label>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter the 6-digit code"
              className="w-full rounded-xl border border-white/10 bg-[#0B0F17]/50 px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              type="text"
              inputMode="numeric"
              maxLength={6}
              autoFocus
            />
            {error && (
              <p className="text-xs font-medium text-red-400">{error}</p>
            )}
          </div>

          <div className="mt-8 border-t border-white/10 pt-6 text-center">
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="text-sm font-semibold text-slate-400 underline underline-offset-4 transition hover:text-white"
            >
              Change email address
            </button>
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500">
              <a className="hover:text-slate-300" href="/login">
                Back to login
              </a>
            </div>
          </div>
        </VerifyEmailCard>
      </div>

      <ToastContainer message={toast} onClose={() => setToast(null)} />
      <ChangeEmailModal
        open={showModal}
        initialEmail={email}
        onClose={() => setShowModal(false)}
        onSave={() => {
          // Clerk doesn't support changing email mid-signup; close modal
          setShowModal(false);
          setToast("To use a different email, please start a new signup.");
        }}
      />
    </div>
  );
}
