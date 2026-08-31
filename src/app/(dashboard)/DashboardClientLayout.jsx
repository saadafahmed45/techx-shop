"use client";

import Sidebar from "@/components/Sidebar";
import "./admin.css";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardClientLayout({ children }) {
  const { user, authLoading } = useCart();
  const router = useRouter();

  useEffect(() => {
    if (authLoading) return; // Firebase/JWT still checking — wait

    if (!user) {
      router.replace("/login");
      return;
    }

    if (user.role !== "admin") {
      router.replace("/");
    }
  }, [user, authLoading, router]);

  // Loading state
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-400">Checking access…</p>
        </div>
      </div>
    );
  }

  // Not admin -> don't render (redirecting)
  if (!user || user.role !== "admin") {
    return null;
  }

  // Admin confirmed -> render dashboard
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1">{children}</main>
    </div>
  );
}
