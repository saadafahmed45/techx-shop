"use client";

import { useAuthStore } from "@/stores/authStore";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import Link from "next/link";
import { User, Mail, Lock, Image as ImageIcon, Eye, EyeOff, ArrowRight, Loader2, UserPlus } from "lucide-react";

export default function Register() {
  const handleRegister = useAuthStore((s) => s.handleRegister);
  const authError = useAuthStore((s) => s.authError);
  const authLoading = useAuthStore((s) => s.authLoading);
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError("");

    if (!name || !email || !password) {
      setValidationError("All required fields must be filled");
      return;
    }

    if (password.length < 6) {
      setValidationError("Password must be at least 6 characters long");
      return;
    }

    const res = await handleRegister(name, email, password, photoURL);
    if (res?.success) {
      Swal.fire({
        icon: "success",
        title: "Account Created",
        text: "Please sign in with your new account credentials.",
        timer: 2000,
        showConfirmButton: false,
      });
      router.push("/login");
    }
  };

  return (
    <div className="min-h-[85vh] bg-[#fafafa] flex items-center justify-center px-4 py-16 sm:py-24">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 border border-neutral-200/80 shadow-[0_4px_24px_rgba(0,0,0,0.03)]">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-neutral-100 text-neutral-900 mb-4">
            <UserPlus className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-950">
            Create Account
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1.5 font-normal">
            Join TechX Shop for exclusive tech & fast checkout
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
              Full Name *
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full h-11 pl-10 pr-4 text-sm rounded-xl border border-neutral-200 bg-white text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-neutral-950 focus:ring-1 focus:ring-neutral-950 transition-all"
              />
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-500 mb-1.5">
              Email Address *
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
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-500 mb-1.5">
              Password *
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
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

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-500 mb-1.5">
              Profile Photo URL (Optional)
            </label>
            <div className="relative">
              <input
                type="url"
                value={photoURL}
                onChange={(e) => setPhotoURL(e.target.value)}
                placeholder="https://example.com/avatar.jpg"
                className="w-full h-11 pl-10 pr-4 text-sm rounded-xl border border-neutral-200 bg-white text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-neutral-950 focus:ring-1 focus:ring-neutral-950 transition-all"
              />
              <ImageIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
            </div>
          </div>

          <button
            type="submit"
            disabled={authLoading}
            className="w-full h-11 mt-3 rounded-xl bg-[#09090b] hover:bg-neutral-800 text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed shadow-xs"
          >
            {authLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <span>Sign Up</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <p className="text-xs text-center text-neutral-500 mt-8">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-neutral-950 font-semibold hover:underline underline-offset-4"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
