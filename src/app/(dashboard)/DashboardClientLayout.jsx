"use client";

import Sidebar from "@/components/Sidebar";
import "./admin.css";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { Search, ShoppingBag, Package } from "lucide-react";

function TopBar() {
  const { user } = useCart();
  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "AD";

  return (
    <header className="h-14 bg-white border-b border-slate-200 flex items-center px-5 gap-4 sticky top-0 z-20">
      {/* Search */}
      <div className="flex-1 max-w-sm relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
        <input
          type="text"
          placeholder="Search products, orders or customers..."
          className="w-full h-8 pl-8 pr-3 rounded-lg bg-slate-50 border border-slate-200 text-[13px] text-slate-700 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition"
        />
      </div>
      <div className="flex-1" />

      {/* Quick actions */}
      <Link
        href="/admin/manage-products"
        className="hidden sm:inline-flex items-center gap-1.5 h-8 px-3.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-[12px] font-semibold transition"
      >
        <Package className="w-3.5 h-3.5" /> Catalog
      </Link>
      <Link
        href="/admin/orders"
        className="inline-flex items-center gap-1.5 h-8 px-3.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[12px] font-bold transition shadow-sm shadow-blue-600/30"
      >
        <ShoppingBag className="w-3.5 h-3.5" /> Orders
      </Link>

      <div className="w-px h-5 bg-slate-200" />

      {/* User */}
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-[11px] font-bold shrink-0">
          {initials}
        </div>
        <div className="hidden sm:block">
          <p className="text-[12px] font-semibold text-slate-900 leading-tight">{user?.name || "Admin"}</p>
          <p className="text-[10px] text-slate-400 leading-tight">{user?.email || ""}</p>
        </div>
        <span className="hidden sm:inline text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-600 text-white tracking-wide">ADMIN</span>
      </div>
    </header>
  );
}

export default function DashboardClientLayout({ children }) {
  const { user, authLoading } = useCart();
  const router = useRouter();

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.replace("/login"); return; }
    if (user.role !== "admin") router.replace("/");
  }, [user, authLoading, router]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-sm text-slate-400">Checking access...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== "admin") return null;

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}