"use client";

import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const authLoading = useAuthStore((s) => s.authLoading);
  const handleLogout = useAuthStore((s) => s.handleLogout);
  const router = useRouter();

  // লগিন না থাকলে login page এ পাঠাবে
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="py-24 bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-md overflow-hidden">

        {/* TOP BANNER */}
        <div className="h-24 bg-linear-to-r from-indigo-500 to-violet-500" />

        {/* AVATAR */}
        <div className="flex flex-col items-center -mt-12 px-6 pb-6 space-y-4">
          <div className="relative w-24 h-24 rounded-full border-4 border-white shadow-md overflow-hidden bg-slate-200">
            {user.photo ? (
              <Image
                src={user.photo}
                alt={user.name || "User"}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-indigo-500">
                {user.name?.[0]?.toUpperCase() || "U"}
              </div>
            )}
          </div>

          {/* USER INFO */}
          <div className="text-center space-y-1">
            <h2 className="text-xl font-bold text-slate-900">
              {user.name || "User"}
            </h2>
            <p className="text-sm text-slate-500">{user.email}</p>
          </div>

          {/* DETAILS CARD */}
          <div className="w-full bg-slate-50 rounded-xl p-4 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">User ID</span>
              <span className="text-slate-700 font-mono text-xs truncate max-w-40">
                {user.uid}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Name</span>
              <span className="text-slate-700">{user.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Email</span>
              <span className="text-slate-700">{user.email}</span>
            </div>
          </div>

          {/* LOGOUT BUTTON */}
          <button
            onClick={handleLogout}
            className="w-full py-3 rounded-xl bg-red-50 text-red-500 font-semibold hover:bg-red-100 transition text-sm"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}