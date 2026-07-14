"use client";

import { useAuthStore } from "@/stores/authStore";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import Link from "next/link";

export default function Login() {
  const handleLogin = useAuthStore((s) => s.handleLogin);
  const handleGoogleLogin = useAuthStore((s) => s.handleGoogleLogin);
  const authError = useAuthStore((s) => s.authError);
  const authLoading = useAuthStore((s) => s.authLoading);
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
        title: "Login Successful",
        timer: 1200,
        showConfirmButton: false,
      });
      router.push(res.role === "admin" ? "/admin" : "/");
    }
  };

  return (
    <div className="bg-gray-100 flex items-center justify-center px-4 py-14 md:py-18 ">
      <div className="w-full max-w-md p-8 space-y-6 rounded-3xl bg-white text-gray-800 shadow-xl border border-gray-100">
        
        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-black text-center text-slate-900">Welcome Back</h1>
          <p className="text-sm text-slate-400 text-center mt-1">Sign in to your account</p>
        </div>

        {/* ERROR SUMMARY */}
        {(validationError || authError) && (
          <p className="text-sm text-red-500 text-center bg-red-50 border border-red-200 rounded-2xl py-3 px-4">
            {validationError || authError}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full h-11 px-4 text-sm rounded-2xl border border-slate-200 bg-slate-50 outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                Password
              </label>
              <a href="/forgot-password" className="text-xs text-indigo-600 hover:underline">
                Forgot password?
              </a>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full h-11 px-4 text-sm rounded-2xl border border-slate-200 bg-slate-50 outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={authLoading}
            className="w-full h-12 mt-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center justify-center shadow-lg shadow-indigo-100 transition-all disabled:opacity-60 cursor-pointer"
          >
            {authLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* DIVIDER */}
        <div className="flex items-center space-x-1 py-1">
          <div className="flex-1 h-px bg-slate-200" />
          <p className="px-3 text-xs text-slate-400">or</p>
          <div className="flex-1 h-px bg-slate-200" />
        </div>

        {/* GOOGLE BUTTON */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={authLoading}
          className="w-full flex items-center justify-center gap-3 border border-slate-200 rounded-2xl py-3 px-4 bg-white hover:bg-slate-50 transition text-sm font-semibold text-slate-700 shadow-xs disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            className="w-5 h-5"
          >
            <path fill="#EA4335" d="M24 9.5c3.14 0 5.95 1.08 8.17 2.86l6.08-6.08C34.52 3.05 29.55 1 24 1 14.82 1 7.07 6.48 3.64 14.19l7.08 5.5C12.43 13.61 17.76 9.5 24 9.5z" />
            <path fill="#4285F4" d="M46.1 24.55c0-1.64-.15-3.22-.42-4.74H24v8.98h12.43c-.54 2.89-2.18 5.34-4.65 6.98l7.18 5.58C43.18 37.5 46.1 31.47 46.1 24.55z" />
            <path fill="#FBBC05" d="M10.72 28.31A14.57 14.57 0 0 1 9.5 24c0-1.5.26-2.95.72-4.31l-7.08-5.5A23.94 23.94 0 0 0 .5 24c0 3.87.93 7.52 2.64 10.72l7.58-6.41z" />
            <path fill="#34A853" d="M24 46.5c5.55 0 10.21-1.84 13.61-4.99l-7.18-5.58c-1.84 1.23-4.19 1.96-6.43 1.96-6.24 0-11.57-4.11-13.28-9.69l-7.58 6.41C7.07 41.52 14.82 46.5 24 46.5z" />
          </svg>
          Continue with Google
        </button>

        {/* SIGNUP LINK */}
        <p className="text-xs text-center text-slate-400">
          Don't have an account?{" "}
          <Link href="/register" className="underline text-slate-900 font-semibold">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}