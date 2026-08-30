"use client";

import { useAuthStore } from "@/stores/authStore";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, ShieldCheck } from "lucide-react";

export default function Login() {
  const handleLogin = useAuthStore((s) => s.handleLogin);
  const handleGoogleLogin = useAuthStore((s) => s.handleGoogleLogin);
  const authError = useAuthStore((s) => s.authError);
  const authLoading = useAuthStore((s) => s.authLoading);
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError("");

    if (!email || !password) {
      setValidationError("Please fill in all fields");
      return;
    }

    const res = await handleLogin(email, password);
    if (res?.success) {
      Swal.fire({
        icon: "success",
        title: "Welcome back",
        text: "You have signed in successfully.",
        timer: 1500,
        showConfirmButton: false,
      });
      router.push(res.role === "admin" ? "/admin" : "/");
    }
  };

  const handleGoogleSignIn = async () => {
    const res = await handleGoogleLogin();
    if (res?.success) {
      router.push(res.role === "admin" ? "/admin" : "/");
    }
  };

  return (
    <div className="min-h-[85vh] bg-[#fafafa] flex items-center justify-center px-4 py-16 sm:py-24">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 border border-neutral-200/80 shadow-[0_4px_24px_rgba(0,0,0,0.03)]">
        
        {/* Brand / Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-neutral-100 text-neutral-900 mb-4">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-950">
            Welcome Back
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1.5 font-normal">
            Sign in to access your TechX account and orders
          </p>
        </div>

        {/* Error Alert */}
        {(validationError || authError) && (
          <div className="mb-6 px-4 py-3 rounded-xl bg-red-50/80 border border-red-200/80 text-red-600 text-xs font-medium flex items-center justify-center text-center">
            {validationError || authError}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-500 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full h-11 pl-10 pr-4 text-sm rounded-xl border border-neutral-200 bg-white text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-neutral-950 focus:ring-1 focus:ring-neutral-950 transition-all"
              />
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-[11px] font-medium text-neutral-500 hover:text-neutral-900 transition-colors"
              >
                Forgot?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-11 pl-10 pr-10 text-sm rounded-xl border border-neutral-200 bg-white text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-neutral-950 focus:ring-1 focus:ring-neutral-950 transition-all"
              />
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={authLoading}
            className="w-full h-11 mt-2 rounded-xl bg-[#09090b] hover:bg-neutral-800 text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed shadow-xs"
          >
            {authLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center justify-center my-6">
          <div className="w-full border-t border-neutral-200" />
          <span className="absolute bg-white px-3 text-[11px] font-medium uppercase tracking-wider text-neutral-400">
            or
          </span>
        </div>

        {/* Google Login */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={authLoading}
          className="w-full h-11 flex items-center justify-center gap-3 border border-neutral-200 rounded-xl bg-white hover:bg-neutral-50 transition text-xs font-medium text-neutral-700 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            className="w-4 h-4"
          >
            <path fill="#EA4335" d="M24 9.5c3.14 0 5.95 1.08 8.17 2.86l6.08-6.08C34.52 3.05 29.55 1 24 1 14.82 1 7.07 6.48 3.64 14.19l7.08 5.5C12.43 13.61 17.76 9.5 24 9.5z" />
            <path fill="#4285F4" d="M46.1 24.55c0-1.64-.15-3.22-.42-4.74H24v8.98h12.43c-.54 2.89-2.18 5.34-4.65 6.98l7.18 5.58C43.18 37.5 46.1 31.47 46.1 24.55z" />
            <path fill="#FBBC05" d="M10.72 28.31A14.57 14.57 0 0 1 9.5 24c0-1.5.26-2.95.72-4.31l-7.08-5.5A23.94 23.94 0 0 0 .5 24c0 3.87.93 7.52 2.64 10.72l7.58-6.41z" />
            <path fill="#34A853" d="M24 46.5c5.55 0 10.21-1.84 13.61-4.99l-7.18-5.58c-1.84 1.23-4.19 1.96-6.43 1.96-6.24 0-11.57-4.11-13.28-9.69l-7.58 6.41C7.07 41.52 14.82 46.5 24 46.5z" />
          </svg>
          <span>Continue with Google</span>
        </button>

        {/* Footer Link */}
        <p className="text-xs text-center text-neutral-500 mt-8">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="text-neutral-950 font-semibold hover:underline underline-offset-4"
          >
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}