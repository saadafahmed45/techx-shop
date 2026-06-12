"use client";

import Sidebar from "@/components/Sidebar";
import "./admin.css";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

// ✅ শুধু এই email admin হবে
const ADMIN_EMAIL = "mohammadhaolader1@gmail.com";

export default function DashboardLayout({ children }) {
  const { user, authLoading } = useCart();
  const router = useRouter();

  useEffect(() => {
    if (authLoading) return; // Firebase এখনো check করছে — wait করো

    if (!user) {
      // লগিন নেই → login page এ পাঠাও
      router.replace("/login");
      return;
    }

    if (user.email !== ADMIN_EMAIL) {
      // লগিন আছে কিন্তু admin না → home এ পাঠাও
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

  // Admin না হলে কিছু render করবে না (redirect হচ্ছে)
  if (!user || user.email !== ADMIN_EMAIL) {
    return null;
  }

  // ✅ Admin confirmed — dashboard দেখাও
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1">{children}</main>
    </div>
  );
}