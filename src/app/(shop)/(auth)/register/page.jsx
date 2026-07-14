"use client";

import { useAuthStore } from "@/stores/authStore";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function Register() {
  const handleRegister = useAuthStore((s) => s.handleRegister);
  const authError = useAuthStore((s) => s.authError);
  const authLoading = useAuthStore((s) => s.authLoading);
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [photoURL, setPhotoURL] = useState("");
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
        title: "Registration Successful",
        text: "Please login with your new account credentials.",
        timer: 2000,
        showConfirmButton: false,
      });
      router.push("/login");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md p-8 space-y-6 rounded-3xl bg-white text-gray-800 shadow-xl border border-gray-100">
        
        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-black text-center text-slate-900">Create Account</h1>
          <p className="text-sm text-slate-400 text-center mt-1">Join TechX-Shop today</p>
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
              Full Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="w-full h-11 px-4 text-sm rounded-2xl border border-slate-200 bg-slate-50 outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Email Address *
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
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Password *
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full h-11 px-4 text-sm rounded-2xl border border-slate-200 bg-slate-50 outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Profile Photo URL
            </label>
            <input
              type="url"
              value={photoURL}
              onChange={(e) => setPhotoURL(e.target.value)}
              placeholder="https://example.com/photo.jpg"
              className="w-full h-11 px-4 text-sm rounded-2xl border border-slate-200 bg-slate-50 outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={authLoading}
            className="w-full h-12 mt-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center justify-center shadow-lg shadow-indigo-100 transition-all disabled:opacity-60"
          >
            {authLoading ? "Registering..." : "Sign Up"}
          </button>
        </form>

        {/* LOGIN LINK */}
        <p className="text-xs text-center text-slate-400">
          Already have an account?{" "}
          <a href="/login" className="underline text-slate-900 font-semibold">
            Log in
          </a>
        </p>

      </div>
    </div>
  );
}
