"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import {
  LayoutDashboard, ShoppingBag, Package, Plus, Menu, X,
  Layers3, Users, ShieldCheck, ImageIcon, ExternalLink, ListOrdered,
} from "lucide-react";
import { useCart } from "@/context/CartContext";

const menuGroups = [
  {
    label: null,
    items: [
      { href: "/admin",                    label: "Overview",          icon: LayoutDashboard, exact: true },
      { href: "/admin/manage-products",    label: "Products",          icon: Package },
      { href: "/admin/manage-collections", label: "Categories",        icon: Layers3 },
      { href: "/admin/orders",             label: "Orders",            icon: ShoppingBag },
    ],
  },
  {
    label: "Accounts & Staff",
    items: [
      { href: "/admin/users",  label: "User Management",   icon: Users },
      { href: "/admin/admins", label: "Admin Management",  icon: ShieldCheck },
    ],
  },
  {
    label: "Hero Slider",
    items: [
      { href: "/admin/add-hero-slider",      label: "Add Slider",      icon: Plus },
      { href: "/admin/manage-hero-sliders",  label: "Manage Sliders",  icon: ImageIcon },
    ],
  },
  {
    label: "Products",
    items: [
      { href: "/admin/add-products", label: "Add Product", icon: Plus },
      { href: "/admin/order-list",   label: "Order List",  icon: ListOrdered },
    ],
  },
  {
    label: "Collections",
    items: [
      { href: "/admin/add-collections", label: "Add Collection", icon: Plus },
    ],
  },
];

const Sidebar = () => {
  const pathname  = usePathname();
  const { user }  = useCart();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (href, exact = false) => {
    if (exact) return pathname === href;
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle sidebar"
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 bg-[#0f172a] rounded-xl shadow-lg flex items-center justify-center hover:bg-[#1e293b] transition border border-white/10"
      >
        {isOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-30" onClick={closeSidebar} />
      )}

      {/* Sidebar panel */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen z-40 w-[220px] shrink-0 bg-[#0f172a] text-white flex flex-col transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Brand */}
        <div className="px-4 py-5 border-b border-white/[0.07]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-md shadow-blue-900/60 shrink-0">
              <span className="text-white text-xs font-black">TX</span>
            </div>
            <div>
              <h1 className="text-[13px] font-bold text-white leading-tight">TechX Admin</h1>
              <p className="text-[10px] text-blue-400 mt-0.5 font-medium uppercase tracking-wide">Super Admin</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-2.5 space-y-4">
          {menuGroups.map((group, gi) => (
            <div key={gi}>
              {group.label && (
                <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest px-2 mb-1">
                  {group.label}
                </p>
              )}
              <ul className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon   = item.icon;
                  const active = isActive(item.href, item.exact);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={closeSidebar}
                        className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] font-medium transition-all duration-150 ${
                          active
                            ? "bg-blue-600 text-white shadow-sm shadow-blue-900/40"
                            : "text-slate-400 hover:bg-white/[0.06] hover:text-white"
                        }`}
                      >
                        <Icon className={`w-4 h-4 shrink-0 ${active ? "text-white" : "text-slate-600"}`} />
                        <span className="truncate">{item.label}</span>
                        {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white/60 shrink-0" />}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Catalog promo card */}
        <div className="px-2.5 pb-2">
          <div className="bg-blue-600/10 border border-blue-500/20 rounded-xl p-3.5">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-6 h-6 rounded-md bg-blue-600/20 flex items-center justify-center">
                <Package className="w-3 h-3 text-blue-400" />
              </div>
              <p className="text-[12px] font-semibold text-white">TechX Catalog</p>
            </div>
            <p className="text-[10px] text-slate-500 leading-relaxed mb-2.5">
              Manage your products, collections and sliders.
            </p>
            <Link
              href="/admin/manage-products"
              onClick={closeSidebar}
              className="w-full flex items-center justify-center py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold transition-colors"
            >
              Manage Products
            </Link>
          </div>
        </div>

        {/* Storefront link */}
        <div className="px-2.5 pb-4 pt-1">
          <Link
            href="/"
            onClick={closeSidebar}
            className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-[12px] text-slate-600 hover:text-white hover:bg-white/[0.05] transition-all"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Storefront</span>
          </Link>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;