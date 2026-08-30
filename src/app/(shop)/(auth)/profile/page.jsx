"use client";

import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { User, Mail, Shield, LogOut, Package, ArrowRight, Loader2 } from "lucide-react";

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const authLoading = useAuthStore((s) => s.authLoading);
  const handleLogout = useAuthStore((s) => s.handleLogout);
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  if (authLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-neutral-400 animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-[85vh] bg-[#fafafa] py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        
        {/* Page Header */}
        <div className="mb-8">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
            Account Center
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-950 mt-1">
            My Profile
          </h1>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-3xl border border-neutral-200/80 p-6 sm:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.02)] space-y-8">
          
          {/* Avatar & Main Identity */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border border-neutral-200/80 overflow-hidden bg-neutral-100 shrink-0">
              {user.photo ? (
                <Image
                  src={user.photo}
                  alt={user.name || "User"}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-neutral-700">
                  {user.name?.[0]?.toUpperCase() || "U"}
                </div>
              )}
            </div>

            <div className="text-center sm:text-left flex-1 space-y-1">
              <h2 className="text-xl font-bold text-neutral-950">
                {user.name || "User"}
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500">{user.email}</p>
              <div className="pt-2 flex flex-wrap gap-2 justify-center sm:justify-start">
                <span className="px-2.5 py-1 rounded-md bg-neutral-100 text-neutral-800 text-[11px] font-medium uppercase tracking-wider">
                  {user.role === "admin" ? "Administrator" : "Verified Customer"}
                </span>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="border-t border-neutral-100 pt-6">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-4">
              Account Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-neutral-50/80 border border-neutral-100 space-y-1">
                <span className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider">
                  Full Name
                </span>
                <p className="text-sm font-medium text-neutral-900">{user.name || "—"}</p>
              </div>

              <div className="p-4 rounded-xl bg-neutral-50/80 border border-neutral-100 space-y-1">
                <span className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider">
                  Email Address
                </span>
                <p className="text-sm font-medium text-neutral-900 truncate">{user.email}</p>
              </div>

              <div className="p-4 rounded-xl bg-neutral-50/80 border border-neutral-100 space-y-1 sm:col-span-2">
                <span className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider">
                  User ID
                </span>
                <p className="text-xs font-mono text-neutral-600 truncate">{user.uid}</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="border-t border-neutral-100 pt-6">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-4">
              Quick Links
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link
                href="/track-order"
                className="flex items-center justify-between p-4 rounded-xl border border-neutral-200/80 hover:border-neutral-900 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <Package className="w-4 h-4 text-neutral-500 group-hover:text-neutral-950 transition-colors" />
                  <span className="text-xs font-medium text-neutral-800 group-hover:text-neutral-950">
                    Track Orders
                  </span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-neutral-950 group-hover:translate-x-0.5 transition-all" />
              </Link>

              {user.role === "admin" && (
                <Link
                  href="/admin"
                  className="flex items-center justify-between p-4 rounded-xl border border-neutral-200/80 hover:border-neutral-900 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <Shield className="w-4 h-4 text-neutral-500 group-hover:text-neutral-950 transition-colors" />
                    <span className="text-xs font-medium text-neutral-800 group-hover:text-neutral-950">
                      Admin Dashboard
                    </span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-neutral-950 group-hover:translate-x-0.5 transition-all" />
                </Link>
              )}
            </div>
          </div>

          {/* Logout Action */}
          <div className="border-t border-neutral-100 pt-6">
            <button
              onClick={handleLogout}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 h-11 rounded-xl bg-neutral-100 hover:bg-red-50 text-neutral-700 hover:text-red-600 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}