"use client";

import { useCart } from "@/context/CartContext";
import { useState } from "react";


export default function Login() {
 
 const {handleGoogleLogin, authError,authLoading}= useCart()
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-md p-8 space-y-6 rounded-xl bg-gray-50 text-gray-800 shadow-md">

        {/* HEADER */}
        <h1 className="text-2xl font-bold text-center">Login</h1>

        {/* ERROR */}
        {authError && (
          <p className="text-sm text-red-500 text-center bg-red-50 border border-red-200 rounded-md py-2 px-3">
            {authError}
          </p>
        )}

        {/* DIVIDER */}
        <div className="flex items-center space-x-1">
          <div className="flex-1 h-px bg-gray-300" />
          <p className="px-3 text-sm text-gray-500">Continue with</p>
          <div className="flex-1 h-px bg-gray-300" />
        </div>

        {/* GOOGLE BUTTON */}
        <button
          onClick={handleGoogleLogin}
          disabled={authLoading}
          className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-lg py-3 px-4 bg-white hover:bg-gray-50 transition text-sm font-medium text-gray-700 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {/* Google Icon */}
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
          {authLoading ? "Signing in..." : "Continue with Google"}
        </button>

        {/* SIGNUP LINK */}
        <p className="text-xs text-center text-gray-500">
          Don't have an account?{" "}
          <a href="/register" className="underline text-gray-800 font-medium">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}